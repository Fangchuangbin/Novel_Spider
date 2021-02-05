'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');

//内容
class getNovelChapterController extends Controller {
  async default() {
    const { ctx } = this;
    const getChapter = await ctx.curl(ctx.request.host + '/getChapter', {
      dataType: 'json',
      timeout: 10000
    });
    if(getChapter.status !== 200) {
      console.log('ERROR => STATUS:' + getNovel.status + ' => TIME:' + moment().format('YYYY-MM-DD hh:mm:ss') + ' => HOST:' + ctx.request.host + ' => URL:' + ctx.request.url)
    }else{
      const spiderPromise = new Promise((resolve, reject) => {
        var c = new Crawler({
          maxConnections : 10,
          callback: function (error, res, done) {
            var spiderData = [];
            var spiderFilter = '';
            if(error){
              console.log(error);
            }else{
              var $ = res.$;
              $('a').each(function() {
                spiderFilter = $(this).attr('href');
                if(spiderFilter.indexOf('.html') !== -1) {
                  spiderData = spiderData.concat(spiderFilter);
                }
              })
            }
            resolve(Array.from(new Set(spiderData)));
            done();
          }
        });
        c.queue(getNovel.data.resultData);
      })
      const resultData = await spiderPromise;
      ctx.body = {
        status: 200,
        resultData
      };
    }
  }
}

module.exports = getNovelChapterController;