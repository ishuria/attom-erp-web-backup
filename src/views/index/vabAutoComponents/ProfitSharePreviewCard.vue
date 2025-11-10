<template>
  <vab-card class="top30ProductSaleTable">
    <template #header>
      <vab-icon icon="information-line" />
      利润分预览
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>

    <el-table v-loading="loading" border :cell-style="{ textAlign: 'center' }" :data="list" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="月份" prop="month" />
      <el-table-column label="姓名" prop="userName" />
      <el-table-column label="利润组名" prop="groupName" />
      <el-table-column label="总利润分" prop="totalScore" />
      <el-table-column label="预计利润分" prop="monthProfitScore" />
      <el-table-column label="累计利润分" prop="pileProfitScore" />

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPageProfitScoreItem } from '/@/type/index/frontPage'

defineOptions({
  name: 'ProfitSharePreviewCard',
})

const props = defineProps<{
  list: IGetFrontPageProfitScoreItem[]
  loading: boolean
}>()
</script>

<style lang="scss" scoped>
.top30ProductSaleTable {
  height: 478px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 25px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }

  :deep(.el-table) {
    height: 100%;
  }
}
.top30ProductSaleTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.top30ProductSaleTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// 产品描述和国旗容器样式
.product-desc-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.flag-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: -4px;
}

// 日本国旗样式增加边框
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
}
</style>
