<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="亚马逊" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点">
                <el-select
                  v-model="queryForm.site"
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
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                      所有
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="currency" clearable placeholder="请选择币种" @change="changeCurrency">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: bold;" >今销更新时间: 2025-05-23 17:27:11</el-text>
                <el-divider direction="vertical" />
                <el-text style="font-weight: bold;" >月数据更新时间: 2025-05-23 17:27:11</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
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
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base); " 
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-hover" style="display: flex; align-items: center;">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer; " @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm" @submit.prevent >
              <el-form-item>
                <el-input v-model="queryForm.keyword" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
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
          @cell-click="cellClick"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :header-cell-class-name="headerCell"
          :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
          @sort-change="artSortChange"
        >
          <el-table-column
            v-for="(item, index) in checkList"
            :key="index"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :width="item.width"
            :sortable="item.sortable ? 'custom' : false"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '小类排名'">
                小类
                <br />
                (可点)
              </span>
              <span v-if="item.label === '大类排名'">
                大类
                <br />
                (可点)
              </span>
              <span v-if="item.label === 'VOC满意度'">
                VOC满意度
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告
                <br />
                转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告
                <br />
                点击
              </span>
              <span v-if="item.label === '今销'">
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">今销 <el-icon><question-filled /></el-icon> </div>
                  <template #content>
                    <div class="custom-tooltip">今日销售额</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月销售额'">
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">月销售额 <el-icon><question-filled /></el-icon> </div>
                  <template #content>
                    <div class="custom-tooltip" >过去30天的销售额</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月退款%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">月退款% <el-icon><question-filled /></el-icon> </div>
                  <template #content>
                    <div class="custom-tooltip" >过去30天的退款占比</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月退货%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">月退货% <el-icon><question-filled /></el-icon> </div>
                  <template #content>
                    <div class="custom-tooltip" >过去30天的退货占比</div>
                  </template>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)" >
                  <template #error><el-icon/></template>
                </el-image>
              </span>
           
              <span v-if="item.label === 'SKU'" class="sku-container">
                <div>
                  <span class="copySku" @click="handleClipboard($event, row.sku)" >
                    <el-tooltip effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">{{ row.sku }}</div>
                      </template>
                      <el-link :href="row.amazonUrl" class="sku-text"  target="_blank">{{ row.sku }}</el-link>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">复制SKU</div>
                      </template>
                      <vab-icon icon="file-copy-2-fill"/>
                    </el-tooltip>
                  </span>
                  <el-tooltip effect="dark" placement="top">
                    <template #content>
                      <div class="custom-tooltip">复制ASIN</div>
                    </template>
                    <vab-icon icon="file-copy-line" @click="handleClip(row.asin)" />
                  </el-tooltip>
                </div>
                  
                <div
                  class="rate-wrapper"
                  style="cursor: pointer"
                  @click=""
                >
                  <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
                  <span>
                    <el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" />
                  </span>
                  <span class="rate-count">{{ row.commentsNumbers }}</span>
                  <span style="margin-top: -2px"><country-flag :country='row.flag'/></span>
                </div>
              </span>
              <!-- <span v-if="item.label === 'ASIN'" >
                <el-link type="primary" >{{ row.asin }}</el-link>
              </span>
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary" >{{ row.parentAsin }}</el-link>
              </span> -->
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div style="width: 100%; height: 50px;">
                  <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
                </div>
              </span>
              <span v-if="item.label === '上新'">
                {{ row.newArrivalDay != null ? row.newArrivalDay + '天' : '' }}
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox disabled v-model="row.stopProductStatus" :false-value="0" :true-value="1" />
              </span>
              <span v-if="item.label === '运营分类'">
                <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="">
                  <el-option v-for="a in row.operationTypeList" :key="a.id" :label="a.label" :value="a.id" />
                </el-select>
              </span>

              <span v-if="item.label === 'VOC满意度'">
                {{ row.vocNcxCount }} / {{ row.vocTotalOrderCount }}
                <el-tag v-if="row.vocSatisfaction === '极差'" class="customTag customTag-veryPoor">极差 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                <el-tag v-if="row.vocSatisfaction === '一般'" class="customTag customTag-fair">一般 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                <el-tag v-if="row.vocSatisfaction === '不合格'" class="customTag customTag-poor">不合格 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                <el-tag v-if="row.vocSatisfaction === '良好'" class="customTag customTag-good">良好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                <el-tag v-if="row.vocSatisfaction === '极好'" class="customTag customTag-excellent">极好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
              </span>
              <span v-if="item.label === '小类排名'">
                <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0">
                  <div>{{ row.nowSubcategoryRanking }}</div>
                  <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                  <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
                  <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
                </div>
                <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0">
                  <el-space>
                    {{ row.nowSubcategoryRanking }}
                    <span style="font-weight: 600;">-</span>
                  </el-space>
                </div>
              </span>
              <span v-if="item.label === '大类排名'">
                <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0">
                  <div>{{ row.nowMajorCategoryRanking }}</div>
                  <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                  <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill"/>
                  <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
                </div>
                <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0">
                  <el-space>
                    {{ row.nowMajorCategoryRanking }}
                    <span style="font-weight: 600;">-</span>
                  </el-space>
                </div>
              </span>
              <span v-if="item.label === '状态'">
                <el-tag v-if="row.status === 0" type="danger">停售</el-tag>
                <el-tag v-if="row.status === 1" type="success">正常</el-tag>
                <el-tag v-if="row.status === -1" type="info">领星未同步</el-tag>
                <el-tag v-if="row.status === 2" type="warning">链接不完整</el-tag>
              </span>
              <span v-if="item.label === '开发人员'">
                <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ row._developNameFull }}</div>
                  </template>
                  <span v-html="row._developName"></span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '2周广告点击'" style="display: flex; justify-content: center;">
                <div style=" width: fit-content;text-align: left;">
                  <div>{{ formatPercentage(row.tWksClickRate, 2) }}</div>
                  <div >({{ row.tWksClicks }})</div>
                </div>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
              </span>
              <span v-if="label2.includes(item.label)">
                {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
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
      </el-tab-pane>
      <el-tab-pane label="沃尔玛" :name="1" />
      <el-tab-pane label="Tiktok" :name="2" />
    </el-tabs>
    <!-- 小类排名/大类排名 -->
    <vab-dialog v-model="rankVisible" :title="title" width="40%" @open="handleRankOpened">
      <div style="text-align: center">
        <el-date-picker 
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="handleRankChange"
        />
      </div>
      <div ref="chartContainer2" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- VOC满意度 -->
    <vab-dialog v-model="vocVisible" title="VOC满意度" width="40%" @open="handleVocOpened">
      <div style="text-align: center">
        <el-date-picker 
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="fetchSkuVocData"
        />
      </div>
      <div ref="chartContainer3" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search, Star } from '@element-plus/icons-vue'
import { dayjs, type CheckboxValueType } from 'element-plus'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { getCurrencyList, getCurrencySKUAmazonOperation, getOperationAmazonArtDesignList, getOperationAmazonAsinRankList, getOperationAmazonParentAsinRankList, getOperationAmazonSkuRankCateList, getOperationAmazonSkuRankList, getOperationAmazonSkuVocList, updateCurrencySKUAmazonOperation } from '/@/api/devlocal/productPerformance'
import { formatPercentage, getAmazonStars, handleImgUrl } from '/@/utils/rate'
import { flexColumnWidth, processField } from '/@/utils/tableColum'
import handleClipboard, { handleClip } from '/@/utils/clipboard'
import CountryFlag from 'vue-country-flag-next'
import { IOperationAmazonSkuRankList, IOperationAmazonSkuVocList } from '~/src/type/storeOperation/productPerformanceType'
import * as echarts from 'echarts'

defineOptions({
  name: 'ProductPerformanceArt'
})

let copyRow: any
const vocVisible = ref<boolean>(false)
const chartLoading = ref<boolean>(false)
const rankValue = ref<IOperationAmazonSkuRankList[]>([])
const chartContainer2 = ref<HTMLElement | null>(null)
const chartContainer3 = ref<HTMLElement | null>(null)
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartObserver2: ResizeObserver
let chartObserver3: ResizeObserver
const option2 = ref<any>({})
const option3 = ref<any>({})
const vocValue = ref<IOperationAmazonSkuVocList[]>([])
const title = ref<string>('')
const rankVisible = ref<boolean>(false)
const rankDate = ref<[Date, Date]>([
  new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
  new Date() // 今天
])
const shortcuts = [
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '近60天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 59)
      return [start, end]
    },
  },
  {
    text: '近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 89)
      return [start, end]
    },
  },
  {
    text: '近半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '近1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2024-12-20') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]
const handleRankOpened = () => {
  nextTick(() => {
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
}
const handleVocOpened = () => {
  nextTick(() => {
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
}
const initChart2 = () => {
  option2.value = {
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
      data: () => rankValue.value.map((item) => item.updateDate),
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
      name: '小类排名',
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
        name: '小类排名',
        type: 'line',
        data: () => rankValue.value.map((item) => item.rank),
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
  }

  chartInstance2?.setOption(option2.value)
}
const initChart3 = () => {
  option3.value = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">不满意率</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          return `<div style="display: flex;align-items:center;">
            ${item.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px -1px 2px;">${params[0].name}</div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}%</span>
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
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: () => vocValue.value.map((item) => item.eventDate),
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
      name: '不满意率(%)',
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
        name: '不满意率',
        type: 'line',
        data: () => vocValue.value.map((item) => item.ncxRate),
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
  }

  chartInstance3?.setOption(option3.value)
}
const handleRankChange = () => {
  if (title.value === '小类排名') {
    fetchSkuRankData()
  } else if(title.value === '大类排名') {
    fetchSkuCateRankData()
  }
}
// 获取小类排名数据
const fetchSkuRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)
  
    const { data } = await getOperationAmazonSkuRankList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  
  
  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '小类排名'
    option2.value.series[0].name = '小类排名'
    option2.value.xAxis.data = rankValue.value.map(item => item.updateDate)
    option2.value.series[0].data = rankValue.value.map(item => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
const fetchSkuCateRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)

    const { data } = await getOperationAmazonSkuRankCateList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  
  
  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '大类排名'
    option2.value.series[0].name = '大类排名'
    option2.value.xAxis.data = rankValue.value.map(item => item.updateDate)
    option2.value.series[0].data = rankValue.value.map(item => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
// sku获取voc满意度趋势
const fetchSkuVocData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  const { data } = await getOperationAmazonSkuVocList({
    sku: copyRow.sku,
    siteId: copyRow.site,
    startDate: formatStartDate,
    endDate: formatEndDate,
  })
  vocValue.value = data
  // 更新图表数据
  if (chartInstance3) {
    option3.value.xAxis.data = vocValue.value.map(item => item.eventDate)
    option3.value.series[0].data = vocValue.value.map(item => item.ncxRate)
    chartInstance3?.setOption(option3.value)
  }
  chartLoading.value = false
}
const cellClick = async (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '小类排名': {
      rankVisible.value = true
      // 默认打开是近30天
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = '小类排名'
      fetchSkuRankData()
      break
    }
    case '大类排名': {
      rankVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = '大类排名'
      fetchSkuCateRankData()
      break
    }
    case 'VOC满意度': {
      vocVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = 'VOC满意度'
      fetchSkuVocData()
      break
    }
    // No default
  }
}
const artSortChange = (data: { column: any, prop: string, order: any }) => {
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
  queryForm.orderDirection = column.order === "ascending" ? 'asc' : 'desc'
  // console.log(order)
  queryData()
}

const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const activeName = ref<number>(0)
const currency = ref<number | undefined>(0)
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const siteList = ref<{ id: number, label: string }[]>([])
const currencyList = ref<{ id: number, label: string }[]>([])
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyword: '',
  site: [],
  pageNo: 1,
  pageSize: 20,
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
})
const { site } = toRefs(queryForm)
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const columns = ref<any>([
  {
    label: '图片',
    prop: 'skuImgUrl',
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
    label: 'ASIN',
    prop: 'asin',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '父体ASIN',
    prop: 'parentAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
    isFixed: 'left'
  },
  {
    label: '今销量',
    prop: 'currentSalesNumber',
    checked: true,
    minWidth: 100,
    sortable: true
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销',
    prop: 'currentSalesPrice',
    checked: true,
    minWidth: 110,
    sortable: true
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 80,
  },
  {
    label: '站点',
    prop: 'siteName',
    checked: true,
    minWidth: 150,
  },
  {
    label: '小类排名',
    prop: 'nowSubcategoryRanking',
    checked: true,
    minWidth: 90,
  },
  {
    label: '大类排名',
    prop: 'nowMajorCategoryRanking',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'VOC满意度',
    prop: 'vocSatisfaction',
    checked: true,
    minWidth: 130,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    checked: true,
    minWidth: 130,
  },
  {
    label: '上新',
    prop: 'newArrivalDay',
    checked: true,
    minWidth: 90,
  },
  {
    label: '停产',
    prop: 'stopProductStatus',
    checked: true,
    minWidth: 60,
  },
  {
    label: '2周广告转化',
    prop: 'tWksAdvRate',
    checked: true,
    minWidth: 100,
  },
  {
    label: '2周广告点击',
    prop: 'tWksClickRate',
    checked: true,
    minWidth: 100,
  },
  {
    label: '2周总转化',
    prop: 'tWksTotalConv',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    checked: true,
    minWidth: 100,
    sortable: true
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    checked: true,
    minWidth: 140,
    sortable: true
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    checked: true,
    minWidth: 110,
  },
  {
    label: '开发人员',
    prop: 'developName',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营负责人',
    prop: 'operationUserName',
    checked: true,
    minWidth: 110,
  },
  {
    label: '产品描述',
    prop: 'productDesc',
    checked: true,
    minWidth: 100,
  },
])

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
const label2 = [
  '试算毛利',
  '2周广告转化',
  '2周总转化',
  '月净利率',
  '月ACOS',
  '月TACOS',
  '1年ACOS',
  '1年TACOS',
  '月退货%',
  '月退款%',
]
const label2Map = new Map([
  ['试算毛利', 'grossProfit'],
  ['2周广告转化', 'tWksAdvRate'],
  ['2周总转化', 'tWksTotalConv'],
  ['月净利率', 'monthNetProfitMargin'],
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['1年ACOS', 'yearAcos'],
  ['1年TACOS', 'yearTacos'],
  ['月退货%', 'monthReturnGoods'],
  ['月退款%', 'monthRefund'],
])
const handleTabClick = () => {
  //
}
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteList.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
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
const changeCurrency = async () => {
  const { data } = await updateCurrencySKUAmazonOperation({ currency: currency.value! })
  if (data) {
    queryData()
  }
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 处理自适应宽度
const handleWidth = (item: any) => {
  
  switch (item.label) {
    case 'SKU': {
      return 255
    }
    case 'ASIN': {
      return flexColumnWidth(list.value, 'ASIN', 'asin')
    }
    case '父体ASIN': {
      return flexColumnWidth(list.value, '父体ASIN', 'parentAsin')
    }
    case '产品描述': {
      return flexColumnWidth(list.value, '产品描述', 'productDesc')
    }
    default: {
      return item.minWidth
    }
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
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', '库龄', '产品描述'].includes(label)) {
    return {
      textAlign: 'left',
    }
  } else if (label === '运营备注') {
    return {
      textAlign: 'left',
      cursor: 'pointer'
    }
  } else if (['小类排名', '大类排名', 'VOC满意度'].includes(label)) {
    return {
      textAlign: 'center',
      cursor: 'pointer'
    }
  }
  return {
    textAlign: 'center',
  }
}
const headerCell = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (['今销', '月销售额'].includes(data.column.label)) {
    return 'header-cell'
  }
  return ''
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
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
const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
}

const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const siteIds = site.join(',')
  const { data } = await getOperationAmazonArtDesignList({
    ...filterQueryForm,
    siteIds
  })
  if (data) {
    total.value = data.total
    list.value = data.list
    list.value.forEach((item: any) => {
      if (item.skuImgUrl) item.skuImgUrl = handleImgUrl(item.skuImgUrl)
      item.displayRating = computed(() => getAmazonStars(item.rating!, item.commentsNumbers));
      processField(item, 'developName', 2)
    })
  }
  listLoading.value = false
}
const fetchCurrency = async () => {
  const { data } = await getCurrencySKUAmazonOperation()
  currency.value = data
}
onBeforeMount(() => {
  fetchCurrencyList()
  fetchCurrency()
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .left-panel {
            margin-bottom: 0;
          }
          .el-form {
            .el-form-item:first-child {
              .el-check-tag,
              .el-form-item__label {
                margin: 0 5px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .el-table {
          flex: 1;

          .copySku {
            display: inline-block; /* 使宽度适应内容，方便点击 */
            padding: 0; 
            cursor: pointer;
            -webkit-user-select: text;
            user-select: text;
            // transition: all 0.3s;
            &:hover {
              color: #000;
            }
          }
          .el-checkbox {
            transform: scale(1.3);
          }
        }
      }
    }
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

.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;

      .cell {
        padding-right: 0;
        padding-left: 0;
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
      }
    }

  }
  .rate-count {
    margin-left: -11px;
    color: #36788C;
  }
}
.customTag {
  width: 7em;
  padding: 0 30px;
  color: #fff;
  border: 0;
  border-radius: 17px;

  &-veryPoor {
    background-color: #e32e00;
  }
  &-good {
    background-color: #bad411;
  }
  &-fair {
    background-color: #ffc400;
  }
  &-poor {
    background-color: #ff9900;
  }
  &-excellent {
    background-color: #49850f;
  }
}

.arrow-up {
  margin-left: 3px;
  font-weight: 600;
  color: #ff3f48; 
  transform: scale(0.9, 1.4);  
  
}
.arrow-down {
  margin-left: 3px;
  font-weight: 600;
  color: #67C23A;
  transform: scale(0.9, 1.4);  
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}

.sku-text {
  :deep(.el-link__inner){
    display: inline-block;
    max-width: 190px;
    margin-right: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
}
.sku-container {
  .icon-div {
    display: flex;
    align-items: center;
    margin-top: -6px;
   
    .el-tooltip {
      margin-right: 6px;
    }
  }
}

// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.noneHoverTable :deep(.header-cell .cell) {
  display: flex;          /* 应用 Flexbox 布局 */
  align-items: center;   /* 垂直居中 */
  justify-content: center;
}
</style>