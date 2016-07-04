/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

const AV = require('leanengine');

const appId = process.env.LC_APP_ID;
const appKey = process.env.LC_APP_KEY;
const masterKey = process.env.LC_APP_MASTER_KEY;

AV.init({ appId, appKey, masterKey });

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

const app = require('./server/app');

// 端口一定要从环境变量 `LC_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
const PORT = parseInt(process.env.LC_APP_PORT || 3000, 10);
app.listen(PORT, function () {
  console.log('Node app is running, port:', PORT, '\n\n\n\n\n\n');
});
