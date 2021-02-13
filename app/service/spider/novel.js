const Service = require('egg').Service;
const moment = require('moment');
const random = require('random');
const crypto = require('crypto');
const superagent = require('superagent');

var result = { message: null, time: moment().format('YYYY-MM-DD hh:mm:ss') }

class contentService extends Service {
  async default(spiderData) {
    const { ctx, app } = this;
    var hot = random.int(1000, 999999); // 阅读人数
    var recommend_status = 0; // 推荐状态
    var update_status = spiderData.update_status; // 更新状态
    var update_time = new Date().getTime(); // 更新时间
    var uri = spiderData.uri; // 源
    var name = spiderData.name; // 书名
    // var written = spiderData.written; // 封面
    var writer = spiderData.writer; // 作者
    var category = spiderData.category; // 分类
    var description = spiderData.description; // 描述
    var chapter = JSON.stringify(spiderData.chapter); // 全新章节

    // 封面转换Base64
    var written = await new Promise(async function (resolve, reject) {
      var url = spiderData.written;
      await superagent.get(url).buffer(true).parse((res) => {
        let buffer = [];
        res.on('data', (chunk) => {
          buffer.push(chunk);
        });
        res.on('end', () => {
          const data = Buffer.concat(buffer);
          const base64Img = data.toString('base64');
          resolve(base64Img);
        });
      });
    })
    written = 'data:image/jpeg;base64,' + written;

    // 查库
    const key = crypto.createHash('md5').update(spiderData.name).digest('hex'); // 文件秘钥
    const selectNovelContent = await app.mysql.get('novel_content', { name });
    if(selectNovelContent == null) { // 没有记录
      // 新建入库
      const setNovelContent = await app.mysql.insert('novel_content', { key, hot, recommend_status, update_status, update_time, uri, name, written, writer, category, description, chapter })
      if(setNovelContent.affectedRows === 1) {
        result.message = '新建入库成功 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }else {
        result.message = '新建入库失败 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }
    }else{ // 已有记录
      console.log('已有入库记录 => 书名：' + name);
      const updateNovelContent = await app.mysql.update('novel_content', { chapter, update_time, update_status }, { where: { id: selectNovelContent.id, key: selectNovelContent.key, name: selectNovelContent.name } });
      if(updateNovelContent.affectedRows === 1) {
        result.setMessage = '更新入库成功 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }else {
        result.setMessage = '更新入库失败 => 时间：' + moment().format('YYYY-MM-DD hh:mm:ss');
      }
    }
    return result;
  }
}

module.exports = contentService;