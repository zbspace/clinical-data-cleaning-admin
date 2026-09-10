//#region Imports
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AuthRoute from '@/components/AuthRoute.vue';
import BasicLayout from '@/layouts/BasicLayout.vue';
//#endregion

//#region Routes Configuration
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    component: AuthRoute,
    children: [
      {
        path: '',
        component: BasicLayout,
        children: [
          { path: '', redirect: '/overview' },
          {
            path: '/overview',
            name: 'Overview',
            component: () => import('@/pages/overview/index.vue'),
          },
          {
            path: '/company/clean',
            name: 'CompanyClean',
            component: () => import('@/pages/Company/Clean.vue'),
          },
          {
            path: '/company/database',
            name: 'CompanyDatabase',
            component: () => import('@/pages/Company/Database.vue'),
          },
          {
            path: '/drug/clean',
            name: 'DrugClean',
            component: () => import('@/pages/Drug/Clean.vue'),
          },
          {
            path: '/drug/database',
            name: 'DrugDatabase',
            component: () => import('@/pages/Drug/Database.vue'),
          },
          {
            path: '/indication/clean',
            name: 'IndicationClean',
            component: () => import('@/pages/Indication/Clean.vue'),
          },
          {
            path: '/indication/database',
            name: 'IndicationDatabase',
            component: () => import('@/pages/Indication/Database.vue'),
          },
          {
            path: '/center/clean',
            name: 'CenterClean',
            component: () => import('@/pages/Center/Clean.vue'),
          },
          {
            path: '/center/database',
            name: 'CenterDatabase',
            component: () => import('@/pages/Center/Database.vue'),
          },
          {
            path: '/trial-phase/database',
            name: 'TrialPhaseDatabase',
            component: () => import('@/pages/TrialPhase/Database.vue'),
          },
          {
            path: '/client/user',
            name: 'ClientUser',
            component: () => import('@/pages/Client/User.vue'),
          },
          {
            path: '/client/trial-apply',
            name: 'ClientTrialApply',
            component: () => import('@/pages/Client/TrialApply.vue'),
          },
        ],
      },
    ],
  },
];
//#endregion

//#region Router Instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局导航守卫：未登录访问受保护页面时，先跳转登录页（避免页面闪烁）
router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (!token && to.path !== '/login') {
    return '/login';
  }
  if (token && to.path === '/login') {
    return '/overview';
  }
});
//#endregion

export default router;
