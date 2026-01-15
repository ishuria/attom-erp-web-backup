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
  lineData: {
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
      name: '客单价',
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
    },
    {
      name: '客单价',
      type: 'line',
      data: props.lineData,
      yAxisIndex: 1,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#ff4d4f',
        width: 2,
      },
      itemStyle: {
        color: '#ff4d4f',
      },
      emphasis: {
        focus: 'series',
      },
    },
  ],
})

// 监听数据变化
watchEffect(() => {
  option.series[0].data = props.yAxisData
  option.series[1].data = props.lineData
})

watch(
  theme.value,
  () => {
    option.color = [theme.value.color, '#ff4d4f']
  },
  { immediate: true }
)
</script>
