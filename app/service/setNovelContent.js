const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { setStatus: null, message: null }

class SetNovelContentService extends Service {
  async default(spiderData) {
    const { ctx, app } = this;
    const key = crypto.createHash('md5').update(spiderData.name + new Date().getTime()).digest('hex'); // 文件秘钥
    var recommend_status = 0; // 推荐状态
    var spider_status = 0; // 爬虫状态
    var update_status = spiderData.update_status; // 更新状态
    var update_time = new Date().getTime(); // 更新时间
    var uri = spiderData.uri; // 源
    var name = spiderData.name; // 书名
    var written = spiderData.written; // 封面
    var writer = spiderData.writer; // 作者
    var category = spiderData.category; // 分类
    var description = spiderData.description; // 描述
    var chapter = JSON.stringify(JSON.stringify(spiderData.chapter)); // 章节
    const setNovelContent = await app.mysql.query('INSERT IGNORE INTO book_content (`key`, `recommend_status`, `spider_status`, `update_status`, `update_time`, `uri`, `name`, `written`, `writer`, `category`, `description`, `chapter`) VALUES ("' + key + '","' + recommend_status + '","' + spider_status + '","' + update_status + '","' + update_time + '","' + uri + '","' + name + '","' + written + '","' + writer + '","' + category + '","' + description + '",' + chapter + ')');
    if(setNovelContent.affectedRows === 1) {
      result.setStatus = 200;
      result.message = 'SUCCESS => TYPE:INSERT_SQL';
    }else {
      result.setStatus = 400;
      result.message = 'ERROR => TYPE:INSERT_SQL => MESSAGE:' + setNovelContent.message;
    }
    return result;
  }
}

module.exports = SetNovelContentService;