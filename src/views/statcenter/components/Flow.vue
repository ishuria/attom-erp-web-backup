<script lang="ts" setup>
  import _ from 'lodash'
  import { onBeforeRouteLeave } from 'vue-router'
  import VabChart from '/@/plugins/VabChart/index.vue'
  const initOptions = ref({
    renderer: 'svg',
  })
  const option: any = ref({
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
      },
      {
        name: '访客数',
        type: 'line',
        data: [],
        smooth: true,
      },
    ],
  })

  let timer: any
  const updateTime = ref()
  const lineOne0 = ref(_.random(2000, 4000))
  const lineOne1 = ref(_.random(1000, 2000))
  onMounted(() => {
    const base = +new Date(2022, 10, 1)
    const oneDay = 24 * 3600 * 1000
    const date: any = []

    const data0 = [Math.random() * 1500]
    const data1 = [Math.random() * 1500]
    let now: any = new Date(base)
    updateTime.value = now

    const addData = (shift: boolean) => {
      now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
      date.push(now)
      data0.push(_.random(2000, 4000))
      data1.push(_.random(1000, 2000))

      if (shift) {
        date.shift()
        data0.shift()
        data1.shift()
      }
      now = new Date(+new Date(now) + oneDay)
      option.value.xAxis[0].data = []
      option.value.series[0].data = []
      option.value.series[1].data = []
      option.value.xAxis[0].data = date
      option.value.series[0].data = data0
      option.value.series[1].data = data1
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
  <vab-card class="payment" shadow="hover" skeleton>
    <template #header>
      <vab-icon icon="line-chart-line" />
      流量概况
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </template>
    <div class="update-time">
      浏览量/访客数
      <el-button text type="primary">刷新</el-button>
    </div>
    <div class="line-one">{{ lineOne0 }}/{{ lineOne1 }}</div>
    <br />
    <div class="line-two">
      自上周以来
      <vab-icon icon="arrow-up-line" />
      <span>44%</span>
      /
      <vab-icon icon="arrow-up-line" />
      <span>24%</span>
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
  .update-time {
    display: flex;
    align-items: center;
    margin-top: -10px;
    color: #999;
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
