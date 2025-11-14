<template>
  <div class="custom-table-container auto-height-container" :class="{ 'vab-table-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button v-permissions="{ permission: [EvaluationPermission.ADD] }" type="primary" @click="startEvaluation">开始评估</el-button>
        <el-button v-permissions="{ permission: [EvaluationPermission.KEYWORD_TREND] }" type="primary" @click="keyWordTrendVisible = true">
          关键词趋势
        </el-button>
        <el-button v-permissions="{ permission: [EvaluationPermission.DEFAULT_PARAMS] }" type="primary" @click="getScoreParams">
          评分参数
        </el-button>
        <!-- <el-button
          v-permissions="{ permission: ['newProduct:evaluation:score:params'] }"
          class="hidden-xs-only"
          type="primary"
          @click="costAccountingeParam"
        >
          成本核算默认参数
        </el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="custom-table-right-tools">
          <el-form inline :model="queryForm" @submit.prevent>
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
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
            </el-form-item>
          </el-form>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-style="{ textAlign: 'center' }"
      class="custom-table-hover"
      :data="evaluationList"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      :row-key="(row) => row.idNo"
      stripe
      @cell-click="keyWordTrendCellClick"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="(item, index) in indexColumns"
        :key="index"
        :label="item.label"
        :min-width="
          columnRenderConfig[item.label]?.padding && item.prop && columnWidths[item.prop]?.columnWidth
            ? columnWidths[item.prop].columnWidth
            : item.minWidth
        "
        :prop="item.prop"
      >
        <template #header>
          <span v-if="item.label === '自然单'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                自然单
                <el-icon><info-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">达到30%毛利所需要的自然销量占比（越低越好）</div>
              </template>
            </el-tooltip>
          </span>
        </template>
        <template #default="{ row }">
          <div v-if="item.label === '关键词趋势'">
            <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
          </div>
          <span
            v-else-if="columnRenderConfig[item.label]"
            :style="{
              display: 'inline-block',
              'min-width': columnWidths[item.prop].contentWidth + 'px',
              'text-align': columnRenderConfig[item.label].align,
            }"
          >
            {{ columnRenderConfig[item.label].format(row[item.prop]) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column :fixed="fixed" label="操作" width="180px">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="handleClick(row)">
              产品核算推进
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleClick(row)">
                  <el-link type="primary" underline="never">产品核算推进</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="toUpdateEvaluation(row)">
                  <el-link type="primary" underline="never">查看和修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="cliekFontSearchKeyWord(row)">
                  <el-link v-permissions="{ permission: [EvaluationPermission.KEYWORD_TREND] }" type="primary" underline="never">
                    关键词趋势
                  </el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="row.userId === currentLoginUserId" @click="sharedEvaluation(row)">
                  <el-link type="primary" underline="never">共享</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="getBenchmarkScoreDetail(row.idNo)">
                  <el-link v-permissions="{ permission: [EvaluationPermission.SCORE_DETAIL] }" type="primary" underline="never">
                    分数明细
                  </el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleCopyEvaluation(row.idNo)">
                  <el-link type="primary" underline="never">复制</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <vab-dialog v-model="keyWordTrendVisible" title="关键词趋势" width="500">
      <el-form style="margin-right: 3px; margin-left: 3px">
        <el-form-item label="关键词">
          <el-input v-model="inputKeyWord" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="searchKeyWordTrend">查询</el-button>
      </template>
    </vab-dialog>

    <!-- 关键词趋势图表 -->
    <vab-trend
      :key-word="inputKeyWord"
      :loading="chartLoading"
      :trend-data="trendEcharts"
      :trend-echarts-visible="keyWordTrendEchartsVisible"
      @update:clear-input-key-word="cleanKeyWordTrendData"
      @update:trend-echarts-list="updateTrendEchartsData"
      @update:visible-value="updateTrendVisibleValue"
    />

    <!-- 评分参数 -->
    <vab-dialog v-model="scoreParametersVisible" title="评分参数" width="500">
      <el-table
        border
        :cell-style="cellParameterStyle"
        :data="scoreParametersList"
        :header-cell-style="cellParameterStyle"
        height="700px"
        stripe
      >
        <el-table-column label="名称" property="key" />
        <el-table-column label="值">
          <template #default="scope">
            <div>
              <el-input v-model="scope.row.value" autocomplete="off" @blur="updateScoreParam(scope.row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <!-- 跑分明细 -->
    <vab-dialog v-model="benchmarkScoreVisible" title="跑分明细" width="560">
      <el-table border :data="benchmarkScoreList" :header-cell-style="cellScoreStyle" stripe style="width: fit-content">
        <el-table-column align="left" label="描述" prop="desc" width="290" />
        <el-table-column align="right" label="数量" prop="quantity" width="130" />
        <el-table-column align="right" label="分数" prop="score" width="100">
          <template #default="{ row }">
            <div v-if="row.desc === '第一部分总分-市场供求评分' || row.desc === '第二部分总分-亚马逊关键词首页评分'">
              {{ Math.round(row.score) }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer></template>
    </vab-dialog>

    <!-- 共享 -->
    <vab-shared
      :id="shareId"
      :fetch-data="fetchData"
      :handler-switch-change="handlerSwitchChange"
      :list="shareUserList"
      :visible="sharedVisible"
      @update:shared-visible="updateSharedVisibleValue"
    />

    <!-- 产品成本核算与推进子组件 -->
    <vab-estimated-cost-accounting
      :call-parent-method="fetchEstimatedCostAccounting"
      :channel-list="channelList"
      :evaluation-id="evaluationId"
      :flag="estimatedCostAccountingVisible"
      :list="estimatedCostAccountingList"
      :site-list="siteList"
    />

    <!-- 成本核算默认方式 -->
    <vab-cost-accounting-param
      :data="costAccountingFrom"
      :flag="costAccountingeParamVisible"
      @update:visible-value="updatecostAccountingeParamVisible"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, InfoFilled, Search } from '@element-plus/icons-vue'
import { type TableInstance } from 'element-plus'
import type { ColumnConfig } from './indexColumns'
import { indexColumns } from './indexColumns'
import {
  copyEvaluation,
  getEstimatedCostAccountingList,
  getEvaluationScoreDetail,
  getEvaluationScoreParameter,
  getEvaluationShareInfo,
  getEvaluationTrendList,
  getList,
  getSalesSiteList,
  updateEvaluationScoreParams,
  updateSharePerson,
} from '/@/api/devlocal/evaluation'
import { getUserInfo } from '/@/api/devlocal/userLogin'
import type {
  IBenchmarkScore,
  ICostAccounting,
  IEstimatedCostAccounting,
  IEvaluation,
  IEvaluationQueryReq,
  IEvaluationScore,
  IKeyWordTrend,
  IShared,
} from '/@/type/evaluation/evaluationType'

import type { CSSProperties } from 'vue'
import { getChannelList } from '/@/api/devlocal/encasement'
import EvaluationPermission from '/@/permissions/evaluation'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'NewProductEvaluation',
})

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.idNo
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.idNo === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
interface RenderConfig {
  align: 'left' | 'right'
  format: (value: any) => number | string
  widthLabel: string
  widthProp: string
  padding?: number
}
// 渲染配置
const columnRenderConfig: Record<string, RenderConfig> = {
  中文品名: {
    align: 'left',
    format: (value) => value,
    widthLabel: '中文品名',
    widthProp: 'productNameZh',
    padding: 30,
  },
  评估人: {
    align: 'left',
    format: (value) => value,
    widthLabel: '评估人',
    widthProp: 'prop',
    padding: 30,
  },
  亚马逊前台关键词: {
    align: 'left',
    format: (value) => value,
    widthLabel: '亚马逊前台关键词',
    widthProp: 'amazonFrontendKeywords',
    padding: 30,
  },
  亚马逊后台关键词: {
    align: 'left',
    format: (value) => value,
    widthLabel: '亚马逊后台关键词',
    widthProp: 'amazonBackendKeywords',
    padding: 30,
  },
  来源: {
    align: 'left',
    format: (value) => value,
    widthLabel: '来源',
    widthProp: 'productSource',
    padding: 30,
  },
  编号: {
    align: 'right',
    format: (value) => value,
    widthLabel: '编号',
    widthProp: 'prop',
    padding: 30,
  },
  年市场容量: {
    align: 'right',
    format: (value) => value,
    widthLabel: '年市场容量',
    widthProp: 'prop',
  },
  头部个数: {
    align: 'right',
    format: (value) => value,
    widthLabel: '头部个m',
    widthProp: 'other',
  },
  CPC$: {
    align: 'right',
    format: (value) => value,
    widthLabel: 'CPC$',
    widthProp: 'prop',
  },
  平均转化: {
    align: 'right',
    format: (value) => value,
    widthLabel: '平均转化',
    widthProp: 'prop',
  },
  平均售价: {
    align: 'right',
    format: (value) => value,
    widthLabel: '平均售价',
    widthProp: 'prop',
  },
  自然单: {
    align: 'right',
    format: (value) => value,
    widthLabel: '自然单%',
    widthProp: 'prop',
  },
  供求评分: {
    align: 'right',
    format: (value) => Math.round(value),
    widthLabel: '供求评分',
    widthProp: 'other',
  },
  总分: {
    align: 'right',
    format: (value) => Math.round(value),
    widthLabel: '总分',
    widthProp: 'other',
  },
  首页评分: {
    align: 'right',
    format: (value) => Math.round(value),
    widthLabel: '首页评m',
    widthProp: 'other',
  },
}

// 计算列宽
const columnWidths = computed(() => {
  return indexColumns.reduce((acc: Record<string, { contentWidth: number; columnWidth: number }>, item: ColumnConfig) => {
    if (item.prop && columnRenderConfig[item.label]) {
      const config = columnRenderConfig[item.label]
      const widthProp = config.widthProp === 'prop' ? item.prop : config.widthProp
      const contentWidth = flexColumnWidth(evaluationList.value, config.widthLabel, widthProp, 0)
      const padding = config.padding || 0
      const columnWidth = contentWidth + padding
      acc[item.prop] = { contentWidth, columnWidth }
    }
    return acc
  }, {})
})

const route = useRoute()
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
const tableRef = ref<TableInstance>()
const isFullscreen = ref<boolean>(false)

// 表格加载loading
const listLoading = ref<boolean>(true)
// 成本核算默认参数
const costAccountingeParamVisible = ref<boolean>(false)
// 关键词
const keyWordTrendVisible = ref<boolean>(false)
// 关键词趋势
const keyWordTrendEchartsVisible = ref<boolean>(false)
// 共享
const sharedVisible = ref<boolean>(false)
// 产品成本核算
const estimatedCostAccountingVisible = ref<boolean>(false)
// 评分参数
const scoreParametersVisible = ref<boolean>(false)
// 跑分明细
const benchmarkScoreVisible = ref<boolean>(false)
// 输入的关键词
const inputKeyWord = ref<string>('')

// 总记录数
const total = ref<number>(0)
// 评分参数列表
const scoreParametersList = ref<IEvaluationScore[]>([])
// 跑分明细参数列表
const benchmarkScoreList = ref<IBenchmarkScore[]>([])
// 产品成本核算列表
const estimatedCostAccountingList = ref<IEstimatedCostAccounting[]>([])
// 评估列表
const evaluationList = ref<IEvaluation[]>([])
// 共享人列表
const shareUserList = ref<IShared[]>([])
// 共享人id
const shareId = ref<string>('')
// 当前登入者id
const currentLoginUserId = ref<string>('')
// 评估id
const evaluationId = ref<string>('')
// 图表
const trendEcharts = ref<IKeyWordTrend>({
  xAxis: [],
  yAxis: [],
})

// 默认成本核算参数
const costAccountingFrom = reactive<ICostAccounting>({
  rateMargin: '',
  rateRoi: '',
  tariffRatio: '',
  extraFulfillment: '',
  exchangeRate: '',
  volumeFactor: '',
  weightFactor: '',
  shippingType: '',
  savePrice: '',
  laborCost: '',
  oceanShipping: '',
  airTransport: '',
  volumeRate: '',
  weightRate: '',
  fuelCost: '',
})

const queryForm = reactive<IEvaluationQueryReq>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
})

const fixed = ref<string>('right')

/**
 * 获取初始新款评估数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  evaluationList.value = data.list
  total.value = data.total
  listLoading.value = false
}

/**
 * 分页大小的改变
 */
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.replace({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
    },
  })
  fetchData()
}

/**
 * 分页页数改变
 */
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.replace({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

/**
 * 开始新款评估
 */
const startEvaluation = () => {
  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
      title: '新款评估',
      timestamp: Date.now(),
    },
  })
}

/**
 * 修改新款评估
 */
const toUpdateEvaluation = async (row: any) => {
  // row.avgConversionRate = row.avgConversionRate.split('%')[0]
  // setLocalStorage('evlautionRouteParams', { ...row })
  const matched = handleMatched(allRoutes.value, '/newProductDevelopment/addOrUpdateEvalution')

  const tab = handleTabs({
    ...matched.at(-1),
    query: {
      title: `${row.idNo}-新款评估`,
      idNo: row.idNo,
    },
  })

  if (tab) {
    await router.push({
      path: '/newProductDevelopment/addOrUpdateEvalution',
      query: {
        title: `${tab.query.title}`,
        idNo: row.idNo,
      },
    })
    await changeTabsMeta({
      title: '查看和修改新款评估',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
const chartLoading = ref<boolean>(false)
// 关键词趋势检索
const searchKeyWordTrend = async () => {
  chartLoading.value = true
  try {
    await keyWordTrend(inputKeyWord.value)
  } finally {
    chartLoading.value = false
  }
}

const cliekFontSearchKeyWord = async (row: any) => {
  inputKeyWord.value = row.amazonFrontendKeywords
  keyWordTrend(row.amazonFrontendKeywords)
}

const keyWordTrendCellClick = async (row: any, column: any) => {
  if (column.label === '关键词趋势') {
    inputKeyWord.value = row.amazonFrontendKeywords
    keyWordTrend(row.amazonFrontendKeywords)
  }
}

const keyWordTrend = async (str: string) => {
  const { data } = await getEvaluationTrendList({ keyWord: str, type: 0 })
  trendEcharts.value.xAxis = data.xAxis
  trendEcharts.value.yAxis = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchartsVisible.value = true
}

/**
 * 获取评估列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  router.replace({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const channelList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
}
/**
 * 产品核算推进
 */
const handleClick = async (row: any) => {
  evaluationId.value = convertString(row.idNo)
  fetchEstimatedCostAccounting(row.idNo)
  fetchChannelData()
  fetchSalesSiteList()
}

/**
 * 获取产品成本核算
 */
const fetchEstimatedCostAccounting = async (id: number) => {
  const { data } = await getEstimatedCostAccountingList({ evaluationId: convertString(id) })
  estimatedCostAccountingList.value = data
  estimatedCostAccountingVisible.value = true
}

// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue: string) => {
  inputKeyWord.value = newValue
  trendEcharts.value.xAxis = []
  trendEcharts.value.yAxis = []
  keyWordTrendEchartsVisible.value = false
  keyWordTrendVisible.value = false
}

// 获取评分参数列表
const getScoreParams = async () => {
  const { data } = await getEvaluationScoreParameter()
  scoreParametersList.value = data
  scoreParametersVisible.value = true
}

// // 获取成本核算默认参数
// const costAccountingeParam = async () => {
//   const { data } = await getEvaluationCostParameter()
//   costAccountingFrom.rateMargin = data.rateMargin
//   costAccountingFrom.rateRoi = data.rateRoi
//   costAccountingFrom.tariffRatio = data.tariffRatio
//   costAccountingFrom.extraFulfillment = data.extraFulfillment
//   costAccountingFrom.exchangeRate = data.exchangeRate
//   costAccountingFrom.volumeFactor = data.volumeFactor
//   costAccountingFrom.weightFactor = data.weightFactor
//   costAccountingFrom.shippingType = data.shippingType
//   costAccountingFrom.savePrice = data.savePrice
//   costAccountingFrom.laborCost = data.laborCost
//   costAccountingFrom.oceanShipping = data.oceanShipping
//   costAccountingFrom.airTransport = data.airTransport
//   costAccountingFrom.volumeRate = data.volumeRate
//   costAccountingFrom.weightRate = data.weightRate
//   costAccountingFrom.fuelCost = data.fuelCost

//   costAccountingeParamVisible.value = true
// }

// 修改评分参数
const updateScoreParam = (row: any) => {
  $baseConfirm(`您确定要修改评分参数${row.key}的值吗`, null, async () => {
    const { data } = await updateEvaluationScoreParams({ ...row })
    if (data == true) {
      $baseMessage('评分参数修改成功!', 'success', 'hey')
    }
  })
}

// 共享
const sharedEvaluation = async (row: any) => {
  sharedVisible.value = true
  const { data } = await getEvaluationShareInfo({ evaluationId: row.idNo })
  shareId.value = row.idNo
  shareUserList.value = data
}
/**
 * 共享操作
 */
const handlerSwitchChange = async (row: any) => {
  let type = 1

  if (row.share === true) {
    type = 0
  }
  const { data } = await updateSharePerson({
    evaluationId: shareId.value,
    userId: row.userID,
    type,
  })

  if (data === true && type === 0) {
    $baseMessage(`已共享给${row.userName}成功！`, 'success', 'hey')
  }

  if (data === true && type === 1) {
    $baseMessage(`取消共享给${row.userName}成功！`, 'success', 'hey')
  }
}
// 获取跑分明细
const getBenchmarkScoreDetail = async (id: any) => {
  const { data } = await getEvaluationScoreDetail({ evaluationId: id })
  benchmarkScoreList.value = data
  benchmarkScoreVisible.value = true
}

const updateTrendEchartsData = (newValue: IKeyWordTrend) => {
  trendEcharts.value = newValue
}

const updateTrendVisibleValue = (newValue: boolean) => {
  keyWordTrendEchartsVisible.value = newValue
}

const updateSharedVisibleValue = (newValue: boolean) => {
  sharedVisible.value = newValue
}

const updatecostAccountingeParamVisible = (newValue: boolean) => {
  costAccountingeParamVisible.value = newValue
}
const handleCopyEvaluation = async (id: number) => {
  $baseConfirm(`您确定要复制编号为 ${id} 的新款评估吗？`, null, async () => {
    const { data } = await copyEvaluation({ id })
    if (data) {
      $baseMessage(`复制成功！`, 'success', 'hey')
      fetchData()
    }
  })
}
const cellScoreStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label === '描述') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'right',
  }
}
const cellParameterStyle = (): CSSProperties => {
  return {
    textAlign: 'left',
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onMounted(async () => {
  const { data } = await getUserInfo()
  currentLoginUserId.value = data.userId
  // console.log(columnWidths.value)
})

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchData()
})
</script>

<style lang="scss" scoped>
.custom-table-container {
  .custom-table-right-tools {
    display: flex;
    align-items: center;
  }
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
  cursor: pointer;
}

.vab-chart {
  width: 100%;
  height: 100%;
  min-height: 40px;
}
.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
