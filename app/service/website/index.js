const Service = require('egg').Service;
const moment = require('moment');
const random = require('random');

var result = { code: null, message: null }

// 首页
class indexService extends Service {
  
  // 分类
  async category() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_category');
    if(data) {
      result.code = 200;
      result.message = '获取分类成功';
      return { result, data }
    }
  }

  // 网站信息
  async website(host) {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_website', { host });
    if(data) {
      result.code = 200;
      result.message = '获取网站信息成功';
      return { result, data }
    }
  }

  // 随机
  async rand(limit) {
    const { ctx, app } = this;
    const data = await app.mysql.query('select * from novel_content where id >= ((select max(id) from novel_content) - (select min(id) from novel_content)) * rand() + (select min(id) from novel_content) limit ' + limit);
    var chapter = data[0].chapter;
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
      //console.log(data)
      result.code = 200;
      result.message = '获取随机数据成功';
      return { result, data, chapter }
    }
  }

  // 热门
  async hot() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { limit: 9, orders: [ [ 'hot', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取热门小说成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].category = data[i].category.replace("小说", '');
      }
      return { result, data }
    }
  }

  // 猜你喜欢
  async like() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { limit: 20, orders: [ [ 'hot', 'asc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取猜你喜欢成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].category = data[i].category.replace("小说", '');
      }
      return { result, data }
    }
  }

  // 首页列表
  async list(limit, category, offset) {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { where: { category: category + '小说' }, limit, offset, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取分类列表成功';
      return { result, data }
    }
  }

  // 推荐
  async recommend(limit) {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { where: { recommend_status: 1 }, limit, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取推荐小说成功';
      return { result, data }
    }
  }

  // 最近更新
  async update() {
    const { ctx, app } = this;
    const data = await app.mysql.select('novel_content', { limit: 20, orders: [ [ 'update_time', 'desc' ] ] });
    if(data) {
      result.code = 200;
      result.message = '获取最近更新小说成功';
      for( var i = 0; i < data.length; i++ ) {
        data[i].update_time = moment().format('MM-DD H:mm');
        data[i].chapter = JSON.parse(data[i].chapter);
        data[i].chapter.reverse(); // 倒叙
        data[i].chapter = data[i].chapter[0];
      }
      return { result, data }
    }
  }

  
}

module.exports = indexService;