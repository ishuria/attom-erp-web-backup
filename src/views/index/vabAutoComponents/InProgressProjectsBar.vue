<template>

    <vab-chart :option="option" />

</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
// let timer: ReturnType<typeof setInterval>

const option = reactive({
  grid: {
    left: '40px',
    top: '30px',
    right: '10px',
    bottom: '35px',
  },
  tooltip: {
    trigger: 'axis',
    confine: true,
    // formatter: '{d}%'
  },
  // dataZoom: {
  //   show: false,
  //   start: 0,
  //   end: 100
  // },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    boundaryGap: false,
    name: '已用时间',
    nameLocation: 'center',
    nameGap: 25,
    axisLabel: {
      show: true,
      color: '#333',
      fontSize: 12,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      show: true,
      color: '#666',
      fontSize: 12,
      formatter: (val: number) => `${val}个`,
    },
    splitLine: {
      show: false,
    },
    offset: 6,
    axisTick: { show: false },
    axisLine: { show: false },
  },
  series: [
    {
      barWidth: 14,
      name: 'OEM',
      type: 'bar',
      stack: 'one',
      data: [1, 2, 3, 1, 1, 1],
      itemStyle: {
        color: '#91cc75', 
      },
    },
    {
      barWidth: 18,
      name: '非OEM',
      type: 'bar',
      stack: 'one',
      data: [2, 2, 2, 1, 1, 1],
      itemStyle: {
        color: '#fac858', 
      },
    }
  ],
})


</script>

<style lang="scss" scoped>
// :deep() {
//   .echarts {
//     position: absolute;
//     // right: 10px;
//     // bottom: 22px;
//     width: calc(100% - 160px) !important;
//     height: 100% !important;
//   }
// }
</style>