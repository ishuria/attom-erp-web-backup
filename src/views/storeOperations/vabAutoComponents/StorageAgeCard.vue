<template>
  <vab-card :class="cardClass" :style="{ height: height }" :title="title">
    <div style="margin-bottom: 15px; text-align: right">
      <el-radio-group v-model="currentMode" size="small" @change="handleModeChange">
        <el-radio-button label="数量" :value="0" />
        <el-radio-button label="占比" :value="1" />
      </el-radio-group>
    </div>
    <el-row>
      <el-col :span="chartSpan">
        <div ref="chartContainer" :style="{ width: '100%', height: chartHeight }"></div>
      </el-col>
      <el-col :span="tableSpan">
        <el-table border :data="tableData" :header-cell-style="headerCellStyle" :max-height="maxHeight" show-summary stripe>
          <el-table-column :label="nameColumn.label" :min-width="nameColumn.minWidth" :prop="nameColumn.prop">
            <template #default="{ row, $index }">
              <span class="table-item" :style="{ '--dot-color': colors[$index] }">
                {{ row[nameColumn.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="currentMode === 0"
            :align="valueColumn.align || 'right'"
            :label="valueColumn.label"
            :min-width="valueColumn.minWidth"
            :prop="valueColumn.prop"
          />
          <el-table-column
            v-if="currentMode === 1"
            :align="valueColumn.align || 'right'"
            :label="valueColumn.label"
            :min-width="valueColumn.minWidth"
            :prop="percentageProp"
          >
            <template #default="{ row }">{{ row[percentageProp] }}%</template>
          </el-table-column>
          <el-table-column
            v-for="(column, index) in additionalColumns"
            :key="index"
            :align="column.align || 'right'"
            :label="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
          >
            <template v-if="column.formatter" #default="{ row }">{{ column.formatter(row) }}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </vab-card>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'StorageAgeCard',
})

interface NameColumn {
  label: string
  prop: string
  minWidth?: number
}

interface ValueColumn {
  label: string
  prop: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}

interface AdditionalColumn {
  label: string
  prop?: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  formatter?: (row: any) => string
}

interface Props {
  title?: string
  height?: string
  chartHeight?: string
  chartSpan?: number
  tableSpan?: number
  maxHeight?: number
  cardClass?: string
  // 数据相关
  chartData: Array<{ name: string; value: number }>
  tableData: any[]
  colors: string[]
  // 表格列配置
  nameColumn: NameColumn
  valueColumn: ValueColumn
  percentageProp?: string
  additionalColumns?: AdditionalColumn[]
  // 图表配置
  symbol?: string
  tooltipTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '库龄',
  height: '400px',
  chartHeight: '322px',
  chartSpan: 9,
  tableSpan: 15,
  maxHeight: 325,
  cardClass: '',
  percentageProp: 'percentage',
  additionalColumns: () => [],
  symbol: '$',
  tooltipTitle: '库龄',
})

const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver

const currentMode = ref<number>(0) // 0: 数量, 1: 占比

const headerCellStyle = (): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center',
  }
}

// 计算总价值（用于计算占比）
const totalValue = computed(() => {
  return props.chartData.reduce((sum, item) => sum + item.value, 0)
})

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) {
    return
  }

  const threshold = 10

  option.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const title = props.tooltipTitle || props.title
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${title}</div>`

        const itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.seriesName}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${currentMode.value === 0 ? props.symbol : ''}${params.value}${currentMode.value === 1 ? '%' : ''}</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
      confine: true,
    },
    grid: {
      top: 10,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['FBA仓'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisLabel: {
        fontSize: '14px',
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1],
    },
    series: props.chartData
      .slice()
      .reverse()
      .map((item, index) => {
        const originalIndex = props.chartData.length - 1 - index
        const percentage = totalValue.value > 0 ? ((item.value / totalValue.value) * 100).toFixed(2) : '0.00'
        return {
          name: item.name,
          type: 'bar',
          stack: '总量',
          data: currentMode.value === 0 ? [item.value] : [Number(percentage)],
          itemStyle: {
            color: props.colors[originalIndex],
          },
          emphasis: {
            focus: 'series',
          },
          label: {
            show: currentMode.value === 1 && Number(percentage) > threshold,
            formatter: (params: any) => `${params.value}%`,
          },
          barWidth: index === props.chartData.length - 1 ? '40%' : undefined,
        }
      }),
  }

  if (currentMode.value === 1) {
    option.value.yAxis.axisLabel = {
      formatter: '{value}%',
    }
  } else {
    option.value.yAxis.axisLabel = {}
  }

  chartInstance?.setOption(option.value)
}

const option = ref<any>({})

// 切换显示模式
const handleModeChange = () => {
  if (!chartInstance) {
    return
  }

  const threshold = 10

  option.value.series.forEach((seriesItem: any, index: number) => {
    const originalIndex = props.chartData.length - 1 - index
    const item = props.chartData[originalIndex]
    const percentage = totalValue.value > 0 ? ((item.value / totalValue.value) * 100).toFixed(2) : '0.00'

    if (currentMode.value === 0) {
      seriesItem.data = [item.value]
      seriesItem.label = {
        show: false,
      }
    } else {
      seriesItem.data = [Number(percentage)]
      seriesItem.label = {
        show: Number(percentage) > threshold,
        formatter: (params: any) => `${params.value}%`,
      }
    }
  })

  if (currentMode.value === 1) {
    option.value.yAxis.axisLabel = {
      formatter: '{value}%',
    }
  } else {
    option.value.yAxis.axisLabel = {}
  }

  // 更新 tooltip formatter
  option.value.tooltip.formatter = (params: any) => {
    const title = props.tooltipTitle || props.title
    let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${title}</div>`

    const itemHtmlStrArr = `<div style="display: flex;align-items:center;">
      ${params.marker}
      <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.seriesName}: </div>
      <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${currentMode.value === 0 ? props.symbol : ''}${params.value}${currentMode.value === 1 ? '%' : ''}</span>
    </div>`

    const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
      ${itemHtmlStrArr}
    </div>`
    return titleHtmlStr + contentHtmlStr
  }

  chartInstance.setOption(option.value, true)
}

// 监听数据变化，更新图表
watch(
  () => [props.chartData, props.colors, props.symbol],
  () => {
    if (chartInstance && props.chartData.length > 0) {
      initChart()
    }
  },
  { deep: true }
)

onMounted(() => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)
    chartObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
    chartObserver.observe(chartContainer.value)
    initChart()
  }
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

<style lang="scss" scoped>
.table-item {
  position: relative;
  padding-left: 15px;

  &::before {
    position: absolute;
    top: 50%;
    left: -5px;
    width: 10px;
    height: 10px;
    content: '';
    background-color: var(--dot-color, gray);
    border-radius: 16px;
    transform: translateY(-50%);
  }
}
</style>
