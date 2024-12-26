<template>
  <div class="cost-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <vab-card title="支出构成" class="card1" style="height: 400px;">
          <el-row>
            <el-col :span="9">
              <!-- <span style="font-weight: 600;">支出构成</span> -->
              <div ref="chartContainer1" style="width: 100%; height: 345px"></div>
            </el-col>
            <el-col :span="15">
              <el-table :data="percentageData" max-height="325" :header-cell-style="headerCellStyle">
                <el-table-column label="项目" prop="name" fixed="left" min-width="170">
                  <template #default="{ row, $index }">
                    <span class="table-item" :style="{ '--dot-color': colorList[$index] }">
                      {{ row.name }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="金额" prop="value" min-width="60">
                  <template #default="{ row }">
                    ${{ row.value }}
                  </template>
                </el-table-column>
                <el-table-column label="占比" prop="percentage" min-width="90" align="right"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="card2" style="height: 400px;" title="库龄">
          <div style="text-align: right; margin-bottom: 15px;">
            <el-radio-group v-model="ageRadio" size="small" @change="handleSwitchBar">
              <el-radio-button label="数量" :value="0" />
              <el-radio-button label="占比" :value="1" />
            </el-radio-group>
          </div>
          <el-row>
            <el-col :span="9">
              <div ref="chartContainer2" style="width: 100%; height: 322px"></div>
            </el-col>
            <el-col :span="15">
             
              <el-table :data="percentageAgeData" max-height="325" :header-cell-style="headerCellStyle" show-summary>
                <el-table-column label="项目" prop="name" min-width="110">
                  <template #default="{ row, $index }">
                    <span class="table-item" :style="{ '--dot-color': storageAgeColorList[$index] }">
                      {{ row.name }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="ageRadio === 0" label="FBA仓" prop="value" min-width="90" align="right"></el-table-column>
                <el-table-column v-if="ageRadio === 1" label="FBA仓" prop="percentage" min-width="90" align="right">
                  <template #default="{ row }">
                    {{ row.percentage }}%
                  </template>
                </el-table-column>
                <el-table-column label="预估下月费用" min-width="120"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="card3" style="height: 190px;">
          <el-container style="display: flex; gap: 10px; align-items: flex-start;">
              <!-- 左侧图片 -->
              <el-aside :style="{ maxWidth: imageHeight + 'px', padding: '0' }">
                <el-image src="https://picsum.photos/200/200" style="border-radius: 10px; display: block;">
                  <template #error><el-icon></el-icon></template>
                </el-image>
              </el-aside>
              <!-- 右侧内容 -->
              <el-main style="flex: 1; padding: 0;">
                <!-- 标题和描述 -->
                <div style="margin-bottom: 6px;">
                  <el-text data-label="amazon" type="primary" style="font-weight: 600;">
                    亚马逊产品包装尺寸
                  </el-text>
                  <div >20×10×2.0cm</div>  
                </div>
                <div style="margin-bottom: 6px;">
                  <el-text type="primary" style="font-weight: 600;">
                    自量产品包装尺寸
                  </el-text>
                  <div >20×10×1.0cm</div>  
                </div>
                <div style="margin-bottom: 6px;">
                  <el-text type="primary" style="font-weight: 600;">
                    重量 (自量/亚马逊)
                  </el-text>
                  <div >200g / 300g</div>  
                </div>
                <div>
                  <el-text type="primary" style="font-weight: 600;">
                    FBA (自量/亚马逊)
                  </el-text>
                  <div data-label="fba">$5.4 / $4.9</div>  
                </div>
              </el-main>
            </el-container>
        </vab-card>
        <vab-card class="card4" style="height: 200px; position: relative;">
          <div ref="chartContainer3" style="width: 100%; height: 200px;"></div>
          <div v-if="!dateRangeSelectVisible" style="position: absolute; top: 5px; right: 5px">
            <el-select v-model="card4Select" @change="handleCard4Select" placeholder="请选择日期" style="max-width: 5em;" size="small">
              <el-option 
                v-for="item in card4Option"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </div>
          <div v-if="dateRangeSelectVisible" style="position: absolute; top: 5px; right: 5px; display: flex; align-items: center;">
            <el-date-picker
              v-model="card4DateRange"
              type="daterange"
              :editable="false"
              :clearable="false"
              value-format="YYYY-MM-DD"
              @change="handleCard4DateSelect"
              size="small"
              style="max-width: 13em;"
            ></el-date-picker>
            <el-icon class="custom-cancel" @click="handleClickCancel" color="#999"><CircleClose /></el-icon>
          </div>
        </vab-card>
        
      </el-col>
    </el-row>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>产品成本核算</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table :data="fakeData" @cell-click="cellClick" border :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle">
      <el-table-column label="日期" prop="createTime" min-width="115"></el-table-column>
      <el-table-column label="站点" prop="" min-width="135">
        <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" @change="" style="min-width: 100%;">
             
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="外汇币种" prop="" min-width="100"></el-table-column>
      <el-table-column label="汇率" prop="foreignExchange" min-width="70"></el-table-column>
      <el-table-column label="产品价格¥" prop="price" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长" prop="length" min-width="70">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽" prop="width" min-width="70">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高" prop="height" min-width="70">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下一档位" prop="" min-width="100"></el-table-column>
      <el-table-column label="尺寸来源" prop="" min-width="120">
        <template #default="{ row }">
          <el-select style="min-width: 100%;">
            <el-option 
              v-for="item in sizeSourceOption"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="尾程" prop="lastMile" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.lastMile" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.lastMile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打包¥" prop="packaging" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.packaging }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头程¥" prop="firstMile" min-width="100"></el-table-column>
      <el-table-column label="头程渠道" prop="firstMileChannel" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.firstMileChannel" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.firstMileChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" prop="sellingPrice" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.sellingPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛利率" prop="" min-width="100"></el-table-column>
      <el-table-column label="ROI" prop="roi" min-width="90"></el-table-column>
      <el-table-column label="重量系数" prop="weightCoefficient" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weightCoefficient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体积系数" prop="volumeCoefficient" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.volumeCoefficient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关税%" prop="tariff" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.tariff }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台佣金" prop="platformCommission" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.platformCommission" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.platformCommission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓储费2个月" prop="storageFee" min-width="140">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.storageFee" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.storageFee }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary">
              逆算
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false">逆算</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="">
                  <el-link type="primary" :underline="false" >复制</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="">
                  <el-link type="primary" :underline="false" >删除</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script lang="ts" setup>
import * as echarts from 'echarts'
import { CSSProperties } from 'vue'
import { card4Option, colorList, sizeSourceOption, storageAgeColorList } from '../constantOption'
import { CircleClose, ArrowDown } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { focusAndSelectInput, getRootElement } from '~/src/utils/nodeUtils'

defineOptions({
  name: 'VabCostAnalysis'
})
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
const chartContainer3 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
let chartObserver3: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const option3 = ref<any>({})

const data1 = ref<any[]>([
  { value: 300, name: '平台费' },
  { value: 600, name: 'FBA发货费' },
  { value: 50, name: '其他订单费用' },
  { value: 150, name: '广告费' },
  { value: 100, name: '推广费' },
  { value: 120, name: 'FBA仓储费' },
  { value: 200, name: 'FBA国际物流运费' },
  { value: 30, name: '调整费用' },
  { value: 40, name: '平台其他费' },
  { value: 60, name: '其他费用' },
  { value: 500, name: '头程成本' },
  { value: 100, name: '其他成本' },
  { value: 800, name: '采购成本' },
  { value: -20, name: '市场税退款额' },
  { value: 70, name: '市场税' },
  { value: -10, name: '销售税退款额' },
  { value: 90, name: '销售税' },
])
const data2 = ref<any[]>([
  { name: '0-90', value: 11800 },
  { name: '91-180', value: 2644 },
  { name: '181-270+', value: 1175 },
  { name: '271-365', value: 152 },
  { name: '365+', value: 293 },
])
const data3 = ref<any[]>([
  { date: '2024-12-20', sku: 100, fba: 90, cost: 80, freight: 70 },
  { date: '2024-12-21', sku: 120, fba: 95, cost: 85, freight: 75 },
  { date: '2024-12-22', sku: 110, fba: 92, cost: 82, freight: 72 },
  { date: '2024-12-23', sku: 130, fba: 98, cost: 88, freight: 78 },
  { date: '2024-12-24', sku: 105, fba: 87, cost: 79, freight: 68 },
  { date: '2024-12-25', sku: 115, fba: 93, cost: 83, freight: 73 },
])
const fakeData = [
  { price: 20, createTime: '2024-12-26', roi: 0 }
]
const ageRadio = ref<number>(0)
const imageHeight = ref<number>(0)
const card4Select = ref<number>(0)
// 日期选择框是否可见
const dateRangeSelectVisible = ref<boolean>(false)
const card4DateRange = ref<[string, string]>(['',''])
// 计算总和
const totalValue = data1.value.reduce((sum, item) => sum + item.value, 0)
// 计算库龄总和
const totalAgeValue = data2.value.reduce((sum, item) => sum + item.value, 0)
const formattedTotalValue = totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// 计算占比
const percentageData = data1.value.map(item => ({
  ...item,
  percentage: ((item.value / totalValue) * 100).toFixed(2) + '%'
}))
let percentageAgeData: any[]
let copyRow: any

const handleCard4Select = () => {
  if (card4Select.value === 4) {
    dateRangeSelectVisible.value = true
    option3.value.legend.data = ['SKU实际价格', 'FBA配送费', '', '打包成本', '头程运费']
    option3.value.grid.top = 50
    updateChart3()
  }
}
const handleCard4DateSelect = () => {
  
}
const handleClickCancel = () => {
  card4Select.value = 0
  dateRangeSelectVisible.value = false
  option3.value.legend.data = ['SKU实际价格', 'FBA配送费', '打包成本', '头程运费']
  option3.value.grid.top = 40
  updateChart3()
}
// 切换是百分比还是数量
const handleSwitchBar = () => {
  const threshold = 10
  if (ageRadio.value === 0) {
  
    option2.value.series.forEach((seriesItem: any, index: number) => {
      const value = percentageAgeData[4 - index].value
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [value]
      if (percentage > threshold) {
        seriesItem.label = {
          show: false, 
        }
      }
    })
    option2.value.yAxis.axisLabel = {}
  } else if (ageRadio.value === 1) {

    option2.value.series.forEach((seriesItem: any, index: number) => {
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [percentage]
      seriesItem.label = {
        show: percentage > threshold, // 当占比大于阈值时显示比例
        formatter: (params: any) => `${params.value}%`, 
      }
    })
    option2.value.yAxis.axisLabel = {
      formatter: '{value}%'
    }
  }
  updateChart2()
}

const initChart1 = () => {
  option1.value = {
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">支出构成</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
        
        // 计算销售额的百分比
        itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">$${params.data.value} (${params.percent}%)</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      }
    },
    series: [
      {
        name: '支出构成',
        type: 'pie',
        radius: ['50%', '80%'],
        left: 0,
        right: 0,
        // avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true, // 始终显示
          position: 'center',
          formatter: [
            `{a|${formattedTotalValue}}`,
            '{b|总支出}'
          ].join('\n'), // 设置显示的文字
          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              lineHeight: 28
            },
            b: {
              color: '#999',
              fontSize: 14,
              lineHeight: 20,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        labelLine: {
          show: false
        },
        data: data1.value,
        color: colorList,
      }
    ]
  }
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">库龄</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
      
        itemHtmlStrArr =  `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.seriesName}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${ageRadio.value === 0 ? '$': ''}${params.value}${ageRadio.value === 1 ? '%': ''}</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
      confine: true
    },
    grid: {
      top: 10,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['FBA仓'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        fontSize: '14px'
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1]  // 为顶部留出空间
    },
    series: [
      {
        name: '365+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[4].value],
        itemStyle: {
          color: storageAgeColorList[4]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '271-365',
        type: 'bar',
        stack: '总量',
        data: [data2.value[3].value],
        itemStyle: {
          color: storageAgeColorList[3]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '181-270+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[2].value],
        itemStyle: {
          color: storageAgeColorList[2]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '91-180',
        type: 'bar',
        stack: '总量',
        data: [data2.value[1].value],
        itemStyle: {
          color: storageAgeColorList[1]
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '0-90',
        type: 'bar',
        stack: '总量',
        barWidth: '40%',
        data: [data2.value[0].value],
        itemStyle: {
          color: storageAgeColorList[0]
        },
        emphasis: {
          focus: 'series'
        },
      },
    ]
  }
  chartInstance2?.setOption(option2.value)
}
const initChart3 = () => {
  option3.value = {
    legend: {
      left: 0,
      top: 5,
      textStyle: {
        fontSize: 12 
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 5,
      data: ['SKU实际价格', 'FBA配送费', '打包成本', '头程运费']
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 40,
      bottom: 5,
      left: 5,
      right: 5,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data3.value.map((item) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
     
    },
    yAxis: {
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1]
    },
    series: [
      {
        name: 'SKU实际价格',
        type: 'line',
        data: data3.value.map((item) => item.sku),
        itemStyle: {
          color: storageAgeColorList[4]
        },
        smooth: true,
        // symbol: 'circle',
        // symbolSize: 6,
      },
      {
        name: 'FBA配送费',
        type: 'line',
        data: data3.value.map((item) => item.fba),
        itemStyle: {
          color: storageAgeColorList[3]
        },
        smooth: true,
      },
      {
        name: '打包成本',
        type: 'line',
        data: data3.value.map((item) => item.cost),
        itemStyle: {
          color: storageAgeColorList[2]
        },
        smooth: true,
      },
      {
        name: '头程运费',
        type: 'line',
        data: data3.value.map((item) => item.freight),
        itemStyle: {
          color: storageAgeColorList[1]
        },
        smooth: true,
      },
    ]
  }
  chartInstance3?.setOption(option3.value)
}
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value, true)
}
const updateChart3 = () => {
  chartInstance3?.setOption(option3.value, true)
}

const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const clickCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    
  }
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center'
  }
}
// 动态设置图片列高度
const setImageHeight = () => {
  const dom1 = document.querySelector('.el-text[data-label="amazon"]');
  const dom2 = document.querySelector('div[data-label="fba"]');

  if (dom1 && dom2) {
    const height1 = dom1.getBoundingClientRect();
    const height2 = dom2.getBoundingClientRect();
    imageHeight.value = height2.bottom - height1.top;
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const columnIndex = data.columnIndex
  if (columnIndex === 0 || columnIndex === 2 || columnIndex === 3 || columnIndex === 9 || columnIndex === 13
    || columnIndex === 16 || columnIndex === 17
  ) {
    return {
      fontWeight: 600,
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
onBeforeMount(() => {
  percentageAgeData = data2.value.map(item => ({
    ...item,
    percentage: ((item.value / totalAgeValue) * 100).toFixed(2)
  }))
})
onMounted(() => {
  setImageHeight()
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
  if (chartContainer2.value) {
    chartInstance2 = echarts.init(chartContainer2.value)
    chartObserver2 = new ResizeObserver(() => {
      if (chartInstance2) {
        chartInstance2.resize()
      }
    })
    chartObserver2.observe(chartContainer2.value)
    initChart2()
  }
  if (chartContainer3.value) {
    chartInstance3 = echarts.init(chartContainer3.value)
    chartObserver3 = new ResizeObserver(() => {
      if (chartInstance3) {
        chartInstance3.resize()
      }
    })
    chartObserver3.observe(chartContainer3.value)
    initChart3()
  }
})
</script>

<style lang="scss" scoped>
.cost-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .none {
    display: none;
  }
  .el-table {
    flex: 1;
  }
  .card1 {
    :deep() {
      .el-card__header {
        border-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .table-item {
    position: relative;
    padding-left: 13px; 

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -5px;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      border-radius: 16px;
      background-color: var(--dot-color, gray); /* 默认颜色 */
    }
  }
  .card2 {
    :deep() {
      .el-card__header {
        border-bottom: 0;
        padding-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .card3 {
    :deep() {
      .el-card__body {
        padding-left: 15px;
        padding-top: 10px;
        padding-bottom: 0;
      }
    }
    margin-bottom: 10px;
  }
  .card4 {
    :deep() {
      .el-card__body {
        padding: 0;
      }
    }
  }
  .custom-cancel {
    width: 1em; 
    height: 1em;
    margin-left: 2px;
    &:hover {
      cursor: pointer;
    }
  }
}

</style>