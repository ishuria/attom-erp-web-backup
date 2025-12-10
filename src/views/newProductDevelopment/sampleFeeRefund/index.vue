<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="未退款" :name="0">
        <sample-fee-refund-table ref="tableRef0" :status="0" @image-preview="handlePreviewImage" />
      </el-tab-pane>
      <el-tab-pane label="已退款" :name="1">
        <sample-fee-refund-table ref="tableRef1" :status="1" @image-preview="handlePreviewImage" />
      </el-tab-pane>
      <el-tab-pane label="不可退款" :name="2">
        <sample-fee-refund-table ref="tableRef2" :status="2" @image-preview="handlePreviewImage" />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SampleFeeRefund',
})
const activeName = ref<number>(0)
const tableRef0 = ref<any>(null)
const tableRef1 = ref<any>(null)
const tableRef2 = ref<any>(null)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const handlePreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const handleTabClick = (tab: any) => {
  activeName.value = tab.index
  // 切换 tab 时获取对应 tab 的数据
  nextTick(() => {
    const tableRefs = [tableRef0, tableRef1, tableRef2]
    const currentTableRef = tableRefs[tab.index]
    if (currentTableRef.value) {
      currentTableRef.value.fetchData()
    }
  })
}

// 初始加载第一个 tab 的数据
onMounted(() => {
  nextTick(() => {
    if (tableRef0.value) {
      tableRef0.value.fetchData()
    }
  })
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;
      }
    }
  }
  .none {
    display: none;
  }
}
</style>
