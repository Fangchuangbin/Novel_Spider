const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { message: null }

class DoneNovelChapterService extends Service {
  async default(key) {
    const { ctx, app } = this;
    // 更新库
    const selectNovelChapter = await app.mysql.update('novel_content', { off_chapter: '' }, { where: { key } } );
    if(selectNovelChapter.affectedRows === 1) {
      result.message = '章节入库成功 => 当前章节任务列表已清空';
    }else{
      result.message = '章节入库失败 => 详情：' + selectNovelChapter.message;
    }
    return result;
  }
}

module.exports = DoneNovelChapterService