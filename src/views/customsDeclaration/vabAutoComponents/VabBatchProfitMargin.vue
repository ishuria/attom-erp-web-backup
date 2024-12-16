<template>
  <vab-dialog
    title="批次利润率"
    width="80%"
    v-model="dflag"
    top="10vh"
    @close="closeBatchProfitMargin"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="6">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :editable="false"
          :clearable="false"
          value-format="YYYY-MM-DD"
          style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;"
          @change="queryData"
        >
        </el-date-picker>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form inline :model="queryForm" @submit.prevent >
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter.native="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
      :header-cell-style="{ textAlign: 'center' }"
      :data="pagedData"
    >
      <el-table-column label="出库日期" prop="shipmentDate" min-width="">
        <template #default="{ row }">
          {{ formatDate(new Date(row.shipmentDate)) }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="contractNumber" min-width=""></el-table-column>
      <el-table-column label="Shipment ID" prop="" min-width=""></el-table-column>
      <el-table-column label="总CIF售价$" prop="totalCif" min-width=""></el-table-column>
      <el-table-column label="运费$" prop="totalFreightFee" min-width=""></el-table-column>
      <el-table-column label="汇率" prop="rate" min-width=""></el-table-column>
      <el-table-column label="总人民币售价" prop="totalSalePrice" min-width=""></el-table-column>
      <el-table-column label="总成本￥" prop="totalCost" min-width=""></el-table-column>
      <el-table-column label="总利润￥" prop="totalProfit" min-width=""></el-table-column>
      <el-table-column label="利润率" prop="profitMargin" min-width=""></el-table-column>
      <el-table-column label="总退税额" prop="totalTaxRebate" min-width=""></el-table-column>
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
defineOptions({
  name: 'VabBatchProfitMargin'
})
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { getTaxRefundProfitMargin } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { formatDate } from '/@/utils/dateUtils'

const dflag = ref<boolean>(false)
const props = defineProps<{
  batchProfitMarginVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.batchProfitMarginVisible
  if (dflag.value) {
    fetchData()
  }
})
const list = ref<any>([])

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundProfitMargin({
    fromDate: dateRange.value[0],
    toDate: dateRange.value[1]
  })
  list.value = data
  total.value = list.value.length
  listLoading.value = false
}
// 根据关键词过滤数据
const applyKeywordFilter = () => {
  const keyword = queryForm.value.keyWord.trim().toLowerCase()
  if (keyword) {
    list.value = list.value.filter((item: any) => 
      item.contractNumber.toLowerCase().includes(keyword)
    )
  }
}
const emit = defineEmits<{
  updateBatchProfitMarginVisible: [value: boolean]
}>()
const closeBatchProfitMargin = () => {
  emit('updateBatchProfitMarginVisible', false)
}
const dateRange = ref<[string, string]>(getDefaultStringTime())
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
// 日期初始化
function getDefaultStringTime(): [string, string] {
  const today = new Date();
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), 2);
  // 今天的日期
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  // 格式化为字符串形式
  const formattedLastMonthDate = lastMonthDate.toISOString().split('T')[0];
  const formattedTodayDate = todayDate.toISOString().split('T')[0];
  return [formattedLastMonthDate, formattedTodayDate];
}
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryData = () => {
  queryForm.pageNo = 1
  applyKeywordFilter()
  fetchData()
}
// 计算当前页的数据
const pagedData = computed(() => {
  const start = (queryForm.pageNo - 1) * queryForm.pageSize
  const end = start + queryForm.pageSize
  return list.value.slice(start, end)  // 获取当前页的数据
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

const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}

</script>