<template>
  <vab-card :body-style="{ height: '522px' }" class="low-volume-product-storage-fees-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      做Vine回评追踪
      <div class="right-select">
        <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
          <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
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
        :width="Math.max(flexColumnWidth(list, 'SKU', 'sku', 50), flexColumnWidth(list, 'SKU', 'productDesc', 50))"
      >
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          <div class="product-desc-container">
            <span class="product-desc">{{ row.productDesc }}</span>
            <span class="flag-container" :class="{ 'japan-flag': row.flag === 'JP' }">
              <country-flag :country="row.flag" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上线日期" prop="saleDate" />
      <el-table-column label="上新天数" prop="newArrivalDay" />
      <el-table-column label="Vine数量" prop="vineCount" />
      <el-table-column label="产品经理" prop="productManager" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="[imagePreviewUrl]" @close="imagePreviewClose" />
  </vab-card>
</template>

<script lang="ts" setup>
import CountryFlag from 'vue-country-flag-next'
import handleClipboard from '~/src/utils/clipboard'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VineReviewCard',
})

const props = defineProps<{
  userList: { id: number; label: string }[]
}>()
const userId = ref<number>(-1)
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
const list = ref<any[]>([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
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
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
</style>
