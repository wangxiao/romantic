/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

// 所有 API 的路由

'use strict';

const router = require('express').Router();
const userM = require('./user');
const weixinM = require('./weixin');

router.post('/users', userM.edit);
router.post('/users/uploadPhoto', userM.uploadFile);
router.get('/users/:uid', userM.getInfo);
router.post('/users/:uid/like', userM.like);
router.post('/users/:uid/unlike', userM.unlike);
router.get('/weixin/', weixinM.getSign);

// 其他接口全部返回 404
router.use((req, res) => {
  res.status(404).send('Not Found.');
});

module.exports = router;
