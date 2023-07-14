<template>
  <div>
    <vab-chart :option="option" />
  </div>
</template>

<script lang="ts" setup>
  import { random } from 'lodash-es'
  import { useSettingsStore } from '/@/store/modules/settings'

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)

  const option = reactive<any>({
    grid: {
      left: '10%',
      top: 0,
      right: '10%',
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00'],
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      {
        barWidth: 18,
        name: '',
        type: 'bar',
        data: [
          random(50, 100),
          random(10, 100),
          random(10, 100),
          random(10, 100),
          random(10, 100),
          random(50, 100),
        ],
        itemStyle: {
          color,
        },
      },
    ],
  })

  let timer: any
  onMounted(() => {
    timer = setInterval(() => {
      option.series[0].data = [
        random(50, 100),
        random(10, 100),
        random(10, 100),
        random(10, 100),
        random(10, 100),
        random(50, 100),
      ]
    }, 3000)
  })

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>

<style lang="scss" scoped>
  :deep() {
    .echarts {
      position: absolute;
      right: 10px;
      bottom: 22px;
      width: calc(100% - 160px) !important;
      height: 60px !important;
    }
  }
</style>
