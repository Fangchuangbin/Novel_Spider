const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 分类
class categoryService extends Service {
  async default() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_category');
    if(data) {
      result.code = 200;
      result.message = '获取分类成功';
      return { result, data }
    }
  }
}

module.exports = categoryService;