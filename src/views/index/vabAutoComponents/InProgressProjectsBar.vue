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


// const yAxisMax = Math.ceil(props.total / 10) * 10 // 向上取整到10的倍数
// const yAxisInterval = yAxisMax / 2 // 5个刻度间隔，实际显示为：0, interval, 2*interval, ...

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
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.spendTime),
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
    // interval: yAxisInterval,
    splitLine: {
      show: false,
    },
    offset: 7,
    axisTick: { show: false },
    axisLine: { show: true },
  },
  series: [
    {
      barWidth: 14,
      name: 'OEM',
      type: 'bar',
      stack: 'one',
      data: props.data.map((item) => item.oem0Count),
      itemStyle: {
        color: '#91cc75', 
      },
    },
    {
      barWidth: 18,
      name: '非OEM',
      type: 'bar',
      stack: 'one',
      data: props.data.map((item) => item.oem1Count),
      itemStyle: {
        color: '#fac858', 
      },
    }
  ],
})

watch(() => props.data, (newVal) => {
  option.xAxis.data = newVal.map((item) => item.spendTime)
  option.series[0].data = newVal.map((item) => item.oem0Count)
  option.series[1].data = newVal.map((item) => item.oem1Count)
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