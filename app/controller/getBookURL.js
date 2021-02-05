'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
//单本
class getBookURLController extends Controller {
  async default() {
    const { ctx } = this;
    const targetURL = this.config.basic.target.url;
    const spiderPromise = new Promise((resolve, reject) => {
      var c = new Crawler({
        maxConnections : 1,
        rateLimit: 1000,
        callback: function (error, response, done) {
          var spiderData = [];
          var spiderURL = null;
          if(error) {
            console.log(error);
            reject(error);
          }else{
            var $ = response.$;
            $('a').each(function() {
              spiderURL = $(this).attr('href');
              if(spiderURL.search('book_') !== -1 && spiderURL.indexOf('.html') == -1) {
                spiderData = spiderData.concat(targetURL + spiderURL);
              }
            })
            resolve(Array.from(new Set(spiderData)));
          }
          done();
        }
      });
      c.queue(targetURL);
    })
    const result = await spiderPromise;
    ctx.body = {
      status: 200,
      result
    };

  }
}

module.exports = getBookURLController;