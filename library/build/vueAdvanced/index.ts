import vue from '@vitejs/plugin-vue'

export function createVueAdvanced() {
  return vue({
    template: {
      compilerOptions: {
        isCustomElement: (tagName) => tagName === 'vue-advanced-chat',
      },
    },
  })
}
