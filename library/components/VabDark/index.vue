<script lang="ts" setup>
  import { Sunny, Moon } from '@element-plus/icons-vue'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useDark, useToggle } from '@vueuse/core'

  defineOptions({
    name: 'VabDark',
  })

  const $sub = inject<any>('$sub')
  const $unsub = inject<any>('$unsub')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const value = ref(true)

  const _toggleDark = (event: MouseEvent) => {
    // @ts-ignore
    if (typeof document.startViewTransition === 'function') {
      // 浏览器支持document.startViewTransition
      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      )
      let isDark: boolean
      // @ts-ignore
      const transition = document.startViewTransition(() => {
        const root = document.documentElement
        isDark = root.classList.contains('dark')
        root.classList.remove(isDark ? 'dark' : 'light')
        root.classList.add(isDark ? 'light' : 'dark')
        localStorage.setItem('vueuse-color-scheme', isDark ? 'light' : 'dark')
      })
      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 500,
            easing: 'ease-in',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          }
        )
      })
    } else {
      // 浏览器不支持document.startViewTransition
      const isDark = useDark()
      const toggleDark = useToggle(isDark)
      toggleDark()
    }
  }

  onMounted(() => {
    useDark()
    if (localStorage.getItem('vueuse-color-scheme') == 'auto')
      localStorage.setItem('vueuse-color-scheme', 'light')

    value.value = localStorage.getItem('vueuse-color-scheme') !== 'dark'

    // 还原默认
    $sub('shop-vite-reset-dark', () => {
      value.value = localStorage.getItem('vueuse-color-scheme') !== 'dark'

      if (localStorage.getItem('vueuse-color-scheme') == 'dark') {
        localStorage.setItem('vueuse-color-scheme', 'light')
        useDark()
        value.value = true
      }
    })
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-reset-dark')
  })
</script>

<template>
  <el-switch
    v-if="
      theme.showDark &&
      'technology' != theme.themeName &&
      'plain' != theme.themeName
    "
    v-model="value"
    :active-icon="Sunny"
    :inactive-icon="Moon"
    inline-prompt
    style="margin-right: 20px"
    @click="_toggleDark($event)"
  />
</template>

<style lang="scss">
  /* stylelint-disable selector-pseudo-element-no-unknown */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    mix-blend-mode: normal;
    animation: none;
  }

  ::view-transition-old(root) {
    z-index: 999;
  }

  ::view-transition-new(root) {
    z-index: 1;
  }

  .dark {
    &::view-transition-old(root) {
      z-index: 1;
    }
    &::view-transition-new(root) {
      z-index: 999;
    }
  }
</style>
