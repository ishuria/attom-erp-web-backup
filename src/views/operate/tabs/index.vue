<template>
  <div class="tabs-container">
    <el-button @click="closeOthersTabs">
      <vab-icon icon="close-line" />
      关闭其他
    </el-button>
    <el-button @click="closeLeftTabs">
      <vab-icon icon="arrow-left-line" />
      关闭左侧
    </el-button>
    <el-button @click="closeRightTabs">
      <vab-icon icon="arrow-right-line" />
      关闭右侧
    </el-button>
    <el-button @click="closeAllTabs">
      <vab-icon icon="close-line" />
      关闭全部
    </el-button>
    <el-button @click="handleTabRemove(route.path)">
      <vab-icon icon="close-line" />
      关闭当前
    </el-button>
    <el-button @click="handleRefresh">
      <vab-icon icon="refresh-line" />
      刷新当前
    </el-button>
  </div>
</template>

<script lang="ts" setup>
  import { handleActivePath } from '/@/utils/routes'
  import { useTabsStore } from '/@/store/modules/tabs'

  defineOptions({
    name: 'Tabs',
  })

  const route = useRoute()
  const router = useRouter()
  const tabStore = useTabsStore()
  const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabStore)
  const {
    delVisitedRoute,
    delOthersVisitedRoutes,
    delLeftVisitedRoutes,
    delRightVisitedRoutes,
    delAllVisitedRoutes,
  } = tabStore
  const hoverRoute = ref<any>(null)
  const $pub = inject<any>('$pub')

  /**
   * 根据原生路径删除标签中的标签
   * @param rawPath 原生路径
   * @returns {Promise<void>}
   */
  const handleTabRemove = async (rawPath: string) => {
    if (isActive(rawPath)) await toLastTab()
    await delVisitedRoute(rawPath)
  }
  /**
   * 删除其他标签页
   * @returns {Promise<void>}
   */
  const closeOthersTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delOthersVisitedRoutes(hoverRoute.value.path)
    } else await delOthersVisitedRoutes(handleActivePath(route, true))
  }
  /**
   * 删除左侧标签页
   * @returns {Promise<void>}
   */
  const closeLeftTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delLeftVisitedRoutes(hoverRoute.value.path)
    } else await delLeftVisitedRoutes(handleActivePath(route, true))
  }
  /**
   * 删除右侧标签页
   * @returns {Promise<void>}
   */
  const closeRightTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delRightVisitedRoutes(hoverRoute.value.path)
    } else await delRightVisitedRoutes(handleActivePath(route, true))
  }
  /**
   * 删除所有标签页
   * @returns {Promise<void>}
   */
  const closeAllTabs = async () => {
    await delAllVisitedRoutes()
    await toLastTab()
  }
  /**
   * 跳转最后一个标签页
   */
  const toLastTab = async () => {
    const latestView = visitedRoutes.value
      .filter((_) => _.path !== handleActivePath(route, true))
      .slice(-1)[0]
    if (latestView) await router.push(latestView)
    else await router.push('/')
  }
  const isActive = (path: any) => {
    return path === handleActivePath(route, true)
  }
  /**
   * 刷新当前标签页
   */
  const handleRefresh = () => {
    $pub('reload-router-view', 'Tabs')
  }
</script>

<style lang="scss" scoped>
  .tabs-container {
    :deep() {
      .el-button {
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .el-button + .el-button {
        margin-right: 10px;
        margin-left: 0;
      }
    }
  }
</style>
