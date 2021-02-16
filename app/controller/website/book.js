'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class bookController extends Controller {
  async default() {
    const { ctx } = this;
    
    // 获取分类
    const category = await ctx.service.website.index.category();
    if(category.result.code !== 200) { console.log(category.result.message); }

    await ctx.render('page/book', {
      sitename: '笔趣阁',
      keywords: '关键字',
      description: '网站描述',
      category: category.data, // 分类
    })
  }
}
module.exports = bookController;