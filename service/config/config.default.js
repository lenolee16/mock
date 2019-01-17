'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1546829091078_569';

  // add your config here
  config.middleware = [];

  config.jwtSecret = 'leno';


  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:7000', 'http://127.0.0.1:7000' ],
  };

  config.authWhiteList = [ '/login', '/register', /^\/api\/(\w+)\/([\w|\/]+)/ ];

  // cookie name config
  config.auth_cookie_name = 'token';

  return config;
};
