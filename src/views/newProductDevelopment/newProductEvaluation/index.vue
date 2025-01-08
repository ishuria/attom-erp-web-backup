<template>
  <div class="custom-table-container auto-height-container" :class="{ 'vab-table-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="startEvalution"
          v-permissions="{ permission: ['newProduct:evaluation:add'] }">开始评估</el-button>
        <el-button type="primary" @click="keyWordTrendVisible = true"
          v-permissions="{ permission: ['newProduct:evaluation:keyword:trend'] }">关键词趋势</el-button>
        <el-button type="primary" @click="getScoreParams"
          v-permissions="{ permission: ['newProduct:evaluation:default:params'] }">评分参数</el-button>
        <el-button class="hidden-xs-only" type="primary"
          v-permissions="{ permission: ['newProduct:evaluation:score:params'] }"
          @click="costAccountingeParam">成本核算默认参数</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="custom-table-right-tools">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table 
      ref="tableRef" 
      v-loading="listLoading" 
      :border="true" 
      :data="evaluationList" 
      :stripe="true"
      @cell-click="keyWordTrendCellClick"
    >
      <el-table-column 
        v-for="(item, index) in indexColumns" 
        :key="index" 
        align="center" 
        :label="item.label"
        :prop="item.prop" 
        :min-width="item.minWidth || 100" width="auto"
      >
        <template #default="{ row }">
          <div v-if="item.label === '关键词趋势'">
            <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary"  @click="handleClick(row)">
              产品核算推进
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleClick(row)">
                  <el-link type="primary" :underline="false" >产品核算推进</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="toUpdateEvaluation(row)">
                  <el-link type="primary" :underline="false" >查看和修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="cliekFontSearchKeyWord(row)">
                  <el-link type="primary" :underline="false" v-permissions="{ permission: ['newProduct:evaluation:keyword:trend'] }">关键词趋势</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="row.userId === currentLoginUserId" @click="sharedEvaluation(row)">
                  <el-link type="primary" :underline="false" >共享</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="getBenchmarkScoreDetail(row.idNo)">
                  <el-link type="primary" :underline="false" v-permissions="{ permission: ['newProduct:evaluation:score:detail'] }">分数明细</el-link>
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
    <vab-pagination :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :total="total"
      @current-change="handleCurrentChange" @size-change="handleSizeChange" />

    <vab-dialog v-model="keyWordTrendVisible" title="关键词趋势" width="500">
      <el-form style="margin-left: 3px; margin-right: 3px;">
        <el-form-item label="关键词">
          <el-input autocomplete="off" v-model="inputKeyWord" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="searchKeyWordTrend">
          查询
        </el-button>
      </template>
    </vab-dialog>

    <!-- 关键词趋势图表 -->
     <vab-trend 
      :trendEchartsVisible="keyWordTrendEchatsVisible"
      :keyWord = "inputKeyWord"
      :trendData = "trendEcahts"
      @update:visibleValue = "updateTrendVisibleValue"
      @update:clearInputKeyWord = "cleanKeyWordTrendData"
      @update:trendEchartsList  = "updateTrendEchatsData"
     />
    
    <!-- 评分参数 -->
    <vab-dialog v-model="scoreParametersVisible" title="评分参数" width="500">
      <el-table height="700px" :data="scoreParametersList" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column property="key" label="名称" />
        <el-table-column label="值">
          <template #default="scope">
            <div>
              <el-input @blur="updateScoreParam(scope.row)" autocomplete="off" v-model="scope.row.value" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <!-- 跑分明细 -->
    <vab-dialog v-model="benchmarkScoreVisible" title="跑分明细" width="750">
      <el-table :data="benchmarkScoreList" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column v-for="(item, index) in scoreDetialColumns" :key="index" :label="item.label" :prop="item.prop" />
      </el-table>

      <template #footer></template>
    </vab-dialog>

    <!-- 共享 -->
    <vab-shared  
      :visible="sharedVisible"
      :id = "shareId"
      :list="shareUserList"
      @update:sharedVisible = "updateSharedVisibleValue"
      :handlerSwitchChange="handlerSwitchChange"
      :fetchData="fetchData"
    />

    <!-- 产品成本核算与推进子组件 -->
    <vab-estimated-cost-accounting 
      :flag="estimatedCostAccountingVisible" 
      :list="estimatedCostAccountingList"
      :evaluationId="evaluationId"
      :callParentMethod="fetchEstimatedCostAccounting"
    />

    <!-- 成本核算默认方式 -->
      <vab-cost-accounting-param 
      :flag="costAccountingeParamVisible"
      @update:visibleValue = "updatecostAccountingeParamVisible"
      :data = "costAccountingFrom"
    />

  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { type TableInstance } from 'element-plus'
import {
  indexColumns,
  scoreDetialColumns,
} from './indexColumns'
import {
  getEstimatedCostAccountingList,
  getEvaluationCostParameter,
  getEvaluationScoreDetail,
  getEvaluationScoreParameter,
  getEvaluationShareInfo,
  getEvaluationTrendList,
  getList,
  updateEvaluationScoreParams,
  updateSharePerson,
} from '/@/api/devlocal/evaluation'
import { getUserInfo } from '/@/api/devlocal/userLogin'
import { setLocalStorage } from '/@/utils/localStorage'

import {
  IBenchmarkScore,
  ICostAccounting,
  IEstimatedCostAccounting,
  IEvaluation,
  IEvaluationQueryReq,
  IEvaluationScore,
  IKeyWordTrend,
  IShared
} from '/@/type/evaluation/evaluationType'

import { convertString } from '/@/utils/stringUtils'

defineOptions({
  name: 'Evaluation',
})


const router = useRouter()
const tableRef = ref<TableInstance>()
const isFullscreen = ref<boolean>(false)

// 表格加载loading
const listLoading = ref<boolean>(true)
// 成本核算默认参数
const costAccountingeParamVisible = ref<boolean>(false)
// 关键词
const keyWordTrendVisible = ref<boolean>(false)
// 关键词趋势
const keyWordTrendEchatsVisible = ref<boolean>(false)
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
const shareId = ref<string>("")
// 当前登入者id
const currentLoginUserId = ref<string>("")
// 评估id
const evaluationId = ref<string>('')
// 图表
const trendEcahts = ref<IKeyWordTrend>({
  xAxis:[],
  yAxis:[]
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
  fuelCost: ''
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
  fetchData()
}

/**
 * 分页页数改变
 */
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

/**
 * 开始新款评估
 */
const startEvalution = (row: any) => {

  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
      title: "评估",
      timestamp: Date.now(),
    },
  })
}

/**
 * 修改新款评估
 */
const toUpdateEvaluation = (row: any) => {
  row.avgConversionRate = row.avgConversionRate.split("%")[0]
  setLocalStorage("evlautionRouteParams", { ...row })
  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
      idNo: row.idNo,
      title: "评估修改",
      timestamp: Date.now(),
    },
  })
}

// 关键词趋势检索
const searchKeyWordTrend = async () => {
   keyWordTrend(inputKeyWord.value)
}

const cliekFontSearchKeyWord = async(row:any)=>{
  inputKeyWord.value = row.amazonFrontendKeywords
  keyWordTrend(row.amazonFrontendKeywords)
}


const keyWordTrendCellClick = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.label === "关键词趋势") {
    inputKeyWord.value = row.amazonFrontendKeywords
    keyWordTrend(row.amazonFrontendKeywords)
  }
}

const keyWordTrend  = async (str:string) =>{
  const { data } = await getEvaluationTrendList({ keyWord: str, type: 0 })
  trendEcahts.value.xAxis = data.xAxis
  trendEcahts.value.yAxis = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchatsVisible.value = true
}

/**
 * 获取评估列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

/**
 * 产品核算推进
 */
const handleClick = async (row: any) => {
  evaluationId.value = convertString(row.idNo);
  fetchEstimatedCostAccounting(row.idNo)
}

/**
 * 获取产品成本核算
 */
const fetchEstimatedCostAccounting =  async (id:number)=>{
  const { data } = await getEstimatedCostAccountingList({ evaluationId: convertString(id) })
  estimatedCostAccountingList.value = data
  estimatedCostAccountingVisible.value = true
}

 // 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue:string) => {
  inputKeyWord.value = newValue
  trendEcahts.value.xAxis = []
  trendEcahts.value.yAxis = []
  keyWordTrendEchatsVisible.value = false
  keyWordTrendVisible.value = false

}

// 获取评分参数列表
const getScoreParams = async () => {
  const { data } = await getEvaluationScoreParameter()
  scoreParametersList.value = data
  scoreParametersVisible.value = true
}

// 获取成本核算默认参数
const costAccountingeParam = async () => {

  const { data } = await getEvaluationCostParameter()
  costAccountingFrom.rateMargin = data.rateMargin
  costAccountingFrom.rateRoi = data.rateRoi
  costAccountingFrom.tariffRatio = data.tariffRatio
  costAccountingFrom.extraFulfillment = data.extraFulfillment
  costAccountingFrom.exchangeRate = data.exchangeRate
  costAccountingFrom.volumeFactor = data.volumeFactor
  costAccountingFrom.weightFactor = data.weightFactor
  costAccountingFrom.shippingType = data.shippingType
  costAccountingFrom.savePrice = data.savePrice
  costAccountingFrom.laborCost = data.laborCost
  costAccountingFrom.oceanShipping = data.oceanShipping
  costAccountingFrom.airTransport = data.airTransport
  costAccountingFrom.volumeRate = data.volumeRate
  costAccountingFrom.weightRate = data.weightRate
  costAccountingFrom.fuelCost = data.fuelCost

  costAccountingeParamVisible.value = true
}

// 修改评分参数
const updateScoreParam = (row: any) => {
  $baseConfirm(`您确定要修改评分参数${row.key}的值吗`, null, async () => {
    const { data } = await updateEvaluationScoreParams({ ...row })
    if (data == true) {
      $baseMessage("评分参数修改成功!", "success", "hey")
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
  let type = 1;

  if (row.share === true) {
    type = 0
  }
  const { data } = await updateSharePerson({
    evaluationId: shareId.value,
    userId: row.userID,
    type
  })

  if (data === true && type === 0) {
    $baseMessage(`已共享给${row.userName}成功！`, "success", "hey")
  }

  if (data === true && type === 1) {
    $baseMessage(`取消共享给${row.userName}成功！`, "success", "hey")
  }
}
// 获取跑分明细
const getBenchmarkScoreDetail = async (id: any) => {
  const { data } = await getEvaluationScoreDetail({ evaluationId:id })
  benchmarkScoreList.value = data
  benchmarkScoreVisible.value = true
}

const updateTrendEchatsData = (newValue: IKeyWordTrend) => {
  trendEcahts.value = newValue
}


const updateTrendVisibleValue = (newValue:boolean) =>{
  keyWordTrendEchatsVisible.value = newValue
}

const updateSharedVisibleValue = (newValue:boolean) =>{
  sharedVisible.value = newValue
}


const updatecostAccountingeParamVisible = (newValue:boolean) =>{
  costAccountingeParamVisible.value = newValue
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onMounted(async () => {
  const { data } = await getUserInfo()
  currentLoginUserId.value = data.userId
})

onBeforeMount(() => {
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

.example-showcase .el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.vab-chart {
  width: 100%;
  height: 100%;
  min-height: 40px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
