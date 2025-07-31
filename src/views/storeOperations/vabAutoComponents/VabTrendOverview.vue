<template>
  <div class="overview-container">
    <vab-card data-label="card" style=" display: flex; flex-direction: column;height: 550px; margin-bottom: 10px;">
      <el-row :gutter="20">
        <!-- 总销售额 -->
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard1Click">
            <div class="parting-line" :class="{ 'parting-line-primary': card1Active }" ></div>
            <el-dropdown >
              <span>
                {{ card1Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem1(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ formattedAmount }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
        </el-col>
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard2Click">
            <div class="parting-line" :class="{ 'parting-line-orange': card2Active }" ></div>
            <el-dropdown>
              <span>
                {{ card2Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem2(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ formattedAmount }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
        </el-col>
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard3Click">
            <div class="parting-line" :class="{ 'parting-line-green': card3Active }" ></div>
            <el-dropdown>
              <span>
                {{ card3Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem3(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ formattedAmount }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
        </el-col>
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard4Click">
            <div class="parting-line" :class="{ 'parting-line-red': card4Active }" ></div>
            <el-dropdown>
              <span>
                {{ card4Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem4(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ '26.58%' }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
        </el-col>
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard5Click">
            <div class="parting-line" :class="{ 'parting-line-purple': card5Active }" ></div>
            <el-dropdown>
              <span>
                {{ card5Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem5(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ formattedAmount }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
        </el-col>
        <el-col :span="4">
          <vab-card class="top-card" shadow="always" @click="handleCard6Click">
            <div class="parting-line" :class="{ 'parting-line-yellow': card6Active }" ></div>
            <el-dropdown>
              <span>
                {{ card6Text }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="handleSwitchItem6(item)"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p>
              {{ '15.24%' }}
            </p>
            <div class="bottom bottom-down">
              $47.026.96
              <vab-icon icon="arrow-down-line" />
              <span>{{ '-9.75%' }}</span>
            </div>
          </vab-card>
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
    <div style=" margin-bottom: 10px;text-align: right;">
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
            :class="{'non-draggable': item.disableCheck}"
            style=" display: flex; align-items: center;font-size: var(--el-font-size-base);" 
          >
            <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
            <span style="flex: 1">{{ item.label }}</span>
            <span v-if="item.disableCheck" class="icon-hover" style="display: flex; align-items: center;">
              <el-icon><view /></el-icon>
            </span>
            <span v-else class="icon-hover" style=" display: flex; align-items: center;cursor: pointer;" @click="handleChecked(item)">
              <el-icon v-show="!item.checked"><hide /></el-icon>
              <el-icon v-show="item.checked"><view /></el-icon>
            </span>
          </div>
        </vab-draggable>
      </el-popover>
    </div>
    <el-table
      border 
      :cell-style="{ textAlign: 'center' }"
      :data="data"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column
        v-for="(item, index) in checkList1"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="item.minWidth"
        :prop="item.prop"
        :width="item.width"
      />
      <!-- <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template> -->
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
import { ArrowDown, Hide } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getWeekOfYear } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabTrendOverview'
})

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
  pageSize: 20
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
    isFixed: 'left'
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
    label: '总销售额',
    prop: 'totalSales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告销售额',
    prop: 'adSalesData',
    checked: true,
    minWidth: 110,
  },
  {
    label: '广告花费',
    prop: 'adCostData',
    checked: true,
    minWidth: 100,
  },
  {
    label: '净利润',
    prop: 'netProfitData',
    checked: true,
    minWidth: 100,
  },
  // {
  //   label: '预计下月仓储费',
  //   prop: 'expectedStorageCostData',
  //   checked: true,
  //   minWidth: 140,
  // },
  {
    label: '退款金额',
    prop: 'refundPrice',
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
    label: '售价',
    prop: 'priceData',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'CPA',
    prop: 'cpa',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告转化率',
    prop: 'adConversionRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '自然转化率',
    prop: 'naturalConversionRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '综合转化率',
    prop: 'overallConversionRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '退货率',
    prop: 'returnRate',
    checked: true,
    minWidth: 90,
  },
  {
    label: '退款率',
    prop: 'refundRate',
    checked: true,
    minWidth: 90,
  },
  {
    label: '净利润率',
    prop: 'netProfitMargin',
    checked: true,
    minWidth: 90,
  },
  // {
  //   label: '毛利润率',
  //   prop: 'grossProfitMargin',
  //   checked: true,
  //   minWidth: 90,
  // },
  {
    label: 'TACOS',
    prop: 'tacos',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'ACOS',
    prop: 'acos',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告点击率',
    prop: 'adClickRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '总访客',
    prop: 'totalVisitors',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'PC端访客',
    prop: 'pcVisitors',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移动端访客',
    prop: 'mobileVisitors',
    checked: true,
    minWidth: 110,
  },
  {
    label: '自然点击/访客',
    prop: 'organicVisitors',
    checked: true,
    minWidth: 130,
  },
  {
    label: '广告点击/访客',
    prop: 'adVisitors',
    checked: true,
    minWidth: 130,
  },
  {
    label: 'Rating',
    prop: 'rating',
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
    label: '小类排名',
    prop: 'subcategoryRanking',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: 'categoryRanking',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告展现量',
    prop: 'adImpressions',
    checked: true,
    minWidth: 110,
  },
  {
    label: '退货量',
    prop: 'returnQuantity',
    checked: true,
    minWidth: 100,
  },
])
// 六个卡片是否选择状态
const card1Active = ref<boolean>(false)
const card2Active = ref<boolean>(false)
const card3Active = ref<boolean>(false)
const card4Active = ref<boolean>(false)
const card5Active = ref<boolean>(false)
const card6Active = ref<boolean>(false)
const card1Text = ref<string>('总销售额')
const card2Text = ref<string>('广告销售额')
const card3Text = ref<string>('广告花费')
const card4Text = ref<string>('ACOS')
const card5Text = ref<string>('点击成本')
const card6Text = ref<string>('TACOS')

const dropdownItems = reactive<{ label: string, disabled: boolean }[]>([
  { label: '总销售额', disabled: false },
  { label: '广告销售额', disabled: false },
  { label: '广告花费', disabled: false },
  { label: '净利润', disabled: false },
  // { label: '预计下月仓储费' },
  { label: '退款金额', disabled: false },
  // { label: '毛利润', },
  { label: '点击成本', disabled: false },
  { label: '售价', disabled: false },
  { label: 'CPA', disabled: false },
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
  { label: '自然点击/访客', disabled: false },
  { label: '广告点击/访客', disabled: false },
  { label: 'Rating', disabled: false },
  { label: '库存', disabled: false },
  { label: '小类排名', disabled: false },
  { label: '大类排名', disabled: false },
  { label: '广告展现量', disabled: false },
  { label: '退货量', disabled: false },
])

type IData = {
  date: string
  adSales: number
  organicSales: number
  totalSales: number
  adSalesData: number
  adCostData: number
  netProfitData: number
  expectedStorageCostData: number
  refundPrice: number
  grossProfit: number
  clickCost: number
  priceData: number
  cpa: number
  adConversionRate: number
  naturalConversionRate: number
  overallConversionRate: number
  returnRate: number
  refundRate: number
  netProfitMargin: number
  grossProfitMargin: number
  tacos: number
  acos: number
  adClickRate: number
  totalVisitors: number
  pcVisitors: number
  mobileVisitors: number
  organicVisitors: number
  adVisitors: number
  rating: number
  stock: number
  subcategoryRanking: number
  categoryRanking: number
  adImpressions: number
  returnQuantity: number
}
const groups = {
  price1: ['总销售额', '广告销售额', '广告花费', '净利润', '退款金额'],
  price2: ['点击成本', '售价', 'CPA'],
  percent1: ['广告转化率', '自然转化率', '综合转化率'],
  percent2: ['退货率', '退款率', '净利润率', 'TACOS', 'ACOS'],
  percent3: ['广告点击率'],
  int1: ['总访客', 'PC端访客', '移动端访客', '自然点击/访客', '广告点击/访客'],
  int2: ['Rating'],
  int3: ['库存'],
  int4: ['小类排名'],
  int5: ['大类排名'],
  int6: ['广告展现量'],
  int7: ['退货量'],
}
// name -> prop
const nameMapProp: Record<string, IDataProp> = {
  '广告销量': 'adSales',
  '自然销量': 'organicSales',
  '总销售额': 'totalSales',
  '广告销售额': 'adSalesData',
  '广告花费': 'adCostData',
  '净利润': 'netProfitData',
  // '预计下月仓储费': 'expectedStorageCostData',
  '退款金额': 'refundPrice',
  // '毛利润': 'grossProfit',
  '点击成本': 'clickCost',
  '售价': 'priceData',
  'CPA': 'cpa',
  '广告转化率': 'adConversionRate',
  '自然转化率': 'naturalConversionRate',
  '综合转化率': 'overallConversionRate',
  '退货率': 'returnRate',
  '退款率': 'refundRate',
  '净利润率': 'netProfitMargin',
  // '毛利润率': 'grossProfitMargin',
  'TACOS': 'tacos',
  'ACOS': 'acos',
  '广告点击率': 'adClickRate',
  '总访客': 'totalVisitors',
  'PC端访客': 'pcVisitors',
  '移动端访客': 'mobileVisitors',
  '自然点击/访客': 'organicVisitors',
  '广告点击/访客': 'adVisitors',
  'Rating': 'rating',
  '库存': 'stock',
  '小类排名': 'subcategoryRanking',
  '大类排名': 'categoryRanking',
  '广告展现量': 'adImpressions',
  '退货量': 'returnQuantity'
}
type IDataProp = 'adSales' | 'organicSales'
  | 'totalSales' | 'adSalesData' | 'adCostData' | 'netProfitData' | 'expectedStorageCostData' | 'refundPrice' | 'grossProfit'
  | 'clickCost' | 'priceData' | 'cpa'
  | 'adConversionRate' | 'naturalConversionRate' | 'overallConversionRate'
  | 'returnRate' | 'refundRate' | 'netProfitMargin' | 'grossProfitMargin' | 'tacos' | 'acos'
  | 'adClickRate'
  | 'totalVisitors' | 'pcVisitors' | 'mobileVisitors' | 'organicVisitors' | 'adVisitors'
  | 'rating'
  | 'stock'
  | 'subcategoryRanking'
  | 'categoryRanking'
  | 'adImpressions'
  | 'returnQuantity'

const data: IData[] = [
  { date: "2023-10-14", adSales: 100, organicSales: 200, totalSales: 100, adSalesData: 150, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 3, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-10-19", adSales: 50, organicSales: 100, totalSales: 100, adSalesData: 150, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 3, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-11-01", adSales: 100, organicSales: 200, totalSales: 100, adSalesData: 150, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 2, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-11-02", adSales: 50, organicSales: 100, totalSales: 100, adSalesData: 150, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 3, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-12-01", adSales: 100, organicSales: 200, totalSales: 100, adSalesData: 150, adCostData: 60, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 3, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-12-02", adSales: 50, organicSales: 100, totalSales: 100, adSalesData: 150, adCostData: 60, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 2, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-12-08", adSales: 100, organicSales: 200, totalSales: 100, adSalesData: 150, adCostData: 60, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 1, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   },
  { date: "2024-12-09", adSales: 100, organicSales: 200, totalSales: 100, adSalesData: 150, adCostData: 60, netProfitData: 33, expectedStorageCostData: 25, refundPrice: 28, grossProfit: 35, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 33.33, acos: 26.75, adClickRate: 300, totalVisitors: 1000,
    pcVisitors: 520, mobileVisitors: 490, organicVisitors: 450, adVisitors: 550, rating: 3, stock: 1000, subcategoryRanking: 2, categoryRanking: 10, adImpressions: 1200, returnQuantity: 100
   }
]
const getGroupedData = (data: IData[], type: IDataProp, groupBy: 'week' | 'month'): any[] => {
  const groupedData: Record<string, number> = {}
  const adCostData: Record<string, number> = {} // ∑广告花费
  const totalSales: Record<string, number> = {} // ∑总销售额
  // const grossProfit: Record<string, number> = {} // ∑毛利润
  const netProfitData: Record<string, number> = {} // ∑净利润
  const refundPrice: Record<string, number> = {} // ∑退款金额
  const returnQuantity: Record<string, number> = {} // ∑退货量
  const totalBarSales: Record<string, number> = {} // ∑总销量
  const totalVisitors: Record<string, number> = {} // ∑总访客
  const adVisitors: Record<string, number> = {} // ∑广告点击量
  const adSales: Record<string, number> = {} // ∑广告销量
  const adSalesData: Record<string, number > = {} // ∑广告销售额
  const adImpressions: Record<string, number> = {} // ∑广告展现量
  
  // 根据时间粒度选择分组方式
  const getTimeKey = (date: string): string => {
    if (groupBy === 'week') {
      return getWeekOfYear(date) // 获取 "YYYY-Wxx"
    }
    return date.slice(0, 7) // 提取 "YYYY-MM" 
  }

  data.forEach((item) => {
    const timeKey = getTimeKey(item.date) // 获取分组键（周或月）

    switch (type) {
    case 'subcategoryRanking': 
    case 'categoryRanking': 
    case 'rating': {
      // 取最小值
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = Infinity
      }
      if (item[type] < groupedData[timeKey]) {
        groupedData[timeKey] = item[type]
      }
    
    break;
    }
    case 'tacos': {
      // 处理TACOS类型，计算 ∑广告花费 / ∑总销售额
      if (!groupedData[timeKey]) {
        adCostData[timeKey] = 0
        totalSales[timeKey] = 0
      }
      adCostData[timeKey] += item.adCostData
      totalSales[timeKey] += item.totalSales
      groupedData[timeKey] = formatNumber(adCostData[timeKey] / totalSales[timeKey] * 100) 
    
    break;
    }
    // case 'grossProfitMargin': {
    //   // 处理毛利润率类型，计算 ∑毛利润 / ∑总销售额
    //   if (!groupedData[timeKey]) {
    //     grossProfit[timeKey] = 0
    //     totalSales[timeKey] = 0
    //   }
    //   grossProfit[timeKey] += item.grossProfit
    //   totalSales[timeKey] += item.totalSales
    //   groupedData[timeKey] = formatNumber(grossProfit[timeKey] / totalSales[timeKey] * 100) 
    
    // break;
    // }
    case 'netProfitMargin': {
      // 处理净利润率类型，计算 ∑净利润 / ∑总销售额
      if (!groupedData[timeKey]) {
        netProfitData[timeKey] = 0
        totalSales[timeKey] = 0
      }
      netProfitData[timeKey] += item.netProfitData
      totalSales[timeKey] += item.totalSales
      groupedData[timeKey] = formatNumber(netProfitData[timeKey] / totalSales[timeKey] * 100) 
    
    break;
    }
    case 'refundRate': {
      // 处理退款率类型，计算 ∑退款金额 / ∑总销售额
      if (!groupedData[timeKey]) {
        refundPrice[timeKey] = 0
        totalSales[timeKey] = 0
      }
      refundPrice[timeKey] += item.refundPrice
      totalSales[timeKey] += item.totalSales
      groupedData[timeKey] = formatNumber(refundPrice[timeKey] / totalSales[timeKey] * 100)
    
    break;
    }
    case 'returnRate': {
      // 处理退货率类型，计算 ∑退货量 / ∑总销量
      if (!groupedData[timeKey]) {
        returnQuantity[timeKey] = 0
        totalBarSales[timeKey] = 0
      }
      returnQuantity[timeKey] += item.returnQuantity
      totalBarSales[timeKey] += item.adSales + item.organicSales
      groupedData[timeKey] = formatNumber(returnQuantity[timeKey] / totalBarSales[timeKey] * 100)
    
    break;
    }
    case 'overallConversionRate': {
      // 处理综合转化率类型，计算 ∑总销量 / ∑总访客
      if (!groupedData[timeKey]) {
        totalVisitors[timeKey] = 0
        totalBarSales[timeKey] = 0
      }
      totalVisitors[timeKey] += item.totalVisitors
      totalBarSales[timeKey] += item.adSales + item.organicSales
      groupedData[timeKey] = formatNumber(totalBarSales[timeKey] / totalVisitors[timeKey] * 100)
    
    break;
    }
    case 'naturalConversionRate': 
    case 'adConversionRate': {
      // 处理自然转化率/广告转化率类型，计算 ∑广告销量 / ∑广告点击量
      if (!groupedData[timeKey]) {
        adSales[timeKey] = 0
        adVisitors[timeKey] = 0
      }
      adSales[timeKey] += item.adSales
      adVisitors[timeKey] += item.adVisitors
      groupedData[timeKey] = formatNumber(adSales[timeKey] / adVisitors[timeKey] * 100)
    
    break;
    }
    case 'cpa': {
      // 处理CPA, ∑广告花费 / ∑总销量
      if (!groupedData[timeKey]) {
        adCostData[timeKey] = 0
        totalBarSales[timeKey] = 0
      }
      adCostData[timeKey] += item.adCostData
      totalBarSales[timeKey] += item.adSales + item.organicSales
      groupedData[timeKey] = formatNumber(adCostData[timeKey] / totalBarSales[timeKey])
    
    break;
    }
    case 'priceData': {
      // 售价, ∑总销售额/ ∑总销量
      if (!groupedData[timeKey]) {
        totalSales[timeKey] = 0
        totalBarSales[timeKey] = 0
      }
      totalSales[timeKey] += item.totalSales
      totalBarSales[timeKey] += item.adSales + item.organicSales
      groupedData[timeKey] = formatNumber(totalSales[timeKey] / totalBarSales[timeKey])
    
    break;
    }
    case 'clickCost': {
      // 点击成本, ∑广告花费/ ∑广告点击量
      if (!groupedData[timeKey]) {
        adCostData[timeKey] = 0
        adVisitors[timeKey] = 0
      }
      adCostData[timeKey] += item.adCostData
      adVisitors[timeKey] += item.adVisitors
      groupedData[timeKey] = formatNumber(adCostData[timeKey] / adVisitors[timeKey])
    
    break;
    }
    case 'acos': {
      // ∑广告花费 / ∑总广告销售额
      if (!groupedData[timeKey]) {
        adCostData[timeKey] = 0
        adSalesData[timeKey] = 0
      }
      adCostData[timeKey] += item.adCostData
      adSalesData[timeKey] += item.adSalesData
      groupedData[timeKey] = formatNumber(adCostData[timeKey] / adSalesData[timeKey]  * 100)
    
    break;
    }
    case 'adClickRate': {
      // ∑广告点击量 / ∑广告展现量
      if (!groupedData[timeKey]) {
        adVisitors[timeKey] = 0
        adImpressions[timeKey] = 0
      }
      adVisitors[timeKey] += item.adVisitors
      adImpressions[timeKey] += item.adImpressions
      groupedData[timeKey] = formatNumber(adVisitors[timeKey] / adImpressions[timeKey]  * 100)
    
    break;
    }
    default: {
      // 其他类型，累加值
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = 0
      }
      groupedData[timeKey] += item[type]
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
const getWeeklyData = (data: IData[], type: IDataProp): any[] => {
  return getGroupedData(data, type, 'week')
}

// 按月分组并累加
const getMonthlyData = (data: IData[], type: IDataProp): any[] => {
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
  const selectedTexts = [
    card1Text.value,
    card2Text.value,
    card3Text.value,
    card4Text.value,
    card5Text.value,
    card6Text.value
  ]
  
  dropdownItems.forEach(item => {
    item.disabled = selectedTexts.includes(item.label)
  })
}

const handleSwitchItem1 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card1Active.value)
  if (can) {
    card1Text.value = item.label
    card1Active.value = false
    updateDropdownItemsDisabled()
  }
}
const handleSwitchItem2 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card2Active.value)
  if (can) {
    card2Text.value = item.label
    card2Active.value = false
    updateDropdownItemsDisabled()
  }
}
const handleSwitchItem3 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card3Active.value)
  if (can) {
    card3Text.value = item.label
    card3Active.value = false
    updateDropdownItemsDisabled()
  }
}
const handleSwitchItem4 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card4Active.value)
  if (can) {
    card4Text.value = item.label
    card4Active.value = false
    updateDropdownItemsDisabled()
  }
}
const handleSwitchItem5 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card5Active.value)
  if (can) {
    card5Text.value = item.label
    card5Active.value = false
    updateDropdownItemsDisabled()
  }
}
const handleSwitchItem6 = (item: { label: string, disabled: boolean }) => {
  const can = handleCanSelect(card6Active.value)
  if (can) {
    card6Text.value = item.label
    card6Active.value = false
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
    adSalesData = data
    organicSalesData = data
  
  break;
  }
  case 'week': {
    adSalesData = getWeeklyData(data, 'adSales')
    organicSalesData = getWeeklyData(data, 'organicSales')
  
  break;
  }
  case 'month': {
    adSalesData = getMonthlyData(data, 'adSales')
    organicSalesData = getMonthlyData(data, 'organicSales')
  
  break;
  }
  // No default
  }
  option.value.xAxis.data = adSalesData.map((item: any) => item.date)
  option.value.series[0].data = adSalesData.map((d: any) => d.adSales)
  option.value.series[1].data = organicSalesData.map((d: any) => d.organicSales)

  updateYAxisData(data)
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
      
      break;
      }
      case 'week': {
        processedData = getWeeklyData(data, prop)
      
      break;
      }
      case 'month': {
        processedData = getMonthlyData(data, prop)
      
      break;
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
      }
    },
    grid: {
      left: '60',
      bottom: '6%',
      right: '60',
      top: '13%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map((item: any) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        // fontWeight: 'bold',
        fontSize: '14px'
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
          fontSize: '14px'
        },
        axisLabel: {
          // fontWeight: 'bold',
          fontSize: '14px'
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409EFF',
          },
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
      // {
      //   type: 'value',
      //   name: '总销售额',
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
        data: data.map((item: any) => item.adSales),
        barWidth: 20,
        itemStyle: {
          color: '#409EFF',
        },
        opacity: 0.9,
        stack: 'sales'
      },
      {
        name: '自然销量',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.organicSales),
        barWidth: 20,
        itemStyle: {
          color: '#67C23A',
        },
        opacity: 0.9,
        stack: 'sales'
      },
    ],
  };

  // 设置图表实例的配置项
  chartInstance?.setOption(option.value);
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
    yAxis.offset = Math.floor(index / 2) * 60; // 每两个 Y 轴之间间隔 60px
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
        offset: (Math.floor(currentYAxisCount / 2)) * 60,
        nameTextStyle: {
          // fontWeight: 'bold',
          color: getYAxisColor(),
          fontSize: '14px',
          align: currentYAxisCount % 2 === 0 ? 'right' : 'left',
        },
        axisLabel: {
          // fontWeight: 'bold',
          formatter: getYAxisFormat(dataGroup),
          fontSize: '14px'
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
        boundaryGap: [0, 0.1]  // 为顶部留出空间
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
        focus: 'series'
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
    const isGroupEmpty = option.value.series.every(
      (s: any) => s.yAxisIndex !== yAxisMapping.get(dataGroup)
    )
    
    if (isGroupEmpty) {
      const yAxisIndex = yAxisMapping.get(dataGroup)

      yAxisMapping.delete(dataGroup)
      currentYAxisCount--

      // 更新所有 series 的 yAxisIndex
      option.value.series.forEach((s: any) => {
        if (s.yAxisIndex > yAxisIndex) {
          s.yAxisIndex--  // 大于已删除的 Y 轴的index，都减一
        }
      })

      // 移除 Y 轴配置
      option.value.yAxis = option.value.yAxis.filter((yAxis: any, index: number) => index !== yAxisIndex)

      updateYAxisIndex()  // 更新 yAxisMapping 和 series 的对应索引
      updateYAxisOffsets()
    }
  }
  updateYAxisData(data)
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
type IDataGroup =  'price1' | 'price2' | 'percent1'| 'percent2' | 'percent3'| 'int1'| 'int2'| 'int3'| 'int4'| 'int5' | 'int6' | 'int7'

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
  switch (clickCard.value) {
  case 'card1': {
    return '#ff99cc'
  }
  case 'card2': {
    return '#E6A23C'
  }
  case 'card3': {
    return '#34a9a9'
  }
  case 'card4': {
    return '#e36060'
  }
  case 'card5': {
    return '#8a7ae3'
  }
  case 'card6': {
    return '#ffd700'
  }
  default: {
    return '#999'
  }
  }
}

// 根据数据组和数据名称获取数据
function getDataForName(dataName: string) {
  const prop = nameMapProp[dataName]
  return data.map((item: any) => item[prop]) || []
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
const handleCard1Click = () => {
  card1Active.value = !card1Active.value
  
  if (card1Active.value) {
    selectedItems.push(card1Text.value)
    clickCard.value = 'card1'
  }
  const dataGroup = getGroup(card1Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card1Active.value, dataGroup, card1Text.value) 
  if (moreThan3) {
    card1Active.value = false
    selectedItems.pop()
  }
}

const handleCard2Click = () => {
  card2Active.value = !card2Active.value
  
  if (card2Active.value) {
    selectedItems.push(card2Text.value)
    clickCard.value = 'card2'
  } 
  const dataGroup = getGroup(card2Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card2Active.value, dataGroup, card2Text.value) 
  if (moreThan3) {
    card2Active.value = false
    selectedItems.pop()
  }
}
const handleCard3Click = () => {
  card3Active.value = !card3Active.value

  if (card3Active.value) {
    selectedItems.push(card3Text.value)
    clickCard.value = 'card3'
  }
  const dataGroup = getGroup(card3Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card3Active.value, dataGroup, card3Text.value) 
  if (moreThan3) {
    card3Active.value = false
    selectedItems.pop()
  }
}
const handleCard4Click = () => {
  card4Active.value = !card4Active.value
  
  if (card4Active.value) {
    selectedItems.push(card4Text.value)
    clickCard.value = 'card4'
  }
  const dataGroup = getGroup(card4Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card4Active.value, dataGroup, card4Text.value) 
  if (moreThan3) {
    card4Active.value = false
    selectedItems.pop()
  }
}
const handleCard5Click = () => {
  card5Active.value = !card5Active.value
  
  if (card5Active.value) {
    selectedItems.push(card5Text.value)
    clickCard.value = 'card5'
  }
  const dataGroup = getGroup(card5Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card5Active.value, dataGroup, card5Text.value) 
  if (moreThan3) {
    card5Active.value = false
    selectedItems.pop()
  }
}
const handleCard6Click = () => {
  card6Active.value = !card6Active.value
 
  if (card6Active.value) {
    selectedItems.push(card6Text.value)
    clickCard.value = 'card6'
  }
  const dataGroup = getGroup(card6Text.value) as IDataGroup
  const moreThan3 = handleSelectionChange(card6Active.value, dataGroup, card6Text.value) 
  if (moreThan3) {
    card6Active.value = false
    selectedItems.pop()
  }
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

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}


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
    handleSwitchTime()
  }
  // 初始化下拉项的禁用状态
  updateDropdownItemsDisabled()
})

onBeforeUnmount(() => chartObserver.disconnect());

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