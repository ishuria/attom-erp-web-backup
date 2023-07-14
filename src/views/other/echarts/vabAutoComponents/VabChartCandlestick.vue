<!-- K线图 -->
<script lang="ts" setup>
  import { random } from 'lodash-es'

  defineOptions({
    name: 'VabChartCandlestick',
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
    xAxis: {
      data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
    },
    yAxis: {},
    series: {
      type: 'k',
      data: [
        [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
        [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
        [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
        [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      ],
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>

<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card skeleton>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <vab-chart :option="option" />
    </vab-card>
  </el-col>
</template>
