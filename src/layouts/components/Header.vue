<template>
  <div class="header flex-between">
    <div class="header-left flex-center">
      <!-- 折叠按钮 -->
      <el-icon class="collapse-btn" :size="20" @click="appStore.toggleSidebar()">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta?.title">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right flex-center">
      <!-- 版本号 -->
      <span class="text-14px c-#999 dark:c-#666">V{{ version }}</span>

      <!-- #region 主题设置 -->
      <ThemeSettings />
      <!-- #endregion -->

      <!-- #region 用户信息 -->
      <el-dropdown trigger="click">
        <div
          class="user-info flex items-center cursor-pointer p-4px rounded-4px hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <el-avatar :size="32" icon="UserFilled" class="mr-8px" />
          <div class="flex flex-col items-start leading-tight">
            <span class="username text-14px font-500 text-gray-700 dark:text-gray-200"> 管理员 </span>
          </div>
          <el-icon class="ml-8px text-12px text-gray-400"><ArrowDown /></el-icon>
        </div>
      </el-dropdown>
      <!-- #endregion -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import pkg from '../../../package.json';
import ThemeSettings from './ThemeSettings.vue';

const route = useRoute();
const appStore = useAppStore();
const version = pkg.version;
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
}

.header-left {
  gap: 16px;
}

.collapse-btn {
  cursor: pointer;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  gap: 14px;
}

.user-info {
  /* #region 用户信息样式 */
  &:hover {
    .username {
      color: var(--el-color-primary);
    }
  }
  /* #endregion */
}
</style>
