<template>
  <vab-card class="top30ProductSaleTable">
    <template #header>
      <vab-icon icon="information-line" />
      TOP30新品销售额排行
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>

    <el-table border :cell-class-name="clearPadding" :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }">
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
      <el-table-column label="ASIN" min-width="110" prop="asin">
        <template #default="{ row }">
          <el-link class="always-underline" :href="row.amazonUrl" target="_blank" type="primary" :underline="false">{{ row.asin }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="近30天销售额" min-width="110" prop="monthOrderSales">
        <template #default="{ row }">${{ row.monthOrderSales }}</template>
      </el-table-column>
      <el-table-column label="近30天销量" min-width="100" prop="monthOrderVolume" />
      <el-table-column label="上新天数" min-width="95" prop="newArrivalDay">
        <template #default="{ row }">{{ row.newArrivalDay }}天</template>
      </el-table-column>
      <el-table-column label="产品经理" min-width="95" prop="productManager" />
      <el-table-column label="产品设计" min-width="95" prop="productDesign" />
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="[imagePreviewUrl]" @close="imagePreviewClose" />
  </vab-card>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import CountryFlag from 'vue-country-flag-next'
import { IGetOperationAmazonSKUList } from '/@/type/storeOperation/productPerformanceType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Top30ProductSaleTable',
})

const props = defineProps<{
  list: IGetOperationAmazonSKUList[]
}>()

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
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label === 'SKU') {
    return {
      textAlign: 'left',
    }
  } else if (data.column.label === '近30天销售额') {
    return {
      textAlign: 'right',
    }
  }
  return {
    textAlign: 'center',
  }
}
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

/* 确保链接下划线一直显示 */
.always-underline {
  text-decoration: underline !important;
}

.always-underline:hover {
  text-decoration: underline !important;
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
