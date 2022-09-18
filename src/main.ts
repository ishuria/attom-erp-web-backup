import { createApp } from 'vue'
import App from './App.vue'

import { setupVab } from '~/library'
import { setupStore } from '/@/store'
import { setupRouter } from '/@/router'

const app = createApp(App)

setupVab(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
