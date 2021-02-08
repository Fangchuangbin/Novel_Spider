'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');
const crypto = require('crypto');

class getNovelContentController extends Controller {
  async default() {
    const { ctx } = this;
    const targetURL = this.config.basic.target.url;
    const getNovelURL = await ctx.curl(ctx.request.host + '/getNovelURL', {
      dataType: 'json',
      timeout: 10000
    });
    if(getNovelURL.status !== 200) {
      console.log('出现错误 => 状态码：' + getNovelURL.status + ' => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss') + ' => 请求主机：' + ctx.request.host + ' => 请求URL：' + ctx.request.url)
    }else{
      const spiderPromise = new Promise((resolve, reject) => {
        var c = new Crawler({
          maxConnections : 1,
          rateLimit: 5000,
          callback: function (error, response, done) {
            var spiderData = { uri: null, name: null, written: null, update_status: null, writer: null, category: null, description: null, chapter: [] };
            var spiderChapter = [];
            if(error) {
              console.log(error);
              reject(error);
            }else{
              var $ = response.$;
              $('.book_list').find('ul').eq(1).find('a').each(function() {
                var url = $(this).attr('href');
                if(url.indexOf('.html') !== -1) {
                  const name = $(this).text();
                  url = url.replace('.html', '');
                  const chapterMerge = url + "###" + name;
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
              spiderData.description = spiderData.description.replace(/\s+/g, ''); // 过滤空格
              // spiderData.chapter = spiderData.chapter.reverse(); // 倒叙
              const key = crypto.createHash('md5').update(spiderData.name).digest('hex'); // 文件秘钥
              const setNovelContent = ctx.service.setNovelContent.default(spiderData, key); // 入库
              resolve(setNovelContent);
            }
            done();
            
            console.log('执行完毕 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss'));
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