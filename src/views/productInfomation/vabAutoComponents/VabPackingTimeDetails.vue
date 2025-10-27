<template>
  <div>
    <el-dialog v-model="visible" title="工时明细" top="5vh" width="1200px">
      <div class="dialog-content">
        <!-- 上半部分：折线图 -->
        <div class="chart-section">
          <div class="chart-header">
            <span>工时趋势图</span>
            <el-select v-model="chartTimeRange" placeholder="请选择时间范围" style="width: 120px" @change="handleTimeRangeChange">
              <el-option label="半年" value="halfYear" />
              <el-option label="1年" value="oneYear" />
              <el-option label="2年" value="twoYears" />
              <el-option label="全部" value="all" />
            </el-select>
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
          <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="800" stripe>
            <el-table-column label="PO" min-width="100" prop="po" />
            <el-table-column label="打包日期" min-width="100" prop="packingDate" />
            <el-table-column label="打包工时(分钟)" min-width="110" prop="packingPerson" />
            <el-table-column label="完成数量" min-width="100" prop="packingTime" />
            <el-table-column label="每个用时(秒)" min-width="110" prop="packingRemark" />
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
defineOptions({
  name: 'VabPackingTimeDetails',
})
const props = defineProps<{
  modelValue: boolean
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
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const list = ref<any[]>([])
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const chartTimeRange = ref<string>('halfYear')
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
    data: ['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05'],
    name: '打包日期',
  },
  yAxis: {
    type: 'value',
    name: '每个用时(秒)',
  },
  series: [
    {
      type: 'line',
      data: [10, 20, 30, 40, 50],
    },
  ],
})
const fetchData = async () => {
  listLoading.value = true
  // const { data } = await getPackingTimeDetails(queryForm)
  // list.value = data.list
  // total.value = data.total
  // listLoading.value = false
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

const handleTimeRangeChange = (value: string) => {
  // 根据选择的时间范围更新图表数据
  console.log('选择的时间范围:', value)
  // TODO: 根据时间范围调用不同的接口获取数据
  // 这里可以根据实际需求实现数据筛选逻辑
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
