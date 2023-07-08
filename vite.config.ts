import { basename, resolve } from 'path'
import type { UserConfig, ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugin, createWatch } from '/@vab/build'
import dayjs from 'dayjs'
import { name, version, dependencies, devDependencies } from './package.json'
import {
  base,
  port,
  open,
  outDir,
  assetsDir,
  chunkSizeWarningLimit,
  cssCodeSplit,
  reportCompressedSize,
} from '/@/config'

const info = {
  name,
  version,
  dependencies,
  devDependencies,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  process.env['VITE_APP_UPDATE_TIME'] = info.lastBuildTime
  process.env['VITE_USER_NODE_ENV'] = mode
  const root = process.cwd()
  const env = loadEnv(mode, root)
  createWatch(env)

  return {
    base,
    root,
    server: {
      open,
      port,
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
      outDir,
      assetsDir,
      chunkSizeWarningLimit,
      cssCodeSplit,
      reportCompressedSize,
      rollupOptions: {
        onwarn: () => {
          return
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          require('autoprefixer')({ grid: true }),
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === 'charset') atRule.remove()
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
      devSourcemap: true,
    },
    plugins: createVitePlugin(env),
  }
})
