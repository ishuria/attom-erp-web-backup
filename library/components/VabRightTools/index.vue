<template>
  <div class="vab-right-tools">
    <vab-search v-show="!isHorizontal" class="hidden-xs-only" />
    <vab-dark v-show="theme.showDark" :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }" />
    <vab-color-picker v-show="theme.showColorPicker" />
    <vab-theme v-show="theme.showTheme && routeName !== 'SeparateLayout'" />
    <vab-error-log class="hidden-xs-only" />
    <vab-font-size v-show="theme.showFontSize" />
    <vab-lock v-show="theme.showLock" />
    <vab-notice v-show="theme.showNotice" />
    <vab-language v-show="theme.showLanguage" />
    <vab-fullscreen v-show="theme.showFullScreen" />
    <vab-refresh v-show="theme.showRefresh" />
    <vab-avatar />
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import Sortable from 'sortablejs'
import { moveElement } from '/@/utils/index'

defineOptions({
  name: 'VabRightTools',
})

defineProps({
  isHorizontal: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const routeName = ref<any>(route.name)

const handleTabDrag = () => {
  new Sortable(document.querySelectorAll('.vab-right-tools')[0], {
    animation: 600,
    easing: 'cubic-bezier(1, 0, 0, 1)',
  })
}

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => {
    handleTabDrag()
  })
})
</script>

<style lang="scss" scoped>
.vab-right-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
