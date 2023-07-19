<template>
  <el-tooltip :content="translate('主题配置')" effect="light">
    <span v-if="theme.showTheme">
      <vab-icon icon="t-shirt-line" @click="handleOpenTheme" />
    </span>
  </el-tooltip>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translate } from '/@/i18n'

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
