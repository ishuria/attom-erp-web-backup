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
  const router = useRouter()

  const goBackHome = async () => {
    await router.push({ path: '/index' })
    await delVisitedRoute(handleActivePath(route as VabRoute, true))
  }
  const goBackPrevious = async () => {
    await delVisitedRoute(handleActivePath(route as VabRoute, true))
    await history.go(-1)
  }
</script>

<template>
  <div class="no-layout-container">
    <el-page-header content="无框" title="返回上一页" @back="goBackPrevious">
      <template #extra>
        <el-button type="primary" @click="goBackHome">返回首页</el-button>
      </template>
    </el-page-header>

    <el-alert :closable="false" title="无框示例" type="success" />
  </div>
</template>

<style lang="scss" scoped>
  .no-layout-container {
    position: fixed;
    inset: 0;
    z-index: 9999;
    border-radius: 0 !important;
  }
</style>
