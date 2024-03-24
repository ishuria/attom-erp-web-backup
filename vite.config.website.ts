import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import {
  assetsDir,
  base,
  chunkSizeWarningLimit,
  cssCodeSplit,
  exclude,
  https,
  include,
  open,
  outDir,
  port,
  reportCompressedSize,
} from '/@/config'
import { createVitePlugin, createWatch } from '/@vab/build'

const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

//vue_shop_vite官网独立配置
const minify = 'terser'
const outputHash = true

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  process.env['VITE_APP_UPDATE_TIME'] = lastBuildTime
  process.env['VITE_USER_NODE_ENV'] = mode
  const root = process.cwd()
  const env = loadEnv(mode, root)
  createWatch(env)
  console.log(lastBuildTime)

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
      warmup: {
        clientFiles: ['./index.html', './library/{components,layouts}/*', './src/{views,plugins}/*'],
      },
      https,
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, '.')}/`,
        '/@/': `/${resolve(__dirname, 'src')}/`,
        '/@vab/': `/${resolve(__dirname, 'library')}/`,
      },
    },
    optimizeDeps: {
      include,
      exclude,
    },
    build: {
      assetsDir,
      chunkSizeWarningLimit,
      cssCodeSplit,
      outDir,
      reportCompressedSize,
      rollupOptions: {
        onwarn: () => {
          return
        },
        output: {
          chunkFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          entryFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          assetFileNames: outputHash ? 'static/[ext]/[name]-[hash].[ext]' : 'static/[ext]/[name].[ext]',
          manualChunks: {
            'vsc-element-plus': ['element-plus'],
            'vsc-nprogress': ['nprogress'],
            'vsv-icon': ['vsv-icon'],
            'vsv-echarts': ['echarts'],
          },
        },
        input: ['./index.html', './website.html'],
      },
      minify,
      target: 'es2015',
      sourcemap: false,
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({ grid: true }) as any,
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
          sassOptions: { outputStyle: 'expanded' },
        },
      },
      devSourcemap: true,
    },
    plugins: createVitePlugin(env),
    define: {
      'process.env': { ...process.env },
    },
  }
})
