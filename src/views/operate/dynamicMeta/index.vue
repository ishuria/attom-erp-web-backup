<template>
  <div class="dynamic-meta-container no-background-container">
    <vab-card>
      <template #header>
        <span>动态标题</span>
      </template>
      <el-space wrap>
        <el-button type="primary" @click="handleMeta('DynamicMeta', { title: 'vab-demo' })">
          标题变更为 vab-demo
        </el-button>
        <el-button type="warning" @click="handleMeta('DynamicMeta', { title: '动态Meta' })">
          还原为默认标题
        </el-button>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>动态徽章</span>
      </template>
      <el-space wrap>
        <el-badge :hidden="hidden" style="margin-right: 10px" :value="badge">
          <el-button type="primary" @click="handleBadge('DynamicMeta')">徽章+ 1</el-button>
        </el-badge>
        <el-button type="danger" @click="resetBadge('DynamicMeta', { badge: '0' })">
          徽章清零
        </el-button>
        <el-button type="danger" @click="removeBadge('DynamicMeta', { badge: false })">
          移除徽章
        </el-button>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>动态图标</span>
      </template>
      <el-popover popper-class="icon-selector-popper" trigger="hover" :width="305">
        <template #reference>
          <el-button>
            <vab-icon :icon="icon" />
            <span>修改图标</span>
            <vab-icon icon="arrow-down-s-line" />
          </el-button>
        </template>
        <vab-icon-selector @handle-icon="handleIcon" />
      </el-popover>
    </vab-card>
    <vab-card>
      <template #header>
        <span>动态高亮菜单</span>
      </template>
      <el-space wrap>
        <el-button type="primary" @click="handleActiveMenu('/operate/tabs')">
          高亮菜单至多标签
        </el-button>
        <el-button type="warning" @click="handleActiveMenu('/operate/dynamicMeta')">
          还原默认高亮
        </el-button>
      </el-space>
    </vab-card>
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
  const badge = ref<number>(0)
  const icon = ref<any>(route.meta.icon)
  const hidden = ref<boolean>(false)

  const handleBadge = (name: any) => {
    badge.value = badge.value + 1
    hidden.value = false
    changeMenuMeta({
      name,
      meta: { badge: badge.value },
    })
  }

  const resetBadge = (name: any, meta: any) => {
    badge.value = 0
    hidden.value = false
    changeMenuMeta({ name, meta })
  }

  const removeBadge = (name: any, meta: any) => {
    badge.value = 0
    hidden.value = true
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
