'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { auth, user, project, interfaces, api } = controller;
  const apiPath = /^\/api\/(\w+)\/([\w|\/]+)/;
  router.get('/', controller.home.index);

  router.get('/project', project.list);
  router.post('/project', project.add);
  router.put('/project', project.update);
  router.delete('/project', project.delete);

  router.get('/interface', interfaces.list);
  router.post('/interface', interfaces.add);
  router.put('/interface', interfaces.update);
  router.delete('/interface', interfaces.delete);

  router.get(apiPath, api.fetch);
  router.post(apiPath, api.fetch);
  router.put(apiPath, api.fetch);
  router.delete(apiPath, api.fetch);

  router.post('/register', auth.register);
  router.post('/login', auth.loginIn);

  router.get('/currentUser', user.queryCurrent);
};
