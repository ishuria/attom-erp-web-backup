import { setupVab } from '~/library'
import App from './App.vue'
import { setupI18n } from '/@/i18n'
import { setupRouter } from '/@/router'
import { setupStore } from '/@/store'

const app = createApp(App)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)

/**
 * 刷新恢复方法
 */
const reloadPage = () => {
  const reloadKey = 'vite-reload'

  // 防止无限刷新
  if (sessionStorage.getItem(reloadKey)) {
    return
  }

  sessionStorage.setItem(reloadKey, '1')

  const url = new URL(window.location.href)

  // 添加时间戳，强制重新请求 index.html
  url.searchParams.set('_reload', Date.now().toString())

  window.location.replace(url.toString())
}

/**
 * 全局动态 import 异常兜底
 */
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || ''

  const isChunkLoadFailed =
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Failed to fetch')

  if (isChunkLoadFailed) {
    console.warn('检测到系统资源更新，正在自动恢复页面...')

    reloadPage()
  }
})


app.mount('#app')

/**
 * 页面恢复成功后：
 * 1. 清除刷新标记
 * 2. 清除 URL 上的 _reload 参数
 */
sessionStorage.removeItem('vite-reload')
sessionStorage.removeItem('vite-router-reload')

const url = new URL(window.location.href)

if (url.searchParams.has('_reload')) {
  url.searchParams.delete('_reload')

  window.history.replaceState({}, '', url.toString())
}