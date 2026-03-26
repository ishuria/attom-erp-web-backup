<template>
  <div class="supplier-tab-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-date-picker
              v-model="date"
              :clearable="false"
              :disabled-date="(time: Date) => time.getTime() > Date.now()"
              type="daterange"
              @change="queryData"
            />
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.siteList"
              class="multiple-select"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="全部站点"
              style="width: 250px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="filter-group">
              <el-checkbox v-model="queryForm.siteAgg" :false-value="0" :true-value="1" @change="queryData">站点聚合</el-checkbox>
              <el-checkbox v-model="queryForm.supplierAgg" :false-value="0" :true-value="1" @change="queryData">供应商聚合</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenLingChart">统计采购量</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
              <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
              <span style="flex: 1">{{ item.label }}</span>
              <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                <vab-icon icon="eye-line" />
              </span>
              <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                <vab-icon v-show="!item.checked" icon="eye-off-line" />
                <vab-icon v-show="item.checked" icon="eye-line" />
              </span>
            </div>
          </vab-draggable>
        </el-popover>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      class="product-table"
      :data="list"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="38" />
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? 'custom' : false"
        :width="item.width"
      >
        <template #default="{ row }">
          <div v-if="item.label === 'SKU'">
            <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
              {{ row.sku }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
            <br />
            {{ row.productName }}
          </div>
          <div v-if="item.label === '图片'">
            <el-image :src="row.skuImgUrl" style="width: 100%; height: 100%" @click="showImagePreview(row.skuImgUrl)">
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </div>
          <div v-if="item.label === '站点'" style="white-space: pre-line">
            {{ row.siteNames.replaceAll(',', '\n') }}
          </div>
          <div v-if="item.label === '主体供应商'" style="white-space: pre-line">
            {{ row.mainSupplierName.replaceAll(',', '\n') }}
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 统计采购量 -->
    <purchase-quantity-line-chart v-model:date="date" v-model:visible="lineChartVisible" />
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { CheckboxValueType } from 'element-plus'
import { hideOrShowOperationColumn, updateSortOperationColumn } from '~/src/api/devlocal/productPerformance'
import { IGetPurchaseStatisticsProductListReq, IGetPurchaseStatisticsSkuItem } from '/@/type/purchase/statistics'
import handleClipboard from '/@/utils/clipboard'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductTab',
})

const props = defineProps<{
  list: IGetPurchaseStatisticsSkuItem[]
  total: number
  queryForm: IGetPurchaseStatisticsProductListReq
  siteList: { id: number; label: string }[]
}>()

const columns = defineModel<any[]>('columns', { required: true })
const date = defineModel<[string, string]>('date', { required: true })
const listLoading = defineModel<boolean>('listLoading', { required: true })
const emit = defineEmits<{
  (e: 'query-data'): void
  (e: 'handle-current-change', val: number): void
  (e: 'handle-size-change', val: number): void
  (e: 'on-show-image-preview', url: string): void
}>()
const lineChartVisible = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    props.queryForm.siteList = props.siteList.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    props.queryForm.siteList = []
    // 取消全选获取数据
    queryData()
  }
}
const handleOpenLingChart = () => {
  lineChartVisible.value = true
}
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  })
  await updateSortOperationColumn(req)
}
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const handleWidth = (item: any) => {
  switch (item.label) {
    case 'SKU': {
      return flexColumnWidth(props.list, 'SKU', 'sku', 60)
    }
    case '主体供应商': {
      return flexColumnWidth(props.list, '主体供应商', 'mainSupplierName')
    }

    default: {
      return item.minWidth
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  props.queryForm.orderByField = prop
  if (!order) {
    if (props.queryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (props.queryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  props.queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
const queryData = () => {
  emit('query-data')
}
const handleCurrentChange = (val: number) => {
  emit('handle-current-change', val)
}

const handleSizeChange = (val: number) => {
  emit('handle-size-change', val)
}

const showImagePreview = (url: string) => {
  emit('on-show-image-preview', url)
}
</script>

<style lang="scss" scoped>
.supplier-tab-container {
  height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;
  display: flex;
  flex-direction: column;

  .vab-query-form {
    .left-panel {
      margin-bottom: 5px !important;
    }
    .el-form {
      .el-form-item:first-child {
        margin-bottom: 5px !important;

        .el-check-tag,
        .el-form-item__label {
          margin: 0 10px 5px 0;
          border-radius: 99px;
        }
      }
      .el-form-item:last-child {
        margin-bottom: 5px !important;
      }
    }
  }
  .el-table {
    flex: 1;
  }
}
// 筛选条件组样式
.filter-group {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 1px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f4;
  }

  :deep(.el-checkbox) {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
}
.product-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.product-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.handle {
  cursor: grab;
}
.disabled-handle {
  cursor: not-allowed;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
</style>
