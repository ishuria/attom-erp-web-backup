<script lang="ts" setup>
  import { round } from 'lodash-es'
  import { color as _color } from '/@/config/'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translate } from '/@/i18n'

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
    '#07cd5a',
    '#16baa9',
    '#07c160',
    '#009688',
    '#6954f0',
    '#7b40f2',
    '#ff2d55',
    '#f01414',
  ])
  const settingsStore = useSettingsStore()
  const { changeColor, getColor } = settingsStore

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

    changeColor(value)
    color.value = value
  }

  onMounted(() => {
    handleChange(getColor)

    // 还原默认
    $sub('shop-vite-reset-color', () => {
      handleChange(_color)
    })
  })

  $sub('reload-color', (color: any) => {
    handleChange(color)
  })

  watch(color, (newVal) => {
    $pub('reload-color', newVal)
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-reset-dark')
  })
</script>

<template>
  <el-tooltip :content="translate('主题色')">
    <div style="margin-left: var(--el-margin)">
      <el-color-picker
        v-model="color"
        popper-class="vab-color-picker"
        :predefine="predefineColors"
        @active-change="handleChange"
      />
    </div>
  </el-tooltip>
</template>

<style lang="scss">
  .vab-color-picker {
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
