<template>
  <div
    v-if="'technology' != theme.themeName"
    class="vab-color-picker"
    style="margin-left: var(--el-margin)"
  >
    <el-color-picker
      v-model="color"
      popper-class="vab-color-picker-popper"
      :predefine="predefineColors"
      @active-change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { round } from 'lodash-es'
  import { color as _color } from '/@/config/'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { lightenColor } from '/@/utils/lightenColor'

  defineOptions({
    name: 'VabColorPicker',
  })

  const color = ref<any>(_color)
  const $sub = inject<any>('$sub')
  const $unsub = inject<any>('$unsub')
  const $pub = inject<any>('$pub')
  const predefineColors = ref<any>([
    _color,
    '#1e90ff',
    '#4e6ef2',
    '#0052d9',
    '#3fb884',
    '#16baa9',
    '#07c160',
    '#009688',
    '#6954f0',
    '#7b40f2',

    '#f01414',
  ])
  const settingsStore = useSettingsStore()
  const { changeColor, getColor } = settingsStore
  const { theme } = storeToRefs(settingsStore)

  const getRgbNum = (sColor: string) => {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`))
    }
    return sColorChange
  }

  const colorRgba = (str: any, n = 1) => {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    const sColor = str.toLowerCase()
    if (sColor && reg.test(sColor))
      return `rgba(${getRgbNum(sColor).join(',')},${round(n, 1)})`
    else return sColor
  }

  const handleChange = (value: any) => {
    const el = ref<any>(null)
    useCssVar('--el-color-primary-dark-2', el).value = value
    useCssVar('--el-color-primary', el).value = value

    for (let index = 1; index < 10; index++) {
      useCssVar(`--el-color-primary-light-${index}`, el).value = colorRgba(
        value,
        1 - index * 0.1
      )
    }

    if (theme.value.isFollow)
      useCssVar('--el-menu-background-color', el).value = lightenColor(
        value,
        15
      )
    else useCssVar('--el-menu-background-color', el).value = '#282c34'

    changeColor(value)
    color.value = value
  }

  // 还原默认
  $sub('shop-vite-reset-color', () => {
    handleChange(_color)
  })

  $sub('reload-color', (color: any) => {
    handleChange(color)
  })

  onBeforeMount(() => {
    handleChange(getColor)
  })

  watch(color, (newVal) => {
    $pub('reload-color', newVal)
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-reset-dark')
  })
</script>

<style lang="scss">
  .el-color-picker__trigger {
    width: 20px;
    height: 20px;
    padding: 0;
  }

  .vab-color-picker-popper {
    box-sizing: content-box !important;
    padding: calc(var(--el-padding) / 2);

    .el-color-dropdown__link-btn {
      display: none;
    }

    .el-color-dropdown__btns {
      margin-top: 0;
    }
  }
</style>
