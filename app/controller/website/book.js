'use strict';

const Controller = require('egg').Controller;
const random = require('random');

class bookController extends Controller {
  async default() {
    const { ctx } = this;
    
    // 获取分类
    const category = await ctx.service.website.index.category();
    if(category.result.code !== 200) { console.log(category.result.message); }

    // 获取最新小说
    const update = await ctx.service.website.index.rand(1);
    if(update.result.code !== 200) { console.log(update.result.message); }
    var chapter = JSON.parse(update.chapter);
    for( var i = 0; i < update.data.length; i++ ) {
      if(update.data[i].name == '') { update.data.splice(i, 1);
      }else{ update.data[i].chapter = update.data[i].chapter.split("###"); }
    }
    for( var i = 0; i < chapter.length; i++) {
      const randNumber = random.int(1000, 9999999);
      chapter[i] = chapter[i].split("###");
      chapter[i][0] = randNumber;
    }

    // 获取推荐小说
    const recommend = await ctx.service.website.index.rand(4);
    if(recommend.result.code !== 200) { console.log(recommend.result.message); }

    // 网站信息
    const host = ctx.request.header.host;
    const website = await ctx.service.website.index.website(host);
    if(website.result.code !== 200) { console.log(website.result.message); }
    await ctx.render('page/book', {
      bookMain: update.data[0],
      bookName: update.data[0].name,
      listName: update.data[0].category,
      sitename: website.data[0].sitename,
      keywords: update.data[0].name + '全本下载,' + update.data[0].name + 'txt下载, 全本阅读' + update.data[0].name,
      description: update.data[0].description,
      category: category.data, // 分类
      recommend: recommend.data, // 推荐小说
      chapter: chapter,
    })
  }
}
module.exports = bookController;