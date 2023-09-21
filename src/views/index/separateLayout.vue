<template>
  <div class="separate-layout-container">
    <el-page-header content="独立布局" title="返回上一页" @back="goBack">
      <template #extra>
        <vab-full-screen />
      </template>
    </el-page-header>
    <el-alert :closable="false" title="当前页面允许独立于默认布局之外，当切换至其他页面时回到默认布局" />
    <tile />
  </div>
</template>

<script lang="ts" setup>
import Tile from './tile.vue'
import { layout } from '/@/config/'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'SeparateLayout',
})

const settingsStore = useSettingsStore()
const route = useRoute()
const { theme } = storeToRefs(settingsStore)

const goBack = async () => {
  await history.back()
}

watch(
  route,
  () => {
    if (route.path === '/separateLayout') theme.value.layout = 'horizontal'
    else theme.value.layout = layout
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.separate-layout-container {
  :deep() {
    .tile-container {
      height: calc(var(--el-container-height) - 150px);
      border-radius: var(--el-border-radius-base);
    }
  }
}
</style>
