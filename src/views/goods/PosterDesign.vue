<template>
  <div class="poster-design-container">
    <div class="hidden-sm-and-up" style="padding: 15px">
      <vab-alert title="手机端不支持海报设计演示" type="warning" />
    </div>
    <div class="hidden-xs-only">
      <iframe src="https://vue-admin-beautiful.com/vue-fabric-editor/#/"></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'PosterDesign',
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { mode } = storeToRefs<any>(settingsStore)
const $pub = inject<any>('$pub')
const $baseMessage = inject<any>('$baseMessage')

const handleDark = () => {
  if (route.path === '/goods/posterDesign') $pub('shop-vite-reset-dark')
}

onActivated(() => {
  nextTick(() => {
    if ('dark' == mode.value) $baseMessage('海报设计不支持暗黑模式，已为您重置', 'success', 'hey')
    handleDark()
  })
})
</script>

<style lang="scss" scoped>
.poster-design-container {
  padding: 0 !important;

  iframe {
    width: 100%;
    height: calc(var(--el-container-height) - 5px);

    border: 0;
  }
}
</style>
