<template>
  <div class="custom-table-container auto-height-container" :class="{ 'vab-table-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="startEvalution" v-permissions="{ permission: ['newProduct:evaluation:add']}">开始评估</el-button>
        <el-button type="primary" @click="keyWordTrendVisible = true" v-permissions="{ permission: ['newProduct:evaluation:keyword:trend']}" >关键词趋势</el-button>
        <el-button type="primary" @click="getScoreParams">评分参数</el-button>
        <el-button class="hidden-xs-only" type="primary" @click="costAccountingeParam">成本核算默认参数</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="custom-table-right-tools">
          <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
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
      :border="border"
      :data="list"
      :size="lineHeight"
      :stripe="true"
      @cell-click="keyWordTrendCellClick"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
         align="center"
        :fixed="item.fixed"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
        :min-width="item.minWidth || 100"
        width="auto"
        
      >
      <template #default="{ row }">
          <div v-if="item.label === '关键词趋势'">
            <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis"/>
          </div>
      </template>
      </el-table-column>

      <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
        <template #default="{ row }">
          <el-dropdown  @click="handleClick">
              <el-button text type="primary">
                产品核算推进
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item >
                    <el-link type="primary" :underline="false" @click="toUpdateEvaluation(row)">查看和修改</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <el-link type="primary" :underline="false" @click="searchKeyWordTrend(row)" v-permissions="{ permission: ['newProduct:evaluation:keyword:trend']}">关键词趋势</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <el-link type="primary" :underline="false" @click="sharedVisible = true">共享</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <el-link type="primary" :underline="false" @click="getScoreDetail(row.idNo)" v-permissions="{ permission: ['newProduct:evaluation:score:detail']}">分数明细</el-link>
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

    <el-dialog v-model="keyWordTrendVisible"
      :close-on-click-modal="false"
      title="关键词趋势" width="500"
    >
      <el-form>
        <el-form-item label="关键词">
          <el-input  autocomplete="off" v-model="inputKeyWord"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="searchKeyWordTrend">
            查询
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="keyWordTrendEchatsVisible"
    :close-on-click-modal="false"
    :before-close="cleanKeyWordTrendData"
    width="75%"
    title="关键词趋势">
     
        <el-select
          v-model="idxKeyWordValue"
          :reserve-keyword = "false"
          @change="idxUpdateKeyWordTrend"
          style="width: 200px;"
        >
          <el-option
            v-for="item in idxKeyWordOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          </el-select>
      <vab-echarts-chart-line class="chart-line"  
      :x-axis-data="x" 
      :y-axis-data="y" 
      v-if="keyWordTrendEchatsVisible"/>
    </el-dialog>


    <el-dialog v-model="scoreParamVisible"
      :close-on-click-modal="false"
      title="评分参数" width="500" style="height: 800px;">
      <el-table 
       height="700px"
      :data="scoreParamList"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column property="key" label="名称" />
        <el-table-column label="值">
          <template #default="scope">
            <div>
              <el-input @blur="updateScoreParam(scope.row)" autocomplete="off" v-model="scope.row.value"/>
            </div>
        </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div class="dialog-footer">

        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="costAccountingeParamVisible"
    :close-on-click-modal="false"
    title="成本核算默认参数" width="500">
    <el-form
        label-position="top"
        label-width="auto"
        style="max-width: 600px"
      >
        <div class="cost-accountinge-param">
          <el-form-item label="目标毛利率">
            <el-input v-model="costFrom.rateMargin" />
          </el-form-item>
          <el-form-item label="目标ROI">
            <el-input  v-model="costFrom.rateRoi"/>
          </el-form-item>
        </div>  
        <div class="cost-accountinge-param">
          <el-form-item label="关税比例">
            <el-input v-model="costFrom.tariffRatio"/>
          </el-form-item>
          <el-form-item label="额外FBA Fulfillment($)">
            <el-input v-model="costFrom.extraFulfillment"/>
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="最近一次汇率">
            <el-input v-model="costFrom.exchangeRate"/>
          </el-form-item>
          <el-form-item label="装箱体积系数">
            <el-input v-model="costFrom.volumeFactor"/>
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="装箱重量系数">
            <el-input v-model="costFrom.weightFactor"/>
          </el-form-item>
          <el-form-item label="运输方式">
            <el-input v-model="costFrom.shippingType"/>
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="仓储费单价($/ft3/月)">
            <el-input v-model="costFrom.savePrice"/>
          </el-form-item>
          <el-form-item label="人工费">
            <el-input v-model="costFrom.laborCost"/>
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="海运(RMB/M3)">
            <el-input v-model="costFrom.oceanShipping"/>
          </el-form-item>
          <el-form-item label="空运(RMB/KG)">
            <el-input v-model="costFrom.airTransport"/>
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="重量系数">
            <el-input v-model="costFrom.weightRate"/>
          </el-form-item>
          <el-form-item label="体积系数">
            <el-input v-model="costFrom.volumeRate"/>
          </el-form-item>
        </div>

        <div style="display: flex;padding-left: 20px;">
          <el-form-item label="燃油附加费">
            <el-input v-model="costFrom.fuelCost"/>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="commitUpdateCostParam">
            提交修改
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="scoreDetailVisible"
      :close-on-click-modal="false"
      title="跑分明细" width="650">
      <el-table 
      :data="scoreDetailList"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column 
          v-for="(item, index) in scoreDetialColumns"
          :key="index" 
          :label="item.label"
          :prop="item.prop"
        />
      </el-table>

      <template #footer>
        <div class="dialog-footer">
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="sharedVisible"
      :close-on-click-modal="false"
      title="共享" width="650">
      <el-table 
      :data="userList"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column 
          v-for="(item, index) in sharedColumns"
          :key="index" 
          :label="item.label"
          :prop="item.prop"
        >
          <template #default="{ row }">
              <div v-if="item.label === '操作'">
                <el-switch
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </div>
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
        <div class="dialog-footer">
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { Search,ArrowDown } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import {setLocalStorage} from '/@/utils/localStorage'
import {getList,
  getEvaluationTrendList,
  getEvaluationCostParameter,
  getEvaluationScoreParameter,
  updateEvaluationCostParams,
  updateEvaluationScoreParams,
  getEvaluationScoreDetail} from '/@/api/devlocal/evaluation'

defineOptions({
  name: 'Evaluation',
})
const router = useRouter()
const tableRef = ref<TableInstance>()
const border = ref<boolean>(true)
const lineHeight = ref<any>('default')
const isFullscreen = ref<boolean>(false)
const list = ref<any>([])
const userList = ref<any>([])
const listLoading = ref<boolean>(true)
const keyWordTrendVisible = ref<boolean>(false)
const keyWordTrendEchatsVisible = ref<boolean>(false)
const sharedVisible = ref<boolean>(false)
const scoreParamVisible = ref<boolean>(false)
const costAccountingeParamVisible = ref<boolean>(false)
const scoreDetailVisible = ref<boolean>(false)
const inputKeyWord = ref<string>('')
const idxKeyWordValue = ref<string>('0')
const total = ref<number>(0)
const scoreParamList = ref<any>([])
const scoreDetailList = ref<any>([])
const x = ref<any>([])
const y = ref<any>([])
const costFrom = reactive<any>({
  rateMargin:'',
  rateRoi:'',
  tariffRatio:'',
  extraFulfillment:'',
  exchangeRate:'',
  volumeFactor:'',
  weightFactor:'',
  shippingType:'',
  savePrice:'',
  laborCost:'',
  oceanShipping:'',
  airTransport:'',
  volumeRate:'',
  weightRate:'',
  fuelCost:''
})

const scoreDetialColumns = ref<any>([
  {
    label: '描述',
    prop: 'desc',
  },
  {
    label: '数量',
    prop: 'quantity',
  },
  {
    label: '分数',
    prop: 'score',
  },
])

const columns = ref<any>([
  {
    label: '编号',
    prop: 'idNo',
    minWidth: 50
  },
  {
    label: '评估人',
    prop: 'evaluatorName',
  },
  {
    label: '评估日期',
    prop: 'evaluateDate',
  },
  {
    label: '中文品名',
    prop: 'productNameZh',
    minWidth: 150
  },
  {
    label: '亚马逊前台关键词',
    prop: 'amazonFrontendKeywords',
    minWidth: 200
  },
  {
    label: '亚马逊后台关键词',
    prop: 'amazonBackendKeywords',
    minWidth: 200
  },
  {
    label: '年市场容量',
    prop: 'marketVolume',
    minWidth: 120
  },
  {
    label: '关键词趋势',
  },
  {
    label: '头部个数',
    prop: 'productsCount',
    minWidth: 80
  },
  {
    label: 'CPC$',
    prop: 'cpc',
    minWidth: 70
  },
  {
    label: '30毛利盈亏自然单占比',
    prop: 'grossProfitAndLoss'
  },
  {
    label: '平均转化',
    prop: 'avgConversionRate',
    minWidth: 80
  },
  {
    label: '平均售价',
    prop: 'averageSellingPrice',
    minWidth: 80
  },
  {
    label: '供求评分',
    prop: 'supplyScore',
  },
  {
    label: '关键词首页评分',
    prop: 'keyWordScore',
  },
  {
    label: '来源',
    prop: 'productSource',
  },
])

const sharedColumns = ref<any>([
  {
    label: '用户id',
    prop: 'userID',
  },
  {
    label: '用户名',
    prop: 'userName',
  },
  {
    label: '操作',
    prop: 'isCheck',
  },
])

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
})

const fixed = ref<string>('right')

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const startEvalution = ( row:any )=>{
  
  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
        title:"评估",
        timestamp: Date.now(),
    },
  })
}

const toUpdateEvaluation = (row:any) =>{
  row.avgConversionRate = row.avgConversionRate.split("%")[0]
  setLocalStorage("evlautionRouteParams",{...row})
  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
        idNo:row.idNo,
        title:"评估修改",
        timestamp: Date.now(),
    },
  })
}

// 关键词趋势检索
const searchKeyWordTrend = async(row:any) => {
  if (row){    
    inputKeyWord.value = row.amazonFrontendKeywords
  }
  const {data} = await getEvaluationTrendList({keyWord:inputKeyWord.value,type:0})
  x.value = data.xAxis
  y.value = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchatsVisible.value = true
}


const idxUpdateKeyWordTrend = async (val:any) =>{
  x.value = []
  y.value = []
  const {data} = await getEvaluationTrendList({keyWord:inputKeyWord.value,type:val})
  x.value = data.xAxis
  y.value = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchatsVisible.value = true
}

const idxKeyWordOptions = [
{
    value: '0',
    label: '全部',
  },
  {
    value: '1',
    label: '近半年',
  },
  {
    value: '2',
    label: '近一年',
  },
  {
    value: '3',
    label: '近两年',
  },
]


const keyWordTrendCellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.label === "关键词趋势"){
    searchKeyWordTrend(row)
  }
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleClick = () => {
  // eslint-disable-next-line no-alert
  alert('button click')
}

const cleanKeyWordTrendData = ()=>{
  idxKeyWordValue.value = '0'
  inputKeyWord.value = ''
  x.value = []
  y.value = []
  keyWordTrendEchatsVisible.value = false
  keyWordTrendVisible.value = false

}

const getScoreParams = async () =>{
  const {data} =  await getEvaluationScoreParameter()
  scoreParamList.value = data
  scoreParamVisible.value = true

}

const costAccountingeParam = async ()=>{
  const {data} = await getEvaluationCostParameter()
  costFrom.rateMargin = data.rateMargin
  costFrom.rateRoi = data.rateRoi
  costFrom.tariffRatio = data.tariffRatio
  costFrom.extraFulfillment = data.extraFulfillment
  costFrom.exchangeRate = data.exchangeRate
  costFrom.volumeFactor = data.volumeFactor
  costFrom.weightFactor = data.weightFactor
  costFrom.shippingType = data.shippingType
  costFrom.savePrice = data.savePrice
  costFrom.laborCost = data.laborCost
  costFrom.oceanShipping = data.oceanShipping
  costFrom.airTransport = data.airTransport
  costFrom.volumeRate = data.volumeRate
  costFrom.weightRate = data.weightRate
  costFrom.fuelCost = data.fuelCost
  costAccountingeParamVisible.value = true
}

const commitUpdateCostParam =  () =>{
  $baseConfirm('您确定要提交修改吗', null, async () => {
    const {data} = await updateEvaluationCostParams({...costFrom})
    if (data == true) {
      $baseMessage("成本核算默认参数修改成功!","success","hey")
    }
    costAccountingeParamVisible.value = false
  })
}

const updateScoreParam = (row:any) => {
  $baseConfirm(`您确定要修改评分参数${row.key}的值吗`, null, async () => {
    const {data} = await updateEvaluationScoreParams({...row})
    if (data == true) {
      $baseMessage("评分参数修改成功!","success","hey")
    }
  })
}

const getScoreDetail = async(id:any) => {
  scoreDetailVisible.value = true
  const {data} = await getEvaluationScoreDetail({id})
  scoreDetailList.value = data
}

onActivated(() => {
  tableRef.value?.doLayout()
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


.example-showcase .el-dropdown + .el-dropdown {
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
  // max-width: 160px;
  height: 100%;
  min-height: 40px;
}

.cost-accountinge-param{
  display: flex;
  justify-content: space-around;
}

.chart-line{
  width: 100%;
  // max-width: 160px;
  height: 100%;
  min-height: 700px;
}

</style>
