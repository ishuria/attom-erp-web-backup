<template>
  <el-tooltip
    :content="translate(value ? '暗黑模式' : '日间模式')"
    effect="light"
  >
    <el-switch
      v-if="
        theme.showDark &&
        'technology' != theme.themeName &&
        'plain' != theme.themeName
      "
      v-model="value"
      :active-icon="Moon"
      class="vab-dark"
      :inactive-icon="Sunny"
      inline-prompt
      @click="_toggleDark($event)"
    />
  </el-tooltip>
</template>

<script lang="ts" setup>
  import { Moon, Sunny } from '@element-plus/icons-vue'
  import { translate } from '/@/i18n'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabDark',
  })

  const $sub = inject<any>('$sub')
  const $unsub = inject<any>('$unsub')
  const $pub = inject<any>('$pub')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const value = ref<boolean>(false)

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
        handleSetScheme(isDark ? 'light' : 'dark')
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
      const toggleDark = useToggle(handleUseDark())
      toggleDark()
    }
  }

  const handleUseDark = () => {
    return useDark()
  }

  const handleGetScheme = (value: string) => {
    return localStorage.getItem('vueuse-color-scheme') === value
  }

  const handleSetScheme = (value: string) => {
    return localStorage.setItem('vueuse-color-scheme', value)
  }

  // 还原默认
  $sub('shop-vite-reset-dark', () => {
    value.value = handleGetScheme('dark')

    if (handleGetScheme('dark')) {
      handleSetScheme('light')
      handleUseDark()
      value.value = false
    }
  })

  $sub('reload-dark', (color: any) => {
    value.value = color
  })

  onMounted(() => {
    handleUseDark()
    if (handleGetScheme('auto')) handleSetScheme('light')
    value.value = handleGetScheme('dark')
  })

  watch(value, (newVal) => {
    $pub('reload-dark', newVal)
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-reset-dark')
  })
</script>

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

  .vab-dark {
    margin-left: var(--el-margin);
  }
</style>
