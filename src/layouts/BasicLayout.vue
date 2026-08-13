<template>
  <!--#region Layout -->
  <t-layout style="min-height: 100vh; display: flex">
    <!--#region Aside / Sidebar -->
    <t-aside
      :style="{
        width: sidebarStore.collapsed ? '64px' : '232px',
        borderRight: '1px solid var(--td-border-level-1-color)',
        backgroundColor: '#fff',
        boxShadow: '1px 0 10px rgba(0,0,0,0.02)',
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        zIndex: 101,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
      }"
    >
      <t-menu
        :value="activeValue"
        :collapsed="sidebarStore.collapsed"
        style="height: 100%; border-right: none"
        @change="handleMenuChange"
      >
        <template #logo>
          <div
            :style="{
              height: '56px',
              padding: sidebarStore.collapsed ? '0' : '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarStore.collapsed ? 'center' : 'flex-start',
              overflow: 'hidden',
              transition: 'all 0.3s',
            }"
          >
            <div
              :style="{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--td-brand-color-5), var(--td-brand-color-8))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0, 82, 217, 0.2)',
              }"
            >
              <check-circle-icon size="18px" />
            </div>
            <span
              v-if="!sidebarStore.collapsed"
              :style="{
                marginLeft: '12px',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--td-brand-color)',
                whiteSpace: 'nowrap',
                opacity: 1,
                transition: 'opacity 0.3s',
              }"
            >
              临床数据系统
            </span>
          </div>
        </template>

        <!--#region Menu Items -->
        <t-menu-item value="/overview">
          <template #icon><dashboard-icon /></template>
          总览
        </t-menu-item>

        <t-submenu value="/company" title="公司">
          <template #icon><building-icon /></template>
          <t-menu-item value="/company/clean">公司名清洗</t-menu-item>
          <t-menu-item value="/company/database">公司名库</t-menu-item>
        </t-submenu>

        <t-submenu value="/drug" title="药品">
          <template #icon><help-circle-icon /></template>
          <t-menu-item value="/drug/clean">药品名称清洗</t-menu-item>
          <t-menu-item value="/drug/database">药品名库管理</t-menu-item>
        </t-submenu>

        <t-submenu value="/indication" title="适应症">
          <template #icon><check-circle-icon /></template>
          <t-menu-item value="/indication/clean">适应症名称清洗</t-menu-item>
          <t-menu-item value="/indication/database">适应症库管理</t-menu-item>
        </t-submenu>

        <t-submenu value="/center" title="研究中心">
          <template #icon><location-icon /></template>
          <t-menu-item value="/center/clean">研究中心名称清洗</t-menu-item>
          <t-menu-item value="/center/database">研究中心库</t-menu-item>
        </t-submenu>

        <t-submenu value="/trial-phase" title="试验分期">
          <template #icon><time-icon /></template>
          <t-menu-item value="/trial-phase/database">试验分期库管理</t-menu-item>
        </t-submenu>
        <!--#endregion -->
      </t-menu>
    </t-aside>
    <!--#endregion -->

    <!--#region Main Area -->
    <t-layout
      :style="{
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        marginLeft: sidebarStore.collapsed ? '64px' : '232px',
        minHeight: '100%',
        position: 'relative',
        width: `calc(100vw - ${sidebarStore.collapsed ? '64px' : '232px'})`,
      }"
    >
      <!--#region Header -->
      <t-header
        :style="{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--td-border-level-1-color)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: '56px',
        }"
      >
        <div style="flex: 1; display: flex; align-items: center; gap: 16px">
          <t-button
            variant="text"
            shape="square"
            :style="{
              color: 'var(--td-text-color-secondary)',
              transition: 'transform 0.3s',
              transform: sidebarStore.collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
            @click="sidebarStore.toggleCollapsed()"
          >
            <view-list-icon size="20px" />
          </t-button>
          <span
            :style="{
              fontFamily: 'var(--td-font-family-medium)',
              fontSize: '15px',
              color: 'var(--td-text-color-secondary)',
            }"
          >
            {{ activeValue === '/overview' ? '系统总览' : '数据清洗与管理' }}
          </span>
        </div>

        <t-dropdown :options="dropdownOptions" @click="handleDropdownClick">
          <div
            :style="{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#f1f5f9',
              transition: 'all 0.2s',
            }"
          >
            <div
              :style="{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--td-brand-color-2)',
                color: 'var(--td-brand-color-8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px',
              }"
            >
              A
            </div>
            <span style="font-size: 13px; font-weight: 500; color: var(--td-text-color-primary)">管理员</span>
          </div>
        </t-dropdown>
      </t-header>
      <!--#endregion -->

      <!--#region Browsing History Tabs -->
      <div
        v-if="visitedTabs && visitedTabs.length"
        :style="{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          padding: '0 10px 8px',
          overflowX: 'auto',
          backgroundColor: 'var(--td-bg-color-page)',
        }"
      >
        <div
          v-for="tab in visitedTabs"
          :key="tab.path"
          :style="{
            padding: '4px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '20px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: tab.path === activeValue ? 'var(--td-brand-color)' : '#fff',
            color: tab.path === activeValue ? '#fff' : 'var(--td-text-color-secondary)',
            border: '1px solid var(--td-border-level-1-color)',
            transition: 'all 0.2s',
          }"
          @click="handleTabClick(tab.path)"
        >
          {{ tab.title }}
        </div>
      </div>
      <!--#endregion -->

      <!--#region Content -->
      <t-content
        :style="{
          padding: '10px',
          overflow: 'auto',
          backgroundColor: 'var(--td-bg-color-page)',
        }"
      >
        <div
          :style="{
            minHeight: '100%',
            borderRadius: 'var(--td-radius-large)',
            width: '100%',
          }"
        >
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </router-view>
        </div>
      </t-content>
      <!--#endregion -->
    </t-layout>
    <!--#endregion -->
  </t-layout>
  <!--#endregion -->
</template>

<script setup lang="ts">
//#region Imports
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import type { DropdownOption } from 'tdesign-vue-next';
import { useSidebarStore } from '@/store/sidebar';
import { useAuthStore } from '@/store/auth';
import {
  DashboardIcon,
  BuildingIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  LocationIcon,
  TimeIcon,
  ViewListIcon,
} from 'tdesign-icons-vue-next';
//#endregion

//#region Stores & Router
const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
//#endregion

//#region Computed
const activeValue = computed(() => route.path);
//#endregion

//#region Browsing History Tabs
const titleMap: Record<string, string> = {
  '/overview': '总览',
  '/company/clean': '公司名清洗',
  '/company/database': '公司名库',
  '/drug/clean': '药品名称清洗',
  '/drug/database': '药品名库管理',
  '/indication/clean': '适应症名称清洗',
  '/indication/database': '适应症库管理',
  '/center/clean': '研究中心名称清洗',
  '/center/database': '研究中心库',
  '/trial-phase/database': '试验分期库管理',
};

const visitedTabs = ref<{ path: string; title: string }[]>([]);

// 记录浏览历史：路由变化时将页面加入记录（keep-alive 缓存该页面）
watch(
  () => route.path,
  (path) => {
    if (!path) return;
    if (!visitedTabs.value.some((tab) => tab.path === path)) {
      visitedTabs.value.push({ path, title: titleMap[path] || path });
    }
  },
  { immediate: true },
);

function handleTabClick(path: string) {
  if (path !== route.path) {
    router.push(path);
  }
}
//#endregion

//#region Dropdown Options
const dropdownOptions: DropdownOption[] = [
  {
    content: '退出登录',
    value: 'logout',
  },
];
//#endregion

//#region Handlers
function handleMenuChange(value: string | number) {
  router.push(value as string);
}

function handleDropdownClick(data: { value: string | number }) {
  if (data.value === 'logout') {
    authStore.clearToken();
    MessagePlugin.success('已退出登录');
    router.replace('/login');
  }
}
//#endregion
</script>
