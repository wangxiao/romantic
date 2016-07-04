/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

// 所有的配置

'use strict';

const config = {

  // 服务端 host
  host: 'http://localhost:3000',

  // web 开发环境的 host
  webHost: 'http://localhost:9000',

  // 跨域白名单
  whiteOrigins: [
    'http://localhost:9000',
    'http://localhost:3000',
    'http://dev.romantic.leanapp.cn',
    'http://romantic.leanapp.cn',
  ],

  // 微信相关（通过 LeanEngine 环境变量获取）
  weixinAppId: process.env.weixinAppId,
  weixinSecret: process.env.weixinSecret,
};

// 判断环境
switch (process.env.LC_APP_ENV) {

  // 当前环境为线上测试环境
  case 'stage':
    config.host = 'http://dev.romantic.leanapp.cn';
    config.webHost = 'http://dev.romantic.leanapp.cn';
    break;

  // 当前环境为线上正式运行的环境
  case 'production':
  default:
    config.host = 'http://romantic.leanapp.cn';
    config.webHost = 'http://romantic.leanapp.cn';
    break;
}

module.exports = config;
