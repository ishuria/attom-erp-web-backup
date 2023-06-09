import { basename, resolve } from 'path'
import type { UserConfig, ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugin } from '/@vab/build'
import setting from './src/config'
import dayjs from 'dayjs'
import { name, version, dependencies, devDependencies } from './package.json'

const info = {
  name,
  version,
  dependencies,
  devDependencies,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}
process.env.VITE_APP_UPDATE_TIME = info.lastBuildTime

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  //为了防止忘记配置而造成项目无法打包，请保留以下提示
  const userName = env[`VITE_APP_GITHUB_USER_NAME`]
  const secretKey = env[`VITE_APP_SECRET_KEY`]
  const nodeEnv = env[`VITE_USER_NODE_ENV`]
  if (nodeEnv === 'production')
    if (userName === 'test' && secretKey === 'preview')
      console.log(
        '检测到您的用户名和key未配置，key在购买时通过邮件邀请函发放，请仔细阅读文档并进行配置'
      )

  return {
    base: setting['publicPath'],
    root,
    server: {
      open: true,
      port: setting['port'],
      hmr: {
        overlay: true,
      },
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, '.')}/`,
        '/@/': `/${resolve(__dirname, 'src')}/`,
        '/@vab/': `/${resolve(__dirname, 'library')}/`,
        '/@types/': `/${resolve(__dirname, 'src/types')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    build: {
      chunkSizeWarningLimit: 20480,
    },
    css: {
      // https://github.com/vitejs/vite/issues/6333
      postcss: {
        plugins: [
          require('autoprefixer')({ grid: true }),
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
      preprocessorOptions: {
        scss: {
          additionalData(content: string, loaderContext: string) {
            return ['variables.scss'].includes(basename(loaderContext))
              ? content
              : `@use "~/library/styles/variables.scss" as *;${content}`
          },
        },
      },
    },
    plugins: createVitePlugin(env),
  }
})
