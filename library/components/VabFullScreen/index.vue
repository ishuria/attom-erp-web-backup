<template>
  <div>
    <el-tooltip
      :content="translate(isFullscreen ? '退出全屏' : '全屏')"
      effect="light"
    >
      <vab-icon
        v-if="theme.showFullScreen"
        class="vab-full-screen"
        :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
        @click="toggle"
      />
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { translate } from '/@/i18n'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabFullScreen',
  })

  const { isFullscreen, toggle } = useFullscreen()
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>
