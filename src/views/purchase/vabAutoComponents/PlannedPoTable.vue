<template>
  <div class="planned-po-table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <slot name="actions" />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <div>
              <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
                <template #reference>
                  <el-button>
                    <vab-icon icon="settings-line" />
                  </el-button>
                </template>
                <vab-draggable
                  v-model="columns"
                  :animation="600"
                  filter=".non-draggable"
                  handle=".handle"
                  :on-end="handleEnd"
                  :on-move="handleMove"
                >
                  <div
                    v-for="item in columns"
                    :key="item.label"
                    :class="{ 'non-draggable': item.disableCheck }"
                    style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                  >
                    <vab-icon
                      class="handle"
                      :class="{ 'disabled-handle': item.disableCheck }"
                      icon="draggable"
                      style="margin-right: 5px"
                    />
                    <span style="flex: 1">{{ item.label }}</span>
                    <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                      <vab-icon icon="eye-line" />
                    </span>
                    <span
                      v-else
                      class="icon-hover"
                      style="display: flex; align-items: center; cursor: pointer"
                      @click="handleChecked(item)"
                    >
                      <vab-icon v-show="!item.checked" icon="eye-off-line" />
                      <vab-icon v-show="item.checked" icon="eye-line" />
                    </span>
                  </div>
                </vab-draggable>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.customsStatus"
              clearable
              placeholder="报关状态筛选"
              style="width: 150px"
              @change="emit('query')"
            >
              <el-option label="全部报关状态" :value="-1" />
              <el-option label="报关" :value="0" />
              <el-option label="不报关" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showProcurementFilter">
            <el-select
              v-model="queryForm.procurementManager"
              clearable
              placeholder="采购负责人筛选"
              style="width: 150px"
              value-key="userId"
              @change="emit('query')"
            >
              <el-option v-for="item in procurementManagerOptions" :key="item.userId" :label="item.userName" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="emit('query')"
              @keyup.enter="emit('query')"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="emit('query')" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <div class="planned-po-table-body">
      <el-table
        ref="tableRef"
        v-loading="loading"
        border
        :cell-class-name="getCellClass"
        :cell-style="cellStyle"
        class="noneHoveTable custom-table-hover"
        :data="data"
        :header-cell-style="{ 'text-align': 'center' }"
        height="100%"
        :row-class-name="stripedRowClass"
        :span-method="objectSpanMethod"
        @cell-click="(row: any, col: any, cell: HTMLTableCellElement) => emit('cell-click', row, col, cell)"
        @row-click="handleRowClick"
        @selection-change="(rows: any) => emit('selection-change', rows)"
      >
        <el-table-column class="custom-checkbox" fixed="left" type="selection" />

        <el-table-column v-permissions="PlanPoPermission.poOperationColumnPermission()" fixed="left" label="PO操作" width="100">
          <template #default="{ row }">
            <el-dropdown>
              <el-button v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" text type="primary" @click="emit('publish-po', row)">
                发布PO
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" @click="emit('publish-po', row)">
                    <el-link type="primary" underline="never">发布PO</el-link>
                  </el-dropdown-item>
                  <slot name="po-dropdown-extra" :row="row" />
                  <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.DELETE] }" @click="emit('del-planned-po', row)">
                    <el-link type="danger" underline="never">删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <el-table-column label="状态" min-width="115" prop="publishStatus">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.publishStatus)">
              {{ getStatusLabel(row.publishStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in checkList"
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
          <template v-if="item.label === '创建日期'" #default="{ row }">
            {{ row.createTime.split(' ')[0] }}
          </template>
          <template v-if="item.label === 'SKU图片'" #default="{ row }">
            <el-image :lazy="true" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
          <template v-if="item.label === 'SKU'" #default="{ row }">
            <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
              {{ row.sku }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
          </template>
          <template v-if="item.label === '货币'" #default="{ row }">
            {{ currencyMap[row.currency as CurrencyCode] }}
          </template>
          <template v-else-if="item.label === '不报关'" #default="{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-else-if="item.label === '零件采购注意事项'" #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
            </el-tooltip>
          </template>
          <template v-else-if="item.label === '收货仓库'" #default="{ row }">
            <div :style="{ color: row.characteristic === 1 ? 'var(--el-color-danger)' : '' }">{{ row.repositoryName }}</div>
          </template>
        </el-table-column>

        <el-table-column v-permissions="PlanPoPermission.skuOperationColumnPermission()" fixed="right" label="SKU操作" width="120">
          <template #default="{ row }">
            <el-space>
              <el-button v-permissions="{ permission: [PlanPoPermission.DETAIL] }" link type="primary" @click="emit('planned-po-detail', row)">
                详情
              </el-button>
              <el-button
                v-permissions="{ permission: [PlanPoPermission.DELETE_PO_SKU] }"
                link
                type="danger"
                @click="emit('del-sku-planned-po', row)"
              >
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <vab-pagination
      class="planned-po-pagination"
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="(v: number) => emit('page-change', v)"
      @size-change="(v: number) => emit('size-change', v)"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import PlanPoPermission from '/@/permissions/planPo'
import type { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import handleClipboard from '/@/utils/clipboard'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import type { CurrencyCode } from '/@/views/purchase/constantOption'
import { currencyMap } from '/@/views/purchase/constantOption'

defineOptions({ name: 'PlannedPoTable' })

const props = defineProps<{
  data: IGetPlanPoList[]
  loading: boolean
  total: number
  queryForm: IGetPlanPoListQuery
  procurementManagerOptions: any[]
  showProcurementFilter?: boolean
}>()

const columns = defineModel<any[]>('columns', { required: true })

const emit = defineEmits<{
  query: []
  'page-change': [pageNo: number]
  'size-change': [pageSize: number]
  'selection-change': [rows: any]
  'cell-click': [row: any, column: any, cell: HTMLTableCellElement]
  'publish-po': [row: any]
  'del-planned-po': [row: any]
  'planned-po-detail': [row: any]
  'del-sku-planned-po': [row: any]
}>()

const checkList = computed(() => columns.value?.filter((item: any) => item.checked) ?? [])

const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({ userId: item.userId, columnId: item.columnId, status })
}

const handleEnd = async () => {
  const req = (columns.value ?? []).map((item: any, index: number) => ({
    userId: item.userId,
    columnId: item.columnId,
    sort: index,
  }))
  await updateSortOperationColumn(req)
}

const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)
  if (columns.value?.[targetIndex]?.disableCheck) return false
  return true
}

const columnWidthCache = ref<Map<string, number>>(new Map())
const handleCalculateWidth = (item: any) => {
  const cacheKey = `${item.label}-${item.prop}-${props.data.length}`
  if (columnWidthCache.value.has(cacheKey)) return columnWidthCache.value.get(cacheKey)!
  let width = item.minWidth
  switch (item.label) {
    case 'SKU': {
      width = flexColumnWidth(props.data, 'SKU', 'sku')
      break
    }
    case '零件名': {
      width = flexColumnWidth(props.data, '零件名', 'componentName')
      break
    }
    case '供应商': {
      width = flexColumnWidth(props.data, '供应商', 'suppliser')
      break
    }
    default: {
      width = item.minWidth
    }
  }
  columnWidthCache.value.set(cacheKey, width)
  return width
}

const getStatusType = (status: number) => {
  const types = ['', 'success', 'warning', 'danger'] as const
  return types[status] || 'info'
}

const getStatusLabel = (status: number) => {
  const labels = ['', '可发布', '数量审批', '不报关审批']
  return labels[status] || '-'
}

const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  const label = data.column.label
  if (label === 'SKU图片' || label === 'PO操作') return 'clear-padding'
  return ''
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label !== 'SKU' && label !== '零件名' && label !== '零件采购注意事项' && label !== '供应商') {
    return { textAlign: 'center' }
  }
}

const spanCache = ref<Map<string, { rowspan: number; colspan: number }>>(new Map())
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  const label = column.label
  const cacheKey = `${rowIndex}-${columnIndex}-${label}`
  if (spanCache.value.has(cacheKey)) return spanCache.value.get(cacheKey)!

  let result = { rowspan: 1, colspan: 1 }

  if (columnIndex === 0 || label === 'PO操作' || label === '创建日期' || label === '请购人' || label === '站点' || label === '状态') {
    const id = row.id
    const isFirstOccurrence = rowIndex === 0 || props.data[rowIndex - 1].id !== id
    if (isFirstOccurrence) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < props.data.length; i++) {
        if (props.data[i].id === id) rowspan++
        else break
      }
      result = { rowspan, colspan: 1 }
    } else {
      result = { rowspan: 0, colspan: 0 }
    }
  }

  if (label === '采购负责人' || label === 'SKU' || label === '数量' || label === 'SKU图片' || label === 'SKU操作') {
    const poSkuId = row.poSkuId
    const isFirstOccurrence =
      rowIndex === 0 || props.data[rowIndex - 1].poSkuId !== poSkuId || props.data[rowIndex - 1].id !== row.id
    if (isFirstOccurrence) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < props.data.length; i++) {
        if (props.data[i].poSkuId === poSkuId && props.data[i].id === row.id) rowspan++
        else break
      }
      result = { rowspan, colspan: 1 }
    } else {
      result = { rowspan: 0, colspan: 0 }
    }
  }

  spanCache.value.set(cacheKey, result)
  return result
}

watch(
  () => props.data,
  () => {
    spanCache.value.clear()
    columnWidthCache.value.clear()
  }
)

const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
const stripedRowClass = (_row: any) => {
  const { row } = _row
  const stripedClass = row.id % 2 === 0 ? 'el-table__row--striped' : ''
  const selectedClass = row.id === selectedRowIndex.value ? 'select-row' : ''
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}

const tableRef = ref<TableInstance>()
defineExpose({
  doLayout: () => tableRef.value?.doLayout(),
  clearSelection: () => tableRef.value?.clearSelection(),
})
</script>

<style lang="scss" scoped>
.planned-po-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.planned-po-table-container :deep(.vab-query-form),
.planned-po-pagination {
  flex-shrink: 0;
}

.planned-po-table-body {
  flex: 1;
  min-height: 0;
}

:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
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
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
.handle {
  cursor: grab;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2;
}
.disabled-handle {
  cursor: not-allowed;
}
.search-input {
  width: 300px !important;
}
</style>
