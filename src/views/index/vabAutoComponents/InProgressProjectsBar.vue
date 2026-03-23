<template>

  <vab-chart :option="option" />

</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import { IGetFrontPageProgressProjectsItem } from '/@/type/index/frontPage'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
// let timer: ReturnType<typeof setInterval>

const props = defineProps<{
  data: IGetFrontPageProgressProjectsItem[]
  total: number
}>()

const option = reactive({
  grid: {
    left: '35px',
    top: '30px',
    right: '10px',
    bottom: '35px',
  },
  tooltip: {
    trigger: 'axis',
    confine: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.spendTime),
  
    name: '已用时间',
    nameLocation: 'center',
    nameGap: 25,
    axisLabel: {
      show: true,
      color: '#333',
      fontSize: 12,
    },
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value',
    minInterval: 1, // 设置最小间隔为1，确保坐标值为整数
    axisLabel: {
      show: true,
      color: '#666',
      fontSize: 12,
      formatter: (val: number) => `${val}个`,
    },
    splitLine: {
      show: false,
    },
    axisTick: { show: false },
    axisLine: { show: false },
  },
  series: [
    {
      barWidth: 14,
      name: 'OEM',
      type: 'bar',
      stack: 'one',
      data: props.data.map((item) => item.oem1Count),
      itemStyle: {
        color: '#67C23A', 
      },
    },
    {
      barWidth: 14,
      name: '非OEM',
      type: 'bar',
      stack: 'one',
      data: props.data.map((item) => item.oem0Count),
      itemStyle: {
        color: '#E6A23C', 
      },
    }
  ],
})

watch(() => props.data, (newVal) => {
  option.xAxis.data = newVal.map((item) => item.spendTime)
  option.series[0].data = newVal.map((item) => item.oem1Count)
  option.series[1].data = newVal.map((item) => item.oem0Count)
})

</script>

<style lang="scss" scoped>
// :deep() {
//   .echarts {
//     position: absolute;
//     // right: 10px;
//     // bottom: 0;
//     // width: calc(100% - 160px) !important;
//     // height: 100% !important;
//     // transform: translateY(-10px);
//   }
// }
</style>