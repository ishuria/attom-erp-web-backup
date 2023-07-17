<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'

  defineOptions({
    name: 'VabFullScreen',
  })

  const { isFullscreen, toggle } = useFullscreen()
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>

<template>
  <div>
    <el-tooltip :content="translateTitle(isFullscreen ? '退出全屏' : '全屏')">
      <vab-icon
        v-if="theme.showFullScreen"
        :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
        @click="toggle"
      />
    </el-tooltip>
  </div>
</template>
