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
    component: () => import('@/pages/Login/index.vue'),
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
            component: () => import('@/pages/Overview/index.vue'),
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
        ],
      },
    ],
  },
];
//#endregion

//#region Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});
//#endregion

export default router;
