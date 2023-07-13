<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'

  defineOptions({
    name: 'VabTheme',
  })

  const $pub = inject<any>('$pub')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const handleOpenTheme = () => {
    $pub('shop-vite-theme')
  }
</script>

<template>
  <el-tooltip :content="translateTitle('主题配置')" placement="bottom">
    <span v-if="theme.showTheme">
      <vab-icon icon="brush-line" @click="handleOpenTheme" />
    </span>
  </el-tooltip>
</template>
