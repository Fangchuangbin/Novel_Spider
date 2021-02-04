/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1611733410767_5945';

  // add your middleware config here
  config.middleware = [];

  // 资源配置
  config.static = {
    prefix: '/',
    buffer: false,
    preload: false
  };

  // 数据库配置
  config.mysql = {
    client: {
      host: '120.78.188.217',
      port: '3306',
      user: 'novel_eggjs',
      password: 'qiVhQcLct1hx',
      database: 'novel_eggjs',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  //跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};