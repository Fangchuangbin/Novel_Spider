'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');

//章节
class getNovelContentController extends Controller {
  async default() {
    const { ctx } = this;
    const targetURL = this.config.basic.target.url;
    const getNovelURL = await ctx.curl(ctx.request.host + '/getNovelURL', {
      dataType: 'json',
      timeout: 10000
    });
    if(getNovelURL.status !== 200) {
      console.log('ERROR => STATUS:' + getNovelURL.status + ' => TIME:' + moment().format('YYYY-MM-DD hh:mm:ss') + ' => HOST:' + ctx.request.host + ' => URL:' + ctx.request.url)
    }else{
      const spiderPromise = new Promise((resolve, reject) => {
        var c = new Crawler({
          maxConnections : 1,
          rateLimit: 2000,
          callback: function (error, response, done) {
            var spiderData = { uri: null, name: null, written: null, update_status: null, writer: null, category: null, description: null, chapter: [] };
            var spiderChapter = [];
            if(error) {
              console.log(error);
              reject(error);
            }else{
              var $ = response.$;
              $('.book_list').find('ul').eq(1).find('a').each(function() {
                const url = $(this).attr('href');
                const name = $(this).text();
                const chapterMerge = { url, name };
                if(chapterMerge.url.indexOf('.html') !== -1) {
                  chapterMerge.url = url.replace('.html', '');
                  spiderChapter[0] = chapterMerge;
                  spiderData.chapter = spiderData.chapter.concat(spiderChapter);
                }
              })
              spiderData.uri = response.options.uri.replace(targetURL, ''); // 源
              spiderData.name = $('.book_info').find('img').attr('alt'); // 书面
              spiderData.written = $('.book_info').find('img').attr('src'); // 封面
              spiderData.update_status = $('.book_info').find('span').attr('class'); // 状态
              spiderData.writer = $('.book_info').find('small').find('a').text(); // 作者
              spiderData.category = $('.nav-mbx').find('a').eq(2).text(); // 分类
              spiderData.description = $('.bookinfo_intro').text(); // 描述
              if(spiderData.update_status == 'a') { spiderData.update_status = 1; }else{ spiderData.update_status = 0; } // 0 => 连载，1 => 完结
              spiderData.chapter = Array.from(new Set(spiderData.chapter)); // 去重
              // spiderData.chapter = spiderData.chapter.reverse(); // 倒叙
              spiderData.description = spiderData.description.replace(/\s+/g, ''); // 过滤空格

              const setNovelContent = ctx.service.setNovelContent.default(spiderData); // 入库
              resolve(setNovelContent);
            }
            done();
            console.log('DONE => TIME:' + moment().format('YYYY-MM-DD hh:mm:ss'))
          }
        });
        c.queue(getNovelURL.data.result);
      })
      const result = await spiderPromise;
      ctx.body = {
        getStatus: getNovelURL.status,
        result
      };
    }
  }
}
module.exports = getNovelContentController;