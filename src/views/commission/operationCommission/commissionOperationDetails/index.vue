<template>
  <div class="operation-bonus-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <!-- ASIN汇总 -->
      <el-tab-pane label="ASIN汇总" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="人员">
                <el-select
                  v-model="asinSummaryQueryForm.userId"
                  :disabled="userSelectDisabled"
                  filterable
                  placeholder="全部"
                  @change="queryAsinSummaryData"
                >
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="asinSummaryQueryForm.month" placeholder="请选择月份" @change="queryAsinSummaryData">
                  <el-option v-for="item in asinSummaryMonthOption" :key="item.id" :label="item.label" :value="item.label" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="asinSummaryQueryForm.currency" clearable placeholder="请选择币种" @change="changeAsinSummaryHandler">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
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
          :cell-style="cellStyle"
          :data="asinSummaryList"
          :default-sort="{ prop: 'adSpend', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleAsinSummarySortChange"
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
          <!-- <el-table-column label="广告销售额" min-width="130" prop="adSales" sortable="custom">
            <template #default="{ row }">
              {{ row.adSales ? '$' + row.adSales : '-' }}
            </template>
          </el-table-column> -->
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
                <el-select
                  v-model="asinDetailQueryForm.userId"
                  :disabled="userSelectDisabled"
                  filterable
                  placeholder="全部"
                  @change="queryAsinDetailData"
                >
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="月份">
                <el-select v-model="asinDetailQueryForm.month" placeholder="请选择月份" @change="queryAsinDetailData">
                  <el-option v-for="item in asinDetailMonthOption" :key="item.id" :label="item.label" :value="item.label" />
                </el-select>
              </el-form-item>

              <el-form-item label="币种">
                <el-select v-model="asinDetailQueryForm.currency" clearable placeholder="请选择币种" @change="changeAsinDetailHandler">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
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
          :default-sort="{ prop: 'adSpend', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleAsinDetailSortChange"
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
          <el-table-column label="ASIN" min-width="140" prop="asin" />
          <el-table-column label="站点" min-width="135" prop="site" />
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
          <el-table-column label="总毛利润" min-width="130" prop="totalGrossProfit" sortable="custom">
            <template #default="{ row }">
              {{ row.totalGrossProfit ? row.currencyIcon + formatAmount(row.totalGrossProfit) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="利润报表销售额" min-width="160" prop="totalSalesAmount" sortable="custom">
            <template #default="{ row }">
              {{ row.totalSalesAmount ? row.currencyIcon + formatAmount(row.totalSalesAmount) : '-' }}
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

              <el-form-item>
                <div class="filter-group">
                  <el-checkbox
                    v-model="bonusDetailQueryForm.oldProductClaim"
                    :false-value="0"
                    :true-value="1"
                    @change="queryBonusDetailData"
                  >
                    老品认领
                  </el-checkbox>
                </div>
              </el-form-item>

              <el-form-item label="发放月份">
                <el-select v-model="bonusDetailQueryForm.month" placeholder="请选择发放月份" @change="queryBonusDetailData">
                  <el-option v-for="item in operationBonusMonthOption" :key="item.id" :label="item.label" :value="item.label" />
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
          <el-table-column label="ASIN" min-width="140" prop="asin" />
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
              <el-popover v-if="row.oldProfitGross !== null" effect="dark" placement="top" trigger="hover" width="auto">
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
          <el-table-column align="center" label="老品认领" min-width="100">
            <template #default="{ row }">
              <vab-icon
                v-if="row.oldProfitGross !== null"
                icon="checkbox-circle-fill"
                style="color: var(--el-color-success); font-size: 23px"
              />
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
          <!-- <el-table-column label="老品净利润" min-width="120" prop="oldProfitGross" sortable="custom">
            <template #default="{ row }">
              {{ row.oldProfitGross ? '$' + row.oldProfitGross : '-' }}
            </template>
          </el-table-column> -->
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

      <!-- 老品利润 -->
      <el-tab-pane label="老品利润" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-form inline>
              <el-form-item label="月份范围">
                <el-date-picker
                  v-model="oldProductProfitMonthRange"
                  end-placeholder="结束月份"
                  format="YYYY-MM"
                  range-separator="至"
                  start-placeholder="开始月份"
                  type="monthrange"
                  value-format="YYYY-MM"
                  @change="handleOldProductProfitMonthChange"
                />
              </el-form-item>
              <el-form-item label="人员">
                <el-select v-model="oldProductProfitQueryForm.userId" filterable placeholder="全部" @change="queryOldProductProfitData">
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="oldProductProfitQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="oldProductProfitQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryOldProductProfitData"
                  @keyup.enter="queryOldProductProfitData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryOldProductProfitData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="oldProductProfitList"
          :default-sort="{ prop: 'createTime', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          :span-method="objectSpanMethod"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column label="认领日期" min-width="120" prop="createTime" sortable="custom">
            <template #default="{ row }">
              {{ row.createTime ? formatDate(new Date(row.createTime)) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="图片" min-width="100" prop="imgUrl">
            <template #default="{ row }">
              <el-image v-if="row.imgUrl" :src="row.imgUrl" style="width: 75px; height: 75px" @click="imagePreviewShow(row.imgUrl)" />
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="140" prop="asin" />
          <el-table-column label="父体ASIN" min-width="140" prop="parentAsin" sortable="custom" />
          <el-table-column label="运营负责人" min-width="125" prop="operationUserName" />
          <el-table-column label="站点" min-width="125" prop="siteName" />
          <el-table-column label="月份" min-width="100" prop="month" />
          <el-table-column label="利润" min-width="120" prop="profit">
            <template #default="{ row }">
              {{ row.profit }}
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="oldProductProfitQueryForm.pageNo"
          :page-size="oldProductProfitQueryForm.pageSize"
          :total="oldProductProfitTotal"
          @current-change="handleOldProductProfitCurrentChange"
          @size-change="handleOldProductProfitSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 考核指标详情 -->
    <performance-indicator-details v-model="performanceIndicatorDetailsVisible" v-model:indicator-list="indicatorList" />

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import {
  getAsinDetailMonthList,
  getAsinSummaryIndicator,
  getAsinSummaryMonthList,
  getCurrencyOperationAsinDetail,
  getCurrencyOperationAsinSummary,
  getOldProductProfitHistoryList,
  getOperationBonusAsinDetailList,
  getOperationBonusAsinSummaryList,
  getOperationBonusDetailList,
  getOperationCommissionDateList,
  updateCurrencyOperationAsinDetail,
  updateCurrencyOperationAsinSummary,
} from '/@/api/devlocal/commission'
import { getFrontPageProductManagerSelectOption, getOperationUserListByPlatform } from '/@/api/devlocal/frontPage'
import { getCurrencyList } from '/@/api/devlocal/productPerformance'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import { formatAmount } from '/@/utils/convertToCamelCase'
import { formatDate } from '/@/utils/dateUtils'
import { Amazon } from '/@/type/storeOperation/platform.ts'

defineOptions({
  name: 'CommissionOperationDetails',
})

const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const userSelectDisabled = ref<boolean>(true)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 考核指标
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
// ASIN明细
const asinDetailQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
  site: -1,
  month: '',
  orderByField: 'adSpend',
  orderDirection: 'descending',
  currency: -1,
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
  orderByField: 'adSpend',
  orderDirection: 'descending',
  currency: -1,
  platformCode: 'Amazon',
})
const asinSummaryList = ref<any[]>([])
const asinSummaryTotal = ref<number>(0)

// 运营奖金明细
const bonusDetailQueryForm = reactive({
  userId: -1,
  site: -1,
  month: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  orderByField: 'price',
  orderDirection: 'descending',
  oldProductClaim: 0,
})
const bonusDetailList = ref<any[]>([])
const bonusDetailTotal = ref<number>(0)

// 老品利润
const oldProductProfitMonthRange = ref<[string, string] | undefined>(undefined)
const oldProductProfitQueryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 50,
  startMonth: '',
  endMonth: '',
  userId: -1,
  orderByField: '',
  orderDirection: 'desc',
})
const oldProductProfitList = ref<any[]>([])
const oldProductProfitTotal = ref<number>(0)

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
const handleAsinDetailSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  asinDetailQueryForm.orderByField = prop
  // queryForm.orderDirection = order === 'ascending' ? 'asc' : 'desc'
  if (!order) {
    if (asinDetailQueryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (asinDetailQueryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  asinDetailQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryAsinDetailData()
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
const handleAsinDetail = async (row: any) => {
  await fetchIndicatorList(row.id)
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

// AINS汇总-修改币种
const changeAsinSummaryHandler = async (row: any) => {
  const { data } = await updateCurrencyOperationAsinSummary({
    currency: asinSummaryQueryForm.currency!,
  })
  if (data) {
    queryAsinSummaryData()
  }
}

// ASIN汇总-获取币种
const fetchAsinSummaryCurrency = async () => {
  const { data } = await getCurrencyOperationAsinSummary()
  asinSummaryQueryForm.currency = data
}

const handleAsinSummarySortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  asinSummaryQueryForm.orderByField = prop
  // queryForm.orderDirection = order === 'ascending' ? 'asc' : 'desc'
  if (!order) {
    if (asinSummaryQueryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (asinSummaryQueryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  asinSummaryQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryAsinSummaryData()
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
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const flag = data.row.flag || {}
  if (label === 'ACOS') {
    if (flag.acosFlag) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === 'TACOS') {
    if (flag.tacosFlag) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === '广告销售占比') {
    if (flag.adSalesRatioFlag) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === '冗余库存占比') {
    if (flag.redundantInventoryRatioFlag) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === '低动销占比') {
    if (flag.lowTurnoverRatioFlag) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
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

// ASIN明细-修改币种
const changeAsinDetailHandler = async (row: any) => {
  const { data } = await updateCurrencyOperationAsinDetail({
    currency: asinDetailQueryForm.currency!,
  })
  if (data) {
    queryAsinDetailData()
  }
}

// ASIN明细-获取币种
const fetchAsinDetailCurrency = async () => {
  const { data } = await getCurrencyOperationAsinDetail()
  asinDetailQueryForm.currency = data
}

const handleBonusDetailSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  bonusDetailQueryForm.orderByField = prop
  // queryForm.orderDirection = order === 'ascending' ? 'asc' : 'desc'
  if (!order) {
    if (bonusDetailQueryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (bonusDetailQueryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  bonusDetailQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
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

// ============ 老品利润方法 ============
const handleOldProductProfitMonthChange = (value: [string, string] | undefined) => {
  if (value) {
    oldProductProfitQueryForm.startMonth = value[0]
    oldProductProfitQueryForm.endMonth = value[1]
  } else {
    oldProductProfitQueryForm.startMonth = ''
    oldProductProfitQueryForm.endMonth = ''
  }
  queryOldProductProfitData()
}

const queryOldProductProfitData = async () => {
  listLoading.value = true
  try {
    const { data } = await getOldProductProfitHistoryList(oldProductProfitQueryForm)
    oldProductProfitList.value = data.list || []
    oldProductProfitTotal.value = data.total || 0
  } catch (error) {
    console.error('查询老品利润失败:', error)
    $baseMessage('查询失败，请重试', 'error')
  } finally {
    listLoading.value = false
  }
}

const handleOldProductProfitCurrentChange = (val: number) => {
  oldProductProfitQueryForm.pageNo = val
  queryOldProductProfitData()
}

const handleOldProductProfitSizeChange = (val: number) => {
  oldProductProfitQueryForm.pageSize = val
  oldProductProfitQueryForm.pageNo = 1
  queryOldProductProfitData()
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  oldProductProfitQueryForm.orderByField = prop
  if (!order) {
    if (oldProductProfitQueryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (oldProductProfitQueryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  oldProductProfitQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryOldProductProfitData()
}
// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    // 获取当前row的零件id
    const asinId = row.asinId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < oldProductProfitList.value.length; i++) {
      // 如果零件id一样需要合并
      if (oldProductProfitList.value[i].asinId === asinId) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || oldProductProfitList.value[rowIndex - 1].asinId !== asinId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
// ============ Tab切换 ============
const handleTabClick = async (tab: TabsPaneContext) => {
  if (tab.props.name === 0) {
    await fetchAsinSummaryCurrency()
    await queryAsinSummaryData()
  } else if (tab.props.name === 1) {
    await fetchAsinDetailCurrency()
    await queryAsinDetailData()
  } else if (tab.props.name === 2) {
    await queryBonusDetailData()
  } else if (tab.props.name === 3) {
    await queryOldProductProfitData()
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
  const { data } = await getOperationUserListByPlatform(Amazon)
  userLevelList.value = data
  userLevelList.value.unshift({ id: -1, label: '全部' })

  if (currentRoleCode === ROLE_BOSS_CODE) {
    userSelectDisabled.value = false
    bonusDetailQueryForm.userId = -1
  } else {
    bonusDetailQueryForm.userId = userLevelList.value.find((item) => item.label.includes(userName!))?.id || -1
  }

  asinDetailQueryForm.userId = bonusDetailQueryForm.userId
  asinSummaryQueryForm.userId = bonusDetailQueryForm.userId
  oldProductProfitQueryForm.userId = bonusDetailQueryForm.userId
}
// ASIN汇总月份筛选
const asinSummaryMonthOption = ref<{ id: number; label: string }[]>([])
const fetchAsinSummaryMonthList = async () => {
  const { data } = await getAsinSummaryMonthList('Amazon')
  asinSummaryMonthOption.value = data.map((month, index) => ({ id: index, label: month }))
  asinSummaryQueryForm.month = data[0]
}
// ASIN明细月份筛选
const asinDetailMonthOption = ref<{ id: number; label: string }[]>([])
const fetchAsinDetailMonthList = async () => {
  const { data } = await getAsinDetailMonthList()
  asinDetailMonthOption.value = data.map((month, index) => ({ id: index, label: month }))
  asinDetailQueryForm.month = data[0]
}
// 运营奖金明细月份筛选
const operationBonusMonthOption = ref<{ id: number; label: string }[]>([])
const fetchOperationBonusMonthList = async () => {
  const { data } = await getOperationCommissionDateList()
  bonusDetailQueryForm.month = data[0]
  operationBonusMonthOption.value = data.map((month, index) => ({ id: index, label: month }))
}
// 币种筛选
const currencyList = ref<{ id: number; label: string }[]>([])
const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
  currencyList.value.unshift({ id: -1, label: '原币种' })
}
onBeforeMount(async () => {
  await fetchSiteList()
  await fetchCurrencyList()
  await fetchUserLevelList()
  await fetchAsinSummaryMonthList()
  await fetchAsinDetailMonthList()
  await fetchOperationBonusMonthList()
  await queryAsinSummaryData()
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
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
    color: var(--el-color-primary);
  }
}
// 筛选条件组样式
.filter-group {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 1px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  // background: #f1f3f4;

  &:hover {
    background: #f1f3f4;
  }

  :deep(.el-checkbox) {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
