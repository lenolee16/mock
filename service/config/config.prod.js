'use strict';

module.exports = () => {
  const config = {};

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'mock',
    username: 'root',
    password: 'password',
    dialectOptions: {
      charset: 'utf8mb4',
    },
  };
  return config;
};
