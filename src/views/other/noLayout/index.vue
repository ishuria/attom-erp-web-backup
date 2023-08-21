<template>
  <div class="no-layout-container">
    <el-page-header content="全屏" title="返回上一页" @back="goBack">
      <template #extra>
        <vab-full-screen />
      </template>
    </el-page-header>

    <el-alert :closable="false" title="全屏示例" type="success" />
  </div>
</template>

<script lang="ts" setup>
import { VabRoute } from '/@/router/types'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'NoLayout',
})

const tabsStore = useTabsStore()
const route = useRoute()
const { delVisitedRoute } = tabsStore

const goBack = async () => {
  await delVisitedRoute(handleActivePath(route as VabRoute, true))
  await history.back()
}
</script>

<style lang="scss" scoped>
.no-layout-container {
  position: fixed !important;
  inset: 0 !important;
  z-index: calc(var(--el-z-index) + 3) !important;
  padding: var(--el-padding) !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
}
</style>
