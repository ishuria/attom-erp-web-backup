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
    name: 'VabChartTreemap',
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
      bottom: 40,
      left: 40,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: {
      data: [
        _.random(50, 200),
        _.random(50, 200),
        _.random(50, 200),
        _.random(50, 200),
        _.random(50, 200),
        _.random(50, 200),
        _.random(50, 200),
      ],
      type: 'bar',
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      _.random(50, 100),
      _.random(10, 100),
      _.random(10, 100),
      _.random(10, 100),
      _.random(10, 100),
      _.random(50, 100),
      _.random(50, 200),
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
