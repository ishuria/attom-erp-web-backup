<template>
  <div class="test2-container">
    <el-alert :closable="false" :title="'Query Id=' + route.query.id" />
    <vab-json-viewer copyable :expand-depth="5" :value="finalRoute" />
  </div>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'
  import VabJsonViewer from 'vue-json-viewer'
  defineOptions({
    name: 'Test2',
  })

  const route = useRoute()
  const tabsStore = useTabsStore()
  const { changeTabsMeta } = tabsStore
  let finalRoute = reactive({})

  const handleQuery = () => {
    finalRoute = {
      name: route.name,
      path: route.path,
      query: route.query,
    }
    changeTabsMeta({
      title: 'Query',
      meta: {
        title: `Query Id=${route.query.id}`,
      },
    })
  }

  watch(
    finalRoute,
    () => {
      handleQuery()
    },
    {
      immediate: true,
    }
  )
</script>
