<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-row :gutter="10">
      <el-col :span="12">
        <vab-card style="height: 400px;"></vab-card>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex; flex-direction: column; height: calc(var(--el-container-height) - 20px)">
              <vab-card class="card4" title="库龄" style="height: 370px; margin-bottom: 10px;">
                <div style="text-align: right; margin-bottom: 15px;">
                  <el-radio-group v-model="ageRadio" size="small" @change="handleSwitchBar">
                    <el-radio-button label="数量" :value="0" />
                    <el-radio-button label="占比" :value="1" />
                  </el-radio-group>
                </div>
                <el-row>
                  <el-col :span="9">
                    <div ref="chartContainer2" style="width: 100%; height: 272px"></div>
                  </el-col>
                  <el-col :span="15">
                  
                    <el-table :data="percentageAgeData" max-height="285" :header-cell-style="headerCellStyle" show-summary>
                      <el-table-column label="项目" prop="name" min-width="110">
                        <template #default="{ row, $index }">
                          <span class="table-item" :style="{ '--dot-color': storageAgeColorList[$index] }">
                            {{ row.name }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="ageRadio === 0" label="FBA仓" prop="value" min-width="90" align="right"></el-table-column>
                      <el-table-column v-if="ageRadio === 1" label="FBA仓" prop="percentage" min-width="90" align="right">
                        <template #default="{ row }">
                          {{ row.percentage }}%
                        </template>
                      </el-table-column>
                      <el-table-column label="预估下月费用" min-width="120"></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </vab-card>
              <vab-card class="card1-title" style="flex: 1;" title="断货后即将上架产品">
                <el-table>
                  <el-table-column label="SKU"></el-table-column>
                  <el-table-column label="断货前月销量"></el-table-column>
                  <el-table-column label="最近入库"></el-table-column>
                  <el-table-column label="站点"></el-table-column>
                </el-table>
              </vab-card>
            </div>
          </el-col>
          <el-col :span="14">
            <div style="display: flex; flex-direction: column; height: calc(var(--el-container-height) - 20px)">
              <vab-card class="card2-title" style="height: 370px; margin-bottom: 10px;" title="产品成本波动监控">
                <el-table>
                  <el-table-column label="日期"></el-table-column>
                  <el-table-column label="SKU"></el-table-column>
                  <el-table-column label="价格变动"></el-table-column>
                  <el-table-column label="毛利率变动"></el-table-column>
                  <el-table-column label="类型"></el-table-column>
                  <el-table-column label="站点"></el-table-column>
                </el-table>
              </vab-card>
              <vab-card class="card3-title" style="flex: 1; height: 100%; display: flex; flex-direction: column;" title="即将断货产品预警">
                <el-table :data="fakeTableData3" style="flex: 1;">
                  <el-table-column label="SKU" prop="sku" min-width="150">
                    <template #default="{ row }">
                      <span v-html="row.sku"></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="可售天数" prop="availableDays" min-width="100" align="center"></el-table-column>
                  <el-table-column label="预计断货" prop="expectedOutOfStock" min-width="100" align="center"></el-table-column>
                  <el-table-column label="月销量" prop="monthlySales" min-width="90" align="center"></el-table-column>
                  <el-table-column label="剩余库存" prop="remainingStock" min-width="100" align="center"></el-table-column>
                  <el-table-column label="广告" prop="advertisement" min-width="70" align="center">
                    <template #default="{ row }">
                      <el-tag v-if="row.advertisement === '开'" type="danger">{{ row.advertisement }}</el-tag>
                      <el-tag v-if="row.advertisement === '关'" type="success">{{ row.advertisement }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="当前毛利" prop="currentProfit" min-width="100" align="center"></el-table-column>
                  <el-table-column label="站点" prop="site" min-width="110" align="center"></el-table-column>
                </el-table>
                <vab-pagination 
                  :current-page="queryForm.pageNo"
                  :page-size="queryForm.pageSize"
                  :total="total"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  
                />
              </vab-card>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { CSSProperties } from 'vue'
import { storageAgeColorList } from '../constantOption'

defineOptions({
  name: 'operationsDashboard'
})

const chartContainer2 = ref<HTMLElement | null>(null)

let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null

let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const ageRadio = ref<number>(0)
const option2 = ref<any>({})
const data2 = ref<any[]>([
  { name: '0-90', value: 11800 },
  { name: '91-180', value: 2644 },
  { name: '181-270+', value: 1175 },
  { name: '271-365', value: 152 },
  { name: '365+', value: 293 },
])
// 计算库龄总和
const totalAgeValue = data2.value.reduce((sum, item) => sum + item.value, 0)
let percentageAgeData: any[]

const fakeTableData3 = [
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: '15%',
    site: '美国亚马逊',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: '15%',
    site: '美国亚马逊',
  },


]

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
  const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">库龄</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
      
        itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.seriesName}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${ageRadio.value === 0 ? '$': ''}${params.value}${ageRadio.value === 1 ? '%': ''}</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
      confine: true
    },
    grid: {
      top: 10,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['FBA仓'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        fontSize: '14px'
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1]  // 为顶部留出空间
    },
    series: [
      {
        name: '365+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[4].value],
        itemStyle: {
          color: storageAgeColorList[4]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '271-365',
        type: 'bar',
        stack: '总量',
        data: [data2.value[3].value],
        itemStyle: {
          color: storageAgeColorList[3]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '181-270+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[2].value],
        itemStyle: {
          color: storageAgeColorList[2]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '91-180',
        type: 'bar',
        stack: '总量',
        data: [data2.value[1].value],
        itemStyle: {
          color: storageAgeColorList[1]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '0-90',
        type: 'bar',
        stack: '总量',
        barWidth: '40%',
        data: [data2.value[0].value],
        itemStyle: {
          color: storageAgeColorList[0]
        },
        emphasis: {
          focus: 'series'
        },
      },
    ]
  }
  chartInstance2?.setOption(option2.value)
}
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value)
}
// 切换是百分比还是数量
const handleSwitchBar = () => {
  const threshold = 10
  if (ageRadio.value === 0) {
  
    option2.value.series.forEach((seriesItem: any, index: number) => {
      const value = percentageAgeData[4 - index].value
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [value]
      if (percentage > threshold) {
        seriesItem.label = {
          show: false, 
        }
      }
    })
    option2.value.yAxis.axisLabel = {}
  } else if (ageRadio.value === 1) {

    option2.value.series.forEach((seriesItem: any, index: number) => {
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [percentage]
      seriesItem.label = {
        show: percentage > threshold, // 当占比大于阈值时显示比例
        formatter: (params: any) => `${params.value}%`, 
      }
    })
    option2.value.yAxis.axisLabel = {
      formatter: '{value}%'
    }
  }
  updateChart2()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center'
  }
}
onBeforeMount(() => {
  percentageAgeData = data2.value.map(item => ({
    ...item,
    percentage: ((item.value / totalAgeValue) * 100).toFixed(2)
  }))
})
onMounted(() => {
  // if (chartContainer1.value) {
  //   chartInstance1 = echarts.init(chartContainer1.value)
  //   chartObserver1 = new ResizeObserver(() => {
  //     if (chartInstance1) {
  //       chartInstance1.resize()
  //     }
  //   })
  //   chartObserver1.observe(chartContainer1.value)
  //   initChart1()
  // }
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
</script>

<style lang="scss" scoped>
.card1-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-weight: 600;
      font-size: calc(var(--el-font-size-base) + 2px);
      background-color: rgba(153, 219, 112, 0.2);  
      color: #6aa74d; 
    }
    .el-card__body {
      padding: 0;
    }
  }
}
.card2-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-weight: 600;
      font-size: calc(var(--el-font-size-base) + 2px);
      background-color: rgba(115, 153, 192, 0.2);  
      color: #4f6d7a;  
    }
    .el-card__body {
      padding: 0;
    }
  }
}
.card3-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-weight: 600;
      font-size: calc(var(--el-font-size-base) + 2px); /* 增加字体大小 */
      background-color: rgba(253, 149, 118, 0.15); 
      color: #ff8c69;  
    }

    .el-card__body {
      padding: 0;
    }
  }
}
.card4 {
  :deep() {
    .el-card__header {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .el-card__body {
      padding-top: 0;
      padding-left: 0;
    }
  }
}

</style>