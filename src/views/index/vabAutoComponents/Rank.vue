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
  showCommission?: boolean // 是否显示提成信息
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
    right: props.showCommission ? '35%' : '20%',
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
            fontSize: 20,
            color: '#FFD700',
            padding: [-5, 5, 0, 0],
          },
          name: {
            fontSize: 12,
            color: '#333',
          },
          exempt: {
            fontSize: 14,
            color: '#67C23A',
            backgroundColor: '#F0F9FF',
            border: '1px solid #67C23A',
            borderRadius: 4,
            padding: [2, 4, 2, 4],
            margin: [0, 0, 0, 4],
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
        fontSize: 14,
        formatter: (params: any) => {
          const value = params.value
          if (props.showCommission && params.dataIndex !== undefined) {
            const item = props.list[params.dataIndex]
            if (item?.commissionPercent !== undefined && item.commissionPercent !== null) {
              // 限制不小于0，最小是 +0%
              const commissionPercent = Math.max(0, item.commissionPercent)
              // 正数增加+号
              let displayPercent = commissionPercent > 0 ? `+${commissionPercent}` : '+0'
              if (item.noAssessment !== null && item.noAssessment === 1) {
                displayPercent = '+0'
              }
              return `${value} {commission|(提成 ${displayPercent}%)}`
            }
          }
          return value
        },
        rich: {
          commission: {
            fontSize: 14,
            color: '#389E0D',
            padding: [0, 0, 0, 4],
            fontWeight: 'bold',
          },
        },
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

        // 筛选出符合奖牌条件的项目（排除免除考核的），并按排名排序
        const eligibleItems = newVal
          .filter((item: IRankItem) => item.value > 0 && (item.noAssessment === 0 || item.noAssessment == null))
          .sort((a, b) => b.value - a.value) // 按value降序排序

        // 如果当前项目符合奖牌条件
        if (newVal[index].value > 0 && (newVal[index].noAssessment === 0 || newVal[index].noAssessment == null)) {
          // 计算在符合条件项目中的排名
          const eligibleIndex = eligibleItems.findIndex((item) => item.name === newVal[index].name)
          if (eligibleIndex >= 0 && eligibleIndex < 3) {
            const medalIcons = ['🥇', '🥈', '🥉'] // 正序：金牌、银牌、铜牌
            return `{medal|${medalIcons[eligibleIndex]}} {name|${value}}`
          }
        }

        // 免去考核标识
        if (newVal[index].noAssessment === 1) {
          return `{name|${value}} {exempt|免}`
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
