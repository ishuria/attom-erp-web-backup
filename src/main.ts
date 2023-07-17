import App from './App.vue'

import { setupVab } from '~/library'
import { setupI18n } from '/@/i18n'
import { setupStore } from '/@/store'
import { setupRouter } from '/@/router'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
