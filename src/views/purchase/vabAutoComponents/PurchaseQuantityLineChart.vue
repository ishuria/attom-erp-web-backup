<template>
  <vab-dialog v-model="visible" title="统计采购量" width="70%">
    <div class="trend-dialog-content">
      <!-- 筛选条件 -->
      <div class="filter-bar">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="localDate"
              :clearable="false"
              :disabled-date="(time: Date) => time.getTime() > Date.now()"
              type="daterange"
              @change="fetchTrendData"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="siteAgg" :false-value="0" :true-value="1" @change="fetchTrendData">站点聚合</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="skuAgg" :false-value="0" :true-value="1" @change="handleSkuAggChange">合并SKU</el-checkbox>
          </el-form-item>
          <el-form-item label="SKU">
            <el-select
              v-model="selectedSkuList"
              filterable
              :loading="skuLoading"
              multiple
              placeholder="请搜索添加SKU"
              remote
              :remote-method="remoteMethod"
              remote-show-suffix
              reserve-keyword
              style="width: 400px"
              @change="fetchTrendData"
            >
              <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 图表区域 -->
      <div class="chart-container">
        <div ref="chartRef" v-loading="chartLoading" style="width: 100%; height: 600px"></div>
      </div>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { formatLocalDate } from '~/src/utils/dateUtils'
import { getPoSkuList, getSkuMonthlyTrend } from '/@/api/devlocal/purchasePo'
import { IGetPurchaseStatisticsSkuItem } from '/@/type/purchase/statistics'

defineOptions({
  name: 'PurchaseQuantityLineChart',
})

const visible = defineModel('visible', { default: false, required: true })
const date = defineModel<[string, string]>('date', { required: true })

const props = defineProps<{
  selectedRows: IGetPurchaseStatisticsSkuItem[]
  siteList: { id: number; label: string }[]
  siteAgg: number
}>()

const chartLoading = ref<boolean>(false)
const skuLoading = ref<boolean>(false)
const skuOptions = ref<{ value: string; label: string }[]>([])
const selectedSkuList = ref<string[]>([])
const localDate = ref<[string, string]>(['', ''])
const siteAgg = ref<number>(1)
const skuAgg = ref<number>(0)
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 原始趋势数据缓存（用于前端合并）
let rawTrendList: Array<{
  legendKey: string
  sku: string
  siteId?: number
  siteName?: string
  purchaseCountList: number[]
}> = []
let rawXAxisData: string[] = []

// 监听弹窗打开
watch(visible, (val) => {
  if (val) {
    // 初始化数据
    localDate.value = [...date.value]
    siteAgg.value = props.siteAgg
    skuAgg.value = 0
    // 从选中行提取SKU（去重）
    selectedSkuList.value = [...new Set(props.selectedRows.map((row) => row.sku))]
    // 初始化SKU选项
    skuOptions.value = selectedSkuList.value.map((sku) => ({ value: sku, label: sku }))
    // 获取趋势数据
    fetchTrendData()
  }
})

// 搜索SKU
const remoteMethod = async (query: string) => {
  query = query.trim()
  if (query) {
    skuLoading.value = true
    try {
      const { data } = await getPoSkuList({ sku: query })
      const searchResults = data.map((item: string) => ({ value: item, label: item }))
      // 合并已选中的SKU和搜索结果
      const existingValues = new Set(skuOptions.value.map((o) => o.value))
      for (const item of searchResults) {
        if (!existingValues.has(item.value)) {
          skuOptions.value.push(item)
        }
      }
    } catch (error) {
      console.error('搜索SKU失败:', error)
    } finally {
      skuLoading.value = false
    }
  }
}

// 处理SKU合并选项变化
const handleSkuAggChange = () => {
  if (rawTrendList.length > 0 && rawXAxisData.length > 0) {
    renderChart(rawXAxisData, rawTrendList)
  }
}

// 获取趋势数据
const fetchTrendData = async () => {
  if (selectedSkuList.value.length === 0) {
    // 清空图表
    if (chart) {
      chart.clear()
    }
    rawTrendList = []
    rawXAxisData = []
    return
  }

  chartLoading.value = true
  try {
    // 统一使用skuList（去重），后端根据siteAgg决定是否按站点分开
   

    const { data } = await getSkuMonthlyTrend({
      skuList: [...new Set(selectedSkuList.value)],
      startDate: formatLocalDate(localDate.value[0]),
      endDate: formatLocalDate(localDate.value[1]),
      siteAgg: siteAgg.value,
    })
    // 缓存原始数据
    rawXAxisData = data.xAxisData
    rawTrendList = data.trendList
    // 渲染图表
    renderChart(rawXAxisData, rawTrendList)
  } catch (error) {
    console.error('获取趋势数据失败:', error)
  } finally {
    chartLoading.value = false
  }
}

// 渲染图表
const renderChart = (xAxisData: string[], trendList: Array<{
  legendKey: string
  sku: string
  siteId?: number
  siteName?: string
  purchaseCountList: number[]
}>) => {
  if (!chartRef.value) return

  if (chart) {
    chart.dispose()
  }

  chart = echarts.init(chartRef.value)

  // 生成系列数据
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#00D09E', '#9B59B6', '#3498DB']

  let finalTrendList = trendList

  // 如果合并SKU，将所有趋势数据合并成一条
  if (skuAgg.value === 1 && trendList.length > 1) {
    // 找到最长的purchaseCountList长度
    const maxLen = Math.max(...trendList.map((t) => t.purchaseCountList.length))
    // 合并所有采购量数据（按月份相加）
    const mergedPurchaseCountList: number[] = []
    for (let i = 0; i < maxLen; i++) {
      const sum = trendList.reduce((acc, t) => acc + (t.purchaseCountList[i] || 0), 0)
      mergedPurchaseCountList.push(sum)
    }
    // 生成合并后的SKU列表显示（显示所有SKU名称）
    const skuNames = [...new Set(trendList.map((t) => t.sku))]
    finalTrendList = [
      {
        legendKey: `合并: ${skuNames.join(' & ')}`,
        sku: 'merged',
        purchaseCountList: mergedPurchaseCountList,
      },
    ]
  }

  const series = finalTrendList.map((item, index) => ({
    name: item.legendKey,
    type: 'line',
    data: item.purchaseCountList,
    smooth: true,
    itemStyle: {
      color: colors[index % colors.length],
    },
    // 添加平均值线
    markLine: {
      silent: true,
      symbol: 'none',
      label: {
        position: 'end',
        formatter: (params: any) => `平均: ${params.value?.toFixed(1) || params.value}`,
      },
      lineStyle: {
        type: 'dashed',
        color: colors[index % colors.length],
        width: 1,
      },
      data: [
        {
          type: 'average',
          name: '平均值',
        },
      ],
    },
  }))

  const legendData = finalTrendList.map((item) => item.legendKey)

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: legendData,
      top: 10,
      orient: 'horizontal',
      itemWidth: 25,
      itemHeight: 14,
      itemGap: 10,
    },
    grid: {
      top: 100,
      right: 50,
      bottom: 60,
      left: 80,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '采购套数',
    },
    series,
  }

  chart.setOption(option)
}
</script>

<style lang="scss" scoped>
.trend-dialog-content {
  .filter-bar {
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .chart-container {
    display: flex;
    justify-content: center;
  }
}
</style>
