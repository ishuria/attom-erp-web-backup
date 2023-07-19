<template>
  <div class="no-layout-container">
    <el-page-header content="无框" title="返回上一页" @back="goBack">
      <template #extra>
        <vab-full-screen />
      </template>
    </el-page-header>

    <el-alert :closable="false" title="无框示例" type="success" />
  </div>
</template>

<script lang="ts" setup>
  import { handleActivePath } from '/@/utils/routes'
  import { useTabsStore } from '/@/store/modules/tabs'
  import { VabRoute } from '/#/router'

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
    position: fixed;
    inset: 0;
    z-index: 9999;
    border-radius: 0 !important;
  }
</style>
