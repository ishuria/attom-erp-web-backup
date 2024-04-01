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

onBeforeMount(() => {
  changeColor()
  updateTheme()

  if (!location.hostname.includes('127') && !location.hostname.includes('localhost')) {
    if (location.hostname === 'vue-admin-beautiful.com' || location.hostname === 'chu1204505056.gitee.io' || noDebugger) {
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
          if (location.hostname === 'vue-admin-beautiful.com' || location.hostname === 'chu1204505056.gitee.io')
            console.error('演示地址禁止调试，如需调试代码请联系客服购买！')
          block()
        } catch {
          /* empty */
        }
      })()
    }
  }
})
</script>
