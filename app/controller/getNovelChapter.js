'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');
const fs = require('fs');

class getNovelChapterController extends Controller {
  async default() {
    const { ctx } = this;
    const targetURL = this.config.basic.target.url;
    const request = ctx.request.body;
    const getNovelChapter = await ctx.service.getNovelChapter.default(request);
    if(getNovelChapter.status == 0) { // 查询是否存在记录
      var uri = getNovelChapter.uri;
      var key = getNovelChapter.key;
      // 分割
      var chapter = getNovelChapter.chapter;
      var chapterURL = [];
      for(var i = 0; i<chapter.length; i++) {
        var chapterSplit = getNovelChapter.chapter[i].split('###');
        chapterURL = chapterURL.concat(targetURL + uri + chapterSplit[0] + '.html');
      }
      console.log(chapterURL)
      const spiderPromise = new Promise((resolve, reject) => {
        var c = new Crawler({
          maxConnections : 5,
          callback: function (error, response, done) {
            var spiderData = { content: null };
            if(error) {
              console.log(error);
              reject(error);
            }else{
              var $ = response.$;
              spiderData.content = $('.contentbox').html(); // 内容
              spiderData.content = spiderData.content.substring(spiderData.content.indexOf("<br>", 0) + 4); // 过滤
              if(fs.existsSync('static/' + key)) { // 判断目录
                writeFile();
                console.log('目录已存在 => 下一步：写入数据' + ' => 秘钥：' + key);
              }else{
                console.log('成功创建目录 => 下一步：写入数据');
                fs.mkdirSync('static/' + key, function(err) { // 创建目录
                  if(err) {
                    return console.error(err);
                  }else{
                    writeFile();
                  }
                })
              }
              // 写入TXT
              function writeFile() {
                var chapterURI = response.options.uri;
                chapterURI = chapterURI.replace(targetURL ,'');
                chapterURI = chapterURI.replace(uri ,'');
                chapterURI = chapterURI.replace('.html' ,'');
                fs.writeFile('static/' + key + '/' + chapterURI + '.html', spiderData.content, function(err) {
                  if (err) {
                    return console.error(err);
                  }else{
                    console.log('成功写入数据 => ' + '时间：' + moment().format('YYYY-MM-DD hh:mm:ss') + ' => URI：' + chapterURI);
                  }
                });
              }
              resolve(spiderData);
            }
            done();
            console.log('执行完毕 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss'));
          }
        });
        c.queue(chapterURL);
      })
      const result = await spiderPromise;
      const doneNovelChapter = await ctx.service.doneNovelChapter.default(key);
      ctx.body = {
        status: 200,
        result
      };
    }else{
      ctx.body = {
        status: 400
      };
    }
    
    
  }
}

module.exports = getNovelChapterController;