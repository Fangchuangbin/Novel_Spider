'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class indexController extends Controller {
  async default() {
    const { ctx } = this;
    // 获取分类
    const category = await ctx.service.website.category.default();
    if(category.result.code !== 200) { console.log(category.result.message); }

    // 获取最新小说
    const update = await ctx.service.website.update.default();
    if(update.result.code !== 200) { console.log(update.result.message); }
    for( var i = 0; i < update.data.length; i++ ) {
      if(update.data[i].name == '') {
        update.data.splice(i, 1);
      }else{
        update.data[i].chapter = update.data[i].chapter.split("###");
      }
    }

    // 获取推荐小说
    const recommend = await ctx.service.website.recommend.default();
    if(recommend.result.code !== 200) { console.log(recommend.result.message); }

    // 获取热门小说
    const hot = await ctx.service.website.hot.default();
    if(hot.result.code !== 200) { console.log(hot.result.message); }

    // 获取分类列表
    // 1 => 玄幻, 2 => 仙侠, 3 => 都市, 4 => 历史, 5 => 科幻, 6 => 网游, 7 => 完本, 8 => 热门
    // 玄幻
    const xuanhuan = await ctx.service.website.list.default(13, '玄幻', 0);
    if(xuanhuan.result.code !== 200) { console.log(xuanhuan.result.message); }
    // 仙侠
    const xianxia = await ctx.service.website.list.default(13, '仙侠', 0);
    if(xianxia.result.code !== 200) { console.log(xianxia.result.message); }
    // 都市
    const dushi = await ctx.service.website.list.default(13, '都市', 0);
    if(dushi.result.code !== 200) { console.log(dushi.result.message); }
    // 历史
    const lishi = await ctx.service.website.list.default(13, '历史', 0);
    if(lishi.result.code !== 200) { console.log(lishi.result.message); }
    // 科幻
    const kehuan = await ctx.service.website.list.default(13, '科幻', 0);
    if(kehuan.result.code !== 200) { console.log(kehuan.result.message); }
    // 网游
    const wangyou = await ctx.service.website.list.default(13, '网游', 0);
    if(wangyou.result.code !== 200) { console.log(wangyou.result.message); }

    // 猜你喜欢
    const like = await ctx.service.website.like.default();
    if(like.result.code !== 200) { console.log(like.result.message); }


    await ctx.render('page/index', {
      // 网站信息
      title: '笔趣阁',
      keywords: '笔趣阁,无弹窗,小说阅读网,biquge',
      description: '笔趣阁是广大书友最值得收藏的网络小说阅读网,网站收录了当前最火热的网络小说,免费提供高质量的小说最新章节,是广大网络小说爱好者必备的小说阅读网.',
      // 分类
      category: category.data,
      // 最近更新
      update: update.data,
      // 推荐小说
      recommend: recommend.data,
      // 热门小说
      hot: hot.data,
      // 玄幻
      xuanhuan: xuanhuan.data,
      // 仙侠
      xianxia: xianxia.data,
      // 都市
      dushi: dushi.data,
      // 历史
      lishi: lishi.data,
      // 科幻
      kehuan: kehuan.data,
      // 网游
      wangyou: wangyou.data,
      // 猜你喜欢
      like: like.data,
    })
  }
}
module.exports = indexController;