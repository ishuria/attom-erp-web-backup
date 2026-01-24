<template>
  <div class="operation-bonus-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <!-- ASIN汇总 -->
      <el-tab-pane label="ASIN汇总" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select v-model="asinSummaryQueryForm.userId" filterable placeholder="全部" @change="queryAsinSummaryData">
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="asinSummaryQueryForm.month" placeholder="请选择月份" @change="queryAsinSummaryData">
                  <el-option v-for="item in monthOption" :key="item.id" :label="item.label" :value="item.label" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="asinSummaryQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="asinSummaryQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryAsinSummaryData"
                  @keyup.enter="queryAsinSummaryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryAsinSummaryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="asinSummaryList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="月份" min-width="100" prop="month" />
          <el-table-column label="人员" min-width="100" prop="userName" />
          <el-table-column label="广告花费" min-width="120" prop="adSpend">
            <template #default="{ row }">
              {{ row.adSpend ? '$' + row.adSpend : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售额" min-width="130" prop="adSales">
            <template #default="{ row }">
              {{ row.adSales ? '$' + row.adSales : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总销售额" min-width="120" prop="totalSales">
            <template #default="{ row }">
              {{ row.totalSales ? '$' + row.totalSales : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总毛利润" min-width="120" prop="totalGrossProfit">
            <template #default="{ row }">
              {{ row.totalGrossProfit ? '$' + row.totalGrossProfit : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="ACOS" min-width="100" prop="acos">
            <template #default="{ row }">
              {{ row.acos ? row.acos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="TACOS" min-width="100" prop="tacos">
            <template #default="{ row }">
              {{ row.tacos ? row.tacos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售占比" min-width="140" prop="adSalesRatio">
            <template #default="{ row }">
              {{ row.adSalesRatio ? row.adSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总库存" min-width="100" prop="totalInventory" />
          <el-table-column label="冗余库存" min-width="120" prop="redundantInventory" />
          <el-table-column label="冗余库存占比" min-width="150" prop="redundantInventoryRatio">
            <template #default="{ row }">
              {{ row.redundantInventoryRatio ? row.redundantInventoryRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="低动销库存" min-width="130" prop="lowTurnoverInventory" />
          <el-table-column label="低动销占比" min-width="120" prop="lowTurnoverRatio">
            <template #default="{ row }">
              {{ row.lowTurnoverRatio ? row.lowTurnoverRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="高库龄库存" min-width="130" prop="highAgeInventory" />
          <el-table-column label="高库龄占比" min-width="120" prop="highAgeRatio">
            <template #default="{ row }">
              {{ row.highAgeRatio ? row.highAgeRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="未发库存" min-width="100" prop="unsentInventory" />
          <el-table-column label="未发库存占比" min-width="140" prop="unsentInventoryRatio">
            <template #default="{ row }">
              {{ row.unsentInventoryRatio ? row.unsentInventoryRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="不可售产品销量占比" min-width="180" prop="unsaleableProductSalesRatio">
            <template #default="{ row }">
              {{ row.unsaleableProductSalesRatio ? row.unsaleableProductSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="考核指标不达标调整" min-width="180" prop="kpiUnqualifiedAdjustment">
            <template #default="{ row }">
              {{ row.kpiUnqualifiedAdjustment ? row.kpiUnqualifiedAdjustment + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="handleAsinDetail(row)">详情</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="asinSummaryQueryForm.pageNo"
          :page-size="asinSummaryQueryForm.pageSize"
          :total="asinSummaryTotal"
          @current-change="handleAsinSummaryCurrentChange"
          @size-change="handleAsinSummarySizeChange"
        />
      </el-tab-pane>

      <!-- ASIN明细 -->
      <el-tab-pane label="ASIN明细" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select v-model="asinDetailQueryForm.userId" filterable placeholder="全部" @change="queryAsinDetailData">
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="asinDetailQueryForm.month" placeholder="请选择月份" @change="queryAsinDetailData">
                  <el-option v-for="item in monthOption" :key="item.id" :label="item.label" :value="item.label" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="asinDetailQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="asinDetailQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryAsinDetailData"
                  @keyup.enter="queryAsinDetailData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryAsinDetailData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="asinDetailList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="月份" min-width="100" prop="reportDate" />
          <el-table-column label="人员" min-width="100" prop="userName" />
          <el-table-column label="图片" min-width="100" prop="imageUrl">
            <template #default="{ row }">
              <el-image
                v-if="row.imageUrl"
                fit="cover"
                :preview-src-list="[row.imageUrl]"
                :src="row.imageUrl"
                style="width: 60px; height: 60px"
              />
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="140" prop="asin" />
          <el-table-column label="站点" min-width="100" prop="site" />
          <el-table-column label="广告花费" min-width="120" prop="adSpend">
            <template #default="{ row }">
              {{ row.adSpend ? '$' + row.adSpend : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售额" min-width="130" prop="adSales">
            <template #default="{ row }">
              {{ row.adSales ? '$' + row.adSales : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总销售额" min-width="120" prop="totalSales">
            <template #default="{ row }">
              {{ row.totalSales ? '$' + row.totalSales : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总毛利润" min-width="120" prop="totalGrossProfit">
            <template #default="{ row }">
              {{ row.totalGrossProfit ? '$' + row.totalGrossProfit : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="ACOS" min-width="100" prop="acos">
            <template #default="{ row }">
              {{ row.acos ? row.acos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="TACOS" min-width="100" prop="tacos">
            <template #default="{ row }">
              {{ row.tacos ? row.tacos + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="广告销售占比" min-width="140" prop="adSalesRatio">
            <template #default="{ row }">
              {{ row.adSalesRatio ? row.adSalesRatio + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="总可售天数" min-width="130" prop="totalSellableDays" />
          <el-table-column label="冗余库存" min-width="120" prop="redundantInventory" />
          <el-table-column label="低动销" min-width="100" prop="lowTurnoverQty" />
          <el-table-column label="总库存" min-width="100" prop="totalInventory" />
          <el-table-column label="高库龄库存" min-width="130" prop="oldAgeInventory" />
          <el-table-column label="未发库存" min-width="100" prop="unshippedInventory" />
          <el-table-column label="不可售" min-width="100" prop="unsellableStatusQty">
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
          :current-page="asinDetailQueryForm.pageNo"
          :page-size="asinDetailQueryForm.pageSize"
          :total="asinDetailTotal"
          @current-change="handleAsinDetailCurrentChange"
          @size-change="handleAsinDetailSizeChange"
        />
      </el-tab-pane>

      <!-- 运营奖金明细 -->
      <el-tab-pane label="运营奖金明细" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select v-model="bonusDetailQueryForm.userId" filterable placeholder="全部" @change="queryBonusDetailData">
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
                  <el-option v-for="item in monthOption" :key="item.id" :label="item.label" :value="item.label" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-text style="margin-left: 10px">提成总金额：</el-text>
                <el-text type="success">{{ bonus }}元</el-text>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px" type="info">(更新时间：{{ updateDate }})</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="bonusDetailQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="bonusDetailQueryForm.keyWord"
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
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="月份" min-width="100" prop="month" />
          <el-table-column label="人员" min-width="100" prop="userName" />
          <el-table-column label="图片" min-width="100" prop="imgUrl">
            <template #default="{ row }">
              <el-image
                v-if="row.imgUrl"
                fit="cover"
                :preview-src-list="[row.imgUrl]"
                :src="row.imgUrl"
                style="width: 60px; height: 60px"
              />
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="140" prop="asin" />
          <el-table-column label="站点" min-width="100" prop="site" />
          <el-table-column label="提成" min-width="100" prop="price">
            <template #default="{ row }">
              {{ row.price ? '$' + row.price : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="实际提成比例" min-width="140" prop="actualProportion">
            <template #default="{ row }">
              {{ row.actualProportion ? row.actualProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="职级提成比例" min-width="140" prop="originProportion">
            <template #default="{ row }">
              {{ row.originProportion ? row.originProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="指标不达标调整" min-width="180" prop="adjustProportion">
            <template #default="{ row }">
              {{ row.adjustProportion !== undefined ? row.adjustProportion + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="净利润" min-width="120" prop="profitGross">
            <template #default="{ row }">
              {{ row.profitGross ? '$' + row.profitGross : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="销售额" min-width="100" prop="totalSalesAmount">
            <template #default="{ row }">
              {{ row.totalSalesAmount ? '$' + row.totalSalesAmount : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="净利率" min-width="100" prop="netProfitMargin">
            <template #default="{ row }">
              {{ row.netProfitMargin ? row.netProfitMargin + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="汇率" min-width="100" prop="avgRate" />
          <el-table-column label="老品净利润" min-width="120" prop="oldProfitGross">
            <template #default="{ row }">
              {{ row.oldProfitGross ? '$' + row.oldProfitGross : '-' }}
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

    <!-- 考核指标详情 -->
    <performance-indicator-details v-model="performanceIndicatorDetailsVisible" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { getSeasonalCoefficientSiteList } from '~/src/api/devlocal/seasonalCoefficient'
import { useAclStore } from '~/src/store/modules/acl'
import { useUserStore } from '~/src/store/modules/user'
import {
  getOperationBonusAsinDetailList,
  getOperationBonusAsinSummaryList,
  getOperationBonusDetailList,
  getUserPersonLevelDropdownList,
} from '/@/api/devlocal/commission'

defineOptions({
  name: 'CommissionOperationDetails',
})

const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)

// 考核指标
const performanceIndicatorDetailsVisible = ref<boolean>(false)
// ASIN明细
const asinDetailQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
  site: -1,
  month: '',
})
const asinDetailList = ref<any[]>([])
const asinDetailTotal = ref<number>(0)

// ASIN汇总
const asinSummaryQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
  month: '',
})
const asinSummaryList = ref<any[]>([])
const asinSummaryTotal = ref<number>(0)

// 运营奖金明细
const bonusDetailQueryForm = reactive({
  userId: -1,
  site: -1,
  month: '2025-12',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const bonusDetailList = ref<any[]>([])
const bonusDetailTotal = ref<number>(0)

// ============ ASIN明细方法 ============
const queryAsinDetailData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOperationBonusAsinDetailList(asinDetailQueryForm)
    asinDetailList.value = data.list || []
    asinDetailTotal.value = data.total || 0
  } catch (error) {
    console.error('查询ASIN明细失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const handleAsinDetailCurrentChange = (val: number) => {
  asinDetailQueryForm.pageNo = val
  queryAsinDetailData()
}

const handleAsinDetailSizeChange = (val: number) => {
  asinDetailQueryForm.pageSize = val
  asinDetailQueryForm.pageNo = 1
  queryAsinDetailData()
}

// ============ ASIN汇总方法 ============
const handleAsinDetail = (row: any) => {
  performanceIndicatorDetailsVisible.value = true
}
const queryAsinSummaryData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOperationBonusAsinSummaryList(asinSummaryQueryForm)
    asinSummaryList.value = data.list || []
    asinSummaryTotal.value = data.total || 0
  } catch (error) {
    console.error('查询ASIN汇总失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const handleAsinSummaryCurrentChange = (val: number) => {
  asinSummaryQueryForm.pageNo = val
  queryAsinSummaryData()
}

const handleAsinSummarySizeChange = (val: number) => {
  asinSummaryQueryForm.pageSize = val
  asinSummaryQueryForm.pageNo = 1
  queryAsinSummaryData()
}

// ============ 运营奖金明细方法 ============
const queryBonusDetailData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOperationBonusDetailList(bonusDetailQueryForm)
    bonusDetailList.value = data.list || []
    bonusDetailTotal.value = data.total || 0
    bonus.value = data.totalPrice
  } catch (error) {
    console.error('查询运营奖金明细失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
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

// ============ Tab切换 ============
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === 0) {
    queryAsinSummaryData()
  } else if (tab.props.name === 1) {
    queryAsinDetailData()
  } else if (tab.props.name === 2) {
    queryBonusDetailData()
  }
}
// 当前角色名
const currentRoleCode = useAclStore().getRole[0]
// 当前用户名
const userName = useUserStore().getUsername
// 提成总金额
const bonus = ref<number>(0)
// 更新时间
const updateDate = ref<string | undefined>('')
// 站点筛选
const siteList = ref<{ id: number; label: string }[]>([])
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
}

// 人员筛选
const userLevelList = ref<{ id: number; label: string }[]>([])
const fetchUserLevelList = async () => {
  const { data } = await getUserPersonLevelDropdownList()
  userLevelList.value = data
  bonusDetailQueryForm.userId = userLevelList.value.find((item) => item.label.includes(userName!))?.id || -1
}
// 月份筛选
const monthOption = ref<{ id: number; label: string }[]>([])
onBeforeMount(() => {
  fetchSiteList()
  fetchUserLevelList()
  queryAsinSummaryData()
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

        // .vab-query-form {
        //   .el-form {
        //     .el-form-item:first-child {
        //       .el-check-tag,
        //       .el-form-item__label {
        //         margin: 0 10px 5px 0;
        //         border-radius: 99px;
        //       }
        //     }
        //   }
        // }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
</style>
