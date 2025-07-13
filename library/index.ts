import { createHead } from '@vueuse/head'
// import ElementPlus from 'element-plus'
import { validateAppSecurity } from 'core-security'
import 'virtual:svg-icons-register'
import { VabIcon } from 'vsv-icon'
import type { App } from 'vue'
import './styles/vab.scss'

validateAppSecurity()

export const setupVab = (app: App<Element>) => {
  // app.use(ElementPlus)
  app.use(createHead())
  app.component('VabIcon', VabIcon)
  const Plugins = import.meta.glob('./plugins/*.ts', { eager: true })
  Object.getOwnPropertyNames(Plugins).forEach((key) => {
    const plugin: any = Plugins[key]
    app.use(plugin.default)
  })
}
