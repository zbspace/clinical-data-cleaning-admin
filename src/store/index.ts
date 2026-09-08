import { defineStore } from 'pinia'
import { ref } from 'vue'

// 预设主题色
export const themeColors = [
  { name: '默认蓝', value: '#409eff' },
  { name: '极光绿', value: '#00d68f' },
  { name: '日落橙', value: '#fa8c16' },
  { name: '玫瑰红', value: '#f5222d' },
  { name: '星河紫', value: '#722ed1' },
  { name: '深海蓝', value: '#1890ff' },
]

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const darkMode = ref(localStorage.getItem('theme-dark') === 'true')
  const primaryColor = ref(localStorage.getItem('theme-primary') || '#409eff')

  // 同步主题到 html
  function applyTheme() {
    const html = document.documentElement
    if (darkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    html.style.setProperty('--el-color-primary', primaryColor.value)
    // 持久化
    localStorage.setItem('theme-dark', String(darkMode.value))
    localStorage.setItem('theme-primary', primaryColor.value)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    applyTheme()
  }

  function setPrimaryColor(color: string) {
    primaryColor.value = color
    applyTheme()
  }

  // 初始化时应用
  applyTheme()

  return {
    sidebarCollapsed,
    darkMode,
    primaryColor,
    toggleSidebar,
    toggleDarkMode,
    setPrimaryColor,
    applyTheme,
  }
})
