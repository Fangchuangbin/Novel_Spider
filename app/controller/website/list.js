'use strict';

const Controller = require('egg').Controller;
const random = require('random');

class listController extends Controller {
  async default() {
    const { ctx } = this;
    const params = ctx.params.idAndPage;

    // 分页
    var id = params.split('_')[0]; // 分类ID
    var page = params.split('_')[1]; // 当前页码
    var prevLink = null;
    if(Number(page - 1) !== 0) {
      prevLink = '../list_' + id + '_' + Number(page - 1) + '/'; // 上一页
    }else{
      prevLink = 'javascript:void(0);'
    }
    var nextLink = '../list_' + id + '_' + Number(Number(params.split('_')[1]) + 1) + '/'; // 下一页

    var listName = null;
    switch(id) {
      case '1': listName = '玄幻小说'; break;
      case '2': listName = '仙侠小说'; break;
      case '3': listName = '都市小说'; break;
      case '4': listName = '历史小说'; break;
      case '5': listName = '科幻小说'; break;
      case '6': listName = '网游小说'; break;
      case '7': listName = '完本小说'; break;
      case '8': listName = '热门小说'; break;
      default: listName = '其他小说';
    }
    // const selectAllPage = await ctx.service.website.list.allPage(listName); // 总页码
    var selectAllPage = []
    const randLength = random.int(100, 9999);
    for (var i = 0; i < Number(randLength); i++ ) {
      selectAllPage = selectAllPage.concat(i);
    }
    var allPage = 1;
    if(selectAllPage.length > 10) { allPage = Math.ceil(selectAllPage.length / 10); }
    if(page >= allPage) { nextLink = '../list_' + id + '_' + allPage + '/'; }
    var pageList = [];
    for(var i = 0; i < allPage; i++) {
      var isPage = { pageLink: 'list_' + id + '_' + Number(i + 1), pageName: Number(i + 1), curPage: '' };
      if(page == Number(i + 1)) { isPage.curPage = 'cur' };
      pageList = pageList.concat(isPage);
    }
    var firstNum = Number(page) - 5;
    if(firstNum < 0) { firstNum = 0; }
    var lastNum = Number(firstNum) + 10;
    if(lastNum > allPage) { lastNum = allPage; }
    if(firstNum <= 0) { lastNum = 10; }
    pageList = pageList.slice(firstNum, lastNum);

    // 获取分类
    const category = await ctx.service.website.index.category();
    if(category.result.code !== 200) { console.log(category.result.message); }

    // 获取推荐小说
    const recommend = await ctx.service.website.index.rand(6);
    if(recommend.result.code !== 200) { console.log(recommend.result.message); }

    // 获取列表最新小说
    // const listUpdate = await ctx.service.website.list.listUpdate(listName, page);
    const listUpdate = await ctx.service.website.list.rand(20);
    if(listUpdate.result.code !== 200) { console.log(listUpdate.result.message); ctx.status = 404; ctx.redirect('/'); return; }
    for( var i = 0; i < listUpdate.data.length; i++ ) {
      if(listUpdate.data[i].name == '') { listUpdate.data.splice(i, 1);
      }else{ listUpdate.data[i].chapter = listUpdate.data[i].chapter.split("###"); }
    }
    
    // 获取最新小说
    const update = await ctx.service.website.index.update();
    if(update.result.code !== 200) { console.log(update.result.message); }
    for( var i = 0; i < update.data.length; i++ ) {
      if(update.data[i].name == '') { update.data.splice(i, 1);
      }else{ update.data[i].chapter = update.data[i].chapter.split("###"); }
    }

    // 网站信息
    const host = ctx.request.header.host;
    const website = await ctx.service.website.index.website(host);
    if(website.result.code !== 200) { console.log(website.result.message); }
    
    await ctx.render('page/list', {
      listname: listName,
      sitename: website.data[0].sitename,
      keywords: '免费的' + listName + ',推荐的' + listName + ',' + listName + 'txt下载',
      description: website.data[0].description,
      category: category.data, // 分类
      recommend: recommend.data, // 推荐小说
      listUpdate: listUpdate.data, // 列表最近更新
      update: update.data, // 猜你喜欢
      pageList, // 分页
      prevLink, // 上一页
      nextLink, // 下一页
    });
  }
}
module.exports = listController;