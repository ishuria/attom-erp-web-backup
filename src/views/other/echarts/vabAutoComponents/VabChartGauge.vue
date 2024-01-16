<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card :body-style="{ height: '240px' }" skeleton>
      <template #header>{{ title }}</template>
      <vab-chart :option="option" />
    </vab-card>
  </el-col>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabChartGauge',
})

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const settingsStore = useSettingsStore()
const { color } = storeToRefs(settingsStore)
let timer: any = null

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
        value: random(0, 100),
        name: 'SCORE',
      },
    ],
  },
})

watch(
  color,
  () => {
    option.color = color.value
  },
  { immediate: true }
)

onActivated(() => {
  timer = setInterval(() => {
    option.series.data = [
      {
        value: random(0, 100),
        name: 'SCORE',
      },
    ]
  }, 3000)
})

onDeactivated(() => {
  if (timer) clearInterval(timer)
})
</script>
