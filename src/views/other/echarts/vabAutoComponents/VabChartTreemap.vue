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
  let timer: any

  const option = reactive<any>({
    grid: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 40,
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
      })
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
    clearInterval(timer)
  })
</script>
