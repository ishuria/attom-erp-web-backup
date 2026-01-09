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

        <!-- 动态列：PO基本信息 -->
        <el-table-column
          v-for="item in filteredPoBasicColumns"
          :key="item.label"
          :label="item.label"
          :min-width="handleCalculateWidth(item)"
          :prop="item.prop"
        >
          <template v-if="item.label === 'PO'" #default="{ row }">
            <span class="copySku">
              <el-link style="margin-right: 3px" type="primary" @click="$emit('poDetail', row)">{{ row.po }}</el-link>
              <vab-icon icon="file-copy-2-fill" @click="$emit('clipboard', $event, row.po)" />
            </span>
          </template>
          <template v-else-if="item.label === '数据来源'" #default="{ row }">
            {{ row.oldErpId ? '老系统数据' : '新系统数据' }}
          </template>
          <template v-else-if="item.label === '发布日期'" #default="{ row }">
            {{ row.releaseDate.split(' ')[0] }}
          </template>
          <template v-else-if="item.label === '站点'" #default="{ row }">
            <el-tag size="default" :style="getSiteTagStyle(row.siteName)">{{ row.siteName }}</el-tag>
          </template>
        </el-table-column>

        <!-- 动态列：SKU相关 -->
        <el-table-column
          v-for="item in filteredSkuColumns"
          :key="item.label"
          :label="item.label"
          :min-width="handleCalculateWidth(item)"
          :prop="item.prop"
        >
          <template v-if="item.label === 'SKU图片'" #header>
            SKU
            <br />
            图片
          </template>
          <template v-if="item.label === 'SKU图片'" #default="{ row }">
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
          <template v-if="item.label === 'SKU'" #default="{ row }">
            <span class="copySku" data-sku="row.sku" @click="$emit('clipboard', $event, row.sku)">
              {{ row.sku }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
          </template>
        </el-table-column>

        <!-- 零件操作列：使用原生选择列 -->
        <el-table-column v-if="showCompOperation" type="selection" width="50" />

        <!-- 动态列：零件信息 -->
        <el-table-column
          v-for="item in filteredComponentColumns"
          :key="item.label"
          :label="item.label"
          :min-width="handleCalculateWidth(item)"
          :prop="item.prop"
        >
          <template v-if="item.label === '签收日期'" #default="{ row }">
            {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
          </template>
          <template v-else-if="item.label === '货币'" #default="{ row }">
            {{ currencyMap[row.currency as CurrencyCode] }}
          </template>
          <template v-else-if="item.label === '不报关'" #default="{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-else-if="item.label === '付款记录'" #default="{ row }">
            <div class="hover-opacity" style="cursor: pointer" @click="$emit('showPaymentHistory', row)" v-html="row.paymentRecord"></div>
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
import { computed } from 'vue'
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
  poBasicColumns: any[]
  skuColumns: any[]
  componentColumns: any[]
  showPoOperation?: boolean
  showCompOperation?: boolean
  pageNo: number
  pageSize: number
  total: number
  handleCalculateWidth: (item: any) => number
  lazyLoadImage?: boolean
}>()

// 使用 computed 缓存过滤后的列，避免每次渲染都执行 filter
const filteredPoBasicColumns = computed(() => props.poBasicColumns.filter((col: any) => col.checked))
const filteredSkuColumns = computed(() => props.skuColumns.filter((col: any) => col.checked))
const filteredComponentColumns = computed(() => props.componentColumns.filter((col: any) => col.checked))

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
// 站点 -> 自定义颜色映射
const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A', // 绿色
    亚马逊UK英国: '#409EFF', // 蓝色
    亚马逊DE德国: '#8E44AD', // 紫色（由红色改为紫色）
    亚马逊CA加拿大: '#2AC3A2', // 青绿
    沃尔玛US美国: '#E6A23C', // 橙色
    亚马逊JP日本: '#5C6BC0', // 靛蓝
    Tiktok美国: '#34495E', // 深石板色
    '美国-海外仓': '#909399', // 灰色
  }
  return colorMap[siteName] ?? '#909399'
}

// 返回协调的tag样式：浅色背景 + 同色文字
const getSiteTagStyle = (siteName: string) => {
  const base = getSiteBaseColor(siteName)
  // 将16进制转换为rgba，背景使用较低透明度
  const hexToRgba = (hex: string, alpha = 0.15) => {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return {
    backgroundColor: hexToRgba(base, 0.15),
    color: base,
    border: '1px solid ' + hexToRgba(base, 0.35),
    fontSize: '14px',
  }
}
</script>

<style lang="scss" scoped>
.po-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

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
  }
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
  transition: opacity 0.3s; /* 添加过渡效果 */
  &:hover {
    opacity: 0.5; /* Hover 时透明度 */
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
