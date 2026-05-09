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

// [兜底机制-更新失败] 检测到系统版本更新，正在自动刷新...
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason

  // 判断是否为动态导入模块失败（Chunk 加载失败）
  if (
    reason instanceof TypeError &&
    (reason.message.includes('Failed to fetch dynamically imported module') ||
      reason.message.includes('Failed to fetch'))
  ) {
    console.warn('检测到系统版本更新，正在自动刷新...')
    // 强制刷新页面，获取最新的 index.html 和 JS 文件
    window.location.reload()
  }
})

app.mount('#app')
