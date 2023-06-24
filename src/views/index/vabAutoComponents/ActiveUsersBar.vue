<template>
  <div>
    <vab-chart :init-options="initOptions" :option="option" />
    <div class="echarts-mask"></div>
  </div>
</template>

<script lang="ts" setup>
  import VabChart from '/@/plugins/VabChart/index.vue'

  const initOptions = reactive({
    renderer: 'svg',
  })

  const option = reactive({
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
          80,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          50,
        ],
        itemStyle: {
          color: 'var(--el-color-primary)',
        },
      },
    ],
  })
</script>

<style lang="scss" scoped>
  .echarts {
    position: absolute;
    right: 10px;
    bottom: 22px;
    width: calc(100% - 160px) !important;
    height: 60px !important;
  }
  .echarts-mask {
    position: absolute;
    right: 10px;
    bottom: 22px;
    width: calc(100% - 160px) !important;
    height: 60px !important;
    background-color: transparent;
  }
</style>
