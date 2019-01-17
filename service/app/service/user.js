'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

class UserService extends Service {
  async list(query) {
    const { ctx } = this;
    return await ctx.model.User.findAll({
      where: query,
      order: [[ 'created_at', 'DESC' ]],
    });
  }
  async login(user) {
    const { app } = this;

    const existUser = await this.getUserByName(user.userName);

    // 用户不存在
    if (!existUser) {
      return null;
    }

    const passhash = existUser.password;
    // TODO: change to async compare
    const equal = passhash === user.password;
    // 密码不匹配
    if (!equal) {
      return false;
    }

    // 验证通过
    const token = jwt.sign({ userId: existUser.userId }, app.config.jwtSecret, { expiresIn: '7d' });
    return token;
  }
  async register(user) {
    const { ctx } = this;
    // 添加uuid
    user.userId = uuid.v4().replace(/-/g, '');
    // 是否可以查询到
    const queryResult = await this.hasRegister(user.userName);
    if (queryResult) {
      ctx.returnBody(200, '用户名已被使用', {
        flag: false,
      });
      return;
    }

    const userInfo = await this.ctx.model.User.create(user);
    // 注册成功，返回userid给前端
    ctx.status = 200;
    ctx.returnBody(200, '注册成功', {
      userId: userInfo.dataValues.userId,
      flag: true,
    });
    return userInfo.dataValues;
  }
  async queryCurrent(userId) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({
      where: { userId },
    });
    if (!user) {
      return false;
    }
    return { userId: user.userId, userName: user.userName, avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' };
  }
  async hasRegister(userName) {
    // 查询用户名
    const user = await this.ctx.model.User.findOne({
      where: { userName },
    });

    if (user && user.dataValues.userId) {
      return true;
    }

    return false;
  }
  async getUserByName(userName) {
    return this.ctx.model.User.findOne({
      where: {
        userName,
      },
    });
  }
  async getUserByToken() {
    const { app, ctx } = this;
    const token = ctx.cookies.get('token');
    const user = jwt.decode(token, app.config.jwtSecret);
    return user;
  }
}

module.exports = UserService;
