const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

var result = { message: null, time: moment().format('YYYY-MM-DD hh:mm:ss') }

class SetNovelContentService extends Service {
  async default(spiderData, key) {
    const { ctx, app } = this;
    
    var recommend_status = 0; // 推荐状态
    var update_status = spiderData.update_status; // 更新状态
    var update_time = new Date().getTime(); // 更新时间
    var uri = spiderData.uri; // 源
    var name = spiderData.name; // 书名
    var written = spiderData.written; // 封面
    var writer = spiderData.writer; // 作者
    var category = spiderData.category; // 分类
    var description = spiderData.description; // 描述
    var all_chapter = JSON.stringify(spiderData.chapter); // 所有章节
    // 查库
    const selectNovelContent = await app.mysql.get('novel_content', { name });
    if(selectNovelContent == null) { // 没有记录
      // 入库
      const setNovelContent = await app.mysql.insert('novel_content', { key, recommend_status, update_status, update_time, uri, name, written, writer, category, description, all_chapter, off_chapter: all_chapter })
      if(setNovelContent.affectedRows === 1) {
        result.message = '新建入库成功 => ' + '时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }else {
        result.message = '新建入库失败 =>' + '时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }
    }else{ // 已有记录
      console.log('已有入库记录 => 下一步：写入最新章节');
      const exists_all_chapter = JSON.parse(selectNovelContent.all_chapter); // 已有记录章节
      all_chapter = JSON.parse(all_chapter);
      let off_chapter = all_chapter.filter((v, i) => {
        return v != exists_all_chapter[i];
      })
      console.log('最新数据已入库 => 书名：' + name);
      off_chapter = JSON.stringify(off_chapter);
      all_chapter = JSON.stringify(all_chapter);
      const updateNovelContent = await app.mysql.update('novel_content', { off_chapter, all_chapter, update_time, update_status }, { where: { id: selectNovelContent.id, key: selectNovelContent.key, name: selectNovelContent.name } });
      if(updateNovelContent.affectedRows === 1) {
        result.setMessage = '更新入库成功 => ' + '时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }else {
        result.setMessage = '更新入库失败 => 详情:' + setNovelContent.message;
      }
    }
    
    

    return result;
  }
}

module.exports = SetNovelContentService;