export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['administrator', 'guest'],
    routes: [
      // 默认页
      { path: '/', redirect: '/book/user-list' },
      // 数据列表
      {
        name: 'book',
        icon: 'book',
        path: '/book',
        routes: [
          {
            name: 'user-list',
            icon: 'user',
            path: '/book/user-list',
            component: './Book/BookUser/TableList',
          },
          { path: '/book/user-list-detail', component: './Book/BookUser/Detail' },
          {
            name: 'user-preference-list',
            icon: 'heart',
            path: '/book/user-preference-list',
            component: './Book/BookUserPreference/TableList',
          },          
          {
            name: 'readrecord-list',
            icon: 'read',
            path: '/book/readrecord-list',
            component: './Book/BookReadRecord/TableList',
          },
        ],
      },
      // 数据统计
      {
        name: 'chart',
        icon: 'area-chart',
        path: '/chart',
        routes: [
          {
            name: 'user',
            icon: 'pie-chart',
            path: '/chart/user',
            component: './Charts/User',
          },
          {
            name: 'book-read',
            icon: 'bar-chart',
            path: '/chart/BookRead',
            component: './Charts/BookRead',
          },
          {
            name: 'interface',
            icon: 'pie-chart',
            path: '/chart/interface',
            component: './Charts/Interface',
            hideInMenu: true,
          },
          {
            name: 'ranking',
            icon: 'bars',
            path: '/chart/Ranking',
            component: './Charts/Ranking',
          },
        ],
      },
      // 系统管理
      {
        name: 'sys',
        icon: 'setting',
        path: '/sys',
        routes: [
          // {
          //   name: 'account',
          //   icon: 'user',
          //   path: '/sys/account-list',
          //   component: './Sys/Account',
          // },
          {
            name: 'bookApiWhitelist',
            icon: 'check-circle',
            path: '/sys/book-apiwhitelist-list',
            component: './Book/bookApiWhitelist/TableList',
          },
        ],
      },
      // {
      //   component: '404',
      // },
    ],
  },
];
