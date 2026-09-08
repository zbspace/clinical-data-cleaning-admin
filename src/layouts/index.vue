<template>
  <el-container class="layout-container wh-full">
    <!-- 左侧边栏 -->
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="layout-aside">
      <Sidebar />
    </el-aside>

    <el-container>
      <!-- 头部 -->
      <el-header class="layout-header">
        <Header />
      </el-header>

      <!-- 路由标签页 -->
      <RouteTags />

      <!-- 主内容区（keep-alive 缓存已打开的页面） -->
      <el-main class="layout-main">
        <!-- #region 页面切换过渡与缓存 -->
        <router-view v-slot="{ Component, route: currentRoute }">
          <transition name="el-fade-in-linear" mode="out-in">
            <keep-alive :include="tagsViewStore.cachedViews">
              <component :is="Component" :key="currentRoute.path" />
            </keep-alive>
          </transition>
        </router-view>
        <!-- #endregion -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { useTagsViewStore } from '@/store/tagsView';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import RouteTags from './components/RouteTags.vue';

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: var(--el-bg-color);
  transition: width 0.3s ease;
  overflow: hidden;
}

.layout-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 56px;
}

.layout-main {
  // background-color: var(--el-fill-color-lighter);
  padding: 0;
  overflow-y: auto;
}
</style>
