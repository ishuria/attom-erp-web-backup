<template>
  <div>
    <el-dialog v-model="visible" title="SKU交期" top="5vh" width="70%">
      <div class="dialog-content">
        <!-- 上半部分：折线图 -->
        <div class="chart-section">
          <div class="chart-header">
            <span>交期趋势图</span>

            <el-date-picker
              v-model="chartTimeRange"
              end-placeholder="结束日期"
              range-separator="至"
              :shortcuts="shortcuts"
              start-placeholder="开始日期"
              style="max-width: 300px"
              type="daterange"
              unlink-panels
              @change="handleTimeRangeChange"
            />
          </div>
          <div ref="chartContainer" class="chart-container">
            <vab-chart :option="lineChartOption" />
            <div></div>
          </div>
        </div>

        <!-- 下半部分：搜索框、表格和分页 -->
        <div class="table-section">
          <vab-query-form>
            <vab-query-form-right-panel :span="24">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input
                    v-model="queryForm.keyWord"
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
            v-loading="listLoading"
            border
            :cell-style="{ textAlign: 'center' }"
            :data="list"
            :header-cell-style="{ textAlign: 'center' }"
            max-height="700"
            :span-method="objectSpanMethod"
            stripe
          >
            <el-table-column label="PO" min-width="75" prop="po" />
            <el-table-column label="PO发布日期" min-width="75" prop="poReleaseDate" />
            <el-table-column label="SKU" min-width="100" prop="sku" />
            <el-table-column label="SKU签收日期" min-width="90" prop="skuSignDate" />
            <el-table-column label="SKU交期" min-width="45" prop="deliveryTime" />
            <el-table-column label="零件名" min-width="120" prop="componentName" />
            <el-table-column label="供应商" min-width="120" prop="suppliser" />
            <el-table-column label="零件交期" min-width="45" prop="componentDeliveryTime" />
            <el-table-column label="签收日期" min-width="100" prop="componentSignDate" />
            <el-table-column label="生产完成日期" min-width="90" prop="productionCompletionDate" />
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 700px" />
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { formatDateToString } from '~/src/utils/dateUtils'
import { getSkuDeliveryTimeChart, querySkuDeliveryTime } from '/@/api/devlocal/productInformation.ts'
import { IGetPackingTimeDetailsReq, ISkuComponentDeliveryTimeDetail } from '/@/type/productInformation/skuCustomsClearance.ts'

defineOptions({
  name: 'VabSkuDeliveryTimeDetails',
})

const props = defineProps<{
  modelValue: boolean
  sku: string
}>()

const queryForm = reactive<IGetPackingTimeDetailsReq>({
  sku: props.sku,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const chartTimeRange = ref<[Date, Date]>([new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()])
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const shortcuts = [
  {
    text: '半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      // 最近6个月
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      // 最近12个月
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '2年',
    value: () => {
      const end = new Date()
      const start = new Date()
      // 最近24个月
      start.setFullYear(start.getFullYear() - 2)
      return [start, end]
    },
  },
]
const lineChartOption = ref<any>({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const param = params[0]
      return `${param.name}<br/>SKU交期: ${param.value} 天`
    },
  },
  grid: {
    top: 30,
    left: 65,
    right: 100,
    bottom: 30,
  },
  xAxis: {
    type: 'category',
    data: [],
    name: 'SKU签收日期',
  },
  yAxis: {
    type: 'value',
    name: 'SKU交期',
  },
  series: [
    {
      type: 'line',
      data: [],
    },
  ],
})
const handleTimeRangeChange = async () => {
  // 根据选择的时间范围更新图表数据
  const { data } = await getSkuDeliveryTimeChart({
    sku: props.sku,
    startTime: formatDateToString(chartTimeRange.value[0]),
    endTime: formatDateToString(chartTimeRange.value[1]),
  })
  lineChartOption.value.xAxis.data = data.x
  lineChartOption.value.series[0].data = data.y
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const list = ref<ISkuComponentDeliveryTimeDetail[]>([])
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  const label = column.label
  // 设置需要合并的列
  if (['PO', 'PO发布日期', 'SKU', 'SKU签收日期', 'SKU交期'].includes(label)) {
    // 获取当前row的id
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length!; i++) {
      // 如果id一样需要合并
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

watch(
  () => props.modelValue,
  (newVal: boolean) => {
    if (newVal) {
      queryData()
      handleTimeRangeChange()
    }
  },
  { immediate: true }
)
const fetchData = async () => {
  listLoading.value = true
  queryForm.sku = props.sku
  const { data } = await querySkuDeliveryTime(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 20px 20px;
}

.chart-section {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  height: 280px;
}

.table-section {
  display: flex;
  flex-direction: column;
}
</style>
