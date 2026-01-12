<template>
  <div class="pie-container">
    <vab-card style="height: 400px">
      <div style="display: flex; width: 100%; height: 100%">
        <div style="width: 43%">
          <div style="text-align: left">
            <el-form inline>
              <el-form-item label="目标ACOS">
                <el-input
                  v-model="adSettingForm.targetAcos"
                  :disabled="adSettingDisabled"
                  placeholder="请输入"
                  type="number"
                  @change="handleAdSettingUpdate"
                >
                  <template #append>%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="目标转化率">
                <el-input
                  v-model="adSettingForm.targetChange"
                  :disabled="adSettingDisabled"
                  placeholder="请输入"
                  type="number"
                  @change="handleAdSettingUpdate"
                >
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div ref="chartContainer1" style="width: 100%; height: 350px"></div>
        </div>
        <el-divider direction="vertical" style="height: 360px" />
        <div style="flex: 1">
          <el-row>
            <el-col :span="4">
              <el-select v-model="pieSelect" style="max-width: 5em; margin-left: 10px" @change="handleChangeSelect">
                <el-option v-for="item in pieSelectOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="20">
              <div ref="chartContainer2" style="width: 100%; height: 400px"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </vab-card>
    <div style="text-align: right">
      <el-form inline :model="queryForm" @submit.prevent>
        <el-form-item>
          <el-checkbox v-model="queryForm.exactSearch" :false-value="0" :true-value="1">精准搜索</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      border
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column
        fixed="left"
        label="客户搜索词"
        prop="customerSearchTerm"
        :width="flexColumnWidth(list, '客户搜索词', 'customerSearchTerm')"
      >
        <template #default="{ row }">
          <el-link type="primary">{{ row.customerSearchTerm }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="展示量" min-width="100" prop="impressions" sortable="custom" />
      <el-table-column label="点击量" min-width="100" prop="clicks" sortable="custom" />
      <el-table-column label="点击率(我们/大盘)" min-width="170" prop="clickThroughRate">
        <template #default="{ row }">
          {{ `${formatPctOrDash(row.clickThruRate)} / ${formatPctOrDash(row.marketClickThruRate)}` }}
        </template>
      </el-table-column>
      <el-table-column label="转化率(我们/大盘)" min-width="170" prop="conversionRate">
        <template #default="{ row }">
          {{ `${formatPctOrDash(row.conversionRate)} / ${formatPctOrDash(row.marketConversionRate)}` }}
        </template>
      </el-table-column>
      <el-table-column label="花费" min-width="100" prop="spend" sortable="custom" />
      <el-table-column label="ACOS" min-width="100" prop="acos" sortable="custom">
        <template #default="{ row }">
          {{ row.acos != null ? `${row.acos}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="7天销售额" min-width="130" prop="sales7d" sortable="custom" />
      <el-table-column label="7天订单数" min-width="130" prop="orders7d" sortable="custom" />
      <el-table-column label="CPC" min-width="90" prop="cpc" sortable="custom" />
      <el-table-column label="建议竞价" min-width="100" prop="suggestedBid" />
      <el-table-column label="大盘日总展示" min-width="145" prop="getCal" sortable="custom" />
      <el-table-column label="预估大盘总点击" min-width="170" prop="estimateTotalClick" />
      <el-table-column label="曝光量排名" min-width="120" prop="impressionRank" />
      <el-table-column label="品牌占有率" min-width="120" prop="brandShareRate" />
      <el-table-column fixed="right" label="分类" min-width="130" prop="type">
        <template #default="{ row }">
          <span :style="{ color: `${getCategoryColor(row.type)}` }">{{ highLowMap[row.type] }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
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
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'
import { highLowMap, pieSelectLabelMap, pieSelectMap, pieSelectOption } from '../constantOption'
import {
  queryCurrencySymbolBySite,
  queryProductAdvertisementPie,
  queryProductAdvertisementPieChart,
  queryProductAdvertisementSetting,
  querySPAdsTable,
  upsertProductAdvertisementSetting,
} from '/@/api/devlocal/productAnalysis'
import { $baseMessage } from '/@/hooks'
import type {
  IProductAdvertisementPieChartDimensionItem,
  IProductAdvertisementPieChartResp,
  IProductAdvertisementPieItem,
  IProductAdvertisementSettingResp,
  ISPAdsTableItem,
} from '/@/type/storeOperation/productAnalysisType'
import { formatDateToString } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabAdPieTab',
})

interface IProps {
  siteId?: number
  selectDateRange: [string, string]
  skipNoData: number
  campaignName: string
  sku: string
  asin: string
  selectField?: number // 展示维度：0=SKU, 1=ASIN, 2=父体ASIN
}

const props = withDefaults(defineProps<IProps>(), {
  siteId: undefined,
  selectDateRange: undefined,
  skipNoData: 1,
  campaignName: '',
  sku: '',
  asin: '',
  selectField: 0,
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  exactSearch: 0,
  orderByField: 'impressions',
  orderDirection: 'desc',
})

const pieSelect = ref<number>(0)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const data1 = ref<any[]>([])
const currencySymbol = ref<string>('$') // 默认美元
const list = ref<ISPAdsTableItem[]>([])
const pieChartData = ref<IProductAdvertisementPieChartResp | null>(null) // 饼图2的完整数据

const adSettingLoading = ref<boolean>(false)
const adSettingSaving = ref<boolean>(false)
const adSettingForm = reactive<Pick<IProductAdvertisementSettingResp, 'targetAcos' | 'targetChange'>>({
  targetAcos: undefined,
  targetChange: undefined,
})

const adSettingDisabled = computed(() => {
  return adSettingLoading.value || adSettingSaving.value || !props.asin || props.siteId == null
})

const fetchAdSetting = async () => {
  if (!props.asin || props.siteId == null) return
  adSettingLoading.value = true
  try {
    const { data } = await queryProductAdvertisementSetting({ asin: props.asin, siteId: props.siteId })
    adSettingForm.targetAcos = data?.targetAcos
    adSettingForm.targetChange = data?.targetChange
  } catch (error) {
    console.error('Failed to query advertisement setting:', error)
    adSettingForm.targetAcos = undefined
    adSettingForm.targetChange = undefined
  } finally {
    adSettingLoading.value = false
  }
}

const handleAdSettingUpdate = async () => {
  if (!props.asin || props.siteId == null) {
    $baseMessage('请先选择站点和ASIN', 'warning')
    return
  }
  try {
    adSettingSaving.value = true
    const { data } = await upsertProductAdvertisementSetting({
      asin: props.asin,
      siteId: props.siteId,
      targetAcos: adSettingForm.targetAcos,
      targetChange: adSettingForm.targetChange,
    })
    if (data) {
      $baseMessage('更新成功', 'success')
      fetchTableData()
      fetchPieData()
      fetchPieChartData()
    }
  } catch (error) {
    console.error('Failed to update advertisement setting:', error)
    $baseMessage('更新失败，请重试', 'error')
  } finally {
    adSettingSaving.value = false
  }
}
const formatPctOrDash = (val: number | null | undefined) => {
  return val != null && val !== undefined ? `${val}%` : '-'
}
// 将后端数据映射为前端显示格式
const mapTableData = (items: ISPAdsTableItem[]): any[] => {
  return items.map((item) => ({
    ...item,
    // 品牌占有率
    brandShareRate: item.brandShareRate != null ? `${item.brandShareRate}%` : '-',
    suggestedBid: item.suggestedBid != null ? currencySymbol.value + item.suggestedBid : '-',
    estimateTotalClick: item.estimateTotalClick != null ? item.estimateTotalClick : '-',
    cpc: item.cpc != null ? currencySymbol.value + item.cpc : '-',
    spend: item.spend != null ? currencySymbol.value + item.spend : '-',
    sales7d: item.sales7d != null ? currencySymbol.value + item.sales7d : '-',
  }))
}

// 获取饼图数据
const fetchPieData = async () => {
  try {
    const { data } = await queryProductAdvertisementPie({
      startDate: formatDateToString(new Date(props.selectDateRange[0])),
      endDate: formatDateToString(new Date(props.selectDateRange[1])),
      skipNoData: props.skipNoData,
      campaignName: props.campaignName,
      sku: props.sku,
      asin: props.asin,
      type: props.selectField,
      siteId: props.siteId ?? 0,
    })

    if (data && Array.isArray(data)) {
      // 转换数据格式：spend -> value, sales -> sales, name -> name
      data1.value = data.map((item: IProductAdvertisementPieItem) => ({
        value: item.spend,
        sales: item.sales,
        name: item.name,
      }))

      // 重新初始化图表
      initChart1()
    }
  } catch (error) {
    console.error('获取SP广告饼图数据失败:', error)
    data1.value = []
  }
}

// 获取饼图2的完整数据
const fetchPieChartData = async () => {
  try {
    const { data } = await queryProductAdvertisementPieChart({
      startDate: formatDateToString(new Date(props.selectDateRange[0])),
      endDate: formatDateToString(new Date(props.selectDateRange[1])),
      skipNoData: props.skipNoData,
      campaignName: props.campaignName,
      sku: props.sku,
      asin: props.asin,
      type: props.selectField,
      siteId: props.siteId ?? 0,
    })

    if (data && typeof data === 'object') {
      pieChartData.value = data
      // 初始更新图表2数据
      updatePieChartDisplay()
    }
  } catch (error) {
    console.error('获取SP广告饼图2数据失败:', error)
    pieChartData.value = null
  }
}

// 获取货币符号
const fetchCurrencySymbol = async () => {
  if (!props.siteId) {
    currencySymbol.value = '$'
    return
  }
  try {
    const { data } = await queryCurrencySymbolBySite(props.siteId)
    currencySymbol.value = data || '$'
  } catch (error) {
    console.error('获取货币符号失败:', error)
    currencySymbol.value = '$'
  }
}

// 获取表格数据
const fetchTableData = async () => {
  listLoading.value = true
  try {
    const { data } = await querySPAdsTable({
      startDate: formatDateToString(new Date(props.selectDateRange?.[0]!)),
      endDate: formatDateToString(new Date(props.selectDateRange?.[1]!)),
      skipNoData: props.skipNoData || 0,
      campaignName: props.campaignName || undefined,
      keyWord: queryForm.keyWord || undefined,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      sku: props.sku,
      asin: props.asin,
      type: props.selectField || 0,
      siteId: props.siteId ?? 0,
      exactSearch: queryForm.exactSearch || 0,
      orderByField: queryForm.orderByField,
      orderDirection: queryForm.orderDirection,
    })

    if (data && data.list) {
      list.value = mapTableData(data.list)
      total.value = data.total || 0
    }
  } catch (error) {
    console.error('获取SP广告饼图表格数据失败:', error)
    list.value = []
    total.value = 0
  } finally {
    listLoading.value = false
  }
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  if (queryForm.orderByField === prop) {
    // 如果点击的是当前排序列
    if (!order) {
      // 取消排序时，切换排序方向
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    // 如果点击的是不同的列，默认设置为降序
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  fetchTableData()
}
// 分页处理
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchTableData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchTableData()
}

// 监听props变化，重新获取数据
watch(
  [() => props.siteId, () => props.skipNoData, () => props.campaignName, () => props.sku, () => props.asin, () => props.selectField],
  async () => {
    await fetchCurrencySymbol()
    fetchTableData()
    fetchPieData()
    fetchPieChartData()
  },
  { immediate: false, deep: false }
)
watch(
  () => props.selectDateRange?.join(','),
  () => {
    fetchTableData()
    fetchPieData()
    fetchPieChartData()
  }
)
watch(
  [() => props.asin, () => props.siteId],
  () => {
    fetchAdSetting()
  },
  { immediate: true, deep: false }
)
watch(
  () => props.siteId,
  () => {
    fetchCurrencySymbol()
  },
  { immediate: true, deep: false }
)
// 查询数据
const queryData = () => {
  queryForm.pageNo = 1
  fetchTableData()
}

// 初始化时获取数据
onMounted(async () => {
  await fetchCurrencySymbol()
  fetchTableData()
  fetchPieData()
  fetchPieChartData()
})

const processedData = ref<any[]>([])
// 计算销售额总和
const totalSales = computed(() => data1.value.reduce((sum, item) => sum + item.sales, 0))

// 更新饼图2的显示数据
const updatePieChartDisplay = () => {
  if (!pieChartData.value) {
    processedData.value = []
    return
  }

  // 根据选择的指标获取对应的数据数组
  const selectedData = pieChartData.value[
    pieSelectMap[pieSelect.value] as keyof IProductAdvertisementPieChartResp
  ] as IProductAdvertisementPieChartDimensionItem[]

  if (selectedData && Array.isArray(selectedData)) {
    processedData.value = [...selectedData] // 后端已经排序，直接使用
  } else {
    processedData.value = []
  }

  // 更新图表
  option2.value.series[0].data = processedData.value
  updateChart2()
}

const initChart1 = () => {
  // 配置项
  option1.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''
        if (params.data.sales > 0) {
          // 计算销售额的百分比
          const salesPercent = totalSales.value > 0 ? `${((params.data.sales / totalSales.value) * 100).toFixed(2)}%` : '-'

          itemHtmlStrArr = `<div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">花费: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${currencySymbol.value}${params.data.value} | ${params.percent}%</span>
          </div>
          <div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">销售额: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${currencySymbol.value}${params.data.sales} | ${salesPercent}</span>
          </div>`
        } else {
          itemHtmlStrArr = `<div style="display: flex;align-items:center;">
            ${params.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">花费: </div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${currencySymbol.value}${params.data.value} | ${params.percent}%</span>
          </div>`
        }

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: '花费',
        type: 'pie',
        radius: '50%',
        // center: ['50%', '43%'],
        left: 0,
        right: 0,
        top: 0,
        bottom: 30,
        startAngle: 90, //起始角度
        labelLine: {
          lineStyle: {
            width: 2,
          },
          length: 20, // 连接线长度
          length2: 30, // 连接线的第二段长度
        },
        label: {
          alignTo: 'labelLine',
          formatter: (params: any) => {
            const { data, percent } = params

            // 计算销售额的百分比
            const salesPercent = totalSales.value > 0 && data.sales > 0 ? `${((data.sales / totalSales.value) * 100).toFixed(2)}%` : '-'

            // 销售额信息
            const salesInfo = data.sales > 0 ? `{b|销售额：}{x|${currencySymbol.value}${data.sales} | ${salesPercent}}` : ''

            return `{a|${data.name}}\n{b|花费：}{x|${currencySymbol.value}${data.value} | ${percent}% }\n${salesInfo}`
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              lineHeight: 28,
            },
            b: {
              color: '#7d7f84',
              fontSize: 16,
              lineHeight: 20,
              align: 'left',
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
            },
          },
        },
        data: data1.value,
        color: ['#e65a56', '#62d9ad', '#f5a623', '#409eff'],
      },
    ],
  }
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  // 配置项
  option2.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''

        const isSpendDimension = pieSelectMap[pieSelect.value] === 'spend'
        const valueDisplay = isSpendDimension ? `${currencySymbol.value}${params.data.value}` : params.data.value

        itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">${pieSelectLabelMap[pieSelect.value]}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${valueDisplay} | ${params.percent}%</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: '搜索词',
        type: 'pie',
        radius: '50%',
        // center: ['50%', '30%'],
        left: 0,
        right: 0,
        top: 0,
        bottom: 40,
        // clockwise: false,
        startAngle: 90, //起始角度
        labelLine: {
          length: 10, // 缩短连接线长度
          length2: 5, // 缩短连接线第二段长度
          lineStyle: {
            width: 1, // 细化连接线
          },
        },
        label: {
          position: 'outer',
          alignTo: 'edge',
          edgeDistance: 5, // 减小标签与边缘的距离
          formatter: (params: any) => {
            const { data, percent } = params

            const isSpendDimension = pieSelectMap[pieSelect.value] === 'spend'
            const valueDisplay = isSpendDimension ? `${currencySymbol.value}${data.value}` : data.value

            return `{a|${data.name}}\n{b|${pieSelectLabelMap[pieSelect.value]}：}{x|${valueDisplay} | ${percent}% }`
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              padding: [0, 0, 2, 0], // 减少底部内边距
            },
            b: {
              color: '#7d7f84',
              fontSize: 16,
              lineHeight: 20,
              align: 'left',
              padding: [0, 0, 2, 0], // 减少底部内边距
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
              padding: [0, 0, 2, 0], // 减少底部内边距
            },
          },
        },
        data: processedData.value,
        color: [
          '#ffdc4c', // 金黄色
          '#62d9ad', // 青绿色
          '#e65a56', // 珊瑚红
          '#00aeef', // 天蓝色
          '#ffa500', // 橙色
          '#20c997', // 翠绿色
          '#0088cc', // 深天蓝色
          '#ffcc33', // 明黄色
          '#66cdaa', // 中青绿色
          '#33b5e5', // 浅蓝色
          '#5bc0de', // 宝石蓝
        ],
      },
    ],
  }
  chartInstance2?.setOption(option2.value)
}
// 更新图表
// const updateChart1 = () => {
//   chartInstance1?.setOption(option1.value, true)
// }
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value, true)
}
const handleChangeSelect = () => {
  updatePieChartDisplay()
}
// onBeforeMount 中不再需要处理数据，现在在获取数据后通过 updatePieChartDisplay 处理
// 初始化图表
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
})

// 销毁图表
onBeforeUnmount(() => {
  if (chartInstance1) {
    chartInstance1.dispose()
    chartObserver1.disconnect()
  }
  if (chartInstance2) {
    chartInstance2.dispose()
    chartObserver2.disconnect()
  }
})
const getCategoryColor = (value: any) => {
  switch (value) {
    case 1: {
      return '#e65a56' // 高ACOS - 红色（问题/警告）
    }
    case 2: {
      return '#62d9ad' // 低ACOS - 绿色（良好）
    }
    case 3: {
      return '#f5a623' // 高点击不出单 - 橙色（中等警告）
    }
    default: {
      return '#409eff' // 低点击不出单 - 蓝色
    }
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '客户搜索词') {
    return {
      textAlign: 'left',
    }
  } else if (label === 'ACOS') {
    if (data.row.acos <= 30) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else if (data.row.acos <= 35) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-warning)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === '点击率(我们/大盘)') {
    if (data.row.clickThruRate >= data.row.marketClickThruRate) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === '转化率(我们/大盘)') {
    if (data.row.conversionRate >= data.row.marketConversionRate) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  }
  return {
    textAlign: 'center',
  }
}
</script>

<style lang="scss" scoped>
.pie-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .el-table {
    flex: 1;
  }
}
</style>
