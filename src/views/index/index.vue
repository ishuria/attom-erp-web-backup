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
    <el-row class="row-spacing" :gutter="20">
      <!-- 激励政策 - 放在第二行开头 -->
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <incentive-policy-card />
      </el-col>
      <!-- 美工任务统计 -->
      <el-col v-if="ableViewArtDesignDashboardCard" :lg="10" :md="24" :sm="24" :xl="10" :xs="24">
        <art-design-dashboard />
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

    <!-- 第四层 -->
    <el-row v-if="ableViewAttendanceOverviewCard" class="row-spacing" :gutter="20">
      <el-col v-if="ableViewAttendanceOverviewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <!-- 考勤概况 -->
        <attendance-overview-card :list="attendanceOverviewList" @sort-change="handleAttendanceOverviewSortChange">
          <template #select>
            <el-date-picker
              :key="attendanceOverviewDateRangeKey"
              v-model="attendanceOverviewDateRange"
              :clearable="false"
              type="monthrange"
              value-format="YYYY-MM"
              @change="fetchAttendanceOverview"
            />
          </template>
        </attendance-overview-card>
      </el-col>
      <el-col v-if="currentRoleCode !== ROLE_BOSS_CODE" :lg="4" :md="24" :sm="24" :xl="4" :xs="24">
        <personal-bonus-card :data="personalBonusData" :loading="personalBonusLoading">
          <template #select>
            <el-select v-model="selectPersonalBonusMonth" placeholder="月份" style="max-width: 5em" @change="fetchPersonalBonus">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </personal-bonus-card>
      </el-col>
      <el-col v-if="ableProductManagerViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank1List" :my-name="myName" name="超额完成数" :show-commission="true" :show-medal="true" title="超额完成排行">
          <template #select>
            <el-select v-model="selectAchievedMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankOverAchieved">
              <el-option v-for="item in historyBossMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
      <el-col v-if="ableBossViewCard" :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank :list="rank4List" :my-name="myName" name="考核完成数" title="考核数完成排行">
          <template #select>
            <el-select v-model="selectFinishMonth" placeholder="月份" style="max-width: 5em" @change="fetchRankAssessmentFinish">
              <el-option v-for="item in historyBossMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </rank>
      </el-col>
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
    </el-row>
    <!-- 第五层 -->
    <el-row class="row-spacing" :gutter="20">
      <!-- 产品经理绩效历史 -->
      <el-col v-if="ableProductManagerViewCard" :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <performance-history :list="historyList">
          <template #select>
            <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-date-picker v-model="selectDate" :clearable="false" type="monthrange" value-format="YYYY-MM" @change="fetchData" />
          </template>
        </performance-history>
      </el-col>
      <!-- 产品经理绩效汇总 -->
      <el-col v-if="ableViewPerformanceSummaryCard" :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <performance-summary :data-map="performanceSummaryDataMap" :selected-metric="selectedPerformanceMetric">
          <template #select>
            <el-date-picker
              v-model="performanceSummaryDateRange"
              :clearable="false"
              type="monthrange"
              value-format="YYYY-MM"
              @change="fetchPerformanceSummary"
            />
            <el-select v-model="selectedPerformanceMetric" placeholder="指标" style="max-width: 5em">
              <el-option v-for="metric in availableMetrics" :key="metric.value" :label="metric.label" :value="metric.value" />
            </el-select>
          </template>
        </performance-summary>
      </el-col>
      <!-- 做Vine回评追踪 -->
      <el-col v-if="ableProductManagerViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <vine-review-card :user-list="userList" />
      </el-col>
      <!-- 利润分预览 -->
      <el-col v-if="ableProductManagerViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <profit-share-preview-card
          :list="profitSharePreviewList"
          :loading="profitSharePreviewLoading"
          :page-no="profitSharePreviewQueryForm.pageNo"
          :page-size="profitSharePreviewQueryForm.pageSize"
          :total="profitSharePreviewTotal"
          @current-change="handleProfitSharePreviewCurrentChange"
          @size-change="handleProfitSharePreviewSizeChange"
        >
          <template #select>
            <el-select v-model="selectProfitSharePreviewUserId" placeholder="人员" style="max-width: 5em" @change="fetchProfitSharePreview">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-select v-model="selectProfitSharePreviewMonth" placeholder="月份" style="max-width: 5em" @change="fetchProfitSharePreview">
              <el-option v-for="item in profitSharePreviewMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </profit-share-preview-card>
      </el-col>
      <!-- 产品经理职级提成 -->
      <el-col v-if="ableProductManagerLeadViewCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <job-level-commission-table :list="jobLevelCommissionList">
          <template #select>
            <el-select v-model="selectJobLevelMonth" placeholder="月份" style="max-width: 5em" @change="fetchJobLevelCommission">
              <el-option v-for="item in historyMonthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </job-level-commission-table>
      </el-col>

      <el-col v-if="ableViewLowVolumeProductStorageFeeCard" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <fba-count-sale-day-chart :site-list="fbaSiteList" :user-list="fbaCountUserList" />
      </el-col>
    </el-row>
    <el-row class="row-spacing" :gutter="20">
      <!-- 库存货值统计 -->
      <el-col v-if="ableBossViewCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <inventory-products-total-value :data="inventoryProductsTotalValueList">
          <template #select>
            <el-date-picker
              :key="inventoryProductsTotalValueDateRangeKey"
              v-model="inventoryProductsTotalValueDateRange"
              :clearable="false"
              :shortcuts="dateShortcuts"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleInventoryProductsTotalValueDateRangeChange"
            />
            <el-button type="primary" @click="updateInventoryProductsTotalValue">更新</el-button>
          </template>
        </inventory-products-total-value>
      </el-col>
      <!-- 仓库容量 -->
      <el-col v-if="ableViewWarehouseCapacityCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <warehouse-capacity :data="warehouseCapacityList">
          <template #select>
            <el-date-picker
              :key="warehouseCapacityDateRangeKey"
              v-model="warehouseCapacityDateRange"
              :clearable="false"
              :shortcuts="dateShortcuts"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleWarehouseCapacityDateRangeChange"
            />
            <el-button v-if="ableBossViewCard" type="primary" @click="updateWarehouseCapacity">更新</el-button>
          </template>
        </warehouse-capacity>
      </el-col>
    </el-row>

   
    <el-row  class="row-spacing" :gutter="20">
       <!-- 收发误差数 -->
      <el-col v-if="ableViewShippingErrorCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <shipping-error-chart />
      </el-col>
          <!-- 上新天数销售额/利润图表 -->
      <el-col v-if="ableProductManagerViewCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <new-product-sale-day-chart :site-list="siteList" :user-list="newProductSaleDayChartUserList" />
      </el-col>
    </el-row>



    <!-- 第六层 -->
    <el-row v-if="ableViewTop30ProductSaleCard || ableViewTop50ProductLossCard" class="row-spacing" :gutter="20">
      <!-- top100新品销售额 -->
      <el-col v-if="ableViewTop30ProductSaleCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <top30-product-sale-table :list="top30ProductSaleList" :loading="top30ProductSaleLoading">
          <!-- <template #select>
            <el-select v-model="selectProfitMonth" placeholder="月份" style="max-width: 5em" @change="fetchMonthlyProductProfit">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </template> -->
        </top30-product-sale-table>
      </el-col>
      <!-- top50 亏损产品 -->
      <el-col v-if="ableViewTop50ProductLossCard" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <top50-product-loss-table :list="top50ProductLossList">
          <template #select>
            <el-select v-model="selectLossUserId" placeholder="人员" style="max-width: 5em" @change="fetchTop50ProductLoss">
              <el-option v-for="item in lossUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </top50-product-loss-table>
      </el-col>
    </el-row>
    <!-- 低动销仓储费 -->
    <el-row class="row-spacing" :gutter="20">
      <el-col v-if="ableViewLowVolumeProductStorageFeeCard" :lg="15" :md="24" :sm="24" :xl="15" :xs="24">
        <low-volume-product-storage-fees
          :current-page="lowStorageFeeQueryForm.pageNo"
          :list="lowVolumeProductStorageFeeList"
          :loading="lowStorageFeeLoading"
          :page-size="lowStorageFeeQueryForm.pageSize"
          :total="lowStorageFeeTotal"
          @current-change="
            (p) => {
              lowStorageFeeQueryForm.pageNo = p
              fetchLowVolumeProductStorageFee()
            }
          "
          @size-change="
            (s) => {
              lowStorageFeeQueryForm.pageNo = 1
              lowStorageFeeQueryForm.pageSize = s
              fetchLowVolumeProductStorageFee()
            }
          "
          @sort-change="handleSortChange"
        >
          <template #select>
            <el-select v-model="selectOperationUserId" style="width: 5em" @change="fetchLowVolumeProductStorageFee">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </low-volume-product-storage-fees>
      </el-col>
      <!-- 美工任务统计 -->
      <el-col v-if="ableBossViewCard" :lg="10" :md="24" :sm="24" :xl="10" :xs="24">
        <art-design-dashboard />
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
    <!-- 销毁货值详情 -->
    <destroy-value-detail-table v-model="destroyValueDetailVisible" :list="destroyValueDetailList" :show-user-name="showUserName" />
  </div>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { getDistributionSiteList } from '~/src/api/devlocal/productDistribution'
import { redColorList } from '../commission/constantOption'
import { colorList } from '../storeOperations/constantOption'
import {
  getFrontPageAdjustDetailMonth,
  getFrontPageAssessmentData,
  getFrontPageAttendanceOverview,
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
  getFrontPagePerformanceHistorySummary,
  getFrontPagePersonalBonus,
  getFrontPageProductManagerSelectOption,
  getFrontPageProfitScore,
  getFrontPageProgressProjects,
  getFrontPageRankAssessmentFinish,
  getFrontPageRankNewProductCommission,
  getFrontPageRankNewProductOneYearCommission,
  getFrontPageRankOverAchieved,
  getFrontPageTop30ProductSale,
  getFrontPageTop50ProductLoss,
  getFrontPageWarehouseCapacity,
  getLowVolumeProductStorageFee,
  getMonthlyAssessmentMinus,
  getMonthlyAssessmentPlus,
  getMonthlyProductProfit,
  updateFrontPageInventoryProductsTotalValue,
  updateFrontPageWarehouseCapacity,
} from '/@/api/devlocal/frontPage'
import { getOperationUpdateDate } from '/@/api/devlocal/productPerformance'
import {
  ROLE_ADMINBUYERLEAD_CODE,
  ROLE_BOSS_CODE,
  ROLE_ECOMMERCEOPERATIONLEAD_CODE,
  ROLE_ECOMMERCEOPERATOR_CODE,
  ROLE_GRAPHICDESIGNER_CODE,
  ROLE_GRAPHICDESIGNLEAD_CODE,
  ROLE_INDUSTRIAL_DESIGN_CODE,
  ROLE_LOGISTISCSPECIALIST_CODE,
  ROLE_PACKAGER_CODE,
  ROLE_PRODUCTMANAGER_CODE,
  ROLE_PRODUCTMANNAGERLEAD_CODE,
  ROLE_PURCHASER_CODE,
  ROLE_PURCHASINGASSISTANT_CODE,
  ROLE_SUPPLY_CHAIN_MANG_CODE,
  ROLE_WAREHOUSEMANNAGERlEAD_CODE,
} from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import {
  IGetFrontPageAttendanceOverview,
  IGetFrontPageDestroyValueDetailItem,
  IGetFrontPageHistoryAssessmentRecordsItem,
  IGetFrontPageHistoryAssessmentRecordsReq,
  IGetFrontPageInventoryProductsTotalValue,
  IGetFrontPageJobLevelCommission,
  IGetFrontPageMonthlyAssessment,
  IGetFrontPagePerformanceHistory,
  IGetFrontPagePersonalBonusItem,
  IGetFrontPageProductProfitRes,
  IGetFrontPageProfitScoreItem,
  IGetFrontPageProgressProjectsItem,
  ILowVolumeProductStorageFee,
  IPerformanceMetric,
  IPieItem,
  IRankItem,
  IWarehouseCapacityItem,
} from '/@/type/index/frontPage'
import { IGetOperationAmazonSKUList } from '/@/type/storeOperation/productPerformanceType'
import { getCurrentMonth, getLast90DaysStringTime, getLastMonth, getLastYearStringMonth } from '/@/utils/dateUtils'

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
// 上新天数销售额/利润图表可见性：产品经理、产品设计、Boss
const ableViewNewProductSaleDayChartCard =
  currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
  currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE ||
  currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE ||
  currentRoleCode === ROLE_BOSS_CODE
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
const ableViewTop50ProductLossCard =
  currentRoleCode === ROLE_BOSS_CODE ||
  currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
  currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE ||
  currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE ||
  currentRoleCode === ROLE_ECOMMERCEOPERATIONLEAD_CODE
const ableViewLowVolumeProductStorageFeeCard =
  currentRoleCode === ROLE_BOSS_CODE ||
  currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE ||
  currentRoleCode === ROLE_ECOMMERCEOPERATIONLEAD_CODE
const ableViewShippingErrorCard =
  currentRoleCode === ROLE_BOSS_CODE ||
  currentRoleCode === ROLE_LOGISTISCSPECIALIST_CODE ||
  currentRoleCode === ROLE_WAREHOUSEMANNAGERlEAD_CODE
const ableViewAttendanceOverviewCard = currentRoleCode !== ROLE_PACKAGER_CODE && currentRoleCode !== ROLE_WAREHOUSEMANNAGERlEAD_CODE
const ableViewPerformanceSummaryCard = currentRoleCode === ROLE_BOSS_CODE || currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE
const ableViewArtDesignDashboardCard = currentRoleCode === ROLE_GRAPHICDESIGNLEAD_CODE || currentRoleCode === ROLE_GRAPHICDESIGNER_CODE
const ableViewWarehouseCapacityCard =
  currentRoleCode === ROLE_BOSS_CODE ||
  currentRoleCode === ROLE_WAREHOUSEMANNAGERlEAD_CODE ||
  currentRoleCode === ROLE_LOGISTISCSPECIALIST_CODE
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
const performanceSummaryDateRange = ref<[string, string]>(getLastYearStringMonth())
const userList = ref<{ id: number; label: string }[]>([])
const profitSharePreviewUserList = ref<{ id: number; label: string }[]>([])
const userId = ref<number>()
const fetchUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption({ type: 0 })
  userList.value = data
  if (userList.value.length > 0) {
    userId.value = userList.value.find((item) => item.label === myName)?.id
  }
  if (!userId.value) {
    userId.value = userList.value[0].id
  }
  profitSharePreviewUserList.value = data
  profitSharePreviewUserList.value.unshift({ id: -1, label: '全部' })
  newProductSaleDayChartUserList.value = data
  fetchData()
}
const lossUserList = ref<{ id: number; label: string }[]>([])
const selectLossUserId = ref<number>()
const fbaCountUserList = ref<{ id: number; label: string }[]>([])
// 上新天数销售额/利润图表人员列表
const newProductSaleDayChartUserList = ref<{ id: number; label: string }[]>([])

const fetchLossUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption({ type: 1 })
  lossUserList.value = data
  // 过滤掉已存在的"全部"选项，避免重复
  fbaCountUserList.value = data.filter((item) => !(item.id === -1 && item.label === '全部'))
  fbaCountUserList.value.unshift({ id: -1, label: '全部' })
  if (ableBossViewCard) {
    // 过滤掉已存在的"全部"选项，避免重复
    lossUserList.value = lossUserList.value.filter((item) => !(item.id === -1 && item.label === '全部'))
    lossUserList.value.unshift({ id: -1, label: '全部' })
    selectLossUserId.value = -1
  } else {
    if (lossUserList.value.length > 0) {
      selectLossUserId.value = lossUserList.value.find((item) => item.label === myName)?.id
    }
  }
  fetchTop50ProductLoss()
}
const fetchData = async () => {
  const { data } = await getFrontPagePerformanceHistory({
    userId: userId.value!,
    startMonth: selectDate.value[0],
    endMonth: selectDate.value[1],
  })
  historyList.value = data
}

// 产品经理绩效汇总
const performanceSummaryDataMap = ref<Record<string, IGetFrontPagePerformanceHistory[]>>({})
const selectedPerformanceMetric = ref<string>('developmentDesign')
// 绩效汇总指标配置
const availableMetrics = ref<IPerformanceMetric[]>([
  { value: 'developmentDesign', label: '提成', key: 'developmentDesign' },
  { value: 'newProductOneYearCommission', label: '新品提成', key: 'newProductOneYearCommission' },
  { value: 'newProductsAverageProfit', label: '新品平均利润', key: 'newProductsAverageProfit' },
  { value: 'purchaseAmount', label: '新款采购额', key: 'purchaseAmount' },
  { value: 'jingPinCount', label: '精品', key: 'jingPinCount' },
  { value: 'jingPuCount', label: '精铺', key: 'jingPuCount' },
  { value: 'jingPuVineCount', label: '精铺vine', key: 'jingPuVineCount' },
  { value: 'puHuoCount', label: '铺货', key: 'puHuoCount' },
  { value: 'runsNumbers', label: '新款评估跑分次数', key: 'runsNumbers' },
  { value: 'progressNumbers', label: '新品进度记录数', key: 'progressNumbers' },
  { value: 'samplingFrequency', label: '拿样次数', key: 'samplingFrequency' },
])

// 实际的数据获取函数
const fetchPerformanceSummary = async () => {
  if (!performanceSummaryDateRange.value || !performanceSummaryDateRange.value[0] || !performanceSummaryDateRange.value[1]) {
    return
  }

  try {
    const { data } = await getFrontPagePerformanceHistorySummary({
      startMonth: performanceSummaryDateRange.value[0],
      endMonth: performanceSummaryDateRange.value[1],
    })

    // 更新数据
    performanceSummaryDataMap.value = data || {}
  } catch (error) {
    console.error('获取绩效汇总数据失败:', error)
    performanceSummaryDataMap.value = {}
  }
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
const selectPersonalBonusMonth = ref<string>()
const personalBonusData = ref<IGetFrontPagePersonalBonusItem[]>([])
const personalBonusLoading = ref<boolean>(false)
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
  // 新品提成相关卡片默认展示当前月，若无则取最新
  const currentMonth = getCurrentMonth()
  selectNewProductMonth.value = data.includes(currentMonth) ? currentMonth : newProductMonthList.value[0] || data[0]
  selectNewProductOneYearMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
  // 职级提成默认展示当前月，若无则取最新
  selectJobLevelMonth.value = newProductMonthList.value.includes(currentMonth) ? currentMonth : newProductMonthList.value[0] || data[0]
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
  const currentMonth = getCurrentMonth()
  // 对于Boss角色
  if (useAclStore().getRole.includes(ROLE_BOSS_CODE)) {
    historyBossMonthList.value = data
    // Boss角色：四个卡片默认展示当前月，若无则取最新
    selectAchievedMonth.value = historyBossMonthList.value.includes(currentMonth) ? currentMonth : historyBossMonthList.value[0]
    selectFinishMonth.value = historyBossMonthList.value.includes(currentMonth) ? currentMonth : historyBossMonthList.value[0]
    selectNewProductMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
    selectNewProductOneYearMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
  } else {
    // 对于其他角色,去掉当月和之后的所有月份
    historyBossMonthList.value = data.filter((item) => item < currentMonth)
    selectAchievedMonth.value = historyBossMonthList.value[0]
    selectFinishMonth.value = historyBossMonthList.value[0]
    // 新品提成相关卡片默认展示当前月，若无则取最新
    selectNewProductMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
    selectNewProductOneYearMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
  }
  // 职级提成默认展示当前月，若无则取最新
  selectJobLevelMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
  // 个人奖金月份默认展示当前月份
  selectPersonalBonusMonth.value = data.includes(currentMonth) ? currentMonth : data[0]
}

// 获取个人奖金数据
const fetchPersonalBonus = async () => {
  if (!selectPersonalBonusMonth.value) {
    return
  }
  personalBonusLoading.value = true
  try {
    const { data } = await getFrontPagePersonalBonus({ month: selectPersonalBonusMonth.value })
    personalBonusData.value = data || []
  } catch (error) {
    console.error('获取个人奖金数据失败:', error)
    personalBonusData.value = []
  } finally {
    personalBonusLoading.value = false
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
const top50ProductLossList = ref<IGetOperationAmazonSKUList[]>([])
const top30ProductSaleLoading = ref<boolean>(false)
const fetchTop30ProductSale = async () => {
  top30ProductSaleLoading.value = true
  const { data } = await getFrontPageTop30ProductSale()
  top30ProductSaleList.value = data
  top30ProductSaleLoading.value = false
}
const fetchTop50ProductLoss = async () => {
  const { data } = await getFrontPageTop50ProductLoss({ userId: selectLossUserId.value! })
  top50ProductLossList.value = data
}
const inventoryProductsTotalValueList = ref<IGetFrontPageInventoryProductsTotalValue[]>([])
const inventoryProductsTotalValueDateRange = ref<[string, string]>(getLast90DaysStringTime())
const inventoryProductsTotalValueQueryForm = reactive({
  startDate: inventoryProductsTotalValueDateRange.value[0],
  endDate: inventoryProductsTotalValueDateRange.value[1],
})

// 仓库容量相关
const warehouseCapacityList = ref<IWarehouseCapacityItem[]>([])
const warehouseCapacityDateRange = ref<[string, string]>(getLast90DaysStringTime())
const warehouseCapacityQueryForm = reactive({
  startDate: warehouseCapacityDateRange.value[0],
  endDate: warehouseCapacityDateRange.value[1],
})
const fetchInventoryProductsTotalValue = async () => {
  const { data } = await getFrontPageInventoryProductsTotalValue({
    startDate: inventoryProductsTotalValueQueryForm.startDate,
    endDate: inventoryProductsTotalValueQueryForm.endDate,
  })
  inventoryProductsTotalValueList.value = data
}

const fetchWarehouseCapacity = async () => {
  const { data } = await getFrontPageWarehouseCapacity({
    startDate: warehouseCapacityQueryForm.startDate,
    endDate: warehouseCapacityQueryForm.endDate,
  })
  warehouseCapacityList.value = data
}
const updateInventoryProductsTotalValue = async () => {
  const { data } = await updateFrontPageInventoryProductsTotalValue()
  if (data) {
    $baseMessage('更新成功', 'success', 'hey')
    fetchInventoryProductsTotalValue()
  }
}

const updateWarehouseCapacity = async () => {
  const { data } = await updateFrontPageWarehouseCapacity()
  if (data) {
    $baseMessage('更新成功', 'success', 'hey')
    fetchWarehouseCapacity()
  }
}
// 日期选择器快捷选项
const dateShortcuts = [
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
    text: '近180天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 179)
      return [start, end]
    },
  },
  {
    text: '1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '2年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 2)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2025-09-08') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]

const inventoryProductsTotalValueDateRangeKey = ref<number>(0)
const warehouseCapacityDateRangeKey = ref<number>(0)
const handleInventoryProductsTotalValueDateRangeChange = (dateRange: [string, string] | null) => {
  inventoryProductsTotalValueDateRangeKey.value++
  if (dateRange && dateRange.length === 2) {
    inventoryProductsTotalValueQueryForm.startDate = dateRange[0]
    inventoryProductsTotalValueQueryForm.endDate = dateRange[1]
    fetchInventoryProductsTotalValue()
  } else {
    inventoryProductsTotalValueDateRange.value = getLast90DaysStringTime()
    inventoryProductsTotalValueQueryForm.startDate = inventoryProductsTotalValueDateRange.value[0]
    inventoryProductsTotalValueQueryForm.endDate = inventoryProductsTotalValueDateRange.value[1]
    fetchInventoryProductsTotalValue()
  }
}

const handleWarehouseCapacityDateRangeChange = (dateRange: [string, string] | null) => {
  warehouseCapacityDateRangeKey.value++
  if (dateRange && dateRange.length === 2) {
    warehouseCapacityQueryForm.startDate = dateRange[0]
    warehouseCapacityQueryForm.endDate = dateRange[1]
    fetchWarehouseCapacity()
  } else {
    warehouseCapacityDateRange.value = getLast90DaysStringTime()
    warehouseCapacityQueryForm.startDate = warehouseCapacityDateRange.value[0]
    warehouseCapacityQueryForm.endDate = warehouseCapacityDateRange.value[1]
    fetchWarehouseCapacity()
  }
}

const jobLevelCommissionList = ref<IGetFrontPageJobLevelCommission[]>([])
const selectJobLevelMonth = ref<string>()
const fetchJobLevelCommission = async () => {
  const { data } = await getFrontPageJobLevelCommission({ month: selectJobLevelMonth.value! })
  jobLevelCommissionList.value = data
}
const lowVolumeProductStorageFeeList = ref<ILowVolumeProductStorageFee[]>([])
const selectOperationUserId = ref<number>(-1)
const operateUserList = ref<{ id: number; label: string }[]>([])
const fetchOperateUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption({ type: 2 })
  operateUserList.value = data
  if (operateUserList.value.length > 0) {
    selectOperationUserId.value = operateUserList.value.find((item) => item.label.includes(myName))?.id || -1
  }
  if (!selectOperationUserId.value) {
    selectOperationUserId.value = operateUserList.value[0].id || -1
  }
}
const lowStorageFeeQueryForm = reactive<any>({
  pageNo: 1,
  pageSize: 50,
  id: -1,
  orderByField: 'estimateNextMonthStorageFee',
  orderDirection: 'descending',
})
const lowStorageFeeTotal = ref<number>(0)
const lowStorageFeeLoading = ref<boolean>(false)
const fetchLowVolumeProductStorageFee = async () => {
  lowStorageFeeLoading.value = true
  lowStorageFeeQueryForm.id = selectOperationUserId.value
  const { data } = await getLowVolumeProductStorageFee(lowStorageFeeQueryForm)
  lowVolumeProductStorageFeeList.value = data.list
  lowStorageFeeTotal.value = data.total
  lowStorageFeeLoading.value = false
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  if (lowStorageFeeQueryForm.orderByField === prop) {
    if (!order) {
      if (lowStorageFeeQueryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (lowStorageFeeQueryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  lowStorageFeeQueryForm.orderByField = prop
  lowStorageFeeQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  fetchLowVolumeProductStorageFee()
}
// 考勤概览-用户列表
// const attendanceUserList = ref<{ id: number; label: string }[]>([])
// const selectAttendanceUserId = ref<number>(-1)
// const fetchAttendanceUserList = async () => {
//   const { data } = await getFrontPageAttendanceUserList()
//   attendanceUserList.value = data
// }
const attendanceOverviewList = ref<IGetFrontPageAttendanceOverview[]>([])
const attendanceOverviewDateRange = ref<[string, string]>([getCurrentMonth(), getCurrentMonth()])
const attendanceOverviewDateRangeKey = ref<number>(0)
// 考勤概况排序字段和方向
const attendanceOverviewSortField = ref<string>('month')
const attendanceOverviewSortDirection = ref<string>('desc')

const fetchAttendanceOverview = async () => {
  attendanceOverviewDateRangeKey.value++
  const { data } = await getFrontPageAttendanceOverview({
    startMonth: attendanceOverviewDateRange.value[0],
    endMonth: attendanceOverviewDateRange.value[1],
    // 默认排序：月份 > 餐补次数，由后端处理
    orderByField: attendanceOverviewSortField.value,
    orderDirection: attendanceOverviewSortDirection.value,
  })
  attendanceOverviewList.value = data
}

// 考勤概况排序处理 - 由后端处理排序
const handleAttendanceOverviewSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data

  if (attendanceOverviewSortField.value === prop) {
    // 同一列，切换排序方向
    if (!order) {
      // 如果没有order，根据当前方向切换
      if (attendanceOverviewSortDirection.value === 'asc') {
        column.order = 'descending'
      } else if (attendanceOverviewSortDirection.value === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    // 切换列，默认降序
    column.order = 'descending'
  }

  attendanceOverviewSortField.value = prop
  attendanceOverviewSortDirection.value = column.order === 'ascending' ? 'asc' : 'desc'
  fetchAttendanceOverview()
}
const profitSharePreviewList = ref<IGetFrontPageProfitScoreItem[]>([])
const profitSharePreviewTotal = ref<number>(0)
// 构建一个只有本月和上月的数组
const profitSharePreviewMonthList = ref<string[]>([getCurrentMonth(), getLastMonth()])
// 初始化为当前月份，确保有值
const selectProfitSharePreviewMonth = ref<string>(getCurrentMonth())
const selectProfitSharePreviewUserId = ref<number>(-1)
const profitSharePreviewLoading = ref<boolean>(false)
const profitSharePreviewQueryForm = reactive({
  pageNo: 1,
  pageSize: 50,
})

const handleProfitSharePreviewCurrentChange = (val: number) => {
  profitSharePreviewQueryForm.pageNo = val
  fetchProfitSharePreview()
}

const handleProfitSharePreviewSizeChange = (val: number) => {
  profitSharePreviewQueryForm.pageSize = val
  fetchProfitSharePreview()
}
const fetchProfitSharePreview = async () => {
  if (!selectProfitSharePreviewMonth.value) {
    return
  }
  profitSharePreviewLoading.value = true
  const { data } = await getFrontPageProfitScore({
    month: selectProfitSharePreviewMonth.value,
    pageNo: profitSharePreviewQueryForm.pageNo,
    pageSize: profitSharePreviewQueryForm.pageSize,
    userId: selectProfitSharePreviewUserId.value,
  })
  profitSharePreviewList.value = data.list
  profitSharePreviewTotal.value = data.total
  profitSharePreviewLoading.value = false
}
const siteList = ref<{ id: number; label: string }[]>([])
const fbaSiteList = ref<{ id: number; label: string }[]>([])
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
  const siteIds = [0, 1, 2, 3, 15]
  fbaSiteList.value = data.filter((item) => siteIds.includes(item.id))
  fbaSiteList.value.unshift({ id: -1, label: '全部' })
}
onBeforeMount(async () => {
  if (ableViewPerformanceSummaryCard) {
    fetchPerformanceSummary()
  }
  await fetchBillingMonthList()
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
    await fetchAdjustDetailMonthList()
    fetchSiteList()
    fetchUserList()
     // 上新天数销售额/利润图表数据获取
     if (!siteList.value.length) {
      fetchSiteList()
    }
    fetchRankNewProductOneYearCommission()
    await fetchMonthlyProductProfit()
    await fetchMonthlyPlusAssessment()
    await fetchMonthlyMinusAssessment()
    await fetchRankOverAchieved()
    await fetchRankAssessmentFinish()
    await fetchRankNewProductCommission()
    await fetchMonthlyProductProfit()
    await fetchMonthlyPlusAssessment()
    await fetchMonthlyMinusAssessment()
    await fetchRankOverAchieved()
    await fetchRankAssessmentFinish()
    await fetchRankNewProductCommission()
    // 初始化时获取利润分成预览数据
    await fetchProfitSharePreview()
   
  }
  
  
  if (ableViewTop30ProductSaleCard) {
    fetchTop30ProductSale()
  }
  if (ableViewTop50ProductLossCard) {
    fetchSiteList()
    await fetchLossUserList()
    await fetchTop50ProductLoss()
  }
  if (ableBossViewCard) {
    fetchOperateUserList()
    fetchInventoryProductsTotalValue()
  }
  if (ableViewWarehouseCapacityCard) {
    fetchWarehouseCapacity()
  }
  if (ableViewDestroyValueCard) {
    fetchDestroyValue()
  }
  if (ableProductManagerLeadViewCard) {
    fetchLeadDestroyValue()
    fetchJobLevelCommission()
  }
  if (ableViewLowVolumeProductStorageFeeCard) {
    await fetchOperateUserList()
    await fetchLowVolumeProductStorageFee()
  }
  if (ableViewAttendanceOverviewCard) {
    fetchAttendanceOverview()
  }
  if (selectPersonalBonusMonth.value) {
    fetchPersonalBonus()
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
