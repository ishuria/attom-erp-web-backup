<template>
  <div class="po-table-container">
    <div class="po-table-wrapper">
      <el-table
        v-loading="!!listLoading"
        v-permissions="{ permission: [PoPermission.QUERY] }"
        border
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        class="noneHoveTable custom-table-hover"
        :data="data"
        :header-cell-style="{ 'text-align': 'center' }"
        :row-class-name="rowClassName"
        :span-method="spanMethod"
        @row-click="$emit('rowClick', $event)"
        @selection-change="$emit('selectionChange', $event)"
      >
        <!-- PO操作列 -->
        <el-table-column v-if="showPoOperation" label="PO操作" prop="selectedPoRow" width="50">
          <template #header>
            <el-checkbox @change="$emit('selectAllPoRow', $event)" />
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.selectedPoRow" @change="$emit('selectedPoRow', $event, row)" />
          </template>
        </el-table-column>

        <!-- PO列 -->
        <el-table-column label="PO" min-width="120" prop="po">
          <template #default="{ row }">
            <span class="copySku">
              <el-link style="margin-right: 3px" type="primary" @click="$emit('poDetail', row)">{{ row.po }}</el-link>
              <vab-icon icon="file-copy-2-fill" @click="$emit('clipboard', $event, row.po)" />
            </span>
          </template>
        </el-table-column>

        <!-- 数据来源列 -->
        <el-table-column label="数据来源" width="110">
          <template #default="{ row }">
            {{ row.oldErpId ? '老系统数据' : '新系统数据' }}
          </template>
        </el-table-column>

        <!-- 发布日期列 -->
        <el-table-column label="发布日期" min-width="115" prop="releaseDate">
          <template #default="{ row }">
            {{ row.releaseDate.split(' ')[0] }}
          </template>
        </el-table-column>

        <!-- 请购人列 -->
        <el-table-column label="请购人" prop="createUserName" />

        <!-- 发布人列 -->
        <el-table-column label="发布人" prop="userName" />

        <!-- 站点列 -->
        <el-table-column label="站点" min-width="130" prop="siteName" />

        <!-- SKU图片列 -->
        <el-table-column label="SKU图片" width="82">
          <template #header>
            SKU
            <br />
            图片
          </template>
          <template #default="{ row }">
            <el-image
              :fit="lazyLoadImage ? 'fill' : undefined"
              :lazy="lazyLoadImage"
              :src="row.skuImageUrl"
              style="width: 100%; height: 100%"
              @click="$emit('previewImage', row.skuImageUrl)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>

        <!-- SKU列 -->
        <el-table-column label="SKU" prop="sku" :width="handleCalculateWidth({ label: 'SKU' })">
          <template #default="{ row }">
            <span class="copySku" data-sku="row.sku" @click="$emit('clipboard', $event, row.sku)">
              {{ row.sku }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
          </template>
        </el-table-column>

        <!-- 数量列 -->
        <el-table-column label="数量" prop="purchaseSkuNumber" :width="handleCalculateWidth({ label: '数量' })" />

        <!-- 零件操作列：使用原生选择列 -->
        <el-table-column v-if="showCompOperation" type="selection" width="50" />

        <!-- 零件名列 -->
        <el-table-column label="零件名" prop="componentName" :width="handleCalculateWidth({ label: '零件名' })" />

        <!-- 零件数量列 -->
        <el-table-column label="零件数量" prop="purchaseCount" :width="handleCalculateWidth({ label: '零件数量' })" />

        <!-- 单位列 -->
        <el-table-column label="单位" prop="unit" :width="handleCalculateWidth({ label: '单位' })" />

        <!-- 签收日期列 -->
        <el-table-column label="签收日期" min-width="115" prop="signDate">
          <template #default="{ row }">
            {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
          </template>
        </el-table-column>

        <!-- 含税运费列 -->
        <el-table-column label="含税运费" min-width="100" prop="freight" />

        <!-- 模具含税列 -->
        <el-table-column label="模具含税" min-width="100" prop="moldCost" />

        <!-- 含税总价列 -->
        <el-table-column label="含税总价" prop="taxIncludedPrice" :width="handleCalculateWidth({ label: '含税总价' })" />

        <!-- 已付金额列 -->
        <el-table-column label="已付金额" prop="payPrice" :width="handleCalculateWidth({ label: '已付金额' })" />

        <!-- 货币列 -->
        <el-table-column label="货币" prop="currency" width="90">
          <template #default="{ row }">
            {{ currencyMap[row.currency as CurrencyCode] }}
          </template>
        </el-table-column>

        <!-- 付款记录列 -->
        <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
          <template #default="{ row }">
            <div class="hover-opacity" style="cursor: pointer" @click="$emit('showPaymentHistory', row)" v-html="row.paymentRecord"></div>
          </template>
        </el-table-column>

        <!-- 供应商列 -->
        <el-table-column label="供应商" prop="suppliser" :width="handleCalculateWidth({ label: '供应商' })" />

        <!-- 采购方列 -->
        <el-table-column label="采购方" min-width="100" prop="purchase" />

        <!-- 不报关列 -->
        <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
          <template #default="{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>

        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </div>
    <div class="po-pagination-wrapper">
      <vab-pagination
        v-permissions="{ permission: [PoPermission.QUERY] }"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @current-change="$emit('currentChange', $event)"
        @size-change="$emit('sizeChange', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PoPermission from '/@/permissions/po'
import type { CurrencyCode } from '/@/views/purchase/constantOption'
import { currencyMap } from '/@/views/purchase/constantOption'

const props = defineProps<{
  listLoading?: boolean
  data: any[]
  rowClassName?: (data: any) => string
  cellClassName?: (data: any) => string
  cellStyle?: (data: any) => any
  spanMethod?: (data: any) => any
  showPoOperation?: boolean
  showCompOperation?: boolean
  pageNo: number
  pageSize: number
  total: number
  tableColumnWidth: number
  handleCalculateWidth: (item: any) => number
  lazyLoadImage?: boolean
}>()

defineEmits<{
  rowClick: [row: any]
  selectAllPoRow: [event: any]
  selectedPoRow: [event: any, row: any]
  selectionChange: [rows: any[]]
  poDetail: [row: any]
  clipboard: [event: any, text: string]
  previewImage: [url: string]
  showPaymentHistory: [row: any]
  currentChange: [page: number]
  sizeChange: [size: number]
}>()
</script>

<style lang="scss" scoped>
.po-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.po-table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-table) {
    flex: 1;
    overflow: auto;
  }
}

.po-pagination-wrapper {
  flex-shrink: 0;
  padding: 16px 0;
  margin-top: 8px;
  background-color: var(--el-bg-color);
  z-index: 1;
}

// 勾选框放大
:deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}

// 斑马纹样式
.noneHoveTable :deep(.el-table__row--striped) {
  background-color: #fafafa !important;
}

.noneHoveTable :deep(.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important;
}

// 付款记录hover效果
.hover-opacity {
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.5;
  }
}

// 复制SKU效果
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px !important;
  padding-left: 0px !important;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
