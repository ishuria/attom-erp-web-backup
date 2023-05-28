<script lang="ts" setup>
  import { Sunny, Moon } from '@element-plus/icons-vue'
  import { useDark, useToggle } from '@vueuse/core'
  import { ElLoading } from 'element-plus'
  import { useSettingsStore } from '/@/store/modules/settings'

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  const value = ref(true)
  const _toggleDark = () => {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      toggleDark()
    }, 200)
    setTimeout(() => {
      loading.close()
    }, 1000)
  }
</script>

<template>
  <el-switch
    v-if="theme.showDark"
    v-model="value"
    :active-icon="Sunny"
    :inactive-icon="Moon"
    inline-prompt
    style="margin-right: 20px"
    @change="_toggleDark"
  />
</template>

<style lang="scss" scoped></style>
