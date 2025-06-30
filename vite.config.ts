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
                        'vsv-element-plus': ['element-plus'],
                        'vsv-nprogress': ['nprogress'],
                        'vsv-icon': ['vsv-icon'],
                        'vsv-echarts': ['echarts'],
                    },
                },
            },
            minify,
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
                    //api: 'modern-compiler',
                },
            },
            devSourcemap: true,
        },
        plugins: createVitePlugin(env),
        define: {},
    }
})
