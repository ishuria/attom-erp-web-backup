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
      <el-col v-if="ableViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24" />
      <!-- 第二层 -->
      <el-col v-if="ableProductManagerViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <monthly-product-profit-table :list="profitList">
          <template #select>
            <el-select v-model="selectProfitMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyProductProfit">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-product-profit-table>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="6" :md="24" :sm="24" :xl="6" :xs="24">
        <monthly-assessment-table :list="listSub" title="其他计分项">
          <template #select>
            <el-select v-model="selectAssessmentMinusMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyMinusAssessment">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-assessment-table>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="6" :md="24" :sm="24" :xl="6" :xs="24">
        <monthly-assessment-table :list="listAdd" title="考核数加回">
          <template #select>
            <el-select v-model="selectAssessmentPlusMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyPlusAssessment">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </monthly-assessment-table>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank5List" :my-name="myName" name="新品月均提成(前6个月)" title="前6月平均新品提成排行">
          <template #select>
            <el-select v-model="selectNewProductMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankNewProductCommission">
              <el-option v-for="item in newProductMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <!-- 第三层 -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <!-- <recommendation2 /> -->
      </el-col>
      <!-- 第四层 -->
      <el-col v-if="ableProductManagerViewCard" :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <performance-history :list="historyList">
          <template #select>
            <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-date-picker v-model="selectDate" type="monthrange" value-format="YYYY-MM" @change="fetchData" />
          </template>
        </performance-history>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank1List" :my-name="myName" name="超额完成数" :show-medal="true" title="超额完成排行">
          <template #select>
            <el-select v-model="selectAchievedMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankOverAchieved">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank4List" :my-name="myName" name="考核完成数" title="考核数完成排行">
          <template #select>
            <el-select v-model="selectFinishMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankAssessmentFinish">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <!-- <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月提成排行" :list="rank2List" name="提成" :my-name="myName" />
      </el-col> -->
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank3List" :my-name="myName" name="新品提成" title="上月新品提成排行(上线1年以内)" />
      </el-col>
      <!-- 第五层 -->
      <el-col v-if="ableViewTop30ProductSaleCard" :lg="14" :md="24" :sm="24" :xl="14" :xs="24">
        <top30-product-sale-table :list="top30ProductSaleList">
          <!-- <template #select>
            <el-select v-model="selectProfitMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyProductProfit">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template> -->
        </top30-product-sale-table>
      </el-col>
      <el-col v-if="ableBossViewCard" :lg="10" :md="24" :sm="24" :xl="10" :xs="24">
        <inventory-products-total-value :data="inventoryProductsTotalValueList" @update="fetchInventoryProductsTotalValue" />
      </el-col>
    </el-row>

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
  getFrontPageBonus,
  getFrontPageHistoryAssessmentRecords,
  getFrontPageHistoryMonthList,
  getFrontPageInventoryProductsTotalValue,
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
  IGetFrontPageHistoryAssessmentRecordsItem,
  IGetFrontPageHistoryAssessmentRecordsReq,
  IGetFrontPageInventoryProductsTotalValue,
  IGetFrontPageMonthlyAssessment,
  IGetFrontPagePerformanceHistory,
  IGetFrontPageProductProfitRes,
  IGetFrontPageProgressProjectsItem,
  IPieItem,
  IRankItem,
} from '/@/type/index/frontPage'
import { getLastYearStringMonth } from '/@/utils/dateUtils'

defineOptions({
  name: 'Index',
})

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
const ableViewCommissionCard = commissionRole.includes(currentRoleCode)
const ableBossViewCard = currentRoleCode === ROLE_BOSS_CODE
const type = ref<number>(0)
const selectOption = [
  { label: '站点', value: 0 },
  { label: '类型', value: 1 },
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
const handleChangePieList = () => {
  if (type.value === 0) {
    let i = 0
    pieList.value = commissionSitePieList.value.map((item: any, index: number) => {
      const trueValue = item.value
      const itemStyle = { color: colorList[index] }
      if (item.value < 0) {
        item.value = Math.abs(item.value)
        itemStyle.color = redColorList[i]
        i++
      }
      return {
        name: item.name,
        value: item.value,
        trueValue,
        itemStyle,
      }
    })
  } else if (type.value === 1) {
    pieList.value = commissionTypePieList.value
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
const rank1FinishList = ref<IRankItem[]>([])

const fetchRankNewProductOneYearCommission = async () => {
  const { data } = await getFrontPageRankNewProductOneYearCommission()
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
const newProductMonthList = ref<string[]>([])
const selectAchievedMonth = ref<string>()
const selectFinishMonth = ref<string>()
const selectNewProductMonth = ref<string>()
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
}
const fetchAdjustDetailMonthList = async () => {
  const { data } = await getFrontPageAdjustDetailMonth()
  monthList.value = data
  if (data.length > 0) {
    selectProfitMonth.value = data[0]
    selectAssessmentPlusMonth.value = data[0]
    selectAssessmentMinusMonth.value = data[0]
  }
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
    await fetchHistoryMonthList()
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
}
</style>
