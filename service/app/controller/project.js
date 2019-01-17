'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async list() {
    const { ctx } = this;
    const query = ctx.queryBody(ctx.query);
    const projectList = await ctx.service.project.queryList(query);
    const data = {
      list: projectList || [],
      pagination: {
        total: projectList.count,
      },
    };
    ctx.returnBody(200, '成功', data);
  }
  async add() {
    const { ctx } = this;
    const { projectTitle, projectContent, projectPath } = ctx.request.body;
    const { userId } = await ctx.service.user.getUserByToken();

    const projectData = {
      projectTitle,
      projectContent,
      projectPath,
      userId,
      status: 1,
    };
    await ctx.service.project.insertProject(projectData);
    ctx.returnBody(200, '添加成功');
  }
  async update() {
    const { ctx } = this;
    const { projectTitle, projectContent, projectPath, projectId } = ctx.request.body;
    const { userId } = await ctx.service.user.getUserByToken();
    const projectData = {
      projectTitle,
      projectContent,
      projectPath,
      projectId,
      userId,
      status: 1,
    };
    await ctx.service.project.updateProject(projectData);
    ctx.returnBody(200, '修改成功');
  }
  async delete() {
    const { ctx } = this;
    const { projectId } = ctx.request.body;
    await ctx.service.project.deleteProject(projectId);
    ctx.returnBody(200, '删除成功');
  }
}

module.exports = ProjectController;
