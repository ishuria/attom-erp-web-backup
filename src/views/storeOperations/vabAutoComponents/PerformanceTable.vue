<template>
  <!-- 优化：使用单一根元素包裹所有内容，确保属性可以正确继承 -->
  <div class="performance-table-wrapper">
    <!-- 优化：骨架屏立即显示，优化首屏渲染 -->
    <div v-if="loading">
      <el-skeleton animated :loading="loading">
        <template #template>
          <div style="display: flex; flex-direction: column; height: calc(100vh - 270px)">
            <div style="display: flex; flex: 1; flex-direction: column; padding: 0">
              <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
              <div style="display: flex; justify-content: center; margin-top: 20px">
                <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <div v-else-if="!loading && (!data || data.length === 0)">
      <el-empty class="vab-data-empty" description="暂无数据" />
    </div>
    <el-table
      v-if="!loading && data && data.length > 0"
      v-loading="loading"
      v-bind="$attrs"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="data"
      :default-sort="defaultSort"
      :header-cell-class-name="headerCell"
      :header-cell-style="{ textAlign: 'center', verticalAlign: 'top' }"
      :row-class-name="props.rowClassName || rowClassName"
      :row-key="rowKey"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.columnId"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? (type === 'sku' ? 'custom' : item.sortable) : false"
        :width="item.width"
      >
        <template #header>
          <performance-table-header :item="item" />
        </template>
        <template #default="{ row }">
          <performance-table-cell
            :is-boss="isBoss"
            :item="item"
            :row="row"
            :seasonal-x-data="seasonalXData"
            :type="type"
            :user-name="userName"
            :x-axis="xAxis"
            @image-preview="emit('imagePreview', $event)"
            @router-push="emit('routerPush', $event)"
            @show-operation-log="emit('showOperationLog', $event)"
            @show-release-order="emit('showReleaseOrder', $event)"
            @show-remark="emit('showRemark', $event)"
            @update-ope-type="emit('updateOpeType', $event)"
            @update-stop-status="emit('updateStopStatus', $event)"
          />
        </template>
      </el-table-column>
      <!-- 将 el-empty 移动到表格外部，作为独立的状态显示 -->
      <!-- <template #empty>
        <el-empty class="vab-data-empty" />
      </template> -->
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'PerformanceTable',
  inheritAttrs: false, // 禁用自动属性继承，手动绑定到 el-table
})

// Props
interface Props {
  data: any[]
  columns: IGetOperationColumnList[]
  loading?: boolean
  type?: 'sku' | 'asin' | 'pAsin'
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
  rowKey?: string | ((row: any) => string)
  rowClassName?: string | ((row: any) => string)
  activeName?: number
  xAxis?: number[]
  seasonalXData?: string[]
  userName?: string
  isBoss?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'sku',
  defaultSort: () => ({ prop: 'currentSalesNumber', order: 'descending' }),
  rowKey: (row: any) => row.id || row.skuId || row.asinId || row.parentAsinId,
  activeName: 0,
  xAxis: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  seasonalXData: () => [],
  userName: '',
  isBoss: false,
})

// Emits
const emit = defineEmits<{
  cellClick: [row: any, column: any]
  rowClick: [row: any, column: any, event: Event]
  sortChange: [data: { column: any; prop: string; order: any }]
  imagePreview: [url: string]
  showOperationLog: [row: any]
  showReleaseOrder: [row: any]
  showRemark: [row: any]
  updateOpeType: [row: any]
  updateStopStatus: [row: any]
  routerPush: [row: any]
  goToReview: [asin: string]
}>()

// 标签映射和判断函数已移至 PerformanceTableCell.vue 组件中

// 使用 Set 优化查找性能
const leftAlignLabels = new Set(['SKU', 'ASIN', '父体ASIN', '库龄', '产品描述', '运营分类', '运营负责人', '开发人员'])
const clickableLabels = new Set(['小类排名', '大类排名', 'VOC满意度'])
const headerCellLabels = new Set([
  '今销',
  '月净利润',
  '结算月额',
  '结算月量',
  '2周广告转化',
  '2周总转化',
  'FBA差异',
  '月退货%',
  'FBA仓储费',
  '月ACOS',
  'VOC满意度',
  '剩余库存',
  '订单月额',
  '订单月量',
])

// 缓存常用样式对象，避免重复创建
const STYLE_CENTER = { textAlign: 'center' } as const
const STYLE_LEFT = { textAlign: 'left' } as const
const STYLE_LEFT_POINTER = { textAlign: 'left', cursor: 'pointer' } as const
const STYLE_CENTER_POINTER = { textAlign: 'center', cursor: 'pointer' } as const
const STYLE_CENTER_SUCCESS = { textAlign: 'center', color: 'var(--el-color-success)' } as const
const STYLE_CENTER_DANGER = { textAlign: 'center', color: 'var(--el-color-danger)' } as const
const STYLE_CENTER_WARNING = { textAlign: 'center', color: 'var(--el-color-warning)' } as const

const headerCell = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  return headerCellLabels.has(data.column.label) ? 'header-cell clearLR-padding' : 'clearLR-padding'
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label

  // 使用 Set 查找，比数组 includes 快
  if (leftAlignLabels.has(label)) {
    return STYLE_LEFT
  }
  if (label === '运营备注') {
    return STYLE_LEFT_POINTER
  }
  if (clickableLabels.has(label)) {
    return STYLE_CENTER_POINTER
  }

  // 处理需要动态计算的样式
  switch (label) {
    case 'FBA差异': {
      return data.row.differenceFba > 0 ? STYLE_CENTER_SUCCESS : STYLE_CENTER_DANGER
    }
    case '月净利': {
      const monthNetProfitMargin = data.row.monthNetProfitMargin * 100
      if (monthNetProfitMargin >= 20) return STYLE_CENTER_SUCCESS
      if (monthNetProfitMargin > 0) return STYLE_CENTER_WARNING
      return STYLE_CENTER_DANGER
    }
    case 'PASIN毛利率': {
      const monthNetProfitMargin = data.row.pAsinMonthNetProfitMargin
      if (monthNetProfitMargin >= 20) return STYLE_CENTER_SUCCESS
      if (monthNetProfitMargin > 0) return STYLE_CENTER_WARNING
      return STYLE_CENTER_DANGER
    }
    case '月净利润': {
      return data.row.monthNetProfit > 0 ? STYLE_CENTER_SUCCESS : STYLE_CENTER_DANGER
    }
    case 'PASIN毛利润': {
      return data.row.pAsinMonthNetProfit > 0 ? STYLE_CENTER_SUCCESS : STYLE_CENTER_DANGER
    }
    case '月ACOS': {
      const monthAcos = data.row.monthAcos * 100
      if (monthAcos > 35) return STYLE_CENTER_DANGER
      if (monthAcos > 30) return STYLE_CENTER_WARNING
      return STYLE_CENTER_SUCCESS
    }
    case '1年ACOS': {
      const yearAcos = data.row.yearAcos * 100
      if (yearAcos > 35) return STYLE_CENTER_DANGER
      if (yearAcos > 30) return STYLE_CENTER_WARNING
      return STYLE_CENTER_SUCCESS
    }
    default: {
      return STYLE_CENTER
    }
  }
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  const label = data.column.label
  return label === '图片' || label === '饼图' ? 'clear-padding' : ''
}

const rowClassName = ({ row }: { row: any }) => {
  // 这里可以处理行样式，如果需要的话
  return ''
}

const handleWidth = (item: any) => {
  if (props.activeName === 0) {
    switch (item.label) {
      case 'SKU': {
        return Math.max(flexColumnWidth(props.data, 'SKU', 'sku') + 50, 270)
      }
      case 'ASIN': {
        return flexColumnWidth(props.data, 'ASIN', 'asin')
      }
      case '父体ASIN': {
        return flexColumnWidth(props.data, '父体ASIN', 'parentAsin')
      }
      case '运营分类': {
        return flexColumnWidth(props.data, '运营分类', 'operationTypeList', 60)
      }
      case '产品描述': {
        return flexColumnWidth(props.data, '产品描述', 'productDesc')
      }
      case '开发人员': {
        return calculateBrColumnWidth(props.data, (row: any) => row._developName, 90)
      }
      case '剩余库存': {
        const availableWidth = flexColumnWidth(props.data, '剩余库存', 'availableInventory')
        const fbaWidth = flexColumnWidth(props.data, '/', 'fbaCount', 0)
        return `${Number(availableWidth) + Number(fbaWidth) + 30}px`
      }
      case '最近入库': {
        return 120
      }
      default: {
        return item.minWidth
      }
    }
  } else if (props.activeName === 1) {
    switch (item.label) {
      case 'SKU': {
        return calculateBrColumnWidth(props.data, (row: any) => row._sku, 100)
      }
      case 'ASIN': {
        return flexColumnWidth(props.data, 'ASIN-ASIN-ASIN-ASI', 'asin', 60)
      }
      case '父体ASIN': {
        return flexColumnWidth(props.data, '父体ASIN', 'parentAsin')
      }
      case '运营分类': {
        return flexColumnWidth(props.data, '运营分类', 'operationTypeList', 60)
      }
      case '产品描述': {
        return flexColumnWidth(props.data, '产品描述', 'productDesc')
      }
      case '开发人员': {
        return calculateBrColumnWidth(props.data, (row: any) => row._developName, 100)
      }
      case '最近入库': {
        return 120
      }
      case '剩余库存': {
        const availableWidth = flexColumnWidth(props.data, '剩余库存', 'availableInventory')
        const fbaWidth = flexColumnWidth(props.data, '/', 'fbaCount', 0)
        return `${Number(availableWidth) + Number(fbaWidth) + 30}px`
      }
      default: {
        return item.minWidth
      }
    }
  } else {
    switch (item.label) {
      case 'SKU': {
        return calculateBrColumnWidth(props.data, (row: any) => row._sku, 100, 30)
      }
      case '父体ASIN': {
        return flexColumnWidth(props.data, '父体ASIN-ASIN-ASIN', 'parentAsin')
      }
      case '产品描述': {
        return flexColumnWidth(props.data, '产品描述', 'productDesc')
      }
      case '开发人员': {
        return calculateBrColumnWidth(props.data, (row: any) => row._developName, 100)
      }
      default: {
        return item.minWidth
      }
    }
  }
}

const handleCellClick = (row: any, column: any) => {
  emit('cellClick', row, column)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('rowClick', row, column, event)
}

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  emit('sortChange', data)
}

// 判断函数和标签映射已移至 PerformanceTableCell.vue 组件中
</script>

<style lang="scss" scoped>
.performance-table-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
}

.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.clearLR-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.noneHoverTable :deep(.header-cell .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
