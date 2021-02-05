'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');

//章节
class getBookMainController extends Controller {
  async default() {
    const { ctx } = this;
    const getBookURL = await ctx.curl(ctx.request.host + '/getBookURL', {
      dataType: 'json',
      timeout: 10000
    });
    if(getBookURL.status !== 200) {
      console.log('ERROR => STATUS:' + getBookURL.status + ' => TIME:' + moment().format('YYYY-MM-DD hh:mm:ss') + ' => HOST:' + ctx.request.host + ' => URL:' + ctx.request.url)
    }else{
      const spiderPromise = new Promise((resolve, reject) => {
        var c = new Crawler({
          maxConnections : 1,
          rateLimit: 1000,
          callback: function (error, response, done) {
            var spiderData = { uri: null, name: null, written: null, type: null, writer: null, category: null, description: null, chapter: [] };
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
              spiderData.uri = response.options.uri; // 源
              spiderData.name = $('.book_info').find('img').attr('alt'); // 书面
              spiderData.written = $('.book_info').find('img').attr('src'); // 封面
              spiderData.type = $('.book_info').find('span').attr('class'); // 状态
              spiderData.writer = $('.book_info').find('small').find('a').text(); // 作者
              spiderData.category = $('.nav-mbx').find('a').eq(2).text(); // 分类
              spiderData.description = $('.bookinfo_intro').text(); // 描述
              if(spiderData.type == 'a') { spiderData.type = '已完结'; }else{ spiderData.type = '连载中'; }
              spiderData.chapter = Array.from(new Set(spiderData.chapter)); // 去重
              // spiderData.chapter = spiderData.chapter.reverse(); // 倒叙
              spiderData.description = spiderData.description.replace(/\s+/g, ''); // 过滤空格

              console.log(spiderData);
              resolve(spiderData);
            }
            done();
          }
        });
        c.queue(getBookURL.data.result);
      })
      const result = await spiderPromise;
      ctx.body = {
        status: getBookURL.status,
        result
      };
    }
  }
}
module.exports = getBookMainController;