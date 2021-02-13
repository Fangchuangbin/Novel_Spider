'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class listController extends Controller {
  async default() {
    const { ctx } = this;
    const params = ctx.params.idAndPage;
    const id = params.split('_')[0]; // 分类ID
    const page = params.split('_')[1]; // 当前页码
    const allPage = 20; // 总页码
    var pageList = [];
    for(var i = 0; i < allPage; i++) {
      var onePage = { pageLink: 'list_' + id + '_' + Number(i + 1), pageName: '第' + Number(i + 1) + '页', curPage: false };
      if(page == Number(i + 1)) { onePage.curPage =  true };
      pageList = pageList.concat(onePage);
    }
    var firstNum = Number(page) - 5;
    if(firstNum < 0) { firstNum = 0; }
    var lastNum = Number(firstNum) + 10;
    if(lastNum > allPage) { lastNum = allPage; }
    if(firstNum <= 0) { lastNum = 10; }
    pageList = pageList.slice(firstNum, lastNum);
    ctx.body = {
      pageList
    };
  }
}
module.exports = listController;