<template>
  <div class="index-container no-background-container">
    <el-row :gutter="20">
      <!-- 第一层 -->
      <el-col v-if="ableViewCommissionCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card  background="white" :count-config="countConfig1" :month-diff="countConfig1.monthDiff" :year-diff="countConfig1.yearDiff" title="本月总提成" @open-table="handleJumpTo" >
          <template #select>
            <el-select v-model="type" size="small" @change="handleChangePieList" >
              <el-option 
                v-for="item in selectOption"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #chart>
            <vab-commission-chart-pie v-if="type === 0" :data="pieList" @click="handleJumpTo" />
            <commission-type-pie v-if="type === 1" :data="pieList" @click="handleJumpTo" />
          </template>
          <template #date>
            <div class="bottom-time">{{ date }}更新</div>
          </template>
        </top-card>
      </el-col>
      <el-col v-if="ableViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :month-diff="countConfig2Start.monthDiff" :year-diff="countConfig2Start.yearDiff" title="本月考核完成数" @open-table="fetchHistoryAssessmentRecords">
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
        <top-card  background="white" :month-diff="countConfig3Start.monthDiff" :year-diff="countConfig3Start.yearDiff" title="本月OEM完成数"  @open-table="fetchHistoryAssessmentRecords">
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
        <top-bar-card  background="white" :count-config="countConfig4" :month-diff="monthDiff" :year-diff="yearDiff" title="推进中的项目" url="/newProductDevelopment/newProductProgress">
          <template #chart>
            <in-progress-projects-bar :data="inProgressProjectsData" :total="countConfig4.endValue" />
          </template>
        </top-bar-card>
      </el-col>
      <!-- 第二层 -->
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <!-- <pending2 /> -->
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <!-- <version-information /> -->
      </el-col>
      <!-- 第三层 -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <!-- <recommendation2 /> -->
      </el-col>
      <!-- 第四层 -->
      <el-col v-if="ableViewCard" :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <performance-history :list="historyList" >
          <template #select>
            <el-select v-model="userId" placeholder="人员" style="max-width: 5em;" @change="fetchData">
              <el-option
                v-for="item in userList"
                :label="item.label"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
            <el-date-picker type="monthrange" v-model="selectDate" value-format="YYYY-MM" @change="fetchData" />
          </template>
        </performance-history>
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月超额完成排行" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月提成排行" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月新品提成排行(上线1年以内)" />
      </el-col>
    </el-row>
     <history-assessment-records 
      v-model="historyVisible" :list="list" :loading="listLoading" :query-form="queryForm" :total="total" 
      @query="queryData" @page-change="handleCurrentChange" @size-change="handleSizeChange"
    />
  </div>
 
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { getOperationUpdateDate } from '~/src/api/devlocal/productPerformance'
import { getLastYearStringMonth } from '~/src/utils/dateUtils'
import { redColorList } from '../commission/constantOption'
import { colorList } from '../storeOperations/constantOption'
import { getFrontPageAssessmentData, getFrontPageBonus, getFrontPageHistoryAssessmentRecords, getFrontPagePerformanceHistory, getFrontPageProductManagerSelectOption, getFrontPageProgressProjects } from '/@/api/devlocal/frontPage'
import { ROLE_ADMINBUYERLEAD_CODE, ROLE_GRAPHICDESIGNER_CODE, ROLE_GRAPHICDESIGNLEAD_CODE, ROLE_INDUSTRIAL_DESIGN_CODE, ROLE_PRODUCTMANAGER_CODE, ROLE_PRODUCTMANNAGERLEAD_CODE, ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE, ROLE_SUPPLY_CHAIN_MANG_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { IGetFrontPageHistoryAssessmentRecordsItem, IGetFrontPageHistoryAssessmentRecordsReq, IGetFrontPagePerformanceHistory, IGetFrontPageProgressProjectsItem, IPieItem } from '/@/type/index/frontPage'

defineOptions({
  name: 'Index',
})

const router = useRouter()
const currentRoleCode = useAclStore().getRole[0];
const ableViewCard = currentRoleCode === ROLE_PRODUCTMANAGER_CODE || currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE || currentRoleCode === ROLE_ADMINBUYERLEAD_CODE;
const commissionRole = [
  ROLE_GRAPHICDESIGNLEAD_CODE, ROLE_GRAPHICDESIGNER_CODE, ROLE_INDUSTRIAL_DESIGN_CODE,
  ROLE_PRODUCTMANNAGERLEAD_CODE, ROLE_PRODUCTMANAGER_CODE, ROLE_ADMINBUYERLEAD_CODE,
  ROLE_SUPPLY_CHAIN_MANG_CODE, ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE
]
const ableViewCommissionCard = commissionRole.includes(currentRoleCode)
const type = ref<number>(0)
const selectOption = [
  { label: '站点', value: 0 },
  { label: '类型', value: 1 }
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
  pageSize: 20
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
  if (currentRoleCode === ROLE_GRAPHICDESIGNLEAD_CODE || currentRoleCode === ROLE_GRAPHICDESIGNER_CODE || currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE) {
    url = "/commission/commissionArtDetails"
  } else if (currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE || currentRoleCode === ROLE_PRODUCTMANAGER_CODE || currentRoleCode === ROLE_ADMINBUYERLEAD_CODE || currentRoleCode === ROLE_SUPPLY_CHAIN_MANG_CODE) {
    url = "/commission/commissionProductDetails"
  } else if (currentRoleCode === ROLE_PURCHASER_CODE || currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE) {
    url = "/commission/procurementCostReduction"
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
const userList = ref<{ id: number, label: string }[]>([])
const userId = ref<number>()
const fetchUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption()
  userList.value = data
  if (userList.value.length > 0) {
    userId.value = userList.value[0].id
  }
  fetchData()
}
const fetchData = async () => {
  const { data } = await getFrontPagePerformanceHistory({ userId: userId.value!, startMonth: selectDate.value[0], endMonth: selectDate.value[1] })
  historyList.value = data
}
onBeforeMount(() => {
  if (ableViewCommissionCard) {
    fetchTotalBonus()
    fetchUpdateDate()
  }
  if (ableViewCard) {
    fetchAssessmentData()
    fetchInProgressProjectsData()
    fetchUserList()
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
  }
}

</style>