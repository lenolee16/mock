'use strict';

const Controller = require('egg').Controller;
const Mock = require('mockjs');

class ApiController extends Controller {
  async fetch() {
    const { ctx } = this;
    const { method } = ctx;
    const { 0: projectPath, 1: interfacePath } = ctx.params;
    if (!interfacePath) {
      return ctx.returnBody(400, { msg: '找不到该项目' });
    }
    const project = await ctx.service.project.queryProjectByPath(`/${projectPath}`);
    if (!project) {
      return ctx.returnBody(400, { msg: '找不到该项目' });
    }
    const interfaces = await ctx.service.interfaces.queryInterfaceByPath(`/${interfacePath}`);
    if (!interfaces) {
      return ctx.returnBody(400, { msg: '找不到接口' });
    }
    if (interfaces.method !== method.toLocaleLowerCase()) {
      return ctx.returnBody(400, { msg: '错误的请求方式' });
    }
    if (interfaces.dataType === 'mockjs') {
      const mockdata = Mock.mock(JSON.parse(interfaces.interfaceData));
      console.log(mockdata);
      return ctx.returnApi(200, mockdata);
    }
    return ctx.returnApi(200, JSON.parse(interfaces.interfaceData));
  }
}

module.exports = ApiController;
