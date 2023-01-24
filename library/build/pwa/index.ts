import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
//import setting from '/@/config'

const pwaOptions: Partial<VitePWAOptions> = {
  base: '/shop-vite',
  registerType: 'prompt',
  includeAssets: ['favicon.icon', 'static/img/*'],
  workbox: {
    cleanupOutdatedCaches: true,
  },
  manifest: {
    lang: 'zh',
    name: 'Shop Vite',
    short_name: 'Shop Vite',
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
