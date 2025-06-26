<template>
  <vab-card :body-style="{ height: '422px' }" skeleton class="performance-card">
    <template #header>
      绩效历史
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPagePerformanceHistory } from '/@/type/index/frontPage'

defineOptions({
  name: 'PerformanceHistory',
})

const props = defineProps<{
  list: IGetFrontPagePerformanceHistory[]
}>()

const option = reactive<any>({
  legend: {
    bottom: '4%'
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any[]) => {
      // tooltip标题
      let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params[0].name}</div>`

      // tooltip详情内容
      const itemHtmlStrArr = params.map((item) => {
        const name = item.seriesName
        return `<div style="display: flex;align-items:center;">
          ${item.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${name}</div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}${name === '退货率' || name === '退款率' ? '%' : '' }</span>
        </div>`
      })
      const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
        ${itemHtmlStrArr.join('')}
      </div>`
      // 最终html字符串
      const resHtmlStr = titleHtmlStr + contentHtmlStr
      return resHtmlStr
    }
  },
  grid: {
    left: '1%',
    bottom: '15%',
    right: '1%',
    top: '0',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true,
      color: '#86909c'
    },
    axisLabel: {
      color: '#86909c'
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e5e8ef',
        }
      },
      boundaryGap: [0, 0.1]  // 为顶部留出空间
    },
    {
      type: 'value',
      name: '',
      axisLabel: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      boundaryGap: [0, 0.1]  // 为顶部留出空间
    },
  ],
  series: [
    {
      name: '精品',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: 20,
      stack: 'one',
      itemStyle: { color: '#FF6B6B' }, // 珊瑚红
    },
    {
      name: '精铺',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: 20,
      stack: 'one',
      itemStyle: { color: '#FFD93D' }, // 明亮黄
    },
    {
      name: '精铺Vine',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: 20,
      stack: 'one',
      itemStyle: { color: '#6BCB77' }, // 青绿色
    },
    {
      name: '铺货',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: 20,
      stack: 'one',
      itemStyle: { color: '#4D96FF' }, // 天蓝
    },
    {
      name: '提成',
      type: 'line',
      yAxisIndex: 1,
      data: [],
      itemStyle: { color: '#845EC2' }, // 紫色
      lineStyle: {
        width: 2,
      },
      smooth: true,
      symbol: 'none',
      symbolSize: 7,
    },
    {
      name: '新品提成',
      type: 'line',
      yAxisIndex: 1,
      data: [],
      itemStyle: { color: '#FFC75F' }, // 橘黄
      lineStyle: {
        width: 2,
      },
      smooth: true,
      symbol: 'none',
      symbolSize: 7,
    },
    {
      name: '新款采购额',
      type: 'line',
      yAxisIndex: 1,
      data: [],
      itemStyle: { color: '#0081CF' }, // 蓝色
      lineStyle: {
        width: 2,
      },
      smooth: true,
      symbol: 'none',
      symbolSize: 7,
    },
  ],
})

watch(
  () => props.list,
  (newVal) => {
    option.xAxis.data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.month)
    option.series[0].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.jingPinCount)
    option.series[1].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.jingPuCount)
    option.series[2].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.jingPuVineCount)
    option.series[3].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.puHuoCount)
    option.series[4].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.developmentDesign)
    option.series[5].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.newProductCommission)
    option.series[6].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.purchaseAmount)
  }
)
</script>

<style lang="scss" scoped>
.performance-card {
  :deep() {
    .echarts {
      height: 400px !important;
    }
  }


  .bottom {
    padding-top: 20px;
    margin-top: 5px;
    text-align: left;
    border-top: 1px solid var(--el-border-color);
  }
  
  .line-two {
    span {
      color: var(--el-color-success);
    }
  }
  .right-select {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 330px;
    height: 60px;
    line-height: 60px;
    text-align: right;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    gap: 10px; 
  }
}
</style>