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

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  console.log(mode, command, env)
  return {
    base: setting['publicPath'],
    root,
    server: {
      open: true,
      port: setting['port'],
      hmr: {
        overlay: true,
      },
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
      chunkSizeWarningLimit: 2048,
    },
    css: {
      // https://github.com/vitejs/vite/issues/6333
      postcss: {
        plugins: [
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
              : '@use "sass:math";@import "~/library/styles/variables.scss";' +
                  content
          },
        },
      },
    },
    plugins: createVitePlugin(env),
  }
})
