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

<script lang="ts" setup>
  import { random } from 'lodash-es'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabChartScatter',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)

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

  const timer = setInterval(() => {
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
