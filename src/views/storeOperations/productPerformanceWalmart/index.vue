<template>
  <div class="comprehensive-height-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.site"
              class="multiple-select"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="全部站点"
              style="width: 220px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="币种">
            <el-select v-model="selectCurrency" clearable placeholder="请选择币种" @change="changeCurrency">
              <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select
              v-model="queryForm.operationUserId"
              :disabled="disabledOpe"
              placeholder="请选择运营人员"
              style="width: 5em"
              @change="queryData"
            >
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="开发人">
            <el-select
              v-model="queryForm.developUserId"
              :disabled="disabledDev"
              placeholder="请选择开发人"
              style="width: 5em"
              @change="queryData"
            >
              <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
          </el-form-item>
          <el-form-item>
            <el-text style="margin-left: 10px; font-weight: 600">数据更新时间：2024年12月22日14:02</el-text>
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
          <vab-draggable
            v-model="columns"
            :animation="600"
            filter=".non-draggable"
            handle=".handle"
            :on-end="handleEnd"
            :on-move="handleMove"
          >
            <div
              v-for="item in columns"
              :key="item.label"
              :class="{ 'non-draggable': item.disableCheck }"
              style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
            >
              <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
              <span style="flex: 1">{{ item.label }}</span>
              <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                <vab-icon icon="eye-line" />
              </span>
              <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                <vab-icon v-show="!item.checked" icon="eye-off-line" />
                <vab-icon v-show="item.checked" icon="eye-line" />
              </span>
            </div>
          </vab-draggable>
        </el-popover>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
      :header-cell-class-name="headerCell"
      :header-cell-style="{ textAlign: 'center' }"
      @cell-click="cellClick"
      @sort-change="walmartSortChange"
    >
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? 'custom' : false"
        :width="item.width"
      >
        <template #header>
          <span v-if="item.label === '销量趋势(点击看明细)'">
            销量趋势
            <br />
            (点击看明细)
          </span>
          <span v-if="item.label === '库存可售'">
            库存
            <br />
            可售
          </span>
          <span v-if="item.label === '月销售额'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                月销售额
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">过去30天的销售额</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '月退款%'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                月退款%
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">过去30天的退款占比</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '月退货%'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                月退货%
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">过去30天的退货占比</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '可售含在途'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                可售
                <br />
                含在途
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">含在途数量的可售天数+断货天数</div>
              </template>
            </el-tooltip>
          </span>
        </template>
        <template #default="{ row }">
          <span v-if="item.label === '图片'">
            <el-image
              fit="fill"
              :src="row.skuImgUrl"
              style="display: block; width: 75px; height: 75px"
              @click="imagePreviewShow(row.skuImgUrl)"
            >
              <template #error><el-icon /></template>
            </el-image>
          </span>
          <!-- SKU 展示-->
          <span v-if="item.label === 'SKU'">
            <el-link :href="row.amazonUrl" style="margin-right: 3px" target="_blank">{{ row.sku }}</el-link>
            <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
              <vab-icon icon="file-copy-2-fill" />
            </span>

            <div class="rate-wrapper" style="cursor: pointer" @click="goToReview(row.itemNumber)">
              <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
              <span>
                <el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" />
              </span>
              <span class="rate-count">{{ row.commentsNumbers }}</span>
              <span :class="{ 'japan-flag': row.flag === 'JP' }" style="margin-top: -2px">
                <country-flag :country="row.flag" />
              </span>
            </div>
          </span>
          <span v-if="item.label === '销量趋势(点击看明细)'">
            <div class="custom-bar">
              <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
            </div>
          </span>
          <span v-if="item.label === '运营分类'">
            <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="handleUpdateOpeType(row)">
              <el-option v-for="a in row.operationTypeList" :key="a.id" :label="a.label" :value="a.id" />
            </el-select>
          </span>
          <span v-if="item.label === '停产'">
            <el-checkbox v-model="row.stopProductStatus" :false-value="0" :true-value="1" @change="handleUpdateStopStatus(row)" />
          </span>
          <span v-if="item.label === '自量FBA'">
            {{ row.currencyIcon + (row.selfAssessmentFba ?? '') }}
            <br />
            {{ row.currencyIcon + (row.amazonFba ?? '') }}
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

          <span v-if="item.label === '状态'">
            <el-tag v-if="row.walmartStatus === 'PUBLISHED'" type="success">{{ row.walmartStatus }}</el-tag>
            <el-tag v-if="row.walmartStatus === 'UNPUBLISHED'" type="danger">{{ row.walmartStatus }}</el-tag>
          </span>
          <span v-if="item.label === '运营备注'">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.operationRemark) }}</el-text>
            </el-tooltip>
          </span>

          <span v-if="item.label === '季节趋势'">
            <div style="width: 100%; height: 50px">
              <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="row._actualList || []" />
            </div>
          </span>
          <span v-if="item.label === '当前售价'">
            {{ row.currencyIcon + row.sellingPrice }}
          </span>
          <span v-if="item.label === '剩余库存'">{{ row.availableInventory }}/{{ row.fbaCount }}</span>
          <span v-if="item.label === '库龄'">
            <span v-html="row.storageAge"></span>
          </span>
          <span v-if="item.label === '订货#'">
            {{ row.orderCount }}
            <br />
            <span style="font-weight: bold">{{ row.orderTotalNumber }}</span>
          </span>
          <span v-if="item.label === '开发人员'">
            <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row._developNameFull }}</div>
              </template>
              <span v-html="row._developName"></span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
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
    <!-- <vab-filter-dialog 
      :filter-visible="filterVisible"
      @update-visible="handleCloseFilterDialog"
    /> -->
    <!-- 运营分类 -->
    <vab-operational-classify :ope-classify-visible="opeClassifyVisible" @update-visible="closeOpeClassify" />
    <!-- 关键词排名趋势 -->
    <vab-key-word-rank-trend :key-word-trend-visible="keyWordTrendVisible" @update-visible="handleCloseKeyWordTrend" />
    <!-- 运营备注 -->
    <vab-dialog v-model="remarkVisible" title="运营备注" width="20%">
      <el-input v-model="remark" placeholder="请输入运营备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 季节趋势 -->
    <vab-dialog v-model="seasonalVisible" title="季节趋势" width="40%" @open="handleSeasonalOpened">
      <div ref="chartContainer1" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 筛选 -->
    <vab-filter-walmart-dialog
      :filter-visible="filterVisible"
      :loading="filterLoading"
      @update-filter="handleConfirmFilter"
      @update-visible="handleCloseFilterDialog"
    />
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search, Star } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { CheckboxValueType } from 'element-plus'
import type { CSSProperties } from 'vue'
import CountryFlag from 'vue-country-flag-next'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { months } from '../constantOption'
import { getDistributionOptionUserList } from '/@/api/devlocal/productDistribution'
import {
  filterWalmartList,
  getCurrencyWalmartOperation,
  getDevelopUserList,
  getOperationColumnList,
  getOperationWalmartList,
  getUserAmazonOperation,
  getWalmartCurrencyList,
  getWalmartSiteList,
  hideOrShowOperationColumn,
  updateCurrencyWalmartOperation,
  updateOperationSKUDisContinuedStatus,
  updateOperationWalmartOperateTypeList,
  updateRemarkWalmartOperation,
  updateSortOperationColumn,
} from '/@/api/devlocal/productPerformance'
import handleClipboard from '/@/utils/clipboard'
import { getAmazonStars } from '/@/utils/rate'
import { calculateBrColumnWidth, flexColumnWidth, processField, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductPerformanceWalmart',
})

let _row: any
const remark = ref('')
const filterLoading = ref<boolean>(false)
const handleUpdateOpeType = async (row: any) => {
  await updateOperationWalmartOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}
const confirmUpdateRemark = async () => {
  const { data } = await updateRemarkWalmartOperation({
    id: _row.id,
    remark: remark.value,
  })
  if (data) {
    $baseMessage('运营备注修改成功！', 'success')
    remarkVisible.value = false
    _row.operationRemark = remark.value
  }
}
const handleUpdateStopStatus = async (row: any) => {
  await updateOperationSKUDisContinuedStatus({
    skuId: row.skuId!,
    status: row.stopProductStatus!,
    siteId: row.site,
  })
}
const changeCurrency = async () => {
  const { data } = await updateCurrencyWalmartOperation({
    currency: selectCurrency.value!,
  })
  if (data) {
    queryData()
  }
}
const handleConfirmFilter = async (filterForm: any) => {
  filterLoading.value = true
  try {
    const { site, ...filterQueryForm } = queryForm
    const siteIds = site.join(',')
    const { data } = await filterWalmartList({
      ...filterQueryForm,
      ...filterForm,
      siteIds,
    })
    if (data) {
      $baseMessage('沃尔玛运营筛选成功！', 'success')
      filterVisible.value = false
      total.value = data.total
      list.value = data.list
    }
  } catch {
    $baseMessage('筛选失败，请重试', 'error')
  } finally {
    filterLoading.value = false
  }
}
const walmartSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(column, prop, order)
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  // console.log(order)
  queryData()
}
const headerCell = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (['今销', '月销售额', '上新', '库存可售', '可售含在途'].includes(data.column.label)) {
    return 'header-cell'
  }
  return ''
}
const goToReview = (itemNumber: string) => {
  window.open(`https://www.walmart.com/reviews/product/${itemNumber}`, '_blank')
}
let _seasonalCoefficient = {
  actualList: [],
  referenceList: [],
}
const disabledOpe = ref<boolean>(false)
const disabledDev = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const seasonalVisible = ref<boolean>(false)
const chartContainer1 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartObserver1: ResizeObserver

const option1 = ref<any>({})
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const listLoading = ref<boolean>(false)
const total = ref<number>(0)

const filterVisible = ref<boolean>(false)
const keyWordTrendVisible = ref<boolean>(false)
const opeClassifyVisible = ref<boolean>(false)
const label1 = [
  '今销',
  'FBA仓储费',
  'FBA差异',
  '月净利润',
  '月销售额',
  '月广告销售',
  '月广告支出',
  '预计下月仓储费',
  '盈亏售价',
  '30毛利售价',
]
const label2 = [
  '试算毛利',
  '2周广告转化',
  '2周广告点击',
  '2周总转化',
  '月净利率',
  '月ACOS',
  '月TACOS',
  '1年ACOS',
  '1年TACOS',
  '月退货%',
  '月退款%',
]
const label3 = ['上新', '库存可售', '可售含在途', '断货']
const label1Map = new Map([
  ['今销', 'currentSalesPrice'],
  ['FBA仓储费', 'fbaStorageFee'],
  ['FBA差异', 'differenceFba'],
  ['月净利润', 'monthNetProfit'],
  ['月销售额', 'monthSalesPrice'],
  ['月广告销售', 'monthAdvSales'],
  ['月广告支出', 'monthAdvExpenditure'],
  ['预计下月仓储费', 'estimateNextMonthStorageFee'],
  ['盈亏售价', 'profitLossSellingPrice'],
  ['30毛利售价', 'grossSellingPrice'],
])
const label2Map = new Map([
  ['试算毛利', 'grossProfit'],
  ['2周广告转化', 'tWksAdvRate'],
  ['2周广告点击', 'tWksClickRate'],
  ['2周总转化', 'tWksTotalConv'],
  ['月净利率', 'monthNetProfitMargin'],
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['1年ACOS', 'yearAcos'],
  ['1年TACOS', 'yearTacos'],
  ['月退货%', 'monthReturnGoods'],
  ['月退款%', 'monthRefund'],
])
const label3Map = new Map([
  ['上新', 'newArrivalDay'],
  ['库存可售', 'esAvailableSaleDay'],
  ['可售含在途', 'esAvailableSaleDayTotal'],
  ['断货', 'outOfStock'],
])
const columns = ref<any>([])

const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 16 })
  columns.value = data
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
    // 设置 最小宽度
    if (item.prop !== 'componentImage') {
      delete item.width
    }
    // 设置排序
    if (
      [
        'currentSalesNumber',
        'currentSalesOrder',
        'monthSalesVolume',
        'monthSalesPrice',
        'newArrivalDay',
        'esAvailableSaleDay',
        'esAvailableSaleDayTotal',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
  })
}

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.site = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    queryForm.site = []
    // 取消全选获取数据
    queryData()
  }
}
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
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: _seasonalCoefficient.actualList,
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: _seasonalCoefficient.referenceList,
        itemStyle: {
          color: '#ff8fa5',
        },
        smooth: true,
      },
    ],
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
const cellClick = async (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '运营备注': {
      showRemark()
      _row = row
      remark.value = row.operationRemark
      break
    }
    case '季节趋势': {
      seasonalVisible.value = true
      _seasonalCoefficient = row.seasonalCoefficient
      break
    }

    // No default
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
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}
const closeOpeClassify = () => {
  opeClassifyVisible.value = false
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  })
  await updateSortOperationColumn(req)
}
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
// 处理自适应宽度
const handleWidth = (item: any) => {
  switch (item.label) {
    case 'SKU': {
      return flexColumnWidth(list.value, 'SKU-SKU-SKU-SKU-', 'sku', 60)
    }
    case 'ASIN': {
      return flexColumnWidth(list.value, 'ASIN', 'asin')
    }
    case '父体ASIN': {
      return flexColumnWidth(list.value, '父体ASIN', 'parentAsin')
    }
    case '运营分类': {
      return flexColumnWidth(list.value, '运营分类', 'operationTypeList', 60) // 处理运营分类列
    }
    case '产品描述': {
      return flexColumnWidth(list.value, '产品描述', 'productDesc')
    }
    case '开发人员': {
      return calculateBrColumnWidth(list.value, (row: any) => row._developName, 100)
    }
    case '剩余库存': {
      const availableWidth = flexColumnWidth(list.value, '剩余库存', 'availableInventory')
      const fbaWidth = flexColumnWidth(list.value, '/', 'fbaCount', 0)
      return `${Number(availableWidth) + Number(fbaWidth)}px`
    }
    default: {
      return item.minWidth
    }
  }
}

const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
interface optionType {
  id: number
  label: string
}
const currencyList = ref<optionType[]>([])
const selectCurrency = ref<number | undefined>(0)

const developUserList = ref<optionType[]>([])
const siteList = ref<optionType[]>([])
const operateUserList = ref<optionType[]>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: '',
  developUserId: '',
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
})
const fetchCurrencyList = async () => {
  const { data } = await getWalmartCurrencyList()
  currencyList.value = data
}
const fetchCurrency = async () => {
  const { data } = await getCurrencyWalmartOperation()
  selectCurrency.value = data
}

const fetchDevelopUserList = async () => {
  const { data } = await getDevelopUserList()
  developUserList.value = data
  developUserList.value.unshift({ id: -1, label: '全部' })
}
const fetchUser = async () => {
  const { data } = await getUserAmazonOperation()
  queryForm.operationUserId = data.operationUserId
  queryForm.developUserId = data.developUserId
}
const fetchSiteList = async () => {
  const { data } = await getWalmartSiteList()
  siteList.value = data
}
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
const list = ref<any[]>([])
const getCurrentMonthIndex = () => {
  return new Date().getMonth() // 获取当前月份索引(0-11)
}
const seasonalXData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const currentMonthIndex = getCurrentMonthIndex()
  // 从当前月份开始重新排列月份数组
  return [...months.slice(currentMonthIndex), ...months.slice(0, currentMonthIndex)]
})
const reorderSeasonalData = (data: number[]) => {
  if (data.length !== 12) return data
  const currentMonthIndex = getCurrentMonthIndex()
  return [...data.slice(currentMonthIndex), ...data.slice(0, currentMonthIndex)]
}
const fetchData = async () => {
  if (listLoading.value) return
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const { data } = await getOperationWalmartList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    item._actualList = reorderSeasonalData(item.seasonalCoefficient.actualList)
    processField(item, 'developName', 2)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
    item.storageAge = `
      <div class="storage-list">
        <div class="storage-item">
          <span class="value1">181-270</span>
          <span class="value2">${item.inventoryAgeLevel1Days ? item.inventoryAgeLevel1Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel1Value ? item.inventoryAgeLevel1Value : 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">271-360</span>
          <span class="value2">${item.inventoryAgeLevel2Days ? item.inventoryAgeLevel2Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel2Value ? item.inventoryAgeLevel2Value : 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">361+</span>
          <span class="value2">${item.inventoryAgeLevel3Days ? item.inventoryAgeLevel3Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel3Value ? item.inventoryAgeLevel3Value : 0})</span>
        </div>
      </div>
    `
  })
  listLoading.value = false
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', 'ASIN', '父体ASIN', '库龄', '产品描述'].includes(label)) {
    return {
      textAlign: 'left',
    }
  } else if (label === '运营备注') {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  } else
    switch (label) {
      case '月净利润': {
        if (data.row.monthNetProfit > 0) {
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

      default: {
        return {
          textAlign: 'center',
        }
      }
    }
}
onBeforeMount(async () => {
  // 获取列配置
  await fetchColumn()
  // 获取站点列表
  await fetchSiteList()
  // 获取币种列表
  await fetchCurrencyList()
  // 获取默认币种
  await fetchCurrency()
  // 获取运营人员列表
  await fetchOperateUserList()
  // 获取开发人员列表
  await fetchDevelopUserList()
  // 获取默认运营人和开发人
  await fetchUser()
  await fetchData()
})
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
    .storage-list {
      display: grid;
      .storage-item {
        display: grid;
        grid-template-columns: 70px 35px 60px; /* 设定固定列宽 */
        text-align: left;

        .value2 {
          font-weight: 550;
          color: #000;
        }

        .value3 {
          font-weight: 550;
          color: var(--el-color-danger);
        }
      }
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
        cursor: pointer;
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
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
.icon-dis {
  padding: 6px;
}
.custom-bar {
  width: 100%;
  height: 50px;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.noneHoverTable :deep(.header-cell .cell) {
  display: flex; /* 应用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center;
}
// 日本国旗样式增加边框
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
}
</style>
