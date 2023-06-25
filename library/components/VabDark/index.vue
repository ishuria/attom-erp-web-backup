<script lang="ts" setup>
  import { Sunny, Moon } from '@element-plus/icons-vue'
  import { useDark, useToggle } from '@vueuse/core'
  import { useSettingsStore } from '/@/store/modules/settings'

  const $sub = inject<any>('$sub')
  const $unsub = inject<any>('$unsub')

  const $baseLoading = inject<any>('$baseLoading')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  const scheme = localStorage.getItem('vueuse-color-scheme')
  const value = ref(true)

  const _toggleDark = () => {
    const loading = $baseLoading()
    setTimeout(() => {
      toggleDark()
    }, 200)
    setTimeout(() => {
      loading.close()
    }, 1000)
  }

  onMounted(() => {
    if (scheme == 'auto') value.value = true
    else value.value = false

    // 还原默认
    $sub('shop-vite-reset-dark', () => {
      if (scheme == 'auto') value.value = true
      else value.value = false
      if (localStorage.getItem('vueuse-color-scheme') == 'dark') _toggleDark()
    })
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-reset-dark')
  })
</script>

<template>
  <el-switch
    v-if="
      theme.showDark &&
      'technology' != theme.themeName &&
      'plain' != theme.themeName
    "
    v-model="value"
    :active-icon="Sunny"
    :inactive-icon="Moon"
    inline-prompt
    style="margin-right: 20px"
    @change="_toggleDark"
  />
</template>

<style lang="scss" scoped></style>
