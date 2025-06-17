<template>
  <vab-card :body-style="{ height: '422px' }" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      {{ title }}
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineProps<{
  title: string
}>()

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    extraCssText: 'z-index:1',
  },
  grid: {
    top: '0%',
    left: '2%',
    right: '20%',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: [
    {
      splitLine: {
        show: false,
      },
      type: 'value',
      show: false,
    },
  ],
  yAxis: [
    {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      type: 'category',
      axisTick: {
        show: false,
      },
      data: [],
    },
  ],
  series: [
    {
      name: '累计消费',
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'right',
        fontSize: 12,
        formatter: ({ data }: any) => {
          return `${data}万元`
        },
      },
      itemStyle: {
        borderRadius: 10,
        borderWidth: 2,
      },
      data: [],
    },
  ],
})

watch(
  theme.value,
  () => {
    option.color = [theme.value.color]
  },
  { immediate: true }
)
</script>