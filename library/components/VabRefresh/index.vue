<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translate } from '/@/utils/i18n'

  defineOptions({
    name: 'VabRefresh',
  })

  const $pub = inject<any>('$pub')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const className = ref<string>('')

  const refreshRoute = async () => {
    className.value = 'rotate'
    await $pub('reload-router-view')
    setTimeout(() => {
      className.value = ''
    }, 500)
  }
</script>

<template>
  <el-tooltip :content="translate('刷新')">
    <vab-icon
      v-if="theme.showRefresh"
      :class="className"
      icon="refresh-line"
      @click="refreshRoute"
    />
  </el-tooltip>
</template>
