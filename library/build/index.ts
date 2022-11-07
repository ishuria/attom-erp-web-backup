import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createPwa } from './pwa/'
import { createMock } from './mock/'
import { createUnPlugin } from './unplugin/'
import { createSvgIcons } from './svgSprite/'
import { createElementPlus } from './elementPlus/'
import { createVueAdvanced } from './vueAdvanced/'

export function createVitePlugin() {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]

  vitePlugins.push(createPwa())
  vitePlugins.push(createMock())
  vitePlugins.push(createUnPlugin())
  vitePlugins.push(createSvgIcons())
  vitePlugins.push(createElementPlus())
  vitePlugins.push(createVueAdvanced())

  return vitePlugins
}
