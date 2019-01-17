'use strict';
const Mock = require('mockjs');
// 扩展一些框架便利的方法
module.exports = {
  /**
   * 返回客户端内容
   * @param {number} status // 返回状态
   * @param {string} message // 返回内容
   * @param {object} data // 返回内容
   * @param {object} state // 状态
   */
  returnBody(status, message, data = {}, state = true) {
    this.status = status;
    this.body = {
      data,
      message,
      status: state,
    };
  },
  /**
   * 返回客户端错误信息
   * @param {string} message // 返回内容
   */
  returnErrorBody(message) {
    this.status = 200;
    this.body = {
      data: {},
      message,
      status: false,
    };
  },
  /**
   * 返回API内容
   * @param {number} status // 返回状态
   * @param {object} data // 返回内容
   */
  returnApi(status, data) {
    this.status = status;
    this.body = data;
  },
  /**
   * 驼峰转下划线
   * @param {object} obj // 转换对象
   * @return {object} newObj // 返回转换完成的新对象
   */
  humpToUnderline(obj) {
    const newKey = obj.keys();
    const newObj = {};
    const humpReg = /([A-Z])/g;

    newKey.forEach(item => {
      newObj[item.replace(humpReg, '_$1').toLowerCase()] = obj[item];
    });
    return newObj;
  },
  /**
   * 格式化查询参数
   * @param {object} obj // 转换对象
   * @return {object} newObj // 返回转换完成的新对象
   */
  queryBody(obj = {}) {
    const newKey = Object.keys(obj);
    const newObj = {};
    newKey.forEach(item => {
      if (obj[item] !== null && obj[item] !== undefined && obj[item] !== '') {
        newObj[item] = obj[item];
      }
    });
    return newObj;
  },
  /**
   * 格式化查询参数
   * @param {string} data // 转换对象
   * @return {boolean} boolean // 返回mock是否正确
   */
  testMock(data) {
    try {
      const _mock = Mock.mock(JSON.parse(data));
      if (_mock) return true;
      return false;
    } catch (e) {
      return false;
    }
  },
};
