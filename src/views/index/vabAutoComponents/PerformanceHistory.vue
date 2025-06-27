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
    backgroundColor: 'rgba(238, 246, 253, 0.7)',
    borderWidth: 0,
    confine: true,
    formatter: (params: any[]) => {
      let titleHtmlStr = `<div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px;">${params[0].name}</div>`

      // 需要聚合的 series 名称
      const groupedNames = ['精品', '精铺', '精铺Vine', '铺货']
      let groupTotal = 0
      let groupItems: any[] = []
      let otherItems: any[] = []

      params.forEach(item => {
        if (groupedNames.includes(item.seriesName)) {
          groupTotal += Number(item.value || 0)
          groupItems.push(item)
        } else {
          otherItems.push(item)
        }
      })

      const groupHtml = `
        <div style="background: #fff; padding: 3px 8px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; justify-content: space-between; color: #333; font-size: 13px">
            <div style="display: flex; align-items: center;">
              <span style="
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #21cbfe;
                margin-right: 9px;
                color: #333;
              "></span>
              <span>考核完成数</span>
            </div>
            <span style="font-weight: bold; color: #333;">${groupTotal}</span>
          </div>
          <div style="margin-top: 2px; padding-left: 10px;">
            ${groupItems.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 1px;">
                <div style="display: flex; align-items: center;">${item.marker}<span style="margin-left: 5px;">${item.seriesName}</span></div>
                <span>${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `

      const otherHtmlArr = otherItems.map(item => {
        const name = item.seriesName
        const value = item.value
        return `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 3px 8px;
            margin-bottom: 5px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            font-size: 13px;
          ">
            <div style="display: flex; align-items: center;">
              ${item.marker}
              <span style="color: #333; margin-left: 6px;">${name}</span>
            </div>
            <span style="font-weight: bold; color: #333;">${value}</span>
          </div>
        `
      })

      return `
        <div style="padding: 0px; border-radius: 20px; width: 160px;">
          ${titleHtmlStr}
          ${otherHtmlArr.join('')}
          ${groupHtml}
        </div>
      `
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
      itemStyle: { color: '#4D96FF' }, 
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
      itemStyle: { color: '#FF6B6B' }, 
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
    option.series[5].data = newVal.map((item: IGetFrontPagePerformanceHistory) => item.newProductOneYearCommission)
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