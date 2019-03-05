'use strict';

const Controller = require('egg').Controller;
const Mock = require('mockjs');

class ApiController extends Controller {
  async fetch() {
    const { ctx } = this;
    const { method } = ctx;
    const { 0: projectPath, 1: interfacePath } = ctx.params;
    console.log(ctx.params);
    if (!interfacePath) {
      return ctx.returnBody(400, { msg: '找不到该项目' });
    }
    let project = await ctx.service.project.queryProjectByPath(`/${projectPath}`);
    if (!project) {
      const projectFull = await ctx.service.project.queryProjectByPath(`/${projectPath}/${interfacePath}`); // 判断是否是全路径的中间服务
      if (projectFull) {
        project = projectFull;
      } else {
        return ctx.returnBody(400, { msg: '找不到该项目' });
      }
    }
    let interfaces;
    if (project.projectType === 'restfulApi') {
      interfaces = await ctx.service.interfaces.queryInterfaceByPath(`/${interfacePath}`);
    } else {
      if (ctx.search.includes('?')) {
        const path = ctx.search.substr(1);
        interfaces = await ctx.service.interfaces.queryInterfaceByPath(path);
      } else {
        return ctx.returnBody(400, { msg: '缺少code参数' });
      }
    }
    if (!interfaces) {
      return ctx.returnBody(400, { msg: '找不到接口' });
    }
    if (interfaces.method !== method.toLocaleLowerCase()) {
      return ctx.returnBody(400, { msg: '错误的请求方式' });
    }
    if (interfaces.dataType === 'mockjs') {
      const mockdata = Mock.mock(JSON.parse(interfaces.interfaceData));
      return ctx.returnApi(200, mockdata);
    }
    return ctx.returnApi(200, JSON.parse(interfaces.interfaceData));
  }
}

module.exports = ApiController;
