<template>
  <vab-card :body-style="{ height: '422px' }" class="rank-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      {{ title }}
      <div class="right-select">
        <slot name="select"></slot>
      </div>
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
  showMedal?: boolean // 是否显示奖牌图标
}>()

const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    extraCssText: 'z-index:1',
    confine: true,
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
      axisLabel: {
        formatter: (value: string, index: number) => {
          return value
        },
        rich: {
          medal: {
            fontSize: 18,
            color: '#FFD700',
            padding: [-5, 5, 0, 0],
          },
          name: {
            fontSize: 12,
            color: '#333',
          },
        },
      },
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

    // 更新奖牌显示
    if (props.showMedal) {
      option.yAxis[0].axisLabel.formatter = (value: string, index: number) => {
        const totalCount = newVal.length

        if (
          index >= totalCount - 3 &&
          newVal[index].value >= 3 &&
          newVal[index].assessmentNumberFinish &&
          newVal[index].assessmentNumberFinish >= 5
        ) {
          const medalIcons = ['🥉', '🥈', '🥇'] // 倒序：铜牌、银牌、金牌
          const medalIndex = index - (totalCount - 3)
          return `{medal|${medalIcons[medalIndex]}} {name|${value}}`
        }
        return value
      }
    } else {
      option.yAxis[0].axisLabel.formatter = (value: string, index: number) => {
        return value
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.rank-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;

    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
}
</style>
