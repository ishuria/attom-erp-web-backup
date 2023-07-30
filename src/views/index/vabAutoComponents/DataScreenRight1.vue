<template>
  <vab-chart :option="option" />
</template>

<script lang="ts" setup>
  import { random } from 'lodash-es'

  defineOptions({
    name: 'DataScreenRight1',
  })

  const option = reactive<any>({
    grid: {
      left: '0',
      right: '0',
      bottom: '20px',
      top: '40px',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#00a1ff',
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#eee',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#eee',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#00a1ff',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: {
      symbolSize: 10,
      data: [
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
        [random(1, 20), random(1, 20)],
      ],
      type: 'scatter',
    },
  })

  setInterval(() => {
    option.series.data = [
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
      [random(1, 20), random(1, 20)],
    ]
  }, 1000 * 5)
</script>
