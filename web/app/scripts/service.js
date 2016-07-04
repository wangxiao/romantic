((win) => {
  let webHost = 'http://localhost:9000';
  let apiHost = 'http://localhost:3000';

  // 判断是否为开发环境
  const host = win.location.host;
  const port = win.location.port;
  const hostname = win.location.hostname;
  const protocol = win.location.protocol;
  if ((`http://${host}`) !== webHost) {
    webHost = `${protocol}//${host}`;
    if (!port || port === '80') {
      apiHost = `${protocol}//${host}`;
    } else {
      apiHost = `${protocol}//${hostname}:3000`;
    }
  }

  // 挂载命名空间
  win.R = win.R || {};
  const { R, ga, wx } = win;

  // 用来挂载路由
  R.router = {};

  // 获取某个用户数据
  R.getUserInfo = (uid) => {
    const url = `${apiHost}/api/users/${uid}`;
    return $.ajax({
      method: 'get',
      url,
    });
  };

  // 创建一个用户数据
  R.createUser = (data) => {
    const url = `${apiHost}/api/users`;
    return $.ajax({
      method: 'post',
      url,
      data: {
        phone: data.phone,
        name: data.name,
        photo: data.photoUrl,
      },
    });
  };

  // 喜欢或不喜欢某个人
  R.likeOrUnlike = (uid, likeUid, isLike) => {
    let url = `${apiHost}/api/users/${uid}/`;
    if (isLike) {
      url = `${url}like`;
    } else {
      url = `${url}unlike`;
    }

    return $.ajax({
      method: 'post',
      url,
      data: {
        likeUid,
      },
    }).then((data) => {
      console.log(data);
    });
  };

  R.uploadPhoto = (formData) => {
    const url = `${apiHost}/api/users/uploadPhoto`;
    return $.ajax({
      method: 'post',
      url,
      data: formData,
      processData: false,
      contentType: false,
    });
  };

  R.getLocalStorageUserInfo = () => JSON.parse(win.localStorage.getItem('userInfo'));

  R.updateLocalStorageUserInfo = (newUserInfo) => {
    const userInfo = R.getLocalStorageUserInfo();
    if (userInfo) {
      newUserInfo.phone = newUserInfo.phone || userInfo.phone;
    }
    win.localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
  };

  R.isFirstOpen = () => {
    const isFirstOpen = win.localStorage.getItem('isFirstOpen');
    if (isFirstOpen) {
      return false;
    } else {
      win.localStorage.setItem('isFirstOpen', 'false');
      return true;
    }
  };

  R.getWeixinToken = () => {
    const url = `${apiHost}/api/weixin`;
    return $.ajax({
      method: 'get',
      url,
      data: {
        url: win.location.href.split('#')[0],
      },
    });
  };

  R.weixinShareTitle = '快来向我表白吧，喜欢我的人在哪里？这一次咱们别再错过了。';
  R.weixinShareImgUrl = 'http://ac-kckdyoqh.clouddn.com/d36dea6175d8f34b2ca5.png';

  R.weixinConfig = () => {
    R.getWeixinToken().then((data) => {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'],
      });
      wx.ready(() => {
        wx.onMenuShareAppMessage({
          title: R.weixinShareTitle,
          desc: '如果你喜欢 Ta，可以悄悄地告诉 Ta。假如你们一直互相喜欢对方，彼此都会收到一条短信。',
          link: win.location.href,
          imgUrl: R.weixinShareImgUrl,
          type: 'link',
          dataUrl: '',
          success() {
            ga('send', 'pageview', '/share-app-message');
          },
          cancel() {
            ga('send', 'pageview', '/share-app-message-cancel');
          },
        });

        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: R.weixinShareTitle,
          link: win.location.href,
          imgUrl: R.weixinShareImgUrl,
          success() {
            ga('send', 'pageview', '/share-timeline');
          },
          cancel() {
            ga('send', 'pageview', '/share-timeline-cancel');
          },
        });
      });
    });
  };
})(window);
