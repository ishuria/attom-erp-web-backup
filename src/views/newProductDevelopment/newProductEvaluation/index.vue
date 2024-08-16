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
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>

        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="listLoading" :border="border" :data="list" :size="lineHeight" :stripe="true"
      @cell-click="keyWordTrendCellClick">
      <el-table-column v-for="(item, index) in indexColumns" :key="index" align="center" :label="item.label"
        :prop="item.prop" :min-width="item.minWidth || 100" width="auto">
        <template #default="{ row }">
          <div v-if="item.label === '关键词趋势'">
            <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
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
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="toUpdateEvaluation(row)">查看和修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="searchKeyWordTrend(row)"
                    v-permissions="{ permission: ['newProduct:evaluation:keyword:trend'] }">关键词趋势</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="row.userId === currentLoginUserId">
                  <el-link type="primary" :underline="false" @click="sharedEvaluation(row)">共享</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="getScoreDetail(row.idNo)"
                    v-permissions="{ permission: ['newProduct:evaluation:score:detail'] }">分数明细</el-link>
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

    <el-dialog v-model="keyWordTrendVisible" :close-on-click-modal="false" title="关键词趋势" width="500">
      <el-form>
        <el-form-item label="关键词">
          <el-input autocomplete="off" v-model="inputKeyWord" />
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

    <el-dialog v-model="keyWordTrendEchatsVisible" :close-on-click-modal="false" :before-close="cleanKeyWordTrendData"
      width="75%" title="关键词趋势">

      <el-select v-model="idxKeyWordValue" :reserve-keyword="false" @change="idxUpdateKeyWordTrend"
        style="width: 200px;">
        <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <vab-echarts-chart-line class="chart-line" :x-axis-data="x" :y-axis-data="y" v-if="keyWordTrendEchatsVisible" />
    </el-dialog>

    <el-dialog v-model="scoreParamVisible" :close-on-click-modal="false" title="评分参数" width="500"
      style="height: 800px;">
      <el-table height="700px" :data="scoreParamList" :cell-style="{ textAlign: 'center' }"
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

      <template #footer>
        <div class="dialog-footer">

        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="costAccountingeParamVisible" :close-on-click-modal="false" title="成本核算默认参数" width="500">
      <el-form label-position="top" label-width="auto" style="max-width: 600px">
        <div class="cost-accountinge-param">
          <el-form-item label="目标毛利率">
            <el-input v-model="costFrom.rateMargin" />
          </el-form-item>
          <el-form-item label="目标ROI">
            <el-input v-model="costFrom.rateRoi" />
          </el-form-item>
        </div>
        <div class="cost-accountinge-param">
          <el-form-item label="关税比例">
            <el-input v-model="costFrom.tariffRatio" />
          </el-form-item>
          <el-form-item label="额外FBA Fulfillment($)">
            <el-input v-model="costFrom.extraFulfillment" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="最近一次汇率">
            <el-input v-model="costFrom.exchangeRate" />
          </el-form-item>
          <el-form-item label="装箱体积系数">
            <el-input v-model="costFrom.volumeFactor" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="装箱重量系数">
            <el-input v-model="costFrom.weightFactor" />
          </el-form-item>
          <el-form-item label="运输方式">
            <el-input v-model="costFrom.shippingType" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="仓储费单价($/ft3/月)">
            <el-input v-model="costFrom.savePrice" />
          </el-form-item>
          <el-form-item label="人工费">
            <el-input v-model="costFrom.laborCost" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="海运(RMB/M3)">
            <el-input v-model="costFrom.oceanShipping" />
          </el-form-item>
          <el-form-item label="空运(RMB/KG)">
            <el-input v-model="costFrom.airTransport" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="重量系数">
            <el-input v-model="costFrom.weightRate" />
          </el-form-item>
          <el-form-item label="体积系数">
            <el-input v-model="costFrom.volumeRate" />
          </el-form-item>
        </div>

        <div style="display: flex;padding-left: 20px;">
          <el-form-item label="燃油附加费">
            <el-input v-model="costFrom.fuelCost" />
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

    <el-dialog v-model="scoreDetailVisible" :close-on-click-modal="false" title="跑分明细" width="750">
      <el-table :data="scoreDetailList" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column v-for="(item, index) in scoreDetialColumns" :key="index" :label="item.label"
          :prop="item.prop" />
      </el-table>

      <template #footer>
        <div class="dialog-footer">
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="sharedVisible" :close-on-click-modal="false" title="共享" width="650">
      <el-table
        :data="shareUserList" 
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column v-for="(item, index) in sharedColumns" :key="index" :label="item.label" :prop="item.prop">
          <template #default="{ row }">
            <div v-if="item.label === '操作'">
              <el-switch v-model="row.share" class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                @change="handlerSwitchChange(row)" />
            </div>
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
        <div class="dialog-footer">
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="estimatedCostAccountingVisible" :close-on-click-modal="false" title="产品成本核算与推进" width="100%">

      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handlerAddRowCost">新增</el-button>
          <el-button type="primary">新品推进(发布到新品进度管理)</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>

      <el-table 
        :data="estimatedCostAccountingList" 
        border
        stripe 
        @cell-click="changeInput"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        >
        <el-table-column type="selection" width="38" />

        <el-table-column prop="createTime" label="日期" min-width="110" />

        <el-table-column prop="site" label="站点" min-width="120">
          <template #default="{ row }">
            <el-select
              v-model="row.site" 
              placeholder="请选择站点"
            >
              <el-option 
                v-for="dict in estimatedCostAccountingSiteColumns" 
                :key="dict.value" :value="dict.value"
                :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="imgUrl" label="图片">
          <template #default="{ row }">
            <el-upload
            class="avatar-uploader"
            action="#"
            v-loading="loading"
            :show-file-list="false"
            :http-request="uploadFile"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          </template>
        </el-table-column>

        <el-table-column label="产品描述">
          <template #default="{ row }">
            <div class="none">
              <el-input type="textarea" autofocus v-model="row.desc" :autosize="{ minRows: 3, maxRows: 9 }"  @blur="clickCancle($event, row)" />
            </div>
            <span>{{row.desc}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="priceInfo" label="价格信息">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.priceInfo" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.priceInfo}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="url1688" label="1688链接">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.url1688" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.url1688}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="产品价格￥">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.price" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.price}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="length" label="长">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.length" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.length}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="width" label="宽">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.width" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.width}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="height" label="高">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.height" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.height}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="重量">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.weight" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.weight}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastMile" label="尾程">
        </el-table-column>

        <el-table-column prop="lastfirstMileMile" label="头程">
        </el-table-column>

        <el-table-column prop="packaging" label="打包">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.packaging" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.packaging}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstMileChannel" label="头程渠道">
          <template #default="{ row }">
            <el-select 
              class="none"
              v-model="row.firstMileChannel" 
              placeholder="请选择头程渠道"
            >
              <el-option 
                v-for="dict in estimatedCostAccountingSiteColumns" 
                :key="dict.value" :value="dict.value"
                :label="dict.label">
              </el-option>
            </el-select>
            <span>{{row.firstMileChannel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sellingPrice" label="售价">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.sellingPrice" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.sellingPrice}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="grossMarginRate" label="毛利率">
        </el-table-column>

        <el-table-column prop="roi" label="ROI">
        </el-table-column>

        <el-table-column prop="weightCoefficient" label="重量系数">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.weightCoefficient" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.weightCoefficient}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="volumeCoefficient" label="体积系数">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.volumeCoefficient" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.volumeCoefficient}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="tariff" label="关税%">
          <template #default="{ row }">
            <div class="none">
              <el-input type="text" v-model="row.tariff" @blur="clickCancle($event, row)"/>
            </div>
            <span>{{row.tariff}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="platformCommission" label="平台佣金">
        </el-table-column>

        <el-table-column prop="storageFee" label="仓储费2个月$">
        </el-table-column>


        <el-table-column align="center" :fixed="fixed" label="操作" width="120px">
          <template #default="{ row }">
            <el-dropdown>
              <el-button text type="primary">
                逆算
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-link type="primary" :underline="false">复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link type="primary" :underline="false">删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { type TableInstance } from 'element-plus'
import { setLocalStorage } from '/@/utils/localStorage'
import {
  getList,
  getEvaluationTrendList,
  getEvaluationCostParameter,
  getEvaluationScoreParameter,
  updateEvaluationCostParams,
  updateEvaluationScoreParams,
  getEvaluationScoreDetail,
  getEvaluationShareInfo,
  getEstimatedCostAccountingList,
  uploadFileBoBakend,
  addEstimatedCostAccounting,
  updateEstimatedCostAccounting,
  updateSharePerson
} from '/@/api/devlocal/evaluation'
import { getUserInfo } from '/@/api/devlocal/userLogin'
import {
  sharedColumns,
  indexColumns,
  scoreDetialColumns,
  estimatedCostAccountingSiteColumns,
  idxKeyWordOptions
} from './indexColumns'
import { formatDate } from '/@/utils/dateUtils'

import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadRequestOptions } from 'element-plus'


defineOptions({
  name: 'Evaluation',
})

const imageUrl = ref('')
const router = useRouter()
const tableRef = ref<TableInstance>()
const border = ref<boolean>(true)
const lineHeight = ref<any>('default')
const isFullscreen = ref<boolean>(false)
const list = ref<any>([])
const shareUserList = ref<any>([])
const listLoading = ref<boolean>(true)
const keyWordTrendVisible = ref<boolean>(false)
const keyWordTrendEchatsVisible = ref<boolean>(false)
const sharedVisible = ref<boolean>(false)
const estimatedCostAccountingVisible = ref<boolean>(false)
const scoreParamVisible = ref<boolean>(false)
const costAccountingeParamVisible = ref<boolean>(false)
const scoreDetailVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const inputKeyWord = ref<string>('')
const idxKeyWordValue = ref<string>('0')
const total = ref<number>(0)
const scoreParamList = ref<any>([])
const scoreDetailList = ref<any>([])
const estimatedCostAccountingList = ref<any>([])
const shareId = ref<string>("")
const currentLoginUserId = ref<string>("")
const keyId = ref<string>("")
const evaluationId = ref<string>("")
const x = ref<any>([])
const y = ref<any>([])
const costFrom = reactive<any>({
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

const startEvalution = (row: any) => {

  router.push({
    path: '/newProductDevelopment/addOrUpdateEvalution',
    query: {
      title: "评估",
      timestamp: Date.now(),
    },
  })
}

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
const searchKeyWordTrend = async (row: any) => {
  if (row) {
    inputKeyWord.value = row.amazonFrontendKeywords
  }
  const { data } = await getEvaluationTrendList({ keyWord: inputKeyWord.value, type: 0 })
  x.value = data.xAxis
  y.value = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchatsVisible.value = true
}


const idxUpdateKeyWordTrend = async (val: any) => {
  x.value = []
  y.value = []
  const { data } = await getEvaluationTrendList({ keyWord: inputKeyWord.value, type: val })
  x.value = data.xAxis
  y.value = data.yAxis
  keyWordTrendVisible.value = false
  keyWordTrendEchatsVisible.value = true
}


const keyWordTrendCellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.label === "关键词趋势") {
    searchKeyWordTrend(row)
  }
}

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


const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleClick = async (row: any) => {
  evaluationId.value = row.idNo;
  
  const { data } = await getEstimatedCostAccountingList({ evaluationId: row.idNo })
  estimatedCostAccountingList.value = data
  estimatedCostAccountingVisible.value = true
}

const cleanKeyWordTrendData = () => {
  idxKeyWordValue.value = '0'
  inputKeyWord.value = ''
  x.value = []
  y.value = []
  keyWordTrendEchatsVisible.value = false
  keyWordTrendVisible.value = false

}

const getScoreParams = async () => {
  const { data } = await getEvaluationScoreParameter()
  scoreParamList.value = data
  scoreParamVisible.value = true

}

const costAccountingeParam = async () => {
  const { data } = await getEvaluationCostParameter()
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

const commitUpdateCostParam = () => {
  $baseConfirm('您确定要提交修改吗', null, async () => {
    const { data } = await updateEvaluationCostParams({ ...costFrom })
    if (data == true) {
      $baseMessage("成本核算默认参数修改成功!", "success", "hey")
    }
    costAccountingeParamVisible.value = false
  })
}

const updateScoreParam = (row: any) => {
  $baseConfirm(`您确定要修改评分参数${row.key}的值吗`, null, async () => {
    const { data } = await updateEvaluationScoreParams({ ...row })
    if (data == true) {
      $baseMessage("评分参数修改成功!", "success", "hey")
    }
  })
}

const sharedEvaluation = async (row: any) => {
  sharedVisible.value = true
  const { data } = await getEvaluationShareInfo({ evaluationId: row.idNo })
  shareId.value = row.idNo
  shareUserList.value = data

}

const getScoreDetail = async (id: any) => {
  const { data } = await getEvaluationScoreDetail({ id })
  scoreDetailList.value = data
  scoreDetailVisible.value = true
}


// ============================= 产品成本核算与推进 =============================
const handlerAddRowCost = async () => {
  let newData: any = {
    id:'',
    evaluationId: '',
    createTime: formatDate(new Date()),
    site: '0',
    imgUrl: '',
    desc: '',
    priceInfo: '',
    url1688: '',
    price: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    packaging: '',
    firstMileChannel: '',
    sellingPrice: '',
    weightCoefficient: '',
    volumeCoefficient: '',
    tariff: '',
  }
 
  const formdata = new FormData()
  formdata.append('evaluationId', evaluationId.value+"")
  
  const {data} = await addEstimatedCostAccounting(formdata)
  if (data){
      // 添加的产品成本核算id
      keyId.value = data
      $baseMessage("产品成本核算添加成功！","success","hey")
      estimatedCostAccountingList.value.push(newData)
  }

}

const changeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {  
  if (!cell.children[0].children[0] 
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList
  ){
    return
  }
  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
    }
  }
  
}

const clickCancle = async (event:any,value:any) =>{
  console.log(event);
  console.log(value);
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  const {data} = await updateEstimatedCostAccounting({...value})

}

/**
 * 获取指定元素 指定的选择器的根节点
 * @param element 指定元素
 * @param rootSelector  根元素选择器
 */
const getRootElement = (element:any, rootSelector:any) => {
    let currentElement = element;

    while (currentElement) {
        // 检查当前元素是否匹配指定的选择器
        if (currentElement.matches(rootSelector)) {
            return currentElement;
        }

        // 向上移动到父元素
        currentElement = currentElement.parentElement;
    }

    // 如果没有找到匹配的元素，返回 null
    return null;
}

/**
 * 获取指定元素 指定选择的子节点
 * @param element 指定元素
 * @param selector 指定元素子节点
 */
const getSpecificChildren = (element:any, selector:any) => {
    return element.querySelectorAll(selector);
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    $baseMessage('图片类型只能是image/jpeg!','error','hey')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    $baseMessage('图片超过了2MB!','error','hey')
    return false
  }
  return true
}

const uploadFile = async (options: UploadRequestOptions)=>{
  console.log(options);
  
  const formdata = new FormData()
  formdata.append('file', options.file)
  formdata.append('type', "1")
  formdata.append('id', keyId.value+"")
  await uploadFileBoBakend(formdata);
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
  // max-width: 160px;
  height: 100%;
  min-height: 40px;
}

.cost-accountinge-param {
  display: flex;
  justify-content: space-around;
}

.chart-line {
  width: 100%;
  // max-width: 160px;
  height: 100%;
  min-height: 700px;
}

.none {
  display: none;
}

.block {
  display: block;
}
</style>
