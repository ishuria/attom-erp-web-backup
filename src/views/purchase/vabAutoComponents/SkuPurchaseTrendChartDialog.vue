<template>
  <el-dialog v-model="visible" :title="`${data?.sku} 近12月采购量趋势`" width="60%">
    <div v-if="data" class="trend-dialog-content">
      <div class="trend-info">
        <span>产品名称：{{ data.productName }}</span>
      </div>
      <div ref="chartRef" style="width: 100%; height: 300px"></div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { IGetPurchaseStatisticsSkuItem } from '/@/type/purchase/statistics'

defineOptions({
  name: 'SkuPurchaseTrendChartDialog',
})

const visible = defineModel<boolean>('visible', { required: true })
const data = defineModel<IGetPurchaseStatisticsSkuItem | null>('data', { required: true })

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 监听弹窗打开，渲染图表
watch(visible, (val) => {
  if (val && data.value) {
    nextTick(() => {
      renderChart()
    })
  }
})

// 渲染趋势折线图
const renderChart = () => {
  if (!chartRef.value || !data.value) return

  if (chart) {
    chart.dispose()
  }

  chart = echarts.init(chartRef.value)

  // 从monthlyTrendList提取x轴和y轴数据
  const xAxisData = data.value.monthlyTrendList?.map((t) => t.yearMonth) || []
  const seriesData = data.value.monthlyTrendList?.map((t) => t.purchaseCount) || []

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: '采购套数',
    },
    series: [
      {
        name: '月度采购套数',
        type: 'line',
        data: seriesData,
        smooth: true,
        itemStyle: {
          color: '#409EFF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ]),
        },
      },
    ],
  }

  chart.setOption(option)
}
</script>

<style lang="scss" scoped>
.trend-dialog-content {
  .trend-info {
    margin-bottom: 16px;
    color: #666;
  }
}
</style>
