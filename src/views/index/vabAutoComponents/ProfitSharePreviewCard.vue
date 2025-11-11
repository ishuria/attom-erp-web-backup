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
      <el-table-column label="月份" min-width="90" prop="month" />
      <el-table-column label="姓名" min-width="95" prop="userName" />
      <el-table-column label="利润组名" min-width="130" prop="groupName">
        <template #default="{ row }">
          <el-popover v-if="row.skus && row.skus.length > 0" placement="top" trigger="hover" :width="360">
            <template #reference>
              <span style="cursor: pointer; color: var(--el-color-primary)">
                {{ row.groupName }}
              </span>
            </template>
            <div style="max-height: 300px; overflow-y: auto">
              <div style="font-weight: 600; margin-bottom: 8px; color: var(--el-text-color-primary)">SKU：</div>
              <div v-for="sku in row.skus" :key="sku" style="padding: 4px 0; border-bottom: 1px solid var(--el-border-color-lighter)">
                {{ sku }}
              </div>
            </div>
          </el-popover>
          <span v-else>{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总利润分" min-width="100" prop="totalProfit" />
      <el-table-column label="预计利润分" min-width="110" prop="monthProfitScore" />
      <el-table-column label="累计利润分" min-width="115" prop="pileProfitScore" />

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
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
  pageNo: number
  pageSize: number
  total: number
}>()

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}

const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const emit = defineEmits<{
  (e: 'current-change', val: number): void
  (e: 'size-change', val: number): void
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
