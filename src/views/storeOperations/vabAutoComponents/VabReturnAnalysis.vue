<template>
  <div class="return-container">
    <el-row :gutter="10">
      <el-col :span="18">
        <vab-card style="height: 350px; position: relative;">
          <div ref="chartContainer1" style="width: 100%; height: 350px"></div>
          <div style="position: absolute; top: 5px; right: 10px;">
            <el-select placeholder="退货原因"style="max-width: 5em; margin-right: 10px; margin-top: 8px" size="small"></el-select>
            <el-radio-group v-model="radio" @change="handleSwitchTime" size="small">
              <el-radio-button label="日" value="day"></el-radio-button>
              <el-radio-button label="周" value="week"></el-radio-button>
              <el-radio-button label="月" value="month"></el-radio-button>
            </el-radio-group>
          </div>
        </vab-card>
        
      </el-col>
      <el-col :span="6">
        <vab-card style="height: 350px">
          <div ref="chartContainer2" style="width: 100%; height: 350px"></div>
        </vab-card>
      </el-col>
    </el-row>
    <vab-query-form style="margin-bottom: 10px;">
      <vab-query-form-left-panel>
        <span style="line-height: normal; font-size: 18px;">退货订单反馈</span>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-select style="max-width: 6em; " placeholder="退货原因"></el-select>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border stripe :data="mockData" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="订单号" prop="orderNumber" min-width="">
        <template #default="{ row }">
          <el-link type="primary">{{ row.orderNumber }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="退货原因" prop="returnReason" min-width=""></el-table-column>
      <el-table-column label="买家备注" prop="buyerRemarks" min-width="">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.buyerRemarks }}</div>
            </template>
            <el-text truncated>{{ row.buyerRemarks }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="买家之声反馈" prop="feedback" min-width=""></el-table-column>
      <el-table-column label="退货时间" prop="returnTime" sortable min-width=""></el-table-column>
      <el-table-column label="订购时间" prop="orderTime" sortable min-width=""></el-table-column>
      <el-table-column label="订单标签" prop="orderTags" min-width=""></el-table-column>
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
import * as echarts from 'echarts'
import { colorList } from '../constantOption'
import { getWeekOfYear } from '~/src/utils/dateUtils'

defineOptions({
  name: 'VabReturnAnalysis'
})
const radio = ref<string>('day')
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({

})
const mockData = [
  {
    orderNumber: "ORD123456",
    returnReason: "商品损坏",
    buyerRemarks: "请尽快处理，谢谢",
    feedback: "商品包装需改进",
    returnTime: "2024-12-25",
    orderTime: "2024-12-20 14:00",
    orderTags: "-",
  },
  {
    orderNumber: "ORD789101",
    returnReason: "发错商品",
    buyerRemarks: "发错了型号",
    feedback: "物流速度较慢",
    returnTime: "2024-12-24",
    orderTime: "2024-12-18 09:20",
    orderTags: "-",
  },
  {
    orderNumber: "ORD112131",
    returnReason: "商品不符描述",
    buyerRemarks: "颜色与图片不符",
    feedback: "描述需更精确",
    returnTime: "2024-12-23",
    orderTime: "2024-12-19 12:15",
    orderTags: "-",
  },
  {
    orderNumber: "ORD415161",
    returnReason: "尺寸不合适",
    buyerRemarks: "尺码表不准确尺码表不准确尺码表不准确尺码表不准确尺码表不准确尺码表不准确",
    feedback: "提供更详细的尺码信息",
    returnTime: "2024-12-22",
    orderTime: "2024-12-17 08:30",
    orderTags: "-",
  },
]
type IData = {
  date: string
  returnQuantity: number
  returnMargin: number
}
type IYProp = 'returnQuantity' | 'returnMargin'
const data1 = ref<IData[]>([
  { date: '2024-11-08', returnQuantity: 1, returnMargin: 50 },
  { date: '2024-11-09', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-10', returnQuantity: 1, returnMargin: 30 },
  { date: '2024-11-11', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-12', returnQuantity: 1, returnMargin: 10 },
  { date: '2024-11-13', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-14', returnQuantity: 1, returnMargin: 10 },
  { date: '2024-11-15', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-16', returnQuantity: 1, returnMargin: 10 },
  { date: '2024-11-17', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-18', returnQuantity: 1, returnMargin: 30 },
  { date: '2024-11-19', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-20', returnQuantity: 1, returnMargin: 30 },
  { date: '2024-11-21', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-22', returnQuantity: 1, returnMargin: 40 },
  { date: '2024-11-23', returnQuantity: 2, returnMargin: 30 },
  { date: '2024-11-24', returnQuantity: 0, returnMargin: 0 },
  { date: '2024-11-25', returnQuantity: 1, returnMargin: 40 },
  { date: '2024-11-26', returnQuantity: 0, returnMargin: 0 },
])
const nameMapProp: Record<string, string> = {
  '退货数': 'returnQuantity',
  '退货率': 'returnMargin',
}
const data2 = ref<any[]>([
  { value: 1, name: '没有原因' },
  { value: 1, name: '不兼容' },
  { value: 2, name: '不想要的商品' },
  { value: 1, name: '订购错误的商品' },
])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)

// 初始化图表
const initChart1 = () => {
  // 初始化图表的配置项
  option1.value = {
    title: {
      text: '退货趋势',
      left: 'left'
    },
    legend: {
      top: '5%'
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
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}${name === '退货率' ? '%' : '' }</span>
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
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data1.value.map((item: any) => item.date),
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
    ],
    series: [
      {
        name: '退货数',
        type: 'bar',
        yAxisIndex: 0,
        data: data1.value.map((item: any) => item.returnQuantity),
        barWidth: 20,
        itemStyle: {
          color: '#52bfff',
        },
        opacity: 0.9,
      },
      {
        name: '退货率',
        type: 'line',
        yAxisIndex: 1,
        data: data1.value.map((item: any) => item.returnMargin),
        barWidth: 20,
        itemStyle: {
          color: '#ff8fa5',
        },
        opacity: 0.9,
        smooth: true,
        symbol: 'none',
        symbolSize: 6,
      },
      
    ],
  };

  // 设置图表实例的配置项
  chartInstance1?.setOption(option1.value);
}
const updateChart1 = () => {
  chartInstance1?.setOption(option1.value, true)
}
// 切换 日，周，月
const handleSwitchTime = () => {

  let returnQuantity: any[] = []
  let returnMargin: any[] = []
  if (radio.value === 'day') {
  returnQuantity = data1.value
  returnMargin = data1.value
  } else if (radio.value === 'week') {
  returnQuantity = getWeeklyData(data1.value, 'returnQuantity')
  returnMargin = getWeeklyData(data1.value, 'returnMargin')
  } else if (radio.value === 'month') {
  returnQuantity = getMonthlyData(data1.value, 'returnQuantity')
  returnMargin = getMonthlyData(data1.value, 'returnMargin')
  }
  option1.value.xAxis.data = returnQuantity.map((item: any) => item.date)
  option1.value.series[0].data = returnQuantity.map((d: any) => d.returnQuantity)
  option1.value.series[1].data = returnMargin.map((d: any) => d.returnMargin)

  updateChart1()
}

// 按周分组并累加
const getWeeklyData = (data: IData[], type: IYProp): any[] => {
  return getGroupedData(data, type, 'week')
}

// 按月分组并累加
const getMonthlyData = (data: IData[], type: IYProp): any[] => {
  return getGroupedData(data, type, 'month')
}
const getGroupedData = (data: IData[], type: IYProp, groupBy: 'week' | 'month'): any[] => {
  const groupedData: Record<string, number> = {}
  
  // 根据时间粒度选择分组方式
  const getTimeKey = (date: string): string => {
    if (groupBy === 'week') {
      return getWeekOfYear(date) // 获取 "YYYY-Wxx"
    }
    return date.slice(0, 7) // 提取 "YYYY-MM" 
  }

  data.forEach((item) => {
    const timeKey = getTimeKey(item.date) // 获取分组键（周或月）
      // 其他类型，累加值
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = 0
      }
      groupedData[timeKey] += item[type]
    
  })

  return Object.keys(groupedData).map((timeKey) => ({
    date: timeKey,
    [type]: groupedData[timeKey],
  }))
}
const initChart2 = () => {
  option2.value = {
    title: {
      text: '退货原因分布',
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">退货原因</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
        
        // 计算销售额的百分比
        itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${params.data.value} (${params.percent}%)</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      }
    },
    series: [
      {
        name: '退货原因',
        type: 'pie',
        radius: '50%',
        left: 0,
        right: 0,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
        
          formatter: [
            `{a|{b}}`,
            '{b|{c}} {x|({d}%)}'
          ].join('\n'), // 设置显示的文字
          rich: {
            a: {
              color: '#333',
              fontSize: 15,
              lineHeight: 28
            },
            b: {
              color: '#333',
              fontSize: 14,
              lineHeight: 20,
            },
            x: {
              color: '#999',
              fontSize: 14,
              lineHeight: 20,
            },
          },
        },
        labelLine: {
          lineStyle: {
            width: 2
          },
        },
        data: data2.value,
        color: colorList,
      }
    ]
  }
  chartInstance2?.setOption(option2.value)
}

onMounted(() => {
  if (chartContainer1.value) {
    chartInstance1 = echarts.init(chartContainer1.value)
    chartObserver1 = new ResizeObserver(() => {
      if (chartInstance1) {
        chartInstance1.resize()
      }
    })
    chartObserver1.observe(chartContainer1.value)
    initChart1()
  }
  if (chartContainer2.value) {
    chartInstance2 = echarts.init(chartContainer2.value)
    chartObserver2 = new ResizeObserver(() => {
      if (chartInstance2) {
        chartInstance2.resize()
      }
    })
    chartObserver2.observe(chartContainer2.value)
    initChart2()
  }
})
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
</script>

<style lang="scss" scoped>
.return-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .el-table {
    flex: 1;
    :deep() {
      .el-table__body .cell {
        max-height: 24px;
      }
    }
  }
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>