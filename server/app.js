const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors');
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');
const logger = require('koa-logger')
const index = require('./routes/index')
const users = require('./routes/users')
const post = require('./routes/post')

const config = require('./config/index');
const mongoose = require('mongoose')

console.log(config.mongodb_url);
mongoose.connect(config.mongodb_url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// error handler
onerror(app)

// middlewares
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



//cors
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 7 * 24 * 60 * 60,// 7 days 预请求头有效期
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(koaBody({
  multipart: true,  // 允许上传多个文件
  formidable: { 
      uploadDir:config.uploadDir,// 上传的文件存储的路径 
      keepExtensions: true  //  保存图片的扩展名
  }
}));

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(post.routes(), post.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
