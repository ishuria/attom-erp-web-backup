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
    name: 'VabChartBar',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)
  let timer: any

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
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
      ],
      type: 'bar',
    },
  })

  watch(
    color,
    () => {
      option.color = [color.value]
    },
    { immediate: true }
  )

  onActivated(() => {
    timer = setInterval(() => {
      option.series.data = [
        random(50, 100),
        random(10, 100),
        random(10, 100),
        random(10, 100),
        random(10, 100),
        random(50, 100),
        random(50, 200),
      ]
    }, 3000)
  })

  onDeactivated(() => {
    clearInterval(timer)
  })
</script>
