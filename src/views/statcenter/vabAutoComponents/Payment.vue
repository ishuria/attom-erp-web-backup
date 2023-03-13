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
        name: '金额',
        type: 'line',
        data: [],
        smooth: true,
      },
    ],
  })

  let timer: any
  const updateTime = ref()
  const lineOne = ref(_.random(2000, 4000))

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
      option.value.xAxis[0].data = []
      option.value.series[0].data = []
      option.value.xAxis[0].data = date
      option.value.series[0].data = data
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
      实时支付金额
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </template>
    <div class="update-time">
      更新时间：{{ updateTime }}
      <el-button text type="primary">刷新</el-button>
    </div>
    <div class="line-one">{{ lineOne }}.00 RMB</div>
    <br />
    <div class="extra-text">较前一日：-</div>
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
</style>
