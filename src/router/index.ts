import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('@/pages/overview/index.vue'),
    meta: { title: '概览', icon: 'DataAnalysis', affix: true },
  },
  {
    path: '/company',
    name: 'Company',
    meta: { title: '公司', icon: 'OfficeBuilding' },
    children: [
      {
        path: '/company/clean',
        name: 'CompanyClean',
        component: () => import('@/pages/company/clean/index.vue'),
        meta: { title: '公司名清洗' },
      },
      {
        path: '/company/database',
        name: 'CompanyDatabase',
        component: () => import('@/pages/company/database/index.vue'),
        meta: { title: '公司名库' },
      },
    ],
  },
  {
    path: '/drug',
    name: 'Drug',
    meta: { title: '药品', icon: 'Sugar' },
    children: [
      {
        path: '/drug/clean',
        name: 'DrugClean',
        component: () => import('@/pages/drug/clean/index.vue'),
        meta: { title: '药品名清洗' },
      },
      {
        path: '/drug/database',
        name: 'DrugDatabase',
        component: () => import('@/pages/drug/database/index.vue'),
        meta: { title: '药品名库' },
      },
    ],
  },
  {
    path: '/indication',
    name: 'Indication',
    meta: { title: '适应症', icon: 'Memo' },
    children: [
      {
        path: '/indication/clean',
        name: 'IndicationClean',
        component: () => import('@/pages/indication/clean/index.vue'),
        meta: { title: '适应症清洗' },
      },
      {
        path: '/indication/database',
        name: 'IndicationDatabase',
        component: () => import('@/pages/indication/database/index.vue'),
        meta: { title: '适应症库' },
      },
    ],
  },
  {
    path: '/center',
    name: 'Center',
    meta: { title: '研究中心', icon: 'FirstAidKit' },
    children: [
      {
        path: '/center/clean',
        name: 'CenterClean',
        component: () => import('@/pages/indication/clean/index.vue'),
        meta: { title: '研究中心清洗' },
      },
      {
        path: '/center/database',
        name: 'CenterDatabase',
        component: () => import('@/pages/center/database/index.vue'),
        meta: { title: '研究中心库' },
      },
    ],
  },
  {
    path: '/trial-phase',
    name: 'TrialPhase',
    meta: { title: '试验分期', icon: 'Calendar' },
    children: [
      {
        path: '/trial-phase/database',
        name: 'TrialPhaseDatabase',
        component: () => import('@/pages/trial-phase/database/index.vue'),
        meta: { title: '试验分期库' },
      },
    ],
  },
  {
    path: '/client',
    name: 'Client',
    meta: { title: '客户端', icon: 'User' },
    children: [
      {
        path: '/client/user',
        name: 'ClientUser',
        component: () => import('@/pages/client/user/index.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: '/client/trial-apply',
        name: 'ClientTrialApply',
        component: () => import('@/pages/client/trial-apply/index.vue'),
        meta: { title: '试用申请' },
      },
    ],
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/overview',
    name: 'Layout',
    children: menuRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/notFound.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  // base 需与 vite.config.ts 的 base: '/admin/' 保持一致
  history: createWebHistory('/admin/'),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return '/login'
  }
  if (token && to.path === '/login') {
    return '/overview'
  }
})

export default router
