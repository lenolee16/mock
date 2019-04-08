'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {
  async queryList(query) {
    const { ctx, app } = this;
    if (query.projectTitle) {
      query.projectTitle = {
        [app.Sequelize.Op.like]: `%${query.projectTitle}%`,
      };
    }
    return await ctx.model.Project.findAll({
      where: query,
      attributes: [ 'project.*', [ app.Sequelize.fn('COUNT', app.Sequelize.col('interfaces.interfaceId')), 'interfaceCount' ]],
      group: [ 'project.projectId' ],
      raw: true,
      include: [
        {
          model: ctx.model.Interface,
          attributes: [],
          duplicating: false,
        },
      ],
      order: [[ 'created_at', 'DESC' ]],
    });
  }
  async insertProject(params) {
    const { ctx } = this;
    return await ctx.model.Project.create(params);
  }
  async updateProject(params) {
    const { ctx } = this;
    const project = await ctx.model.Project.findById(params.projectId);
    if (!project) {
      ctx.returnBody(422, '不存在该项目', {
        flag: false,
      });
      return;
    }
    return await project.update(params);
  }
  async deleteProject(id) {
    const { ctx } = this;
    const project = await ctx.model.Project.findById(id);
    if (!project) {
      ctx.returnBody(422, '不存在该项目', {
        flag: false,
      });
      return;
    }
    return await project.destroy();
  }
  async queryProjectByPath(path) {
    const { ctx } = this;
    const project = await ctx.model.Project.findOne({
      where: { projectPath: path },
    });
    if (!project) {
      return false;
    }
    return project;
  }
}

module.exports = ProjectService;
