import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'

import { createPwa } from './pwa/'
import { createMock } from './mock/'
import { createUnPlugin } from './unplugin/'
import { createSvgIcons } from './svgSprite/'
//import { createElementPlus } from './elementPlus/'

export function createVitePlugin(env: Record<string, string>) {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]

  vitePlugins.push(OptimizationPersist())
  vitePlugins.push(PkgConfig())
  vitePlugins.push(createPwa())
  vitePlugins.push(createMock())
  vitePlugins.push(createUnPlugin(env))
  vitePlugins.push(createSvgIcons())
  // vitePlugins.push(createElementPlus())

  return vitePlugins
}
