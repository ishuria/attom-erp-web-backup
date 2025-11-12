<template>
  <vab-card :class="cardClass" :style="{ position: 'relative', height: height }">
    <div ref="chartContainer" :style="{ width: '100%', height: height }"></div>
    <div style="position: absolute; top: 5px; right: 5px">
      <el-date-picker
        v-model="dateRangeModel"
        :clearable="false"
        :editable="false"
        :shortcuts="dateShortcuts"
        size="default"
        style="max-width: 16em"
        type="daterange"
        value-format="YYYY-MM-DD"
        @change="handleDateRangeChange"
      />
    </div>
  </vab-card>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { storageAgeColorList } from '../constantOption'
import type { IGetSkuSiteDailyCost } from '/@/type/storeOperation/productAnalysisType'

defineOptions({
  name: 'SkuSiteDailyCostChartCard',
})

interface Props {
  // 图表数据
  chartData: IGetSkuSiteDailyCost[]
  // 日期范围
  dateRange?: [string, string]
  // 卡片高度
  height?: string
  // 卡片类名
  cardClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => [],
  dateRange: () => ['', ''],
  height: '240px',
  cardClass: '',
})

const emit = defineEmits<{
  'update:dateRange': [value: [string, string]]
  dateRangeChange: [value: [string, string]]
}>()

// 使用 computed 来处理双向绑定
const dateRangeModel = computed({
  get: () => props.dateRange,
  set: (value: [string, string]) => {
    emit('update:dateRange', value)
  },
})

const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver

// 日期选择器快捷选项
const dateShortcuts = [
  {
    text: '前7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6)
      return [start, end]
    },
  },
  {
    text: '前30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return [start, end]
    },
  },
]

// 处理日期范围变化（v-model 会自动处理 update:dateRange，这里只需要触发 dateRangeChange 事件）
const handleDateRangeChange = (value: [string, string] | null) => {
  if (value) {
    emit('dateRangeChange', value)
  }
}

// 获取 CSS 变量的值
const fontSizeBase = getComputedStyle(document.documentElement).getPropertyValue('--el-font-size-base').trim()

// 生成图表配置
const generateChartOption = () => {
  return {
    legend: {
      icon: 'circle',
      left: 0,
      top: 5,
      textStyle: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 5,
      data: ['SKU实际价格', 'FBA配送费', '打包成本', '头程运费', '试算毛利'],
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 10,
      right: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.chartData.map((item) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
    },
    yAxis: {
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
    },
    series: [
      {
        name: 'SKU实际价格',
        type: 'line',
        data: props.chartData.map((item) => item.procurementCost),
        itemStyle: {
          color: storageAgeColorList[4],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: 'FBA配送费',
        type: 'line',
        data: props.chartData.map((item) => item.amazonFba),
        itemStyle: {
          color: storageAgeColorList[3],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: '打包成本',
        type: 'line',
        data: props.chartData.map((item) => item.packingCost),
        itemStyle: {
          color: storageAgeColorList[2],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: '头程运费',
        type: 'line',
        data: props.chartData.map((item) => item.firstMile),
        itemStyle: {
          color: storageAgeColorList[1],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: '试算毛利',
        type: 'line',
        data: props.chartData.map((item) => item.grossProfit),
        itemStyle: {
          color: storageAgeColorList[0],
        },
        smooth: true,
        symbol: 'none',
      },
    ],
  }
}

// 更新图表
const updateChart = () => {
  if (chartInstance && props.chartData.length > 0) {
    const option = generateChartOption()
    chartInstance.setOption(option, true)
  }
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) {
    return
  }
  chartInstance = echarts.init(chartContainer.value)
  chartObserver = new ResizeObserver(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
  chartObserver.observe(chartContainer.value)
  updateChart()
}

// 监听图表数据变化
watch(
  () => props.chartData,
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartObserver) {
    chartObserver.disconnect()
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style lang="scss" scoped></style>
