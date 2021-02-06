'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/getNovelURL', controller.getNovelURL.default);
  router.get('/getNovelContent', controller.getNovelContent.default);
  router.post('/getNovelChapter', controller.getNovelChapter.default);
};
