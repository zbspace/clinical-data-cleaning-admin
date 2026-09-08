import axios from 'axios'
import { ElMessage } from 'element-plus'

/** 节流函数 */
export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) return
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }) as T
}

/** 防抖函数 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }) as T
}

// #region 格式化工具
/** 字节数格式化为可读文本（B/KB/MB/GB） */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, i)
  return `${value >= 100 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`
}

/** 秒数格式化为可读时长（X天X小时X分） */
export function formatUptime(seconds: number): string {
  if (!seconds || seconds < 0) return '-'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days} 天 ${hours} 小时 ${minutes} 分`
  if (hours > 0) return `${hours} 小时 ${minutes} 分`
  return `${minutes} 分`
}
// #endregion

// #region 文件导出
/**
 * 导出文件（Excel 等二进制流下载）
 * @param url 接口地址
 * @param params 请求参数
 * @param method 请求方式，默认 get
 */
export const exportExcel = (
  url: string,
  params: Record<string, any> = {},
  method: 'get' | 'post' = 'get',
) => {
  return axios
    .request({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      url,
      method,
      responseType: 'blob',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      data: method === 'post' ? params : undefined,
      params: method === 'post' ? undefined : params,
    })
    .then(async (res) => {
      const data = res.data as Blob
      // 服务端异常时返回的是 JSON 错误信息，解析后提示用户
      if (data.type.includes('application/json')) {
        const text = await data.text()
        try {
          const err = JSON.parse(text)
          ElMessage.error(err?.resultMsg || err?.message || '导出失败')
        } catch {
          ElMessage.error('导出失败')
        }
        return
      }
      const fileName = getFileNameFromHeaders(res.headers)
      downloadBlob(data, fileName)
    })
    .catch((error) => {
      console.error('导出失败:', error)
      ElMessage.error('导出失败，请稍后重试')
    })
}

/** 从响应头解析文件名（优先兼容 filename*，其次是 filename，缺失时用时间戳兜底） */
const getFileNameFromHeaders = (headers: Record<string, any>): string => {
  const disposition = headers?.['content-disposition'] as string | undefined
  if (!disposition) return `export-${Date.now()}.xlsx`
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match) return decodeURIComponent(utf8Match[1])
  const plainMatch = disposition.match(/filename="?([^";]+)"?/i)
  if (plainMatch) return plainMatch[1]
  return `export-${Date.now()}.xlsx`
}

/** 触发浏览器下载 */
const downloadBlob = (blob: Blob, fileName: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
// #endregion

// #region 剪贴板复制
/**
 * 复制文本到剪贴板
 * 非 HTTPS 环境下 navigator.clipboard 不可用，自动降级为 execCommand
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 优先使用异步 Clipboard API（需 HTTPS 或 localhost）
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 权限被拒绝时继续走降级方案
    }
  }
  try {
    fallbackCopy(text)
    return true
  } catch {
    return false
  }
}

/** 复制降级方案（非 HTTPS 环境） */
const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
// #endregion
