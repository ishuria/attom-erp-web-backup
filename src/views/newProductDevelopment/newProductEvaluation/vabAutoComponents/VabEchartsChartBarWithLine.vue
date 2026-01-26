<template>
  <vab-chart :option="option" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabEchartsChartBarWithLine',
})

const props = defineProps({
  xAxisData: {
    type: Array,
    default: () => [],
  },
  yAxisData: {
    type: Array,
    default: () => [],
  },
  priceData: {
    type: Array,
    default: () => [],
  },
  landedPriceData: {
    type: Array,
    default: () => [],
  },
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
  // tooltip: {
  //   trigger: 'axis',
  //   show: true,
  //   confine: true,
  //   formatter: (params: any) => {
  //     let result = ''
  //     params.forEach((item: any) => {
  //       if (item.seriesName === '销量') {
  //         result += `销量: ${item.value}<br/>`
  //       } else if (item.seriesName === '客单价') {
  //         result += `客单价: ${item.value}<br/>`
  //       }
  //     })
  //     return result
  //   },
  //   textStyle: {
  //     fontSize: 14,
  //   },
  //   padding: [5, 10],
  //   borderColor: '#4e88f3',
  // },
  legend: {
    show: false,
  },
  grid: {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
  },
  xAxis: [
    {
      show: false,
      type: 'category',
      data: props.xAxisData,
      axisTick: {
        alignWithLabel: false,
      },
      axisLabel: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      show: false,
      type: 'value',
      name: '销量',
      position: 'left',
    },
    {
      show: false,
      type: 'value',
      name: '价格',
      position: 'right',
    },
  ],
  series: [
    {
      name: '销量',
      type: 'bar',
      data: props.yAxisData,
      barGap: '10',
      barCategoryGap: '1',
      barMinHeight: 1.5,
      yAxisIndex: 0,
      emphasis: {
        itemStyle: {
          opacity: 0.5,
        },
      },
      itemStyle: {
        color: '#409EFF',
      },
    },
    {
      name: '折扣价',
      type: 'line',
      data: props.landedPriceData,
      yAxisIndex: 1,
      smooth: true,
      symbol: 'none',
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
      data: props.priceData,
      yAxisIndex: 1,
      smooth: true,
      symbol: 'none',
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
})

// 监听数据变化
watchEffect(() => {
  option.series[0].data = props.yAxisData
  option.series[2].data = props.priceData
  option.series[1].data = props.landedPriceData
})
</script>
