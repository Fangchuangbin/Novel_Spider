'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');

class getBookController extends Controller {
  async default() {
    const { ctx } = this;
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
              if(spiderFilter.search('book_') !== -1 && spiderFilter.indexOf('.html') == -1) {
                spiderData = spiderData.concat(spiderFilter);
              }
            })
          }
          resolve(Array.from(new Set(spiderData)));
          done();
        }
      });
      c.queue('https://www.ranwen8.com/');
    })
    const resultData = await spiderPromise;
    ctx.body = {
      status: 200,
      data: resultData
    };

  }
}

module.exports = getBookController;
