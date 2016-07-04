/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

// 工单相关方法

'use strict';

const AV = require('leanengine');
const moment = require('moment');
const configM = require('./config');
const tool = require('./tool');
const notifyM = require('./notify');

let pub = {};

// AV.Cloud.define('sendEmailOfAllTodoTickets', (req, res) => {
//   tool.l('Timer - sendEmailOfAllTodoTickets - runing');
//   res.success();
// });

module.exports = pub;
