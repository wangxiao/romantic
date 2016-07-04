$(() => {
  const win = window;
  win.C = win.C || {};
  win.R = win.R || {};
  const { C, R, Vue, VueRouter } = win;
  const App = Vue.extend({});

  R.router = new VueRouter({
    hashbang: false,
  });

  R.router.map({
    '/like': {
      component: C.LikeComponent,
    },
    '/create': {
      component: C.CreateComponent,
    },
  });

  R.router.redirect({
    // 重定向任意未匹配路径
    '*': '/create',
  });

  R.router.start(App, '#romantic-app');

  R.weixinConfig();
});
