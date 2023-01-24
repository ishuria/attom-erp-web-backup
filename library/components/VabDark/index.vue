<script lang="ts" setup>
  import { Sunny, Moon } from '@element-plus/icons-vue'
  import { useDark, useToggle } from '@vueuse/core'
  import { ElLoading } from 'element-plus'

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
    v-model="value"
    :active-icon="Sunny"
    class="mt-2"
    :inactive-icon="Moon"
    inline-prompt
    style="margin-left: 24px"
    @change="_toggleDark"
  />
</template>

<style lang="scss" scoped></style>
