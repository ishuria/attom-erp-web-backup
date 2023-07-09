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
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabChartLine',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const settingsStore: any = useSettingsStore()
  const { color }: any = storeToRefs(settingsStore)

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
        _.random(50, 100),
        _.random(10, 100),
        _.random(10, 100),
        _.random(10, 100),
        _.random(10, 100),
        _.random(50, 100),
        _.random(50, 200),
      ],
      type: 'line',
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

  watch(
    color,
    () => {
      option.color = [color.value]
    },
    { immediate: true }
  )

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
