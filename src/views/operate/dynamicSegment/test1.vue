<template>
  <div class="test1-container">
    <vab-alert :title="'Params Id=' + finalRoute.params.id" />
    <vab-json-viewer copyable :expand-depth="5" :value="finalRoute" />
  </div>
</template>

<script lang="ts" setup>
import VabJsonViewer from 'vue-json-viewer'
import { useTabsStore } from '/@/store/modules/tabs'

defineOptions({
  name: 'Test1',
})

const route = useRoute()
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
let finalRoute = reactive<any>({})

const handleParams = () => {
  const _route = route.matched[0].children.filter((item) => item.name === 'Test1')[0]
  const id = route.path.substring(route.path.lastIndexOf('/') + 1, route.path.length)
  finalRoute = {
    name: _route.name,
    path: _route.path,
    params: {
      id,
    },
  }
  changeTabsMeta({
    title: 'Params',
    meta: {
      title: `Params Id=${finalRoute.params.id}`,
    },
  })
}

watch(
  finalRoute,
  () => {
    handleParams()
  },
  {
    immediate: true,
  }
)
</script>
