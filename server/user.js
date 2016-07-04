/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

'use strict';

// 用户数据操作模块

const AV = require('leanengine');
const tool = require('./tool');

const User = AV.Object.extend('UserInfo');

const pub = {};

// TODO: 数据量大的时候需要支持分页获取
pub.getBy = (key, value) => {
  const query = new AV.Query(User);
  query.equalTo(key, value);
  return query.find();
};

pub.getInfo = async (req, res) => {
  const uid = req.params.uid;

  const isEmpty = tool.rejectEmptyParam(res, [uid]);
  if (isEmpty) {
    return;
  }

  try {
    const userObj = (await pub.getBy('uid', uid))[0];
    if (userObj) {
      res.send({
        uid: userObj.get('uid'),
        name: userObj.get('name'),
        photo: userObj.get('photo'),
        likedCount: userObj.get('likedCount'),
        unlikedCount: userObj.get('unlikedCount'),
      });
    } else {
      throw new Error('Can not find this uid.');
    }
  } catch (err) {
    tool.l(`getUserInfo - ${uid}`);
    tool.l(err);
  }
};

// const delUnuseFile = async (url) => {
//   if (url) {
//     const query = new AV.Query('_File');
//     query.equalTo('url', url);
//     const fileObj = await query.first();
//     if (fileObj) {
//       await fileObj.destroy();
//     }
//   }
// };

pub.edit = async (req, res) => {
  const phone = req.body.phone.trim();
  const name = req.body.name.trim();
  const photoUrl = req.body.photo.trim();

  const isEmpty = tool.rejectEmptyParam(res, [phone]);
  if (isEmpty) {
    return;
  }

  try {
    let userObj = (await pub.getBy('phone', phone))[0];
    let uid = tool.getRandomId();
    if (!userObj) {
      userObj = new User();
      userObj.set('phone', phone);
      userObj.set('uid', uid);
    } else {
      uid = userObj.get('uid');
    }
    if (name) {
      userObj.set('name', name);
    }
    const photo = userObj.get('photo');
    if (photoUrl && photoUrl !== photo) {
      // const url = userObj.get('photo');
      // delUnuseFile(url);
      userObj.set('photo', photoUrl);
    }
    await userObj.save();
    res.send({ uid });
  } catch (err) {
    tool.l('edit -');
    tool.l(err);
    res.status(403);
  }
};

const likeOrUnlike = async (uid, likeUid, isLike) => {
  const userObj = (await pub.getBy('uid', uid))[0];
  if (!userObj) {
    throw new Error(`Can not find this uid - ${uid}`);
  }
  const likeUserObj = (await pub.getBy('uid', likeUid))[0];
  if (!likeUserObj) {
    throw new Error(`Can not find this likeUid - ${likeUid}`);
  }

  let key = 'unlikes';
  if (isLike) {
    key = 'likes';
  }

  let likeList = userObj.get(key);
  if (!likeList) {
    likeList = [];
  }
  if (likeList.indexOf(likeUid) === -1) {
    likeList.push(likeUid);

    // 更新 likedCount
    let likedCount;
    if (isLike) {
      likedCount = likeUserObj.get('likedCount');
      likeUserObj.set('likedCount', likedCount + 1);
    } else {
      likedCount = likeUserObj.get('unlikedCount');
      likeUserObj.set('unlikedCount', likedCount + 1);
    }
    await likeUserObj.save();
  }

  userObj.set(key, likeList);
  return userObj.save();
};

pub.like = async (req, res) => {
  const uid = req.params.uid;
  const likeUid = req.body.likeUid;

  const isEmpty = tool.rejectEmptyParam(res, [uid, likeUid]);
  if (isEmpty) {
    return;
  }

  try {
    await likeOrUnlike(uid, likeUid, true);
    res.send({
      err: 0,
      msg: 'Like success.',
    });
  } catch (err) {
    tool.l('like -');
    tool.l(err);
    res.status(403);
  }
};

pub.unlike = async (req, res) => {
  const uid = req.params.uid;
  const unlikeUid = req.body.likeUid;

  const isEmpty = tool.rejectEmptyParam(res, [uid, unlikeUid]);
  if (isEmpty) {
    return;
  }

  try {
    await likeOrUnlike(uid, unlikeUid);
    res.send({
      err: 0,
      msg: 'Unlike success.',
    });
  } catch (err) {
    tool.l('unlike -');
    tool.l(err);
    res.status(403);
  }
};

pub.uploadFile = async (req, res) => {
  if (req.busboy) {
    const base64data = [];
    let pubFileName = '';
    req.busboy.on('file', (fieldname, file, fileName) => {
      let buffer = '';
      pubFileName = fileName;
      file.setEncoding('base64');
      file.on('data', (data) => {
        buffer += data;
      }).on('end', () => {
        base64data.push(buffer);
      });
    }).on('finish', async () => {
      const f = new AV.File(pubFileName, {
        // 仅上传第一个文件（多个文件循环创建）
        base64: base64data[0],
      });
      try {
        const fileObj = await f.save();
        res.send({
          // fileId: fileObj.id,
          // fileName: fileObj.name(),
          // mimeType: fileObj.metaData().mime_type,
          fileUrl: fileObj.url(),
        });
      } catch (err) {
        tool.l('uploadFile - ');
        tool.l(err);
        res.status(403);
      }
    });
    req.pipe(req.busboy);
  } else {
    tool.l('uploadFile - busboy undefined.');
    res.status(403);
  }
};

module.exports = pub;
