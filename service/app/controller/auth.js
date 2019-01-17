'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async register() {
    const { ctx } = this;
    const { password, userName } = ctx.request.body;
    // 错误处理
    // if (!this.__errNotice) return;
    // 注册成功返回体
    await ctx.service.user.register({ password, userName });

  }
  async loginIn() {
    const { ctx } = this;
    const { password, userName } = ctx.request.body;
    const token = await ctx.service.user.login({ password, userName });
    if (token) {
      // id存入Cookie, 用于验证过期.
      const opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        // maxAge: 1000 * 40,
        // signed: true,
      };
      ctx.cookies.set(this.config.auth_cookie_name, token, opts); // cookie 有效期30天
      ctx.returnBody(200, '登录成功', { currentAuthority: userName });
    } else {
      ctx.returnBody(200, '用户名或密码错误', {}, false);
    }
  }
}

module.exports = AuthController;
