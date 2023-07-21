<template>
  <el-tree-select
    v-if="theme.showSearch"
    v-model="value"
    class="vab-search"
    clearable
    :data="addFieldToTree(routes)"
    default-expand-all
    filterable
    highlight-current
    :prefix-icon="Search"
    @node-click="handleSelect"
  >
    <template #default="{ data }">
      <vab-icon v-if="data.meta && data.meta.icon" :icon="data.meta.icon" />
      <span>{{ translate(data.meta.title) }}</span>
    </template>
  </el-tree-select>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { Search } from '@element-plus/icons-vue'
  import { isExternal } from '/@/utils/validate'
  import { translate } from '/@/i18n'

  defineOptions({
    name: 'VabSearch',
  })

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const value = ref<any>('')
  const router = useRouter()
  const route = useRoute()
  const routesStore = useRoutesStore()
  const { getRoutes: routes } = storeToRefs(routesStore)

  const addFieldToTree = (data: any) => {
    data.forEach((node: any) => {
      node.value = node.name
      node.label = translate(node.meta.title)
      if (node.children && node.children.length) addFieldToTree(node.children)
    })
    return data
  }

  const handleSelect = (item: any) => {
    nextTick(() => {
      if (!item.children)
        if (isExternal(item.path)) {
          window.open(item.path)
          router.push('/redirect')
        } else router.push(item)
    })
  }

  watch(
    route,
    () => {
      value.value = route.name
    },
    {
      immediate: true,
    }
  )
</script>

<style lang="scss" scoped>
  .vab-search {
    margin-right: var(--el-margin);

    :deep() {
      .el-input {
        width: 150px !important;
      }
    }
  }
</style>
