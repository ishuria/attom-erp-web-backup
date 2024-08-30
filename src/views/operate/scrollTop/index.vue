<template>
  <div class="scroll-top-container">
    <el-affix :offset="152">
      <el-button type="primary">下次打开页面时可以自动跳转至您当前滚动条的记录位置，当前距离顶部的距离（px） {{ pageScrollTop }}</el-button>
    </el-affix>
    <ul>
      <li v-for="item in 200" :key="item">Vue Shop Vite - {{ item }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'ScrollTop',
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { scrollTop } = storeToRefs(settingsStore)
const pageScrollTop = ref<any>(0)

const handleScroll = () => {
  const uniqueArray = scrollTop.value
  const pageItem = uniqueArray.find((item: any) => item.routeName === route.name) as any
  if (pageItem) pageScrollTop.value = pageItem.scrollTop
}

onActivated(() => {
  nextTick(() => {
    handleScroll()

    document.addEventListener('wheel', () => {
      handleScroll()
    })
  })
})
</script>

<style lang="scss" scoped>
.scroll-top-container {
  li {
    line-height: calc(var(--el-margin) * 1.5);
  }
}
</style>
