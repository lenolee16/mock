'use strict';

const Controller = require('egg').Controller;
const methods = [ 'get', 'post', 'put', 'delete' ];
const dataTypes = [ 'json', 'mockjs' ];

class InterfacesController extends Controller {
  async list() {
    const { ctx } = this;
    const query = ctx.queryBody(ctx.query);
    const interfaceList = await ctx.service.interfaces.queryList(query);
    const data = {
      list: interfaceList || [],
      pagination: {},
    };
    ctx.returnBody(200, '成功', data);
  }
  async add() {
    const { ctx } = this;
    const { projectId, interfacePath, interfaceDesc, interfaceData, method, dataType } = ctx.request.body;
    const { userId } = await ctx.service.user.getUserByToken();
    if (!methods.includes(method)) {
      return ctx.returnErrorBody(`不存在${method}接口方式`);
    }
    if (!dataTypes.includes(dataType)) {
      return ctx.returnErrorBody(`不存在${dataType}数据类型`);
    }
    if (dataType === 'mockjs' && !ctx.testMock(interfaceData)) {
      return ctx.returnErrorBody('错误的mock数据');
    }
    const projectData = {
      projectId,
      interfacePath,
      interfaceDesc,
      interfaceData,
      method,
      dataType,
      userId,
      status: 1,
    };
    await ctx.service.interfaces.insertInterface(projectData);
    ctx.returnBody(200, '添加成功');
  }
  async update() {
    const { ctx } = this;
    const { projectId, interfaceId, interfacePath, interfaceDesc, interfaceData, method, dataType } = ctx.request.body;
    const { userId } = await ctx.service.user.getUserByToken();
    if (!methods.includes(method)) {
      return ctx.returnErrorBody(`不存在${method}接口方式`);
    }
    if (!dataTypes.includes(dataType)) {
      return ctx.returnErrorBody(`不存在${dataType}数据类型`);
    }
    if (dataType === 'mockjs' && !ctx.testMock(interfaceData)) {
      return ctx.returnErrorBody('错误的mock数据');
    }
    const projectData = {
      projectId,
      interfaceId,
      interfacePath,
      interfaceDesc,
      interfaceData,
      method,
      dataType,
      userId,
      status: 1,
    };
    await ctx.service.interfaces.updateInterface(projectData);
    ctx.returnBody(200, '修改成功');
  }
  async delete() {
    const { ctx } = this;
    const { projectId } = ctx.request.body;
    await ctx.service.interfaces.deleteInterface(projectId);
    ctx.returnBody(200, '删除成功');
  }
}

module.exports = InterfacesController;
