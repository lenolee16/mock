
## 简介

> 打造一个MOCK服务器! 支持JSON数据或者Mockjs方法。

> 技术栈

- react全家桶
- ant design Pro
- egg.js
- mysql

前后端分离开发模式，前端项目与后端项目属于不同的工程

```javascript
// mock/client 前端工程
// mock/service 后端工程
```


> 如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

## 部分功能截图

> 添加项目

项目目录 指的是 接口的一级目录（例如：http://localhost:7001/mock/getData/a 中的 /mock）

<img src="https://github.com/lenolee16/mock/raw/master/doc/addProject.png" width="665" height="369"/> 

> 配置项目接口

接口连接 指的是一级目录后的连接  （例如：http://localhost:7001/mock/getData/a 中的 /getData/a）
支持JSON数据类型，和mockjs数据类型，主要使用双引号；

<img src="https://github.com/lenolee16/mock/raw/master/doc/settingProject.png" width="665" height="369">

<img src="https://github.com/lenolee16/mock/raw/master/doc/addInterface.png" width="665" height="369">

<img src="https://github.com/lenolee16/mock/raw/master/doc/addInterface2.png" width="665" height="369">

> 测试接口

因为在egg里监听^/api路由做mock服务，所以最终的访问的mock请求连接要加上/api前缀。（http://localhost:7001/api/mock/getData/a）;

<img src="https://github.com/lenolee16/mock/raw/master/doc/testing.png" width="665" height="369">




## 运行项目

因前后端不同端口原因，为解决跨域。前端工程启动了devServer，需先启动后端工程

* git clone https://github.com/lenolee16/mock.git
* cd mock

> 运行后端项目

* 请确保本地已装mysql，并配置全局变量
* mysql -u root -p 并输入数据库密码
* create database mock; 创建mock数据库
* use mock;  切换数据库
* source mock.sql的绝对路径; 例如：source {当前目录}/db/mock.sql;
* 配置egg.js连接数据库信息

```javascript
// 前往service/config/config.local.js，配置你的数据库信息
config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'mock',
    username: '', 
    password: '', 
    operatorsAliases: false
};
```



* 在/service文件下
* npm install
* npm run dev


> 运行前端项目

* cd client
* npm install
* npm start


> 如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^