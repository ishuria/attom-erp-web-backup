import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import setting from '/@/config'

const pwaOptions: Partial<VitePWAOptions> = {
  base: setting['publicPath'],
  registerType: 'prompt',
  includeAssets: ['favicon.icon', 'static/img/*'],
  workbox: {
    cleanupOutdatedCaches: true,
  },
  manifest: {
    lang: 'zh',
    name: 'Vue Admin Beautiful - Admin Vite',
    short_name: 'Admin Vite',
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
