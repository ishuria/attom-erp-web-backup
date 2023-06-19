<script lang="ts" setup>
  import { color as _color } from '/@/config/'
  import { useSettingsStore } from '/@/store/modules/settings'

  const color = ref(_color)
  const $sub: any = inject('$sub')
  const $unsub: any = inject('$unsub')
  const $pub: any = inject('$pub')

  const predefineColors = ref([
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

  const colorRgba = (str: any, n: number) => {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    const sColor = str.toLowerCase()
    n = n || 1
    if (sColor && reg.test(sColor)) {
      const sColorChange = getRgbNum(sColor)
      return `rgba(${sColorChange.join(',')},${n})`
    } else {
      return sColor
    }
  }

  const handleChange = (val: any) => {
    const el = ref(null)
    const _color = useCssVar('--el-color-primary', el)
    _color.value = val

    for (let index = 1; index < 10; index++) {
      useCssVar(`--el-color-primary-light-${index}`, el).value = colorRgba(
        val,
        1 - index * 0.1
      )
    }

    changeColor(val)
    color.value = val
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
  <el-color-picker
    v-model="color"
    :predefine="predefineColors"
    popper-class="vab-color-picker"
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
