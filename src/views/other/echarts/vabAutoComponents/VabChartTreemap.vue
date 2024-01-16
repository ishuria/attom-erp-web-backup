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
  name: 'VabChartTreemap',
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
    bottom: 60,
    left: 40,
  },
  tooltip: {
    trigger: 'item',
  },
  series: {
    type: 'treemap',
    data: [
      {
        name: 'nodeA',
        value: random(0, 10),
        children: [
          {
            name: 'nodeAa',
            value: random(0, 10),
          },
          {
            name: 'nodeAb',
            value: random(0, 10),
          },
        ],
      },
    ],
  },
})

watch(
  color,
  () => {
    setTimeout(() => {
      option.color = [color.value]
    }, 200)
  },
  { immediate: true }
)

onActivated(() => {
  timer = setInterval(() => {
    option.series.data = [
      {
        name: 'nodeA',
        value: random(0, 10),
        children: [
          {
            name: 'nodeAa',
            value: random(0, 10),
          },
          {
            name: 'nodeAb',
            value: random(0, 10),
          },
        ],
      },
    ]
  }, 3000)
})

onDeactivated(() => {
  if (timer) clearTimeout(timer)
})
</script>
