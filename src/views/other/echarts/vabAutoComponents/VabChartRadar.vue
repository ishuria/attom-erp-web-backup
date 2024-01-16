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
  name: 'VabChartRadar',
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
  radar: {
    indicator: [{ name: '销售' }, { name: '管理' }, { name: '信息技术' }, { name: '客服' }, { name: '研发' }],
  },
  series: {
    name: '预算分配',
    type: 'radar',
    data: [
      {
        value: [random(50, 1000), random(50, 1000), random(50, 1000), random(50, 1000), random(50, 1000)],
        name: '预算分配',
      },
    ],
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
      {
        value: [random(50, 1000), random(50, 1000), random(50, 1000), random(50, 1000), random(50, 1000)],
        name: '预算分配',
      },
    ]
  }, 3000)
})

onDeactivated(() => {
  if (timer) clearInterval(timer)
})
</script>
