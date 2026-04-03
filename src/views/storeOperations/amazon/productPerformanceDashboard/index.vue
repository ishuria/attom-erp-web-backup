<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="SKU" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="queryForm.site"
                  class="multiple-select"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="全部站点"
                  style="width: 220px"
                  @change="queryData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="currencySKU" clearable placeholder="请选择币种" @change="changeCurrencySKU">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" style="width: 5em" @change="queryData">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select
                  v-model="queryForm.developUserId"
                  :disabled="disabledDev"
                  placeholder="请选择开发人"
                  style="width: 5em"
                  @change="queryData"
                >
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :loading="filterLoading" type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_OPE_CLASSIFY] }" type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_FILE_UPLOAD] }" type="primary" @click="spFileUploadVisible = true">文件上传</el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_LOG_SUMMARY] }" type="primary" @click="logSummaryVisible = true">日志汇总</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">今销更新：{{ saleUpdateDate[0] }}</el-text>
                <el-divider direction="vertical" />
                <el-text style="font-weight: 600">其他数据更新：{{ saleUpdateDate[5] }}</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columns"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd1"
                :on-move="handleMove1"
              >
                <div
                  v-for="item in columns"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyword"
                  class="search-input"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <performance-table
          :active-name="activeName"
          :ai-title-optimization-loading-ids="aiTitleOptimizationLoadingIds"
          :columns="checkList1"
          :data="list"
          :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
          :is-boss="isBoss"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          :row-key="(row: any) => row.id || row.skuId"
          :seasonal-x-data="seasonalXData"
          :type="'sku'"
          :user-name="userName"
          :x-axis="xAxis"
          @cell-click="cellClick"
          @image-preview="imagePreviewShow"
          @router-push="handleRouterPush"
          @row-click="handleRowClick"
          @show-ai-title-optimization="showAiTitleOptimization"
          @show-operation-log="showOperationLog"
          @show-release-order="handleShowReleaseOrder"
          @show-remark="showRemark"
          @sort-change="sortChange"
          @update-ope-type="handleUpdateOpeType"
          @update-stop-status="handleUpdateSKUStopStatus"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="ASIN" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="asinQueryForm.site"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="全部站点"
                  style="width: 220px"
                  @change="queryAsinData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="currencyAsin" clearable placeholder="请选择币种" @change="changeCurrencyASIN">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="asinQueryForm.operationUserId" placeholder="请选择运营人员" style="width: 5em" @change="queryAsinData">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select
                  v-model="asinQueryForm.developUserId"
                  :disabled="disabledDev"
                  placeholder="请选择开发人"
                  style="width: 5em"
                  @change="queryAsinData"
                >
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :loading="filterLoading" type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_OPE_CLASSIFY] }" type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_LOG_SUMMARY] }" type="primary" @click="logSummaryVisible = true">日志汇总</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">今销更新：{{ saleUpdateDate[1] }}</el-text>
                <el-divider direction="vertical" />
                <el-text style="font-weight: 600">补货数量和月数据更新：{{ saleUpdateDate[11] }}</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columnsAsin"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd2"
                :on-move="handleMove2"
              >
                <div
                  v-for="item in columnsAsin"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="asinQueryForm">
              <el-form-item>
                <el-input
                  v-model.trim="asinQueryForm.keyword"
                  class="search-input"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryAsinData"
                  @keyup.enter="queryAsinData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryAsinData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <performance-table
          :active-name="activeName"
          :ai-title-optimization-loading-ids="aiTitleOptimizationLoadingIds"
          :columns="checkList2"
          :data="asinList"
          :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
          :is-boss="isBoss"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          :row-key="(row: any) => row.id || row.asinId"
          :seasonal-x-data="seasonalXData"
          :type="'asin'"
          :user-name="userName"
          :x-axis="xAxis"
          @cell-click="cellClick"
          @image-preview="imagePreviewShow"
          @router-push="handleRouterPush"
          @row-click="handleRowClick"
          @show-ai-title-optimization="showAiTitleOptimization"
          @show-release-order="handleShowReleaseOrder"
          @show-remark="showRemark"
          @sort-change="asinSortChange"
          @update-ope-type="handleUpdateAsinOpeType"
          @update-stop-status="handleUpdateASINStopStatus"
        />
        <vab-pagination
          :current-page="asinQueryForm.pageNo"
          :page-size="asinQueryForm.pageSize"
          :total="asinTotal"
          @current-change="handleAsinCurrentChange"
          @size-change="handleAsinSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="父体ASIN" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="pAsinQueryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="pAsinQueryForm.site"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="全部站点"
                  style="width: 220px"
                  @change="queryPAsinData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="currencyPAsin" clearable placeholder="请选择币种" @change="changeCurrencyPASIN">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select
                  v-model="pAsinQueryForm.operationUserId"
                  placeholder="请选择运营人员"
                  style="width: 5em"
                  @change="queryPAsinData"
                >
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select
                  v-model="pAsinQueryForm.developUserId"
                  :disabled="disabledDev"
                  placeholder="请选择开发人"
                  style="width: 5em"
                  @change="queryPAsinData"
                >
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button v-permissions="{ permission: [StoreOperationPermission.PRODUCT_PERFORMANCE_OPE_CLASSIFY] }" type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">今销更新：{{ saleUpdateDate[2] }}</el-text>
                <el-divider direction="vertical" />
                <el-text style="font-weight: 600">补货数量和月数据更新：{{ saleUpdateDate[12] }}</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columnsParentAsin"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd3"
                :on-move="handleMove3"
              >
                <div
                  v-for="item in columnsParentAsin"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="pAsinQueryForm">
              <el-form-item>
                <el-input
                  v-model.trim="pAsinQueryForm.keyword"
                  class="search-input"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryPAsinData"
                  @keyup.enter="queryPAsinData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryPAsinData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <performance-table
          :active-name="activeName"
          :ai-title-optimization-loading-ids="aiTitleOptimizationLoadingIds"
          :columns="checkList3"
          :data="pAsinList"
          :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
          :is-boss="isBoss"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          :row-key="(row: any) => row.id || row.parentAsinId"
          :seasonal-x-data="seasonalXData"
          :type="'pAsin'"
          :user-name="userName"
          :x-axis="xAxis"
          @cell-click="cellClick"
          @image-preview="imagePreviewShow"
          @router-push="handleRouterPush"
          @row-click="handleRowClick"
          @show-ai-title-optimization="showAiTitleOptimization"
          @show-release-order="handleShowReleaseOrder"
          @show-remark="showRemark"
          @sort-change="pAsinSortChange"
        />
        <vab-pagination
          :current-page="pAsinQueryForm.pageNo"
          :page-size="pAsinQueryForm.pageSize"
          :total="pAsinTotal"
          @current-change="handlePAsinCurrentChange"
          @size-change="handlePAsinSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 运营分类 -->
    <vab-operational-classify :ope-classify-visible="opeClassifyVisible" @update-visible="closeOpeClassify" />
    <!-- 筛选 -->
    <vab-filter-dialog
      :classify="activeName"
      :filter-visible="filterVisible"
      :loading="filterLoading"
      :operation-user-id="queryForm.operationUserId"
      :saved-filter-data="activeName === 0 ? queryForm : asinQueryForm"
      @update-filter="handleConfirmFilter"
      @update-visible="handleCloseFilterDialog"
    />
    <!-- 关键词排名趋势 -->
    <vab-key-word-rank-trend :key-word-trend-visible="keyWordTrendVisible" @update-visible="handleCloseKeyWordTrend" />
    <!-- 运营备注 -->
    <vab-dialog v-model="remarkVisible" title="运营备注" width="20%" @opened="handleDialogOpened">
      <el-input ref="inputRef" v-model="remark" placeholder="请输入运营备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 操作日志 -->

    <operation-log-dialog
      v-model="operationLogVisible"
      :add-log-api="addLogAdapter"
      :fetch-history-log-api="fetchHistoryLogAdapter"
      :row="_row"
      :update-remark-api="updateRemarkAdapter"
    />
    <!-- 季节趋势 -->
    <vab-dialog v-model="seasonalVisible" title="季节趋势" width="40%" @open="handleSeasonalOpened">
      <div ref="chartContainer1" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 小类排名/大类排名 -->
    <vab-dialog v-model="rankVisible" :title="title" width="40%" @open="handleRankOpened">
      <div style="text-align: center">
        <el-date-picker
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="handleRankChange"
        />
      </div>
      <div ref="chartContainer2" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- VOC满意度 -->
    <vab-dialog v-model="vocVisible" title="VOC满意度" width="40%" @open="handleVocOpened">
      <div style="text-align: center">
        <el-date-picker
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="fetchSkuVocData"
        />
      </div>
      <div ref="chartContainer3" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 发布订货 -->
    <vab-release-order-dialog
      ref="releaseOrderDialogRef"
      v-model="releaseOrderVisible"
      :loading="orderListLoading"
      :sku-list="skuList"
      @confirm="handleReleaseOrder"
      @image-preview="imagePreviewShow"
    />
    <!-- 文件上传 -->
    <sp-file-upload v-model:visible="spFileUploadVisible" :site-list="filteredSiteList" />
    <operation-log-manual-sum v-model:visible="logSummaryVisible" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import type { CheckboxValueType, ElInput, TabsPaneContext } from 'element-plus'
import { debounce } from 'lodash-es'
import { shallowRef } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { addOperationLog, getOperationLog } from '/@/api/devlocal/productAnalysis.ts'
import { months } from '../../constantOption.ts'
import { createAiConversation, sendAiChatMessage } from '/src/api/devlocal/ai'
import { getDistributionOptionUserList, getDistributionSiteList } from '/src/api/devlocal/productDistribution'
import { getOperationOrderSku, releaseOperationPlanPo } from '/src/api/devlocal/productOrdering'
import {
  getCurrencyASINAmazonOperation,
  getCurrencyList,
  getCurrencyParentASINAmazonOperation,
  getCurrencySKUAmazonOperation,
  getDevelopUserList,
  getOperationAmazonAsinRankCateList,
  getOperationAmazonAsinRankList,
  getOperationAmazonParentAsinRankCateList,
  getOperationAmazonParentAsinRankList,
  getOperationAmazonSKUList,
  getOperationAmazonSkuRankCateList,
  getOperationAmazonSkuRankList,
  getOperationAmazonSkuVocList,
  getOperationAsinList,
  getOperationColumnList,
  getOperationParentAsinList,
  getOperationUpdateDate,
  getUserAmazonOperation,
  hideOrShowOperationColumn,
  updateCurrencyASINAmazonOperation,
  updateCurrencyParentASINAmazonOperation,
  updateCurrencySKUAmazonOperation,
  updateOperationASINDisContinuedStatus,
  updateOperationASINOperateTypeList,
  updateOperationSKUDisContinuedStatus,
  updateOperationSKUOperateTypeList,
  updateRemarkAmazonOperation,
  updateSortOperationColumn,
} from '/src/api/devlocal/productPerformance'
import { ROLE_BOSS_CODE, ROLE_ECOMMERCEOPERATIONLEAD_CODE } from '/src/const/role'
import StoreOperationPermission from '/src/permissions/storeOperation'
import { useAclStore } from '/src/store/modules/acl'
import { useAiStore } from '/src/store/modules/ai'
import { useUserStore } from '/src/store/modules/user'
import type {
  IGetOperationAmazonSKUList,
  IGetOperationAsinList,
  IGetOperationColumnList,
  IGetOperationParentAsinList,
  IOperationAmazonSkuRankList,
  IOperationAmazonSkuVocList,
} from '/src/type/storeOperation/productPerformanceType'
import { getAmazonStars, handleImgUrl } from '/src/utils/rate'
import { _addData } from '/src/utils/skuOptions'
import { processField } from '/src/utils/tableColum'

defineOptions({
  name: 'ProductPerformanceDashboard',
})

const userName = useUserStore().getUsername
const currentRole = useAclStore().getRole
const aiStore = useAiStore()
const isBoss = computed(() => currentRole.includes(ROLE_BOSS_CODE) || currentRole.includes(ROLE_ECOMMERCEOPERATIONLEAD_CODE))
// 发布订货里面的sku列表
const skuList = ref<{ value: string; label: string }[]>([])
const releaseOrderVisible = ref<boolean>(false)
const orderListLoading = ref<boolean>(false)
const releaseOrderDialogRef = ref()
const asinId = ref<number | undefined>(undefined)
let skuRow: any
const spFileUploadVisible = ref<boolean>(false)
const logSummaryVisible = ref<boolean>(false)
const aiTitleOptimizationLoadingIds = ref<Array<number | string>>([])
// 打开发布订货
const handleShowReleaseOrder = async (row: any) => {
  // currentRowId.value = row.id
  skuRow = row
  releaseOrderVisible.value = true

  if (row.sku) {
    orderListLoading.value = true
    // 确保skuArray 是一个没有空值的数组

    skuList.value = [
      {
        label: row.sku,
        value: row.sku,
      },
    ]

    const { data } = await getOperationOrderSku({
      id: null,
      sku: row.sku,
      asin: row.asin,
      site: row.site,
    })
    // 通过组件实例设置表单数据
    if (releaseOrderDialogRef.value) {
      releaseOrderDialogRef.value.setFormData(data)
    }
    asinId.value = data.asinId

    orderListLoading.value = false
  } else {
    skuList.value = []
    // 重置组件表单数据
    if (releaseOrderDialogRef.value) {
      releaseOrderDialogRef.value.resetForm()
    }
  }
}
// 确认发布订货
const handleReleaseOrder = async (formData: any) => {
  if (!formData.sku) {
    $baseMessage('请选择SKU', 'warning')
    return
  }
  // 先判断是否有可认领数量
  if (formData.totalClaimCount > 0) {
    $baseMessage('有其他站点多订数量，需要先认领完再订货。认领流程：去打包任务拆分需要订货的数量并将站点改为自己的站点。', 'error')
    return
  }
  if (!formData.number) {
    $baseMessage('请填写订货数量', 'warning')
    return
  }
  try {
    // 先关闭弹窗,提升体验
    releaseOrderVisible.value = false
    orderListLoading.value = true

    const { data } = await releaseOperationPlanPo({
      asinId: asinId.value!,
      sku: formData.sku,
      number: formData.number,
      asin: skuRow.asin,
      site: skuRow.site,
    })

    if (data) {
      $baseMessage('发布订货成功！', 'success')
      // fetchData()
      // skuRow.nowSupplementAdvCalcu = data.nowSupplementAdvCalcu
      // skuRow.nowSupplementCalcu = data.nowSupplementCalcu
      // skuRow.planPoPurchaseSkuNumber = data.planPoPurchaseSkuNumber
    }
  } catch (error) {
    console.error('发布订货失败:', error)
    $baseMessage('发布订货失败，请重试', 'error')
    // 失败时重新打开弹窗
    releaseOrderVisible.value = true
  } finally {
    orderListLoading.value = false
  }
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row }: { row: any }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

// 防抖处理 - 减少延迟时间，优化 INP（从 700ms 改为 300ms）
const debouncedQueryData = debounce(() => {
  queryData()
}, 300)
const debouncedQueryAsinData = debounce(() => {
  queryAsinData()
}, 300)
const debouncedQueryPAsinData = debounce(() => {
  queryPAsinData()
}, 300)

const vocVisible = ref<boolean>(false)
const vocValue = ref<IOperationAmazonSkuVocList[]>([])
const title = ref<string>('')
const rankVisible = ref<boolean>(false)
const rankDate = ref<[Date, Date]>([
  new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
  new Date(), // 今天
])
const shortcuts = [
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
    text: '近半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '近1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2024-12-20') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]
const activeName = ref<number>(0)
const seasonalVisible = ref<boolean>(false)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
const chartContainer3 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
let chartObserver3: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const option3 = ref<any>({})
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const router = useRouter()
// 运营备注
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const _row = ref<any>(null)
interface optionType {
  id: number
  label: string
}
const currencyList = ref<optionType[]>([])
const currencySKU = ref<number | undefined>(0)
const currencyAsin = ref<number | undefined>(0)
const currencyPAsin = ref<number | undefined>(0)
const developUserList = ref<optionType[]>([])
const siteList = ref<optionType[]>([])
// 过滤掉 Tiktok美国 的站点列表（用于文件上传组件）
const filteredSiteList = computed(() => {
  return siteList.value.filter((site) => site.label !== 'Tiktok美国')
})
const operateUserList = ref<optionType[]>([])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const queryForm = reactive<any>({
  keyword: '',
  pageNo: 1,
  pageSize: 10,
  site: [],
  operationUserId: undefined,
  developUserId: undefined,
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
  advStatus: '',
  esTotalMax: '',
  esTotalMin: '',
  fbaMax: '',
  fbaMin: '',
  monthInterestRateMax: '',
  monthInterestRateMin: '',
  monthProfitMax: '',
  monthProfitMin: '',
  monthSalesVolumeMax: '',
  monthSalesVolumeMin: '',
  newArrivalMaxDay: '',
  newArrivalMinDay: '',
  operationTypeId: '',
  signCountMax: '',
  signCountMin: '',
  sellPriceMin: '',
  sellPriceMax: '',
  warehouseAge: '',
})
const asinQueryForm = reactive<any>({
  keyword: '',
  pageNo: 1,
  pageSize: 10,
  site: [],
  operationUserId: '',
  developUserId: '',
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
  advStatus: '',
  esTotalMax: '',
  esTotalMin: '',
  fbaMax: '',
  fbaMin: '',
  monthInterestRateMax: '',
  monthInterestRateMin: '',
  monthProfitMax: '',
  monthProfitMin: '',
  monthSalesVolumeMax: '',
  monthSalesVolumeMin: '',
  newArrivalMaxDay: '',
  newArrivalMinDay: '',
  operationTypeId: '',
  signCountMax: '',
  signCountMin: '',
  warehouseAge: '',
})
const pAsinQueryForm = reactive<any>({
  keyword: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: '',
  developUserId: '',
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
// 优化：使用 shallowRef 减少深度响应式追踪，提升性能
// 表格数据不需要深度响应式，只需要浅层响应式即可
const list = shallowRef<IGetOperationAmazonSKUList[]>([])
const asinList = shallowRef<IGetOperationAsinList[]>([])
const pAsinList = shallowRef<IGetOperationParentAsinList[]>([])
const { site } = toRefs(queryForm)
const aclStore = useAclStore()

const handleRankChange = () => {
  if (title.value === '小类排名') {
    fetchSkuRankData()
  } else if (title.value === '大类排名') {
    fetchSkuCateRankData()
  }
}

// 监听日期变化，确保数据及时更新
watch(
  () => rankDate.value,
  () => {
    handleRankChange()
  },
  { deep: true }
)
const filterLoading = ref<boolean>(false)
const handleConfirmFilter = async (filterForm: any) => {
  filterLoading.value = true
  try {
    const processedFilterData = { ...filterForm }

    const numberFields = [
      'newArrivalMinDay',
      'newArrivalMaxDay',
      'esTotalMin',
      'esTotalMax',
      'signCountMin',
      'signCountMax',
      'sellPriceMin',
      'sellPriceMax',
      'monthProfitMin',
      'monthProfitMax',
      'monthInterestRateMin',
      'monthInterestRateMax',
      'monthSalesVolumeMin',
      'monthSalesVolumeMax',
      'fbaMin',
      'fbaMax',
      'estimateNextMonthStorageFeeMin',
      'estimateNextMonthStorageFeeMax',
      'operationTypeId',
    ]

    numberFields.forEach((field) => {
      if (processedFilterData[field] === null || processedFilterData[field] === undefined) {
        processedFilterData[field] = ''
      }
    })

    if (
      processedFilterData.warehouseAge === null ||
      processedFilterData.warehouseAge === undefined ||
      (processedFilterData.warehouseAge.length > 0 && processedFilterData.warehouseAge.includes(''))
    ) {
      processedFilterData.warehouseAge = ''
    }

    if (activeName.value === 0) {
      Object.assign(queryForm, processedFilterData)
      fetchData()
      filterVisible.value = false
      $baseMessage('SKU运营筛选成功！', 'success')
    } else if (activeName.value === 1) {
      Object.assign(asinQueryForm, processedFilterData)
      fetchAsinData()
      filterVisible.value = false
      $baseMessage('ASIN运营筛选成功！', 'success')
    }
  } catch {
    $baseMessage('筛选失败，请重试', 'error')
  } finally {
    filterLoading.value = false
  }
}
const handleUpdateOpeType = async (row: IGetOperationAmazonSKUList) => {
  await updateOperationSKUOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}
// 修改 ASIN 的运营分类
const handleUpdateAsinOpeType = async (row: IGetOperationAsinList) => {
  await updateOperationASINOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}
const handleUpdateSKUStopStatus = async (row: IGetOperationAmazonSKUList) => {
  await updateOperationSKUDisContinuedStatus({
    skuId: row.skuId!,
    status: row.stopProductStatus!,
    siteId: row.site,
  })
}
const handleUpdateASINStopStatus = async (row: IGetOperationAmazonSKUList) => {
  await updateOperationASINDisContinuedStatus({
    asin: row.asin!,
    status: row.stopProductStatus!,
    siteId: row.site,
  })
}
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteList.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.site = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    if (activeName.value === 0) {
      queryData()
    } else if (activeName.value === 1) {
      queryAsinData()
    } else {
      queryPAsinData()
    }
  } else {
    queryForm.site = []
    // 取消全选获取数据
    if (activeName.value === 0) {
      queryData()
    } else if (activeName.value === 1) {
      queryAsinData()
    } else {
      queryPAsinData()
    }
  }
}
const showRemark = (row: any) => {
  _row.value = row
  remark.value = row.operationRemark
  remarkVisible.value = true
}
const operationLogVisible = ref<boolean>(false)
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const pickObject = (response: any) => response?.data ?? response ?? {}

const normalizeAiConversationId = (response: any) => {
  const payload = pickObject(response)
  return payload?.id ?? payload?.conversationId ?? payload?.conversation?.id ?? null
}

const normalizeTitleOptimizationField = (label: string, value: unknown) => {
  if (value == null) return `${label}：-`
  if (typeof value === 'string') {
    const normalizedValue = value.trim()
    return `${label}：${normalizedValue || '-'}`
  }
  return `${label}：${String(value)}`
}

const showAiTitleOptimization = async (row: any) => {
  const operationSkuId = row?.id
  if (operationSkuId == null || operationSkuId === '') {
    $baseMessage('当前数据缺少业务标识，无法发起标题优化', 'error')
    return
  }

  const loadingKey = String(operationSkuId)
  if (aiTitleOptimizationLoadingIds.value.some((id) => String(id) === loadingKey)) {
    return
  }

  aiTitleOptimizationLoadingIds.value = [...aiTitleOptimizationLoadingIds.value, operationSkuId]

  try {
    const createResponse = await createAiConversation({
      operationSkuId,
    })
    const conversationId = normalizeAiConversationId(createResponse)

    if (conversationId == null || conversationId === '') {
      throw new Error('会话创建成功但未返回有效会话 ID')
    }

    try {
      await aiStore.ensureInitialized({
        createIfEmpty: false,
        forceRefresh: true,
      })
      await aiStore.switchConversation(conversationId)
      aiStore.setConversationBusy(conversationId, {
        reason: 'title-optimization',
        message: '标题优化处理中，当前会话暂时不能发送消息，请等待结果返回。',
        placeholderText: '已提交标题优化请求，正在等待模型返回结果...',
      })
      $baseMessage('已开始标题优化，当前会话会在结果返回前禁止发送新消息', 'success')
      await sendAiChatMessage({
        conversationId,
      })
      void aiStore.waitForConversationReply(conversationId)
    } catch (error: any) {
      aiStore.failConversationBusy(conversationId, error?.msg ?? error?.message ?? '标题优化任务创建成功，但消息发送失败')
      $baseMessage(error?.msg ?? error?.message ?? '标题优化任务创建成功，但消息发送失败', 'error')
    }
  } catch (error: any) {
    $baseMessage(error?.msg ?? error?.message ?? '创建标题优化会话失败', 'error')
  } finally {
    aiTitleOptimizationLoadingIds.value = aiTitleOptimizationLoadingIds.value.filter((id) => String(id) !== loadingKey)
  }
}

const showOperationLog = async (row: any) => {
  _row.value = row
  operationLogVisible.value = true
}

// 操作日志 API 适配器
const addLogAdapter = async (row: any, content: string) => {
  const result = await addOperationLog({
    asin: row.asin,
    siteId: row.site,
    content,
  })
  return result.data
}

const fetchHistoryLogAdapter = async (row: any) => {
  // 获取最近30天的日志
  const endDate = new Date()
  const startDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)

  const result = await getOperationLog({
    asin: row.asin,
    siteId: row.site,
    type: [0], // 手动输入
    pageNo: 1,
    pageSize: 10000,
    startDate: dayjs(startDate).format('YYYY-MM-DD'),
    endDate: dayjs(endDate).format('YYYY-MM-DD'),
  })
  return { list: result.data.list }
}
const updateRemarkAdapter = async (row: any, remarkContent: string) => {
  const result = await updateRemarkAmazonOperation({
    site: row.site,
    asin: row.asin,
    remark: remarkContent,
    type: 0,
  })
  return result.data
}

const handleDialogOpened = () => {
  const textarea = inputRef.value?.$el.querySelector('textarea') as HTMLTextAreaElement
  if (textarea) {
    textarea.focus()
    textarea.setSelectionRange(0, 0) // 光标定位到开头
  }
}

let _seasonalCoefficient = {
  actualList: [],
  referenceList: [],
}
const sortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
const asinSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(column, prop, order)
  if (asinQueryForm.orderByField === prop) {
    if (!order) {
      if (asinQueryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (asinQueryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  asinQueryForm.orderByField = prop
  asinQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  // console.log(order)
  queryAsinData()
}
const pAsinSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(column, prop, order)
  if (pAsinQueryForm.orderByField === prop) {
    if (!order) {
      if (pAsinQueryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (pAsinQueryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  pAsinQueryForm.orderByField = prop
  pAsinQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  // console.log(order)
  queryPAsinData()
}
const confirmUpdateRemark = async () => {
  const { data } = await updateRemarkAmazonOperation({
    site: _row.value.site,
    asin: _row.value.asin,
    remark: remark.value,
    type: 0,
  })
  if (data) {
    $baseMessage('运营备注修改成功！', 'success')
    remarkVisible.value = false
    _row.value.operationRemark = remark.value
  }
}
// 优化：直接过滤，对小数组来说比缓存更快
const checkList1 = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
// 优化：直接过滤，对小数组来说比缓存更快
const checkList2 = computed(() => {
  return columnsAsin.value.filter((_: any) => _.checked)
})
const checkList3 = computed(() => {
  return columnsParentAsin.value.filter((_: any) => _.checked)
})
const columns = ref<any>([])
const columnsAsin = ref<any>([])
const columnsParentAsin = ref<any>([])

const initChart1 = () => {
  option1.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: _seasonalCoefficient.actualList,
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: _seasonalCoefficient.referenceList,
        itemStyle: {
          color: '#ff8fa5',
        },
        smooth: true,
      },
    ],
  }

  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: () => rankValue.value.map((item) => item.updateDate),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
    yAxis: {
      name: '小类排名',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '小类排名',
        type: 'line',
        data: () => rankValue.value.map((item) => item.rank),
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
  }

  chartInstance2?.setOption(option2.value)
}
const initChart3 = () => {
  option3.value = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">不满意率</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          return `<div style="display: flex;align-items:center;">
            ${item.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px -1px 2px;">${params[0].name}</div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}%</span>
          </div>`
        })
        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr.join('')}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: () => vocValue.value.map((item) => item.eventDate),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
    yAxis: {
      name: '不满意率(%)',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '不满意率',
        type: 'line',
        data: () => vocValue.value.map((item) => item.ncxRate),
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
  }

  chartInstance3?.setOption(option3.value)
}
const handleSeasonalOpened = () => {
  nextTick(() => {
    if (chartContainer1.value) {
      chartInstance1 = echarts.init(chartContainer1.value)
      chartObserver1 = new ResizeObserver(() => {
        if (chartInstance1) {
          chartInstance1.resize()
        }
      })
      chartObserver1.observe(chartContainer1.value)
      initChart1()
    }
  })
}
const handleRankOpened = () => {
  nextTick(() => {
    if (chartContainer2.value) {
      chartInstance2 = echarts.init(chartContainer2.value)
      chartObserver2 = new ResizeObserver(() => {
        if (chartInstance2) {
          chartInstance2.resize()
        }
      })
      chartObserver2.observe(chartContainer2.value)
      initChart2()
    }
  })
}
const handleVocOpened = () => {
  nextTick(() => {
    if (chartContainer3.value) {
      chartInstance3 = echarts.init(chartContainer3.value)
      chartObserver3 = new ResizeObserver(() => {
        if (chartInstance3) {
          chartInstance3.resize()
        }
      })
      chartObserver3.observe(chartContainer3.value)
      initChart3()
    }
  })
}
// 添加标记变量
const tabLoadStatus = ref({
  tab0: false,
  tab1: false,
  tab2: false,
})

const handleTabClick = (tab: TabsPaneContext) => {
  selectedRowIndex.value = -1
  if (tab.props.name === 0) {
    activeName.value = 0
    // 只在首次加载时获取数据
    if (!tabLoadStatus.value.tab0) {
      fetchUpdateDate()
      fetchColumn()
      queryData()
      fetchCurrency()
      tabLoadStatus.value.tab0 = true
    }
  } else if (tab.props.name === 1) {
    activeName.value = 1
    if (!tabLoadStatus.value.tab1) {
      fetchUpdateDate()
      fetchAsinColumn()
      queryAsinData()
      fetchAsinCurrency()
      tabLoadStatus.value.tab1 = true
    }
  } else {
    activeName.value = 2
    if (!tabLoadStatus.value.tab2) {
      fetchUpdateDate()
      fetchPAsinColumn()
      queryPAsinData()
      fetchPAsinCurrency()
      tabLoadStatus.value.tab2 = true
    }
  }
}
// 运营分类设定可见
const opeClassifyVisible = ref<boolean>(false)

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}
const closeOpeClassify = () => {
  opeClassifyVisible.value = false
}
// 筛选可见
const filterVisible = ref<boolean>(false)
const handleCloseFilterDialog = (value: boolean) => {
  filterVisible.value = value
}
// 关键词趋势
const keyWordTrendVisible = ref<boolean>(false)
const handleCloseKeyWordTrend = (value: boolean) => {
  keyWordTrendVisible.value = value
}

let copyRow: any
const chartLoading = ref<boolean>(false)
const rankValue = ref<IOperationAmazonSkuRankList[]>([])
// 获取小类排名数据
const fetchSkuRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)
  if (activeName.value === 0) {
    const { data } = await getOperationAmazonSkuRankList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else if (activeName.value === 1) {
    const { data } = await getOperationAmazonAsinRankList({
      asin: copyRow.asin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else {
    const { data } = await getOperationAmazonParentAsinRankList({
      parentAsin: copyRow.parentAsin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  }

  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '小类排名'
    option2.value.series[0].name = '小类排名'
    option2.value.xAxis.data = rankValue.value.map((item) => item.updateDate)
    option2.value.series[0].data = rankValue.value.map((item) => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
const fetchSkuCateRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)
  if (activeName.value === 0) {
    const { data } = await getOperationAmazonSkuRankCateList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else if (activeName.value === 1) {
    const { data } = await getOperationAmazonAsinRankCateList({
      asin: copyRow.asin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else {
    const { data } = await getOperationAmazonParentAsinRankCateList({
      parentAsin: copyRow.parentAsin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  }

  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '大类排名'
    option2.value.series[0].name = '大类排名'
    option2.value.xAxis.data = rankValue.value.map((item) => item.updateDate)
    option2.value.series[0].data = rankValue.value.map((item) => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
// sku获取voc满意度趋势
const fetchSkuVocData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  const { data } = await getOperationAmazonSkuVocList({
    sku: copyRow.sku,
    siteId: copyRow.site,
    startDate: formatStartDate,
    endDate: formatEndDate,
  })
  vocValue.value = data
  // 更新图表数据
  if (chartInstance3) {
    option3.value.xAxis.data = vocValue.value.map((item) => item.eventDate)
    option3.value.series[0].data = vocValue.value.map((item) => item.ncxRate)
    chartInstance3.setOption(option3.value)
  }
  chartLoading.value = false
}
const cellClick = async (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '销量趋势(点击看明细)': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 0,
          field: activeName.value,
          sku: row.sku,
          asin: row.asin,
          site: row.site,
        },
      })
      _addData(row)
      break
    }
    case '饼图': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 1,
        },
      })
      _addData(row)
      break
    }
    case '运营备注': {
      showRemark(row)
      break
    }
    case '季节趋势': {
      seasonalVisible.value = true
      _seasonalCoefficient = row.seasonalCoefficient
      break
    }
    case '小类排名': {
      rankVisible.value = true
      // 默认打开是近30天
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date(), // 今天
      ]
      copyRow = row
      title.value = '小类排名'
      fetchSkuRankData()
      break
    }
    case '大类排名': {
      rankVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date(), // 今天
      ]
      copyRow = row
      title.value = '大类排名'
      fetchSkuCateRankData()
      break
    }
    case 'VOC满意度': {
      vocVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date(), // 今天
      ]
      copyRow = row
      title.value = 'VOC满意度'
      fetchSkuVocData()
      break
    }
    // No default
  }
}
const handleRouterPush = (row: any) => {
  router.push({
    path: '/storeOperations/productAnalysis',
    query: {
      activeName: 2,
      field: activeName.value,
      sku: row.sku,
      asin: row.asin,
      site: row.site,
    },
  })
  _addData(row)
}
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const handleMove1 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd1 = async () => {
  const req = columns.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
const handleEnd2 = async () => {
  const req = columnsAsin.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  })
  await updateSortOperationColumn(req)
}
const handleEnd3 = async () => {
  const req = columnsParentAsin.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  })
  await updateSortOperationColumn(req)
}
const handleMove2 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsAsin.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleMove3 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsParentAsin.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const queryAsinData = () => {
  asinQueryForm.pageNo = 1
  fetchAsinData()
}
const handleAsinCurrentChange = (value: number) => {
  asinQueryForm.pageNo = value
  fetchAsinData()
}
const handleAsinSizeChange = (value: number) => {
  asinQueryForm.pageNo = 1
  asinQueryForm.pageSize = value
  fetchAsinData()
}
const queryPAsinData = () => {
  pAsinQueryForm.pageNo = 1
  fetchPAsinData()
}
const handlePAsinCurrentChange = (value: number) => {
  pAsinQueryForm.pageNo = value
  fetchPAsinData()
}
const handlePAsinSizeChange = (value: number) => {
  pAsinQueryForm.pageNo = 1
  pAsinQueryForm.pageSize = value
  fetchPAsinData()
}
const changeCurrencySKU = async () => {
  const { data } = await updateCurrencySKUAmazonOperation({
    currency: currencySKU.value!,
  })
  if (data) {
    queryData()
  }
}
const changeCurrencyASIN = async () => {
  const { data } = await updateCurrencyASINAmazonOperation({
    currency: currencyAsin.value!,
  })
  if (data) {
    queryAsinData()
  }
}
const changeCurrencyPASIN = async () => {
  const { data } = await updateCurrencyParentASINAmazonOperation({
    currency: currencyPAsin.value!,
  })
  if (data) {
    queryPAsinData()
  }
}

const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
  currencyList.value.unshift({ id: -1, label: '原币种' })
}
const fetchCurrency = async () => {
  const { data: sku } = await getCurrencySKUAmazonOperation()
  currencySKU.value = sku
}
const fetchAsinCurrency = async () => {
  const { data: asin } = await getCurrencyASINAmazonOperation()
  currencyAsin.value = asin
}
const fetchPAsinCurrency = async () => {
  const { data: pAsin } = await getCurrencyParentASINAmazonOperation()
  currencyPAsin.value = pAsin
}
const fetchDevelopUserList = async () => {
  const { data } = await getDevelopUserList()
  developUserList.value = data
  developUserList.value.unshift({ id: -1, label: '全部' })
  developUserList.value.push({ id: -2, label: '离职人员' })
}
const fetchUser = async () => {
  const { data } = await getUserAmazonOperation()
  queryForm.operationUserId = data.operationUserId
  queryForm.developUserId = data.developUserId
  asinQueryForm.operationUserId = data.operationUserId
  asinQueryForm.developUserId = data.developUserId
  pAsinQueryForm.operationUserId = data.operationUserId
  pAsinQueryForm.developUserId = data.developUserId
}
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
const getCurrentMonthIndex = () => {
  return new Date().getMonth() // 获取当前月份索引(0-11)
}
const seasonalXData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const currentMonthIndex = getCurrentMonthIndex()
  // 从当前月份开始重新排列月份数组
  return [...months.slice(currentMonthIndex), ...months.slice(0, currentMonthIndex)]
})
const reorderSeasonalData = (data: number[]) => {
  if (data.length !== 12) return data
  const currentMonthIndex = getCurrentMonthIndex()
  return [...data.slice(currentMonthIndex), ...data.slice(0, currentMonthIndex)]
}
// 生成库龄HTML的辅助函数（避免重复创建函数）
const generateStorageAgeHtml = (item: any): string => {
  return `
      <div class="storage-list">
        <div class="storage-item">
          <span class="value1">181-270</span>
        <span class="value2">${item.inventoryAgeLevel1Days || 0}</span>
        <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel1Value || 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">271-360</span>
        <span class="value2">${item.inventoryAgeLevel2Days || 0}</span>
        <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel2Value || 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">361+</span>
        <span class="value2">${item.inventoryAgeLevel3Days || 0}</span>
        <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel3Value || 0})</span>
        </div>
      </div>
    `
}

const fetchData = async () => {
  if (listLoading.value) return
  listLoading.value = true
  try {
    const { site, ...filterQueryForm } = queryForm
    const { data } = await getOperationAmazonSKUList({
      ...filterQueryForm,
      siteIds: site.join(','),
    })
    total.value = data.total
    // 优化：立即处理关键字段（displayRating、skuImgUrl、storageAge），确保库龄等字段能立即显示
    // 这些字段是首屏必需的，需要立即生成
    // 先处理数据，然后再赋值，确保 shallowRef 能正确检测到变化
    const processedList = data.list.map((item: any) => {
      item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
      if (item.skuImgUrl) item.skuImgUrl = handleImgUrl(item.skuImgUrl)
      item.storageAge = generateStorageAgeHtml(item)
      return item
    })
    // 立即处理所有数据，确保数据能直接显示
    processedList.forEach((item: any) => {
      item._actualList = reorderSeasonalData(item.seasonalCoefficient.actualList)
      processField(item, 'developName', 2)
    })
    // 优化：立即显示处理后的数据，不阻塞渲染
    // 使用 shallowRef 时，直接赋值即可，不需要深度响应式
    list.value = processedList
    listLoading.value = false
  } catch (error) {
    $baseMessage('获取数据失败', 'error')
  } finally {
    listLoading.value = false
  }
}
const asinTotal = ref<number>(0)

const fetchAsinData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = asinQueryForm
  const { data } = await getOperationAsinList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  asinTotal.value = data.total
  // 优化：立即处理关键字段（displayRating、asinImgUrl、storageAge、_actualList、_sku、_developName），确保所有字段能立即显示
  // 这些字段是首屏必需的，需要立即生成
  // 先处理数据，然后再赋值，确保 shallowRef 能正确检测到变化
  const processedAsinList = data.list.map((item: any) => {
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    item.storageAge = generateStorageAgeHtml(item)
    // 立即处理季节趋势、SKU和开发人员字段，确保能正常显示
    item._actualList = reorderSeasonalData(item.seasonalCoefficient.actualList)
    processField(item, 'sku', 2)
    processField(item, 'developName', 2)
    return item
  })
  // 优化：立即显示处理后的数据，不阻塞渲染
  // 使用 shallowRef，提升性能
  asinList.value = processedAsinList
  listLoading.value = false
}
const pAsinTotal = ref<number>(0)

const fetchPAsinData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = pAsinQueryForm
  const { data } = await getOperationParentAsinList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  pAsinTotal.value = data.total
  // 优化：立即处理关键字段（displayRating、asinImgUrl、_sku、_developName），确保所有字段能立即显示
  // 这些字段是首屏必需的，需要立即生成
  // 先处理数据，然后再赋值，确保 shallowRef 能正确检测到变化
  const processedPAsinList = data.list.map((item: any) => {
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    // 立即处理SKU和开发人员字段，确保能正常显示
    processField(item, 'sku', 2)
    processField(item, 'developName', 2)
    return item
  })
  // 优化：立即显示处理后的数据，不阻塞渲染
  // 使用 shallowRef，提升性能
  pAsinList.value = processedPAsinList
  listLoading.value = false
}

const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 0 })
  columns.value = data
  const indicesToDelete: number[] = [] // 存储要删除的索引

  columns.value.forEach((item: IGetOperationColumnList, index: number) => {
    item.minWidth = item.width
    if (item.prop !== 'skuImgUrl') {
      delete item.width
    }
    if (
      [
        'currentSalesNumber',
        'currentSalesOrder',
        'monthSalesVolume',
        'monthNetProfit',
        'monthSalesPrice',
        'currentSalesPrice',
        'outOfStock',
        'vocSatisfaction',
        'availableInventory',
        'fbaStorageFee',
        'differenceFba',
        'monthReturnGoods',
        'monthAcos',
        'grossProfit',
        'monthOrderSales',
        'availableRate',
        'estimateNextMonthStorageFee',
        'newArrivalDay',
        'pAsinMonthNetProfit',
        'monthOrderVolume',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
    if (['skuImgUrl', 'sku'].includes(item.prop)) {
      item.isFixed = true
    }
    if (item.prop === 'vocDefect') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'vocNcxCount') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'vocTotalOrderCount') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'amazonFba') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'selfAssessmentFba') {
      item.minWidth = '120'
    }
  })

  for (let i = indicesToDelete.length - 1; i >= 0; i--) {
    columns.value.splice(indicesToDelete[i], 1) //删除项
  }
}
const fetchAsinColumn = async () => {
  const { data } = await getOperationColumnList({ type: 1 })
  columnsAsin.value = data
  columnsAsin.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (
      [
        'currentSalesNumber',
        'currentSalesOrder',
        'monthSalesVolume',
        'monthNetProfit',
        'monthSalesPrice',
        'currentSalesPrice',
        'outOfStock',
        'availableInventory',
        'fbaStorageFee',
        'monthReturnGoods',
        'monthAcos',
        'monthOrderSales',
        'availableRate',
        'estimateNextMonthStorageFee',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
    if (['asinImgUrl', 'asin', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const fetchPAsinColumn = async () => {
  const { data } = await getOperationColumnList({ type: 2 })
  columnsParentAsin.value = data
  columnsParentAsin.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (
      [
        'currentSalesNumber',
        'currentSalesOrder',
        'monthSalesVolume',
        'monthNetProfit',
        'monthSalesPrice',
        'currentSalesPrice',
        'outOfStock',
        'availableInventory',
        'fbaStorageFee',
        'monthReturnGoods',
        'monthAcos',
        'monthOrderSales',
        'estimateNextMonthStorageFee',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
    if (['asinImgUrl', 'sku', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const disabledOpe = ref<boolean>(false)
const disabledDev = ref<boolean>(false)
const operationAndDevelopSelect = () => {
  const role = aclStore.getRole[0]
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS': {
      // disabledOpe.value = false
      disabledDev.value = false
      queryForm.site = [0]
      asinQueryForm.site = [0]
      pAsinQueryForm.site = [0] //【BOSS】角色，3个tab的默认站点=美国。
      break
    }
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      // disabledOpe.value = false
      disabledDev.value = false

      break
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      // disabledOpe.value = true
      disabledDev.value = false

      break
    }
    // 产品经理,产品设计,工业设计
    case 'ROLE_PRODUCTMANAGER':
    case 'ROLE_PRODUCTDESIGNER':
    case 'ROLE_INDUSTRIAL_DESIGN': {
      // disabledOpe.value = false
      disabledDev.value = true

      break
    }
    // 产品主管, 行政主管
    case 'ROLE_PRODUCTMANNAGERLEAD':
    case 'ROLE_ADMINBUYERLEAD': {
      // disabledOpe.value = false
      disabledDev.value = false

      break
    }
    // No default
  }
}

const saleUpdateDate = ref<string[] | undefined[]>([])
const fetchUpdateDate = async () => {
  const { data } = await getOperationUpdateDate({ type: activeName.value })
  saleUpdateDate.value[activeName.value] = data
  const secondType = activeName.value === 0 ? 5 : activeName.value + 10
  const { data: date } = await getOperationUpdateDate({ type: secondType })
  saleUpdateDate.value[secondType] = date
  // console.log(saleUpdateDate.value)
}
// 优化首屏渲染：优先级处理
// 1. 立即执行：关键数据（首屏表格数据）
// 2. 延迟执行：非关键数据（下拉选项、配置等）
onBeforeMount(() => {
  // 设置运营和开发人是否可选以及boss默认站点为美国（同步操作，立即执行）
  operationAndDevelopSelect()

  // 优化：不等待列配置，直接加载数据（列配置可以延迟加载）
  // 优先加载首屏表格数据（关键路径）
  if (activeName.value === 0) {
    // 直接加载数据，不等待列配置（列配置可以并行加载）
    fetchData() // 表格数据 - 最优先
    fetchColumn() // 列配置 - 并行加载，不阻塞
    fetchCurrency() // 币种 - 并行加载，不阻塞
    tabLoadStatus.value.tab0 = true
  } else if (activeName.value === 1) {
    fetchAsinData() // 表格数据 - 最优先
    fetchAsinColumn() // 列配置 - 并行加载，不阻塞
    fetchAsinCurrency() // 币种 - 并行加载，不阻塞
    tabLoadStatus.value.tab1 = true
  } else {
    fetchPAsinData() // 表格数据 - 最优先
    fetchPAsinColumn() // 列配置 - 并行加载，不阻塞
    fetchPAsinCurrency() // 币种 - 并行加载，不阻塞
    tabLoadStatus.value.tab2 = true
  }

  // 优化：更激进的延迟加载策略（使用 requestIdleCallback，完全不阻塞首屏）
  // 这些数据不影响首屏内容显示，可以大幅延迟加载
  if (typeof requestIdleCallback !== 'undefined') {
    // 使用 requestIdleCallback 在浏览器空闲时加载
    requestIdleCallback(
      () => {
        // 获取更新日期
        fetchUpdateDate()
        // 获取站点列表
        fetchSiteList()
        // 获取币种列表
        fetchCurrencyList()
        // 获取运营人员列表
        fetchOperateUserList()
        // 获取开发人员列表
        fetchDevelopUserList()
        // 获取默认运营人和开发人
        fetchUser()
      },
      { timeout: 500 } // 最多等待 500ms，之后强制执行
    )
  } else {
    // 降级方案：延迟更长时间（从 100ms 增加到 300ms）
    setTimeout(() => {
      // 获取更新日期
      fetchUpdateDate()
      // 获取站点列表
      fetchSiteList()
      // 获取币种列表
      fetchCurrencyList()
      // 获取运营人员列表
      fetchOperateUserList()
      // 获取开发人员列表
      fetchDevelopUserList()
      // 获取默认运营人和开发人
      fetchUser()
    }, 300) // 延迟 300ms，让首屏完全渲染
  }
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
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
        min-height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important; /* 固定高度，避免 CLS */

        .vab-query-form {
          .left-panel {
            margin-bottom: 0;
          }
          .el-form {
            .el-form-item:first-child {
              .el-check-tag,
              .el-form-item__label {
                margin: 0 5px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .performance-table-wrapper {
          width: 100%;
          flex: 1;
          min-height: 0; /* 允许 flex 子元素收缩 */
          display: flex;
          flex-direction: column;
          overflow: hidden; /* 防止溢出 */
        }
        .el-table {
          flex: 1;
          min-height: 0; /* 允许 flex 子元素收缩 */
          overflow: auto; /* 允许表格滚动 */

          .copySku {
            display: inline-block; /* 使宽度适应内容，方便点击 */
            padding: 0;
            cursor: pointer;
            -webkit-user-select: text;
            user-select: text;
            // transition: all 0.3s;
            &:hover {
              color: #000;
            }
          }
        }
      }
    }

    .storage-list {
      display: grid;
    }

    .storage-item {
      display: grid;
      grid-template-columns: 70px 35px 60px; /* 设定固定列宽 */
      text-align: left;
    }

    .value2 {
      font-weight: 550;
      color: #000;
    }
    .value3 {
      font-weight: 550;
      color: var(--el-color-danger);
    }
  }
}
.handle {
  cursor: grab;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}

/* 订货标签样式 */
.order-tag {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 16px !important;
  height: 16px !important;
  padding: 0 !important;
  margin: -2px 0 0 0;
  border-radius: 4px !important;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;

  :deep(.el-tag__content) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &:hover {
    cursor: pointer;
  }
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.clearLR-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.reduce-padding .cell) {
  padding-right: 2px;
  padding-left: 2px;
}
.noneHoverTable :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoverTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }
// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoverTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
// 选中行高亮样式 - 需要覆盖所有可能的样式
:deep(.noneHoverTable) {
  .el-table__body tr.select-row {
    & > td.el-table__cell {
      background-color: #7bddde !important;
    }
    // 处理条纹行
    &.el-table__row--striped > td.el-table__cell {
      background-color: #7bddde !important;
    }
    // 处理 hover 状态
    &.hover-row > td.el-table__cell {
      background-color: #7bddde !important;
    }
  }
  // 普通行hover时保持白色
  .el-table__body tr:not(.select-row) {
    &.hover-row > td.el-table__cell,
    &:hover > td.el-table__cell {
      background-color: #ffffff !important;
    }
    // 条纹行 hover 时保持条纹颜色
    &.el-table__row--striped.hover-row > td.el-table__cell,
    &.el-table__row--striped:hover > td.el-table__cell {
      background-color: #fafafa !important;
    }
  }
}

.disabled-handle {
  cursor: not-allowed;
}
.flex {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}
.rate-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: -5px;

  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本右对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep() {
      .el-rate__item {
        margin-top: -2px;
        margin-right: 0;
        margin-left: -9px;
        .el-icon {
          stroke: #f09000; /* 星星边框颜色 */
          stroke-width: 60px; /* 星星边框的粗细 */
        }
        cursor: pointer;
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
  }
}
.customTag {
  width: 7em;
  padding: 0 30px;
  color: #fff;
  border: 0;
  border-radius: 17px;

  &-veryPoor {
    background-color: #e32e00;
  }
  &-good {
    background-color: #bad411;
  }
  &-fair {
    background-color: #ffc400;
  }
  &-poor {
    background-color: #ff9900;
  }
  &-excellent {
    background-color: #49850f;
  }
}
.custom-bar {
  width: 100%;
  height: 50px;
}
.arrow-up {
  margin-left: 3px;
  font-weight: 600;
  color: #ff3f48;
  transform: scale(0.9, 1.4);
}
.arrow-down {
  margin-left: 3px;
  font-weight: 600;
  color: #67c23a;
  transform: scale(0.9, 1.4);
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.noneHoverTable :deep(.header-cell .cell) {
  display: flex; /* 应用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center;
}
.icon-green {
  font-size: 20px;
  color: #67c23a;
}
.icon-yellow {
  font-size: 20px;
  color: #ffc400;
}
.icon-orange {
  font-size: 20px;
  color: #ff9900;
}
.icon-red {
  font-size: 20px;
  color: #e32e00;
}
.sku-text {
  :deep(.el-link__inner) {
    display: inline-block;
    // max-width: 190px;
    margin-right: 3px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    vertical-align: middle;
  }
}
.sku-container {
  .icon-div {
    display: flex;
    align-items: center;
    margin-top: -6px;

    .el-tooltip {
      margin-right: 6px;
    }
  }
}

// 日本国旗样式增加边框
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
}
.custom-tooltip-new {
  font-size: 16px;
}
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
