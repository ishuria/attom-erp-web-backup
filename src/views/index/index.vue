<template>
  <div class="index-container no-background-container">
    <el-row :gutter="20">
      <!-- 第一层 -->
      <el-col v-if="ableViewCommissionCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card
          background="white"
          :count-config="countConfig1"
          :month-diff="countConfig1.monthDiff"
          title="本月总提成"
          :year-diff="countConfig1.yearDiff"
          @open-table="handleJumpTo"
        >
          <template #select>
            <el-select v-model="type" size="small" @change="handleChangePieList">
              <el-option v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template #chart>
            <commission-site-pie v-if="type === 0" :data="pieList" @click="handleJumpTo" />
            <commission-type-pie v-if="type === 1" :data="pieList" @click="handleJumpTo" />
          </template>
          <template #date>
            <div class="bottom-time">{{ date }}更新</div>
          </template>
        </top-card>
      </el-col>
      <el-col v-if="ableViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card
          background="white"
          :month-diff="countConfig2Start.monthDiff"
          title="本月总完成数"
          :year-diff="countConfig2Start.yearDiff"
          @open-table="fetchHistoryAssessmentRecords"
        >
          <template #select>
            <el-button size="small" type="primary" @click="assessmentAdjustVisible = true">超额自调</el-button>
          </template>
          <template #count>
            <vab-count
              :decimals="countConfig2Start.decimals"
              :duration="countConfig2Start.duration"
              :end-value="countConfig2Start.endValue"
              :prefix="countConfig2Start.prefix"
              :separator="countConfig2Start.separator"
              :start-value="countConfig2Start.startValue"
              :suffix="countConfig2Start.suffix"
            />
            <vab-count
              :decimals="countConfig2End.decimals"
              :duration="countConfig2End.duration"
              :end-value="countConfig2End.endValue"
              :prefix="countConfig2End.prefix"
              :separator="countConfig2End.separator"
              :start-value="countConfig2End.startValue"
              :suffix="countConfig2End.suffix"
            />
          </template>
          <template #chart>
            <assessment-pie :percentage="assessmentPercentage" />
          </template>
        </top-card>
      </el-col>
      <el-col v-if="ableViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card
          background="white"
          :month-diff="countConfig3Start.monthDiff"
          title="本月OEM完成数"
          :year-diff="countConfig3Start.yearDiff"
          @open-table="fetchHistoryAssessmentRecords"
        >
          <template #count>
            <vab-count
              :decimals="countConfig3Start.decimals"
              :duration="countConfig3Start.duration"
              :end-value="countConfig3Start.endValue"
              :prefix="countConfig3Start.prefix"
              :separator="countConfig3Start.separator"
              :start-value="countConfig3Start.startValue"
              :suffix="countConfig3Start.suffix"
            />
            <vab-count
              :decimals="countConfig3End.decimals"
              :duration="countConfig3End.duration"
              :end-value="countConfig3End.endValue"
              :prefix="countConfig3End.prefix"
              :separator="countConfig3End.separator"
              :start-value="countConfig3End.startValue"
              :suffix="countConfig3End.suffix"
            />
          </template>
          <template #chart>
            <assessment-pie :percentage="oemPercentage" />
          </template>
        </top-card>
      </el-col>
      <el-col v-if="ableViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-bar-card
          background="white"
          :count-config="countConfig4"
          :month-diff="monthDiff"
          title="推进中的项目"
          url="/newProductDevelopment/newProductProgress"
          :year-diff="yearDiff"
        >
          <template #chart>
            <in-progress-projects-bar :data="inProgressProjectsData" :total="countConfig4.endValue" />
          </template>
        </top-bar-card>
      </el-col>
      <el-col v-if="ableViewDestroyValueCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card
          background="white"
          :count-config="countConfig5"
          :month-diff="countConfig5.monthDiff"
          title="本月销毁货值"
          :year-diff="countConfig5.yearDiff"
          @open-table="handleOpenDestroyDetail"
        >
          <template #select>
            <el-select v-model="selectDestroyValueType" size="small" @change="handleChangeDestroyPieList">
              <el-option v-for="item in selectDestroyValueOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template #chart>
            <commission-site-pie v-if="selectDestroyValueType === 0" :data="displayDestroyPieList" @click="handleOpenDestroyDetail" />
            <commission-type-pie v-if="selectDestroyValueType === 1" :data="displayDestroyPieList" @click="handleOpenDestroyDetail" />
          </template>
        </top-card>
      </el-col>
      <el-col v-if="ableProductManagerLeadViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card
          background="white"
          :count-config="countConfig6"
          :month-diff="countConfig6.monthDiff"
          title="本月销毁货值"
          :year-diff="countConfig6.yearDiff"
          @open-table="handleOpenDestroyLeadDetail"
        >
          <template #select>
            <el-select v-model="selectDestroyLeadValueType" size="small" @change="handleChangeDestroyLeadPieList">
              <el-option v-for="item in selectPersonOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template #chart>
            <commission-site-pie v-if="type === 0" :data="displayDestroyLeadPieList" @click="handleOpenDestroyLeadDetail" />
            <commission-type-pie v-if="type === 1" :data="displayDestroyLeadPieList" @click="handleOpenDestroyLeadDetail" />
          </template>
        </top-card>
      </el-col>

      <!-- 老板用户独占行 - 当只有老板权限时，销毁货值卡片独占一行 -->
      <template v-if="currentRoleCode === ROLE_BOSS_CODE">
        <el-col :lg="20" :md="12" :sm="0" :xl="20" :xs="0">
          <!-- 空白占位，让销毁货值卡片独占一行 -->
        </el-col>
      </template>
    </el-row>
    <!-- 第二层 -->
    <el-row v-if="ableProductManagerViewCard || true" class="row-spacing" :gutter="20">
      <!-- 激励政策 - 放在第二行开头 -->
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <incentive-policy-card />
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="7" :md="24" :sm="24" :xl="7" :xs="24">
        <monthly-product-profit-table :list="profitList">
          <template #select>
            <el-select v-model="selectProfitMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyProductProfit">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-product-profit-table>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="7" :md="24" :sm="24" :xl="7" :xs="24">
        <monthly-assessment-table :list="listSub" title="其他计分项">
          <template #select>
            <el-select v-model="selectAssessmentMinusMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyMinusAssessment">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-assessment-table>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="6" :md="24" :sm="24" :xl="6" :xs="24">
        <monthly-assessment-table :list="listAdd" title="考核数调整">
          <template #select>
            <el-select v-model="selectAssessmentPlusMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyPlusAssessment">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-assessment-table>
      </el-col>
    </el-row>

    <!-- 第三层
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
      </el-col> -->
    <!-- 第四层 -->
    <el-row v-if="ableProductManagerViewCard || ableProductManagerLeadViewCard" class="row-spacing" :gutter="20">
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank1List" :my-name="myName" name="超额完成数" :show-medal="true" title="超额完成排行">
          <template #select>
            <el-select v-model="selectAchievedMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankOverAchieved">
              <el-option v-for="item in historyBossMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank4List" :my-name="myName" name="考核完成数" title="考核数完成排行">
          <template #select>
            <el-select v-model="selectFinishMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankAssessmentFinish">
              <el-option v-for="item in historyBossMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <!-- <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月提成排行" :list="rank2List" name="提成" :my-name="myName" />
      </el-col> -->
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank3List" :my-name="myName" name="新品提成" title="新品提成排行(上线1年以内)">
          <template #select>
            <el-select
              v-model="selectNewProductOneYearMonth"
              placeholder="月份"
              style="max-width: 5em"
              @change="fetchRankNewProductOneYearCommission"
            >
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <el-col v-if="ableProductManagerLeadViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank5List" :my-name="myName" name="新品月均提成(前6个月)" title="前6月平均新品提成排行">
          <template #select>
            <el-select v-model="selectNewProductMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankNewProductCommission">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <!-- 职级提成 -->
      <el-col v-if="ableProductManagerLeadViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <job-level-commission-table :list="jobLevelCommissionList">
          <template #select>
            <el-select v-model="selectJobLevelMonth" placeholder="月份" style="max-width: 5em" @change="fetchJobLevelCommission">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </job-level-commission-table>
      </el-col>
    </el-row>
    <!-- 第五层 -->
    <el-row v-if="ableProductManagerViewCard || ableViewTop30ProductSaleCard" class="row-spacing" :gutter="20">
      <!-- 产品经理绩效历史 -->
      <el-col v-if="ableProductManagerViewCard" :lg="10" :md="12" :sm="24" :xl="10" :xs="24">
        <performance-history :list="historyList">
          <template #select>
            <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-date-picker v-model="selectDate" :clearable="false" type="monthrange" value-format="YYYY-MM" @change="fetchData" />
          </template>
        </performance-history>
      </el-col>
      <!-- top30新品销售额 -->
      <el-col v-if="ableViewTop30ProductSaleCard" :lg="14" :md="24" :sm="24" :xl="14" :xs="24">
        <top30-product-sale-table :list="top30ProductSaleList">
          <!-- <template #select>
            <el-select v-model="selectProfitMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyProductProfit">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template> -->
        </top30-product-sale-table>
      </el-col>
    </el-row>
    <el-row v-if="ableBossViewCard" class="row-spacing" :gutter="20">
      <el-col :lg="10" :md="24" :sm="24" :xl="10" :xs="24">
        <inventory-products-total-value :data="inventoryProductsTotalValueList" @update="fetchInventoryProductsTotalValue" />
      </el-col>
    </el-row>

    <!-- 第六层 -->

    <history-assessment-records
      v-model="historyVisible"
      :list="list"
      :loading="listLoading"
      :query-form="queryForm"
      :total="total"
      @page-change="handleCurrentChange"
      @query="queryData"
      @size-change="handleSizeChange"
    />
    <!-- 考核数调整 -->
    <assessment-number-adjust v-model="assessmentAdjustVisible" @update:front-page="fetchAssessmentData" />
    <!-- 销毁货值详情 -->
    <destroy-value-detail-table v-model="destroyValueDetailVisible" :list="destroyValueDetailList" :show-user-name="showUserName" />
  </div>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { IGetOperationAmazonSKUList } from '~/src/type/storeOperation/productPerformanceType'
import { redColorList } from '../commission/constantOption'
import { colorList } from '../storeOperations/constantOption'
import {
  getFrontPageAdjustDetailMonth,
  getFrontPageAssessmentData,
  getFrontPageBillingMonth,
  getFrontPageBonus,
  getFrontPageDestroyValue,
  getFrontPageDestroyValueDetail,
  getFrontPageDestroyValueLeadDetail,
  getFrontPageHistoryAssessmentRecords,
  getFrontPageHistoryMonthList,
  getFrontPageInventoryProductsTotalValue,
  getFrontPageJobLevelCommission,
  getFrontPageLeadDestroyValue,
  getFrontPagePerformanceHistory,
  getFrontPageProductManagerSelectOption,
  getFrontPageProgressProjects,
  getFrontPageRankAssessmentFinish,
  getFrontPageRankNewProductCommission,
  getFrontPageRankNewProductOneYearCommission,
  getFrontPageRankOverAchieved,
  getFrontPageTop30ProductSale,
  getMonthlyAssessmentMinus,
  getMonthlyAssessmentPlus,
  getMonthlyProductProfit,
} from '/@/api/devlocal/frontPage'
import { getOperationUpdateDate } from '/@/api/devlocal/productPerformance'
import {
  ROLE_ADMINBUYERLEAD_CODE,
  ROLE_BOSS_CODE,
  ROLE_GRAPHICDESIGNER_CODE,
  ROLE_GRAPHICDESIGNLEAD_CODE,
  ROLE_INDUSTRIAL_DESIGN_CODE,
  ROLE_PRODUCTMANAGER_CODE,
  ROLE_PRODUCTMANNAGERLEAD_CODE,
  ROLE_PURCHASER_CODE,
  ROLE_PURCHASINGASSISTANT_CODE,
  ROLE_SUPPLY_CHAIN_MANG_CODE,
} from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import {
  IGetFrontPageDestroyValueDetailItem,
  IGetFrontPageHistoryAssessmentRecordsItem,
  IGetFrontPageHistoryAssessmentRecordsReq,
  IGetFrontPageInventoryProductsTotalValue,
  IGetFrontPageJobLevelCommission,
  IGetFrontPageMonthlyAssessment,
  IGetFrontPagePerformanceHistory,
  IGetFrontPageProductProfitRes,
  IGetFrontPageProgressProjectsItem,
  IPieItem,
  IRankItem,
} from '/@/type/index/frontPage'
import { getCurrentMonth, getLastYearStringMonth } from '/@/utils/dateUtils'

defineOptions({
  name: 'Index',
})

const showUserName = ref<boolean>(false)
const assessmentAdjustVisible = ref<boolean>(false)
const router = useRouter()
const myName = useUserStore().getUsername
const currentRoleCode = useAclStore().getRole[0]
const ableProductManagerViewCard =
  currentRoleCode === ROLE_PRODUCTMANAGER_CODE || currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE || currentRoleCode === ROLE_BOSS_CODE
const ableProductManagerLeadViewCard = currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE || currentRoleCode === ROLE_BOSS_CODE
const ableViewCard = currentRoleCode === ROLE_PRODUCTMANAGER_CODE || currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE
const commissionRole = [
  ROLE_GRAPHICDESIGNLEAD_CODE,
  ROLE_GRAPHICDESIGNER_CODE,
  ROLE_INDUSTRIAL_DESIGN_CODE,
  ROLE_PRODUCTMANNAGERLEAD_CODE,
  ROLE_PRODUCTMANAGER_CODE,
  ROLE_ADMINBUYERLEAD_CODE,
  ROLE_SUPPLY_CHAIN_MANG_CODE,
  ROLE_PURCHASER_CODE,
  ROLE_PURCHASINGASSISTANT_CODE,
]
const ableViewTop30ProductSaleCard =
  currentRoleCode === ROLE_BOSS_CODE ||
  currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
  currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE ||
  currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE
const ableViewDestroyValueCard =
  currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE ||
  currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
  currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE
const ableViewCommissionCard = commissionRole.includes(currentRoleCode)
const ableBossViewCard = currentRoleCode === ROLE_BOSS_CODE
const type = ref<number>(0)
const selectOption = [
  { label: '站点', value: 0 },
  { label: '类型', value: 1 },
]
const selectDestroyValueType = ref<number>(0)
const selectDestroyValueOption = [
  { label: '站点', value: 0 },
  { label: '新老品', value: 1 },
]
const selectDestroyLeadValueType = ref<number>(0)
const selectPersonOption = [
  { label: '人员', value: 0 },
  { label: '站点', value: 1 },
]
const pieList = ref<any[]>([])

const countConfig1 = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const countConfig2Start = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 1,
  prefix: '',
  suffix: '/',
  separator: ',',
  duration: 1000,
})
const countConfig2End = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 1,
  prefix: '',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const countConfig3Start = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 1,
  prefix: '',
  suffix: '/',
  separator: ',',
  duration: 1000,
})
const countConfig3End = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 1,
  prefix: '',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const countConfig4 = reactive<any>({
  startValue: 0,
  endValue: random(1, 50),
  decimals: 0,
  prefix: '',
  suffix: '个',
  separator: ',',
  duration: 1000,
})
// 销毁货值
const countConfig5 = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 1000,
})
// 销毁货值
const countConfig6 = reactive<any>({
  startValue: 0,
  endValue: 0,
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const destroyValueDetailVisible = ref<boolean>(false)
const destroyValueDetailList = ref<IGetFrontPageDestroyValueDetailItem[]>([])
const inProgressProjectsData = ref<IGetFrontPageProgressProjectsItem[]>([])
const monthDiff = ref<number>(0)
const yearDiff = ref<number>(0)
const fetchInProgressProjectsData = async () => {
  const { data } = await getFrontPageProgressProjects()
  countConfig4.endValue = data.total
  inProgressProjectsData.value = data.list
  monthDiff.value = data.monthDiff
  yearDiff.value = data.yearDiff
}
const assessmentPercentage = ref<number>(0)
const oemPercentage = ref<number>(0)
const fetchAssessmentData = async () => {
  const { data } = await getFrontPageAssessmentData()
  countConfig2Start.endValue = data.assessmentNumberFinish
  countConfig2End.endValue = data.assessmentNumber
  countConfig3Start.endValue = data.oemFinish
  countConfig3End.endValue = data.oem
  countConfig2Start.monthDiff = data.assessmentFinishMonthDiff
  countConfig2Start.yearDiff = data.assessmentFinishYearDiff
  countConfig3Start.monthDiff = data.oemFinishMonthDiff
  countConfig3Start.yearDiff = data.oemFinishYearDiff
  assessmentPercentage.value = data.assessmentFinishPercent
  oemPercentage.value = data.oemFinishPercent
}
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<IGetFrontPageHistoryAssessmentRecordsItem[]>([])
const queryForm = reactive<IGetFrontPageHistoryAssessmentRecordsReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const historyVisible = ref<boolean>(false)
const fetchHistoryAssessmentRecords = async () => {
  historyVisible.value = true
  listLoading.value = true
  const { data } = await getFrontPageHistoryAssessmentRecords(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchHistoryAssessmentRecords()
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchHistoryAssessmentRecords()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchHistoryAssessmentRecords()
}
const handleJumpTo = () => {
  let url = ''
  if (
    currentRoleCode === ROLE_GRAPHICDESIGNLEAD_CODE ||
    currentRoleCode === ROLE_GRAPHICDESIGNER_CODE ||
    currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE
  ) {
    url = '/commission/commissionArtDetails'
  } else if (
    currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE ||
    currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
    currentRoleCode === ROLE_ADMINBUYERLEAD_CODE ||
    currentRoleCode === ROLE_SUPPLY_CHAIN_MANG_CODE
  ) {
    url = '/commission/commissionProductDetails'
  } else if (currentRoleCode === ROLE_PURCHASER_CODE || currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE) {
    url = '/commission/procurementCostReduction'
  }
  router.push(url)
}
const handleOpenDestroyDetail = async () => {
  const { data } = await getFrontPageDestroyValueDetail()
  destroyValueDetailVisible.value = true
  destroyValueDetailList.value = data.list
  showUserName.value = false
}
const handleOpenDestroyLeadDetail = async () => {
  const { data } = await getFrontPageDestroyValueLeadDetail()
  destroyValueDetailVisible.value = true
  destroyValueDetailList.value = data.list
  showUserName.value = true
}
const commissionSitePieList = ref<IPieItem[]>([])
const commissionTypePieList = ref<IPieItem[]>([])
const fetchTotalBonus = async () => {
  const { data } = await getFrontPageBonus()
  countConfig1.endValue = data.currentMonthBonus
  countConfig1.monthDiff = data.bonusMonthDiff
  countConfig1.yearDiff = data.bonusYearMonthDiff
  commissionSitePieList.value = data.commissionSitePieList
  commissionTypePieList.value = data.commissionTypePieList
  handleChangePieList()
}
const destroySitePieList = ref<IPieItem[]>([])
const destroyPieList = ref<IPieItem[]>([])
const displayDestroyPieList = ref<IPieItem[]>([])
const destroyPersonPieList = ref<IPieItem[]>([])
const destroyLeadSitePieList = ref<IPieItem[]>([])
const displayDestroyLeadPieList = ref<IPieItem[]>([])
const fetchDestroyValue = async () => {
  const { data } = await getFrontPageDestroyValue()
  countConfig5.endValue = data.totalAmount
  destroySitePieList.value = data.destroySitePieList
  destroyPieList.value = data.destroyPieList
  countConfig5.monthDiff = data.lastMonthDiff
  countConfig5.yearDiff = data.lastYearSameMonthDiff
  handleChangeDestroyPieList()
}
const fetchLeadDestroyValue = async () => {
  const { data } = await getFrontPageLeadDestroyValue()
  countConfig6.endValue = data.totalAmount
  destroyLeadSitePieList.value = data.destroySitePieList
  destroyPersonPieList.value = data.destroyPersonPieList
  countConfig6.monthDiff = data.lastMonthDiff
  countConfig6.yearDiff = data.lastYearSameMonthDiff
  handleChangeDestroyLeadPieList()
}
const handleChangePieList = () => {
  if (type.value === 0) {
    let i = 0
    pieList.value = commissionSitePieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  } else if (type.value === 1) {
    let i = 0
    pieList.value = commissionTypePieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  }
}
const handleChangeDestroyPieList = () => {
  if (selectDestroyValueType.value === 0) {
    let i = 0
    displayDestroyPieList.value = destroySitePieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  } else if (selectDestroyValueType.value === 1) {
    let i = 0
    displayDestroyPieList.value = destroyPieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  }
}
const handleChangeDestroyLeadPieList = () => {
  if (selectDestroyLeadValueType.value === 0) {
    let i = 0
    displayDestroyLeadPieList.value = destroyPersonPieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  } else if (selectDestroyLeadValueType.value === 1) {
    let i = 0
    displayDestroyLeadPieList.value = destroyLeadSitePieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const displayValue = item.value < 0 ? Math.abs(item.value) : item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: displayValue,
        trueValue,
        itemStyle,
      }
    })
  }
}
const date = ref('')
// 更新日期
const fetchUpdateDate = async () => {
  const { data } = await getOperationUpdateDate({ type: 3 })
  if (data) {
    date.value = data.split(' ')[0]
  }
}
const historyList = ref<IGetFrontPagePerformanceHistory[]>([])
const selectDate = ref<[string, string]>(getLastYearStringMonth())
const userList = ref<{ id: number; label: string }[]>([])
const userId = ref<number>()
const fetchUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption()
  userList.value = data
  if (userList.value.length > 0) {
    userId.value = userList.value.find((item) => item.label === myName)?.id
  }
  if (!userId.value) {
    userId.value = userList.value[0].id
  }
  fetchData()
}
const fetchData = async () => {
  const { data } = await getFrontPagePerformanceHistory({
    userId: userId.value!,
    startMonth: selectDate.value[0],
    endMonth: selectDate.value[1],
  })
  historyList.value = data
}

const rank1List = ref<IRankItem[]>([])
const rank2List = ref<IRankItem[]>([])
const rank3List = ref<IRankItem[]>([])
const rank4List = ref<IRankItem[]>([])
const rank5List = ref<IRankItem[]>([])

const fetchRankNewProductOneYearCommission = async () => {
  const { data } = await getFrontPageRankNewProductOneYearCommission({ month: selectNewProductOneYearMonth.value! })
  rank3List.value = data
}
const fetchRankNewProductCommission = async () => {
  const { data } = await getFrontPageRankNewProductCommission({ month: selectNewProductMonth.value! })
  rank5List.value = data
}
// 获取当月产品利润分
const profitList = ref<IGetFrontPageProductProfitRes[]>([])
const fetchMonthlyProductProfit = async () => {
  if (selectProfitMonth.value) {
    const { data } = await getMonthlyProductProfit({ month: selectProfitMonth.value })
    profitList.value = data
  }
}
// 获取当月考核数
const listAdd = ref<IGetFrontPageMonthlyAssessment[]>([])
const listSub = ref<IGetFrontPageMonthlyAssessment[]>([])
const fetchMonthlyPlusAssessment = async () => {
  if (selectAssessmentPlusMonth.value) {
    const { data } = await getMonthlyAssessmentPlus({ month: selectAssessmentPlusMonth.value })
    listAdd.value = data
  }
}
const fetchMonthlyMinusAssessment = async () => {
  if (selectAssessmentMinusMonth.value) {
    const { data } = await getMonthlyAssessmentMinus({ month: selectAssessmentMinusMonth.value })
    listSub.value = data
  }
}
const historyMonthList = ref<string[]>([])
const historyBossMonthList = ref<string[]>([])
const newProductMonthList = ref<string[]>([])
const selectAchievedMonth = ref<string>()
const selectFinishMonth = ref<string>()
const selectNewProductMonth = ref<string>()
const selectNewProductOneYearMonth = ref<string>()
const monthList = ref<string[]>([])
const selectProfitMonth = ref<string>()
const selectAssessmentPlusMonth = ref<string>()
const selectAssessmentMinusMonth = ref<string>()
// 查询月份列表
const fetchHistoryMonthList = async () => {
  const { data } = await getFrontPageHistoryMonthList()
  historyMonthList.value = data

  // newProductMonthList 从 2025-08 开始（包含 2025-08 及更新的月份）
  const targetMonth = '2025-08'
  const targetIndex = data.findIndex((month) => month === targetMonth)

  if (targetIndex !== -1) {
    // 从 2025-08 开始，只取到数组开头（最新的月份）
    // 因为数据是按时间倒序排列的，所以取从 targetIndex 到 0 的数据
    newProductMonthList.value = data.slice(0, targetIndex + 1)
  } else {
    // 如果找不到 2025-08，则使用所有数据
    newProductMonthList.value = data
  }

  selectAchievedMonth.value = data[0]
  selectFinishMonth.value = data[0]
  selectNewProductMonth.value = newProductMonthList.value[0] || data[0]
  selectJobLevelMonth.value = newProductMonthList.value[0] || data[0]
}

const fetchAdjustDetailMonthList = async () => {
  const { data } = await getFrontPageAdjustDetailMonth()
  monthList.value = data
  if (data.length > 0) {
    const currentMonth = getCurrentMonth()
    // 优先选择当前月份，如果不存在则选择第一个
    const defaultMonth = data.includes(currentMonth) ? currentMonth : data[0]
    selectProfitMonth.value = defaultMonth
    selectAssessmentPlusMonth.value = defaultMonth
    selectAssessmentMinusMonth.value = defaultMonth
  }
}
const fetchBillingMonthList = async () => {
  const { data } = await getFrontPageBillingMonth()
  historyMonthList.value = data
  // 对于Boss角色
  if (useAclStore().getRole.includes(ROLE_BOSS_CODE)) {
    historyBossMonthList.value = data
  } else {
    // 对于其他角色,去掉当月的
    historyBossMonthList.value = data.filter((item) => item !== getCurrentMonth())
  }
  selectAchievedMonth.value = historyBossMonthList.value[0]
  selectFinishMonth.value = historyBossMonthList.value[0]
  selectNewProductMonth.value = data[0]
  selectNewProductOneYearMonth.value = data[0]
  selectJobLevelMonth.value = data[0]
}
const fetchRankOverAchieved = async () => {
  const { data } = await getFrontPageRankOverAchieved({ month: selectAchievedMonth.value! })
  rank1List.value = data
}
const fetchRankAssessmentFinish = async () => {
  const { data } = await getFrontPageRankAssessmentFinish({ month: selectFinishMonth.value! })
  rank4List.value = data
}
const top30ProductSaleList = ref<IGetOperationAmazonSKUList[]>([])
const fetchTop30ProductSale = async () => {
  const { data } = await getFrontPageTop30ProductSale()
  top30ProductSaleList.value = data
}
const inventoryProductsTotalValueList = ref<IGetFrontPageInventoryProductsTotalValue[]>([])
const fetchInventoryProductsTotalValue = async () => {
  const { data } = await getFrontPageInventoryProductsTotalValue()
  inventoryProductsTotalValueList.value = data
}
const jobLevelCommissionList = ref<IGetFrontPageJobLevelCommission[]>([])
const selectJobLevelMonth = ref<string>()
const fetchJobLevelCommission = async () => {
  const { data } = await getFrontPageJobLevelCommission({ month: selectJobLevelMonth.value! })
  jobLevelCommissionList.value = data
}
onBeforeMount(async () => {
  if (ableViewCommissionCard) {
    fetchTotalBonus()
    fetchUpdateDate()
  }
  if (ableViewCard) {
    fetchAssessmentData()
    fetchInProgressProjectsData()
  }

  if (ableProductManagerViewCard) {
    // await fetchHistoryMonthList()
    await fetchBillingMonthList()
    await fetchAdjustDetailMonthList()
    fetchUserList()
    fetchRankNewProductOneYearCommission()
    await fetchMonthlyProductProfit()
    await fetchMonthlyPlusAssessment()
    await fetchMonthlyMinusAssessment()
    await fetchRankOverAchieved()
    await fetchRankAssessmentFinish()
    await fetchRankNewProductCommission()
  }
  if (ableViewTop30ProductSaleCard) {
    fetchTop30ProductSale()
  }
  if (ableBossViewCard) {
    fetchInventoryProductsTotalValue()
  }
  if (ableViewDestroyValueCard) {
    fetchDestroyValue()
  }
  if (ableProductManagerLeadViewCard) {
    fetchLeadDestroyValue()
    fetchJobLevelCommission()
  }
})
</script>

<style lang="scss" scoped>
.index-container {
  :deep() {
    .el-card {
      .el-card__header {
        position: relative;

        > div > span {
          display: flex;
          align-items: center;

          i {
            margin-right: 3px;
          }
        }
      }

      .el-card__body {
        position: relative;

        .card-footer-tag {
          position: absolute;
          right: var(--el-margin);
          bottom: 15px;
        }
        .bottom-time {
          position: absolute;
          right: -10px;
          bottom: -15px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
    margin-bottom: 20px;
  }

  // 行间距样式
  .row-spacing {
    margin-top: 20px;
  }
}
</style>
