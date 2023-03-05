<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  const color = ref('#4E88F3')
  const predefineColors = ref([
    '#4e88f3',
    '#f01414',
    '#3fb884',
    '#1e90ff',
    '#6954f0',
    '#0052d9',
    '#07CD5A',
  ])

  const settingsStore = useSettingsStore()
  const { changeColor, getColor } = settingsStore

  const handleChange = (val: any) => {
    const el = ref(null)
    const _color = useCssVar('--el-color-primary', el)
    _color.value = val
    changeColor(val)
    color.value = val
  }

  onMounted(() => {
    handleChange(getColor)
  })
</script>

<template>
  <el-color-picker
    v-model="color"
    popper-class="vab-color-picker"
    :predefine="predefineColors"
    @active-change="handleChange"
  />
</template>

<style lang="scss">
  .vab-color-picker {
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
</style>
