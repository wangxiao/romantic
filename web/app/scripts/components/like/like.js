$(() => {
  const win = window;
  const { C, R, Vue, ga } = win;

  C.LikeComponent = Vue.extend({
    template: '#like-tpl',
    data() {
      ga('send', 'pageview', '/like');
      const curruntUid = this.$route.query.uid;
      // 是不是本人
      let isSelf = true;
      const userInfo = R.getLocalStorageUserInfo() || {};
      if (userInfo.uid !== curruntUid) {
        isSelf = false;
      }
      if (!curruntUid) {
        R.router.go('/create');
      } else {
        R.getUserInfo(curruntUid).then((data) => {
          this.userInfo = data;
          this.userInfo.photoUrl = data.photo;
          // 更新缓存
          if (isSelf) {
            R.updateLocalStorageUserInfo(this.userInfo);
          }

          // 修改 title
          R.weixinShareTitle = '快来向我表白吧，';

          if (!data.likedCount && !data.unlikedCount) {
            R.weixinShareTitle += '喜欢我的人在哪里？这一次咱们别再错过了！';
          }
          if (data.likedCount && !data.unlikedCount) {
            R.weixinShareTitle += `已有 ${data.likedCount} 个人喜欢我，怎么没有你？`;
          }
          if (data.unlikedCount && !data.likedCount) {
            R.weixinShareTitle += `我只收到了，${data.unlikedCount} 张好人卡，你快表白！`;
          }
          if (data.likedCount && data.unlikedCount) {
            R.weixinShareTitle += `已有 ${data.likedCount} 个人喜欢我，但是也收到了 ${data.unlikedCount} 张好人卡。`;
          }

          R.weixinShareImgUrl = data.photo;

          // 更新配置
          R.weixinConfig();
        }, () => {
          R.router.go('/create');
        });
      }
      return {
        userInfo: {},
        ui: {
          isSelf,
          showShare: false,
          isLike: false,
          showConfirm: false,
        },
      };
    },
    methods: {
      like() {
        ga('send', 'pageview', '/like-btn');
        this.ui.isLike = true;
        setTimeout(() => {
          this.confirm();
        }, 800);
      },
      unlike() {
        ga('send', 'pageview', '/unlike-btn');
        this.goToCreate();
      },
      back() {
        R.router.go('/create');
      },
      share() {
        this.ui.showShare = true;
      },
      unshare() {
        this.ui.showShare = false;
      },
      confirm() {
        this.goToCreate(true);
      },
      closeConfirm() {
        this.ui.isLike = false;
        this.ui.showConfirm = false;
      },
      goToCreate(isLike) {
        R.router.go({
          path: '/create',
          query: {
            uid: this.userInfo.uid,
            // 1 是喜欢 0 是不喜欢
            isLike: isLike ? 1 : 0,
          },
        });
      },
    },
  });

  Vue.component('like-component', C.LikeComponent);
});
