<script lang="ts" setup>
  import _ from 'lodash'
  import VabChart from '/@/plugins/VabChart/index.vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import { useSettingsStore } from '/@/store/modules/settings'

  const settingsStore: any = useSettingsStore()
  const { color }: any = storeToRefs(settingsStore)

  const initOptions = reactive<any>({
    renderer: 'svg',
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
  <vab-card class="Develop" shadow="never">
    <template #header>
      <vab-icon icon="line-chart-line" />
      流量概况
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </template>
    <div class="line-two">
      自上周以来
      <vab-icon icon="arrow-up-line" />
      <span>44%</span>
    </div>
    <vab-chart
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"
    />
  </vab-card>
</template>

<style lang="scss">
  .echarts {
    width: 100%;
    height: 220px;
  }

  .line-two {
    margin: 10px 0 10px 0;

    .ri-arrow-up-line {
      width: 18px;
      height: 18px;
      margin: 0 3px 0 2px;
      color: var(--el-color-success);
      vertical-align: -3px !important;
      background: var(--el-color-success-light);
      border-radius: 50%;
      transform: scale(0.8);
    }

    span {
      color: var(--el-color-success);
    }
  }
</style>
