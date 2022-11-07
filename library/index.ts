import type { App } from 'vue'
// 加载雪碧图
import 'virtual:svg-icons-register'
// 加载全局样式样式
import './styles/vab.scss'
import { createHead } from '@vueuse/head'

export function setupVab(app: App<Element>) {
  app.use(createHead())
  // 加载背景
  const Themes = import.meta.globEager('./styles/background/*.scss')
  Object.values(Themes)

  // 加载插件
  const Plugins = import.meta.globEager('./plugins/*.ts')
  Object.getOwnPropertyNames(Plugins).forEach((key) => {
    const plugin: any = Plugins[key]
    app.use(plugin.default)
  })
}
