<template>
  <div class="random-theme-container">
    <el-button type="primary" @click="randomTheme">随机换肤</el-button>
    <el-button type="primary" @click="resetTheme">默认主题</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'RandomTheme',
  })

  const settingsStore = useSettingsStore()
  const { theme, device } = storeToRefs(settingsStore)
  const { saveTheme, updateTheme } = settingsStore
  const $pub = inject<any>('$pub')
  const $baseLoading = inject<any>('$baseLoading')
  const $baseMessage = inject<any>('$baseMessage')

  const shuffle = (val: any, list: any) =>
    list.filter((item: any) => item !== val)[
      (Math.random() * (list.length - 1)) | 0
    ]

  const randomTheme = async () => {
    const loading = $baseLoading()

    setTimeout(() => {
      try {
        const themeName = shuffle(theme.value.themeName, [
          'default',
          'plain',
          'technology',
        ])
        const columnStyle = shuffle(theme.value.columnStyle, [
          'vertical',
          'horizontal',
          'card',
          'arrow',
          'semicircle',
        ])
        const tabsBarStyle = shuffle(theme.value.tabsBarStyle, [
          'card',
          'smart',
          'smooth',
        ])
        const showTabsIcon = shuffle(theme.value.showTabsIcon, [true, false])
        const layout =
          device.value === 'desktop'
            ? shuffle(theme.value.layout, [
                'horizontal',
                'vertical',
                'column',
                'comprehensive',
              ])
            : 'vertical'

        theme.value.themeName = themeName
        theme.value.columnStyle = columnStyle
        theme.value.tabsBarStyle = tabsBarStyle
        theme.value.showTabsIcon = showTabsIcon
        theme.value.layout = layout

        updateTheme()
        saveTheme()
      } finally {
        setTimeout(() => {
          loading.close()
          $baseMessage('切换成功', 'success', 'hey')
        }, 1000)
      }
    }, 100)
  }

  const resetTheme = () => {
    $pub('shop-vite-reset-theme')
  }
</script>
