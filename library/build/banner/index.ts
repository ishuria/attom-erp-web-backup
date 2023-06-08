import banner from 'vite-plugin-banner'

export function createBanner() {
  return [
    banner(
      ` build: Vue Shop` +
        ` Vite \n     copyright: vue-admin-` +
        `bea` +
        `utiful.com/sh` +
        `op-vite  \n     time: ${process.env.VITE_APP_UPDATE_TIME} \n`
    ),
  ]
}
