<template>
        <vab-chart
            :option="option"
        />
</template>
  
<script lang="ts" setup>
  import { useSettingsStore} from '/@/store/modules/settings'

  defineOptions({
    name: 'VabEchaartsChartBar',
  })
  
  const props = defineProps({
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
            barCategoryGap:'1'
        }
    ]
  })
  
  watch(
    theme.value,
    () => {
      option.color = [theme.value.color]
    },
    { immediate: true }
  )
  
  onMounted(() => {
   
  })
  
  onBeforeUnmount(() => {
  })

  </script>

