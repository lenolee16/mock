export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/project/list' },
      {
        path: '/project',
        name: '项目',
        icon: 'profile',
        routes: [
          {
            path: '/project/list',
            name: '项目列表',
            component: './Project/list/index.js',
            hideChildrenInMenu: true,
          },
          {
            path: '/project/list/:id?',
            name: '项目配置',
            component: './Project/list/$id$.js',
            hideInMenu: true
          }
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
