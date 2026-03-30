<template>
  <div class="comprehensive-table-container auto-height-container inventory-history-page">
    <vab-query-form>
      <vab-query-form-left-panel :span="12" />
      <vab-query-form-right-panel :span="12">
        <div class="query-actions-row">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-date-picker
                v-model="dateRange"
                clearable
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
                clearable
                placeholder="请输入关键词"
                style="width: 280px"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :icon="RefreshRight" :disabled="listLoading" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="rowKey"
      :span-method="tableSpanMethod"
    >
      <el-table-column align="center" label="SKU图片" min-width="100" prop="skuImg">
        <template #default="{ row }">
          <div class="sku-image-cell">
            <el-image
              v-if="row.skuImg"
              :preview-src-list="[row.skuImg]"
              :preview-teleported="true"
              :src="row.skuImg"
              fit="cover"
              preview-class-name="inventory-count-image-viewer"
              @click.stop
            />
            <span v-else>-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="140" prop="sku" show-overflow-tooltip />
      <el-table-column label="产品名称" min-width="220" prop="productName" show-overflow-tooltip />
      <el-table-column label="PO" min-width="140" prop="po" show-overflow-tooltip />
      <el-table-column align="center" label="订货日期" min-width="160" prop="orderDate">
        <template #default="{ row }">
          {{ formatDisplayDateTime(row.orderDate) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="实际完成数" min-width="110" prop="actualCount">
        <template #default="{ row }">
          {{ formatNumber(row.actualCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="打包任务数" min-width="110" prop="taskCount">
        <template #default="{ row }">
          {{ formatNumber(row.taskCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="待售后数量(坏+缺)" min-width="120" prop="afterCount">
        <template #default="{ row }">
          {{ formatNumber(row.afterCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总装箱数量" min-width="110" prop="encasementCount">
        <template #default="{ row }">
          {{ formatNumber(row.encasementCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总售后数" min-width="110" prop="totalAfterCount">
        <template #default="{ row }">
          {{ formatNumber(getTotalAfterCount(row)) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="缺数" min-width="100" prop="lackCount">
        <template #default="{ row }">
          {{ formatNumber(row.lackCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总发货数" min-width="110" prop="totalSendCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalSendCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总接收数" min-width="110" prop="totalReceiveCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalReceiveCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="未装箱数量" min-width="160" prop="noEncasementCount">
        <template #default="{ row }">
          {{ formatNumber(row.noEncasementCount) }}
        </template>
      </el-table-column>
      <el-table-column label="盘点备注" min-width="220" prop="remark" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.remark || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="160" prop="createTime">
        <template #default="{ row }">
          {{ formatDisplayDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="当前暂无库存盘点历史数据" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { getInventoryHistoryList } from '/@/api/devlocal/inventoryCount'
import type { InventoryCountItem, InventoryCountPackageTaskItem, InventoryHistoryQuery } from '/@/type/inventory/count'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'InventoryHistory',
})

const createDefaultQueryForm = (): InventoryHistoryQuery => ({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
})

interface InventoryHistoryTableRow extends InventoryCountItem {
  rowKey: string
  parentId: number | string
}

const pickArray = <T = any,>(response: any): T[] => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.rows)) return response.rows
  if (Array.isArray(response?.list)) return response.list
  if (Array.isArray(response?.data?.rows)) return response.data.rows
  if (Array.isArray(response?.data?.list)) return response.data.list
  return []
}

const pickTotal = (response: any) => {
  if (typeof response?.total === 'number') return response.total
  if (typeof response?.data?.total === 'number') return response.data.total
  if (typeof response?.count === 'number') return response.count
  if (typeof response?.data?.count === 'number') return response.data.count
  return 0
}

const queryForm = reactive<InventoryHistoryQuery>(createDefaultQueryForm())
const dateRange = ref<[string, string] | []>([])
const list = ref<InventoryCountItem[]>([])
const total = ref(0)
const listLoading = ref(false)

const mergeColumnProps = new Set([
  'skuImg',
  'sku',
  'productName',
  'encasementCount',
  'totalAfterCount',
  'lackCount',
  'totalSendCount',
  'totalReceiveCount',
  'noEncasementCount',
  'remark',
  'createTime',
])

const getPackageTaskList = (row: InventoryCountItem): InventoryCountPackageTaskItem[] =>
  Array.isArray(row.packageTaskList) ? row.packageTaskList : []

const buildTableRows = (item: InventoryCountItem): InventoryHistoryTableRow[] => {
  const packageTaskList = getPackageTaskList(item)

  if (!packageTaskList.length) {
    return [
      {
        ...item,
        rowKey: `${item.id}-main`,
        parentId: item.id,
      },
    ]
  }

  return packageTaskList.map((packageTask, index) => ({
    ...item,
    po: packageTask.po,
    orderDate: packageTask.orderDate,
    actualCount: packageTask.actualCount,
    taskCount: packageTask.taskCount,
    afterCount: packageTask.afterCount,
    rowKey: `${item.id}-${packageTask.id ?? index}`,
    parentId: item.id,
  }))
}

const tableData = computed<InventoryHistoryTableRow[]>(() => list.value.flatMap((item) => buildTableRows(item)))

const rowSpanMap = computed(() => {
  const spanMap = new Map<number, number>()
  let startIndex = 0

  list.value.forEach((item) => {
    const span = Math.max(getPackageTaskList(item).length, 1)
    for (let index = 0; index < span; index += 1) {
      spanMap.set(startIndex + index, index === 0 ? span : 0)
    }
    startIndex += span
  })

  return spanMap
})

const formatNumber = (value?: number | string) => {
  if (value === null || value === undefined || value === '') return '-'
  const normalizedValue = Number(value)
  if (Number.isNaN(normalizedValue)) return String(value)
  return Number.isInteger(normalizedValue) ? `${normalizedValue}` : normalizedValue.toFixed(2)
}

const formatDisplayDateTime = (value?: string) => {
  if (!value) return '-'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
  return formatDate(parsedDate, 'yyyy-MM-dd hh:mm:ss')
}

const getTotalAfterCount = (row: InventoryCountItem) => {
  const packageTaskList = getPackageTaskList(row)
  if (!packageTaskList.length) return row.afterCount
  return packageTaskList.reduce((sum, item) => sum + Number(item.afterCount || 0), 0)
}

const tableSpanMethod = ({
  rowIndex,
  column,
}: {
  row: InventoryHistoryTableRow
  rowIndex: number
  column: { property?: string }
  columnIndex: number
}) => {
  if (!column.property || !mergeColumnProps.has(column.property)) return { rowspan: 1, colspan: 1 }

  const rowspan = rowSpanMap.value.get(rowIndex) ?? 1
  if (rowspan === 0) return { rowspan: 0, colspan: 0 }
  return { rowspan, colspan: 1 }
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const response = await getInventoryHistoryList({ ...queryForm })
    list.value = pickArray<InventoryCountItem>(response)
    total.value = pickTotal(response)
  } catch {
    list.value = []
    total.value = 0
  } finally {
    listLoading.value = false
  }
}

const syncDateToQuery = () => {
  queryForm.startDate = dateRange.value[0] || ''
  queryForm.endDate = dateRange.value[1] || ''
}

const handleDateChange = () => {
  syncDateToQuery()
}

const handleQuery = () => {
  queryForm.pageNo = 1
  syncDateToQuery()
  fetchList()
}

const handleReset = () => {
  Object.assign(queryForm, createDefaultQueryForm())
  dateRange.value = []
  fetchList()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchList()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
.inventory-history-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .query-actions-row {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .sku-image-cell {
    width: 56px;
    height: 56px;
    border: 1px solid #dfe6ee;
    border-radius: 8px;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;

    .el-image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
