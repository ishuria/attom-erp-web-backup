<template>
  <span v-if="theme.showTheme">
    <vab-icon icon="t-shirt-line" @click="handleOpenTheme" />
  </span>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabTheme',
  })

  const $pub = inject<any>('$pub')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const handleOpenTheme = () => {
    $pub('shop-vite-open-theme')
  }
</script>
