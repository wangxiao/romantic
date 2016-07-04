/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

'use strict';

const domain = require('domain');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
// 监控请求情况的中间件
// const sniper = require('leanengine-sniper');

const AV = require('leanengine');
const app = express();

// babel 编译
require('babel-core/register');

// 各个模块
const apiRouter = require('./router');
const config = require('./config');

// 使用 LeanEngine 中间件
app.use(AV.express());


// 强制开启 https 的中间件
// app.enable('trust proxy');
// app.use(AV.Cloud.HttpsRedirect());

// 设置 view 引擎
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(busboy());
// app.use(sniper({AV: AV}));
app.use(cookieParser());

// 未处理异常捕获 middleware
app.use((req, res, next) => {
  const d = domain.create();
  d.add(req);
  d.add(res);
  d.on('error', (err) => {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if (!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  d.run(next);
});

const setCorsSupport = (req, res, next) => {
  const origin = req.headers.origin;
  if (config.whiteOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  }
  next();
};

// 跨域支持
app.all('/api/*', (req, res, next) => {
  setCorsSupport(req, res, next);
});

// api
app.use('/api', apiRouter);

// 服务端所有路由指向 index
app.use((req, res) => {
  // 统一指向 Public 目录
  const url = path.dirname(require.main.filename).replace('/server', '');
  res.sendFile(`${url}/public/index.html`);
  // res.status(404);
});

// 捕获所有异常错误
process.on('unhandledRejection', (reason, p) => {
  console.warn('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

module.exports = app;
