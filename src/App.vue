<template>
  <vab-app />
</template>

<script lang="ts" setup>
import DisableDevtool from 'disable-devtool'
import { noDebugger } from '/@/config/index'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
const { updateTheme, changeColor } = settingsStore
const route = useRoute()

const resizeContainer = () => {
  let vh = window.innerHeight * 0.01
  const el = ref<HTMLElement | null>(null)
  useCssVar('--vh', el).value = `${vh}px`
}

onBeforeMount(() => {
  changeColor()
  updateTheme()

  /**
   * @description: 修复ios、android等移动端浏览器100vh兼容问题
   * @author sundan
   */

  window.addEventListener('orientationchange', resizeContainer)
  window.addEventListener('resize', resizeContainer)
  resizeContainer()
})

onMounted(() => {
  // 是否允许生产环境进行代码调试，请前往config/cli.config.ts文件配置

  setTimeout(() => {
    if (
      !location.hostname.includes('127') &&
      !location.hostname.includes('localhost') &&
      (location.hostname.includes('beautiful') || location.hostname.includes('vuejs-core') || noDebugger) &&
      route.query &&
      route.query.debugger !== 'auto'
    )
      DisableDevtool({
        url: '//vuejs-core.cn/debugger',
        timeOutUrl: '//vuejs-core.cn/debugger',
      })
  }, 500)
})
</script>
