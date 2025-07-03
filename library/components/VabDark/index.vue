<template>
    <vab-icon
        v-if="'technology' != theme.themeName && 'plain' != theme.themeName && route.path !== '/goods/posterDesign'"
        class="vab-dark"
        :icon="mode === 'dark' ? 'moon-line' : 'sun-line'"
        @click="_toggleDark($event)"
    />
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
    name: 'VabDark',
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { theme, mode } = storeToRefs(settingsStore)
const { updateMode } = settingsStore

const _toggleDark = async (event: MouseEvent) => {
    if (typeof document.startViewTransition === 'function') {
        const x = event.clientX
        const y = event.clientY
        const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        let isDark: boolean
        const transition = document.startViewTransition(() => {
            const root = document.documentElement
            isDark = root.classList.contains('dark')
            root.classList.remove(isDark ? 'dark' : 'light')
            root.classList.add(isDark ? 'light' : 'dark')
            handleSetScheme(isDark ? 'light' : 'dark')
        })
        await transition.ready.then(() => {
            const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
            document.documentElement.animate(
                {
                    clipPath: isDark ? [...clipPath].reverse() : clipPath,
                },
                {
                    duration: 500,
                    easing: 'ease-in',
                    pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
                }
            )
        })
    } else {
        const toggleDark = useToggle(handleUseDark())
        await toggleDark()
    }
    await updateMode(localStorage.getItem('vueuse-color-scheme'))
}

const handleUseDark = () => {
    return useDark()
}

const handleGetScheme = (): string => {
    return localStorage.getItem('vueuse-color-scheme') || 'light'
}

const handleSetScheme = (value: string) => {
    return localStorage.setItem('vueuse-color-scheme', value)
}

onBeforeMount(() => {
    // 还原默认
    $sub('shop-vite-reset-dark', () => {
        mode.value = handleGetScheme()
        if (handleGetScheme() === 'dark') {
            handleSetScheme('light')
            handleUseDark()
            mode.value = 'light'
        }
    })

    handleUseDark()
    if (handleGetScheme() === 'auto') handleSetScheme('light')
    mode.value = handleGetScheme()
})
</script>

<style lang="scss">
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
    position: relative;
    margin-left: var(--el-margin);
    cursor: pointer;
    transition: var(--el-transition);

    i {
        display: inline-block;
    }

    &.ri-sun-line {
        font-size: var(--el-font-size-medium);
    }

    &.ri-sun-line:hover {
        transform: rotate(90deg);
    }

    &.ri-moon-line:hover {
        filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #fffbe6);
        transform: scale(1.2);
    }
}
</style>
