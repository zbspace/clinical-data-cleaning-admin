<template>
  <div class="route-tags">
    <!-- 标签列表 -->
    <div class="route-tags__scroll" @wheel.prevent="handleWheel">
      <div
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        class="tag-item"
        :class="{ 'tag-item--active': isActive(tag) }"
        @click="switchTo(tag)"
      >
        <span class="tag-item__dot"></span>
        <span class="tag-item__title">{{ tag.title }}</span>
        <el-icon
          v-if="!tag.affix"
          class="tag-item__close"
          :size="12"
          @click.stop="handleClose(tag)"
        >
          <Close />
        </el-icon>
      </div>
    </div>

    <!-- 批量操作 -->
    <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
      <span class="route-tags__action" @click.prevent>
        <el-icon><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">关闭其他标签</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭所有标签</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
// #region 依赖与状态
import { watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close, ArrowDown } from '@element-plus/icons-vue'
import { useTagsViewStore, type TagView } from '@/store/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
// #endregion

// #region 标签交互
/** 当前标签是否激活 */
const isActive = (tag: TagView) => tag.path === route.path

/** 点击标签快速切换 */
const switchTo = (tag: TagView) => {
  if (!isActive(tag)) router.push(tag.fullPath)
}

/** 关闭单个标签（固定标签不可关闭） */
const handleClose = (tag: TagView) => {
  if (tag.affix) return
  tagsViewStore.delView(tag)
  // 关闭的是当前页时，自动跳转到最后一个标签
  if (isActive(tag)) toLastView()
}

/** 批量操作：关闭其他 / 关闭全部 */
const handleCommand = (command: string) => {
  if (command === 'closeOthers') {
    const activeTag = tagsViewStore.visitedViews.find((view) => view.path === route.path)
    activeTag && tagsViewStore.delOthersViews(activeTag)
    return
  }
  tagsViewStore.delAllViews()
  // 当前页标签被关闭时跳转到剩余标签
  if (!tagsViewStore.visitedViews.some((view) => view.path === route.path)) {
    toLastView()
  }
}

/** 跳转到最后一个打开的标签 */
const toLastView = () => {
  const { visitedViews } = tagsViewStore
  const last = visitedViews[visitedViews.length - 1]
  router.push(last ? last.fullPath : '/dashboard')
}

/** 鼠标滚轮横向滚动标签列表 */
const handleWheel = (e: WheelEvent) => {
  const el = e.currentTarget as HTMLElement
  el.scrollLeft += e.deltaY
}
// #endregion

// #region 页面记录与自动滚动
// 路由变化时将页面加入标签记录
watch(
  () => route.fullPath,
  () => tagsViewStore.addView(route),
  { immediate: true },
)

// 激活标签变化后自动滚动到可视区域
watch(
  () => route.path,
  async () => {
    await nextTick()
    document
      .querySelector('.route-tags .tag-item--active')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  },
)
// #endregion
</script>

<style scoped lang="scss">
.route-tags {
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  user-select: none;
  flex-shrink: 0;

  &__scroll {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 100%;
    color: var(--el-text-color-regular);
    border-left: 1px solid var(--el-border-color-light);
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  height: 26px;
  padding: 0 10px;
  font-size: 13px;
  line-height: 1;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--el-color-primary);

    .tag-item__close {
      display: inline-flex;
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    background: var(--el-text-color-placeholder);
    border-radius: 50%;
  }

  &__title {
    white-space: nowrap;
  }

  &__close {
    display: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      background: var(--el-color-primary-light-8);
    }
  }

  &.tag-item--active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-5);

    .tag-item__dot {
      background: var(--el-color-primary);
    }

    .tag-item__close {
      display: inline-flex;
    }
  }
}
</style>
