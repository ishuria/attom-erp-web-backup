<template>

  <vab-chart :option="option" />

</template>

<script lang="ts" setup>
import { graphic } from 'echarts/core'
import { useSettingsStore } from '/@/store/modules/settings'
import { lightenColor } from '/@/utils/lightenColor'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const props = defineProps<{
  percentage: number
}>()

const option = reactive<any>({
  // grid: {
  //   left: '20px',
  //   top: '5px',
  //   right: '20px',
  //   bottom: 0,
  // },
  // legend: {
  //   show: false,
  // },
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{d}%',
    padding: [0, 5], 
  },
  series: [
    {
      type: 'pie',
      radius: ['80%', '100%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: () => `${props.percentage}%`,
        fontSize: 20,
        color: '#000',
      },
      emphasis: {
        scale: false
      },
      data: [
        {
          value: props.percentage,
          name: '考核完成数',
          itemStyle: {
            color: '#0052d9', // 进度颜色
          },
        },
        {
          value: 100 - props.percentage,
          name: '',
          itemStyle: {
            color: '#e0e0e0', // 背景圆环颜色
          },
        },
      ],
    },
  ],
})

watch(
  () => theme.value.color,
  (newColor) => {
    option.series[0].data[0].itemStyle = {
      color: new graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: lightenColor(newColor, 20) },
        { offset: 1, color: newColor },
      ])
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
// :deep() {
//   .echarts {
//     position: absolute;
//     right: 10px;
//     // bottom: 22px;
//     width: calc(100% - 160px) !important;
//     height: 100% !important;
//   }
// }
</style>