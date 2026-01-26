<template>
  <vab-dialog v-model="visible" title="销量趋势详情" width="70%">
    <div class="trend-dialog-content">
      <!-- 时间选择器 -->
      <div class="time-selector">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              :clearable="false"
              end-placeholder="结束日期"
              range-separator="至"
              :shortcuts="dateShortcuts"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 图表区域 -->
      <div class="chart-container">
        <div ref="chartContainer" v-loading="chartLoading" style="width: 100%; height: 350px"></div>
      </div>
    </div>
  </vab-dialog>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { getSaleTrend } from '/@/api/devlocal/operationAutoMation'
import { SaleTrendDataItem } from '/@/type/storeOperation/autoMation'
import { getLast30DaysStringTime } from '/@/utils/dateUtils'

interface Props {
  visible: boolean
  sku?: string
  site?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  sku: '',
  site: 0,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 图表相关
const chartContainer = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const chartLoading = ref<boolean>(false)

// 趋势数据
const trendData = ref<SaleTrendDataItem[]>([])

// 时间范围
const dateRange = ref<string[]>(getLast30DaysStringTime())

// 过滤后的趋势数据（根据时间范围）
const filteredTrendData = computed(() => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    return []
  }

  const startDate = dateRange.value[0]
  const endDate = dateRange.value[1]

  return trendData.value
    .filter((item) => {
      return item.date >= startDate && item.date <= endDate
    })
    .sort((a, b) => a.date.localeCompare(b.date))
})

// X轴数据（基于过滤后的数据生成）
const xAxisData = computed(() => {
  return filteredTrendData.value.map((item) => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
})

// 销量数据
const saleData = computed(() => {
  return filteredTrendData.value.map((item) => item.salesVolume)
})

// 原价数据
const priceData = computed(() => {
  return filteredTrendData.value.map((item) => item.price)
})
// 折后价数据
const landedPriceData = computed(() => {
  return filteredTrendData.value.map((item) => item.landedPrice)
})

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  chartInstance = echarts.init(chartContainer.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  const option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any) => {
        let result = ''
        params.forEach((item: any) => {
          if (item.seriesName === '销量') {
            result += `销量: ${item.value}<br/>`
          } else if (item.seriesName === '原价') {
            result += `原价: ${item.value}<br/>`
          } else if (item.seriesName === '折后价') {
            result += `折后价: ${item.value}<br/>`
          }
        })
        return result
      },
      textStyle: {
        fontSize: 14,
      },
      padding: [5, 10],
      borderColor: '#4e88f3',
    },
    legend: {
      show: false,
    },
    grid: {
      top: 30,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    xAxis: [
      {
        show: true,
        type: 'category',
        data: xAxisData.value,
        axisTick: {
          alignWithLabel: false,
        },
        axisLabel: {
          show: true,
          fontSize: 14,
        },
      },
    ],
    yAxis: [
      {
        show: true,
        type: 'value',
        name: '销量',
        position: 'left',
        nameTextStyle: {
          fontSize: 14,
        },
        axisLabel: {
          fontSize: 14,
        },
      },
      {
        show: true,
        type: 'value',
        name: '价格',
        position: 'right',
        nameTextStyle: {
          fontSize: 14,
        },
        axisLabel: {
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: '销量',
        type: 'bar',
        data: saleData.value,
        barGap: '10',
        barCategoryGap: '20%',
        barMinHeight: 1.5,
        yAxisIndex: 0,
        itemStyle: {
          color: '#409EFF',
        },
        emphasis: {
          itemStyle: {
            opacity: 0.8,
          },
        },
      },
      {
        name: '折后价',
        type: 'line',
        data: landedPriceData.value,
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#67C23A',
          width: 2,
        },
        itemStyle: {
          color: '#67C23A',
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '原价',
        type: 'line',
        data: priceData.value,
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#F56C6C',
          width: 2,
        },
        itemStyle: {
          color: '#F56C6C',
        },
        emphasis: {
          focus: '#F56C6C',
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 日期快捷选项
const dateShortcuts = [
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6)
      return [start, end]
    },
  },
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 89)
      return [start, end]
    },
  },
]

// 获取趋势数据的函数
const fetchTrendData = async (startDate: string, endDate: string) => {
  try {
    chartLoading.value = true
    const { data } = await getSaleTrend({
      sku: props.sku,
      site: props.site,
      startDate,
      endDate,
    })

    if (data) {
      trendData.value = data
    } else {
      trendData.value = []
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    trendData.value = []
  } finally {
    chartLoading.value = false
  }
}

// 处理日期变化
const handleDateChange = (dates: string[]) => {
  if (dates && dates.length === 2) {
    const [startDate, endDate] = dates
    fetchTrendData(startDate, endDate)
  }
}

// 监听弹窗显示状态
watch(visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时获取数据并初始化图表
    fetchTrendData(dateRange.value[0], dateRange.value[1])

    nextTick(() => {
      initChart()
    })
  } else {
    // 弹窗关闭时销毁图表
    destroyChart()
  }
})

// 监听数据变化
watch(
  [filteredTrendData],
  () => {
    if (visible.value) {
      nextTick(() => {
        updateChart()
      })
    }
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  destroyChart()
})
</script>

<style lang="scss" scoped>
.trend-dialog-content {
  .time-selector {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: center;
  }

  .chart-container {
    .chart-wrapper {
      height: 400px;
      width: 100%;
    }
  }
}
</style>
