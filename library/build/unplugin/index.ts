import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export function createUnPlugin() {
  return [
    AutoImport({
      imports: [
        'vue',
        'pinia',
        'vue-i18n',
        'vue-router',
        '@vueuse/core',
        {
          axios: [['default', 'axios']],
        },
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'library/build/unplugin/auto-imports.d.ts',
    }),
    Components({
      dirs: ['library/components', 'src/plugins'],
      resolvers: [ElementPlusResolver()],
      dts: 'library/build/unplugin/components.d.ts',
    }),
  ]
}
