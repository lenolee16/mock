'use strict';


module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, TEXT } = app.Sequelize;

  const Interface = app.model.define('interface', {
    interfaceId: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 项目id
    projectId: { type: INTEGER }, // 用户id
    projectTitle: { type: STRING(30) }, // 项目标题
    userId: { type: INTEGER }, // 用户id
    interfacePath: { type: STRING(100) }, // 接口连接
    interfaceDesc: { type: STRING(255), allowNull: true }, // 接口描述
    interfaceData: { type: TEXT }, // 接口内容
    method: { type: STRING(10) }, // 接口方式
    dataType: { type: STRING(10) }, // 数据类型
    status: { type: INTEGER }, // 状态
    created_at: { type: DATE, defaultValue: NOW }, // 创建时间
    updated_at: { type: DATE, defaultValue: NOW }, // 更新时间
  }, {
    freezeTableName: true, // 不自动将表名添加复数
  });
  Interface.associate = function() {
    app.model.Interface.belongsTo(app.model.Project, { foreignKey: 'projectId' });
  };
  return Interface;
};
