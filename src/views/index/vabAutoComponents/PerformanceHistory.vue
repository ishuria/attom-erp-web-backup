<template>
  <vab-card class="top-card" shadow="always" :body-style="{ height: '422px' }">
    <template #header>
      绩效历史
      <div class="right-icon">
        <el-select placeholder="人员" style="max-width: 5em; "/>
        <el-date-picker type="monthrange" v-model="selectDate" />
      </div>
    </template>
    <div ref="chartContainer" style="width: 100%; height: 400px"></div>
  </vab-card>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'

defineOptions({
  name: 'PerformanceHistory',
})

const selectDate = ref<[string, string]>(['', ''])

const chartContainer = ref<HTMLElement | null>(null)

let chartInstance: echarts.ECharts | null = null

let chartObserver: ResizeObserver

const option = ref<any>({})
// 初始化图表
const initChart = () => {
  // 初始化图表的配置项
  option.value = {
   
    legend: {
      bottom: '2%'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params[0].name}</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          const name = item.seriesName
          return `<div style="display: flex;align-items:center;">
            ${item.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${name}</div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}${name === '退货率' || name === '退款率' ? '%' : '' }</span>
          </div>`
        })
        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr.join('')}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      }
    },
    grid: {
      left: '0',
      bottom: '10%',
      right: '0',
      top: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: date.value,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
       
        color: '#999'
      },
    },
    yAxis: [
  
      {
        type: 'value',
        name: '',
        position: 'left',
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0.1]  
      },
    ],
    series: [
    {
    name: '精品',
    type: 'bar',
    yAxisIndex: 0,
    data: jingpinData,
    barWidth: 20,
    stack: 'one',
    itemStyle: {
      color: '#3A8DFF', // 主蓝色
    },
    opacity: 0.9,
  },
  {
    name: '精铺',
    type: 'bar',
    yAxisIndex: 0,
    data: jingpuData,
    barWidth: 20,
    stack: 'one',
    itemStyle: {
      color: '#5FB3FF', // 浅蓝
    },
    opacity: 0.9,
  },
  {
    name: '精铺Vine',
    type: 'bar',
    yAxisIndex: 0,
    data: jingpuVineData,
    barWidth: 20,
    stack: 'one',
    itemStyle: {
      color: '#8BCFFF', // 更浅的蓝（接近天蓝）
    },
    opacity: 0.9,
  },
  {
    name: '铺货',
    type: 'bar',
    yAxisIndex: 0,
    data: puhuoData,
    barWidth: 20,
    stack: 'one',
    itemStyle: {
      color: '#67c23a', // 蓝灰色调
    },
    opacity: 0.9,
  },
  {
    name: '提成',
    type: 'line',
    yAxisIndex: 1,
    data: fakeData.value.map((item: any) => item.commission),
    itemStyle: {
      color: '#0066CC', // 深蓝线
    },
    lineStyle: {
      width: 2,
    },
    smooth: true,
    symbol: 'none',
    symbolSize: 6,
  },
  {
    name: '新品提成',
    type: 'line',
    yAxisIndex: 1,
    data: fakeData.value.map((item: any) => item.newCommission),
    itemStyle: {
      color: '#3399FF', // 中等蓝
    },
    lineStyle: {
      width: 2,
    },
    smooth: true,
    symbol: 'none',
    symbolSize: 6,
  },
  {
    name: '新款采购额',
    type: 'line',
    yAxisIndex: 1,
    data: fakeData.value.map((item: any) => item.newPurchaseAmt),
    itemStyle: {
      color: '#313ca9', // 亮蓝线
    },
    lineStyle: {
      width: 2,
    },
    smooth: true,
    symbol: 'none',
    symbolSize: 6,
  },
    ],
  };

  // 设置图表实例的配置项
  chartInstance?.setOption(option.value);
}
const date = ref([
  '2024-1', '2024-2', '2024-3', '2024-4', '2024-5', '2024-6', '2024-7', '2024-8', '2024-9', '2024-10', '2024-11', '2024-12'
])
const jingpinData = [120, 132, 101, 134, 90, 230, 210, 180, 150, 160, 170, 200];
const jingpuData = [220, 182, 191, 234, 290, 330, 310, 260, 240, 250, 255, 270];
const jingpuVineData = [150, 232, 201, 154, 190, 330, 410, 390, 360, 340, 310, 300];
const puhuoData = [320, 332, 301, 334, 390, 330, 320, 310, 300, 290, 280, 270];
const fakeData = ref([
  { returnQuantity: 120, commission: 15.2, newCommission: 10.5, newPurchaseAmt: 20.0 },
  { returnQuantity: 132, commission: 18.5, newCommission: 12.0, newPurchaseAmt: 22.4 },
  { returnQuantity: 101, commission: 13.1, newCommission: 9.8, newPurchaseAmt: 19.0 },
  { returnQuantity: 134, commission: 17.0, newCommission: 11.5, newPurchaseAmt: 23.7 },
  { returnQuantity: 90,  commission: 14.8, newCommission: 10.1, newPurchaseAmt: 18.9 },
  { returnQuantity: 230, commission: 19.0, newCommission: 13.0, newPurchaseAmt: 25.0 },
  { returnQuantity: 210, commission: 22.3, newCommission: 14.5, newPurchaseAmt: 27.2 },
  { returnQuantity: 180, commission: 16.4, newCommission: 12.8, newPurchaseAmt: 24.5 },
  { returnQuantity: 156, commission: 14.2, newCommission: 10.7, newPurchaseAmt: 21.0 },
  { returnQuantity: 178, commission: 20.1, newCommission: 13.5, newPurchaseAmt: 26.9 },
  { returnQuantity: 165, commission: 17.5, newCommission: 11.2, newPurchaseAmt: 23.4 },
  { returnQuantity: 200, commission: 23.2, newCommission: 15.0, newPurchaseAmt: 28.6 },
])

onMounted(() => {
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
</script>

<style lang="scss" scoped>
:deep() {
  .echarts {
    height: 140px !important;
  }
}

.right-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  width: 330px;
  height: 60px;
  line-height: 60px;
  text-align: right;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  gap: 10px; 
}
.bottom {
  padding-top: 20px;
  margin-top: 5px;
  text-align: left;
  border-top: 1px solid var(--el-border-color);
}

.line-two {
  span {
    color: var(--el-color-success);
  }
}
</style>