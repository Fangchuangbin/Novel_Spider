'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/getBook', controller.getBook.default);
  router.get('/getChapter', controller.getChapter.default);
};
