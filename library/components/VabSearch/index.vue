<script setup lang="ts">
  defineOptions({
    name: 'VabSearch',
  })
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { Search } from '@element-plus/icons-vue'

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const state = ref('')
  const router = useRouter()

  interface LinkItem {
    value: string
    link: string
  }

  const links = ref<LinkItem[]>([])

  const routesStore = useRoutesStore()
  const { getRoutes: routes } = storeToRefs(routesStore)

  const handleRoutes = computed(() => {
    return routes.value.flatMap((route: any) =>
      route.meta.levelHidden && route.children ? [...route.children] : route
    )
  })

  const loadAll = () => {
    const values = JSON.parse(JSON.stringify(handleRoutes.value))

    const result: any = []

    const flat = (nodes: any, parentId: any) => {
      if (!nodes || nodes.length === 0) return []
      nodes.forEach((node: any) => {
        result.push({
          title: node.meta.title,
          value: node.meta.title,
          link: node.path,
          path: node.path,
          name: node.name,
          parentId: parentId,
          icon: node.meta.icon,
        })
        return flat(node.children, node.path)
      })
    }
    flat(values, 0)

    return result
  }

  let timeout: NodeJS.Timeout
  const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
    const results = queryString
      ? links.value.filter(createFilter(queryString))
      : links.value

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(results)
    }, 0)
  }
  const createFilter = (queryString: string) => {
    return (restaurant: LinkItem) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      )
    }
  }

  const handleSelect: any = (item: any) => {
    router.push(item)
  }

  onMounted(() => {
    links.value = loadAll()
  })
</script>

<template>
  <el-autocomplete
    v-if="theme.showSearch"
    v-model="state"
    class="vab-search-autocomplete"
    clearable
    :fetch-suggestions="querySearchAsync"
    :prefix-icon="Search"
    @select="handleSelect"
  >
    <template #default="{ item }">
      <div v-if="item.parentId != 0">
        <vab-icon :icon="item.icon || 'donut-chart-line'" />
        {{ item.value }}
      </div>
    </template>
  </el-autocomplete>
</template>

<style lang="scss">
  .vab-search-autocomplete {
    margin-right: 20px;
    .el-input {
      width: 150px !important;
    }
    &-sub-menu {
      color: var(--el-color-grey);
    }
  }
</style>
