import type { App } from 'vue'
// 加载雪碧图
import 'virtual:svg-icons-register'
// 加载全局样式样式
import './styles/vab.scss'
import { createHead } from '@vueuse/head'

export function setupVab(app: App<Element>) {
  app.use(createHead())

  // 加载插件
  const Plugins = import.meta.glob('./plugins/*.ts', { eager: true })
  Object.getOwnPropertyNames(Plugins).forEach((key) => {
    const plugin: any = Plugins[key]
    app.use(plugin.default)
  })
}
