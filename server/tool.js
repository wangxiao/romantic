/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

/* eslint {no-console: 0} */
// 一些工具方法

'use strict';

const error = require('./error');

const pub = {};

pub.l = (msg) => {
  console.log('\n\n', msg, '\n\n');
};

// 校验参数是否有为空
pub.rejectEmptyParam = (res, arr) => {
  let result = false;
  arr.forEach((v) => {
    if (typeof v === 'string') {
      if (!v.trim()) {
        result = true;
      }
    } else {
      if (!v) {
        result = true;
      }
    }
  });
  if (result) {
    const err = error.common.loseParam;
    res.status(err.status).send({
      err: err.status,
      msg: err.msg,
    });
  }
  return result;
};

pub.fail = (res, err) => {
  res.status(err.status).send({
    err: err.status,
    msg: err.msg,
  });
};

// 获取与时间相关的随机引子
pub.getRandomId = () => {
  let res = Date.now().toString(36);
  const getItem = () => Math.random().toString(36).substring(2, 3);
  res += getItem() + getItem() + getItem();
  return res;
};

module.exports = pub;
