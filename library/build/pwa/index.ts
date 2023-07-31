import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

export function createPwa(env: any) {
  const pwaOptions: Partial<VitePWAOptions> = {
    base: env.VITE_USER_NODE_ENV == 'production' ? './' : '',
    registerType: 'autoUpdate',
    // devOptions: {
    //   enabled: true,
    // },
    workbox: {
      cleanupOutdatedCaches: true,
    },
    manifest: {
      lang: 'zh',
      name: 'Vue Shop Vite',
      short_name: 'Vue Shop Vite',
      description: 'Vue Shop Vite官网、文档、演示地址',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  }

  return VitePWA(pwaOptions)
}
