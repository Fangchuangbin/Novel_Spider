'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/getBookURL', controller.getBookURL.default);
  router.get('/getBookMain', controller.getBookMain.default);
  router.get('/getContent', controller.getContent.default);
};
