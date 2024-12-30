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
    default: [],
  },
  yAxisData: {
    type: Array,
    default: [],
  },
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
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
      option.series.data = props.yAxisData
      option.xAxis.data = props.xAxisData
      option.color = [theme.value.color]
  },
  { immediate: true },
)

onMounted(async () => {
  await nextTick();
})

onBeforeUnmount(() => {
  
})
</script>