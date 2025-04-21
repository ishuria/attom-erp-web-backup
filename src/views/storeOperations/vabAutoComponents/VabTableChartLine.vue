<template>
  <vab-chart :option="option" />
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabTableChartLine',
})

let props = defineProps({
  xAxisData: {
    type: Array,
  },
  yAxisData: {
    type: Array,
  },
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    show: true,
    confine: true,
    formatter: '{c}',
    textStyle: {
      fontSize: 14, // 设置字体大小
    },
    padding: [0, 5], // 设置内边距，调整提示框的宽高
    borderColor: '#4e88f3'
  },
  grid: {
    top:1,
    left: 1,
    right: 1,
    bottom: 1
  },
  xAxis: {
    show:false,
    type: 'category',
    data: props.xAxisData,
    axisTick: {
      alignWithLabel: false
    },
    axisLabel:{
      show: false
    }
  },
  yAxis: {
    show: false,
    type: 'value',
    min: 'dataMin',
    boundaryGap: [0, 0.1],
  },
  series: [
    {
      type: 'line',
      data: props.yAxisData,
      symbol: 'none'
    }
  ]
})
watch(
  () => [props.xAxisData,props.yAxisData,theme.value],
  () => {
      option.series[0].data = props.yAxisData
      option.xAxis.data = props.xAxisData
      option.color = [theme.value.color]
  },
  { immediate: true },
)

onMounted(async () => {
  await nextTick();
})

</script>