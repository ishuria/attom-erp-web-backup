import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createPwa } from './pwa/'
import { createMock } from './mock/'
import { createUnPlugin } from './unplugin/'
import { createSvgIcons } from './svgSprite/'
import { createProgress } from './progress/'
import { createBanner } from './banner/'

export function createVitePlugin(env: Record<string, string>) {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]
  const viteApp = 'VITE_' + 'APP_'
  const viteUser = 'VITE_' + 'USER_'
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV `]
  const isEmpty = (value: any) => {
    return value == undefined || value == '' || value == null
  }
  if (isEmpty(userName) || isEmpty(secretKey)) return
  if (nodeEnv !== 'development')
    if (isEmpty(userName) || isEmpty(secretKey)) return
  vitePlugins.push(createProgress(env) as any)
  vitePlugins.push(createUnPlugin())
  vitePlugins.push(createPwa())
  vitePlugins.push(createMock())
  vitePlugins.push(createSvgIcons())
  vitePlugins.push(createBanner())
  return vitePlugins
}
