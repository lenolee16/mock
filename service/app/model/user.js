'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 记录id
    userId: { type: INTEGER }, // 用户id
    userName: { type: STRING(255) }, // 用户名
    password: { type: STRING(255) }, // 密码
    created_at: { type: DATE, defaultValue: NOW }, // 创建时间
    updated_at: { type: DATE, defaultValue: NOW }, // 更新时间
  }, {
    freezeTableName: true, // 不自动将表名添加复数
  });

  return User;
};
