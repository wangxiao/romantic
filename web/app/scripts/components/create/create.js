$(() => {
  const win = window;
  win.C = win.C || {};
  win.R = win.R || {};
  const { C, R, Vue, ga } = win;
  C.CreateComponent = Vue.extend({
    template: '#create-tpl',
    data() {
      ga('send', 'pageview', '/create');
      // 测试时去掉缓存
      // let userInfo;
      const userInfo = R.getLocalStorageUserInfo();
      const obj = {
        name: '',
        phone: '',
        photoUrl: '',
      };
      let isSelf = true;
      const curruntUid = this.$route.query.uid;
      // 是否喜欢
      const isLike = this.$route.query.isLike;
      if (curruntUid) {
        isSelf = false;
        R.getUserInfo(curruntUid).then((data) => {
          this.otherInfo = data;
          this.otherInfo.photoUrl = data.photo;
          if (this.userInfo.uid && typeof(isLike) !== 'undefined') {
            R.likeOrUnlike(this.userInfo.uid, this.otherInfo.uid, Number(this.isLike));
          }
        });
      }
      return {
        userInfo: userInfo || obj,
        otherInfo: {
          name: '',
          phone: '',
          photoUrl: '',
        },
        isLike,
        ui: {
          uploading: false,
          isSelf,
          showConfirm: false,
        },
        tipWord: '',
      };
    },
    methods: {
      uploadPhoto() {
        const uploadFormDom = $('#upload-file-form');
        const uploadInputDom = uploadFormDom.find('input[type=file]');
        const files = uploadInputDom[0].files;
        const formData = new window.FormData(uploadFormDom[0]);
        if (files.length) {
          this.ui.uploading = true;
          R.uploadPhoto(formData).then((data) => {
            this.userInfo.photoUrl = data.fileUrl;
          });
        } else {
          this.tipWord = '你还没有选择「照片」';
          this.hideTooltip();
        }
      },
      checkInfo() {
        if (!this.userInfo.photoUrl) {
          this.tipWord = '你还没有「上传照片」';
          this.hideTooltip();
          return false;
        }
        if (!this.userInfo.name) {
          this.tipWord = '你还没有填写你的「姓名」';
          this.hideTooltip();
          return false;
        }
        if (!this.userInfo.phone) {
          this.tipWord = '你还没有填写你的「手机号码」';
          this.hideTooltip();
          return false;
        }
        if (this.userInfo.phone.length !== 11) {
          this.tipWord = '「手机号码」位数不对';
          this.hideTooltip();
          return false;
        }
        if (/[^\d]/.test(this.userInfo.phone)) {
          this.tipWord = '「手机号码」格式不正确';
          this.hideTooltip();
          return false;
        }
        return true;
      },
      create() {
        this.tipWord = '提交中...';
        R.createUser(this.userInfo).then((data) => {
          this.userInfo.uid = data.uid;
          R.updateLocalStorageUserInfo(this.userInfo);
          if (typeof(this.isLike) !== 'undefined' && this.otherInfo && this.otherInfo.uid) {
            R.likeOrUnlike(this.userInfo.uid, this.otherInfo.uid, Number(this.isLike));
          }
          R.router.go({
            path: '/like',
            query: {
              uid: data.uid,
            },
          });
        });
      },
      hideTooltip() {
        setTimeout(() => {
          this.tipWord = '';
        }, 3000);
      },
      showConfirm() {
        if (!this.checkInfo()) {
          ga('send', 'pageview', '/checkInfo-error');
          return;
        }
        this.ui.showConfirm = true;
      },
      closeConfirm() {
        this.ui.showConfirm = false;
        ga('send', 'pageview', '/reset-info');
      },
      confirm() {
        this.create();
      },
    },
  });

  Vue.component('create-component', C.CreateComponent);
});
