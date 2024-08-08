<template>
  <vab-app v-show="show" />
</template>

<script lang="ts" setup>
import DisableDevtool from 'disable-devtool'
import { disableDebugger } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
const { updateTheme } = settingsStore
const route = useRoute()
const show = ref<boolean>(false)

const resizeContainer = () => {
  let vh = window.innerHeight * 0.01
  const el = ref<HTMLElement | null>(null)
  useCssVar('--vh', el).value = `${vh}px`
}

onBeforeMount(() => {
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
  nextTick(() => {
    // 等待动画处理完成再加载页面
    show.value = true
    // 是否允许生产环境进行代码调试，请前往config/cli.config.ts文件配置
    setTimeout(() => {
      if (
        !location.hostname.includes('127') &&
        !location.hostname.includes('localhost') &&
        (location.hostname.includes('vuejs-core') || disableDebugger) &&
        route.query &&
        route.query.debugger !== 'auto'
      )
        DisableDevtool({
          url: 'https://vuejs-core.cn/debugger',
          timeOutUrl: 'https://vuejs-core.cn/debugger',
        })
    }, 500)
  })
})
</script>
