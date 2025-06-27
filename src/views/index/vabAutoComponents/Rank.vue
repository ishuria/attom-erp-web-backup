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
import { IRankItem } from '/@/type/index/frontPage'

const props = defineProps<{
  title: string
  list: IRankItem[]
  name: string
  myName: string
}>()

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
      name: props.name,
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'right',
        fontSize: 12,
      },
      itemStyle: {
        borderRadius: 10,
        borderWidth: 2,
          color: (params: any) => {
          return params.name === props.myName ? '#67C23A' : '#409EFF'
        },
      },
      data: [],
    },
  ],
})

watch(
  () => props.list,
  (newVal) => {
    option.yAxis[0].data = newVal.map((item: IRankItem) => item.name)
    option.series[0].data = newVal.map((item: IRankItem) => item.value)
  }
)
</script>