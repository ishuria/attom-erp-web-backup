<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="未退款" :name="0">
        <sample-fee-refund-table :status="0" />
      </el-tab-pane>
      <el-tab-pane label="已退款" :name="1">
        <sample-fee-refund-table :status="1" />
      </el-tab-pane>
      <el-tab-pane label="不可退款" :name="2">
        <sample-fee-refund-table :status="2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SampleFeeRefund',
})
const activeName = ref<number>(0)
const handleTabClick = (tab: any) => {
  activeName.value = tab.index
}
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
