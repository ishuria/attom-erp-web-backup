<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card shadow="hover" skeleton>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <vab-chart
        :init-options="initOptions"
        :option="option"
        theme="vab-echarts-theme"
      />
    </vab-card>
  </el-col>
</template>
<script lang="ts" setup>
  import _ from 'lodash'

  defineOptions({
    name: 'VabChartGauge',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const initOptions = reactive<any>({
    renderer: 'svg',
  })

  const option = reactive<any>({
    grid: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: {
      name: 'Pressure',
      type: 'gauge',
      radius: '100%',
      progress: {
        show: true,
      },
      detail: {
        formatter: '{value}',
        valueAnimation: true,
        fontSize: 14,
        offsetCenter: [0, '70%'],
      },
      data: [
        {
          value: _.random(0, 100),
          name: 'SCORE',
        },
      ],
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      {
        value: _.random(0, 100),
        name: 'SCORE',
      },
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
