'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Project = app.model.define('project', {
    projectId: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 项目id
    userId: { type: INTEGER }, // 用户id
    projectTitle: { type: STRING(30) }, // 项目标题
    projectType: { type: STRING(20) }, // 项目类型
    projectPath: { type: STRING(100) }, // 项目目录
    projectContent: { type: STRING(255), allowNull: true }, // 项目内容
    status: { type: INTEGER }, // 状态
    created_at: { type: DATE, defaultValue: NOW }, // 创建时间
    updated_at: { type: DATE, defaultValue: NOW }, // 更新时间
  }, {
    freezeTableName: true, // 不自动将表名添加复数
  });
  Project.associate = function() {
    app.model.Project.hasMany(app.model.Interface, { foreignKey: 'projectId' });
  };
  return Project;
};
