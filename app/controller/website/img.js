'use strict';

const Controller = require('egg').Controller;

// 图片解析
class imgController extends Controller {
  async default() {
    const { ctx } = this;
    const key = ctx.params.key;
    const img = await ctx.service.website.img.default(key);
    if(img.result.code !== 200) { console.log(img.result.message); }
    
    //ctx.set('content-type','image/jpeg');
    ctx.body = img.data.written;
  }
}
module.exports = imgController;