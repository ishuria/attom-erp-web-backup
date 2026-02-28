<template>
  <vab-dialog v-model="visible" title="价格利润散点图" width="60%">
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
        <div ref="chartContainer" style="width: 90%; height: 450px"></div>
      </div>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { getPriceProfitScatter } from '/@/api/devlocal/operationAutoMation'
import { getLast90DaysStringTime } from '/@/utils/dateUtils'

defineOptions({ name: 'PriceProfitScatterChart' })

interface Props {
  sku?: string
  site?: number
}
const props = withDefaults(defineProps<Props>(), { sku: '', site: 0 })
const visible = defineModel({ default: false })

// 时间范围
const dateRange = ref<string[]>(getLast90DaysStringTime())

const dateShortcuts = [
  {
    text: '30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '60天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 59)
      return [start, end]
    },
  },
  {
    text: '180天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 179)
      return [start, end]
    },
  },
  {
    text: '360天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 359)
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
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2020-01-01') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]

const chartContainer = ref<HTMLDivElement | null>(null)
const chartLoading = ref(false)

type ScatterPoint = {
  price: number
  avgProfitPerOrder: number
  dailyAvgVolume: number
}

const points = ref<ScatterPoint[]>([])

let chart: echarts.ECharts | null = null

function calcSymbolSize(dailyAvgVolume: number) {
  // 把日均销量映射到像素：12~50左右（增加最小尺寸便于点击）
  const v = Math.max(0, Number(dailyAvgVolume) || 0)
  return 12 + Math.log10(v + 1) * 15
}

function buildOption(list: ScatterPoint[]): echarts.EChartsOption {
  // 用对象形式 data，方便 tooltip 直接取字段
  const data = list.map((p) => ({
    value: [p.avgProfitPerOrder, p.price, p.dailyAvgVolume], // [x,y,size]
    ...p,
  }))

  return {
    grid: { left: 60, right: 30, top: 30, bottom: 55 },
    tooltip: {
      trigger: 'item',
      confine: true,
      enterable: true,
      hideDelay: 0,
      textStyle: {
        fontSize: 16,
      },
      formatter: (params: any) => {
        const d = params.data as ScatterPoint & { value: number[] }
        const x = d.avgProfitPerOrder ?? d.value?.[0]
        const y = d.price ?? d.value?.[1]
        const s = d.dailyAvgVolume ?? d.value?.[2]
        return `
          价格: ${y}<br/>
          平均订单利润: ${x}<br/>
          日均销量: ${s}<br/>

        `
      },
    },
    xAxis: {
      type: 'value',
      name: '平均订单利润',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: { fontSize: 14 },
      axisLabel: { fontSize: 14 },
      splitLine: { show: true },
    },
    yAxis: {
      type: 'value',
      name: '价格',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: { fontSize: 14 },
      axisLabel: { fontSize: 14 },
      splitLine: { show: true },
    },
    series: [
      {
        type: 'scatter',
        data,
        symbolSize: (val: any) => calcSymbolSize(val[2]),
        cursor: 'pointer',
        zlevel: 1,
        emphasis: {
          scale: true,
          focus: 'self',
        },
      },
    ],
  }
}

function initChart() {
  if (!chartContainer.value) return
  if (chart) chart.dispose()
  chart = echarts.init(chartContainer.value)
  chart.setOption(buildOption(points.value), true)

  window.addEventListener('resize', handleResize)
}

function handleResize() {
  chart?.resize()
}

function renderChart() {
  if (!chart) return
  chart.setOption(buildOption(points.value), true)
}

async function getScatterPoints(params: { sku: string; site: number; startDate: string; endDate: string }) {
  const { data } = await getPriceProfitScatter(params)
  return data as ScatterPoint[]
}

const fetchTrendData = async (startDate: string, endDate: string) => {
  if (!props.sku || props.site == null) {
    points.value = []
    renderChart()
    return
  }
  try {
    chartLoading.value = true
    const data = await getScatterPoints({
      sku: props.sku,
      site: props.site,
      startDate,
      endDate,
    })
    points.value = Array.isArray(data) ? data : []
    renderChart()
  } catch (e) {
    console.error('获取散点图数据失败:', e)
    points.value = []
    renderChart()
  } finally {
    chartLoading.value = false
  }
}

// 日期变化
const handleDateChange = (dates: string[]) => {
  if (dates?.length === 2) {
    fetchTrendData(dates[0], dates[1])
  }
}

// 弹窗打开时初始化 + 拉默认90天
watch(
  () => visible.value,
  async (v) => {
    if (v) {
      await nextTick()
      initChart()
      if (dateRange.value?.length === 2) {
        fetchTrendData(dateRange.value[0], dateRange.value[1])
      }
    } else {
      // 关闭时释放资源（可选）
      chart?.dispose()
      chart = null
      window.removeEventListener('resize', handleResize)
    }
  }
)

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
  window.removeEventListener('resize', handleResize)
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
    display: flex;
    justify-content: center;

    .chart-wrapper {
      height: 500px;
      width: 100%;
    }
  }
}
</style>
