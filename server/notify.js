/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

// 用户通知相关方法

'use strict';

const AV = require('leanengine');
const tool = require('./tool');

const pub = {};

// 发送短信
pub.sendSms = (phone, fromName, toName) =>
  AV.Cloud.requestSmsCode({
    mobilePhoneNumber: phone,
    template: 'loveMsgTpl',
    fromName,
    toName,
  });

module.exports = pub;
