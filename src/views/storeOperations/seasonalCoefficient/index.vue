<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select v-model="queryForm.siteId" placeholder="请选择站点" @change="handleChangeSite">
              <el-option 
                v-for="item in siteList"
                :label="item.label"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">参考值计算</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table class="noneHoverTable" :data="list"  border stripe :header-cell-style="{ textAlign: 'center' }" :cellStyle="cellStyle" >
      <el-table-column label="品名" >
        <el-table-column label="品名" prop="kindName" min-width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="1月">
        <el-table-column label="实际值" prop="janActual"></el-table-column>
        <el-table-column label="参考值" prop="janReference"></el-table-column>
      </el-table-column>
      <el-table-column label="2月">
        <el-table-column label="实际值" prop="febActual"></el-table-column>
        <el-table-column label="参考值" prop="febReference"></el-table-column>
      </el-table-column>
      <el-table-column label="3月">
        <el-table-column label="实际值" prop="marActual"></el-table-column>
        <el-table-column label="参考值" prop="marReference"></el-table-column>
      </el-table-column>
      <el-table-column label="4月">
        <el-table-column label="实际值" prop="aprActual"></el-table-column>
        <el-table-column label="参考值" prop="aprReference"></el-table-column>
      </el-table-column>
      <el-table-column label="5月">
        <el-table-column label="实际值" prop="mayActual"></el-table-column>
        <el-table-column label="参考值" prop="mayReference"></el-table-column>
      </el-table-column>
      <el-table-column label="6月">
        <el-table-column label="实际值" prop="junActual"></el-table-column>
        <el-table-column label="参考值" prop="junReference"></el-table-column>
      </el-table-column>
      <el-table-column label="7月">
        <el-table-column label="实际值" prop="julActual"></el-table-column>
        <el-table-column label="参考值" prop="julReference"></el-table-column>
      </el-table-column>
      <el-table-column label="8月">
        <el-table-column label="实际值" prop="augActual"></el-table-column>
        <el-table-column label="参考值" prop="augReference"></el-table-column>
      </el-table-column>
      <el-table-column label="9月">
        <el-table-column label="实际值" prop="sepActual"></el-table-column>
        <el-table-column label="参考值" prop="sepReference"></el-table-column>
      </el-table-column>
      <el-table-column label="10月">
        <el-table-column label="实际值" prop="octActual"></el-table-column>
        <el-table-column label="参考值" prop="octReference"></el-table-column>
      </el-table-column>
      <el-table-column label="11月">
        <el-table-column label="实际值" prop="novActual"></el-table-column>
        <el-table-column label="参考值" prop="novReference"></el-table-column>
      </el-table-column>
      <el-table-column label="12月">
        <el-table-column label="实际值" prop="decActual"></el-table-column>
        <el-table-column label="参考值" prop="decReference"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="viewChart(row)">查看</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog
      title="查看"
      v-model="viewVisible"
      @open="handleDialogOpened"
      width="40%"
    >
      <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'seasonalCoefficient'
})
import * as echarts from 'echarts'
import { CSSProperties } from 'vue'
import { months } from '../constantOption'
import { getSeasonalCoefficientList, getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { IGetSeasonalCoefficientList, IGetSeasonalCoefficientListReq, ISiteList } from '/@/type/storeOperation/seasonalCoefficientType'

const total = ref<number>(0)
const queryForm = reactive<IGetSeasonalCoefficientListReq>({
  siteId: 1,
  pageNo: 1,
  pageSize: 20
})
const viewVisible = ref<boolean>(false)
const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const option = ref<any>({})
const siteList = ref<ISiteList[]>([])
const list = ref<IGetSeasonalCoefficientList[]>([])
const fakeData = ref<any[]>([
  {
    category: 'Category1',
    Jan: { value1: '1.12', value2: '1.38' },
    Feb: { value1: '1.15', value2: '1.40' },
    Mar: { value1: '1.20', value2: '1.33' },
    Apr: { value1: '1.20', value2: '1.33' },
    May: { value1: '1.20', value2: '1.33' },
    Jun: { value1: '1.20', value2: '1.33' },
    Jul: { value1: '1.20', value2: '1.33' },
    Aug: { value1: '1.20', value2: '1.33' },
    Sep: { value1: '1.20', value2: '1.33' },
    Oct: { value1: '1.20', value2: '1.33' },
    Nov: { value1: '1.20', value2: '1.33' },
    Dec: { value1: '1.20', value2: '1.33' },
  },
  {
    category: 'Category2',
    Jan: { value1: '1.12', value2: '1.38' },
    Feb: { value1: '1.15', value2: '1.40' },
    Mar: { value1: '1.20', value2: '1.33' },
    Apr: { value1: '1.20', value2: '1.33' },
    May: { value1: '1.20', value2: '1.33' },
    Jun: { value1: '1.20', value2: '1.33' },
    Jul: { value1: '1.20', value2: '1.33' },
    Aug: { value1: '1.20', value2: '1.33' },
    Sep: { value1: '1.20', value2: '1.33' },
    Oct: { value1: '1.20', value2: '1.33' },
    Nov: { value1: '1.20', value2: '1.33' },
    Dec: { value1: '1.20', value2: '1.33' },
  },
  {
    category: 'Category3',
    Jan: { value1: '1.12', value2: '1.38' },
    Feb: { value1: '1.15', value2: '1.40' },
    Mar: { value1: '1.20', value2: '1.33' },
    Apr: { value1: '1.20', value2: '1.33' },
    May: { value1: '1.20', value2: '1.33' },
    Jun: { value1: '1.20', value2: '1.33' },
    Jul: { value1: '1.20', value2: '1.33' },
    Aug: { value1: '1.20', value2: '1.33' },
    Sep: { value1: '1.20', value2: '1.33' },
    Oct: { value1: '1.20', value2: '1.33' },
    Nov: { value1: '1.20', value2: '1.33' },
    Dec: { value1: '1.20', value2: '1.33' },
  },
])
// 提取所有 value1 和 value2 的数组
let value1Array: string[] = []
let value2Array: string[] = []
let actualData: (number | undefined)[] = []
let referenceData: (number | undefined)[] = []
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleChangeSite = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleDialogOpened = () => {
  nextTick(() => {
    if (chartContainer.value) {
      chartInstance = echarts.init(chartContainer.value)
      chartObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize()
        }
      })
      chartObserver.observe(chartContainer.value)
      initChart()
      option.value.series[0].data = actualData
  option.value.series[1].data = referenceData
  updateChart()
    }
  })
}
const viewChart = (row: IGetSeasonalCoefficientList) => {
  viewVisible.value = true
  actualData = [row.janActual, row.febActual, row.marActual, row.aprActual, row.mayActual, row.junActual, row.julActual, row.augActual, row.sepActual, row.octActual, row.novActual, row.decActual]
  referenceData = [row.janReference, row.febReference, row.marReference, row.aprReference, row.mayReference, row.junReference, row.julReference, row.augReference, row.sepReference, row.octReference, row.novReference, row.decReference]
  
}
const updateChart = () => {
  chartInstance?.setOption(option.value, true)
}
const initChart = () => {
  option.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      // min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: value1Array,
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: value2Array,
        itemStyle: {
          color: '#ff8fa5'
        },
        smooth: true,
      },
    ]
  }
  // console.log(value1Array);
  
  chartInstance?.setOption(option.value)
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0) {
    return {
      textAlign: 'left'
    }
  } else if (index % 2 === 0) {
    return {
      textAlign: 'center',
      color: '#999'
    }
  } return {
    textAlign: 'center'
  }
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
const fetchData = async () => {
  const { data } = await getSeasonalCoefficientList(queryForm)
  list.value = data.list
  total.value = data.total
}
onBeforeMount(() => {
  fetchSiteList()
  fetchData()
  value1Array = []
  value2Array = []
  
  // 遍历 fakeData
  fakeData.value.forEach((row, index) => {
    if (index === 0) {
      Object.keys(row).forEach((key) => {
        if (key !== 'category') { // 跳过 category 字段
          value1Array.push(row[key].value1)
          value2Array.push(row[key].value2)
        }
      })
    }
    
  })
})
onMounted(() => {
  // if (chartContainer.value) {
  //   chartInstance = echarts.init(chartContainer.value)
  //   // chartObserver = new ResizeObserver(() => {
  //   //   if (chartInstance) {
  //   //     chartInstance.resize()
  //   //   }
  //   // })
  //   // chartObserver.observe(chartContainer.value)
  //   initChart()
  // }
})
</script>

<style lang="scss" scoped>
.cell-with-line {
  display: flex;
  align-items: center;
  justify-content: center;

  .value {
    display: flex;
    align-items: center; 
    justify-content: center; 
    width: 50%; /* 每个值占一半的空间 */
  }
  .value2 {
    color: #999;
  }
  .separator {
    width: 1px;
    height: 40px;
    background-color: #dcdfe6;
  }
}

.noneHoverTable {
  :deep() {
    // .el-table__body .cell {
    //   max-height: 40px;
    // }
    /* 隐藏第二行表头 */
    .el-table__header-wrapper .el-table__header tr:nth-child(2) {
      display: none;
    }
  }
}
</style>