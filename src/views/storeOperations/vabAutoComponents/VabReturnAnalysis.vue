<template>
  <div class="return-container">
    <el-row :gutter="10">
      <el-col :span="18">
        <vab-card style="height: 300px">
          <div ref="chartContainer1" style="width: 100%; height: 300px"></div>
        </vab-card>
      </el-col>
      <el-col :span="6">
        <vab-card style="height: 300px">
          <div ref="chartContainer2" style="width: 100%; height: 300px"></div>
        </vab-card>
      </el-col>
    </el-row>
    <vab-query-form style="margin-bottom: 10px;">
      <vab-query-form-left-panel>
        <span>退货订单反馈</span>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-select style="max-width: 6em;" placeholder="退货原因"></el-select>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border stripe :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="订单号"></el-table-column>
      <el-table-column label="退货原因"></el-table-column>
      <el-table-column label="买家备注"></el-table-column>
      <el-table-column label="买家之声反馈"></el-table-column>
      <el-table-column label="退货时间"></el-table-column>
      <el-table-column label="订购时间"></el-table-column>
      <el-table-column label="订单标签"></el-table-column>
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

defineOptions({
  name: 'VabReturnAnalysis'
})
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({

})

const data2 = ref<any[]>([
  { value: 1, name: '订购错误的商品' },
  { value: 1, name: '不想要的商品' },
  { value: 2, name: '没有原因' },
  { value: 1, name: '不兼容' },
])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)

const initChart1 = () => {

}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'item',
      confine: true,
      // formatter: (params: any) => {
      //   // tooltip标题
      //   let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">支出构成</div>`

      //   // tooltip详情内容
      //   let itemHtmlStrArr = ''
        
      //   // 计算销售额的百分比
      //   itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
      //     ${params.marker}
      //     <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
      //     <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">$${params.data.value} (${params.percent}%)</span>
      //   </div>`

      //   const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
      //     ${itemHtmlStrArr}
      //   </div>`
      //   // 最终html字符串
      //   const resHtmlStr = titleHtmlStr + contentHtmlStr
      //   return resHtmlStr
      // }
    },
    series: [
      {
        name: '支出构成',
        type: 'pie',
        radius: '50%',
        left: 0,
        right: 0,
        // avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
        
          // formatter: [
          //   `{a|${formattedTotalValue}}`,
          //   '{b|总支出}'
          // ].join('\n'), // 设置显示的文字
          // rich: {
          //   a: {
          //     color: '#000',
          //     fontSize: 17,
          //     fontWeight: 550,
          //     lineHeight: 28
          //   },
          //   b: {
          //     color: '#999',
          //     fontSize: 14,
          //     lineHeight: 20,
          //   },
          // },
        },
        labelLine: {
          show: false
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
  }
}
</style>