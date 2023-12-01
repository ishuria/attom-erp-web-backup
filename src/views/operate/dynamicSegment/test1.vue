<template>
  <div class="test1-container">
    <vab-alert :title="'Params Id=' + id" />
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
const id = ref<string>('')
const finalRoute = reactive<any>({
  name: '',
  path: '',
  params: {
    id: '111',
  },
})

const handleParams = () => {
  const _route = route.matched[0].children.filter((item) => item.name === 'Test1')[0]
  id.value = route.path.substring(route.path.lastIndexOf('/') + 1, route.path.length)
  finalRoute.name = _route.name
  finalRoute.path = _route.path
  finalRoute.params.id = id
  changeTabsMeta({
    title: 'Params',
    meta: {
      title: `Params Id=${id}`,
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
