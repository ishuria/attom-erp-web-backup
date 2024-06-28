<template>
  <vab-app />
</template>

<script lang="ts" setup>
import { noDebugger } from '/@/config/index'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
const { updateTheme, changeColor } = settingsStore

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

  // 是否允许生产环境进行代码调试，请前往config/cli.config.ts文件配置
  if (
    !location.hostname.includes('127') &&
    !location.hostname.includes('localhost') &&
    (location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io' ||
      location.hostname === 'vuejs-core.cn' ||
      noDebugger)
  ) {
    ;(() => {
      const block = () => {
        setInterval(() => {
          ;(function () {
            return false
          })
            ['constructor']('debugger')
            ['call']()
        }, 50)
      }

      try {
        if (
          location.hostname === 'vue-admin-beautiful.com' ||
          location.hostname === 'chu1204505056.gitee.io' ||
          location.hostname === 'vuejs-core.cn'
        )
          console.error('演示地址禁止调试，如需调试代码请联系客服购买！')
        block()
      } catch {
        /* empty */
      }
    })()
  }
})
</script>
