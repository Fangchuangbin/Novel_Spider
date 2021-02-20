'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 爬虫
  router.get('/api/v1/spider/url', controller.spider.url.default);
  router.get('/api/v1/spider/novel', controller.spider.novel.default);
  // 网站
  router.get('/', controller.website.index.default);
  router.get('/list_:idAndPage/', controller.website.list.default);
  router.get('/book_:id/', controller.website.book.default);
  router.get('/book_:id/:chapter', controller.website.book.default);
};
