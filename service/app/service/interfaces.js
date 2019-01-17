'use strict';

const Service = require('egg').Service;

class InterfacesService extends Service {
  async queryList(query) {
    const { ctx } = this;
    return await ctx.model.Interface.findAll({
      where: query,
      include: [{
        model: ctx.model.Project,
        attributes: [ 'projectId', 'projectPath', 'projectTitle' ],
      }],
      order: [[ 'created_at', 'DESC' ]],
    });
  }
  async insertInterface(params) {
    const { ctx } = this;
    const project = await ctx.model.Project.findById(params.projectId);
    if (!project) {
      ctx.returnBody(422, '不存在该projectId', {
        flag: false,
      });
      return;
    }
    params.projectTitle = project.projectTitle;
    return await ctx.model.Interface.create(params);
  }
  async updateInterface(params) {
    const { ctx } = this;
    const project = await ctx.model.Project.findById(params.projectId);
    if (!project) {
      ctx.returnBody(422, '不存在该projectId', {
        flag: false,
      });
      return;
    }
    const Interface = await ctx.model.Interface.findById(params.interfaceId);
    if (!Interface) {
      ctx.returnBody(422, '不存在该接口id', {
        flag: false,
      });
      return;
    }
    return await Interface.update(params);
  }
  async deleteInterface(id) {
    const { ctx } = this;
    const Interface = await ctx.model.Interface.findById(id);
    if (!Interface) {
      ctx.returnBody(422, '不存在该项目', {
        flag: false,
      });
      return;
    }
    return await Interface.destroy();
  }
  async queryInterfaceByPath(path) {
    const { ctx } = this;
    const Interface = await ctx.model.Interface.findOne({
      where: { interfacePath: path },
    });
    if (!Interface) {
      return false;
    }
    return Interface;
  }
  async queryInterfaceCountById(projectId) {
    const { ctx } = this;
    const Interface = await ctx.model.Interface.count({
      where: { projectId },
    });
    return Interface;
  }
}

module.exports = InterfacesService;
