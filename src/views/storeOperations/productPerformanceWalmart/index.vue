<template>
  <div class="comprehensive-height-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select />
          </el-form-item>
          <el-form-item label="币种">
            <el-select />
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operations" style="width: 5em;" >
              <!-- <el-option 
                v-for="item in operationsOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="开发人">
            <el-select v-model="queryForm.developer" style="width: 5em;" >
              <!-- <el-option 
                v-for="item in developerOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> -->
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
          </el-form-item>
          <el-form-item >
            <el-text style="margin-left: 10px; font-weight: 600;">数据更新时间：2024年12月22日14:02</el-text>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="4">
        <el-popover popper-style="max-height: 560px; overflow: auto;" :width="240">
          <template #reference>
            <el-button>
              <vab-icon icon="settings-line" />
            </el-button>
          </template>
          <vab-draggable v-model="columns" :animation="600" filter=".non-draggable" handle=".handle" :on-move="handleMove">
            <div
              v-for="item in columns"
              :key="item.label"
              :class="{'non-draggable': item.disableCheck}"
              style="display: flex; align-items: center; font-size: var(--el-font-size-base);" 
            >
              <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
              <span style="flex: 1">{{ item.label }}</span>
              <span v-if="item.disableCheck" class="icon-hover" style="display: flex; align-items: center;">
                <el-icon><view /></el-icon>
              </span>
              <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer;" @click="handleChecked(item)">
                <el-icon v-show="!item.checked"><hide /></el-icon>
                <el-icon v-show="item.checked"><view /></el-icon>
              </span>
            </div>
          </vab-draggable>
        </el-popover>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="fakeData"
      :header-cell-style="{ textAlign: 'center' }"
      @cell-click="handleCellClick"
    >
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :width="item.width"
      >
        <template #header>
          <span v-if="item.label === '销量趋势(点击看明细)'">
            销量趋势<br />(点击看明细)
          </span>
          <span v-if="item.label === '库存可售'">
            库存<br />可售
          </span>
          <span v-if="item.label === '可售含在途'">
            可售<br />含在途
          </span>
        </template>
        <template #default="{ row }">
          <span v-if="item.label === '图片'">
            <el-image fit="fill" :src="row.componentImage" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.componentImage)" >
              <template #error>
                <el-icon/>
              </template>
            </el-image>
          </span>
          <span v-if="item.label === 'SKU'">
            {{ row.sku }}
            <div class="rate-wrapper">
              <span class="rate-value">{{ row.rate }}</span>
              <span><el-rate v-model="row.rate" class="custom-rate" disabled :void-icon="Star" /></span>
              <span class="rate-count">{{ 484 }}</span>
            </div>
          </span>
          <span v-if="item.label === '销量趋势(点击看明细)'">
            <div style="width: 100%; height: 50px">
              <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
            </div>
          </span>
          <span v-if="item.label === '运营分类'">
            <el-select style="min-width: 100%;">
              <el-option 
                v-for="o in opeClassOption"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </span>
          <span v-if="item.label === '停产'">
            <el-checkbox :false-value="0" :true-value="1" />
          </span>
         
          <span v-if="item.label === '运营备注'">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
              </template>
              <span>{{ removeHtmlTags(row.remark) }}</span>
            </el-tooltip>
          </span>
         
          <span v-if="label1.includes(item.label)">
            {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
          </span>
          <span v-if="label2.includes(item.label)">
            {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
          </span>
          <span v-if="label3.includes(item.label)">
            <!-- 处理 天 -->
            {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
          </span>
          <span v-if="item.label === '季节系数'">
            <div style="width: 100%; height: 50px">
              <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="seasonalYData" />
            </div>
          </span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"/>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 筛选 -->
    <vab-filter-dialog 
      :filter-visible="filterVisible"
      @update-visible="handleCloseFilterDialog"
    />
    <!-- 运营分类 -->
    <vab-operational-classify 
      :ope-classify-visible="opeClassifyVisible"
      @update-visible="closeOpeClassify"
    />
     <!-- 关键词排名趋势 -->
     <vab-key-word-rank-trend 
      :key-word-trend-visible="keyWordTrendVisible"
      @update-visible="handleCloseKeyWordTrend"
    />
    <!-- 运营备注 -->
    <vab-dialog
      v-model="remarkVisible"
      title="运营备注"
      width="20%"
    >
      <el-input placeholder="请输入运营备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
     <!-- 季节系数 -->
     <vab-dialog
      v-model="seasonalVisible"
      title="季节系数"
      width="40%"
      @open="handleSeasonalOpened"
    >
      <div ref="chartContainer1" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Hide, Search, Star } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { months, opeClassOption } from '../constantOption'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductPerformanceWalmart'
})
const seasonalVisible = ref<boolean>(false)
const chartContainer1 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartObserver1: ResizeObserver

const option1 = ref<any>({})

const seasonalXData = months.map((item) => item.label)
const seasonalYData = [1.2, 1.3, 1.2, 1.2, 1.4, 1.3, 1.2, 1.2, 1.4, 1.3, 1.3, 1.3]
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const filterVisible = ref<boolean>(false)
const keyWordTrendVisible = ref<boolean>(false)
const opeClassifyVisible = ref<boolean>(false)
const label1 = ['今销', '当前售价', '月销售额', '盈亏售价', '30毛利售价']
const label2 = ['试算毛利', '月退货%', '月退款%']
const label3 = ['上新', '库存可售', '可售含在途', '断货']
const label1Map = new Map([
  ['今销', 'totalSellD'],
  ['当前售价', 'currentPrice'],
  ['月销售额', 'monthlySales'],
  ['盈亏售价', 'profitLossPrice'],
  ['30毛利售价', 'profitPrice'],
])
const label2Map = new Map([
  ['试算毛利', 'trialGrossProfit'],
  ['月退货%', 'monthlyReturns'],
  ['月退款%', 'monthlyRefund'],
])
const label3Map = new Map([
  ['上新', 'newReleases'],
  ['库存可售', 'stockSale'],
  ['可售含在途', 'saleTransit'],
  ['断货', 'outOfStock'],
])
const columns = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
    disableCheck: true,
    checked: true,
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '站点',
    prop: 'site',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销#',
    prop: 'todaySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今销',
    prop: 'todaySellD',
    checked: true,
    minWidth: 90,
  },
  {
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'classify',
    checked: true,
    minWidth: 130,
  },
  {
    label: '停产',
    prop: 'ting',
    checked: true,
    minWidth: 60,
  },
  {
    label: '运营备注',
    prop: 'remark',
    checked: true,
    minWidth: 100,
  },
  {
    label: '当前售价',
    prop: 'currentPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '试算毛利',
    prop: 'trialGrossProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月销量',
    prop: 'monthlySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月销售额',
    prop: 'monthlySales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退货%',
    prop: 'monthlyReturns',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthlyRefund',
    checked: true,
    minWidth: 100,
  },
  {
    label: '上新',
    prop: 'newReleases',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    checked: true,
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: 'remainingStock',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'receiving',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'totalStorage',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'stockSale',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'saleTransit',
    checked: true,
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    checked: true,
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '订货',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '盈亏售价',
    prop: 'profitLossPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '30毛利售价',
    prop: 'profitPrice',
    checked: true,
    minWidth: 110,
  },
  {
    label: '操作建议',
    prop: 'suggestions',
    checked: true,
    minWidth: 100,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品描述',
    prop: 'productDes',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: 'person',
    checked: true,
    minWidth: 100,
  },
])
const fakeData = ref<any>([
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    rate: 4.7,
    asin: 'B08N5M7S6K',
    pAsin: 'B08N5M7S6K',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 100,
    todayOrder: 50,
    todaySellD: 1500,
    todayAd: 10,
    ad: 500,
    pieChart: '',
    seasonalCoefficient: 1.5,
    classify: '电子产品',
    sRank: 5,
    bRank: 2,
    topProduct: 200,
    remark: '备注信息1',
    monthlyStorageFee: 100,
    currentPrice: 29.99,
    trialGrossProfit: 10.5,
    fba: '是',
    conversion: 12,
    click: 300,
    totalConvert: 25,
    monthlySell: 1500,
    monthlyNetProfit: 5000,
    monthlySales: 45000,
    monthlyNetInterestRate: 11.1,
    monthlyAdSales: 1500,
    monthlyAdSpend: 800,
    monthlyAd: 30,
    monthlyACOS: 15,
    monthlyTACOS: 10,
    yearACOS: 12,
    yearTACOS: 8,
    removeValue: 100,
    remove: 5,
    replaceValue: 200,
    replace: 10,
    monthlyReturns: 3,
    monthlyRefund: 2,
    VOCSatisfaction: 90,
    VOCDefectP: 1,
    VOCDefect: 10,
    VOCOrder: 200,
    newReleases: 20,
    storageAge: 30,
    remainingStock: 100,
    receiving: 50,
    recentlyStorage: 200,
    totalStorage: 500,
    stockSale: 300,
    saleTransit: 100,
    outOfStock: 0,
    order: 150,
    sign: '已签收',
    monthlyAvailabilityRate: 95,
    lowFeeDays: 5,
    estimatedFees: 2000,
    profitLossPrice: 18,
    profitPrice: 22,
    suggestions: '增加广告投放',
    status: '正常',
    productDes: '这是一款电子产品',
    person: '张三',
    id: 1
  },
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU67890',
    rate: 4,
    asin: 'B08XYZ1234',
    pAsin: 'B08XYZ1234',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 200,
    todayOrder: 100,
    todaySellD: 2500,
    todayAd: 15,
    ad: 800,
    pieChart: '',
    seasonalCoefficient: 1.8,
    classify: '家居用品',
    sRank: 3,
    bRank: 1,
    topProduct: 400,
    remark: '备注信息2',
    monthlyStorageFee: 150,
    currentPrice: 45.99,
    trialGrossProfit: 15.5,
    fba: '否',
    conversion: 10,
    click: 500,
    totalConvert: 20,
    monthlySell: 2000,
    monthlyNetProfit: 7000,
    monthlySales: 80000,
    monthlyNetInterestRate: 8.75,
    monthlyAdSales: 2500,
    monthlyAdSpend: 1200,
    monthlyAd: 24,
    monthlyACOS: 14,
    monthlyTACOS: 9,
    yearACOS: 13,
    yearTACOS: 7,
    removeValue: 200,
    remove: 3,
    replaceValue: 400,
    replace: 12,
    monthlyReturns: 2,
    monthlyRefund: 1,
    VOCSatisfaction: 85,
    VOCDefectP: 2,
    VOCDefect: 5,
    VOCOrder: 300,
    newReleases: 15,
    storageAge: 25,
    remainingStock: 200,
    receiving: 70,
    recentlyStorage: 150,
    totalStorage: 600,
    stockSale: 350,
    saleTransit: 120,
    outOfStock: 0,
    order: 180,
    sign: '未签收',
    monthlyAvailabilityRate: 98,
    lowFeeDays: 4,
    estimatedFees: 2500,
    profitLossPrice: 22,
    profitPrice: 26,
    suggestions: '增加促销活动',
    status: '待处理',
    productDes: '这是一款家居用品',
    person: '李四',
    id: 2
  },
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    rate: 4.3,
    asin: 'B08N5M7S6K',
    pAsin: 'B08N5M7S6K',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 100,
    todayOrder: 50,
    todaySellD: 1500,
    todayAd: 10,
    ad: 500,
    pieChart: '',
    seasonalCoefficient: 1.5,
    classify: '电子产品',
    sRank: 5,
    bRank: 2,
    topProduct: 200,
    remark: '备注信息1',
    monthlyStorageFee: 100,
    currentPrice: 29.99,
    trialGrossProfit: 10.5,
    fba: '是',
    conversion: 12,
    click: 300,
    totalConvert: 25,
    monthlySell: 1500,
    monthlyNetProfit: 5000,
    monthlySales: 45000,
    monthlyNetInterestRate: 11.1,
    monthlyAdSales: 1500,
    monthlyAdSpend: 800,
    monthlyAd: 30,
    monthlyACOS: 15,
    monthlyTACOS: 10,
    yearACOS: 12,
    yearTACOS: 8,
    removeValue: 100,
    remove: 5,
    replaceValue: 200,
    replace: 10,
    monthlyReturns: 3,
    monthlyRefund: 2,
    VOCSatisfaction: 90,
    VOCDefectP: 1,
    VOCDefect: 10,
    VOCOrder: 200,
    newReleases: 20,
    storageAge: 30,
    remainingStock: 100,
    receiving: 50,
    recentlyStorage: 200,
    totalStorage: 500,
    stockSale: 300,
    saleTransit: 100,
    outOfStock: 0,
    order: 150,
    sign: '已签收',
    monthlyAvailabilityRate: 95,
    lowFeeDays: 5,
    estimatedFees: 2000,
    profitLossPrice: 18,
    profitPrice: 22,
    suggestions: '增加广告投放',
    status: '正常',
    productDes: '这是一款电子产品',
    person: '张三',
    id: 3
  },
])
// 运营备注
const remarkVisible = ref<boolean>(false)
const showRemark = () => {
  remarkVisible.value = true
}
const initChart1 = () => {
  option1.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
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
      name: '系数',
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: [1.2, 1.3, 1.2, 1.2, 1.4, 1.3, 1.2, 1.2, 1.4, 1.3, 1.3, 1.3],
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: [1.21, 1.38, 1.38, 1.38, 1.2, 1.38, 1.2, 1.2, 1.2, 1.38, 1.38, 1.38],
        itemStyle: {
          color: '#ff8fa5'
        },
        smooth: true,
      },
    ]
  }
  
  chartInstance1?.setOption(option1.value)
}
const handleSeasonalOpened = () => {
  nextTick(() => {
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
}
const handleCellClick = (row: any, column: any) => {
  const label = column.label
  if (label === '运营备注') {
    showRemark()
  } else if (label === '季节系数') {
    seasonalVisible.value = true
  }
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])

function formatPercentage(value: number | null, num: number): string | null {
  if (value == null) return value
  const percentage = (value * 100).toFixed(num) // 将小数转换为百分比，并保留两位小数
  return `${percentage}%`
}
const handleCloseKeyWordTrend = (value: boolean) => {
  keyWordTrendVisible.value = value
}
const handleCloseFilterDialog = (value: boolean) => {
  filterVisible.value = value
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}
const closeOpeClassify = () => {
  opeClassifyVisible.value = false
}
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove = (event: any) => {
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
}
// 处理自适应宽度
const handleWidth = (item: any) => {
  if (item.label === 'SKU') {
    return flexColumnWidth(fakeData.value, 'SKU-SKU-SKU-SKU-', 'sku')
  } else {
    return item.minWidth
  }
}

const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0px;
      padding-bottom: 0px;
      .cell {
        padding-right: 0px;
        padding-left: 0px;
      }
    }
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
  }
}
.rate-wrapper {
  display: flex; 
  gap: 8px;
  align-items: center; 
  
  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本右对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep() {
      .el-rate__item {
        margin-top: -2px;
        margin-right: 0;
        margin-left: -9px;
        .el-icon {
          stroke: #f09000; /* 星星边框颜色 */
          stroke-width: 60px; /* 星星边框的粗细 */
        }
      }
    }

  }
  .rate-count {
    margin-left: -11px;
    color: #36788C;
  }
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
  &:hover {
    color: var(--el-color-primary);
    background-color: #f2f2f2; /* 浅灰色背景 */
  }
}
.disabled-handle {
  cursor: not-allowed;
}
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>