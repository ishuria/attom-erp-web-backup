<template>
  <div class="dynamic-meta-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card shadow="hover">
          <template #header>
            <span>动态标题</span>
          </template>
          <el-button @click="handleMeta('DynamicMeta', { title: 'vab-demo' })">
            标题变更为 vab-demo
          </el-button>
          <el-button @click="handleMeta('DynamicMeta', { title: '动态Meta' })">
            还原为默认标题
          </el-button>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card shadow="hover">
          <template #header>
            <span>动态徽章</span>
          </template>
          <el-button @click="handleBadge('DynamicMeta')">徽章+ 1</el-button>
          <el-button @click="resetBadge('DynamicMeta', { badge: '0' })">
            徽章清零
          </el-button>
          <el-button @click="resetBadge('DynamicMeta', { badge: false })">
            移除徽章
          </el-button>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card shadow="hover">
          <template #header>
            <span>动态图标</span>
          </template>
          <el-popover
            popper-class="icon-selector-popper"
            trigger="hover"
            :width="305"
          >
            <template #reference>
              <el-button>
                <vab-icon :icon="icon" />
                修改图标
                <vab-icon icon="arrow-down-s-line" />
              </el-button>
            </template>
            <vab-icon-selector @handle-icon="handleIcon" />
          </el-popover>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <vab-card shadow="hover">
          <template #header>
            <span>动态高亮菜单</span>
          </template>
          <el-button @click="handleActiveMenu('/vab/notice')">
            修改高亮菜单至通知组件
          </el-button>
          <el-button @click="handleActiveMenu('/vab/dynamicMeta')">
            还原默认高亮菜单
          </el-button>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'
  import { useRoutesStore } from '/@/store/modules/routes'
  import getPageTitle from '/@/utils/pageTitle'

  defineOptions({
    name: 'DynamicMeta',
  })
  const route = useRoute()

  const tabsStore = useTabsStore()
  const routesStore = useRoutesStore()

  const { changeTabsMeta } = tabsStore
  const { changeActiveMenu, changeMenuMeta } = routesStore

  const badge = ref(0)
  const icon: any = ref(route.meta.icon)
  const handleBadge = (name: any) => {
    badge.value = badge.value + 1
    changeMenuMeta({
      name,
      meta: { badge: badge.value },
    })
  }
  const resetBadge = (name: any, meta: any) => {
    badge.value = 0
    changeMenuMeta({ name, meta })
  }
  const handleMeta = (name: any, meta: { title: string }) => {
    if (meta.title) useTitle().value = getPageTitle(meta.title)
    changeMenuMeta({ name, meta })
    changeTabsMeta({ name, meta })
  }
  const handleIcon = (item: any) => {
    icon.value = item
    changeMenuMeta({ name: 'DynamicMeta', meta: { icon: item } })
    changeTabsMeta({ name: 'DynamicMeta', meta: { icon: item } })
  }
  const handleActiveMenu = (activeMenu: string) => {
    changeActiveMenu(activeMenu)
  }
</script>

<style lang="scss" scoped></style>
