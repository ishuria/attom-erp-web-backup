<template>
  <vab-dialog v-model="dflag" title="批次利润率" top="10vh" width="80%" @close="closeBatchProfitMargin">
    <vab-query-form>
      <vab-query-form-left-panel :span="6">
        <el-date-picker
          :key="datePickerKey"
          v-model="dateRange"
          :clearable="false"
          :editable="false"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0"
          type="daterange"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
      :data="pagedData"
      :header-cell-style="{ textAlign: 'center' }"
      show-summary
      @sort-change="handleSortChange"
    >
      <el-table-column label="出库日期" min-width="" prop="shipmentDate" sortable>
        <template #default="{ row }">
          {{ formatDate(new Date(row.shipmentDate)) }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" min-width="" prop="contractNumber" />
      <el-table-column label="Shipment ID" min-width="" prop="shipmentId" />
      <el-table-column label="总CIF售价$" min-width="" prop="totalCif" sortable />
      <el-table-column label="运费$" min-width="" prop="totalFreightFee" sortable />
      <el-table-column label="汇率" min-width="" prop="rate" />
      <el-table-column label="总人民币售价" min-width="" prop="totalSalePrice" sortable />
      <el-table-column label="总成本￥" min-width="" prop="totalCost" sortable />
      <el-table-column label="总利润￥" min-width="" prop="totalProfit" sortable />
      <el-table-column label="利润率" min-width="" prop="profitMargin" sortable />
      <el-table-column label="总退税额" min-width="" prop="totalTaxRebate" sortable />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { getTaxRefundProfitMargin } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabBatchProfitMargin',
})

const dflag = ref<boolean>(false)
const props = defineProps<{
  batchProfitMarginVisible: boolean
}>()
const list = ref<any>([])
const originalList = ref<any>([]) // 保存原始数据
const dateRange = ref<[string, string]>(getDefaultStringTime())
const datePickerKey = ref<number>(0) // 用于强制重新渲染日期选择器

watchEffect(() => {
  dflag.value = props.batchProfitMarginVisible
  if (dflag.value) {
    fetchData()
  }
})

// 处理日期变化
const handleDateChange = () => {
  queryData()

  // 强制重新渲染日期选择器，解决选择后无法再次打开的问题
  nextTick(() => {
    datePickerKey.value++
  })
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundProfitMargin({
    fromDate: dateRange.value[0],
    toDate: dateRange.value[1],
  })
  originalList.value = data // 保存原始数据
  list.value = data
  total.value = list.value.length
  listLoading.value = false
}

// 应用排序到当前列表
const applySort = () => {
  if (!sortState.value.prop || !sortState.value.order) {
    return
  }
  const { prop, order } = sortState.value
  list.value.sort((a: any, b: any) => {
    let aVal = a[prop]
    let bVal = b[prop]

    // 处理日期类型
    if (prop === 'shipmentDate') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    // 处理 null/undefined
    if (aVal == null) aVal = 0
    if (bVal == null) bVal = 0

    if (order === 'ascending') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
}

// 根据关键词过滤数据
const applyKeywordFilter = () => {
  const keyword = queryForm.keyWord.trim().toLowerCase()

  if (keyword) {
    const filteredData = originalList.value.filter((item: any) => {
      const contractMatch = item.contractNumber?.toLowerCase().includes(keyword) || false
      const shipmentMatch = item.shipmentId?.toLowerCase().includes(keyword) || false
      return contractMatch || shipmentMatch
    })
    list.value = filteredData
  } else {
    list.value = [...originalList.value] // 如果没有关键词，显示所有数据
  }
  total.value = list.value.length
  // 如果存在排序状态，重新应用排序
  applySort()
}
const emit = defineEmits<{
  updateBatchProfitMarginVisible: [value: boolean]
}>()
const closeBatchProfitMargin = () => {
  emit('updateBatchProfitMarginVisible', false)
}
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
// 日期初始化
function getDefaultStringTime(): [string, string] {
  const today = new Date()
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), 2)
  // 今天的日期
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  // 格式化为字符串形式
  const formattedLastMonthDate = lastMonthDate.toISOString().split('T')[0]
  const formattedTodayDate = todayDate.toISOString().split('T')[0]
  return [formattedLastMonthDate, formattedTodayDate]
}
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryData = () => {
  queryForm.pageNo = 1
  // 如果有原始数据，直接进行筛选
  if (originalList.value.length > 0) {
    applyKeywordFilter()
  } else {
    // 如果没有原始数据，重新获取数据
    fetchData()
  }
}
// 排序状态
const sortState = ref<{
  prop: string | null
  order: 'ascending' | 'descending' | null
}>({
  prop: null,
  order: null,
})

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
  sortState.value = { prop, order }
  if (order) {
    // 对整个 list 进行排序
    applySort()
  } else {
    // 取消排序，恢复原始顺序
    sortState.value = { prop: null, order: null }
    if (originalList.value.length > 0) {
      applyKeywordFilter()
    }
  }
  // 排序后重置到第一页
  queryForm.pageNo = 1
}

// 计算当前页的数据
const pagedData = computed(() => {
  const start = (queryForm.pageNo - 1) * queryForm.pageSize
  const end = start + queryForm.pageSize
  return list.value.slice(start, end) // 获取当前页的数据
})

// 页码改变时的处理
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
}

// 每页条数改变时的处理
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
</script>

<style lang="scss" scoped>
// 汇总行居中对齐
:deep(.el-table__footer-wrapper) {
  .el-table__footer {
    td {
      text-align: center !important;
    }
  }
}
</style>
