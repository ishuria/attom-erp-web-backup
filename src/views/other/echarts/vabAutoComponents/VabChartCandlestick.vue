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
  name: 'VabChartCandlestick',
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
    bottom: 40,
    left: 40,
  },
  tooltip: {
    trigger: 'item',
  },
  xAxis: {
    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
  },
  yAxis: {},
  series: {
    type: 'candlestick',
    data: [
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
    ],
    itemStyle: {
      color: color.value,
      borderColor: color.value,
      color0: '#f2637b',
      borderColor0: '#f2637b',
    },
  },
})

watch(
  color,
  () => {
    option.series.itemStyle.color = color.value
    option.series.itemStyle.borderColor = color.value
  },
  { immediate: true }
)

onActivated(() => {
  timer = setInterval(() => {
    option.series.data = [
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
      [random(50, 100), random(50, 100), random(50, 100), random(50, 100)],
    ]
  }, 3000)
})

onDeactivated(() => {
  if (timer) clearInterval(timer)
})
</script>
