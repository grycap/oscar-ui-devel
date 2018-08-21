export default [

  {
    path: '*',
    meta: {
      public: true
    },
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/404',
    meta: {
      public: true
    },
    name: 'NotFound',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/sys/NotFound.vue`
    )
  },
  {
    path: '/403',
    meta: {
      public: true
    },
    name: 'AccessDenied',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/sys/Deny.vue`
    )
  },
  {
    path: '/500',
    meta: {
      public: true
    },
    name: 'ServerError',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/sys/Error.vue`
    )
  },
  {
    path: '/login',
    meta: {
      public: true
    },
    name: 'Login',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/Login.vue`
    )
  },
  {
    path: '/',
    meta: {},
    name: 'Root',
    redirect: {
      name: 'Dashboard'
    }
  },
  {
    path: '/dashboard',
    meta: {
      public: false,
      breadcrumb: [
        {name: 'Dashboard', link: 'Dashboard', disabled: true}
      ]
    },
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/Dashboard.vue`
    )
  },
  {
    path: '/functions',
    meta: {
      public: false,
      breadcrumb: [
        {name: 'Functions', link: 'Functions', disabled: true}
      ]
    },
    name: 'Functions',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/Functions.vue`
    )
  },
  {
    path: '/storage',
    meta: {
      public: false,
      breadcrumb: [
        {name: 'Storage', link: 'Storage', disabled: true}
      ]
    },
    name: 'Storage',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/views/Storage.vue`
    )
  }
]
