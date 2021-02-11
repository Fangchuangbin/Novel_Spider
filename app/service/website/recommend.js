const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 推荐小说
class recommendService extends Service {
  async default() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { where: { recommend_status: 1 }, limit: 4, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取推荐小说成功';
      return { result, data }
    }
  }
}

module.exports = recommendService;