import { createApp } from 'vue'
import App from './App.vue'

import { setupVab } from '~/library'
import { setupStore } from '/@/store'
import { setupRouter } from '/@/router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
// 请勿在vite中使用ElementPlusResolver自动导入，慢到怀疑人生，每个页面打开至少5分钟，请直接使用全局引入即可
app.use(ElementPlus)

setupVab(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
