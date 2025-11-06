<template>
  <div class="overview-container">
    <vab-card data-label="card" style="display: flex; flex-direction: column; height: 550px; margin-bottom: 10px">
      <el-row :gutter="20">
        <el-col v-for="(card, index) in cards" :key="index" :span="4">
          <trend-card
            :active="card.active"
            :color-type="card.colorType"
            :dropdown-items="dropdownItems"
            :previous-value="card.previousValue"
            :title="card.title"
            :trend-percentage="card.trendPercentage"
            :trend-type="card.trendType"
            :value="card.value"
            @click="handleCardClick(index)"
            @item-click="handleSwitchItem(index, $event)"
          />
        </el-col>
      </el-row>
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-radio-group v-model="radio" size="small" @change="handleSwitchTime">
            <el-radio-button label="日" value="day" />
            <el-radio-button label="周" value="week" />
            <el-radio-button label="月" value="month" />
          </el-radio-group>
        </vab-query-form-right-panel>
      </vab-query-form>
      <div ref="chartContainer" style="width: 100%; height: 350px"></div>
    </vab-card>
    <div style="margin-bottom: 10px; text-align: right">
      <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
        <template #reference>
          <el-button>
            <vab-icon icon="settings-line" />
          </el-button>
        </template>
        <vab-draggable v-model="columns" :animation="600" filter=".non-draggable" handle=".handle" :on-move="handleMove">
          <div
            v-for="item in columns"
            :key="item.label"
            :class="{ 'non-draggable': item.disableCheck }"
            style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
          >
            <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
            <span style="flex: 1">{{ item.label }}</span>
            <span v-if="item.disableCheck" class="icon-hover" style="display: flex; align-items: center">
              <el-icon><view /></el-icon>
            </span>
            <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
              <el-icon v-show="!item.checked"><hide /></el-icon>
              <el-icon v-show="item.checked"><view /></el-icon>
            </span>
          </div>
        </vab-draggable>
      </el-popover>
    </div>
    <el-table
      v-loading="loading"
      border
      :cell-style="{ textAlign: 'center' }"
      :data="trendList"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column
        v-for="(item, index) in checkList1"
        :key="index"
        :fixed="item.isFixed"
        :formatter="item.formatter"
        :label="item.label"
        :min-width="item.minWidth"
        :prop="item.prop"
        :width="item.width"
      />
      <template #empty>
        <el-empty class="vab-data-empty" data-label="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Hide } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getTrendOverview } from '/@/api/devlocal/productAnalysis'
import { ITrendOverview } from '/@/type/storeOperation/productAnalysisType'
import { getWeekOfYear } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabTrendOverview',
})

// Props 定义
interface Props {
  selectField?: number // 展示维度：0=SKU, 1=ASIN, 2=父体ASIN
  compareType?: number // 同比/环比：0=同比, 1=环比
  selectDateRange?: [string, string] // 日期范围
}

const props = withDefaults(defineProps<Props>(), {
  selectField: 0,
  compareType: 0,
  selectDateRange: () => ['', ''],
})

const loading = ref<boolean>(false)
// 切换日，周，月
const radio = ref<string>('day')
const amount = 42442.71
// 控制数字显示为美元形式
const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const chartContainer = ref(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const checkList1 = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
// 记录点击的是哪个card
const clickCard = ref<string>('')
const columns = ref<any>([
  {
    label: '日期',
    prop: 'date',
    disableCheck: true,
    checked: true,
    width: 115,
    isFixed: 'left',
  },
  {
    label: '销售额(订单)',
    prop: 'amount',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销量(订单)',
    prop: 'volume',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告销量',
    prop: 'adSales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自然销量',
    prop: 'organicSales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告销售额',
    prop: 'adSalesAmount',
    checked: true,
    minWidth: 110,
  },
  {
    label: '广告花费',
    prop: 'spend',
    checked: true,
    minWidth: 100,
  },
  {
    label: '净利润(订单)',
    prop: 'grossOrderProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '预计下月仓储费',
    prop: 'estimatedStorageCostNextMonth',
    checked: true,
    minWidth: 140,
  },
  {
    label: '退款金额',
    prop: 'returnAmount',
    checked: true,
    minWidth: 90,
  },
  // {
  //   label: '毛利润',
  //   prop: 'grossProfit',
  //   checked: true,
  //   minWidth: 90,
  // },
  {
    label: '点击成本',
    prop: 'clickCost',
    checked: true,
    minWidth: 90,
  },
  {
    label: '客单价',
    prop: 'averageOrderValue',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'CPA(获客成本)',
    prop: 'cpa',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告转化率',
    prop: 'adConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : '-'
    },
  },
  {
    label: '自然转化率',
    prop: 'organicConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : '-'
    },
  },
  {
    label: '综合转化率',
    prop: 'totalConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '退货率',
    prop: 'returnRate',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '退款率',
    prop: 'refundRate',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '净利润率',
    prop: 'netProfitMargin',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'TACOS',
    prop: 'tacos',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'ACOS',
    prop: 'acos',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '广告点击率',
    prop: 'adClickRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '总访客',
    prop: 'sessionsTotal',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'PC端访客',
    prop: 'sessions',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移动端访客',
    prop: 'sessionsMobile',
    checked: true,
    minWidth: 110,
  },
  {
    label: '自然点击',
    prop: 'organicClicks',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告点击',
    prop: 'clicks',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自然点击占比',
    prop: 'organicClickShare',
    checked: true,
    minWidth: 130,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '广告点击占比',
    prop: 'adClickShare',
    checked: true,
    minWidth: 130,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'Rating',
    prop: 'lastStar',
    checked: true,
    minWidth: 100,
  },
  {
    label: '库存',
    prop: 'stock',
    checked: true,
    minWidth: 130,
  },
  {
    label: '点击量',
    prop: 'clicks',
    checked: true,
    minWidth: 100,
  },
  {
    label: '小类排名',
    prop: 'smallRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: 'largeRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '展示',
    prop: 'impressions',
    checked: true,
    minWidth: 110,
  },
  {
    label: '退货量',
    prop: 'returnGoodsCount',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销售额(利润报表)',
    prop: 'totalSalesAmount',
    checked: true,
    minWidth: 130,
  },
  {
    label: '净利润（利润报表）',
    prop: 'grossProfit',
    checked: true,
    minWidth: 130,
  },
])
// 卡片配置数组
const cards = ref([
  {
    title: '销售额(订单)',
    value: formattedAmount,
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'primary' as const,
  },
  {
    title: '广告销售额',
    value: formattedAmount,
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'orange' as const,
  },
  {
    title: '广告花费',
    value: formattedAmount,
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'green' as const,
  },
  {
    title: 'ACOS',
    value: '26.58%',
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'red' as const,
  },
  {
    title: '点击成本',
    value: formattedAmount,
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'purple' as const,
  },
  {
    title: 'TACOS',
    value: '15.24%',
    previousValue: '$47.026.96',
    trendPercentage: '-9.75%',
    trendType: 'down' as const,
    active: false,
    colorType: 'yellow' as const,
  },
])

const dropdownItems = reactive<{ label: string; disabled: boolean }[]>([
  { label: '销售额(订单)', disabled: false },
  { label: '广告销售额', disabled: false },
  { label: '广告花费', disabled: false },
  { label: '净利润(订单)', disabled: false },
  // { label: '预计下月仓储费' },
  { label: '退款金额', disabled: false },
  // { label: '毛利润', },
  { label: '点击成本', disabled: false },
  { label: '客单价', disabled: false },
  { label: 'CPA(获客成本)', disabled: false },
  { label: '广告转化率', disabled: false },
  { label: '自然转化率', disabled: false },
  { label: '综合转化率', disabled: false },
  { label: '退货率', disabled: false },
  { label: '退款率', disabled: false },
  { label: '净利润率', disabled: false },
  // { label: '毛利润率', },
  { label: 'TACOS', disabled: false },
  { label: 'ACOS', disabled: false },
  { label: '广告点击率', disabled: false },
  { label: '总访客', disabled: false },
  { label: 'PC端访客', disabled: false },
  { label: '移动端访客', disabled: false },
  { label: '自然点击占比', disabled: false },
  { label: '广告点击占比', disabled: false },
  { label: 'Rating', disabled: false },
  { label: '库存', disabled: false },
  { label: '小类排名', disabled: false },
  { label: '大类排名', disabled: false },
  { label: '广告展现量', disabled: false },
  { label: '退货量', disabled: false },
])

const groups = {
  price1: ['销售额(订单)', '广告销售额', '广告花费', '净利润(订单)', '退款金额'],
  price2: ['点击成本', '客单价', 'CPA(获客成本)'],
  percent1: ['广告转化率', '自然转化率', '综合转化率'],
  percent2: ['退货率', '退款率', '净利润率', 'TACOS', 'ACOS'],
  percent3: ['广告点击率'],
  int1: ['总访客', 'PC端访客', '移动端访客', '自然点击占比', '广告点击占比'],
  int2: ['Rating'],
  int3: ['库存'],
  int4: ['小类排名'],
  int5: ['大类排名'],
  int6: ['广告展现量'],
  int7: ['退货量'],
}
// name -> prop (根据 ITrendOverview 接口)
const nameMapProp: Record<string, IDataProp> = {
  广告销量: 'adSales',
  自然销量: 'organicSales',
  '销售额(订单)': 'amount',
  广告销售额: 'adSalesAmount',
  广告花费: 'spend',
  '净利润(订单)': 'grossOrderProfit',
  预计下月仓储费: 'estimatedStorageCostNextMonth',
  退款金额: 'returnAmount',
  点击成本: 'clickCost',
  客单价: 'averageOrderValue',
  'CPA(获客成本)': 'cpa',
  广告转化率: 'adConversionRate',
  自然转化率: 'organicConversionRate',
  综合转化率: 'totalConversionRate',
  退货率: 'returnRate',
  退款率: 'refundRate',
  净利润率: 'netProfitMargin',
  TACOS: 'tacos',
  ACOS: 'acos',
  广告点击率: 'adClickRate',
  总访客: 'sessionsTotal',
  PC端访客: 'sessions',
  移动端访客: 'sessionsMobile',
  自然点击: 'organicClicks',
  自然点击占比: 'organicClickShare',
  广告点击占比: 'adClickShare',
  Rating: 'lastStar',
  库存: 'stock',
  小类排名: 'smallRank',
  大类排名: 'largeRank',
  点击量: 'clicks',
  展示: 'impressions',
  退货量: 'returnGoodsCount',
  '销售额(利润报表)': 'totalSalesAmount',
  '净利润（利润报表）': 'grossProfit',
}
type IDataProp =
  | 'adSales'
  | 'organicSales'
  | 'amount'
  | 'adSalesAmount'
  | 'spend'
  | 'grossOrderProfit'
  | 'estimatedStorageCostNextMonth'
  | 'clickCost'
  | 'averageOrderValue'
  | 'cpa'
  | 'adConversionRate'
  | 'organicConversionRate'
  | 'totalConversionRate'
  | 'returnRate'
  | 'refundRate'
  | 'netProfitMargin'
  | 'tacos'
  | 'acos'
  | 'adClickRate'
  | 'sessionsTotal'
  | 'sessions'
  | 'sessionsMobile'
  | 'organicClicks'
  | 'organicClickShare'
  | 'adClickShare'
  | 'lastStar'
  | 'stock'
  | 'smallRank'
  | 'largeRank'
  | 'clicks'
  | 'impressions'
  | 'returnGoodsCount'
  | 'returnAmount'
  | 'totalSalesAmount'
  | 'grossProfit'

// const data: IData[] = [
//   {
//     date: '2023-10-14',
//     adSales: 100,
//     organicSales: 200,
//     amount: 100,
//     adSalesData: 150,
//     adCostData: 20,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 3,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-10-19',
//     adSales: 50,
//     organicSales: 100,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 20,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 3,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-11-01',
//     adSales: 100,
//     organicSales: 200,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 20,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 2,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-11-02',
//     adSales: 50,
//     organicSales: 100,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 20,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 3,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-12-01',
//     adSales: 100,
//     organicSales: 200,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 60,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 3,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-12-02',
//     adSales: 50,
//     organicSales: 100,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 60,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 2,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-12-08',
//     adSales: 100,
//     organicSales: 200,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 60,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 1,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
//   {
//     date: '2024-12-09',
//     adSales: 100,
//     organicSales: 200,
//     totalSales: 100,
//     adSalesData: 150,
//     adCostData: 60,
//     netProfitData: 33,
//     expectedStorageCostData: 25,
//     refundPrice: 28,
//     grossProfit: 35,
//     clickCost: 12,
//     priceData: 60,
//     cpa: 90,
//     adConversionRate: 66,
//     naturalConversionRate: 100,
//     overallConversionRate: 90,
//     returnRate: 80,
//     refundRate: 70,
//     netProfitMargin: 110,
//     grossProfitMargin: 120,
//     tacos: 33.33,
//     acos: 26.75,
//     adClickRate: 300,
//     totalVisitors: 1000,
//     pcVisitors: 520,
//     mobileVisitors: 490,
//     organicVisitors: 450,
//     adVisitors: 550,
//     rating: 3,
//     stock: 1000,
//     subcategoryRanking: 2,
//     categoryRanking: 10,
//     adImpressions: 1200,
//     returnQuantity: 100,
//   },
// ]
const getGroupedData = (data: ITrendOverview[], type: IDataProp, groupBy: 'week' | 'month'): any[] => {
  const groupedData: Record<string, number> = {}
  const spendData: Record<string, number> = {} // ∑广告花费
  const amountData: Record<string, number> = {} // ∑销售额(订单)
  const grossOrderProfitData: Record<string, number> = {} // ∑净利润(订单)
  const returnAmountData: Record<string, number> = {} // ∑退款金额
  const returnGoodsCountData: Record<string, number> = {} // ∑退货量
  const totalSalesData: Record<string, number> = {} // ∑总销量
  const sessionsTotalData: Record<string, number> = {} // ∑总访客
  const clicksData: Record<string, number> = {} // ∑广告点击量
  const adSalesData: Record<string, number> = {} // ∑广告销量
  const adSalesAmountData: Record<string, number> = {} // ∑广告销售额
  const impressionsData: Record<string, number> = {} // ∑广告展现量

  // 根据时间粒度选择分组方式
  const getTimeKey = (date: string): string => {
    if (groupBy === 'week') {
      return getWeekOfYear(date) // 获取 "YYYY-Wxx"
    }
    return date.slice(0, 7) // 提取 "YYYY-MM"
  }

  data.forEach((item) => {
    if (!item.date) return // 跳过没有日期的数据
    const timeKey = getTimeKey(item.date) // 获取分组键（周或月）

    switch (type) {
      case 'smallRank':
      case 'largeRank':
      case 'lastStar': {
        // 取最小值
        if (!groupedData[timeKey]) {
          groupedData[timeKey] = Infinity
        }
        const value = item[type] ?? Infinity
        if (value < groupedData[timeKey]) {
          groupedData[timeKey] = value
        }

        break
      }
      case 'tacos': {
        // 处理TACOS类型，计算 ∑广告花费 / ∑销售额(订单)
        if (!groupedData[timeKey]) {
          spendData[timeKey] = 0
          amountData[timeKey] = 0
        }
        spendData[timeKey] += item.spend ?? 0
        amountData[timeKey] += item.amount ?? 0
        groupedData[timeKey] = formatNumber((spendData[timeKey] / amountData[timeKey]) * 100)

        break
      }
      case 'netProfitMargin': {
        // 处理净利润率类型，计算 ∑净利润(订单) / ∑销售额(订单)
        if (!groupedData[timeKey]) {
          grossOrderProfitData[timeKey] = 0
          amountData[timeKey] = 0
        }
        grossOrderProfitData[timeKey] += item.grossOrderProfit ?? 0
        amountData[timeKey] += item.amount ?? 0
        groupedData[timeKey] = formatNumber((grossOrderProfitData[timeKey] / amountData[timeKey]) * 100)

        break
      }
      case 'refundRate': {
        // 处理退款率类型，计算 ∑退款金额 / ∑销售额(订单)
        if (!groupedData[timeKey]) {
          returnAmountData[timeKey] = 0
          amountData[timeKey] = 0
        }
        returnAmountData[timeKey] += item.returnAmount ?? 0
        amountData[timeKey] += item.amount ?? 0
        groupedData[timeKey] = formatNumber((returnAmountData[timeKey] / amountData[timeKey]) * 100)

        break
      }
      case 'returnRate': {
        // 处理退货率类型，计算 ∑退货量 / ∑总销量
        if (!groupedData[timeKey]) {
          returnGoodsCountData[timeKey] = 0
          totalSalesData[timeKey] = 0
        }
        returnGoodsCountData[timeKey] += item.returnGoodsCount ?? 0
        totalSalesData[timeKey] += (item.adSales ?? 0) + (item.organicSales ?? 0)
        groupedData[timeKey] = formatNumber((returnGoodsCountData[timeKey] / totalSalesData[timeKey]) * 100)

        break
      }
      case 'totalConversionRate': {
        // 处理综合转化率类型，计算 ∑总销量 / ∑总访客
        if (!groupedData[timeKey]) {
          sessionsTotalData[timeKey] = 0
          totalSalesData[timeKey] = 0
        }
        sessionsTotalData[timeKey] += item.sessionsTotal ?? 0
        totalSalesData[timeKey] += (item.adSales ?? 0) + (item.organicSales ?? 0)
        groupedData[timeKey] = formatNumber((totalSalesData[timeKey] / sessionsTotalData[timeKey]) * 100)

        break
      }
      case 'organicConversionRate':
      case 'adConversionRate': {
        // 处理自然转化率/广告转化率类型，计算 ∑销量 / ∑点击量
        if (!groupedData[timeKey]) {
          adSalesData[timeKey] = 0
          clicksData[timeKey] = 0
        }
        if (type === 'organicConversionRate') {
          adSalesData[timeKey] += item.organicSales ?? 0
          clicksData[timeKey] += item.organicClicks ?? 0
        } else {
          adSalesData[timeKey] += item.adSales ?? 0
          clicksData[timeKey] += item.clicks ?? 0
        }
        groupedData[timeKey] = formatNumber((adSalesData[timeKey] / clicksData[timeKey]) * 100)

        break
      }
      case 'cpa': {
        // CPA(获客成本), ∑广告花费 / ∑总销量
        if (!groupedData[timeKey]) {
          spendData[timeKey] = 0
          totalSalesData[timeKey] = 0
        }
        spendData[timeKey] += item.spend ?? 0
        totalSalesData[timeKey] += (item.adSales ?? 0) + (item.organicSales ?? 0)
        groupedData[timeKey] = formatNumber(spendData[timeKey] / totalSalesData[timeKey])

        break
      }
      case 'averageOrderValue': {
        // 客单价, ∑销售额(订单)/ ∑总销量
        if (!groupedData[timeKey]) {
          amountData[timeKey] = 0
          totalSalesData[timeKey] = 0
        }
        amountData[timeKey] += item.amount ?? 0
        totalSalesData[timeKey] += (item.adSales ?? 0) + (item.organicSales ?? 0)
        groupedData[timeKey] = formatNumber(amountData[timeKey] / totalSalesData[timeKey])

        break
      }
      case 'clickCost': {
        // 点击成本, ∑广告花费/ ∑广告点击量
        if (!groupedData[timeKey]) {
          spendData[timeKey] = 0
          clicksData[timeKey] = 0
        }
        spendData[timeKey] += item.spend ?? 0
        clicksData[timeKey] += item.clicks ?? 0
        groupedData[timeKey] = formatNumber(spendData[timeKey] / clicksData[timeKey])

        break
      }
      case 'acos': {
        // ∑广告花费 / ∑总广告销售额
        if (!groupedData[timeKey]) {
          spendData[timeKey] = 0
          adSalesAmountData[timeKey] = 0
        }
        spendData[timeKey] += item.spend ?? 0
        adSalesAmountData[timeKey] += item.adSalesAmount ?? 0
        groupedData[timeKey] = formatNumber((spendData[timeKey] / adSalesAmountData[timeKey]) * 100)

        break
      }
      case 'adClickRate': {
        // ∑广告点击量 / ∑广告展现量
        if (!groupedData[timeKey]) {
          clicksData[timeKey] = 0
          impressionsData[timeKey] = 0
        }
        clicksData[timeKey] += item.clicks ?? 0
        impressionsData[timeKey] += item.impressions ?? 0
        groupedData[timeKey] = formatNumber((clicksData[timeKey] / impressionsData[timeKey]) * 100)

        break
      }
      default: {
        // 其他类型，累加值
        if (!groupedData[timeKey]) {
          groupedData[timeKey] = 0
        }
        const value = item[type] ?? 0
        groupedData[timeKey] += value
      }
    }
  })

  return Object.keys(groupedData).map((timeKey) => ({
    date: timeKey,
    [type]: groupedData[timeKey],
  }))
}
// 金额保留两位小数
const formatNumber = (value: number): number => {
  return Number(value.toFixed(2))
}

// 按周分组并累加
const getWeeklyData = (data: ITrendOverview[], type: IDataProp): any[] => {
  return getGroupedData(data, type, 'week')
}

// 按月分组并累加
const getMonthlyData = (data: ITrendOverview[], type: IDataProp): any[] => {
  return getGroupedData(data, type, 'month')
}

// 已选中需要取消选中再进行选择
const handleCanSelect = (cardActive: boolean) => {
  if (cardActive) {
    $baseMessage('请先取消选中，再进行选择！', 'error')
    return false
  }
  return true
}
// 更新所有下拉项的禁用状态
const updateDropdownItemsDisabled = () => {
  const selectedTexts = cards.value.map((card) => card.title)

  dropdownItems.forEach((item) => {
    item.disabled = selectedTexts.includes(item.label)
  })
}

// 统一的处理下拉项切换
const handleSwitchItem = (index: number, item: { label: string; disabled: boolean }) => {
  const can = handleCanSelect(cards.value[index].active)
  if (can) {
    cards.value[index].title = item.label
    cards.value[index].active = false
    updateDropdownItemsDisabled()
  }
}

/**
 * @description 获取字段所属组
 * @param item 所有可以选择的字段
 */
function getGroup(item: string): string | null {
  for (const [group, fields] of Object.entries(groups)) {
    if (fields.includes(item)) {
      return group
    }
  }
  return null
}

// 初始化选中状态
let selectedItems: string[] = []
const option = ref<any>({})

// 切换 日，周，月
const handleSwitchTime = () => {
  let adSalesData: any[] = []
  let organicSalesData: any[] = []
  switch (radio.value) {
    case 'day': {
      adSalesData = trendList.value
      organicSalesData = trendList.value

      break
    }
    case 'week': {
      adSalesData = getWeeklyData(trendList.value, 'adSales')
      organicSalesData = getWeeklyData(trendList.value, 'organicSales')

      break
    }
    case 'month': {
      adSalesData = getMonthlyData(trendList.value, 'adSales')
      organicSalesData = getMonthlyData(trendList.value, 'organicSales')

      break
    }
    // No default
  }
  option.value.xAxis.data = adSalesData.map((item: any) => item.date)
  option.value.series[0].data = adSalesData.map((d: any) => d.adSales)
  option.value.series[1].data = organicSalesData.map((d: any) => d.organicSales)

  updateYAxisData(trendList.value)
  updateChart()
}
// 更新 Y 轴数据随时间切换的函数
const updateYAxisData = (data: any[]) => {
  option.value.series.forEach((s: any, index: number) => {
    if (index !== 0 && index !== 1) {
      const prop = nameMapProp[s.name]
      let processedData: any[] = []
      switch (radio.value) {
        case 'day': {
          processedData = data

          break
        }
        case 'week': {
          processedData = getWeeklyData(data, prop)

          break
        }
        case 'month': {
          processedData = getMonthlyData(data, prop)

          break
        }
        // No default
      }
      s.data = processedData.map((d: any) => d[prop])
    }
  })
}
// 初始化图表
const initChart = () => {
  // 初始化图表的配置项
  option.value = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params[0].name}</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          const groupName = getGroup(item.seriesName)
          let value = item.value
          if (groupName === 'price1' || groupName === 'price2') {
            value = `$${value}`
          } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
            value = `${value}%`
          }
          return `<div style="display: flex;align-items:center;">
            ${item.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">${item.seriesName}</div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${value}</span>
          </div>`
        })
        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr.join('')}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    grid: {
      left: '60',
      bottom: '6%',
      right: '60',
      top: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: trendList.value.map((item: any) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        // fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '广告/自然销量',
        position: 'left',
        nameTextStyle: {
          color: '#409EFF',
          align: 'center',
          fontSize: '14px',
        },
        axisLabel: {
          // fontWeight: 'bold',
          fontSize: '14px',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409EFF',
          },
        },
        boundaryGap: [0, 0.1], // 为顶部留出空间
      },
      // {
      //   type: 'value',
      //   name: '销售额(订单)',
      //   position: 'right',
      //   axisLabel: {
      //     formatter: '${value}',
      //     fontWeight: 'bold',
      //   },
      //   min: 0,
      //   nameTextStyle: {
      //     color: '#f7ab1b',
      //     align: 'left',
      //   },
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: '#f7ab1b',
      //     },
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      // },
      // {
      //   type: 'value',
      //   name: '花费',
      //   offset: 70,
      //   position: 'right',
      //   axisLabel: {
      //     formatter: '${value}',
      //     fontWeight: 'bold',
      //   },
      //   min: 0,
      //   nameTextStyle: {
      //     color: '#40c9c6',
      //     align: 'left',
      //   },
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: '#40c9c6',
      //     },
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      // },
    ],
    series: [
      {
        name: '广告销量',
        type: 'bar',
        yAxisIndex: 0,
        data: trendList.value.map((item: any) => item.adSales),
        barWidth: 20,
        itemStyle: {
          color: '#409EFF',
        },
        opacity: 0.9,
        stack: 'sales',
      },
      {
        name: '自然销量',
        type: 'bar',
        yAxisIndex: 0,
        data: trendList.value.map((item: any) => item.organicSales),
        barWidth: 20,
        itemStyle: {
          color: '#67C23A',
        },
        opacity: 0.9,
        stack: 'sales',
      },
    ],
  }

  // 设置图表实例的配置项
  chartInstance?.setOption(option.value)
}

// 更新图表
const updateChart = () => {
  chartInstance?.setOption(option.value, true) // 第二个参数 `true` 表示合并旧的配置
  // chartInstance?.resize()
}

const yAxisMapping = new Map() // 字段所属的组 -> yAxisIndex
let currentYAxisCount = 1 // 当前已有的 Y 轴数量（柱状图默认占用 yAxis[0]）

function updateYAxisOffsets() {
  // 重设每个 Y 轴的 offset，确保不重叠
  option.value.yAxis.forEach((yAxis: any, index: number) => {
    yAxis.offset = Math.floor(index / 2) * 60 // 每两个 Y 轴之间间隔 60px
    // 保证 Y 轴位置不重叠
    yAxis.position = index % 2 === 0 ? 'left' : 'right'
  })
}
function handleSelectionChange(selected: boolean, dataGroup: IDataGroup, dataName: string) {
  if (selected) {
    let yAxisIndex: number

    // 1. 处理是否共用y轴还是添加新的y轴
    if (yAxisMapping.has(dataGroup)) {
      // 如果该数据组已有 Y 轴，复用它
      yAxisIndex = yAxisMapping.get(dataGroup)
    } else {
      // 如果该数据组没有对应的 Y 轴，动态添加
      if (currentYAxisCount >= 4) {
        $baseMessage('最多只能支持三个额外的 Y 轴，请重新选择', 'error')
        return true
      }
      yAxisIndex = currentYAxisCount
      yAxisMapping.set(dataGroup, yAxisIndex)

      // 新增 Y 轴配置
      option.value.yAxis.push({
        type: 'value',
        name: dataName,
        position: currentYAxisCount % 2 === 0 ? 'left' : 'right',
        offset: Math.floor(currentYAxisCount / 2) * 60,
        nameTextStyle: {
          // fontWeight: 'bold',
          color: getYAxisColor(),
          fontSize: '14px',
          align: currentYAxisCount % 2 === 0 ? 'right' : 'left',
        },
        axisLabel: {
          // fontWeight: 'bold',
          formatter: getYAxisFormat(dataGroup),
          fontSize: '14px',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: getYAxisColor(),
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0.1], // 为顶部留出空间
      })

      currentYAxisCount++
      updateYAxisOffsets()
    }

    // 添加新 series
    option.value.series.push({
      name: dataName,
      type: 'line',
      yAxisIndex,
      data: getDataForName(dataName),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: getYAxisColor(),
      },
      itemStyle: {
        color: getYAxisColor(),
      },
      emphasis: {
        focus: 'series',
      },
    })
  } else {
    // 取消选中时，移除选中的字段
    const index = selectedItems.indexOf(dataName)
    if (index !== -1) {
      selectedItems.splice(index, 1)
    }
    // 取消选中时，移除对应的 series
    const seriesIndex = option.value.series.findIndex((s: any) => s.name === dataName)
    if (seriesIndex !== -1) {
      option.value.series.splice(seriesIndex, 1) // 移除对应的 series
    }

    // 如果当前字段所属的组的所有 series 都被移除，移除对应的 Y 轴
    const isGroupEmpty = option.value.series.every((s: any) => s.yAxisIndex !== yAxisMapping.get(dataGroup))

    if (isGroupEmpty) {
      const yAxisIndex = yAxisMapping.get(dataGroup)

      yAxisMapping.delete(dataGroup)
      currentYAxisCount--

      // 更新所有 series 的 yAxisIndex
      option.value.series.forEach((s: any) => {
        if (s.yAxisIndex > yAxisIndex) {
          s.yAxisIndex-- // 大于已删除的 Y 轴的index，都减一
        }
      })

      // 移除 Y 轴配置
      option.value.yAxis = option.value.yAxis.filter((yAxis: any, index: number) => index !== yAxisIndex)

      updateYAxisIndex() // 更新 yAxisMapping 和 series 的对应索引
      updateYAxisOffsets()
    }
  }
  updateYAxisData(trendList.value)
  updateChart()
  return false
}

// 更新剩余的 Y 轴和系列的索引
function updateYAxisIndex() {
  Array.from(yAxisMapping.keys()).forEach((group, index) => {
    yAxisMapping.set(group, index + 1) // 保留 0 为柱状图
    option.value.series.forEach((s: any) => {
      if (s.yAxisIndex === index + 1) {
        s.yAxisIndex = index + 1
      }
    })
  })
}
type IDataGroup = 'price1' | 'price2' | 'percent1' | 'percent2' | 'percent3' | 'int1' | 'int2' | 'int3' | 'int4' | 'int5' | 'int6' | 'int7'

const getYAxisFormat = (groupName: string) => {
  if (groupName === 'price1' || groupName === 'price2') {
    return '${value}'
  } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
    return '{value}%'
  } else {
    return '{value}'
  }
}
// 获取对应的颜色
function getYAxisColor() {
  const cardIndex = parseInt(clickCard.value.replace('card', '')) - 1
  if (cardIndex >= 0 && cardIndex < cards.value.length) {
    const colorMap: Record<string, string> = {
      primary: '#ff99cc',
      orange: '#E6A23C',
      green: '#34a9a9',
      red: '#e36060',
      purple: '#8a7ae3',
      yellow: '#ffd700',
    }
    return colorMap[cards.value[cardIndex].colorType] || '#999'
  }
  return '#999'
}

// 根据数据组和数据名称获取数据
function getDataForName(dataName: string) {
  const prop = nameMapProp[dataName]
  return trendList.value.map((item: ITrendOverview) => item[prop]) || []
}

// 处理选中的值重复问题
// const handleUnique = (cardText: string) => {
//   const index = selectedItems.indexOf(cardText)
//   if (index === -1) {
//     selectedItems.push(cardText)
//     return true
//   } else {
//     $baseMessage('选中的值不能重复, 请重新选择', 'error')
//     return false
//   }
// }
// 统一的处理卡片点击
const handleCardClick = (index: number) => {
  cards.value[index].active = !cards.value[index].active

  if (cards.value[index].active) {
    selectedItems.push(cards.value[index].title)
    clickCard.value = `card${index + 1}`
  }
  const dataGroup = getGroup(cards.value[index].title) as IDataGroup
  const moreThan3 = handleSelectionChange(cards.value[index].active, dataGroup, cards.value[index].title)
  if (moreThan3) {
    cards.value[index].active = false
    selectedItems.pop()
  }
}
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
const trendList = ref<ITrendOverview[]>([])
const route = useRoute()
const fetchData = async () => {
  loading.value = true
  const { data } = await getTrendOverview({
    sku: route.query.sku as string,
    siteId: Number(route.query.site),
    asin: route.query.asin as string,
    type: props.selectField,
    startDate: props.selectDateRange[0],
    endDate: props.selectDateRange[1],
  })
  trendList.value = data
  loading.value = false
}

// 监听 trendList 变化，更新图表
watch(
  () => trendList.value,
  () => {
    if (chartInstance && trendList.value.length > 0) {
      handleSwitchTime()
    }
  },
  { deep: true, immediate: false }
)

// 监听 props 变化，重新获取数据
watch(
  () => [props.selectField, props.compareType, props.selectDateRange],
  () => {
    fetchData()
  },
  { deep: true }
)

onMounted(() => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)
    chartObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
    chartObserver.observe(chartContainer.value)
    initChart()
  }
  fetchData()
  // 初始化下拉项的禁用状态
  updateDropdownItemsDisabled()
})

onBeforeUnmount(() => chartObserver.disconnect())
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .el-table {
    flex: 1;
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
</style>
