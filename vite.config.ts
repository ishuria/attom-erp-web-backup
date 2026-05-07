import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { resolve } from 'node:path'
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
  minify,
  open,
  outDir,
  outputHash,
  port,
  reportCompressedSize,
} from '/@/config'
import { createVitePlugin, createWatch } from '/@vab/build'

const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  process.env['VITE_APP_UPDATE_TIME'] = lastBuildTime
  process.env['VITE_USER_NODE_ENV'] = mode
  const root = process.cwd()
  const env = loadEnv(mode, root)
  createWatch(env)

  if (mode === 'development') {
    console.log(`构建时间: ${lastBuildTime}`)
  }

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
      fs: {},
      proxy: {
        // 匹配所有 /attom 开头的请求（包括子路径）
        '^/attom': {
          target: 'http://192.168.6.12:19000',
          changeOrigin: true,
        },
        // 飞书 token 交换服务（独立后端，正式环境靠后端开 CORS 或网关转发）
        '^/api/v1/lark': {
          target: 'http://192.168.6.14:9231',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lark-api/, '/api/v1'),
        },
      },
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
        treeshake: false,
        onwarn: () => {
          return
        },
        output: {
          chunkFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          entryFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          assetFileNames: outputHash ? 'static/[ext]/[name]-[hash].[ext]' : 'static/[ext]/[name].[ext]',
          manualChunks: {
            'vsv-element-plus': ['element-plus'],
            'vsv-nprogress': ['nprogress'],
            'vsv-icon': ['vsv-icon'],
            'vsv-echarts': ['echarts'],
          },
        },
      },
      minify,
      sourcemap: false,
      target: 'es2015',
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
          //api: 'modern-compiler',
        },
      },
      devSourcemap: true,
    },
    plugins: createVitePlugin(env),
    define: {},
    // 为生产环境添加预加载指令，提高初次访问速度
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        // 为JS和CSS资源添加preload，提高资源加载优先级
        if (hostType === 'js' && filename.endsWith('.js')) {
          return { relative: true, preload: true }
        }
        if (hostType === 'css' && filename.endsWith('.css')) {
          return { relative: true, preload: true }
        }
        return { relative: true }
      },
    },
  }
})
