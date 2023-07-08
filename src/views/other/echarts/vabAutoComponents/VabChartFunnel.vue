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
    name: 'VabChartFunnel',
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
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: {
      name: '漏斗图',
      type: 'funnel',
      left: '20%',
      top: 20,
      bottom: 20,
      width: '60%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
      },
      emphasis: {
        label: {
          fontSize: 12,
        },
      },
      data: [
        { value: _.random(0, 100), name: '访问' },
        { value: _.random(20, 100), name: '咨询' },
        { value: _.random(40, 100), name: '订单' },
        { value: _.random(60, 100), name: '点击' },
        { value: _.random(80, 100), name: '展现' },
      ],
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      { value: _.random(0, 100), name: '访问' },
      { value: _.random(20, 100), name: '咨询' },
      { value: _.random(40, 100), name: '订单' },
      { value: _.random(60, 100), name: '点击' },
      { value: _.random(80, 100), name: '展现' },
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
