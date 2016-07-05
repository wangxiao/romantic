# Romantic

A full stack web project, all by using LeanCloud, as a LeanEngine demo.

## 简介

本项目是一个完全基于 LeanCloud 实现的 Web App，产品逻辑非常简单。使用者可以分享自己的照片到微信朋友圈中，如果有人喜欢 Ta，那么可以点击喜欢按钮，并且可以生成自己的页面。如果彼此喜欢，就可以给双方发送一条短信。

可以扫描二维码体验

![image](http://ac-kckdyoqh.clouddn.com/02143398c35fcb54.png)

## 特别鸣谢

非常感谢吴力扬参与产品讨论，并负责界面设计，我个人觉得这个产品界面设计地非常优美，很喜欢。

## 技术简介

服务端完全使用 LeanCloud，托管于 LeanEngine（LeanCloud 的服务端环境）。Web App 是通过自定义的 API，纯前端调用的方式实现。服务端技术栈主要是 Nodejs + Express，前端技术栈主要是 Vuejs。代码全部采用 ES6 的语法编写，服务端使用 async/await 来处理异步（前端需考虑兼容性）。

## 目录结构

```
.
├── public                  // 打包后部署的前端代码
├── server                  // 服务端代码模块
├── web                     // 前端开发期的代码
├── server.js               // 服务端的前置启动逻辑
├── package.json            // 服务端的 Nodejs 配置
└── ...                     // 其他非关键代码
```

## 安装步骤

如果想本地调试，需先按照如下过程安装依赖

### 前置安装

```
// 安装 LeanCloud 命令行工具
$ npm install -g leancloud-cli

// 安装 bower
$ npm install -g bower

// 安装 gulp
$ npm install -g gulp
```

### 服务端依赖安装

```
// 本地服务端环境安装，在根目录下执行
$ npm install
```

### 前端依赖安装

```
// 进入到 web 目录中，分别执行
$ npm install
$ bower install
```

## 本地调试

本地需要同时开启服务端环境和前端调试环境

### 启动本地服务端环境

```
// 首先根据 LeanCloud 的云引擎文档，配置好本地应用信息，没有应用需创建
$ lean app add your_app <your app 的应用 id>

// 启动服务端
$ lean up
```

### 启动前端调试环境

```
// 在服务端启动的情况下，新打开一个终端窗口，启动前端调试
$ gulp serve
```

## 数据库结构

### UserInfo

存储所有用户的信息（因为产品设计上不需用户登录，所以没有使用 AV.User）

| 字段 | 描述 | 类型 |
|------|------|----|
| uid | 用户 id | String |
| name | 用户名 | String |
| photo | 照片的 url | String |
| phone | 手机号码 | String |
| likes | 喜欢的人的 uid 列表 | Array |
| unlikes | 不喜欢的人的 uid 列表 | Array |
| likedCount | 被喜欢的次数 | Number |
| unlikedCount | 不被喜欢的次数 | Number |

## 接口

router.post('/users/:uid/like', userM.like);
router.post('/users/:uid/unlike', userM.unlike);
router.get('/weixin/', weixinM.getSign);


### 提交用户信息

- POST
- /api/users

### 上传头像照片

- POST
- /api/users/uploadPhoto

### 获取用户信息

- GET
- /api/users/:uid

### 某人喜欢某人

- POST
- /api/users/:uid/like

### 某人不喜欢某人

- POST
- /api/users/:uid/unlike

## 部署

按照如下步骤部署

### 前端打包

```
// 进入 web 目录，执行打包程序
$ gulp build
```

### 部署到 LeanCloud

```
// 将所有代码部署到 LeanEngine
$ lean deploy
```
