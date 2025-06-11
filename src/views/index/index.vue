<template>
  <div class="index-container no-background-container">
    <el-row :gutter="20" style="height: 20vh">
      <el-col :span="12" style="height: 100%">
        <el-row :gutter="20" style="height: 100%">
          <el-col :span="8" style="height: 100%">
            <vab-card class="top-card" shadow="always" style="height: 100%">

            </vab-card>
          </el-col>
          <el-col :span="8">
            <vab-card class="top-card" shadow="always" style="height: 100%">

            </vab-card>
          </el-col>
          <el-col :span="8">
            <vab-card class="top-card" shadow="always" style="height: 100%">

            </vab-card>
          </el-col>
        </el-row>
      
      </el-col>
      <el-col :span="12" style="height: 100%">
        <el-col :span="8" style="height: 100%">
          <vab-card class="top-card" shadow="always" style="height: 100%">

          </vab-card>
        </el-col>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="height: 20vh">
      
    </el-row>
    <el-row :gutter="20" style="height: 20vh">
      
    </el-row>
    <el-row :gutter="20" style="height: 30vh">
      <el-col :span="12" style="height: 100%">
        <vab-card class="top-card" shadow="always" style="height: 100%">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>绩效历史</div>
              <!-- <div>
                <el-select placeholder="人员" style="max-width: 5em; margin-top: 8px; margin-right: 10px;"/>
                <el-date-picker type="monthrange" />
              </div> -->
            </div>
           
            
          </template>
          <div ref="chartContainer1" style="width: 100%; height: 350px"></div>
          <div style="position: absolute; top: 5px; right: 10px;">
           
            <!-- <el-radio-group v-model="radio" size="small" @change="handleSwitchTime">
              <el-radio-button label="日" value="day"/>
              <el-radio-button label="周" value="week"/>
              <el-radio-button label="月" value="month"/>
            </el-radio-group> -->
          </div>
        </vab-card>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'

defineOptions({
  name: 'Index',
})
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
// 初始化图表
const initChart1 = () => {
  // 初始化图表的配置项
  option1.value = {
   
    legend: {
      top: '5%'
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
      left: '0',
      bottom: '15%',
      right: '0',
      top: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: date.value,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
       
        color: '#999'
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        position: 'left',
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0.1]  
      },
    ],
    series: [
      // {
      //   name: '退货数',
      //   type: 'bar',
      //   yAxisIndex: 0,
      //   data: data1.value.map((item: any) => item.returnQuantity),
      //   barWidth: 20,
      //   itemStyle: {
      //     color: '#52bfff',
      //   },
      //   opacity: 0.9,
      // },
      // {
      //   name: '退货率',
      //   type: 'line',
      //   yAxisIndex: 1,
      //   data: data1.value.map((item: any) => item.returnMargin),
      //   barWidth: 20,
      //   itemStyle: {
      //     color: '#ff8fa5',
      //   },
      //   opacity: 0.9,
      //   smooth: true,
      //   symbol: 'none',
      //   symbolSize: 6,
      // },
      // {
      //   name: '退款率',
      //   type: 'line',
      //   yAxisIndex: 1,
      //   data: data1.value.map((item: any) => item.returnFund),
      //   barWidth: 20,
      //   itemStyle: {
      //     color: '#ce82fa',
      //   },
      //   opacity: 0.9,
      //   smooth: true,
      //   symbol: 'none',
      //   symbolSize: 6,
      // },
    ],
  };

  // 设置图表实例的配置项
  chartInstance1?.setOption(option1.value);
}
const date = ref([
  '2023-1', '2023-2'
])
onMounted(() => {
  if (chartContainer1.value) {
    chartInstance1 = echarts.init(chartContainer1.value)
    chartObserver1 = new ResizeObserver(() => {
      if (chartInstance1) {
        chartInstance1.resize()
      }
    })
    chartObserver1.observe(chartContainer1.value)
    initChart1()
  }
  
})
</script>

<style lang="scss" scoped>
.index-container {
  :deep() {
    .el-card {
      .el-card__header {
        position: relative;

        > div > span {
          display: flex;
          align-items: center;

          i {
            margin-right: 3px;
          }
        }
      }

      .el-card__body {
        position: relative;

        .echarts {
          width: 100%;
          height: 127px;
        }

        .card-footer-tag {
          position: absolute;
          right: var(--el-margin);
          bottom: 15px;
        }
      }
    }
  }
}
</style>