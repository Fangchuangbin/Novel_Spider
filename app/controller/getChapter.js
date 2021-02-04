'use strict';

const Controller = require('egg').Controller;
const Crawler = require('crawler');
const moment = require('moment');

class getChapterController extends Controller {
  async default() {
    const { ctx } = this;
    const getBook = await ctx.curl('http://192.168.0.5:7001/getBook1', {
      dataType: 'json',
      timeout: 10000
    });
    if(getBook.status !== 200) {
      console.log('Type:Error,Time:' + moment().format('YYYY-MM-DD hh:mm:ss'))
    }else{
      console.log(getBook)
    }
  }
}
module.exports = getChapterController;