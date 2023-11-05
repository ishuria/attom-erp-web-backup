import App from './App.vue'
import VXETable from 'vxe-table'
import ElementPlus from 'element-plus'
import { setupVab } from '~/library'
import { setupI18n } from '/@/i18n'
import { setupRouter } from '/@/router'
import { setupStore } from '/@/store'

const app = createApp(App)
app.use(ElementPlus).use(VXETable)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
