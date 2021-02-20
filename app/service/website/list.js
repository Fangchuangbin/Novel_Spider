const Service = require('egg').Service;
const moment = require('moment');
const random = require('random');

var result = { code: null, message: null }

// 列表
class listService extends Service {

  // 随机
  async rand(limit) {
    const { ctx, app } = this;
    const data = await app.mysql.query('select * from novel_content where id >= ((select max(id) from novel_content) - (select min(id) from novel_content)) * rand() + (select min(id) from novel_content) limit ' + limit);
    if(data) {
      for( var i = 0; i < data.length; i++ ) {
        const randNumber = random.int(1000, 9999999);
        data[i].uri = '/book_' + randNumber + '/';
      }
      for( var i = 0; i < data.length; i++ ) {
        data[i].update_time = moment().format('MM-DD H:mm');
        data[i].chapter = JSON.parse(data[i].chapter);
        data[i].chapter.reverse(); // 倒叙
        data[i].chapter = data[i].chapter[0];
      }
      result.code = 200;
      result.message = '获取随机数据成功';
      return { result, data }
    }
  }

  // 列表最近更新
  async listUpdate(category, page) {
    const { ctx, app } = this;
    const offset = Number(page - 1);
    const data = await app.mysql.select('novel_content', { where: { category }, limit: 20, offset, orders: [ [ 'update_time', 'desc' ] ] });
    if(data.length !== 0) {
      result.code = 200;
      result.message = '获取最近更新小说成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].update_time = moment().format('MM-DD hh:mm');
        data[i].chapter = JSON.parse(data[i].chapter);
        data[i].chapter.reverse(); // 倒叙
        data[i].chapter = data[i].chapter[0];
      }
      return { result, data }
    }else{
      result.code = 404;
      return { result }
    }
  }

  // 页码数
  async allPage(listName) {
    const { ctx, app } = this;
    // const rand = await app.mysql.query('select * from novel_content where id >= ((select max(id) from novel_content) - (select min(id) from novel_content)) * rand() + (select min(id) from novel_content) limit 1');
    const data = await app.mysql.query('select * from novel_content where category = "'+ listName +'"');
    return data;
  }
}
module.exports = listService;