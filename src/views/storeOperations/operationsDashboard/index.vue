<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-row :gutter="10" style="height: 100%">
      <el-col :span="18" style="height: 100%">
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
          <div style="height: 500px; margin-bottom: 10px;">
            <vab-card class="card5" style="height: 100%">
              <vab-query-form>
                <vab-query-form-left-panel :span="12">
                  <el-form inline>
                    <el-form-item label="运营">
                      <el-select style="max-width: 2em"/>
                    </el-form-item>
                    <el-form-item label="开发人">
                      <el-select style="max-width: 2em"/>
                    </el-form-item>
                    <el-form-item label="站点">
                      <el-select style="max-width: 3em"/>
                    </el-form-item>
                  </el-form>
                </vab-query-form-left-panel>
                <vab-query-form-right-panel :span="12">
                  <el-form inline>
                    <el-form-item>
                      <el-radio-group>
                        <el-radio style="margin-right: 10px;" value="0">同比</el-radio>
                        <el-radio style="margin-right: 10px;" value="1">环比</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item >
                      <el-select style="max-width: 3em; margin-right: 10px;">
                        <el-option 
                          v-for="item in dateOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-date-picker
                        end-placeholder="结束日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        style="max-width: 18em;"
                        type="daterange"
                      />
                    </el-form-item>
                  </el-form>
                </vab-query-form-right-panel>
              </vab-query-form>
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
                  <el-radio-group v-model="timeRadio" size="small" @change="handleSwitchTime">
                    <el-radio-button label="日" value="day" />
                    <el-radio-button label="周" value="week" />
                    <el-radio-button label="月" value="month" />
                  </el-radio-group>
                </vab-query-form-right-panel>
              </vab-query-form>
              <div ref="chartContainer1" style="width: 100%; height: 250px;"></div>
            </vab-card>
          </div>
          <div style=" display: flex;flex: 1; gap: 10px;">
            <vab-card class="card2-title" style=" display: flex;flex: 1; flex-direction: column; margin-bottom: 0;" title="产品成本波动监控">
              <el-table border :data="fakeTableData3" size="small" style="flex: 1">
                <el-table-column label="日期" min-width="115" prop="date"/>
                <el-table-column label="SKU" min-width="160" prop="sku">
                  <template #default="{ row }">
                    <span v-html="row.sku"></span>
                  </template>
                </el-table-column>
                <el-table-column label="价格变动" min-width="110" prop="price"/>
                <el-table-column label="毛利率变动" min-width="110" prop="profit"/>
                <el-table-column label="类型" min-width="125" prop="type"/>
                <el-table label="站点" min-width="110" prop="site"/>
              </el-table>
              <vab-pagination 
                :current-page="queryForm2.pageNo"
                :page-size="queryForm2.pageSize"
                :total="total2"
                @current-change="handleCurrentChange2"
                @size-change="handleSizeChange2"

              />
            </vab-card>
            <vab-card class="card3-title" style=" display: flex;flex: 1; flex-direction: column; margin-bottom: 0;" title="即将断货产品预警">
              <el-table border :data="fakeTableData3" size="small" style="flex: 1">
                <el-table-column label="SKU" min-width="150" prop="sku">
                  <template #default="{ row }">
                    <span v-html="row.sku"></span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="可售天数" min-width="100" prop="availableDays"/>
                <el-table-column align="center" label="预计断货" min-width="100" prop="expectedOutOfStock"/>
                <el-table-column align="center" label="月销量" min-width="90" prop="monthlySales"/>
                <el-table-column align="center" label="剩余库存" min-width="100" prop="remainingStock"/>
                <el-table-column align="center" label="广告" min-width="70" prop="advertisement">
                  <template #default="{ row }">
                    <el-tag v-if="row.advertisement === '开'" type="danger">{{ row.advertisement }}</el-tag>
                    <el-tag v-if="row.advertisement === '关'" type="success">{{ row.advertisement }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="当前毛利" min-width="100" prop="currentProfit">
                  <template #default="{ row }">
                    <span :class="{'green': row.currentProfit >= 25, 'red': row.currentProfit < 25}">{{ row.currentProfit }}%</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="站点" min-width="110" prop="site"/>
              </el-table>
              <vab-pagination 
                :current-page="queryForm1.pageNo"
                :page-size="queryForm1.pageSize"
                :total="total1"
                @current-change="handleCurrentChange1"
                @size-change="handleSizeChange1"
              />
            </vab-card>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%">
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
          <div style="height: 500px; margin-bottom: 10px;">
            <vab-card class="card4" style="height: 100%;" title="库龄">
              <div style=" margin-top: 25px;text-align: right;">
                <el-radio-group v-model="ageRadio" @change="handleSwitchBar">
                  <el-radio-button label="数量" :value="0" />
                  <el-radio-button label="占比" :value="1" />
                </el-radio-group>
              </div>
              <el-row>
                <el-col :span="9">
                  <div ref="chartContainer2" style="width: 100%; height: 300px; margin-top: 30px"></div>
                </el-col>
                <el-col :span="15">
                  <el-table :data="percentageAgeData" :header-cell-style="headerCellStyle" max-height="280" show-summary style="margin-top: 30px">
                    <el-table-column label="项目" min-width="110" prop="name">
                      <template #default="{ row, $index }">
                        <span class="table-item" :style="{ '--dot-color': storageAgeColorList[$index] }">
                          {{ row.name }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="ageRadio === 0" align="right" label="FBA仓" min-width="90" prop="value"/>
                    <el-table-column v-if="ageRadio === 1" align="right" label="FBA仓" min-width="90" prop="percentage">
                      <template #default="{ row }">
                        {{ row.percentage }}%
                      </template>
                    </el-table-column>
                    <el-table-column label="预估下月费用" min-width="120"/>
                  </el-table>
                </el-col>
              </el-row>
            </vab-card>
          </div>
          <div style="flex: 1;">
            <vab-card class="card1-title" style=" display: flex; flex-direction: column;height: 100%;" title="断货后即将上架产品">
              <el-table border :data="fakeData1" size="small" style="flex: 1">
                <el-table-column label="SKU" min-width="170" prop="sku"/>
                <el-table-column label="断货前月销量" min-width="130" prop="sales"/>
                <el-table-column label="最近入库" min-width="100" prop="recently">
                  <template #default="{ row }">
                    <span :class="{ 'green': row.recently === '已入库' }">{{ row.recently }}</span>
                  </template>
                </el-table-column>
                <el-table label="站点" min-width="110" prop="site"/>
              </el-table>
            </vab-card>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'
import { dateOption, storageAgeColorList } from '../constantOption'
import { getWeekOfYear } from '/@/utils/dateUtils'

defineOptions({
  name: 'OperationsDashboard'
})

// const leftCards = [
//   { id: 1, title: "库龄", class: "card4" },
//   { id: 2, title: "断货后即将上架产品", class: "card1-title" }
// ]

// const rightCards = [
//   { id: 3, title: "产品成本波动监控", class: "card2-title" },
//   { id: 4, title: "即将断货产品预警", class: "card3-title" }
// ]
const amount = 42442.71
// 控制数字显示为美元形式
const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// 六个卡片是否选择状态
const card1Active = ref<boolean>(false)
const card2Active = ref<boolean>(false)
const card3Active = ref<boolean>(false)
const card4Active = ref<boolean>(false)
const card5Active = ref<boolean>(false)
const card6Active = ref<boolean>(false)
const card1Text = ref<string>('总销售额')
const card2Text = ref<string>('净利润')
const card3Text = ref<string>('净利润率')
const card4Text = ref<string>('广告销售额')
const card5Text = ref<string>('广告销售占比')
const card6Text = ref<string>('ACOS')
const dropdownItems = reactive<{ label: string, disabled: boolean }[]>([
  { label: '总销售额', disabled: false },
  { label: '净利润', disabled: false },
  { label: '净利润率', disabled: false },
  { label: '广告销售额', disabled: false },
  { label: '广告销售占比', disabled: false },
  { label: 'ACOS', disabled: false },
  { label: 'TACOS', disabled: false },
  { label: '退款率', disabled: false },
  { label: '预计下月仓储费', disabled: false },
])
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
let selectedItems: string[] = []
const clickCard = ref<string>('')
const yAxisMapping = new Map() // 字段所属的组 -> yAxisIndex
let currentYAxisCount = 1 // 当前已有的 Y 轴数量（柱状图默认占用 yAxis[0]）
const ageRadio = ref<number>(0)
const timeRadio = ref<string>('day')
const option1 = ref<any>({})
const option2 = ref<any>({})
type IData = {
  date: string
  sales: number
  totalSales: number
  adSalesData: number
  netProfitData: number
  expectedStorageCostData: number
  refundRate: number
  netProfitMargin: number
  tacos: number
  acos: number
  adSalesRatio: number
  refundPrice: number
  adCostData: number
}
type IYProp = 'sales' | 'totalSales'|'adSalesData'|'netProfitData'|'expectedStorageCostData'|
  'refundRate' | 'netProfitMargin' | 'tacos' | 'acos' | 'adSalesRatio' | 'refundPrice' | 'adCostData'
// name -> prop
const nameMapProp: Record<string, IYProp> = {
  '销量': 'sales',
  '总销售额': 'totalSales',
  '广告销售额': 'adSalesData',
  '广告花费': 'adCostData',
  '净利润': 'netProfitData',
  '预计下月仓储费': 'expectedStorageCostData',
  '退款金额': 'refundPrice',
  '退款率': 'refundRate',
  '净利润率': 'netProfitMargin',
  'TACOS': 'tacos',
  'ACOS': 'acos',
  '广告销售占比': 'adSalesRatio'
}
const data1 = ref<IData[]>([
  { date: "2023-10-14", sales: 100, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-10-19", sales: 50, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-11-01", sales: 100, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-11-02", sales: 50, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-12-01", sales: 100, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-12-02", sales: 50, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-12-08", sales: 100, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   },
  { date: "2024-12-09", sales: 100, totalSales: 100, adSalesData: 150, netProfitData: 33, expectedStorageCostData: 25, 
    refundRate: 70, netProfitMargin: 110, tacos: 33.33, acos: 26.75, adSalesRatio: 30, refundPrice: 10, adCostData: 15
   }
])
const data2 = ref<any[]>([
  { name: '0-90', value: 11800 },
  { name: '91-180', value: 2644 },
  { name: '181-270+', value: 1175 },
  { name: '271-365', value: 152 },
  { name: '365+', value: 293 },
])
// 计算库龄总和
const totalAgeValue = data2.value.reduce((sum, item) => sum + item.value, 0)
let percentageAgeData: any[]
const fakeData1 = [
  {
    sku: 'HOME-0020-WHT\n碗架-木把手白色',
    sales: 500,
    recently: '11天/389',
    site: '美国亚马逊'
  },
  {
    sku: 'HOME-0020-WHT\n碗架-木把手白色',
    sales: 200,
    recently: '已入库',
    site: '美国亚马逊'
  },
]
const fakeTableData3 = [
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: 20,
    site: '美国亚马逊',
    date: '2024-12-30',
    type: 'SKU实际价格',
    price: '20->25',
    profit: '30%->25%'
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: 25,
    site: '美国亚马逊',
    date: '2024-12-30',
    type: 'FBA配送费',
    price: '30->28',
    profit: '28%->30%'
  },
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: 30,
    site: '美国亚马逊',
    date: '2024-12-30',
    type: '打包成本',
    price: '20->25',
    profit: '30%->25%'
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: 20,
    site: '美国亚马逊',
    date: '2024-12-30',
    type: '头程运费',
    price: '20->25',
    profit: '30%->25%'
  },
  {
    sku: 'SKU123456<br />碗架-木把手白色',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '开',
    currentProfit: 20,
    site: '美国亚马逊',
    date: '2024-12-30',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: 20,
    site: '美国亚马逊',
    date: '2024-12-30',
  },
  {
    sku: 'SKU123456<br />奶酪板-磁吸拼接',
    availableDays: 30,
    expectedOutOfStock: '10天',
    monthlySales: 500,
    remainingStock: 200,
    advertisement: '关',
    currentProfit: 20,
    site: '美国亚马逊',
    date: '2024-12-30',
  },
]

const queryForm1 = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total1 = ref<number>(0)
const queryForm2 = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total2 = ref<number>(0)
const getGroupedData = (data: IData[], type: IYProp, groupBy: 'week' | 'month'): any[] => {
  const groupedData: Record<string, number> = {}
  const adCostData: Record<string, number> = {} // ∑广告花费
  const totalSales: Record<string, number> = {} // ∑总销售额
  const netProfitData: Record<string, number> = {} // ∑净利润
  const refundPrice: Record<string, number> = {} // ∑退款金额
  const adSalesData: Record<string, number > = {} // ∑广告销售额
  
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
    case 'adSalesRatio': {
      // 总广告销售额 / ∑总销售额
      if (!groupedData[timeKey]) {
        totalSales[timeKey] = 0
        adSalesData[timeKey] = 0
      }
      totalSales[timeKey] += item.totalSales
      adSalesData[timeKey] += item.adSalesData
      groupedData[timeKey] = formatNumber(totalSales[timeKey] / adSalesData[timeKey]  * 100)
    
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
const getWeeklyData = (data: IData[], type: IYProp): any[] => {
  return getGroupedData(data, type, 'week')
}

// 按月分组并累加
const getMonthlyData = (data: IData[], type: IYProp): any[] => {
  return getGroupedData(data, type, 'month')
}

// 切换 日，周，月
const handleSwitchTime = () => {
 
  let salesData: any[] = []
  switch (timeRadio.value) {
  case 'day': {
    salesData = data1.value
  
  break;
  }
  case 'week': {
    salesData = getWeeklyData(data1.value, 'sales')
  
  break;
  }
  case 'month': {
    salesData = getMonthlyData(data1.value, 'sales')
  
  break;
  }
  // No default
  }
  option1.value.xAxis.data = salesData.map((item: any) => item.date)
  option1.value.series[0].data = salesData.map((d: any) => d.sales)

  updateYAxisData(data1.value)
  updateChart1()
}
// 更新 Y 轴数据随时间切换的函数
const updateYAxisData = (data: any[]) => {
  option1.value.series.forEach((s: any, index: number) => {
    if (index !== 0) {
      const prop = nameMapProp[s.name]
      let processedData: any[] = []
      switch (timeRadio.value) {
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
// 更新剩余的 Y 轴和系列的索引
function updateYAxisIndex() {
  Array.from(yAxisMapping.keys()).forEach((group, index) => {
    yAxisMapping.set(group, index + 1) // 保留 0 为柱状图
    option1.value.series.forEach((s: any) => {
      if (s.yAxisIndex === index + 1) {
        s.yAxisIndex = index + 1
      }
    })
  })
}
type IDataGroup =  'price1' | 'percent1'| 'percent2'

const getYAxisFormat = (groupName: string) => {
  if (groupName === 'price1') {
    return '${value}'
  } else if (groupName === 'percent1' || groupName === 'percent2') {
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
  return data1.value.map((item: any) => item[prop]) || []
}
function updateYAxisOffsets() {
  // 重设每个 Y 轴的 offset，确保不重叠
  option1.value.yAxis.forEach((yAxis: any, index: number) => {
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
      option1.value.yAxis.push({
        type: 'value',
        name: dataName,
        position: currentYAxisCount % 2 === 0 ? 'left' : 'right',
        offset: (Math.floor(currentYAxisCount / 2)) * 50,
        nameTextStyle: {
          // fontWeight: 'bold',
          color: getYAxisColor(),
          // fontSize: '14px',
          align: 'center',
        },
        axisLabel: {
          // fontWeight: 'bold',
          formatter: getYAxisFormat(dataGroup),
          // fontSize: '14px'
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
    option1.value.series.push({
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
    const seriesIndex = option1.value.series.findIndex((s: any) => s.name === dataName)
    if (seriesIndex !== -1) {
      option1.value.series.splice(seriesIndex, 1) // 移除对应的 series
    }
  
    // 如果当前字段所属的组的所有 series 都被移除，移除对应的 Y 轴
    const isGroupEmpty = option1.value.series.every(
      (s: any) => s.yAxisIndex !== yAxisMapping.get(dataGroup)
    )
    
    if (isGroupEmpty) {
      const yAxisIndex = yAxisMapping.get(dataGroup)

      yAxisMapping.delete(dataGroup)
      currentYAxisCount--

      // 更新所有 series 的 yAxisIndex
      option1.value.series.forEach((s: any) => {
        if (s.yAxisIndex > yAxisIndex) {
          s.yAxisIndex--  // 大于已删除的 Y 轴的index，都减一
        }
      })

      // 移除 Y 轴配置
      option1.value.yAxis = option1.value.yAxis.filter((yAxis: any, index: number) => index !== yAxisIndex)

      updateYAxisIndex()  // 更新 yAxisMapping 和 series 的对应索引
      updateYAxisOffsets()
    }
  }
  updateYAxisData(data1.value)
  updateChart1()
  return false
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
const groups = {
  price1: ['总销售额', '广告销售额', '净利润', '预计下月仓储费'],
  percent1: ['退款率', '净利润率', 'TACOS', 'ACOS'],
  percent2: ['广告销售占比'],
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
const initChart1 = () => {
  // 初始化图表的配置项
  option1.value = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params[0].name}</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          const groupName = getGroup(item.seriesName)
          let value = item.value
          if (groupName === 'price1') {
            value = `$${value}`
          } else if (groupName === 'percent1' || groupName === 'percent2') {
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
      left: '50',
      bottom: '6%',
      right: '60',
      top: '13%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data1.value.map((item: any) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      // axisLabel: {
      //   // fontWeight: 'bold',
      //   fontSize: '14px'
      // },
    },
    yAxis: [
      {
        type: 'value',
        name: '销量',
        position: 'left',
        nameTextStyle: {
          color: '#409EFF',
          align: 'center',
          // fontSize: '14px'
        },
        // axisLabel: {
        //   // fontWeight: 'bold',
        //   fontSize: '14px'
        // },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409EFF',
          },
        },
        boundaryGap: [0, 0.1]  // 为顶部留出空间
      },
    ],
    series: [
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 0,
        data: data1.value.map((item: any) => item.sales),
        barWidth: 20,
        itemStyle: {
          color: '#409EFF',
        },
        opacity: 0.9,
        stack: 'sales'
      },
    ],
  };

  // 设置图表实例的配置项
  chartInstance1?.setOption(option1.value);
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
      bottom: 10,
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
const updateChart1 = () => {
  chartInstance1?.setOption(option1.value, true)
}
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value, true)
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
const handleCurrentChange1 = (value: number) => {
  queryForm1.pageNo = value
  // fetchData()
}
const handleSizeChange1 = (value: number) => {
  queryForm1.pageNo = 1
  queryForm1.pageSize = value
  // fetchData()
}
const handleCurrentChange2 = (value: number) => {
  queryForm2.pageNo = value
  // fetchData()
}
const handleSizeChange2 = (value: number) => {
  queryForm2.pageNo = 1
  queryForm2.pageSize = value
  // fetchData()
}
const headerCellStyle = (): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
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
  updateDropdownItemsDisabled()
})
</script>

<style lang="scss" scoped>
.card1-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-size: calc(var(--el-font-size-base) + 2px);
      font-weight: 600;  
      color: #6aa74d;
      background-color: rgba(153, 219, 112, 0.2); 
    }
    .el-card__body {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
    }
  }
}
.green {
  color: #67C23A; 
}
.red {
  color: #F56C6C;
}
.table-item {
  position: relative;
  padding-left: 13px; 

  &::before {
    position: absolute;
    top: 50%;
    left: -5px;
    width: 10px;
    height: 10px;
    content: '';
    background-color: var(--dot-color, gray); /* 默认颜色 */
    border-radius: 16px;
    transform: translateY(-50%);
  }
}
.card2-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-size: calc(var(--el-font-size-base) + 2px);
      font-weight: 600;  
      color: #4f6d7a;
      background-color: rgba(115, 153, 192, 0.2);  
    }
    .el-card__body {
      display: flex;
      flex-grow: 1; /* 确保表格占满剩余空间 */
      flex-direction: column;
    }
  }
}
.card3-title {
  :deep() {
    .el-card__header {
      justify-content: center;
      padding: 12px 20px; /* 增加一些内边距 */
      font-size: calc(var(--el-font-size-base) + 2px); /* 增加字体大小 */
      font-weight: 600; 
      color: #ff8c69;
      background-color: rgba(253, 149, 118, 0.15);  
    }

    .el-card__body {
      display: flex;
      flex-grow: 1; /* 确保表格占满剩余空间 */
      flex-direction: column;
    }
  }
}
.card4 {
  :deep() {
    .el-card__header {
      padding-bottom: 0;
      border-bottom: 0;
    }
    .el-card__body {
      padding-top: 0;
      padding-left: 0;
    }
  }
}
.card5 {
  :deep() {
    .el-card__body {
      padding-bottom: 0;
    }
  }
}
.top-card {
  position: relative;
  height: 120px !important;
  border-radius: 7%;

  &:hover {
    cursor: pointer;
  }
  :deep() {
    .el-card__body {
      padding-top: 0;
      padding-right: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
    }
  }
      
  .el-tag {
    float: right;
  }

  .parting-line {
    float: top;
    width: 100%;
    height: 6px;
    margin-bottom: 10px;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
    background: #e9f5fe;
    /* 梯形形状：
      - 左上角 (0, 0)
      - 右上角 (100%, 0)
      - 右下角 (95%, 100%)
      - 左下角 (5%, 100%) */
    &-primary {
      background: #ff99cc;
    }
    &-orange {
      background: #E6A23C;
    }
    &-green {
      background: #34a9a9;
    }
    &-red {
      background: #e36060;
    }
    &-purple {
      background: #8a7ae3; // 一种柔和的紫色
    }
    &-yellow {
      background: #ffd700; // 明亮的金黄色
    }
  }
  p {
    margin-top: 13px;
    margin-bottom: 13px;
    font-size: 24px;
    font-weight: 550;
  }

  .right-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    color: var(--el-color-primary);
    text-align: center;
    background: var(--el-color-primary-light-9);
    border-radius: 50%;
    transform: translateY(-50%);

    i {
      font-size: 35px;
    }
  }

  .bottom {
    white-space: nowrap;
    &-up {
      .ri-arrow-up-line {
        width: 18px;
        height: 18px;
        margin: 0 3px 0 2px;
        color: var(--el-color-success);
        background: var(--el-color-success-light);
        border-radius: 50%;
      }

      span {
        color: var(--el-color-success);
      }
    }
    &-down {
      .ri-arrow-down-line {
        width: 18px;
        height: 18px;
        margin: 0 3px 0 2px;
        color: var(--el-color-warning);
        background: var(--el-color-warning-light);
        border-radius: 50%;
      }

      span {
        color: var(--el-color-warning);
      }
    }
  }
}
</style>