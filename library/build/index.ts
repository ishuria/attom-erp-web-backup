import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createPwa } from './pwa/'
import { createMock } from './mock/'
import { createUnPlugin } from './unplugin/'
import { createSvgIcons } from './svgSprite/'

export function createVitePlugin() {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]

  vitePlugins.push(createPwa())
  vitePlugins.push(createMock())
  vitePlugins.push(createUnPlugin())
  vitePlugins.push(createSvgIcons())

  return vitePlugins
}
