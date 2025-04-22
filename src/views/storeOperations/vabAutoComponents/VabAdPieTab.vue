<template>
  <div class="pie-container">
    <vab-card style="height: 400px;">
      <div style="display: flex; width: 100%; height: 100%">
        <div style="width: 43%">
          <div style="text-align: left;">
            <el-form inline>
              <el-form-item label="目标ACOS">
                <el-input />
              </el-form-item>
              <el-form-item label="目标转化率">
                <el-input />
              </el-form-item>
            </el-form>
          </div>
          <div ref="chartContainer1" style="width: 100%; height: 350px;"></div>
        </div>
        <el-divider direction="vertical" style="height: 360px"/>
        <div style="flex: 1">
          <el-row >
            <el-col :span="4">
              <el-select v-model="pieSelect" style="max-width: 5em; margin-left: 10px;" @change="handleChangeSelect">
                <el-option 
                  v-for="item in pieSelectOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="20">
              <div ref="chartContainer2" style="width: 100%; height: 400px;"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </vab-card>
    <div style="text-align: right">
      <el-form inline :model="queryForm" @submit.prevent>
        <el-form-item>
          <el-checkbox>精准搜索</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :cell-style="cellStyle" :data="data2" :header-cell-style="{textAlign: 'center'}" stripe>
      <el-table-column fixed="left" label="客户搜索词" min-width="120" prop="name">
        <template #default="{ row }">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="展示量" min-width="90" prop="impressions"/>
      <el-table-column label="点击量" min-width="90" prop="clicks"/>
      <el-table-column label="点击率(我们/大盘)" min-width="170" prop="clickThroughRate"/>
      <el-table-column label="转化率(我们/大盘)" min-width="170" prop="conversionRate"/>
      <el-table-column label="花费" min-width="80" prop="spend"/>
      <el-table-column label="订单数" min-width="90" prop="orders"/>
      <el-table-column label="ACOS" min-width="90" prop="acos"/>
      <el-table-column label="CPC" min-width="80" prop="cpc"/>
      <el-table-column label="建议竞价" min-width="100" prop="suggestedBid"/>
      <el-table-column label="广告日总展示" min-width="130" prop="dailyImpressions"/>
      <el-table-column label="估算广告日总点击" min-width="170" prop="estimatedDailyClicks"/>
      <el-table-column label="曝光量排名" min-width="120" prop="impressionRank"/>
      <el-table-column label="品牌占有率" min-width="120" prop="brandShare"/>
      <el-table-column fixed="right" label="分类" min-width="130" prop="category">
        <template #default="{ row }">
          <span :style="{ color: `${getCategoryColor(row.category)}` }">{{ highLowMap[row.category] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'
import { highLowMap, pieSelectLabelMap, pieSelectMap, pieSelectOption } from '../constantOption'

defineOptions({
  name: 'VabAdPieTab'
})

const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: ''
})

const pieSelect = ref<number>(0)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const data1 = ref<any[]>([
  { value: 211.02, sales: 361.53, name: '高ACOS' },
  { value: 453.57, sales: 1966.56, name: '低ACOS' },
  { value: 21.5, sales: 0, name: '高点击不出单' },
  { value: 83.31, sales: 0, name: '低点击不出单' },
])
const data2 = ref<any[]>([
  {
    "name": "b01016el5c",
    "impressions": 12345,
    "clicks": 678,
    "clickThroughRate": "5.49% / 4.87%",
    "conversionRate": "3.25% / 2.91%",
    "spend": 567.89,
    "orders": 22,
    "acos": "25%",
    "cpc": 2.5,
    "suggestedBid": 2.8,
    "dailyImpressions": 15000,
    "estimatedDailyClicks": 720,
    "impressionRank": 1,
    "brandShare": "15%",
    "category": 0,
    "sales": 549
  },
  {
    "name": "a10471qr9k",
    "impressions": 23456,
    "clicks": 987,
    "clickThroughRate": "4.21% / 3.87%",
    "conversionRate": "2.89% / 2.56%",
    "spend": 678.45,
    "orders": 28,
    "acos": "30%",
    "cpc": 2.3,
    "suggestedBid": 2.5,
    "dailyImpressions": 20000,
    "estimatedDailyClicks": 850,
    "impressionRank": 2,
    "brandShare": "18%",
    "category": 1,
    "sales": 421
  },
  {
    "name": "z00013xy8p",
    "impressions": 34567,
    "clicks": 1234,
    "clickThroughRate": "3.57% / 3.01%",
    "conversionRate": "1.95% / 1.87%",
    "spend": 789.23,
    "orders": 35,
    "acos": "27%",
    "cpc": 2.8,
    "suggestedBid": 3.1,
    "dailyImpressions": 25000,
    "estimatedDailyClicks": 960,
    "impressionRank": 3,
    "brandShare": "20%",
    "category": 2,
    "sales": 357
  },
  {
    "name": "b20116mn7d",
    "impressions": 17890,
    "clicks": 765,
    "clickThroughRate": "4.27% / 3.98%",
    "conversionRate": "3.12% / 2.85%",
    "spend": 689.45,
    "orders": 25,
    "acos": "28%",
    "cpc": 2.7,
    "suggestedBid": 3,
    "dailyImpressions": 18000,
    "estimatedDailyClicks": 820,
    "impressionRank": 4,
    "brandShare": "17%",
    "category": 3,
    "sales": 427
  },
  {
    "name": "a10517op8e",
    "impressions": 24567,
    "clicks": 1123,
    "clickThroughRate": "4.57% / 4.01%",
    "conversionRate": "2.76% / 2.48%",
    "spend": 745.34,
    "orders": 30,
    "acos": "26%",
    "cpc": 2.6,
    "suggestedBid": 2.9,
    "dailyImpressions": 22000,
    "estimatedDailyClicks": 950,
    "impressionRank": 5,
    "brandShare": "20%",
    "category": 0,
    "sales": 457
  },
  {
    "name": "z00018uv9p",
    "impressions": 28934,
    "clicks": 1345,
    "clickThroughRate": "4.65% / 4.12%",
    "conversionRate": "3.01% / 2.85%",
    "spend": 892.67,
    "orders": 33,
    "acos": "29%",
    "cpc": 2.8,
    "suggestedBid": 3.2,
    "dailyImpressions": 27000,
    "estimatedDailyClicks": 1050,
    "impressionRank": 6,
    "brandShare": "23%",
    "category": 1,
    "sales": 465
  },
  {
    "name": "q01519xy7r",
    "impressions": 33012,
    "clicks": 1456,
    "clickThroughRate": "4.41% / 4.03%",
    "conversionRate": "2.89% / 2.63%",
    "spend": 998.45,
    "orders": 40,
    "acos": "25%",
    "cpc": 3,
    "suggestedBid": 3.3,
    "dailyImpressions": 29000,
    "estimatedDailyClicks": 1200,
    "impressionRank": 7,
    "brandShare": "25%",
    "category": 2,
    "sales": 441
  },
  {
    "name": "m02731ij4z",
    "impressions": 18234,
    "clicks": 785,
    "clickThroughRate": "4.30% / 3.90%",
    "conversionRate": "3.21% / 2.91%",
    "spend": 623.78,
    "orders": 27,
    "acos": "24%",
    "cpc": 2.5,
    "suggestedBid": 2.8,
    "dailyImpressions": 20000,
    "estimatedDailyClicks": 860,
    "impressionRank": 8,
    "brandShare": "18%",
    "category": 3,
    "sales": 430
  },
  {
    "name": "h00345lp6y",
    "impressions": 24321,
    "clicks": 1098,
    "clickThroughRate": "4.51% / 4.02%",
    "conversionRate": "2.96% / 2.71%",
    "spend": 711.65,
    "orders": 29,
    "acos": "27%",
    "cpc": 2.7,
    "suggestedBid": 3.1,
    "dailyImpressions": 25000,
    "estimatedDailyClicks": 900,
    "impressionRank": 9,
    "brandShare": "19%",
    "category": 0,
    "sales": 451
  },
  {
    "name": "g01458mn3q",
    "impressions": 31245,
    "clicks": 1567,
    "clickThroughRate": "5.01% / 4.33%",
    "conversionRate": "3.18% / 2.97%",
    "spend": 845.32,
    "orders": 37,
    "acos": "28%",
    "cpc": 2.9,
    "suggestedBid": 3.4,
    "dailyImpressions": 30000,
    "estimatedDailyClicks": 1100,
    "impressionRank": 10,
    "brandShare": "22%",
    "category": 1,
    "sales": 501
  },
  {
    "name": "d02371no7x",
    "impressions": 26789,
    "clicks": 1342,
    "clickThroughRate": "5.01% / 4.40%",
    "conversionRate": "2.89% / 2.65%",
    "spend": 765.23,
    "orders": 32,
    "acos": "26%",
    "cpc": 2.8,
    "suggestedBid": 3.2,
    "dailyImpressions": 28000,
    "estimatedDailyClicks": 980,
    "impressionRank": 11,
    "brandShare": "21%",
    "category": 2,
    "sales": 501
  },
  {
    "name": "f00213jk4z",
    "impressions": 19876,
    "clicks": 865,
    "clickThroughRate": "4.35% / 4.01%",
    "conversionRate": "3.31% / 3.12%",
    "spend": 645.67,
    "orders": 28,
    "acos": "23%",
    "cpc": 2.4,
    "suggestedBid": 2.7,
    "dailyImpressions": 21000,
    "estimatedDailyClicks": 880,
    "impressionRank": 12,
    "brandShare": "16%",
    "category": 3,
    "sales": 435
  },
  {
    "name": "v01824ut8y",
    "impressions": 21987,
    "clicks": 945,
    "clickThroughRate": "4.29% / 4.05%",
    "conversionRate": "3.02% / 2.89%",
    "spend": 723.12,
    "orders": 31,
    "acos": "27%",
    "cpc": 2.6,
    "suggestedBid": 3,
    "dailyImpressions": 23000,
    "estimatedDailyClicks": 940,
    "impressionRank": 13,
    "brandShare": "20%",
    "category": 0,
    "sales": 429
  },
  {
    "name": "y00437pl6m",
    "impressions": 25678,
    "clicks": 1210,
    "clickThroughRate": "4.71% / 4.21%",
    "conversionRate": "2.97% / 2.63%",
    "spend": 800.45,
    "orders": 35,
    "acos": "29%",
    "cpc": 2.8,
    "suggestedBid": 3.1,
    "dailyImpressions": 26000,
    "estimatedDailyClicks": 1010,
    "impressionRank": 14,
    "brandShare": "23%",
    "category": 1,
    "sales": 471
  },
  {
    "name": "t03019lo8n",
    "impressions": 28945,
    "clicks": 1456,
    "clickThroughRate": "5.03% / 4.67%",
    "conversionRate": "3.15% / 3.01%",
    "spend": 965.78,
    "orders": 38,
    "acos": "26%",
    "cpc": 3,
    "suggestedBid": 3.5,
    "dailyImpressions": 31000,
    "estimatedDailyClicks": 1150,
    "impressionRank": 15,
    "brandShare": "24%",
    "category": 2,
    "sales": 503
  }
])
const processedData = ref<any[]>([])
// 计算销售额总和
const totalSales = data1.value.reduce((sum, item) => sum + item.sales, 0)

const initChart1 = () => {
 
  // 配置项
  option1.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
        if (params.data.sales > 0) {
          // 计算销售额的百分比
          const salesPercent = `${((params.data.sales / totalSales) * 100).toFixed(2)  }%`
          
          itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">花费: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.value} | ${params.percent}%</span>
          </div>
          <div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">销售额: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.sales} | ${salesPercent}</span>
          </div>`
        } else {
          itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">花费: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.value} | ${params.percent}%</span>
          </div>`
        }  
        
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
        name: '花费',
        type: 'pie',
        radius: '50%',
        // center: ['50%', '43%'],
        left: 0,
        right: 0,
        top: 0,
        bottom: 30,
        startAngle: 90, //起始角度
        labelLine: {
          lineStyle: {
            width: 2
          },
          length: 20, // 连接线长度
          length2: 30, // 连接线的第二段长度
        },
        label: {
          alignTo: 'labelLine',
          formatter: (params: any) => {
            const { data, percent } = params

            // 计算销售额的百分比
            const salesPercent =
              totalSales > 0 && data.sales > 0
                ? `${((data.sales / totalSales) * 100).toFixed(2)  }%`
                : ''

            // 销售额信息
            const salesInfo =
              data.sales > 0
                ? `{b|销售额：}{x|€${data.sales} | ${salesPercent}}`
                : ''

            return `{a|${data.name}}\n{b|花费：}{x|€${data.value} | ${percent}% }\n${  salesInfo}`
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              lineHeight: 28
            },
            b: {
              color: '#7d7f84',
              fontSize: 16,
              lineHeight: 20,
              align: 'left'
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
            },
          },
        },
        data: data1.value,
        color: ['#ffdc4c', '#62d9ad', '#e65a56', '#00aeef'],
      },
    ],
  }
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  // 配置项
  option2.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
        // if (params.data.sales > 0) {
        //   // 计算销售额的百分比
        //   const salesPercent = ((params.data.sales / totalSales) * 100).toFixed(2) + '%'
          
        //   itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
        //     ${params.marker}
        //     <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">花费: </div>
        //     <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.value} | ${params.percent}%</span>
        //   </div>
        //   <div style="display: flex;align-items:center;">
        //     ${params.marker}
        //     <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">销售额: </div>
        //     <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.sales} | ${salesPercent}</span>
        //   </div>`
        // } else
        
        itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">${pieSelectLabelMap[pieSelect.value]}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">€${params.data.value} | ${params.percent}%</span>
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
        name: '搜索词',
        type: 'pie',
        radius: '50%',
        // center: ['50%', '30%'],
        left: 0,
        right: 0,
        top: 0,
        bottom: 20,
        // clockwise: false,
        startAngle: 90, //起始角度
        labelLine: {
          lineStyle: {
            width: 2
          },
          // length: 30, // 连接线长度
          // length2: 40, // 连接线的第二段长度
        },
        label: {
          // position: 'outside', // 标签在外部
          position: 'outer',
          alignTo: 'edge',
          edgeDistance: 10,
          // alignTo: 'labelLine',
          formatter: (params: any) => {
            const { data, percent } = params
            // const sortedData = params.seriesData
            //   .sort((a: any, b: any) => b.value - a.value) // 排序
            //   .slice(0, 3); // 获取前 3 项

            return `{a|${data.name}}\n{b|${pieSelectLabelMap[pieSelect.value]}：}{x|€${data.value} | ${percent}% }` 
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              padding: [0, 0, 5, 0], 
            },
            b: {
              color: '#7d7f84',
              fontSize: 16,
              lineHeight: 20,
              align: 'left',
              padding: [0, 0, 10, 0],  
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
              padding: [0, 0, 10, 0],  
            },
          },
        },
        data: processedData.value,
        color: [
          // "#FFFFCC", 
          // "#CCFFFF",
          // "#FFCCCC",
          // "#FFE5CC",
          // "#FFFFCC",
          // "#F2CCFF",
          // "#CCFFCC",
          // "#FFCC99",
          // "#CCFFFF",
          // "#FFCCCC",
          // "#CCFFFF",
          // "#F2CCFF",
          // "#CCFFCC",
          // "#FFE5CC",
          // "#FFCCCC",
          // "#666666" 
          '#ffdc4c', // 金黄色
          '#62d9ad', // 青绿色
          '#e65a56', // 珊瑚红
          '#00aeef', // 天蓝色
          '#ffa500', // 橙色
          '#20c997', // 翠绿色
          '#f94d50', // 鲜红色
          '#0088cc', // 深天蓝色
          '#ffcc33', // 明黄色
          '#66cdaa', // 中青绿色
          '#d9534f', // 番茄红
          '#33b5e5', // 浅蓝色
          '#ffc107', // 柠檬黄
          '#3cb371', // 春绿色
          '#dc3545', // 枸杞红
          '#5bc0de'  // 宝石蓝
        ],
      },
    ],
  }
  chartInstance2?.setOption(option2.value)
}
// 更新图表
// const updateChart1 = () => {
//   chartInstance1?.setOption(option1.value, true) 
// }
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value, true) 
}
const handleChangeSelect = () => {
  processedData.value = data2.value.map((item) => {
    return {
      name: item.name,
      value: item[pieSelectMap[pieSelect.value]],
    }
  })
  processedData.value.push({
    name: '其他',
    value: 100,
  })
  option2.value.series[0].data = processedData.value
  updateChart2()
}
onBeforeMount(() => {
  data1.value.sort((a, b) => b.value - a.value)
  processedData.value = data2.value.map((item) => {
    return {
      name: item.name,
      value: item[pieSelectMap[pieSelect.value]],
    }
  })
  processedData.value.push({
    name: '其他',
    value: 100,
  })
  processedData.value.sort((a, b) => b.value - a.value)
})
// 初始化图表
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

// 销毁图表
onBeforeUnmount(() => {
  if (chartInstance1) {
    chartInstance1.dispose()
    chartObserver1.disconnect()
  }
  if (chartInstance2) {
    chartInstance2.dispose()
    chartObserver2.disconnect()
  }
})
const getCategoryColor = (value: any) => {
  switch (value) {
  case 0: {
    return '#00aeef'
  }
  case 1: {
    return '#e65a56'
  }
  case 2: {
    return '#62d9ad'
  }
  default: {
    return '#ffdc4c'
  }
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 14) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const queryData = () => {
  // fetchData()
}
</script>

<style lang="scss" scoped>
.pie-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .el-table {
    flex: 1;
  }
  
}
</style>