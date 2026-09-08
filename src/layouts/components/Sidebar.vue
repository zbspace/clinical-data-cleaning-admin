<template>
  <div class="sidebar">
    <!-- Logo -->
    <div
      class="sidebar-logo h-64px flex items-center justify-center px-20px cursor-pointer overflow-hidden transition-all duration-300"
      :class="appStore.sidebarCollapsed ? 'justify-center px-0' : 'justify-start'"
      @click="router.push('/')"
    >
      <div v-show="!appStore.sidebarCollapsed" class="flex flex-col whitespace-nowrap overflow-hidden">
        <span class="font-500 mt-2px"> 临床数据清洗 </span>
      </div>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :collapse-transition="false"
      :router="true"
      :unique-opened="true"
    >
      <template v-for="item in menuList" :key="item.path">
        <el-menu-item v-if="!item.children?.length" :index="item.path">
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>

        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon v-if="item.meta?.icon">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta?.title }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  const { meta, path } = route;
  // 如果设置了 meta.activeMenu，则高亮指定的菜单项
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

// 从路由中提取侧边栏菜单
const menuList = computed(() => {
  const layoutRoute = router.options.routes.find((r) => r.name === 'Layout');
  if (!layoutRoute?.children) return [];

  // 过滤一级菜单
  return layoutRoute.children
    .filter((r) => r.meta?.title && !r.meta.hidden)
    .map((r) => ({
      ...r,
      // 过滤二级菜单
      children: r.children?.filter((child) => child.meta?.title && !child.meta.hidden),
    }));
});
</script>

<style scoped lang="scss">
.sidebar {
  user-select: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
}

.sidebar-logo {
  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &__title {
    color: var(--el-text-color-primary);
  }

  &__subtitle {
    color: var(--el-text-color-secondary);
  }
}

.el-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
}

// 菜单选中/悬停状态跟随主题色与明暗模式
:deep(.el-menu-item) {
  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &.is-active {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
