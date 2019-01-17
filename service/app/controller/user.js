'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async list() {
    const { ctx } = this;
    const userList = await ctx.service.user.queryList({});
    ctx.returnBody(200, '成功', userList);
  }
  async queryCurrent() {
    const { ctx } = this;
    const DATA = await ctx.service.user.getUserByToken();
    if (!DATA) {
      return ctx.returnBody(401, '请重新登录', {
        flag: false,
      });
    }
    const userId = DATA.userId;
    const user = await ctx.service.user.queryCurrent(userId);
    if (user) {
      ctx.returnBody(200, '成功', user);
    }
  }
}

module.exports = UserController;
