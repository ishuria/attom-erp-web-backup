import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  base: '/shop-vite/',
  registerType: 'autoUpdate',
  includeAssets: ['favicon.icon', 'static/img/*'],
  workbox: {
    cleanupOutdatedCaches: true,
  },
  manifest: {
    lang: 'zh',
    name: 'Vue Shop Vite',
    short_name: 'Vue Shop Vite',
    description: 'Vue Shop Vite官网、文档、演示地址',
    background_color: '#ffffff',
    icons: [
      {
        src: 'static/img/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'static/img/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export function createPwa() {
  return VitePWA(pwaOptions)
}
