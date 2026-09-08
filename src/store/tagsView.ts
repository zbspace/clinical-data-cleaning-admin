// 标签页管理
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// #region 标签类型定义
export interface TagView {
  /** 路由路径 */
  path: string
  /** 完整路径（含 query） */
  fullPath: string
  /** 路由名称（与缓存组件 name 对应） */
  name: string
  /** 标签标题 */
  title: string
  /** 固定标签，不可关闭 */
  affix?: boolean
  /** 是否参与 keep-alive 缓存 */
  cached?: boolean
}
// #endregion

type RouteView = RouteLocationNormalizedLoaded

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    // #region 标签状态
    /** 已打开的页面标签 */
    visitedViews: [] as TagView[],
    /** 需要被 keep-alive 缓存的组件名称 */
    cachedViews: [] as string[],
    // #endregion
  }),

  actions: {
    // #region 添加标签
    /** 路由变化时记录新标签 */
    addView(route: RouteView) {
      // 无标题的路由（如布局页）不生成标签
      if (!route.meta?.title) return
      // 同一路径仅保留一个标签，必要时刷新标题与完整路径
      const existing = this.visitedViews.find((view) => view.path === route.path)
      if (existing) {
        existing.title = (route.meta.title as string) || existing.title
        existing.fullPath = route.fullPath
        return
      }
      const tag: TagView = {
        path: route.path,
        fullPath: route.fullPath,
        name: (route.name as string) || '',
        title: route.meta.title as string,
        affix: !!route.meta.affix,
        cached: !route.meta.noCache && !!route.name,
      }
      this.visitedViews.push(tag)
      this.updateCachedViews()
    },
    // #endregion

    // #region 删除标签
    /** 删除单个标签 */
    delView(tag: TagView) {
      this.visitedViews = this.visitedViews.filter((view) => view.path !== tag.path)
      this.updateCachedViews()
    },

    /** 仅保留当前标签与固定标签 */
    delOthersViews(tag: TagView) {
      this.visitedViews = this.visitedViews.filter((view) => view.affix || view.path === tag.path)
      this.updateCachedViews()
    },

    /** 关闭除固定标签外的全部标签 */
    delAllViews() {
      this.visitedViews = this.visitedViews.filter((view) => view.affix)
      this.updateCachedViews()
    },
    // #endregion

    // #region 同步缓存列表
    /** 根据已打开标签重新计算需要 keep-alive 缓存的组件名称 */
    updateCachedViews() {
      const cached = new Set<string>()
      this.visitedViews.forEach((view) => {
        if (view.cached && view.name) cached.add(view.name)
      })
      this.cachedViews = [...cached]
    },
    // #endregion
  },
})
