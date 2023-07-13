<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'

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
  <el-tooltip :content="translateTitle('刷新')" placement="bottom">
    <vab-icon
      v-if="theme.showRefresh"
      :class="className"
      icon="refresh-line"
      @click="refreshRoute"
    />
  </el-tooltip>
</template>
