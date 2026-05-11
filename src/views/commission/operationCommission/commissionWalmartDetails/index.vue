<template>
  <div class="operation-bonus-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="汇总" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select
                  v-model="summaryQueryForm.userId"
                  :disabled="userSelectDisabled"
                  filterable
                  placeholder="全部"
                  @change="querySummaryData"
                >
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="summaryQueryForm.month" placeholder="请选择月份" @change="querySummaryData">
                  <el-option v-for="item in summaryMonthOption" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>

              <el-form-item label="币种">
                <el-select v-model="summaryQueryForm.currency" clearable placeholder="请选择币种" @change="changeSummaryCurrency">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="summaryQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="summaryQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="querySummaryData"
                  @keyup.enter="querySummaryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="querySummaryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="cellStyle"
          :data="summaryList"
          :default-sort="{ prop: 'adSpend', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleSummarySortChange"
        >
          <el-table-column fixed="left" label="月份" min-width="100" prop="month" />
          <el-table-column fixed="left" label="人员" min-width="100" prop="userName" />
          <el-table-column label="提成" min-width="150" prop="commissionPrice">
            <template #default="{ row }">
              {{ row.commissionPrice ? '￥' + formatAmount(row.commissionPrice) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="实际提成比例" min-width="150" prop="actualProportion">
            <template #default="{ row }">
              {{ row.actualProportion ? row.actualProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="职级提成比例" min-width="150" prop="proportion">
            <template #default="{ row }">
              {{ row.proportion ? row.proportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="考核指标不达标调整" min-width="190" prop="kpiUnqualifiedAdjustment" sortable="custom">
            <template #default="{ row }">
              {{ row.kpiUnqualifiedAdjustment ? row.kpiUnqualifiedAdjustment + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总销售额" min-width="140" prop="totalSales" sortable>
            <template #default="{ row }">
              {{ row.totalSales ? row.currencyIcon + formatAmount(row.totalSales) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="利润报表毛利" min-width="150" prop="totalGrossProfit" sortable>
            <template #default="{ row }">
              {{ row.totalGrossProfit ? row.currencyIcon + formatAmount(row.totalGrossProfit) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="利润报表销售额" min-width="160" prop="totalGrossProfitSalesAmount" sortable>
            <template #default="{ row }">
              {{ row.totalGrossProfitSalesAmount ? row.currencyIcon + formatAmount(row.totalGrossProfitSalesAmount) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率" min-width="100" prop="totalGrossProfitMargin" sortable="custom">
            <template #default="{ row }">
              {{ row.totalGrossProfitMargin ? row.totalGrossProfitMargin + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告花费" min-width="140" prop="adSpend" sortable>
            <template #default="{ row }">
              {{ row.adSpend ? row.currencyIcon + formatAmount(row.adSpend) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="ACOS" min-width="100" prop="acos" sortable="custom">
            <template #default="{ row }">
              {{ row.acos ? row.acos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="TACOS" min-width="110" prop="tacos" sortable="custom">
            <template #default="{ row }">
              {{ row.tacos ? row.tacos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售占比" min-width="150" prop="adSalesRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.adSalesRatio ? row.adSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总库存" min-width="100" prop="totalInventory" sortable="custom" />
          <el-table-column label="冗余库存" min-width="120" prop="redundantInventory" sortable="custom" />
          <el-table-column label="冗余库存占比" min-width="150" prop="redundantInventoryRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.redundantInventoryRatio ? row.redundantInventoryRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="低动销库存" min-width="130" prop="lowTurnoverInventory" sortable="custom" />
          <el-table-column label="低动销占比" min-width="130" prop="lowTurnoverRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.lowTurnoverRatio ? row.lowTurnoverRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="高库龄库存" min-width="130" prop="highAgeInventory" sortable="custom" />
          <el-table-column label="高库龄占比" min-width="130" prop="highAgeRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.highAgeRatio ? row.highAgeRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="未发库存" min-width="120" prop="unsentInventory" sortable="custom" />
          <el-table-column label="未发库存占比" min-width="150" prop="unsentInventoryRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.unsentInventoryRatio ? row.unsentInventoryRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="不可售产品销量占比" min-width="190" prop="unsaleableProductSalesRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.unsaleableProductSalesRatio ? row.unsaleableProductSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="新认领产品数" min-width="120" prop="claimAsinCount" />
          <el-table-column fixed="right" label="操作" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="handleSummaryDetail(row)">详情</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="summaryQueryForm.pageNo"
          :page-size="summaryQueryForm.pageSize"
          :total="summaryTotal"
          @current-change="handleSummaryCurrentChange"
          @size-change="handleSummarySizeChange"
        />
      </el-tab-pane>

      <el-tab-pane label="明细" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select
                  v-model="detailQueryForm.userId"
                  :disabled="userSelectDisabled"
                  filterable
                  placeholder="全部"
                  @change="queryDetailData"
                >
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="detailQueryForm.month" placeholder="请选择月份" @change="queryDetailData">
                  <el-option v-for="item in detailMonthOption" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>

              <el-form-item label="币种">
                <el-select v-model="detailQueryForm.currency" clearable placeholder="请选择币种" @change="changeDetailCurrency">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="detailQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="detailQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryDetailData"
                  @keyup.enter="queryDetailData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryDetailData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="detailList"
          :default-sort="{ prop: 'adSpend', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleDetailSortChange"
        >
          <el-table-column fixed="left" label="月份" min-width="100" prop="reportDate" />
          <el-table-column fixed="left" label="人员" min-width="100" prop="userName" />
          <el-table-column label="图片" min-width="100" prop="imageUrl">
            <template #default="{ row }">
              <el-image
                v-if="row.imageUrl"
                fit="cover"
                :src="row.imageUrl"
                style="width: 60px; height: 60px"
                @click="imagePreviewShow(row.imageUrl)"
              />
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="flexColumnWidth(detailList, 'SKU', 'sku')" prop="sku" />
          <el-table-column label="Item ID" min-width="140" prop="itemId" />
          <el-table-column label="站点" min-width="135" prop="site" />
          <el-table-column label="运营分类" min-width="120" prop="operationTypeName">
            <template #default="{ row }">
              {{ row.operationTypeName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告花费" min-width="130" prop="adSpend" sortable="custom">
            <template #default="{ row }">
              {{ row.adSpend ? row.currencyIcon + formatAmount(row.adSpend) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售额" min-width="130" prop="adSales" sortable="custom">
            <template #default="{ row }">
              {{ row.adSales ? row.currencyIcon + formatAmount(row.adSales) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总销售额" min-width="120" prop="totalSales" sortable="custom">
            <template #default="{ row }">
              {{ row.totalSales ? row.currencyIcon + formatAmount(row.totalSales) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总毛利润" min-width="150" prop="totalGrossProfit" sortable="custom">
            <template #default="{ row }">
              <div>{{ row.totalGrossProfit ? row.currencyIcon + formatAmount(row.totalGrossProfit) : '-' }}</div>
              <div v-if="row.totalGrossProfitMomRatio != null" :style="momStyle(row.totalGrossProfitMomRatio)">
                {{ formatMomRatio(row.totalGrossProfitMomRatio) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="利润报表销售额" min-width="170" prop="totalSalesAmount" sortable="custom">
            <template #default="{ row }">
              <div>{{ row.totalSalesAmount ? row.currencyIcon + formatAmount(row.totalSalesAmount) : '-' }}</div>
              <div v-if="row.totalSalesAmountMomRatio != null" :style="momStyle(row.totalSalesAmountMomRatio)">
                {{ formatMomRatio(row.totalSalesAmountMomRatio) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="ACOS" min-width="100" prop="acos" sortable="custom">
            <template #default="{ row }">
              {{ row.acos ? row.acos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="TACOS" min-width="110" prop="tacos" sortable="custom">
            <template #default="{ row }">
              {{ row.tacos ? row.tacos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售占比" min-width="150" prop="adSalesRatio" sortable="custom">
            <template #default="{ row }">
              {{ row.adSalesRatio ? row.adSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总可售天数" min-width="130" prop="totalSellableDays" sortable="custom" />
          <el-table-column label="冗余库存" min-width="120" prop="redundantInventoryCount" sortable="custom" />
          <el-table-column label="低动销" min-width="100" prop="lowTurnoverQty" sortable="custom" />
          <el-table-column label="总库存" min-width="100" prop="totalInventory" sortable="custom" />
          <el-table-column label="高库龄库存" min-width="130" prop="oldAgeInventory" sortable="custom" />
          <el-table-column label="未发库存" min-width="120" prop="unshippedInventory" sortable="custom" />
          <el-table-column label="不可售" min-width="100" prop="unsellableStatusQty" sortable="custom">
            <template #default="{ row }">
              <vab-icon
                v-if="row.unsellableStatusQty === 0"
                icon="checkbox-circle-fill"
                style="color: var(--el-color-success); font-size: 23px"
              />
              <span v-else-if="row.unsellableStatusQty === 1"></span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="detailQueryForm.pageNo"
          :page-size="detailQueryForm.pageSize"
          :total="detailTotal"
          @current-change="handleDetailCurrentChange"
          @size-change="handleDetailSizeChange"
        />
      </el-tab-pane>

      <el-tab-pane label="运营奖金明细" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select
                  v-model="bonusDetailQueryForm.userId"
                  :disabled="userSelectDisabled"
                  filterable
                  placeholder="全部"
                  @change="queryBonusDetailData"
                >
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="站点">
                <el-select v-model="bonusDetailQueryForm.site" placeholder="请选择站点" @change="queryBonusDetailData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="发放月份">
                <el-select v-model="bonusDetailQueryForm.month" placeholder="请选择发放月份" @change="queryBonusDetailData">
                  <el-option v-for="item in bonusMonthOption" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-text style="margin-left: 10px">提成总金额：</el-text>
                <el-text type="success">{{ bonus }}元</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="bonusDetailQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="bonusDetailQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryBonusDetailData"
                  @keyup.enter="queryBonusDetailData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryBonusDetailData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="bonusDetailList"
          :default-sort="{ prop: 'price', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleBonusDetailSortChange"
        >
          <el-table-column fixed="left" label="月份" min-width="100" prop="month" />
          <el-table-column fixed="left" label="人员" min-width="100" prop="userName" />
          <el-table-column label="图片" min-width="100" prop="imgUrl">
            <template #default="{ row }">
              <el-image
                v-if="row.imgUrl"
                fit="cover"
                :src="row.imgUrl"
                style="width: 60px; height: 60px"
                @click="imagePreviewShow(row.imgUrl)"
              />
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="flexColumnWidth(bonusDetailList, 'SKU', 'sku')" prop="sku" />
          <el-table-column label="Item ID" min-width="140" prop="itemId" />
          <el-table-column label="站点" min-width="125" prop="site" />
          <el-table-column label="提成" min-width="100" prop="price" sortable="custom">
            <template #default="{ row }">
              {{ row.price ? '¥' + row.price : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="实际提成比例" min-width="150" prop="actualProportion" sortable="custom">
            <template #default="{ row }">
              {{ row.actualProportion ? row.actualProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="职级提成比例" min-width="150" prop="originProportion" sortable="custom">
            <template #default="{ row }">
              {{ row.originProportion ? row.originProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="小类排名额外比例" min-width="150" prop="minorCategoryProportion">
            <template #default="{ row }">
              {{ row.minorCategoryProportion != null ? row.minorCategoryProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="指标不达标调整" min-width="180" prop="adjustProportion" sortable="custom">
            <template #default="{ row }">
              {{ row.adjustProportion !== undefined ? row.adjustProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="净利润" min-width="120" prop="profitGross" sortable="custom">
            <template #default="{ row }">
              <el-popover v-if="row.oldProfitGross != null" effect="dark" placement="top" trigger="hover" width="auto">
                <template #default>
                  <div>提成净利润=当月净利润-(1+x%)*max(0, 认领时上一个该月的利润)</div>

                  <div>
                    {{ row.currencyIcon + formatAmount(row.profitGross) }} = {{ row.currencyIcon }}{{ row.profitMargin }} - (1+
                    {{ row.promptProportion }}%) * max(0, {{ row.currencyIcon }}{{ row.oldProfitGross }})
                  </div>
                </template>
                <template #reference>
                  <span class="questionIcon">
                    <span>{{ row.currencyIcon + formatAmount(row.profitGross) }}</span>
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </span>
                </template>
              </el-popover>
              <div v-else>{{ row.profitGross ? row.currencyIcon + formatAmount(row.profitGross) : '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="销售额" min-width="100" prop="totalSalesAmount" sortable="custom">
            <template #default="{ row }">
              {{ row.totalSalesAmount ? row.currencyIcon + formatAmount(row.totalSalesAmount) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="净利率" min-width="100" prop="netProfitMargin" sortable="custom">
            <template #default="{ row }">
              {{ row.netProfitMargin ? row.netProfitMargin + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="汇率" min-width="100" prop="avgRate" sortable="custom" />
          <el-table-column label="平均小类排名" min-width="140" prop="averageSubcategoryRanking">
            <template #default="{ row }">
              {{ row.averageSubcategoryRanking ?? '-' }}
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="bonusDetailQueryForm.pageNo"
          :page-size="bonusDetailQueryForm.pageSize"
          :total="bonusDetailTotal"
          @current-change="handleBonusDetailCurrentChange"
          @size-change="handleBonusDetailSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <performance-indicator-details v-model="performanceIndicatorDetailsVisible" v-model:indicator-list="indicatorList" />

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { flexColumnWidth } from '~/src/utils/tableColum'
import {
  getAsinSummaryIndicator,
  getAsinSummaryMonthList,
  getCurrencyOperationWalmartDetail,
  getCurrencyOperationWalmartSummary,
  getOperationBonusAsinSummaryList,
  getOperationBonusWalmartCommissionDetailList,
  getOperationBonusWalmartDetailList,
  getWalmartDetailMonthList,
  getWalmartOperationSiteList,
  updateCurrencyOperationWalmartDetail,
  updateCurrencyOperationWalmartSummary,
} from '/@/api/devlocal/commission'
import { getOperationUserListByPlatform } from '/@/api/devlocal/frontPage'
import { getCurrencyList } from '/@/api/devlocal/productPerformance'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import { Walmart } from '/@/type/storeOperation/platform.ts'
import { formatAmount } from '/@/utils/convertToCamelCase'

defineOptions({
  name: 'CommissionWalmartDetails',
})

const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const userSelectDisabled = ref<boolean>(true)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])

const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const performanceIndicatorDetailsVisible = ref<boolean>(false)
const indicatorList = ref<any[]>([])
const fetchIndicatorList = async (id: number) => {
  try {
    const { data } = await getAsinSummaryIndicator({ id })
    indicatorList.value = data || []
  } catch (error) {
    console.error('获取考核指标详情失败:', error)
    $baseMessage('获取考核指标详情失败，请重试', 'error')
  }
}

const summaryQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
  month: '',
  orderByField: 'adSpend',
  orderDirection: 'descending',
  currency: -1,
  platformCode: Walmart,
})
const summaryList = ref<any[]>([])
const summaryTotal = ref<number>(0)

const detailQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
  month: '',
  orderByField: 'adSpend',
  orderDirection: 'descending',
  currency: -1,
})
const detailList = ref<any[]>([])
const detailTotal = ref<number>(0)

const bonusDetailQueryForm = reactive({
  userId: -1,
  site: -1,
  month: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  orderByField: 'price',
  orderDirection: 'descending',
})
const bonusDetailList = ref<any[]>([])
const bonusDetailTotal = ref<number>(0)
const bonus = ref<number>(0)

const currentRoleCode = useAclStore().getRole[0]
const userName = useUserStore().getUsername

const siteList = ref<{ id: number; label: string }[]>([])
const userLevelList = ref<{ id: number; label: string }[]>([])
const summaryMonthOption = ref<string[]>([])
const detailMonthOption = ref<string[]>([])
const bonusMonthOption = ref<string[]>([])
const currencyList = ref<{ id: number; label: string }[]>([])

const resolveSort = (queryForm: { orderByField: string; orderDirection: string }, data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  queryForm.orderByField = prop
  if (!order) {
    if (queryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (queryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
}

const querySummaryData = async () => {
  listLoading.value = true
  try {
    summaryQueryForm.platformCode = Walmart
    const { data } = await getOperationBonusAsinSummaryList(summaryQueryForm)
    summaryList.value = data.list || []
    summaryTotal.value = data.total || 0
  } catch (error) {
    console.error('查询Walmart汇总失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const changeSummaryCurrency = async () => {
  const { data } = await updateCurrencyOperationWalmartSummary({
    currency: summaryQueryForm.currency,
  })
  if (data) {
    querySummaryData()
  }
}

const fetchSummaryCurrency = async () => {
  const { data } = await getCurrencyOperationWalmartSummary()
  summaryQueryForm.currency = data
  if (data == null) {
    summaryQueryForm.currency = -1
  }
}

const handleSummaryDetail = async (row: any) => {
  await fetchIndicatorList(row.id)
  performanceIndicatorDetailsVisible.value = true
}

const handleSummarySortChange = (data: { column: any; prop: string; order: any }) => {
  resolveSort(summaryQueryForm, data)
  querySummaryData()
}
const handleSummaryCurrentChange = (val: number) => {
  summaryQueryForm.pageNo = val
  querySummaryData()
}
const handleSummarySizeChange = (val: number) => {
  summaryQueryForm.pageSize = val
  summaryQueryForm.pageNo = 1
  querySummaryData()
}

const queryDetailData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOperationBonusWalmartDetailList(detailQueryForm)
    detailList.value = data.list || []
    detailTotal.value = data.total || 0
  } catch (error) {
    console.error('查询Walmart明细失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const changeDetailCurrency = async () => {
  const { data } = await updateCurrencyOperationWalmartDetail({
    currency: detailQueryForm.currency,
  })
  if (data) {
    queryDetailData()
  }
}

const fetchDetailCurrency = async () => {
  const { data } = await getCurrencyOperationWalmartDetail()
  detailQueryForm.currency = data
  if (data == null) {
    detailQueryForm.currency = -1
  }
}

const handleDetailSortChange = (data: { column: any; prop: string; order: any }) => {
  resolveSort(detailQueryForm, data)
  queryDetailData()
}
const handleDetailCurrentChange = (val: number) => {
  detailQueryForm.pageNo = val
  queryDetailData()
}
const handleDetailSizeChange = (val: number) => {
  detailQueryForm.pageSize = val
  detailQueryForm.pageNo = 1
  queryDetailData()
}

const queryBonusDetailData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOperationBonusWalmartCommissionDetailList(bonusDetailQueryForm)
    bonusDetailList.value = data.list || []
    bonusDetailTotal.value = data.total || 0
    bonus.value = data.totalPrice || 0
  } catch (error) {
    console.error('查询Walmart运营奖金明细失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const handleBonusDetailSortChange = (data: { column: any; prop: string; order: any }) => {
  resolveSort(bonusDetailQueryForm, data)
  queryBonusDetailData()
}
const handleBonusDetailCurrentChange = (val: number) => {
  bonusDetailQueryForm.pageNo = val
  queryBonusDetailData()
}
const handleBonusDetailSizeChange = (val: number) => {
  bonusDetailQueryForm.pageSize = val
  bonusDetailQueryForm.pageNo = 1
  queryBonusDetailData()
}

/** 环比百分比文案：>0 显示 ↑、<0 显示 ↓、=0 显示 0% */
const formatMomRatio = (val: number): string => {
  if (val > 0) return `↑ ${val}%`
  if (val < 0) return `↓ ${Math.abs(val)}%`
  return `0%`
}

/** 环比百分比颜色：正绿、负红、零灰；统一 12px 小号字 */
const momStyle = (val: number): CSSProperties => {
  let color = 'var(--el-text-color-secondary)'
  if (val > 0) color = 'var(--el-color-success)'
  else if (val < 0) color = 'var(--el-color-danger)'
  return { fontSize: '12px', color, marginTop: '2px' }
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const flag = data.row.flag || {}
  if (label === 'ACOS') {
    return { textAlign: 'center', color: flag.acosFlag ? 'var(--el-color-success)' : 'var(--el-color-danger)' }
  }
  if (label === 'TACOS') {
    return { textAlign: 'center', color: flag.tacosFlag ? 'var(--el-color-success)' : 'var(--el-color-danger)' }
  }
  if (label === '广告销售占比') {
    return { textAlign: 'center', color: flag.adSalesRatioFlag ? 'var(--el-color-success)' : 'var(--el-color-danger)' }
  }
  if (label === '冗余库存占比') {
    return { textAlign: 'center', color: flag.redundantInventoryRatioFlag ? 'var(--el-color-success)' : 'var(--el-color-danger)' }
  }
  if (label === '低动销占比') {
    return { textAlign: 'center', color: flag.lowTurnoverRatioFlag ? 'var(--el-color-success)' : 'var(--el-color-danger)' }
  }
  return { textAlign: 'center' }
}

const handleTabClick = async (tab: TabsPaneContext) => {
  if (tab.props.name === 0) {
    await fetchSummaryCurrency()
    await querySummaryData()
  } else if (tab.props.name === 1) {
    await fetchDetailCurrency()
    await queryDetailData()
  } else if (tab.props.name === 2) {
    await queryBonusDetailData()
  }
}

const fetchSiteList = async () => {
  const { data } = await getWalmartOperationSiteList()
  siteList.value = data || []
  siteList.value.unshift({ id: -1, label: '全部' })
}

const fetchUserLevelList = async () => {
  const { data } = await getOperationUserListByPlatform(Walmart)
  userLevelList.value = data || []
  userLevelList.value.unshift({ id: -1, label: '全部' })

  if (currentRoleCode === ROLE_BOSS_CODE) {
    userSelectDisabled.value = false
    bonusDetailQueryForm.userId = -1
  } else {
    bonusDetailQueryForm.userId = userLevelList.value.find((item) => item.label.includes(userName!))?.id || -1
  }

  detailQueryForm.userId = bonusDetailQueryForm.userId
  summaryQueryForm.userId = bonusDetailQueryForm.userId
}

const fetchSummaryMonthList = async () => {
  const { data } = await getAsinSummaryMonthList(Walmart)
  summaryMonthOption.value = data
  summaryQueryForm.month = data?.[0] || ''
}

const fetchDetailMonthList = async () => {
  const { data } = await getWalmartDetailMonthList()
  detailMonthOption.value = data
  bonusMonthOption.value = data
  detailQueryForm.month = data?.[0] || ''
  bonusDetailQueryForm.month = data?.[0] || ''
}

const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data || []
  currencyList.value.unshift({ id: -1, label: '原币种' })
}

onBeforeMount(async () => {
  await fetchUserLevelList()
  await fetchSummaryMonthList()
  await fetchCurrencyList()
  await fetchSummaryCurrency()
  await querySummaryData()
  await fetchDetailMonthList()
  await fetchSiteList()
})
</script>

<style lang="scss" scoped>
.operation-bonus-container {
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

        .el-table {
          flex: 1;
        }
      }
    }
  }
}

.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
    color: var(--el-color-primary);
  }
}
</style>
