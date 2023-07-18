<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { Search } from '@element-plus/icons-vue'
  import { isExternal } from '/@/utils/validate'

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
      node.label = node.meta.title
      if (node.children && node.children.length) addFieldToTree(node.children)
    })
    return routes.value
  }

  const handleSelect = (item: any) => {
    nextTick(() => {
      if (!item.children)
        if (isExternal(item.path)) {
          window.open(item.path)
          setTimeout(() => {
            router.push('/')
          }, 500)
        } else router.push(item)
    })
  }

  onMounted(() => {
    value.value = route.name
  })
</script>

<template>
  <el-tree-select
    v-if="theme.showSearch"
    v-model="value"
    class="vab-search"
    :data="addFieldToTree(routes)"
    filterable
    :prefix-icon="Search"
    @node-click="handleSelect"
  >
    <template #default="{ data }">
      <vab-icon :icon="data.meta.icon" />
      <span>{{ data.meta.title }}</span>
    </template>
  </el-tree-select>
</template>

<style lang="scss" scoped>
  .vab-search {
    margin-right: 20px;

    :deep() {
      .el-input {
        width: 150px !important;
      }
    }
  }
</style>
