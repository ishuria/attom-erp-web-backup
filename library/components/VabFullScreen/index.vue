<template>
  <div>
    <vab-icon
      v-if="theme.showFullScreen"
      class="vab-full-screen"
      :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
      @click="toggle"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabFullScreen',
  })

  const { isFullscreen, toggle } = useFullscreen()
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>
