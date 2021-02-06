const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { status: null, message: null, uri: null, key: null, chapter: [] }

class GetNovelChapterService extends Service {
  async default(request) {
    const { ctx, app } = this;
    const key = request.key;
    const name = request.name;
    // 查库
    const selectNovelChapter = await app.mysql.get('novel_content', { key, name } );
    if(selectNovelChapter !== null) {
      result.status = 0,
      result.message = '查询数据库成功 => 下一步：返回章节插入任务列表';
      result.uri = selectNovelChapter.uri;
      result.key = selectNovelChapter.key;
      result.chapter = JSON.parse(selectNovelChapter.off_chapter);
    }else{
      result.status = 1,
      result.message = '查询数据库失败 => ' + moment().format('YYYY-MM-DD hh:mm:ss');
    }
    return result;
  }
}

module.exports = GetNovelChapterService