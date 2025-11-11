<template>
  <vab-card :class="cardClass" :style="{ height: height }" :title="computedTitle">
    <el-row>
      <el-col :span="chartSpan">
        <div ref="chartContainer" :style="{ width: '100%', height: chartHeight }"></div>
      </el-col>
      <el-col :span="tableSpan">
        <el-table border :data="tableData" :header-cell-style="headerCellStyle" :max-height="maxHeight" stripe>
          <el-table-column v-if="fixedLeft" fixed="left" :label="nameColumn.label" :min-width="nameColumn.minWidth" :prop="nameColumn.prop">
            <template #default="{ row, $index }">
              <span class="table-item" :style="{ '--dot-color': colors[$index] }">
                {{ row[nameColumn.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-else :label="nameColumn.label" :min-width="nameColumn.minWidth" :prop="nameColumn.prop">
            <template #default="{ row, $index }">
              <span class="table-item" :style="{ '--dot-color': colors[$index] }">
                {{ row[nameColumn.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(column, index) in valueColumns"
            :key="index"
            :align="column.align || 'right'"
            :label="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
          >
            <template #default="{ row }">
              <template v-if="column.formatter">
                {{ column.formatter(row) }}
              </template>
              <template v-else>
                {{ row[column.prop] }}
              </template>
            </template>
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
  name: 'ExpenseBreakdownCard',
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
  fixedLeft?: boolean
  // 数据相关
  chartData: Array<{ name: string; value: number }>
  tableData: any[]
  colors: string[]
  // 表格列配置
  nameColumn: NameColumn
  valueColumns: ValueColumn[]
  // 图表配置
  totalValue?: number
  totalLabel?: string
  tooltipTitle?: string
  chartTitle?: string
  // 币种符号
  symbol?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: '400px',
  chartHeight: '345px',
  chartSpan: 9,
  tableSpan: 15,
  maxHeight: 325,
  cardClass: '',
  fixedLeft: false,
  totalValue: 0,
  totalLabel: '总支出',
  tooltipTitle: '',
  chartTitle: '',
  symbol: '$',
})

const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver

// 计算实际使用的标题：优先使用 title，如果为空则使用 chartTitle
const computedTitle = computed(() => {
  return props.title || props.chartTitle || ''
})

const headerCellStyle = (): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center',
  }
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) {
    return
  }

  option.value = {
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params: any) => {
        const title = props.tooltipTitle || props.title
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${title}</div>`

        const itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${props.symbol}${params.data.value} (${params.percent}%)</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: props.chartTitle || props.title,
        type: 'pie',
        radius: ['50%', '80%'],
        left: 0,
        right: 0,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: [`{a|${props.symbol}${props.totalValue}}`, `{b|${props.totalLabel}}`].join('\n'),
          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              lineHeight: 28,
            },
            b: {
              color: '#999',
              fontSize: 14,
              lineHeight: 20,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        labelLine: {
          show: false,
        },
        data: props.chartData,
        color: props.colors,
      },
    ],
  }

  chartInstance?.setOption(option.value)
}

const option = ref<any>({})

// 监听数据变化，更新图表
watch(
  () => [props.chartData, props.colors, props.totalValue, props.symbol],
  () => {
    if (chartInstance && props.chartData.length > 0) {
      option.value.series[0].data = props.chartData
      option.value.series[0].color = props.colors
      option.value.series[0].label.formatter = [`{a|${props.symbol}${props.totalValue}}`, `{b|${props.totalLabel}}`].join('\n')
      option.value.tooltip.formatter = (params: any) => {
        const title = props.tooltipTitle || props.title
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${title}</div>`
        const itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${props.symbol}${params.data.value} (${params.percent}%)</span>
        </div>`
        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        return titleHtmlStr + contentHtmlStr
      }
      chartInstance.setOption(option.value)
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
