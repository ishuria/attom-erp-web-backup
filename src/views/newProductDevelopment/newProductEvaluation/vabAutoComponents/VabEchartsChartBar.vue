<template>
  <vab-chart
    :option="option"
  />
</template>
  
<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabEchartsChartBar',
})
  
const props = defineProps({
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
  xAxis: [
    {   
      show:false,
      type: 'category',
      data: props.xAxisData,
      axisTick: {
        alignWithLabel: false
      },
      axisLabel:{
        show: false
      }
    }
  ],
  yAxis: [
    {
      show:false,
      type: 'value'
    }
  ],
  series: [
    {
      name: '',
      type: 'bar',
      data: props.yAxisData,
      barGap:'10',
      barCategoryGap: '1',
      barMinHeight: 1.5,
      emphasis: {
        itemStyle: {
          opacity: 0.5
        }
      }
    }
  ]
})

watchEffect(() => {
  // 当 props.yAxisData 变化时，更新 option.series[0].data
  option.series[0].data = props.yAxisData;
})

watch(
  theme.value,
  () => {
    option.color = [theme.value.color]
    option.tooltip.borderColor = `${theme.value.color}`
  },
  { immediate: true }
)
</script>

