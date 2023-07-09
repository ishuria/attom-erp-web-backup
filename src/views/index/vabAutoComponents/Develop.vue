<script lang="ts" setup>
  import _ from 'lodash'
  import VabChart from '/@/plugins/VabChart/index.vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import { useSettingsStore } from '/@/store/modules/settings'

  const settingsStore: any = useSettingsStore()
  const { color }: any = storeToRefs(settingsStore)

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
        boundaryGap: false,
        data: [],
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
        name: '浏览量',
        type: 'line',
        data: [],
        smooth: true,
        areaStyle: {},
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
          color: new VabChart.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#74df9f' },
            { offset: 1, color },
          ]),
        },
      },
    ],
  })

  let timer: any
  const updateTime = ref<any>()
  onMounted(() => {
    const base = +new Date(2022, 10, 1)
    const oneDay = 24 * 3600 * 1000
    const date: any = []

    const data = [Math.random() * 1500]
    let now: any = new Date(base)
    updateTime.value = now

    const addData = (shift: boolean) => {
      now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
      date.push(now)
      data.push(_.random(2000, 4000))

      if (shift) {
        date.shift()
        data.shift()
      }
      now = new Date(+new Date(now) + oneDay)
      option.xAxis[0].data = []
      option.series[0].data = []
      option.xAxis[0].data = date
      option.series[0].data = data
    }

    for (let i = 1; i < 6; i++) {
      addData(false)
    }

    timer = setInterval(() => {
      addData(true)
    }, 5000)
  })

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>

<template>
  <vab-card class="Develop">
    <template #header>
      <vab-icon icon="line-chart-line" />
      流量概况
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </template>

    <vab-chart :option="option" theme="vab-echarts-theme" />
    <div class="bottom">
      <div class="line-two">
        自上周以来
        <span>提升 44%</span>
      </div>
    </div>
  </vab-card>
</template>

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
    border-top: 1px solid $base-border-color;
  }
  .line-two {
    span {
      color: var(--el-color-success);
    }
  }
</style>
