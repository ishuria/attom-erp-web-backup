<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select></el-select>
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
    <el-table :data="fakeData" border stripe class="noneHoverTable" :header-cell-style="{ textAlign: 'center' }" :cell-class-name="clearPadding">
      <el-table-column label="品类" prop="category" min-width="">
        <!-- <template #default="{ row }">
          <span style="white-space: pre-wrap; ">{{ row.category }}</span>
        </template> -->
      </el-table-column>
       <!-- 动态生成月份列 -->
      <el-table-column
        v-for="month in months"
        :key="month.prop"
        :label="month.label"
      >
        <template #default="{ row }">
          <div class="cell-with-line">
            <span class="value">{{ row[month.prop].value1 }}</span>
            <div class="separator"></div>
            <span class="value value2">{{ row[month.prop].value2 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="viewChart">查看</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
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
import { months } from '../constantOption'

const viewVisible = ref<boolean>(false)
const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const option = ref<any>({})

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


const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex !== 0 && data.columnIndex !== 13) {
    return 'clear-padding'
  }
  return ''
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
    }
  })
}
const viewChart = () => {
  viewVisible.value = true
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
      min: 'dataMin', // 自动以数据中的最小值为起点
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
  console.log(value1Array);
  
  chartInstance?.setOption(option.value)
}
onBeforeMount(() => {
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
    .el-table__body .cell {
      max-height: 40px;
    }
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
</style>