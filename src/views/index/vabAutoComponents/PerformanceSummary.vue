<template>
  <vab-card :body-style="{ height: '422px' }" class="performance-card" skeleton>
    <template #header>
      产品经理绩效汇总
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPagePerformanceHistory } from '/@/type/index/frontPage'

defineOptions({
  name: 'PerformanceSummary',
})

const props = defineProps<{
  dataMap: Record<string, IGetFrontPagePerformanceHistory[]>
  selectedMetric: string
}>()

// 指标配置
const metricConfig: Record<string, { name: string; key: keyof IGetFrontPagePerformanceHistory; color: string }> = {
  developmentDesign: { name: '提成', key: 'developmentDesign', color: '#845EC2' },
  newProductOneYearCommission: { name: '新品提成', key: 'newProductOneYearCommission', color: '#FFC75F' },
  newProductsAverageProfit: { name: '新品平均利润', key: 'newProductsAverageProfit', color: '#FF6B9D' },
  purchaseAmount: { name: '新款采购额', key: 'purchaseAmount', color: '#0081CF' },
  jingPinCount: { name: '精品', key: 'jingPinCount', color: '#4D96FF' },
  jingPuCount: { name: '精铺', key: 'jingPuCount', color: '#FFD93D' },
  jingPuVineCount: { name: '精铺vine', key: 'jingPuVineCount', color: '#6BCB77' },
  puHuoCount: { name: '铺货', key: 'puHuoCount', color: '#FF6B6B' },
  runsNumbers: { name: '新款评估跑分次数', key: 'runsNumbers', color: '#F38181' },
  progressNumbers: { name: '新品进度记录数', key: 'progressNumbers', color: '#AA96DA' },
  samplingFrequency: { name: '拿样次数', key: 'samplingFrequency', color: '#FCBAD3' },
}

const option = reactive<any>({
  legend: {
    bottom: '4%',
    type: 'scroll',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(238, 246, 253, 0.7)',
    borderWidth: 0,
    confine: true,
    formatter: (params: any[]) => {
      let titleHtmlStr = `<div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px;">${params[0].name}</div>`

      // 按值倒序排列
      const sortedParams = [...params].sort((a, b) => (b.value || 0) - (a.value || 0))

      const itemsHtml = sortedParams
        .map(
          (item) => `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 3px 8px;
            margin-bottom: 5px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            font-size: 13px;
          ">
            <div style="display: flex; align-items: center;">
              ${item.marker}
              <span style="color: #333; margin-left: 6px;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; color: #333;">${item.value}</span>
          </div>
        `
        )
        .join('')

      return `
        <div style="padding: 0px; border-radius: 20px; width: 160px;">
          ${titleHtmlStr}
          ${itemsHtml}
        </div>
      `
    },
  },
  grid: {
    left: '1%',
    bottom: '15%',
    right: '1%',
    top: '0',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true,
      color: '#86909c',
    },
    axisLabel: {
      color: '#86909c',
    },
  },
  yAxis: {
    type: 'value',
    name: '',
    axisLabel: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#e5e8ef',
      },
    },
    boundaryGap: [0, 0.1],
  },
  series: [],
})

// 生成颜色列表，为每个产品经理分配不同的颜色
const generateColors = (count: number): string[] => {
  const colors = [
    '#4D96FF',
    '#FFD93D',
    '#6BCB77',
    '#FF6B6B',
    '#845EC2',
    '#FFC75F',
    '#FF6B9D',
    '#0081CF',
    '#95E1D3',
    '#F38181',
    '#AA96DA',
    '#FCBAD3',
    '#A8D8EA',
    '#F9D89C',
    '#B4A7D6',
  ]
  return colors.slice(0, count)
}

watch(
  () => [props.dataMap, props.selectedMetric],
  (newVal) => {
    const dataMap = newVal[0] as Record<string, IGetFrontPagePerformanceHistory[]>
    const newMetric = newVal[1] as string

    if (!dataMap || !newMetric) {
      option.series = []
      option.xAxis.data = []
      return
    }

    const config = metricConfig[newMetric]
    if (!config) {
      option.series = []
      option.xAxis.data = []
      return
    }

    // 获取所有产品经理名称
    const userNames = Object.keys(dataMap).filter((name) => dataMap[name] && dataMap[name].length > 0)
    if (userNames.length === 0) {
      option.series = []
      option.xAxis.data = []
      return
    }

    // 获取所有月份（从第一个产品经理的数据中获取，假设所有产品经理的月份相同）
    const months = dataMap[userNames[0]].map((item) => item.month)
    option.xAxis.data = months

    // 为每个产品经理生成一条折线
    const colors = generateColors(userNames.length)
    option.series = userNames.map((userName, index) => {
      const userData = dataMap[userName]
      const values = months.map((month) => {
        const monthData = userData.find((item) => item.month === month)
        return monthData ? (monthData[config.key] as number) : 0
      })

      return {
        name: userName,
        type: 'line',
        data: values,
        itemStyle: { color: colors[index] },
        lineStyle: {
          width: 2,
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      }
    })
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.performance-card {
  :deep() {
    .echarts {
      height: 400px !important;
    }
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
  .right-select {
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
}
</style>
