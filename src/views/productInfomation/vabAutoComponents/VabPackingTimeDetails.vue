<template>
  <div>
    <el-dialog v-model="visible" title="工时明细" top="5vh" width="1200px">
      <div class="dialog-content">
        <!-- 上半部分：折线图 -->
        <div class="chart-section">
          <div class="chart-header">
            <span>工时趋势图</span>

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
            max-height="800"
            stripe
          >
            <el-table-column label="PO" min-width="100" prop="po" />
            <el-table-column label="打包日期" min-width="100" prop="startTime" />
            <el-table-column label="打包工时(分钟)" min-width="110" prop="workingHours" />
            <el-table-column label="完成数量" min-width="100" prop="goodCount" />
            <el-table-column label="每个用时(秒)" min-width="110" prop="eachTime" />
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

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getPackingTimeDetails, getPackingTimeDetailsChart } from '/@/api/devlocal/productInformation'
import { IGetPackingTimeDetailsItem, IGetPackingTimeDetailsReq } from '/@/type/productInformation/skuCustomsClearance'
import { formatDateToString } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabPackingTimeDetails',
})

const props = defineProps<{
  modelValue: boolean
  sku: string
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

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
const queryForm = reactive<IGetPackingTimeDetailsReq>({
  sku: props.sku,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const list = ref<IGetPackingTimeDetailsItem[]>([])
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const chartTimeRange = ref<[Date, Date]>([new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()])
const lineChartOption = ref<any>({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const param = params[0]
      return `${param.name}<br/>每个用时: ${param.value} 秒`
    },
  },
  grid: {
    top: 30,
    left: 65,
    right: 65,
    bottom: 30,
  },
  xAxis: {
    type: 'category',
    data: [],
    name: '打包日期',
  },
  yAxis: {
    type: 'value',
    name: '每个用时(秒)',
  },
  series: [
    {
      type: 'line',
      data: [],
    },
  ],
})
const fetchData = async () => {
  listLoading.value = true
  queryForm.sku = props.sku
  const { data } = await getPackingTimeDetails(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
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

const handleTimeRangeChange = async () => {
  // 根据选择的时间范围更新图表数据
  const { data } = await getPackingTimeDetailsChart({
    sku: props.sku,
    startTime: formatDateToString(chartTimeRange.value[0]),
    endTime: formatDateToString(chartTimeRange.value[1]),
  })
  lineChartOption.value.xAxis.data = data.dates
  lineChartOption.value.series[0].data = data.times
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
