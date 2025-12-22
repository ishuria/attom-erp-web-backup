<template>
  <div class="overview-container">
    <vab-card data-label="card" style="display: flex; flex-direction: column; height: 550px; margin-bottom: 10px">
      <el-row :gutter="20">
        <el-col v-for="(card, index) in cards" :key="index" :span="4">
          <trend-card
            :active="card.active"
            :color-type="card.colorType"
            :dropdown-items="dropdownItems"
            :loading="chartLoading"
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
          <el-switch
            v-model="showOperationLogMarkPoint"
            active-text="显示操作日志"
            inactive-text="隐藏操作日志"
            style="margin-right: 20px"
            @change="handleToggleMarkPoint"
          />
          <el-radio-group v-model="radio" size="small" @change="() => handleSwitchTime()">
            <el-radio-button label="日" value="day" />
            <el-radio-button label="周" value="week" />
            <el-radio-button label="月" value="month" />
          </el-radio-group>
        </vab-query-form-right-panel>
      </vab-query-form>
      <div ref="chartContainer" v-loading="chartLoading" style="width: 100%; height: 350px"></div>
    </vab-card>
    <div style="margin-bottom: 10px; text-align: right">
      <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
        <template #reference>
          <el-button>
            <vab-icon icon="settings-line" />
          </el-button>
        </template>
        <vab-draggable v-model="checkList1" :animation="600" filter=".non-draggable" handle=".handle" :on-move="handleMove">
          <div
            v-for="item in checkList1"
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
      v-loading="tableLoading"
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
    <!-- 操作日志明细对话框 -->
    <vab-dialog v-model="operationLogDialogVisible" title="操作日志明细" width="45%">
      <el-table border :data="operationLogDetailList" max-height="700">
        <el-table-column align="center" label="日期" prop="date" width="190" />
        <el-table-column align="center" label="类型" prop="type" width="100" />
        <el-table-column label="内容" min-width="170" prop="content">
          <template #default="{ row }">
            <el-link class="content-link" type="primary">
              <span class="content-text">{{ row.content }}</span>
            </el-link>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
        </template>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Hide } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import {
  trendOverviewCardConfig,
  trendOverviewColumns,
  trendOverviewDropdownItems,
  trendOverviewGroups,
  trendOverviewNameMapProp,
  type IDataProp,
} from '../constantOption'
import { getOperationLog, getTrendOverviewChart, getTrendOverviewTable } from '/@/api/devlocal/productAnalysis'
import { ICardSummary, IGetOperationLog, ITrendOverview } from '/@/type/storeOperation/productAnalysisType'
import { formatDateToString, getWeekOfYear } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabTrendOverview',
})

// Props 定义
interface Props {
  selectField?: number // 展示维度：0=SKU, 1=ASIN, 2=父体ASIN
  compareType?: number // 同比/环比：0=同比, 1=环比
  selectDateRange?: [string, string] // 日期范围
  selectedSku?: string // 选择的SKU（当selectField为0时使用）
  selectedSite?: number | undefined // 选择的站点
  asin?: string // ASIN，用于获取操作日志
}

const props = withDefaults(defineProps<Props>(), {
  selectField: 0,
  compareType: 0,
  selectDateRange: () => ['', ''],
  selectedSku: '',
  selectedSite: undefined,
  asin: '',
})

const tableLoading = ref<boolean>(false) // 表格加载状态
const chartLoading = ref<boolean>(false) // 图表加载状态
// 切换日，周，月
const radio = ref<string>('day')
const amount = 42442.71
// 控制数字显示为美元形式
const formattedAmount = amount.toString()
const chartContainer = ref(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const route = useRoute()
// 获取币种符号，从路由参数获取，默认为美元符号
const currencySymbol = ref<string>('')
const checkList1 = computed(() => {
  return trendOverviewColumns.filter((item) => item.checked)
})
// 记录点击的是哪个card
const clickCard = ref<string>('')
// 操作日志相关
const operationLogCountByDate = ref<Record<string, number>>({}) // 按日期统计的操作日志数量
const operationLogDialogVisible = ref<boolean>(false) // 操作日志明细对话框显示状态
const operationLogDetailList = ref<Array<{ date: string; type: string; content: string }>>([]) // 操作日志明细列表
const showOperationLogMarkPoint = ref<boolean>(true) // 控制操作日志泡泡的显示/隐藏
const typeMap: Record<number, string> = {
  0: '手动输入',
  1: '系统抓取',
  2: 'SP广告',
}

// 卡片配置数组（基于常量配置初始化）
const cards = ref(
  trendOverviewCardConfig.map((config) => ({
    title: config.title,
    value: '',
    previousValue: '',
    trendPercentage: '',
    trendType: 'down' as const,
    active: false,
    colorType: config.colorType,
  }))
)

// 下拉选项（基于常量配置，需要响应式以支持 disabled 状态）
const dropdownItems = reactive<{ label: string; disabled: boolean }[]>(trendOverviewDropdownItems.map((item) => ({ ...item })))

// 字段分组配置
const groups = trendOverviewGroups

// name -> prop (根据 ITrendOverview 接口，与 constantOption.ts 中的 trendOverviewColumns 对应)
const nameMapProp: Record<string, IDataProp> = trendOverviewNameMapProp as Record<string, IDataProp>

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
  const organicSalesAmountData: Record<string, number> = {} // ∑自然销售额
  const adSalesAmountData: Record<string, number> = {} // ∑广告销售额
  const impressionsData: Record<string, number> = {} // ∑广告展现量
  const pageViewsTotalData: Record<string, number> = {} // ∑pageViewsTotal
  const organicClicksData: Record<string, number> = {} // ∑自然点击量
  // 用于计算平均值的计数对象（预计下月仓储费和库存需要计算平均值）
  const countData: Record<string, number> = {}

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
        const value = item[type]
        // 如果是数组，取第一个类别的排名（或最小值）
        if (Array.isArray(value)) {
          if (value.length > 0) {
            const minRank = Math.min(...value.map((v: { category: string; smallRank: number }) => v.smallRank))
            if (minRank < groupedData[timeKey]) {
              groupedData[timeKey] = minRank
            }
          }
        } else if (typeof value === 'number' && value < groupedData[timeKey]) {
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
        totalSalesData[timeKey] += item.volume ?? 0
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
        totalSalesData[timeKey] += item.volume ?? 0
        groupedData[timeKey] = formatNumber((totalSalesData[timeKey] / sessionsTotalData[timeKey]) * 100)

        break
      }
      // case 'organicConversionRate':
      // case 'adConversionRate': {
      //   // 处理自然转化率/广告转化率类型，计算 ∑销量 / ∑点击量
      //   if (!groupedData[timeKey]) {
      //     adSalesData[timeKey] = 0
      //     clicksData[timeKey] = 0
      //   }
      //   if (type === 'organicConversionRate') {
      //     adSalesData[timeKey] += item.organicSales ?? 0
      //     clicksData[timeKey] += item.organicClicks ?? 0
      //   } else {
      //     adSalesData[timeKey] += item.adSales ?? 0
      //     clicksData[timeKey] += item.clicks ?? 0
      //   }
      //   groupedData[timeKey] = formatNumber((adSalesData[timeKey] / clicksData[timeKey]) * 100)

      //   break
      // }
      case 'cpa': {
        // CPA(获客成本), ∑广告花费 / ∑总销量
        if (!groupedData[timeKey]) {
          spendData[timeKey] = 0
          totalSalesData[timeKey] = 0
        }
        spendData[timeKey] += item.spend ?? 0
        totalSalesData[timeKey] += item.volume ?? 0
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
        totalSalesData[timeKey] += item.volume ?? 0
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
      case 'adClickShare': {
        // ∑广告点击量 / ∑pageViewsTotal
        if (!groupedData[timeKey]) {
          clicksData[timeKey] = 0
          pageViewsTotalData[timeKey] = 0
        }
        clicksData[timeKey] += item.clicks ?? 0
        pageViewsTotalData[timeKey] += item.pageViewsTotal ?? 0
        groupedData[timeKey] = formatNumber((clicksData[timeKey] / pageViewsTotalData[timeKey]) * 100)
        break
      }
      case 'organicClickShare': {
        // ∑自然点击量 / ∑pageViewsTotal
        if (!groupedData[timeKey]) {
          organicClicksData[timeKey] = 0
          pageViewsTotalData[timeKey] = 0
        }
        organicClicksData[timeKey] += item.organicClicks ?? 0
        pageViewsTotalData[timeKey] += item.pageViewsTotal ?? 0
        groupedData[timeKey] = formatNumber((organicClicksData[timeKey] / pageViewsTotalData[timeKey]) * 100)
        break
      }
      default: {
        // 其他类型，累加值
        if (!groupedData[timeKey]) {
          groupedData[timeKey] = 0
        }
        const value = item[type] ?? 0
        // 预计下月仓储费和库存需要计算平均值
        if (type === 'estimatedStorageCostNextMonth' || type === 'stock') {
          groupedData[timeKey] += value
          // 计数
          if (!countData[timeKey]) {
            countData[timeKey] = 0
          }
          countData[timeKey]++
        } else {
          // 其他类型直接累加
          groupedData[timeKey] += value
          // 保留两位小数
          groupedData[timeKey] = formatNumber(groupedData[timeKey])
        }
      }
    }
  })

  return Object.keys(groupedData).map((timeKey) => {
    let value = groupedData[timeKey]
    // 预计下月仓储费和库存需要计算平均值
    if ((type === 'estimatedStorageCostNextMonth' || type === 'stock') && countData[timeKey] && countData[timeKey] > 0) {
      value = formatNumber(value / countData[timeKey])
    }
    return {
      date: timeKey,
      [type]: value,
    }
  })
}
// 金额保留两位小数
const formatNumber = (value: number): number => {
  return Number(value.toFixed(2))
}

// 格式化卡片值（根据字段类型格式化）
const formatCardValue = (fieldName: string, value: number | null): string => {
  if (value == null) return ''
  const groupName = getGroup(fieldName)
  if (groupName === 'price1' || groupName === 'price2') {
    // 金额类型，使用动态币种符号，保留两位小数
    return `${currencySymbol.value}${value.toFixed(2)}`
  } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
    // 百分比类型，保留两位小数
    return `${value.toFixed(2)}%`
  } else {
    // 整数类型，保留两位小数
    return value.toFixed(0)
  }
}

// 格式化对比值（根据字段类型格式化）
const formatCompareValue = (fieldName: string, value: number | null): string => {
  if (value == null) return ''
  const groupName = getGroup(fieldName)
  if (groupName === 'price1' || groupName === 'price2') {
    // 金额类型，使用动态币种符号，保留两位小数
    return `${currencySymbol.value}${value.toFixed(2)}`
  } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
    // 百分比类型，保留两位小数
    return `${value.toFixed(2)}%`
  } else {
    // 整数类型，保留两位小数
    return value.toFixed(0)
  }
}

// 更新卡片数据
const updateCardsData = () => {
  cards.value.forEach((card) => {
    const summary = cardSummary.value[card.title]
    if (summary) {
      // 更新当前值（如果为 null 则显示 "null"）
      if (summary.currentValue != null) {
        card.value = formatCardValue(card.title, summary.currentValue)
      } else {
        card.value = 'null'
      }
      // 更新对比值（如果为 null 则显示 "null"）
      if (summary.compareValue != null) {
        card.previousValue = formatCompareValue(card.title, summary.compareValue)
      } else {
        card.previousValue = 'null'
      }
      // 更新趋势百分比（如果为 null 则显示 "null"）
      if (summary.changePercentage != null) {
        const sign = summary.changePercentage >= 0 ? '+' : ''
        card.trendPercentage = `${sign}${summary.changePercentage.toString()}%`
      } else {
        card.trendPercentage = 'null'
      }
      // 更新趋势类型
      if (summary.changeType) {
        ;(card as { trendType: 'up' | 'down' }).trendType = summary.changeType
      }
    }
  })
}

// 按周分组并累加
const getWeeklyData = (data: ITrendOverview[], type: IDataProp): any[] => {
  return getGroupedData(data, type, 'week')
}

// 按月分组并累加
const getMonthlyData = (data: ITrendOverview[], type: IDataProp): any[] => {
  return getGroupedData(data, type, 'month')
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
  // 如果卡片已激活，切换字段时需要先移除旧字段
  if (cards.value[index].active) {
    // 从选中项中移除旧字段
    const oldTitle = cards.value[index].title
    const oldIndex = selectedItems.indexOf(oldTitle)
    if (oldIndex > -1) {
      selectedItems.splice(oldIndex, 1)
    }
    // 通知图表移除旧字段
    const oldDataGroup = getGroup(oldTitle) as IDataGroup
    handleSelectionChange(false, oldDataGroup, oldTitle)
  }

  // 切换字段
  cards.value[index].title = item.label
  updateDropdownItemsDisabled()
  // 更新卡片数据（因为字段改变了）
  updateCardsData()

  // 选择展示的项后，直接激活并展示对应的折线
  cards.value[index].active = true
  selectedItems.push(item.label)
  const dataGroup = getGroup(item.label) as IDataGroup
  const moreThan3 = handleSelectionChange(true, dataGroup, item.label)
  if (moreThan3) {
    // 如果超过限制，取消激活
    cards.value[index].active = false
    selectedItems.pop()
  } else {
    clickCard.value = `card${index + 1}`
  }
  // 保存状态
  saveState()
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

// 获取存储 key
const getStorageKey = () => {
  return 'VabTrendOverview'
}

// 保存状态到 localStorage
const saveState = () => {
  try {
    const state = {
      cards: cards.value.map((card) => ({
        title: card.title,
        active: card.active,
      })),
      radio: radio.value,
      selectedItems: [...selectedItems],
      showOperationLogMarkPoint: showOperationLogMarkPoint.value,
    }
    localStorage.setItem(getStorageKey(), JSON.stringify(state))
  } catch (error) {
    console.error('保存状态失败:', error)
  }
}

// 从 localStorage 恢复状态
const restoreState = () => {
  try {
    const savedState = localStorage.getItem(getStorageKey())
    if (!savedState) {
      return false
    }

    const state = JSON.parse(savedState)

    // 恢复卡片配置
    if (state.cards && Array.isArray(state.cards)) {
      state.cards.forEach((savedCard: { title: string; active: boolean }, index: number) => {
        if (index < cards.value.length) {
          // 检查保存的 title 是否在下拉项中存在
          const isValidTitle = dropdownItems.some((item) => item.label === savedCard.title)
          if (isValidTitle) {
            cards.value[index].title = savedCard.title
            cards.value[index].active = savedCard.active || false
          }
        }
      })
    }

    // 恢复时间视图
    if (state.radio && ['day', 'week', 'month'].includes(state.radio)) {
      radio.value = state.radio
    }

    // 恢复选中的折线项（需要在数据加载后恢复）
    if (state.selectedItems && Array.isArray(state.selectedItems)) {
      selectedItems = state.selectedItems.filter((item: string) => dropdownItems.some((dropdownItem) => dropdownItem.label === item))
    }

    // 恢复操作日志泡泡显示状态
    if (typeof state.showOperationLogMarkPoint === 'boolean') {
      showOperationLogMarkPoint.value = state.showOperationLogMarkPoint
    }

    return true
  } catch (error) {
    console.error('恢复状态失败:', error)
    return false
  }
}

// 恢复折线显示（在数据加载完成后调用）
const restoreChartLines = () => {
  // 根据恢复的卡片 active 状态，重新激活折线
  cards.value.forEach((card, index) => {
    if (card.active) {
      const dataGroup = getGroup(card.title) as IDataGroup
      if (dataGroup) {
        handleSelectionChange(true, dataGroup, card.title)
        clickCard.value = `card${index + 1}`
      }
    }
  })
}

// 根据数据点数量动态计算柱状图宽度
const calculateBarWidth = (dataLength: number) => {
  // 如果数据点少于30个，使用固定宽度
  if (dataLength <= 30) {
    return 20
  }
  // 如果数据点少于60个，使用较小的固定宽度
  if (dataLength <= 60) {
    return 15
  }
  // 如果数据点少于90个，使用更小的固定宽度
  if (dataLength <= 90) {
    return 10
  }
  // 如果数据点很多（如180天），使用百分比宽度，确保柱状图不会堆在一起
  // 计算每个柱子的可用空间，使用80%的可用空间
  return `${Math.max(80 / dataLength, 0.5)}%`
}

// 根据数据点数量调整 x 轴标签显示策略
const updateXAxisLabel = (dataLength: number) => {
  if (!option.value.xAxis) {
    return
  }

  // 如果数据点很多，调整标签显示策略
  if (dataLength > 60) {
    // 旋转标签，避免重叠
    option.value.xAxis.axisLabel = {
      ...option.value.xAxis.axisLabel,
      fontSize: '12px',
      rotate: 45, // 旋转45度
      interval: Math.ceil(dataLength / 20), // 间隔显示，最多显示20个标签
    }
  } else if (dataLength >= 20) {
    // 中等数量数据点，轻微旋转
    option.value.xAxis.axisLabel = {
      ...option.value.xAxis.axisLabel,
      fontSize: '14px',
      rotate: 30,
      interval: 0, // 显示所有标签
    }
  } else {
    // 少量数据点，正常显示
    option.value.xAxis.axisLabel = {
      ...option.value.xAxis.axisLabel,
      fontSize: '14px',
      rotate: 0,
      interval: 0, // 显示所有标签
    }
  }
}

// 更新柱状图宽度
const updateBarWidth = () => {
  const dataLength = option.value.xAxis?.data?.length || 0
  const barWidth = calculateBarWidth(dataLength)

  // 更新所有柱状图系列的宽度
  if (option.value.series && Array.isArray(option.value.series)) {
    option.value.series.forEach((series: any) => {
      if (series.type === 'bar') {
        series.barWidth = barWidth
      }
    })
  }
}

// 递归计算 y 轴范围，确保包含 0 刻度和固定行数
const row = 5 // 预定行数（刻度数）

const recursion = ({ min, max }: { min: number; max: number }) => {
  if ((max !== 0 && !max) || (min !== 0 && !min)) {
    return { min: 0, max: 0, interval: 0, top: 0, bottom: 0 }
  }

  // 减少一位预定行数，用来展示 0 刻度
  const interval = Math.ceil((max - min) / (row - 1))

  // 将最大最小根据间隔取整
  max = Math.ceil(max / interval) * interval
  min = Math.floor(min / interval) * interval

  // 实际 0 刻度线以上间隔数
  const top = Math.ceil(Math.abs(max) / interval)

  // 实际 0 刻度线以下间隔数
  const bottom = Math.ceil(Math.abs(min) / interval)

  // 实际总间隔数
  const total = top + bottom

  // 根据预定行数，重新推算包含 0 刻度的最终间隔
  const _interval = Math.ceil((total * interval) / row)

  // 根据最终推算间隔，重置最大数
  const _max = Math.ceil(_interval * row + min)

  // 根据最终推算间隔，重置最小数
  const _min = Math.floor(min / _interval) * _interval

  // 推算过后的 0 刻度以上间隔数
  const _top = Math.ceil(Math.abs(_max) / _interval)

  // 推算过后的 0 刻度以下间隔数
  const _bottom = Math.ceil(Math.abs(_min) / _interval)

  if (_top + _bottom !== row) {
    return recursion({ min: _min, max: _max })
  }

  return {
    max: _max,
    min: _min,
    interval: _interval,
    top: _top,
    bottom: _bottom,
  }
}

// 计算单个 y 轴的最大最小和间隔
const calcYAxisRange = (yAxisIndex: number) => {
  // 收集该 y 轴对应的所有 series 的数据值
  const allValues: number[] = []

  // 特殊处理第一个 Y 轴（堆叠柱状图）
  if (yAxisIndex === 0) {
    // 找到堆叠柱状图的 series（stack: 'sales'）
    const stackedSeries = option.value.series?.filter((s: any) => s.yAxisIndex === 0 && s.stack === 'sales') || []
    if (stackedSeries.length > 0) {
      // 获取第一个 series 的数据长度作为基准
      const firstSeries = stackedSeries[0]
      if (firstSeries.data && Array.isArray(firstSeries.data)) {
        // 计算每个数据点的堆叠总和和负值部分
        for (let i = 0; i < firstSeries.data.length; i++) {
          let sum = 0
          let cumulativeSum = 0 // 累积堆叠值（用于计算负值部分）
          stackedSeries.forEach((series: any) => {
            if (series.data && series.data[i] !== null && series.data[i] !== undefined && series.data[i] !== '') {
              const numValue = Number(series.data[i])
              if (!isNaN(numValue)) {
                sum += numValue
                cumulativeSum += numValue
                // 将累积值也加入 allValues，这样可以捕获负值部分
                allValues.push(cumulativeSum)
              }
            }
          })
          // 堆叠总和用于确定 Y 轴最大值
          allValues.push(sum)
        }
      }
    } else {
      // 如果没有堆叠柱状图，使用原来的逻辑
      if (option.value.series && Array.isArray(option.value.series)) {
        option.value.series.forEach((series: any) => {
          if (series.yAxisIndex === yAxisIndex && series.data && Array.isArray(series.data)) {
            series.data.forEach((value: any) => {
              if (value !== null && value !== undefined && value !== '') {
                const numValue = Number(value)
                if (!isNaN(numValue)) {
                  allValues.push(numValue)
                }
              }
            })
          }
        })
      }
    }
  } else {
    // 其他 Y 轴使用原来的逻辑
    if (option.value.series && Array.isArray(option.value.series)) {
      option.value.series.forEach((series: any) => {
        // 只收集属于当前 y 轴的 series 数据
        if (series.yAxisIndex === yAxisIndex && series.data && Array.isArray(series.data)) {
          series.data.forEach((value: any) => {
            if (value !== null && value !== undefined && value !== '') {
              const numValue = Number(value)
              if (!isNaN(numValue)) {
                allValues.push(numValue)
              }
            }
          })
        }
      })
    }
  }

  if (allValues.length === 0) {
    return { min: 0, max: 0, interval: 0, top: 0, bottom: 0 }
  }

  // 根据 yAxisIndex 找到对应的 dataGroup
  let dataGroup: IDataGroup | undefined
  for (const [group, index] of yAxisMapping.entries()) {
    if (index === yAxisIndex) {
      dataGroup = group
      break
    }
  }

  // 如果是 Rating 组（int2），固定 min=0, max=5, interval=1
  if (dataGroup === 'int2') {
    return {
      min: 0,
      max: 5,
      interval: 1,
      top: 5,
      bottom: 0,
    }
  }

  // 原始最大（数据的实际最大值）
  const dataMax = allValues.reduce((a: number, b: number) => Math.max(a, b), -Infinity)
  // 原始最小（数据的实际最小值）
  const dataMin = Math.min(...allValues)

  // 确保 0 值在范围内
  let max = dataMax < 0 ? 0 : dataMax
  let min = dataMin > 0 ? 0 : dataMin

  // 如果最大值和最小值都是 0，直接返回
  if (max === 0 && min === 0) {
    return { min: 0, max: 0, interval: 0, top: 0, bottom: 0 }
  }

  // 使用数据的最大值作为 Y 轴最大值，计算合适的间隔确保 0 值对齐
  const range = max - min
  // 计算一个合适的间隔，使得刻度数在合理范围内（约 5-8 个刻度）
  let interval = range / 7 // 目标约 7 个刻度

  // 将间隔调整为更友好的数字（如 10, 20, 50, 100 等）
  const magnitude = Math.pow(10, Math.floor(Math.log10(interval || 1)))
  const normalized = interval / magnitude
  let friendlyInterval: number
  if (normalized <= 1) {
    friendlyInterval = magnitude
  } else if (normalized <= 2) {
    friendlyInterval = 2 * magnitude
  } else if (normalized <= 5) {
    friendlyInterval = 5 * magnitude
  } else {
    friendlyInterval = 10 * magnitude
  }

  // 使用数据的最大值作为 Y 轴最大值（不扩展）
  const finalMax = max
  // 将最小值向下取整到最近的 interval
  const finalMin = Math.floor(min / friendlyInterval) * friendlyInterval

  // 计算 0 刻度线上下间隔数
  const top = Math.ceil(Math.abs(finalMax) / friendlyInterval)
  const bottom = Math.ceil(Math.abs(finalMin) / friendlyInterval)

  return {
    max: finalMax,
    min: finalMin,
    interval: friendlyInterval,
    top: top,
    bottom: bottom,
  }
}

// 计算所有 y 轴的范围，并确保 0 值对齐
const calculateAlignedYAxisRanges = () => {
  if (!option.value.yAxis || !Array.isArray(option.value.yAxis)) {
    return []
  }

  // 为每个 y 轴计算初始范围
  const ranges = option.value.yAxis.map((yAxis: any, index: number) => {
    return calcYAxisRange(index)
  })

  // 记录哪些 Y 轴是 Rating 组（int2），需要保护其范围
  const ratingYAxisIndices = new Set<number>()
  for (const [group, index] of yAxisMapping.entries()) {
    if (group === 'int2') {
      ratingYAxisIndices.add(index)
    }
  }

  // 保存 Rating 组的原始值
  const ratingOriginalRanges = new Map<number, { min: number; max: number; interval: number; top: number; bottom: number }>()
  ratingYAxisIndices.forEach((index) => {
    if (ranges[index]) {
      ratingOriginalRanges.set(index, { ...ranges[index] })
    }
  })

  // 如果有多个 y 轴，只对齐 0 值，不改变最大值
  // 每个 Y 轴保持自己的数据最大值，但调整最小值使 0 值对齐
  if (ranges.length > 1) {
    // 以第一个 Y 轴为基准，计算 0 值的位置比例
    const baseRange = ranges[0]
    if (baseRange && baseRange.max !== baseRange.min) {
      // 计算基准 Y 轴中 0 值的位置比例（从最小值到最大值的比例）
      const baseZeroPosition = (0 - baseRange.min) / (baseRange.max - baseRange.min)

      // 调整其他 Y 轴，使 0 值对齐，但保持最大值不变
      for (let i = 1; i < ranges.length; i++) {
        const currentRange = ranges[i]
        if (!currentRange || currentRange.max === currentRange.min) continue

        // 保持最大值不变
        const max = currentRange.max

        // 根据基准 0 值位置，计算新的最小值
        // zeroPosition = (0 - min) / (max - min)
        // 展开：zeroPosition * (max - min) = 0 - min
        // 移项：min = -zeroPosition * max / (1 - zeroPosition)
        // 处理边界情况：如果 baseZeroPosition = 1，说明基准轴的 min = 0，那么其他轴也应该是 min = 0
        const newMin = baseZeroPosition >= 1 ? 0 : (-baseZeroPosition * max) / (1 - baseZeroPosition)

        // 重新计算间隔，确保 0 值对齐
        const range = max - newMin
        let interval = range / 7 // 目标约 7 个刻度

        // 将间隔调整为更友好的数字
        const magnitude = Math.pow(10, Math.floor(Math.log10(interval || 1)))
        const normalized = interval / magnitude
        let friendlyInterval: number
        if (normalized <= 1) {
          friendlyInterval = magnitude
        } else if (normalized <= 2) {
          friendlyInterval = 2 * magnitude
        } else if (normalized <= 5) {
          friendlyInterval = 5 * magnitude
        } else {
          friendlyInterval = 10 * magnitude
        }

        // 将最小值向下取整到最近的 interval
        const finalMin = Math.floor(newMin / friendlyInterval) * friendlyInterval

        // 计算 0 刻度线上下间隔数
        const top = Math.ceil(Math.abs(max) / friendlyInterval)
        const bottom = Math.ceil(Math.abs(finalMin) / friendlyInterval)

        ranges[i] = {
          max: max,
          min: finalMin,
          interval: friendlyInterval,
          top: top,
          bottom: bottom,
        }
      }
    }
  }

  // 恢复 Rating 组的原始值（确保固定为 min=0, max=5, interval=1）
  ratingOriginalRanges.forEach((originalRange, index) => {
    if (ranges[index]) {
      ranges[index] = originalRange
    }
  })

  return ranges
}
// 根据数据点数量动态计算泡泡大小，与柱状图宽度成比例
const calculateSymbolSize = (dataLength: number) => {
  if (dataLength <= 30) {
    return 50
  }
  if (dataLength <= 60) {
    return 40
  }
  if (dataLength <= 90) {
    return 30
  }
  // 数据点很多时，使用较小的固定大小
  return 25
}

// 计算并返回 markPoint 数据
const calculateMarkPointData = () => {
  if (radio.value !== 'day' || !option.value.series[0]) {
    return []
  }

  const markPointData: any[] = []
  const dataLength = option.value.xAxis.data.length
  const symbolSize = calculateSymbolSize(dataLength)

  // 获取当前的数据
  const adSalesData = option.value.series[1]?.data || []
  const organicSalesData = option.value.series[0]?.data || []

  option.value.xAxis.data.forEach((date: string, index: number) => {
    const count = operationLogCountByDate.value[date]
    if (count && count > 0) {
      // 计算该日期对应的销售额总和，作为 y 轴位置，让泡泡显示在柱状图最高值的顶部
      const organicAmount = organicSalesData[index] || 0
      const adAmount = adSalesData[index] || 0
      // 如果两个都大于0，那么totalAmount是两个的相加；如果其中一个小于0，那么totalAmount是另一个的值
      let totalAmount: number = 0
      if (organicAmount > 0 && adAmount > 0) {
        totalAmount = organicAmount + adAmount
      } else if (organicAmount < 0 && adAmount > 0) {
        totalAmount = adAmount
      } else if (organicAmount > 0 && adAmount < 0) {
        totalAmount = organicAmount
      }
      const yPosition = totalAmount > 0 ? totalAmount : 0
      markPointData.push({
        name: `操作日志`,
        value: count,
        xAxis: index,
        yAxis: yPosition,
        symbolSize: symbolSize,
        itemStyle: {
          color: '#FF9800',
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: `{c}`,
          color: '#fff',
          fontWeight: 'bold',
        },
      })
    }
  })

  return markPointData
}

// 更新操作日志 markPoint（独立函数，可在任何时候调用）
const updateOperationLogMarkPoint = () => {
  // 确保 series[0] 和 xAxis.data 存在
  if (!option.value.series[0] || !option.value.xAxis?.data) {
    return
  }

  // 如果关闭了显示，清空 markPoint 数据
  if (!showOperationLogMarkPoint.value) {
    if (option.value.series[0].markPoint) {
      option.value.series[0].markPoint.data = []
    }
    return
  }

  if (radio.value === 'day') {
    const markPointData = calculateMarkPointData()
    // 确保 markPoint 对象始终存在，只更新 data
    if (!option.value.series[0].markPoint) {
      option.value.series[0].markPoint = { data: [] }
    }
    option.value.series[0].markPoint.data = markPointData
  } else {
    // 非日视图时，保持 markPoint 对象但清空 data
    if (option.value.series[0].markPoint) {
      option.value.series[0].markPoint.data = []
    }
  }
}

// 切换 markPoint 显示/隐藏
const handleToggleMarkPoint = () => {
  updateOperationLogMarkPoint()
  updateChart()
}
// 切换 日，周，月
const handleSwitchTime = (shouldSave: boolean = true) => {
  // 保存状态（恢复状态时不保存）
  if (shouldSave) {
    saveState()
  }
  let adSalesData: any[] = []
  let organicSalesData: any[] = []
  // 图表使用完整数据（fullTrendList），表格使用分页数据（trendList）
  switch (radio.value) {
    case 'day': {
      adSalesData = fullTrendList.value
      organicSalesData = fullTrendList.value

      break
    }
    case 'week': {
      adSalesData = getWeeklyData(fullTrendList.value, 'adSalesAmount')
      organicSalesData = getWeeklyData(fullTrendList.value, 'organicSalesAmount')

      break
    }
    case 'month': {
      adSalesData = getMonthlyData(fullTrendList.value, 'adSalesAmount')
      organicSalesData = getMonthlyData(fullTrendList.value, 'organicSalesAmount')

      break
    }
    // No default
  }
  option.value.xAxis.data = adSalesData.map((item: any) => item.date)
  option.value.series[1].data = adSalesData.map((d: any) => d.adSalesAmount)
  option.value.series[0].data = organicSalesData.map((d: any) => d.organicSalesAmount)

  // 根据数据点数量调整柱状图宽度和 x 轴标签
  const dataLength = option.value.xAxis.data.length
  updateBarWidth()
  updateXAxisLabel(dataLength)

  updateYAxisData(fullTrendList.value)
  // 应用对齐后的 y 轴范围，确保所有 y 轴的 0 值对齐
  applyAlignedYAxisRanges()
  // 更新图表（内部会更新 markPoint）
  updateChart()
}
// 更新 Y 轴数据随时间切换的函数（使用完整数据）
const updateYAxisData = (data: any[]) => {
  option.value.series.forEach((s: any, index: number) => {
    if (index !== 0 && index !== 1) {
      // 检查是否为多类别系列（格式：小类排名-类别名）
      // 只有小类排名支持多类别（使用完整数据）
      if (s.name.includes('-') && s.name.startsWith('小类排名-')) {
        const [dataName, category] = s.name.split('-', 2)
        const prop = nameMapProp[dataName]
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
        }
        // 从数组格式中提取对应类别的数据
        s.data = processedData.map((d: any) => {
          const value = d[prop]
          if (Array.isArray(value)) {
            const catData = value.find((cat: { category: string; performanceId: number; smallRank: number }) => cat.category === category)
            return catData ? catData.smallRank : null
          }
          return null
        })
      } else {
        // 单类别模式
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
        }
        s.data = processedData.map((d: any) => d[prop])
      }
    }
  })
}
// 初始化图表
const initChart = () => {
  // 初始化图表的配置项
  option.value = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(238, 246, 253, 0.7)',
      borderWidth: 0,
      confine: true,
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px;">${params[0].name}</div>`

        // 需要聚合的销量系列名称
        const salesGroupNames = ['广告销售额', '自然销售额']
        let salesTotal = 0
        let salesGroupItems: any[] = []
        let otherItems: any[] = []

        // 分离销量组和其他项
        params.forEach((item) => {
          // 过滤掉值为 null 或 undefined 的项
          if (item.value === null || item.value === undefined || item.value === '') {
            return
          }
          if (salesGroupNames.includes(item.seriesName)) {
            salesTotal += Number(item.value || 0)
            salesGroupItems.push(item)
          } else {
            otherItems.push(item)
          }
        })

        // 按照 salesGroupNames 的顺序排序，确保"广告销售额"在"自然销售额"之前
        salesGroupItems.sort((a, b) => {
          const indexA = salesGroupNames.indexOf(a.seriesName)
          const indexB = salesGroupNames.indexOf(b.seriesName)
          return indexA - indexB
        })

        // 销量组 HTML（类似 PerformanceHistory 的样式）
        let salesGroupHtml = ''
        if (salesGroupItems.length > 0) {
          salesGroupHtml = `
            <div style="background: #fff; padding: 3px 8px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); margin-bottom: 5px;">
              <div style="display: flex; justify-content: space-between; color: #333; font-size: 14px">
                <div style="display: flex; align-items: center;">
                  <span style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #409EFF;
                    margin-right: 9px;
                    color: #333;
                  "></span>
                  <span>销售额(订单)</span>
                </div>
                <span style="font-weight: bold; color: #333;">${currencySymbol.value}${salesTotal.toFixed(2)}</span>
              </div>
              <div style="margin-top: 2px; padding-left: 10px;">
                ${salesGroupItems
                  .map(
                    (item) => `
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 1px;">
                    <div style="display: flex; align-items: center;">${item.marker}<span style="margin-left: 5px;">${item.seriesName}</span></div>
                    <span>${currencySymbol.value}${item.value}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
        }

        // 其他项的 HTML
        const otherHtmlArr = otherItems.map((item) => {
          const groupName = getGroup(item.seriesName)
          let value = item.value
          if (groupName === 'price1' || groupName === 'price2') {
            value = `${currencySymbol.value}${value}`
          } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
            value = `${value}%`
          }
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
              font-size: 14px;
            ">
              <div style="display: flex; align-items: center;">
                ${item.marker}
                <span style="color: #333; margin-left: 6px;">${item.seriesName}</span>
              </div>
              <span style="font-weight: bold; color: #333;">${value}</span>
            </div>
          `
        })

        return `
          <div style="padding: 0px; border-radius: 20px; width: 180px;">
            ${titleHtmlStr}
            ${otherHtmlArr.join('')}
            ${salesGroupHtml}
          </div>
        `
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
      data: [], // 初始化为空数组，数据加载后通过 handleSwitchTime() 更新
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: '14px',
        rotate: 0,
        interval: 0, // 默认显示所有标签
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '广告/自然销售额',
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
        // 使用递归算法计算 min、max 和 interval，确保 0 值对齐
        // 初始时不设置，在 applyAlignedYAxisRanges 中统一设置
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409EFF',
          },
        },
        boundaryGap: [0, 0], // 最大值顶格显示
      },
    ],
    series: [
      {
        name: '自然销售额',
        type: 'bar',
        yAxisIndex: 0,
        data: [],
        barWidth: 0,
        itemStyle: {
          color: '#67C23A',
        },
        opacity: 0.9,
        stack: 'sales',
        // 初始化 markPoint 配置，确保它始终存在
        markPoint: {
          data: [],
        },
      },
      {
        name: '广告销售额',
        type: 'bar',
        yAxisIndex: 0,
        data: [],
        barWidth: 0,
        itemStyle: {
          color: '#409EFF',
        },
        opacity: 0.9,
        stack: 'sales',
      },
    ],
  }

  // 根据数据点数量调整 x 轴标签显示策略
  const dataLength = fullTrendList.value.length
  updateXAxisLabel(dataLength)

  // 应用对齐后的 y 轴范围，确保所有 y 轴的 0 值对齐
  applyAlignedYAxisRanges()

  // 设置图表实例的配置项
  chartInstance?.setOption(option.value)
}

// 应用对齐后的 y 轴范围到所有 y 轴
const applyAlignedYAxisRanges = () => {
  const ranges = calculateAlignedYAxisRanges()

  if (option.value.yAxis && Array.isArray(option.value.yAxis)) {
    option.value.yAxis.forEach((yAxis: any, index: number) => {
      if (ranges[index]) {
        yAxis.min = ranges[index].min
        yAxis.max = ranges[index].max
        yAxis.interval = ranges[index].interval
      }
    })
  }
}

// 更新图表
const updateChart = () => {
  // 在更新图表之前，先更新 markPoint 数据
  updateOperationLogMarkPoint()

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
    // 检查是否为多类别字段（小类排名）
    if (isMultiCategoryField(dataName)) {
      const multiCategoryData = getMultiCategoryData(dataName)
      const prop = nameMapProp[dataName]

      // 检查第一条数据是否为数组格式（使用完整数据）
      const firstItem = fullTrendList.value[0]?.[prop]
      if (Array.isArray(firstItem) && multiCategoryData.length > 0) {
        // 多类别模式：为每个类别创建一条曲线
        let yAxisIndex: number

        // 1. 处理是否共用y轴还是添加新的y轴
        if (yAxisMapping.has(dataGroup)) {
          yAxisIndex = yAxisMapping.get(dataGroup)
        } else {
          if (currentYAxisCount >= 4) {
            $baseMessage('最多只能支持三个额外的 Y 轴，请重新选择', 'error')
            return true
          }
          yAxisIndex = currentYAxisCount
          yAxisMapping.set(dataGroup, yAxisIndex)

          // 新增 Y 轴配置
          const yAxisColor = getYAxisColor(dataName)
          option.value.yAxis.push({
            type: 'value',
            name: dataName,
            position: currentYAxisCount % 2 === 0 ? 'left' : 'right',
            offset: Math.floor(currentYAxisCount / 2) * 60,
            nameTextStyle: {
              color: yAxisColor,
              fontSize: '14px',
              align: currentYAxisCount % 2 === 0 ? 'right' : 'left',
            },
            axisLabel: {
              formatter: getYAxisFormat(dataGroup),
              fontSize: '14px',
            },
            // 使用递归算法计算 min、max 和 interval，确保 0 值对齐
            // 初始时不设置，在 applyAlignedYAxisRanges 中统一设置
            axisLine: {
              show: true,
              lineStyle: {
                color: yAxisColor,
              },
            },
            splitLine: {
              show: false,
            },
            boundaryGap: [0, 0.1],
          })

          currentYAxisCount++
          updateYAxisOffsets()
        }

        // 为每个类别添加一条曲线
        const baseColor = getYAxisColor(dataName)
        multiCategoryData.forEach((catData, index) => {
          // 为不同类别使用不同颜色（基于基础颜色的变体）
          const colorVariants = [
            baseColor,
            adjustColorBrightness(baseColor, -20),
            adjustColorBrightness(baseColor, -40),
            adjustColorBrightness(baseColor, 20),
          ]
          const seriesColor = colorVariants[index % colorVariants.length] || baseColor

          option.value.series.push({
            name: `${dataName}-${catData.category}`,
            type: 'line',
            yAxisIndex,
            data: catData.data,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              color: seriesColor,
            },
            itemStyle: {
              color: seriesColor,
            },
            emphasis: {
              focus: 'series',
            },
          })
          selectedItems.push(`${dataName}-${catData.category}`)
        })

        // 确保 xAxis 数据已设置（使用完整数据）
        if (!option.value.xAxis?.data || option.value.xAxis.data.length === 0) {
          // 如果 xAxis 数据为空，使用 fullTrendList 的日期
          option.value.xAxis = option.value.xAxis || {}
          option.value.xAxis.data = fullTrendList.value.map((item: ITrendOverview) => item.date || '').filter(Boolean)
        }

        // 应用对齐后的 y 轴范围，确保所有 y 轴的 0 值对齐
        applyAlignedYAxisRanges()
        // 更新图表（内部会更新 markPoint）
        updateChart()
        return false
      }
    }

    // 单类别模式：原有逻辑
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
      const yAxisColor = getYAxisColor(dataName)
      option.value.yAxis.push({
        type: 'value',
        name: dataName,
        position: currentYAxisCount % 2 === 0 ? 'left' : 'right',
        offset: Math.floor(currentYAxisCount / 2) * 60,
        nameTextStyle: {
          // fontWeight: 'bold',
          color: yAxisColor,
          fontSize: '14px',
          align: currentYAxisCount % 2 === 0 ? 'right' : 'left',
        },
        axisLabel: {
          // fontWeight: 'bold',
          formatter: getYAxisFormat(dataGroup),
          fontSize: '14px',
        },
        // 使用递归算法计算 min、max 和 interval，确保 0 值对齐
        // 初始时不设置，在 applyAlignedYAxisRanges 中统一设置
        axisLine: {
          show: true,
          lineStyle: {
            color: yAxisColor,
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: [0, 0], // 最大值顶格显示
      })

      currentYAxisCount++
      updateYAxisOffsets()
    }

    // 添加新 series
    const seriesColor = getYAxisColor(dataName)
    option.value.series.push({
      name: dataName,
      type: 'line',
      yAxisIndex,
      data: getDataForName(dataName),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: seriesColor,
      },
      itemStyle: {
        color: seriesColor,
      },
      emphasis: {
        focus: 'series',
      },
    })

    // 应用对齐后的 y 轴范围，确保所有 y 轴的 0 值对齐
    applyAlignedYAxisRanges()
    // 更新图表（内部会更新 markPoint）
    updateChart()
  } else {
    // 取消选中时，移除选中的字段
    // 如果是多类别字段，需要移除所有相关 series
    if (isMultiCategoryField(dataName)) {
      const prop = nameMapProp[dataName]
      const firstItem = fullTrendList.value[0]?.[prop]
      if (Array.isArray(firstItem)) {
        // 移除所有以 dataName 开头的 series
        const seriesToRemove = option.value.series.filter((s: any) => s.name.startsWith(dataName))
        seriesToRemove.forEach((series: any) => {
          const seriesIndex = option.value.series.findIndex((s: any) => s.name === series.name)
          if (seriesIndex !== -1) {
            option.value.series.splice(seriesIndex, 1)
          }
          const itemIndex = selectedItems.indexOf(series.name)
          if (itemIndex !== -1) {
            selectedItems.splice(itemIndex, 1)
          }
        })
      } else {
        // 单值模式
        const index = selectedItems.indexOf(dataName)
        if (index !== -1) {
          selectedItems.splice(index, 1)
        }
        const seriesIndex = option.value.series.findIndex((s: any) => s.name === dataName)
        if (seriesIndex !== -1) {
          option.value.series.splice(seriesIndex, 1)
        }
      }
    } else {
      // 单类别模式
      const index = selectedItems.indexOf(dataName)
      if (index !== -1) {
        selectedItems.splice(index, 1)
      }
      // 取消选中时，移除对应的 series
      const seriesIndex = option.value.series.findIndex((s: any) => s.name === dataName)
      if (seriesIndex !== -1) {
        option.value.series.splice(seriesIndex, 1) // 移除对应的 series
      }
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
  updateYAxisData(fullTrendList.value)
  // 更新图表（内部会更新 markPoint）
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
    // ECharts formatter 使用 {value} 作为占位符
    return (value: number) => `${currencySymbol.value}${value}`
  } else if (groupName === 'percent1' || groupName === 'percent2' || groupName === 'percent3') {
    return (value: number) => `${value}%`
  } else {
    return '{value}'
  }
}
// 获取对应的颜色
function getYAxisColor(dataName?: string) {
  // 如果传入了 dataName，根据 dataName 找到对应的卡片
  if (dataName) {
    const cardIndex = cards.value.findIndex((card) => card.title === dataName)
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
  }
  // 如果没有传入 dataName，使用原来的逻辑（基于 clickCard）
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

// 调整颜色亮度（用于多类别时生成不同颜色）
function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

// 根据数据组和数据名称获取数据（用于图表，使用完整数据）
function getDataForName(dataName: string) {
  const prop = nameMapProp[dataName]
  return fullTrendList.value.map((item: ITrendOverview) => item[prop]) || []
}

// 检查字段是否支持多类别（数组格式）
// 只有小类排名支持多类别，大类排名只有一条曲线
function isMultiCategoryField(dataName: string): boolean {
  return dataName === '小类排名'
}

// 获取多类别数据（用于排名类字段）
function getMultiCategoryData(dataName: string): Array<{ category: string; data: (number | null)[] }> {
  const prop = nameMapProp[dataName]
  const categories = new Set<string>()

  // 先收集所有类别（使用完整数据）
  fullTrendList.value.forEach((item: ITrendOverview) => {
    const value = item[prop]
    if (Array.isArray(value)) {
      value.forEach((cat: { category: string; performanceId: number; smallRank: number }) => {
        categories.add(cat.category)
      })
    }
  })

  // 为每个类别提取数据，保留所有类别（包括数据为空的）（使用完整数据）
  return Array.from(categories).map((category) => {
    const data = fullTrendList.value.map((item: ITrendOverview) => {
      const value = item[prop]
      if (Array.isArray(value)) {
        // 精确匹配类别名称
        const catData = value.find((cat: { category: string; performanceId: number; smallRank: number }) => cat.category === category)
        if (catData) {
          return catData.smallRank
        }
      }
      return null
    })
    return { category, data }
  })
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
  // 保存状态
  saveState()
}
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (checkList1.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchTableData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchTableData()
}
const trendList = ref<ITrendOverview[]>([]) // 表格显示的数据（分页数据）
const fullTrendList = ref<ITrendOverview[]>([]) // 完整数据（用于图表计算）
const cardSummary = ref<Record<string, ICardSummary>>({})

// 获取请求参数（公共部分）
const getRequestParams = () => {
  let skuValue = route.query.sku as string
  if (props.selectField === 0 && props.selectedSku) {
    // 如果选择的是SKU维度且有选中的SKU，使用选中的SKU
    skuValue = props.selectedSku
  }
  // 优先使用 props.selectedSite，如果没有则从 route.query.site 获取
  const siteId = props.selectedSite !== undefined ? props.selectedSite : route.query.site ? Number(route.query.site) : undefined
  // 如果 siteId 为 undefined，可能需要使用默认值或抛出错误，这里先使用 0 作为默认值
  return {
    sku: skuValue,
    siteId: siteId ?? 0, // 如果 siteId 为 undefined，使用 0 作为默认值
    asin: route.query.asin as string,
    type: props.selectField,
    startDate: formatDateToString(new Date(props.selectDateRange[0])),
    endDate: formatDateToString(new Date(props.selectDateRange[1])),
    compareType: props.compareType,
  }
}

// 获取表格数据（分页）
const fetchTableData = async () => {
  tableLoading.value = true
  try {
    const requestParams = getRequestParams()
    const { data } = await getTrendOverviewTable({
      ...requestParams,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    })
    // 表格数据（分页数据）
    trendList.value = data.list || []
    // 更新总数
    total.value = data.total || 0
  } catch (error) {
    console.error('获取表格数据失败:', error)
    trendList.value = []
    total.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 获取操作日志数据并按日期统计
const fetchOperationLogCount = async () => {
  if (!props.asin || props.selectedSite === undefined) {
    operationLogCountByDate.value = {}
    return
  }

  try {
    const { data } = await getOperationLog({
      asin: props.asin,
      siteId: props.selectedSite,
      type: -1, // -1 表示获取所有类型
      pageNo: 1,
      pageSize: 2147483647, // 获取所有数据 (Integer.MAX_VALUE)
      startDate: props.selectDateRange[0] || '',
      endDate: props.selectDateRange[1] || '',
    })

    // 按日期统计操作日志数量
    const countByDate: Record<string, number> = {}
    data.list.forEach((item: IGetOperationLog) => {
      const dateTime = item.date
      if (dateTime) {
        // 将 dateTime 转换为日期字符串（YYYY-MM-DD）
        let dateStr: string
        if (dateTime.includes(' ')) {
          // 格式：2024-01-01 10:00:00
          dateStr = dateTime.split(' ')[0]
        } else if (dateTime.length >= 10) {
          // 如果已经是 YYYY-MM-DD 格式，直接使用
          dateStr = dateTime.substring(0, 10)
        } else {
          // 其他格式，尝试转换为 Date 对象
          dateStr = formatDateToString(new Date(dateTime))
        }
        countByDate[dateStr] = (countByDate[dateStr] || 0) + 1
      }
    })
    operationLogCountByDate.value = countByDate
  } catch (error) {
    console.error('获取操作日志数据失败:', error)
    operationLogCountByDate.value = {}
  }
}

// 获取图表数据（完整数据）
const fetchChartData = async () => {
  chartLoading.value = true
  try {
    const requestParams = getRequestParams()
    const { data } = await getTrendOverviewChart(requestParams)
    // 卡片汇总数据
    cardSummary.value = data.summary || {}
    // 图表数据（完整数据）
    fullTrendList.value = data.list || []
    currencySymbol.value = data.symbol || ''
    // 更新卡片数据（在图表数据加载完成后更新）
    updateCardsData()
    // 获取操作日志数据
    await fetchOperationLogCount()
  } catch (error) {
    console.error('获取图表数据失败:', error)
    fullTrendList.value = []
    cardSummary.value = {}
  } finally {
    chartLoading.value = false
  }
}

// 监听 fullTrendList 变化，更新图表（图表需要完整数据）
watch(
  () => fullTrendList.value,
  () => {
    if (chartInstance && fullTrendList.value.length > 0) {
      // 如果是第一次加载数据，尝试恢复状态
      const isFirstLoad = !option.value.xAxis?.data || option.value.xAxis.data.length === 0
      if (isFirstLoad) {
        const hasRestored = restoreState()
        if (hasRestored) {
          // 更新下拉项禁用状态
          updateDropdownItemsDisabled()
          // 更新卡片数据
          updateCardsData()
          // 先切换时间视图（这会更新图表数据，恢复状态时不保存）
          handleSwitchTime(false)
          // 然后恢复折线显示（需要在下一个 tick，确保图表已更新）
          nextTick(() => {
            restoreChartLines()
            // 恢复完成后保存一次状态
            saveState()
          })
          return
        }
      }
      handleSwitchTime()
    }
  },
  { deep: true, immediate: false }
)

// 监听 props 变化，重新获取数据
watch(
  () => [props.selectField, props.compareType, props.selectDateRange, props.selectedSku, props.asin],
  () => {
    fetchChartData()
  },
  { deep: true }
)
// 单独监听 selectedSite 变化，确保能正确触发
watch(
  () => props.selectedSite,
  () => {
    fetchChartData()
    fetchTableData()
  }
)
// 监听操作日志数据变化，更新图表
watch(
  () => operationLogCountByDate.value,
  () => {
    if (chartInstance && fullTrendList.value.length > 0 && radio.value === 'day') {
      handleSwitchTime()
    }
  },
  { deep: true }
)
watch(
  () => [props.selectField, props.selectDateRange, props.selectedSku],
  () => {
    fetchTableData()
  },
  { deep: true }
)

// 处理操作日志 markPoint 点击事件
const handleOperationLogClick = async (date: string) => {
  if (!props.asin || props.selectedSite === undefined) {
    return
  }

  try {
    const { data } = await getOperationLog({
      asin: props.asin,
      siteId: props.selectedSite,
      type: -1, // -1 表示获取所有类型
      pageNo: 1,
      pageSize: 10000,
      startDate: date,
      endDate: date,
    })

    // 将接口返回的数据映射到组件需要的格式
    operationLogDetailList.value = data.list.map((item: IGetOperationLog) => ({
      date: item.date,
      type: typeMap[item.type] || '未知',
      content: item.content,
    }))
    operationLogDialogVisible.value = true
  } catch (error) {
    console.error('获取操作日志明细失败:', error)
    $baseMessage('获取操作日志明细失败', 'error')
  }
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

    // 监听图表点击事件
    chartInstance.on('click', (params: any) => {
      // 检查是否点击了 markPoint
      if (params.componentType === 'markPoint' && params.data) {
        // 从 markPoint 数据中获取 xAxis 索引，然后获取日期
        const xAxisIndex = params.data.xAxis
        if (xAxisIndex !== undefined && option.value.xAxis.data[xAxisIndex]) {
          const date = option.value.xAxis.data[xAxisIndex]
          handleOperationLogClick(date)
        }
      }
    })
  }
  fetchChartData()
  fetchTableData()
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
.content-link {
  display: block;
  width: 100%;

  .content-text {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
