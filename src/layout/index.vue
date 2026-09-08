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
        <!--
          注意：不能给 transition 加 mode="out-in"。
          keep-alive 缓存页面被切换时，旧的缓存节点离开过渡无法结束，会导致新页面永远不进入（白屏，需刷新）。
          这里使用进入淡入、离开即时（无 leave 动画）的过渡，避免卡住。
        -->
        <router-view v-slot="{ Component, route: currentRoute }">
          <transition name="page-fade">
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
import { useAppStore } from '@/store'
import { useTagsViewStore } from '@/store/tagsView'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import RouteTags from './components/RouteTags.vue'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
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

// #region 页面切换过渡（进入淡入、离开即时）
// 过渡 class 作用于被切换页面组件的根节点，因此需要穿透到子作用域
:deep(.page-fade-enter-active) {
  transition: opacity 0.25s ease;
}

:deep(.page-fade-enter-from),
:deep(.page-fade-leave-to) {
  opacity: 0;
}

// 离开不播放动画，避免 out-in 挂起 / 新旧表格重叠
:deep(.page-fade-leave-active) {
  transition: none;
}
// #endregion
</style>
