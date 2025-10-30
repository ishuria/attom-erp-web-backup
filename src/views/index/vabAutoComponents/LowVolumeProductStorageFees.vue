<template>
  <vab-card :body-style="{ height: '522px' }" class="low-volume-product-storage-fees-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      低动销产品仓储费(上新超过50天且预计可售天数大于150天产品的仓储费)
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      :data="list"
      :default-sort="{ prop: 'estimateNextMonthStorageFee', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        prop="sku"
        :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'productDesc'))"
      >
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          <div class="product-desc-container">
            <span class="product-desc">{{ row.productDesc }}</span>
            <span class="flag-container" :class="{ 'japan-flag': row.flag === 'JP' }">
              <country-flag :country="row.flag" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运营" prop="operationUserName" width="95" />
      <el-table-column align="center" label="预计下月仓储费" min-width="120" prop="estimateNextMonthStorageFee" sortable="custom">
        <template #default="{ row }">¥{{ row.estimateNextMonthStorageFee }}</template>
      </el-table-column>
      <el-table-column align="center" label="预计剩余库存仓储天数" min-width="130" prop="remainingStorageDays">
        <template #default="{ row }">{{ row.remainingStorageDays }}天</template>
      </el-table-column>
      <el-table-column align="center" label="预计剩余总仓储费" min-width="120" prop="totalStorageFee" sortable="custom">
        <template #default="{ row }">¥{{ row.totalStorageFee }}</template>
      </el-table-column>
      <el-table-column align="center" label="预计库存售完利润" min-width="120" prop="expectedProfit">
        <template #default="{ row }">¥{{ row.expectedProfit }}</template>
      </el-table-column>
      <el-table-column align="center" label="建议清算" prop="recommendClearing" width="95">
        <template #default="{ row }">
          <vab-icon v-if="row.recommendClearing === 1" icon="check-fill" style="color: var(--el-color-success); font-size: 16px" />
          <vab-icon v-else icon="close-fill" style="color: var(--el-color-danger); font-size: 16px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="可报Outlet Deal" min-width="110" prop="outletDeal">
        <template #default="{ row }">
          <vab-icon v-if="row.outletDeal === 1" icon="check-fill" style="color: var(--el-color-success); font-size: 16px" />
          <vab-icon v-else icon="close-fill" style="color: var(--el-color-danger); font-size: 16px" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="[imagePreviewUrl]" @close="imagePreviewClose" />
  </vab-card>
</template>

<script lang="ts" setup>
import CountryFlag from 'vue-country-flag-next'
import { ILowVolumeProductStorageFee } from '/@/type/index/frontPage'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'LowVolumeProductStorageFees',
})

const props = defineProps<{
  list: ILowVolumeProductStorageFee[]
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'current-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'sort-change', data: { column: any; prop: string; order: any }): void
}>()

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}

const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  emit('sort-change', data)
}

const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewUrl.value = url
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.low-volume-product-storage-fees-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;

    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
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
    height: calc(100% - 52px);
  }
}
.low-volume-product-storage-fees-card :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.low-volume-product-storage-fees-card :deep(.clear-padding .cell) {
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
