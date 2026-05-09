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

// 【兜底机制-更新失败】监听 chunk 加载失败
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || ''

  console.log('message', message)

  const isChunkLoadFailed =
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Failed to fetch')

  console.log('isChunkLoadFailed', isChunkLoadFailed)

  if (isChunkLoadFailed) {
    console.warn('检测到系统版本更新，正在刷新页面...')

    const reloadKey = 'vite-reload'

    // 防止无限刷新
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1')

      // 不要 reload
      location.replace(`${location.origin}${location.pathname}`)
    }
  }
})

app.mount('#app')

// 页面正常启动后清除
sessionStorage.removeItem('vite-reload')
sessionStorage.removeItem('vite-router-reload')
