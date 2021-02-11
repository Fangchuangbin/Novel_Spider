const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 分类列表
class listService extends Service {
  async default(limit, category, offset) {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { where: { category: category + '小说' }, limit, offset, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取分类列表成功';
      return { result, data }
    }
  }
}

module.exports = listService;