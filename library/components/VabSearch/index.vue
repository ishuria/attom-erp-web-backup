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
  const value = ref<string>('')
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
    const values = unref(handleRoutes)
    const result: any = []

    const flat = (nodes: any) => {
      if (!nodes || nodes.length === 0) return []
      nodes.forEach((node: any) => {
        result.push({
          title: node.meta.title,
          hidden: node.meta.hidden,
          value: node.meta.title,
          link: node.path,
          path: node.path,
          name: node.name,
          icon: node.meta.icon,
          level: !node.meta.icon ? 3 : 0,
        })
        return flat(node.children)
      })
    }

    flat(values)

    return result.filter((item: any) => !item.hidden)
  }

  const isMultipleSlashes = (string: string, number: number) => {
    const regex = /\//g
    const match = string.match(regex)

    if (match && match.length === number) {
      return true
    } else {
      return false
    }
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
    nextTick(() => {
      if (isExternal(item.path)) {
        window.open(item.path)
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        router.push(item)
      }
    })
  }

  onMounted(() => {
    links.value = loadAll()
  })
</script>

<template>
  <el-autocomplete
    v-if="theme.showSearch"
    v-model="value"
    class="vab-search-autocomplete"
    clearable
    :fetch-suggestions="querySearchAsync"
    :prefix-icon="Search"
    @select="handleSelect"
  >
    <template #default="{ item }">
      <div v-if="isMultipleSlashes(item.path, 1)">
        <vab-icon v-if="item.icon" :icon="item.icon" />
        {{ item.value }}
      </div>
      <div
        v-else-if="item.name === 'Menu11'"
        style="padding-left: calc(var(--el-padding) * 3)"
      >
        <vab-icon v-if="item.icon" :icon="item.icon" />
        {{ item.value }}
      </div>
      <div
        v-else-if="item.name === 'Menu111'"
        style="padding-left: calc(var(--el-padding) * 4)"
      >
        {{ item.value }}
      </div>
      <div
        v-else-if="item.name === 'Menu1111'"
        style="padding-left: calc(var(--el-padding) * 5)"
      >
        {{ item.value }}
      </div>
      <div
        v-else-if="item.level === 3"
        style="padding-left: calc(var(--el-padding) * 2)"
      >
        <vab-icon v-if="item.icon" :icon="item.icon" />
        {{ item.value }}
      </div>

      <div v-else style="padding-left: var(--el-padding)">
        <vab-icon v-if="item.icon" :icon="item.icon" />
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
