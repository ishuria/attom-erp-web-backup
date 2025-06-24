<template>

  <vab-chart :option="option" />

</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const props = defineProps<{
  percentage: number
}>()
// const per = ref<number>(0)
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
          value: 0,
          name: '考核完成数',
          itemStyle: {
            color: '#409EFF', // 进度颜色
          },
        },
        {
          value: 100,
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
  () => props.percentage,
  (val) => {
    option.series[0].data = [
      {
        value: val,
        name: '考核完成数',
        itemStyle: {
          color: '#409EFF',
        },
      },
      {
        value: 100 - val,
        name: '',
        itemStyle: {
          color: '#e0e0e0',
        },
      },
    ];
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