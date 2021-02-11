const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 最近更新
class updateService extends Service {
  async default() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { limit: 20, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取最近更新小说成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].update_time = moment().format('MM-DD hh:mm');
        data[i].chapter = JSON.parse(data[i].chapter);
        data[i].chapter.reverse(); // 倒叙
        data[i].chapter = data[i].chapter[0];
      }
      return { result, data }
    }
  }
}

module.exports = updateService;