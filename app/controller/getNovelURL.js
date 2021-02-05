'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const fs = require('fs');
//单本
class getNovelURLController extends Controller {
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
          fs.writeFile('1.txt', '<br>123<br>ABc',  function(err) {
            if (err) {
             return console.error(err);
            }
            console.log("数据写入成功！");
            console.log("--------我是分割线-------------")
            console.log("读取写入的数据！");
            fs.readFile('1.txt', function (err, data) {
              if (err) {
                return console.error(err);
               }
              console.log("异步读取文件数据: " + data.toString());
            });
         });
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

module.exports = getNovelURLController;