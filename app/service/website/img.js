const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { code: null, message: null }

// 图片解析
class imgService extends Service {
  async default(key) {
    const { ctx, app } = this;
    const data = await app.mysql.get('novel_content', { key });
    if(data) {
      result.code = 200;
      result.message = '获取图片URL成功';
      return { result, data }
    }
  }
}

module.exports = imgService;