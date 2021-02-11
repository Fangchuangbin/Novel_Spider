const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 热门小说
class hotService extends Service {
  async default() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { limit: 9, orders: [ [ 'hot', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取热门小说成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].category = data[i].category.replace("小说", '');
      }
      return { result, data }
    }
  }
}

module.exports = hotService;