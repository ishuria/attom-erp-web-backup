import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export function createUnPlugin(env: Record<string, string>) {
  console.log(env)
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
      resolvers: [],
      dts: 'library/build/unplugin/auto-imports.d.ts',
    }),
    Components({
      dirs: ['library/components', 'src/plugins', 'src/**/vabAutoComponents'],
      dts: 'library/build/unplugin/components.d.ts',
    }),
  ]
}
