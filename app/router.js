'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 爬虫
  router.get('/api/v1/spider/url', controller.spider.url.default);
  router.get('/api/v1/spider/novel', controller.spider.novel.default);
  // 图片解析
  router.get('/img/:key', controller.website.img.default);
  // 网站
  router.get('/', controller.website.index.default);
};
