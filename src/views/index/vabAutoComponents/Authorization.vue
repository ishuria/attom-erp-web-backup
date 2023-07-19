<template>
  <vab-card class="authorization" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      授权数
      <el-tag class="card-header-tag" type="warning">周</el-tag>
    </template>
    <vab-chart :option="option" />
    <div class="bottom">
      <span>
        授权数:
        <vab-count
          :decimals="countConfig.decimals"
          :duration="countConfig.duration"
          :end-val="countConfig.endVal"
          :prefix="countConfig.prefix"
          :separator="countConfig.separator"
          :start-val="countConfig.startVal"
          :suffix="countConfig.suffix"
        />
        <el-tag class="card-footer-tag" type="success">倒计时 {{ n }}s</el-tag>
      </span>
    </div>
  </vab-card>
</template>

<script lang="ts" setup>
  import { pull, random, sample } from 'lodash-es'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'Authorization',
  })

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)
  const timer = ref<any>()
  const n = ref<number>(5)
  const countConfig = reactive<any>({
    startVal: 0,
    endVal: random(1000, 20000),
    decimals: 0,
    prefix: '',
    suffix: '',
    separator: ',',
    duration: 8000,
  })
  const option = reactive<any>({
    tooltip: {
      trigger: 'axis',
      extraCssText: 'z-index:1',
    },
    grid: {
      top: '5%',
      left: '2%',
      right: '4%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '授权数',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 20, 33, 39, 33, 22],
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          color,
        },
      },
    ],
  })

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer.value)
    next()
  })

  onMounted(() => {
    timer.value = setInterval(() => {
      if (n.value > 0) {
        n.value--
      } else {
        option.series[0].type = sample(
          pull(['bar', 'line', 'scatter'], option.series[0].type)
        )
        n.value = 5
      }
    }, 1000)
  })
</script>

<style lang="scss" scoped>
  :deep() {
    .echarts {
      height: 140px !important;
    }
  }

  .bottom {
    padding-top: 20px;
    margin-top: 5px;
    text-align: left;
    border-top: 1px solid var(--el-border-color);
  }
</style>
