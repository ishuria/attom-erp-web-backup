<template>
  <el-table-column
    v-for="col in visibleColumns"
    :key="col.columnId || col.prop"
    :label="getColumnLabel(col)"
    :min-width="getColumnMinWidth(col)"
    :prop="col.prop"
    :width="getColumnWidth(col)"
  >
    <template #header>
      <template v-if="col.prop === 'skuImageUrl'">
        产品
        <br />
        图片
      </template>
      <template v-else-if="col.prop === 'voucherUrl'">
        凭证
        <br />
        上传
      </template>
      <template v-else-if="col.prop === 'salesPrice' && activeName === AFTER_SALES_TAB.BAD_DEBT">
        待售后￥
        <br />
        (含税)
      </template>
      <template v-else>{{ getColumnLabel(col) }}</template>
    </template>

    <template #default="{ row }">
      <template v-if="col.prop === 'createTime' || col.prop === 'orderTime'">
        {{ row[col.prop] ? row[col.prop].split(' ')[0] : '' }}
      </template>
      <template v-else-if="col.prop === 'po'">
        <span class="copySku" @click="!canOpenPoDetail && handleClipboard($event, row.po)">
          <el-link v-if="canOpenPoDetail" type="primary" :underline="true" @click="emit('openPoDetail', row.poSkuId)">
            {{ row.po }}
          </el-link>
          <template v-else>{{ row.po }}</template>
          <vab-icon v-if="canOpenPoDetail" icon="file-copy-2-fill" @click="handleClipboard($event, row.po)" />
          <vab-icon v-else icon="file-copy-2-fill" />
        </span>
      </template>
      <template v-else-if="col.prop === 'skuImageUrl'">
        <el-image
          fit="fill"
          :src="row.skuImageUrl"
          style="display: block; width: 100%; height: 100%"
          @click="emit('showPreviewImage', row.skuImageUrl)"
        >
          <template #error>
            <el-icon />
          </template>
        </el-image>
      </template>
      <template v-else-if="col.prop === 'sku'">
        {{ row.sku }}
        <br />
        {{ row.productName }}
      </template>
      <template v-else-if="col.prop === 'productionHaltStatus'">
        <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1" />
      </template>
      <template v-else-if="col.prop === 'suppliser'">
        <span v-html="row.suppliser"></span>
      </template>
      <template v-else-if="col.prop === 'refundAmount'">
        <el-input v-if="activeName === AFTER_SALES_TAB.CONTACTED" v-model="row.refundAmount" clearable @change="emit('updateAfterSales', row)" />
        <template v-else>{{ row.refundAmount }}</template>
      </template>
      <template v-else-if="col.prop === 'afterSalesMethod'">
        <el-select
          v-model="row.afterSalesMethod"
          :disabled="activeName === AFTER_SALES_TAB.COMPLETED"
          style="min-width: 100%"
          @change="emit('updateAfterSales', row)"
        >
          <el-option v-for="item in afterSalesOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template v-else-if="col.prop === 'voucherUrl'">
        <el-upload
          v-if="activeName === AFTER_SALES_TAB.CONTACTED"
          class="component-upload"
          :class="{ hide: row.hide }"
          :file-list="row.imageList"
          :http-request="(file) => uploadImage(file, row)"
          list-type="picture-card"
        >
          <el-icon><plus /></el-icon>
          <template #file="{ file }">
            <div>
              <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="emit('previewFile', file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="emit('removeImage', row)">
                  <el-icon><delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-image
          v-else
          fit="fill"
          :src="row.voucherUrl"
          style="display: block; width: 100%; height: 100%"
          @click="emit('showPreviewImage', row.voucherUrl)"
        >
          <template #error>
            <el-icon />
          </template>
        </el-image>
      </template>
      <template v-else-if="col.prop === 'remark'">
        <el-tooltip content="" effect="dark" placement="top">
          <template #content>
            <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
          </template>
          <div class="multi-line-ellipsis" v-html="row.remark"></div>
        </el-tooltip>
      </template>
      <template v-else-if="col.prop === 'salesLog'">
        <el-tooltip content=" " effect="dark" placement="top">
          <template #content>
            <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
          </template>
          <div class="multi-line-ellipsis">{{ removeHtmlTags(row.salesLog) }}</div>
        </el-tooltip>
      </template>
      <template v-else>
        {{ row[col.prop] }}
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { computed } from 'vue'
import handleClipboard from '~/src/utils/clipboard'
import type { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'
import { calculateBrColumnWidth, flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

interface AfterSalesOption {
  label: string
  value: number
}

const props = defineProps<{
  activeName: number
  afterSalesOption: AfterSalesOption[]
  columns: IGetOperationColumnList[]
  list: any[]
  uploadImage: (file: any, row: any) => any
}>()

const emit = defineEmits<{
  openPoDetail: [poSkuId: any]
  previewFile: [file: UploadFile]
  removeImage: [row: any]
  showPreviewImage: [url: string]
  updateAfterSales: [row: any]
}>()

const AFTER_SALES_TAB = {
  SUMMARY: -1,
  PENDING_CONTACT: 0,
  CONTACTED: 1,
  COMPLETED: 2,
  MANY: 3,
  BAD_DEBT: 4,
} as const

const ALL_AFTER_SALES_TABS: number[] = [
  AFTER_SALES_TAB.SUMMARY,
  AFTER_SALES_TAB.PENDING_CONTACT,
  AFTER_SALES_TAB.CONTACTED,
  AFTER_SALES_TAB.COMPLETED,
  AFTER_SALES_TAB.MANY,
  AFTER_SALES_TAB.BAD_DEBT,
]

const PO_DETAIL_TABS: number[] = [AFTER_SALES_TAB.PENDING_CONTACT, AFTER_SALES_TAB.CONTACTED, AFTER_SALES_TAB.SUMMARY]

const afterSalesColumnTabMap: Record<string, number[]> = {
  createTime: ALL_AFTER_SALES_TABS,
  orderTime: ALL_AFTER_SALES_TABS,
  po: ALL_AFTER_SALES_TABS,
  skuImageUrl: ALL_AFTER_SALES_TABS,
  sku: ALL_AFTER_SALES_TABS,
  productionHaltStatus: ALL_AFTER_SALES_TABS,
  suppliser: ALL_AFTER_SALES_TABS,
  purchaseSkuNumber: ALL_AFTER_SALES_TABS,
  goodCount: ALL_AFTER_SALES_TABS,
  manyCount: ALL_AFTER_SALES_TABS,
  keepSampleCount: ALL_AFTER_SALES_TABS,
  lackCount: ALL_AFTER_SALES_TABS,
  badCount: ALL_AFTER_SALES_TABS,
  salesPrice: ALL_AFTER_SALES_TABS,
  refundAmount: [AFTER_SALES_TAB.CONTACTED, AFTER_SALES_TAB.COMPLETED, AFTER_SALES_TAB.BAD_DEBT],
  afterSalesMethod: [AFTER_SALES_TAB.CONTACTED, AFTER_SALES_TAB.COMPLETED],
  voucherUrl: [AFTER_SALES_TAB.CONTACTED, AFTER_SALES_TAB.COMPLETED],
  badDebtPrice: [AFTER_SALES_TAB.BAD_DEBT],
  sendCount: [AFTER_SALES_TAB.SUMMARY],
  orderCount: [AFTER_SALES_TAB.SUMMARY],
  remark: ALL_AFTER_SALES_TABS,
  salesLog: ALL_AFTER_SALES_TABS,
}

const afterSalesFixedWidthProps = ['skuImageUrl', 'voucherUrl']
const canOpenPoDetail = computed(() => PO_DETAIL_TABS.includes(props.activeName))
const visibleColumns = computed(() => props.columns.filter((item) => item.checked && afterSalesColumnTabMap[item.prop]?.includes(props.activeName)))

const getColumnLabel = (col: IGetOperationColumnList) => {
  if (col.prop === 'salesPrice' && props.activeName === AFTER_SALES_TAB.BAD_DEBT) return '待售后￥(含税)'
  return col.label
}

const getColumnSize = (col: IGetOperationColumnList) => {
  if (col.prop === 'sku') return flexColumnWidth(props.list, 'SKU', 'sku')
  if (col.prop === 'suppliser') return calculateBrColumnWidth(props.list, (row: any) => row.suppliser)
  return Number(col.width || col.minWidth || 100)
}

const getColumnWidth = (col: IGetOperationColumnList) => {
  return afterSalesFixedWidthProps.includes(col.prop) ? getColumnSize(col) : undefined
}

const getColumnMinWidth = (col: IGetOperationColumnList) => {
  return afterSalesFixedWidthProps.includes(col.prop) ? undefined : getColumnSize(col)
}

const uploadImage = (file: any, row: any) => {
  return props.uploadImage(file, row)
}
</script>

<style lang="scss" scoped>
.component-upload {
  width: 81px;
  height: 81.2px;
}

.component-upload :deep(.el-upload-list--picture-card) {
  width: 100%;
  height: 100%;
}

.component-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100%;
  height: 100%;
  margin: 0;
  border: 0;
  border-radius: 0;
  transition: none;
}

.component-upload :deep(.el-upload--picture-card) {
  width: 100%;
  height: 100%;
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
