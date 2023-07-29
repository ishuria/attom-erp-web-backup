import App from './App.vue'

import ElementPlus from 'element-plus'
import { setupVab } from '~/library'
import { setupI18n } from '/@/i18n'
import { setupRouter } from '/@/router'
import { setupStore } from '/@/store'

const app = createApp(App)
app.use(ElementPlus)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
