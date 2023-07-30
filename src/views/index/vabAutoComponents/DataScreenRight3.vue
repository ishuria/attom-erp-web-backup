<template>
  <vab-chart :option="option" />
</template>

<script lang="ts" setup>
  import { graphic } from 'echarts/core'
  import { random } from 'lodash-es'

  defineOptions({
    name: 'DataScreenRight3',
  })

  const option = reactive<any>({
    grid: {
      top: '12.5%',
      left: '10%',
      right: '2.5%',
      bottom: '15%',
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
        axisLabel: {
          textStyle: {
            color: '#eee',
          },
        },
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
      },
    ],

    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#00a1ff',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#eee',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '',
        type: 'line',
        smooth: true,
        showAllSymbol: false,
        symbol: 'circle',
        symbolSize: 2,
        lineStyle: {
          normal: {
            color: '#00b3f4',
          },
        },
        itemStyle: {
          color: '#00b3f4',
        },
        tooltip: {
          show: true,
        },
        areaStyle: {
          normal: {
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(0,179,244,0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(0,179,244,0)',
                },
              ],
              false
            ),
            shadowColor: 'rgba(0,179,244, 0.9)',
            shadowBlur: 20,
          },
        },
        data: [
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
          random(100, 2000),
        ],
      },
    ],
  })

  setInterval(() => {
    option.series[0].data = [
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
      random(100, 2000),
    ]
  }, 1000 * 5)
</script>

<style lang="scss" scoped></style>
