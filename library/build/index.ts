import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import chokidar from 'chokidar'
import pc from 'picocolors'
import dayjs from 'dayjs'

import { createPwa } from './pwa/'
import { createMock } from './mock/'
import { createUnPlugin } from './unplugin/'
import { createSvgIcons } from './svgSprite/'
import { createProgress } from './progress/'
import { createBanner } from './banner/'

const viteApp = 'VITE_' + 'APP_'
const viteUser = 'VITE_' + 'USER_'

export function createVitePlugin(env: Record<string, string>) {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]
  const isEmpty = (value: any) => {
    return value == undefined || value == '' || value == null
  }
  if (isEmpty(userName) || isEmpty(secretKey)) return
  if (nodeEnv !== 'development')
    if (isEmpty(userName) || isEmpty(secretKey)) return
  vitePlugins.push(createProgress(env) as any)
  vitePlugins.push(createUnPlugin(env))
  vitePlugins.push(createPwa())
  vitePlugins.push(createMock())
  vitePlugins.push(createSvgIcons())
  vitePlugins.push(createBanner())
  return vitePlugins
}

export function createWatch(
  env: Record<string, string>,
  setting: Record<string, string>
) {
  //为了防止新同事忘记配置授权码而造成项目无法打包，请保留以下提示
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]

  if (nodeEnv === 'production') {
    if (userName === 'test' || secretKey === 'preview')
      console.log(
        `${pc.red(
          '检测到您的用户名或key未配置，key在购买时通过邮件邀请函发放，如您请仔细阅读文档并进行配置，配置完成后方可打包使用。购买地址：https://vue-admin-beautiful.com/authorization/shop-vite.html'
        )}`
      )
    process.exit()
  }

  chokidar.watch('./src').on('change', (path) => {
    if (path.endsWith('vue')) {
      console.log(
        `\n${pc.gray(dayjs().format('HH:mm:ss'))} ${pc.cyan(
          '[Vue Sh' + 'op Vite]'
        )} ${pc.cyan(`http://localhost:${setting['devPort']}/`)} ${pc.green(
          'update success'
        )} `
      )
    }
  })
}
