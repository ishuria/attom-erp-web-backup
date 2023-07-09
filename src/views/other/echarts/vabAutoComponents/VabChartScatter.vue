<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card skeleton>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <vab-chart :option="option" theme="vab-echarts-theme" />
    </vab-card>
  </el-col>
</template>
<script lang="ts" setup>
  import _ from 'lodash'

  defineOptions({
    name: 'VabChartScatter',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const option = reactive<any>({
    grid: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40,
    },
    xAxis: {},
    yAxis: {},
    series: {
      symbolSize: 10,
      data: [
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
        [_.random(1, 20), _.random(1, 20)],
      ],
      type: 'scatter',
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
      [_.random(1, 20), _.random(1, 20)],
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
