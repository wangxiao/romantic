/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

'use strict';

const AV = require('leanengine');
const tool = require('./tool');
const config = require('./config');
const jsSHA = require('jssha');

const pub = {};

let accessToken;
let timestampForToken;
let jsTicket;
let timestampForTicket;

const getAccessToken = () => new Promise((resolve) => {
  const now = new Date().getTime();
  if (!accessToken || !timestampForToken || timestampForToken + 3600 * 1000 < now) {
    AV.Cloud.httpRequest({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: `grant_type=client_credential&appid=${config.weixinAppId}&secret=${config.weixinSecret}`,
      success: (httpResponse) => {
        timestampForToken = new Date().getTime();
        accessToken = JSON.parse(httpResponse.text).access_token;
        resolve(accessToken);
      },
      error: (httpResponse) => {
        console.error(`Request failed with response code ${httpResponse.status}`);
      },
    });
  } else {
    resolve(accessToken);
  }
});

const getJsTicket = async () => {
  const params = `access_token=${accessToken}&type=jsapi`;
  return new Promise((resolve) => {
    const now = new Date().getTime();
    if (!jsTicket || !timestampForTicket || timestampForTicket + 3600 * 1000 < now) {
      AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        params,
        success: (httpResponse) => {
          jsTicket = JSON.parse(httpResponse.text).ticket;
          resolve(jsTicket);
        },
        error: (httpResponse) => {
          console.error(`Request failed with response code ${httpResponse.status}`);
        },
      });
    } else {
      resolve(jsTicket);
    }
  });
};

const createNonceStr = () => Math.random().toString(36).substr(2, 15);

const createTimestamp = () => String(parseInt(new Date().getTime() / 1000, 10));

const raw = (args) => {
  let keys = Object.keys(args);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key];
  });

  let string = '';
  for (const k in newArgs) {
    string += `&${k}=${newArgs[k]}`;
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
const sign = (jsapiTicket, url) => {
  const ret = {
    jsapi_ticket: jsapiTicket,
    noncestr: createNonceStr(),
    timestamp: createTimestamp(),
    url,
  };
  const string = raw(ret);
  const shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');
  ret.appId = config.weixinAppId;
  ret.nonceStr = ret.noncestr;
  return ret;
};

pub.getSign = async (req, res) => {
  const url = req.query.url;
  try {
    await getAccessToken();
    const jsapiTicket = await getJsTicket();
    res.send(sign(jsapiTicket, url));
  } catch (err) {
    tool.l('getSign -');
    tool.l(err);
  }
};

module.exports = pub;
