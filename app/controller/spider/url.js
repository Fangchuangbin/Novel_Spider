'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');

class urlController extends Controller {
  async default() {
    const { ctx } = this;
    const targetURL = this.config.basic.target.url; // 目标网站
    var statusCode;
    const spiderPromise = new Promise((resolve, reject) => {
      var c = new Crawler({
        maxConnections : 1,
        rateLimit: 1000,
        callback: function (error, response, done) {
          console.log(response.statusCode)
          statusCode = response.statusCode;
          var spiderData = [];
          var spiderURL = null;
          if(error) {
            console.log(error);
            reject(error);
          }else{
            var $ = response.$;
            $('.news').eq(1).find('a').each(function() {
              spiderURL = $(this).attr('href');
              if(spiderURL.search('book_') !== -1 && spiderURL.indexOf('.html') == -1) {
                spiderData = spiderData.concat(targetURL + spiderURL);
              }
            })
            console.log('获取URL成功 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss'));
            resolve(Array.from(new Set(spiderData)));
          }
          done();
        }
      });
      c.queue(targetURL);
    })
    const url = await spiderPromise;
    ctx.body = {
      status: statusCode,
      url
    };

  }
}

module.exports = urlController;