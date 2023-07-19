<template>
  <div>
    <el-tooltip
      :content="translate(isFullscreen ? '退出全屏' : '全屏')"
      effect="light"
    >
      <vab-icon
        v-if="theme.showFullScreen"
        :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
        @click="toggle"
      />
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translate } from '/@/i18n'

  defineOptions({
    name: 'VabFullScreen',
  })

  const { isFullscreen, toggle } = useFullscreen()
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>
