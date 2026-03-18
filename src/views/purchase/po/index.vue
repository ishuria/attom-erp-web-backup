<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="全部" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <!-- 使用按钮组件 -->
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :package-task-loading="releasePackageTaskLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="true"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @package-task-release="handlePackageTaskRelease"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <!-- 列设置面板 -->
            <div class="column-settings">
              <el-popover popper-style="max-height: 550px; overflow: auto;" :width="250">
                <template #reference>
                  <el-button>
                    <vab-icon icon="settings-line" />
                  </el-button>
                </template>

                <!-- 第一组：PO基本信息 -->
                <div class="drag-group">
                  <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: var(--el-text-color-primary)">PO</h4>
                  <div style="border: 1px solid var(--el-border-color-light); border-radius: 6px; margin-bottom: 12px; padding: 6px">
                    <vab-draggable
                      v-model="poBasicColumns"
                      :animation="200"
                      filter=".non-draggable"
                      :group="{ name: 'po-basic-group', pull: true, put: false }"
                      handle=".handle"
                      :on-end="handlePoBasicEnd"
                    >
                      <div
                        v-for="item in poBasicColumns"
                        :key="item.label"
                        :class="{ 'non-draggable': item.disableCheck }"
                        style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                      >
                        <vab-icon
                          class="handle"
                          :class="{ 'disabled-handle': item.disableCheck }"
                          icon="draggable"
                          style="margin-right: 5px"
                        />
                        <span style="flex: 1">{{ item.label }}</span>
                        <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                          <vab-icon icon="eye-line" />
                        </span>
                        <span
                          v-else
                          class="icon-hover"
                          style="display: flex; align-items: center; cursor: pointer"
                          @click="handleChecked(item)"
                        >
                          <vab-icon v-show="!item.checked" icon="eye-off-line" />
                          <vab-icon v-show="item.checked" icon="eye-line" />
                        </span>
                      </div>
                    </vab-draggable>
                  </div>
                </div>

                <!-- 第二组：SKU相关 -->
                <div class="drag-group">
                  <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: var(--el-text-color-primary)">SKU</h4>
                  <div style="border: 1px solid var(--el-border-color-light); border-radius: 6px; margin-bottom: 12px; padding: 6px">
                    <vab-draggable
                      v-model="skuColumns"
                      :animation="200"
                      filter=".non-draggable"
                      :group="{ name: 'sku-group', pull: true, put: false }"
                      handle=".handle"
                      :on-end="handleSkuEnd"
                    >
                      <div
                        v-for="item in skuColumns"
                        :key="item.label"
                        :class="{ 'non-draggable': item.disableCheck }"
                        style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                      >
                        <vab-icon
                          class="handle"
                          :class="{ 'disabled-handle': item.disableCheck }"
                          icon="draggable"
                          style="margin-right: 5px"
                        />
                        <span style="flex: 1">{{ item.label }}</span>
                        <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                          <vab-icon icon="eye-line" />
                        </span>
                        <span
                          v-else
                          class="icon-hover"
                          style="display: flex; align-items: center; cursor: pointer"
                          @click="handleChecked(item)"
                        >
                          <vab-icon v-show="!item.checked" icon="eye-off-line" />
                          <vab-icon v-show="item.checked" icon="eye-line" />
                        </span>
                      </div>
                    </vab-draggable>
                  </div>
                </div>

                <!-- 第三组：零件和其他信息 -->
                <div class="drag-group">
                  <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: var(--el-text-color-primary)">零件</h4>
                  <div style="border: 1px solid var(--el-border-color-light); border-radius: 6px; margin-bottom: 12px; padding: 6px">
                    <vab-draggable
                      v-model="componentColumns"
                      :animation="200"
                      filter=".non-draggable"
                      :group="{ name: 'component-group', pull: true, put: false }"
                      handle=".handle"
                      :on-end="handleComponentEnd"
                    >
                      <div
                        v-for="item in componentColumns"
                        :key="item.label"
                        :class="{ 'non-draggable': item.disableCheck }"
                        style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                      >
                        <vab-icon
                          class="handle"
                          :class="{ 'disabled-handle': item.disableCheck }"
                          icon="draggable"
                          style="margin-right: 5px"
                        />
                        <span style="flex: 1">{{ item.label }}</span>
                        <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                          <vab-icon icon="eye-line" />
                        </span>
                        <span
                          v-else
                          class="icon-hover"
                          style="display: flex; align-items: center; cursor: pointer"
                          @click="handleChecked(item)"
                        >
                          <vab-icon v-show="!item.checked" icon="eye-off-line" />
                          <vab-icon v-show="item.checked" icon="eye-line" />
                        </span>
                      </div>
                    </vab-draggable>
                  </div>
                </div>
              </el-popover>
            </div>
            <!-- 使用查询表单组件 -->
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <!-- 使用表格组件 -->
        <po-table
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          :component-columns="componentColumns"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :po-basic-columns="poBasicColumns"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="true"
          :sku-columns="skuColumns"
          :span-method="objectSpanMethod"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handlePoDetail"
          @preview-image="showPreviewImage"
          @remittan-check="handleremittanceCheck"
          @row-click="handleRowClick"
          @select-all-po-row="handleSelectAllPoRow"
          @selected-po-row="handleSelectedPoRow"
          @selection-change="handleSelectionChange"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="待付款" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <!-- 使用按钮组件 -->
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="false"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <!-- 使用查询表单组件 -->
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <!-- 使用固定列表格组件 -->
        <po-fixed-table
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="true"
          :span-method="objectSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handlePoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @select-all-po-row="handleSelectAllPoRow"
          @selected-po-row="handleSelectedPoRow"
          @selection-change="handleSelectionChange"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="部分付款" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <!-- 使用按钮组件 -->
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="false"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <!-- 使用查询表单组件 -->
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <!-- 使用固定列表格组件 -->
        <po-fixed-table
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="true"
          :span-method="objectSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handlePoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @select-all-po-row="handleSelectAllPoRow"
          @selected-po-row="handleSelectedPoRow"
          @selection-change="handleSelectionChange"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已付全款" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="false"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <po-fixed-table
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="true"
          :span-method="objectSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handlePoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @select-all-po-row="handleSelectAllPoRow"
          @selected-po-row="handleSelectedPoRow"
          @selection-change="handleSelectionChange"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="超额付款" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="false"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <po-fixed-table
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="true"
          :span-method="objectSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handlePoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @select-all-po-row="handleSelectAllPoRow"
          @selected-po-row="handleSelectedPoRow"
          @selection-change="handleSelectionChange"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已完结" :name="6">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <po-action-buttons
              :batch-refund-full-loading="batchRefundFullLoading"
              :current-role-code="currentRoleCode"
              :del-loading="delLoading"
              :full-payment-loading="fullPaymentLoading"
              :generate-contract-loading="generateContractLoading"
              :installment-loading="installmentLoading"
              :merge-contract-loading="mergeContractLoading"
              :money-transfer-loading="moneyTransferLoading"
              :price-sharing-loading="priceSharingLoading"
              :procurement-bonus="procurementBonus"
              :procurement-bonus-cross-month="procurementBonusCrossMonth"
              :reduce-cost-loading="reduceCostLoading"
              :refund-loading="refundLoading"
              :show-bonus-info="true"
              :show-common-buttons="true"
              :show-package-task-button="false"
              :show-payment-buttons="true"
              :special-del-loading="specialDelLoading"
              :tax-included-total-price="taxIncludedTotalPrice"
              @add-automatic-payment="handleAddAutomaticPayment"
              @automatic-payment-preview="handleAutomaticPaymentPreview"
              @automatic-signature="handleShowAutomaticSignature"
              @batch-refund-full="handleBatchRefundFull"
              @delete="handleDelPo"
              @generate-contract="handleGenerateContract"
              @generate-money-transfer="handleShowGenerateMoneyTransfer"
              @installment="handleShowInstallment"
              @merge-contract="handleShowMergeContract"
              @payment-paid="handlePaymentPaid"
              @reduce-cost="handleReduceCost"
              @refund="handleShowRefund"
              @remittan-check="handleremittanceCheck"
              @special-delete="handleSpecialDelPo"
              @total-price-sharing="handleShowTotalPriceSharing"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <po-fixed-table
          :cell-class-name="getLastTwoCellClass"
          :cell-style="lastTwoTabCellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="true"
          :show-po-operation="false"
          :span-method="lastTowTabSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handleDelPoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已删除" :name="7">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <po-query-form
              :list-loading="listLoading"
              :publisher-options="publisherOptions"
              :query-form="queryForm"
              @input="debouncedQueryData"
              @query="queryData"
            />
          </vab-query-form-right-panel>
        </vab-query-form>
        <po-fixed-table
          :cell-class-name="getLastTwoCellClass"
          :cell-style="lastTwoTabCellStyle"
          :data="poList"
          :handle-calculate-width="handleCalculateWidth"
          :lazy-load-image="true"
          :list-loading="listLoading"
          :page-no="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :row-class-name="stripedRowClass"
          :show-comp-operation="false"
          :show-po-operation="false"
          :span-method="lastTowTabSpanMethod"
          :table-column-width="tableColumnWidth"
          :total="total"
          @clipboard="handleClipboard"
          @current-change="handleCurrentChange"
          @po-detail="handleDelPoDetail"
          @preview-image="showPreviewImage"
          @row-click="handleRowClick"
          @show-payment-history="handleShowPaymentHistory"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 付款记录表 -->
    <vab-dialog
      v-model="paymentHistoryVisible"
      v-permissions="{ permission: [PoPermission.PAY_RECORD] }"
      :before-close="handleClosePaymentHistoryDialog"
      class="moldDialog"
      title="付款记录"
      width="50%"
    >
      <el-divider style="margin-top: 0; margin-bottom: 20px" />
      <div>
        <el-table
          border
          :cell-class-name="payHistoryCellClass"
          :cell-style="{ textAlign: 'center' }"
          class="payRecord"
          :data="paymentProgressList"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
        >
          <el-table-column label="付款日期" min-width="180" prop="createTime" />
          <el-table-column label="付款金额" min-width="130" prop="payPrice">
            <!-- <template #default="{ row }">
              <el-input v-model="row.payPrice" class="input-center" :disabled="delDisabled" @change="handleUpdatePrice(row)" />
            </template> -->
          </el-table-column>
          <el-table-column label="付款百分比" min-width="130" prop="percentage">
            <template #default="{ row }">{{ row.percentage }}%</template>
          </el-table-column>
          <el-table-column label="类型" min-width="80" prop="type">
            <template #default="{ row }">
              <el-tag :type="row.type === 0 ? 'success' : 'danger'">{{ row.type === 0 ? '付款' : '退款' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="退款凭证" prop="refundVoucher" width="89">
            <template #default="{ row }">
              <el-image
                fit="contain"
                :src="row.refundVoucher"
                style="display: block; width: 89px; height: 82px"
                @click="showPreviewImage(row.refundVoucher)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作人" min-width="130" prop="createUser" />
          <!-- <el-table-column v-if="!delDisabled" label="操作" min-width="100" prop="operate">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDelPayRecord(row, $index)">删除</el-button>
            </template>
          </el-table-column> -->
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </div>
      <template #footer></template>
    </vab-dialog>
    <!-- 分批付款 -->
    <vab-dialog v-model="installmentVisible" :before-close="handleCloseInstallmentDialog" class="moldDialog" title="分批付款" width="20%">
      <el-divider class="divider-margin" />
      <el-form
        ref="installmentFormRef"
        class="form-center"
        label-position="top"
        label-width="auto"
        :model="installmentForm"
        :rules="installmentFormRules"
      >
        <el-form-item label="百分比" prop="percent">
          <el-input v-model="installmentForm.percent" clearable @input="handleComputePrice" />
        </el-form-item>
        <el-form-item v-if="installmentMoneyVisible" label="金额" prop="price">
          <el-input v-model="installmentForm.price" clearable @input="handleComputePercent" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseInstallmentDialog">关闭</el-button>
        <el-button :loading="installmentLoading" type="primary" @click="handleConfirmInstallment">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 退款 -->
    <vab-dialog v-model="refundVisible" :before-close="handleCloseRefundDialog" class="moldDialog" title="退款" width="20%">
      <el-divider class="divider-margin" />
      <el-form ref="refundRef" class="form-center" label-position="top" label-width="auto" :model="refundForm" :rules="refundRules">
        <el-form-item label="百分比" prop="percent">
          <el-input v-model="refundForm.percent" clearable @input="handleComputeRefundPrice" />
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="refundForm.price" clearable @input="handleComputeRefundPercent" />
        </el-form-item>
        <el-form-item label="凭证上传" prop="refundVoucher">
          <div class="image-cell">
            <!-- 有图片时显示 -->
            <div v-if="refundForm.refundVoucher" class="image-preview">
              <img alt="" :src="refundForm.refundVoucher" />
              <div class="image-actions">
                <el-icon @click="handlePreview(refundForm.refundVoucher)"><zoom-in /></el-icon>
                <el-icon @click="handleRefundVoucherRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="imageUploadVisible = true">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseRefundDialog">关闭</el-button>
        <el-button :loading="refundLoading" type="primary" @click="handleConfirmRefund">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 批量退全款 -->
    <vab-dialog
      v-model="batchRefundFullVisible"
      :before-close="handleCloseBatchRefundFullDialog"
      class="moldDialog"
      title="批量退全款"
      width="25%"
    >
      <el-form
        ref="batchRefundFullRef"
        class="form-center"
        label-position="top"
        label-width="auto"
        :model="batchRefundForm"
        :rules="batchRefundFullRules"
      >
        <el-form-item>
          <el-statistic
            class="compact-statistic"
            :formatter="(val: number) => Number(val || 0).toFixed(2)"
            title="已付总金额"
            :value="Number(batchRefundForm.totalPayPrice) || 0"
          />
        </el-form-item>
        <el-form-item label="凭证上传" prop="refundVoucher">
          <div class="image-cell">
            <!-- 有图片时显示 -->
            <div v-if="batchRefundForm.refundVoucher" class="image-preview">
              <img alt="" :src="batchRefundForm.refundVoucher" />
              <div class="image-actions">
                <el-icon @click="handlePreview(batchRefundForm.refundVoucher)"><zoom-in /></el-icon>
                <el-icon @click="handleBatchRefundVoucherRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="imageUploadVisible = true">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseBatchRefundFullDialog">关闭</el-button>
        <el-button :loading="batchRefundFullLoading" type="primary" @click="handleConfirmBatchRefundFull">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 总价分摊 -->
    <vab-dialog
      v-model="totalPriceSharingVisible"
      :before-close="handleCloseTotalPriceSharingDialog"
      class="moldDialog"
      title="总价分摊"
      width="20%"
    >
      <el-divider class="divider-margin" />
      <el-form
        ref="totalPriceSharingFormRef"
        class="form-center"
        label-position="top"
        label-width="auto"
        :model="totalPriceSharingForm"
        :rules="totalPriceSharingRules"
      >
        <el-form-item label="总含税价" prop="tax">
          <el-input v-model="totalPriceSharingForm.tax" clearable />
        </el-form-item>
        <el-form-item label="总含税运费" prop="shippingFee">
          <el-input v-model="totalPriceSharingForm.shippingFee" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseTotalPriceSharingDialog">关闭</el-button>
        <el-button :loading="priceSharingLoading" type="primary" @click="handleConfirmTotalPriceSharing">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 聚合合同 -->
    <vab-dialog
      v-model="mergeContractVisible"
      :before-close="handleCloseMergeContractDialog"
      class="moldDialog"
      title="聚合合同-请上传需要聚合的合同"
      width="35%"
    >
      <el-divider class="divider-margin" />
      <el-form class="form-center">
        <el-form-item>
          <el-upload
            v-model:file-list="contractList"
            action="#"
            :auto-upload="false"
            class="upload-width"
            drag
            multiple
            :show-file-list="true"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖拽至此处或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseMergeContractDialog">关闭</el-button>
        <el-button :loading="mergeContractLoading" type="primary" @click="handleConfirmMergeContract">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 生成汇款模板 -->
    <vab-dialog
      v-model="generateMoneyTransferVisible"
      :before-close="handleCloseGenerateMoneyTransferDialog"
      class="moldDialog"
      title="生成汇款模板"
      width="30%"
    >
      <el-divider class="divider-margin" />
      <el-form class="form-center" label-position="top" label-width="auto">
        <el-form-item label="日期">
          <el-date-picker
            v-model="generateMoneyTransferTime"
            :default-time="defaultTime2"
            :disabled-date="disabledDate"
            :editable="false"
            end-placeholder="结束日期"
            format="YYYY-MM-DD HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseGenerateMoneyTransferDialog">关闭</el-button>
        <el-button :loading="moneyTransferLoading" type="primary" @click="handleConfirmGenerateMoneyTransfer">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 自动签收设定 -->
    <vab-automatic-signature
      :automatic-signature-visible="automaticSignatureVisible"
      @update:automatic-signature-visible="handleCloseAutomaticSignature"
    />
    <!-- 降本提成申请 -->
    <vab-dialog v-model="reductionCostVisible" title="降本提成申请" width="20%" @close="closeReductionCost">
      <vab-alert show-icon type="info">
        <div class="alert-content">
          <div class="rule-item">
            <span>本月及下月4号之前完成降本提成申请</span>
          </div>
        </div>
      </vab-alert>
      <el-form ref="reductionCostFormRef" :model="reductionCostForm" :rules="reductionCostFormRules" style="margin: 0">
        <el-form-item label="优化前价格" prop="beforePrice">
          <el-input v-model="reductionCostForm.beforePrice" type="number" />
        </el-form-item>
        <el-form-item label="优化后价格" prop="afterPrice">
          <el-input v-model="reductionCostForm.afterPrice" type="number" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="reductionCostForm.remark" :rows="20" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeReductionCost">取消</el-button>
        <el-button :loading="reduceCostLoading" type="primary" @click="confirmReductionCost">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 发布打包任务 -->
    <vab-dialog
      v-model="releaseNewPackageTaskVisible"
      class="moldDialog"
      title="发布打包任务"
      width="20%"
      @close="handleClosePackageTaskReleaseDialog"
    >
      <el-divider class="divider-margin" />
      <el-form class="form-center" label-position="top" label-width="auto" :model="releaseNewPackageTaskForm">
        <el-form-item label="打包任务数量" prop="tax">
          <el-input v-model="releaseNewPackageTaskForm.count" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="releasePackageTaskLoading" type="primary" @click="handleConfirmReleaseNewPackageTask">确认</el-button>
      </template>
    </vab-dialog>

    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
    <!-- 添加自动付款 -->
    <vab-add-automatic-payment v-model="addAutomaticPaymentVisible" />
    <!-- 自动付款预览 -->
    <automatic-payment-preview
      v-model="automaticPaymentPreviewVisible"
      :pay-auto-loading="payAutoLoading"
      @submit-auto-pay="handleSubmitAutoPay"
    />
    <vab-remittance-check v-model="remittanceCheckVisible" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, UploadFilled, ZoomIn } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type TabsPaneContext, dayjs } from 'element-plus'
import { debounce } from 'lodash-es'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { downloadFile } from '/@/api/devlocal/download'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import {
  aggregationContract,
  applyPurchaseReductionCost,
  batchComponentRefund,
  checkPurchasePo,
  delPayRecord,
  deletePo,
  generatePoContract,
  generateRemittance,
  getComponentPayRecord,
  getPoList,
  getPoPublisherList,
  getPurchaseBonus,
  getPurchaseCostReduction,
  purchaseAutoPaySubmit,
  purchaseTotalAp,
  releasePackageTask,
  specialDeletePo,
  updateComponentAllPay,
  updateComponentPayPart,
  updateComponentRefund,
  updatePayRecord,
} from '/@/api/devlocal/purchasePo'
import PoPermission from '/@/permissions/po'
import { useAclStore } from '/@/store/modules/acl'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import handleClipboard from '/@/utils/clipboard'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Po',
})

const remittanceCheckVisible = ref<boolean>(false)
const handleremittanceCheck = () => {
  remittanceCheckVisible.value = true
}

// 添加自动付款
const addAutomaticPaymentVisible = ref<boolean>(false)
const automaticPaymentPreviewVisible = ref<boolean>(false)
const handleAddAutomaticPayment = () => {
  addAutomaticPaymentVisible.value = true
}
const handleAutomaticPaymentPreview = () => {
  automaticPaymentPreviewVisible.value = true
}
const imageUploadVisible = ref<boolean>(false)
const disabledDate = (time: Date) => {
  const date = dayjs(time)
  const now = dayjs()
  // 不能选择晚于今天的日期
  return date.isAfter(now, 'day')
}
const currentRoleCode = useAclStore().getRole[0]
const procurementBonus = ref<number>(0)
const procurementBonusCrossMonth = ref<number>(0)
const _poComponentId = ref<number>(0)
const reductionCostVisible = ref<boolean>(false)

const releaseNewPackageTaskVisible = ref<boolean>(false)
const releasePackageTaskLoading = ref<boolean>(false)
const releaseNewPackageTaskForm = reactive<any>({})

const handleConfirmReleaseNewPackageTask = async () => {
  try {
    releasePackageTaskLoading.value = true
    const poArr = [...selectedPORow.value]
    const { data } = await releasePackageTask({
      poId: poArr[0],
      count: releaseNewPackageTaskForm.count,
    })
    if (data) {
      $baseMessage('Po打包任务发布成功！', 'success')
      handleClosePackageTaskReleaseDialog()
    }
  } catch (error) {
    console.error(error)
  } finally {
    releaseNewPackageTaskForm.count = null
    releasePackageTaskLoading.value = false
  }
}

const reductionCostForm = reactive<any>({})
const reductionCostFormRef = ref<FormInstance>()
const reductionCostFormRules = reactive<FormRules>({
  beforePrice: [{ required: true, message: '请输入优化前价格！', trigger: 'blur' }],
  afterPrice: [{ required: true, message: '请输入优化后价格！', trigger: 'blur' }],
})
const payAutoLoading = ref<boolean>(false)
const handleSubmitAutoPay = async () => {
  try {
    payAutoLoading.value = true
    const { data } = await purchaseAutoPaySubmit()
    if (data) {
      automaticPaymentPreviewVisible.value = false
      $baseMessage('提交自动付款成功！', 'success')
      // 提交成功后刷新数据
      await fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    payAutoLoading.value = false
  }
}
const closeReductionCost = () => {
  reductionCostFormRef.value?.resetFields()
  reductionCostVisible.value = false
}
const reduceCostLoading = ref<boolean>(false)
const confirmReductionCost = async () => {
  reductionCostFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      try {
        reduceCostLoading.value = true
        const { data } = await applyPurchaseReductionCost({
          poComponentId: _poComponentId.value,
          beforePrice: Number(reductionCostForm.beforePrice),
          afterPrice: Number(reductionCostForm.afterPrice),
          remark: reductionCostForm.remark
        })
        if (data) {
          $baseMessage('降本提成申请成功！', 'success')
          closeReductionCost()
        }
      } catch (error) {
        console.error(error)
      } finally {
        reduceCostLoading.value = false
      }
    }
  })
}
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
// 合同列表
const contractList = ref<any>([])

const activeName = ref<number>(0)
const defaultTime2: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)] // '12:00:00', '08:00:00'

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 采购订单数据
const poList = ref<any>([])
// po选中的行
const selectedPORow = ref<Set<number>>(new Set())
// po选中的行转化为数组（使用 computed 按需计算，避免每次选择都更新）
const selectedPOArray = computed(() => {
  return Array.from(selectedPORow.value)
})

// component选中的行转化为数组
const selectedCompArray = ref<any>([])
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 付款进度显示与否
const paymentHistoryVisible = ref<boolean>(false)
// 付款进度表数据
const paymentProgressList = ref<any>([])
// 分批付款显示与否
const installmentVisible = ref<boolean>(false)
// 分批付款中的金额是否可见
const installmentMoneyVisible = ref<boolean>(false)
// 分批付款表单
const installmentForm = reactive<any>({
  percent: null,
  price: null,
})
// 分批付款rule
const installmentFormRules = reactive<any>({
  percent: [{ required: 'true', message: '请输入百分比', trigger: 'blur' }],
  price: [{ required: 'true', message: '请输入金额', trigger: 'blur' }],
})
// 分批付款表单ref
const installmentFormRef = ref<FormInstance>()
// 退款显示与否
const refundVisible = ref<boolean>(false)
// 退款表单
const refundForm = reactive<any>({
  percent: null,
  price: null,
  refundVoucher: null,
})
// 退款rule
const refundRules = reactive<any>({
  percent: [{ required: 'true', message: '请输入百分比', trigger: 'blur' }],
  price: [{ required: 'true', message: '请输入金额', trigger: 'blur' }],
  refundVoucher: [{ required: 'true', message: '请上传退款凭证', trigger: 'change' }],
})
// 退款ref
const refundRef = ref<FormInstance>()
// 批量退全款规则
const batchRefundFullRules = reactive<any>({
  refundVoucher: [{ required: 'true', message: '请上传退款凭证', trigger: 'change' }],
})
// 批量退全款显示与否
const batchRefundFullVisible = ref<boolean>(false)
// 批量退全款表单
const batchRefundForm = reactive<any>({
  componentCount: 0,
  totalPayPrice: 0,
  refundVoucher: null,
  refundVoucherFile: null,
})
// 批量退全款表单ref
const batchRefundFullRef = ref<FormInstance>()
// 总价分摊显示与否
const totalPriceSharingVisible = ref<boolean>(false)
// 总价分摊表单数据
const totalPriceSharingForm = reactive<any>({
  tax: null,
  shippingFee: null,
})
// 总价分摊表单ref
const totalPriceSharingFormRef = ref<FormInstance>()
// 总价分摊rules
const totalPriceSharingRules = reactive<any>({
  tax: [{ required: true, message: '总含税价不能为空', trigger: 'blur' }],
})
// 聚合合同显示与否
const mergeContractVisible = ref<boolean>(false)
// 生成汇款模板显示与否
const generateMoneyTransferVisible = ref<boolean>(false)
// 生成汇款日期时间
const generateMoneyTransferTime = ref<string>('')
// 自动签收显示与否
const automaticSignatureVisible = ref<boolean>(false)
// 付款进度传的row
const payHistoryRow = ref<any>()
// 特殊Po删除loading
const specialDelLoading = ref<boolean>(false)
const tableColumnWidth = ref<number>(90)
// 含税价格合计
// const taxIncludedTotalPrice = ref<number>(0)
// 防抖处理
const debouncedQueryData = debounce(() => {
  queryData()
}, 700)
const calculateColumnWidth = () => {
  tableColumnWidth.value = 90
  const records = poList.value.map((row: any) => row.paymentRecord)
  let maxWidth = 0
  records.forEach((record: any) => {
    // 分割成段落
    const paragraphs = record.split(/<br\s*\/?>/)
    paragraphs.forEach((paragraph: string) => {
      const tempDiv = document.createElement('div')
      tempDiv.style.visibility = 'hidden'
      tempDiv.style.position = 'absolute'
      tempDiv.style.whiteSpace = 'nowrap' // 避免换行
      tempDiv.innerHTML = paragraph // 使用原段落
      document.body.appendChild(tempDiv)
      const width = tempDiv.getBoundingClientRect().width
      // console.log(paragraph, width);
      if (width > maxWidth) {
        maxWidth = width
      }
      document.body.removeChild(tempDiv)
    })
  })
  if (maxWidth < tableColumnWidth.value) {
    tableColumnWidth.value = 90
  } else {
    tableColumnWidth.value = maxWidth + 26 // 添加一些额外空间
  }
}
const handleSelectedPoRow = (event: any, row: any) => {
  const rowId = row.id
  if (event) {
    selectedPORow.value.add(rowId)
  } else {
    selectedPORow.value.delete(rowId)
  }
}
// 全选po操作列 - 优化版本（使用批量更新减少响应式更新）
const handleSelectAllPoRow = (event: any) => {
  if (event) {
    // 批量添加所有 ID 到 Set
    const allIds = new Set(poList.value.map((item: any) => item.id) as number[])
    selectedPORow.value = allIds as Set<number>
    // 使用 nextTick 批量更新 UI 状态，减少响应式更新次数
    nextTick(() => {
      poList.value.forEach((item: any) => {
        item.selectedPoRow = true
      })
    })
  } else {
    // 清空选择
    selectedPORow.value.clear()
    nextTick(() => {
      poList.value.forEach((item: any) => {
        item.selectedPoRow = false
      })
    })
  }
}
// 使用 computed 自动计算总价，避免手动累加
const taxIncludedTotalPrice = computed(() => {
  const total = selectedCompArray.value.reduce((total: number, item: any) => {
    return total + Number(item.taxIncludedPrice || 0)
  }, 0)
  return Number(total.toFixed(2))
})

// 提取 componentIds 和 poIds（用于传递到后端）
const selectedComponentIds = computed(() => {
  return selectedCompArray.value.map((item: any) => item.componentId).join(',')
})

const selectedPoIds = computed(() => {
  return Array.from(new Set(selectedCompArray.value.map((item: any) => item.id))).join(',')
})

const handleSelectionChange = (rows: any[]) => {
  selectedCompArray.value = rows
}
// 付款进度是否修改
let flag = false
// 关闭付款进度弹窗
const handleClosePaymentHistoryDialog = () => {
  // 如果有修改，在重刷数据
  if (flag) {
    fetchData()
  }
  paymentHistoryVisible.value = false
}
// 付款进度是否可编辑
const delDisabled = ref<boolean>(false)
const copyRow = ref<any>()
// 展示付款进度弹窗
const handleShowPaymentHistory = async (row: any) => {
  copyRow.value = row
  if (activeName.value === 7) {
    delDisabled.value = true
  } else {
    delDisabled.value = false
  }
  flag = false
  try {
    const { data } = await getComponentPayRecord({
      poSkuComponentId: row.componentId,
    })
    if (data) {
      paymentProgressList.value = data
      paymentProgressList.value.forEach((item: any) => {
        item.percentage = parseInt(item.percentage.replace('%', ''))
      })
      paymentHistoryVisible.value = true
      payHistoryRow.value = row
    }
  } catch (error) {
    console.error(error)
  }
}
// 修改付款进度
const handleUpdatePrice = async (row: any) => {
  try {
    const { data } = await updatePayRecord({
      id: row.id,
      price: row.payPrice,
    })
    if (data === true) {
      flag = true
    }
  } catch (error) {
    console.error(error)
  }
}
// 删除付款进度
const handleDelPayRecord = async (row: any, index: number) => {
  try {
    const { data } = await delPayRecord({
      id: row.id,
      poId: copyRow.value.id,
    })
    if (data === true) {
      flag = true //删除了也是修改
      $baseMessage('删除该条付款记录成功', 'success', 'hey')
      paymentProgressList.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  }
}
const fullPaymentLoading = ref<boolean>(false)
// 处理已付尾款/全款
const handlePaymentPaid = async () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  try {
    fullPaymentLoading.value = true
    const { data } = await updateComponentAllPay({
      componentIds: selectedComponentIds.value,
      poIds: selectedPoIds.value,
    })
    if (data === true) {
      $baseMessage('已付尾款/全款成功', 'success', 'hey')
      fetchData() //重新刷新表格
      clearTableSelect()
    }
  } catch (error) {
    console.error(error)
  } finally {
    fullPaymentLoading.value = false
  }
}
// 展示分批付款弹窗
const handleShowInstallment = () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  } else if (selectedCompArray.value.length === 1) {
    //只选择了一行，全展示
    installmentMoneyVisible.value = true
  } else {
    installmentMoneyVisible.value = false
  }
  installmentVisible.value = true
}
// 计算分批付款的金额
const handleComputePrice = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    // 金额 = 含税总价 * (百分比 / 100)
    installmentForm.price = (tax * (Number(value) / 100)).toFixed(2)
  }
}
// 计算分批付款的百分比
const handleComputePercent = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    installmentForm.percent = ((Number(value) / tax) * 100).toFixed(2)
  }
}
// 关闭分批付款弹窗
const handleCloseInstallmentDialog = () => {
  installmentFormRef.value?.resetFields()
  installmentVisible.value = false
}
// 清除表格选择
const clearTableSelect = () => {
  poList.value.forEach((item: any) => {
    item.selectedPoRow = false
  })
  selectedPORow.value.clear()

  // 原生选择列会自动处理选中状态，这里只需要清除数组
  selectedCompArray.value = []

  // // 重置含税价格合计
  // taxIncludedTotalPrice.value = 0
}
const installmentLoading = ref<boolean>(false)
// 确认分批付款
const handleConfirmInstallment = async () => {
  installmentFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        installmentLoading.value = true
        const { data } = await updateComponentPayPart({
          componentInfo: {
            componentIds: selectedComponentIds.value,
            poIds: selectedPoIds.value,
          },
          unitPrice: installmentForm.price,
          percentage: installmentForm.percent,
        })
        if (data === true) {
          $baseMessage('分批付款成功', 'success', 'hey')
          handleCloseInstallmentDialog()
          fetchData() //重新刷新表格
          clearTableSelect()
        }
      } catch (error) {
        console.error(error)
      } finally {
        installmentLoading.value = false
      }
    }
  })
}

// 展示退款弹窗
const handleShowRefund = () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  // 如果勾选多个零件行，报错
  if (selectedCompArray.value.length > 1) {
    $baseMessage('退款只能勾选一行', 'warning')
    return
  }
  refundForm.hide = false
  refundForm.imageList = []
  refundVisible.value = true
}
// 计算退款的金额
const handleComputeRefundPrice = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    // 金额 = 含税总价 * (百分比 / 100)
    refundForm.price = (tax * (Number(value) / 100)).toFixed(2)
  }
}
// 计算退款的百分比
const handleComputeRefundPercent = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    refundForm.percent = ((Number(value) / tax) * 100).toFixed(2)
  }
}
/**
 * 上传图片
 */
async function uploadImage(file: File) {
  const fileUrl = URL.createObjectURL(file)

  // 如果批量退全款弹窗是打开的，保存到批量退全款表单
  if (batchRefundFullVisible.value) {
    batchRefundForm.refundVoucher = fileUrl
    batchRefundForm.refundVoucherFile = file
  } else {
    // 保存文件对象用于后续上传
    refundForm.refundVoucher = fileUrl
    // 如果需要保存原始文件对象用于后续处理，可以添加一个新属性
    refundForm.refundVoucherFile = file
  }
  imageUploadVisible.value = false
}
// 退款凭证图片预览事件
const handlePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 删除退款凭证
const handleRefundVoucherRemove = () => {
  refundForm.refundVoucher = null
}
// 关闭退款弹窗
const handleCloseRefundDialog = () => {
  refundRef.value?.resetFields()
  refundVisible.value = false
}
const refundLoading = ref<boolean>(false)
const batchRefundFullLoading = ref<boolean>(false)
// 展示批量退全款弹窗
const handleBatchRefundFull = () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  // 计算选中行的已付金额总和和数量
  const totalPayPrice = selectedCompArray.value.reduce((sum: number, item: any) => {
    return sum + Number(item.payPrice || 0)
  }, 0)
  batchRefundForm.componentCount = selectedCompArray.value.length
  batchRefundForm.totalPayPrice = totalPayPrice.toFixed(2)
  batchRefundForm.refundVoucher = null
  batchRefundForm.refundVoucherFile = null
  batchRefundFullVisible.value = true
}
// 删除批量退全款凭证
const handleBatchRefundVoucherRemove = () => {
  batchRefundForm.refundVoucher = null
  batchRefundForm.refundVoucherFile = null
}
// 关闭批量退全款弹窗
const handleCloseBatchRefundFullDialog = () => {
  batchRefundFullRef.value?.resetFields()
  batchRefundFullVisible.value = false
}
// 确认批量退全款
const handleConfirmBatchRefundFull = async () => {
  batchRefundFullRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        batchRefundFullLoading.value = true

        let formData = new FormData()
        formData.append('componentIds', selectedComponentIds.value)
        formData.append('poIds', selectedPoIds.value)
        formData.append('file', batchRefundForm.refundVoucherFile)

        const { data } = await batchComponentRefund(formData)
        if (data === true) {
          $baseMessage('批量退全款成功', 'success', 'hey')
          handleCloseBatchRefundFullDialog()
          fetchData()
          clearTableSelect()
        }
      } catch (error) {
        console.error(error)
      } finally {
        batchRefundFullLoading.value = false
      }
    }
  })
}
// 确认退款
const handleConfirmRefund = async () => {
  refundRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        refundLoading.value = true
        let formData = new FormData()
        formData.append('unitPrice', refundForm.price)
        formData.append('percentage', refundForm.percent)
        formData.append('file', refundForm.refundVoucherFile)
        formData.append('componentIds', `${selectedCompArray.value[0].componentId}`)
        formData.append('poIds', selectedCompArray.value[0].id)
        const { data } = await updateComponentRefund(formData)
        if (data === true) {
          $baseMessage('退款提交成功', 'success', 'hey')
          handleCloseRefundDialog()
          fetchData() //重新刷新表格
          clearTableSelect()
        }
      } catch (error) {
        console.error(error)
      } finally {
        refundLoading.value = false
      }
    }
  })
}

// 发布打包任务按钮
const handlePackageTaskRelease = () => {
  if (selectedPORow.value.size === 0) {
    $baseMessage('您未选中Po任何行！', 'warning')
    return
  }

  if (selectedPORow.value.size > 1) {
    $baseMessage('不能一次性发布多个打包任务！', 'warning')
    return
  }

  releaseNewPackageTaskVisible.value = true
}

// 关闭发布打包任务弹窗
const handleClosePackageTaskReleaseDialog = () => {
  releaseNewPackageTaskVisible.value = false
}

// 展示总价分摊弹窗
const handleShowTotalPriceSharing = () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  totalPriceSharingVisible.value = true
}
// 关闭总价分摊弹窗
const handleCloseTotalPriceSharingDialog = () => {
  totalPriceSharingFormRef.value?.resetFields()
  totalPriceSharingVisible.value = false
}
const priceSharingLoading = ref<boolean>(false)
// 提交总价分摊
const handleConfirmTotalPriceSharing = async () => {
  totalPriceSharingFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        const hasPay = selectedCompArray.value.some((item: any) => Number(item.payPrice) > 0)
        if (hasPay) {
          $baseMessage('已经付款的零件不能进行总价分摊', 'warning')
          return
        }
        priceSharingLoading.value = true
        const { data } = await purchaseTotalAp({
          componentIds: selectedComponentIds.value,
          totalMoney: totalPriceSharingForm.tax,
          totalFreight: totalPriceSharingForm.shippingFee,
        })
        if (data === true) {
          $baseMessage('总价分摊提交成功', 'success')
          handleCloseTotalPriceSharingDialog()
          fetchData() //重新刷新表格
          clearTableSelect()
        }
      } catch (error) {
        console.error(error)
      } finally {
        priceSharingLoading.value = false
      }
    }
  })
}
const generateContractLoading = ref<boolean>(false)
// 处理生成合同
const handleGenerateContract = async () => {
  // 如果没有选中行
  if (selectedPORow.value.size === 0 && selectedCompArray.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  generateContractLoading.value = true
  // 获取选中的poIds
  const poIds = selectedPOArray.value.join(',')
  let poSkuComponentId: number[] = []
  // console.log('poIds', poIds);
  // 如果poId没选
  if (poIds) {
    selectedPOArray.value.forEach((id: number) => {
      const index = selectedCompArray.value.findIndex((item: any) => item.id === id)
      const idArray = poList.value.filter((item: any) => item.id === id)
      // 如果零件Id一个也没选，就是传所有
      if (index === -1) {
        poSkuComponentId = poSkuComponentId.concat(idArray.map((item: any) => item.componentId))
      } else {
        // 如果选了至少一个，就传这个
        poSkuComponentId = poSkuComponentId.concat(selectedCompArray.value.map((item: any) => item.componentId))
      }
    })
  } else {
    poSkuComponentId = selectedComponentIds.value.split(',').filter(Boolean)
  }

  try {
    const { data } = await generatePoContract({
      poIds,
      poSkuComponentIds: poSkuComponentId.join(','),
    })
    if (data) {
      clearTableSelect()
      $baseMessage('生成合同成功', 'success')
      // 下载合同
      for (let i = 0; i < data.length; i++) {
        const fileName = data[i]
        try {
          await downloadFile('/purchase/download', {
            fileName,
          })
          // 添加小延迟，避免浏览器阻止下载
          if (i < data.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.error(`下载失败: ${fileName}`, error)
        }
      }
      // data.forEach(async (fileName: string) => {
      //   await downloadFile('/purchase/download', {
      //     fileName,
      //   })
      //     .then((res) => {
      //       console.log(res)
      //     })
      //     .catch((error) => {
      //       console.error(error)
      //     })
      // })
    }
  } catch (error) {
    console.error(error)
  } finally {
    generateContractLoading.value = false
  }
}
// 展示聚合合同弹窗
const handleShowMergeContract = () => {
  mergeContractVisible.value = true
}
// 关闭聚合合同弹窗
const handleCloseMergeContractDialog = () => {
  contractList.value = []
  mergeContractVisible.value = false
}
const mergeContractLoading = ref<boolean>(false)
// 确认聚合合同
const handleConfirmMergeContract = async () => {
  // console.log(contractList.value);
  // console.log(formData);
  try {
    mergeContractLoading.value = true
    let formData = new FormData()
    contractList.value.forEach((item: any) => {
      formData.append('files', item.raw)
    })
    const { data } = await aggregationContract(formData)
    if (data) {
      $baseMessage('聚合合同成功', 'success')
      handleCloseMergeContractDialog()
      clearTableSelect()
      // 下载合同
      await downloadFile('/purchase/download', {
        fileName: data,
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
      // data.forEach(async (fileName: string) => {

      // })
    } else {
      $baseMessage('聚合合同失败', 'error')
    }
  } catch (error) {
    console.error(error)
  } finally {
    mergeContractLoading.value = false
  }
}
// 展示生成汇款模板弹窗
const handleShowGenerateMoneyTransfer = () => {
  generateMoneyTransferVisible.value = true
  generateMoneyTransferTime.value = ''
}
// 关闭生成汇款模板弹窗
const handleCloseGenerateMoneyTransferDialog = () => {
  generateMoneyTransferVisible.value = false
}
const moneyTransferLoading = ref<boolean>(false)
// 确认汇款
const handleConfirmGenerateMoneyTransfer = async () => {
  if (!generateMoneyTransferTime.value) {
    $baseMessage('请先填写汇款日期', 'error')
    return
  }
  moneyTransferLoading.value = true
  const startTime = generateMoneyTransferTime.value[0]
  const endTime = generateMoneyTransferTime.value[1]
  try {
    const { data } = await generateRemittance({
      startTime,
      endTime,
    })
    if (data) {
      $baseMessage('生成汇款模板成功', 'success')
      clearTableSelect()
      generateMoneyTransferVisible.value = false
      // 下载合同
      data.forEach(async (fileName: string) => {
        await downloadFile('/purchase/download', {
          fileName,
        })
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
            console.error(error)
          })
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    moneyTransferLoading.value = false
  }
}

// 降本提成申请PO
const handleReduceCost = async () => {
  // 判断是否选中零件操作
  if (selectedCompArray.value.length === 0) {
    $baseMessage('您未选中零件操作列的任何行！', 'warning')
    return
  }
  if (selectedCompArray.value.length > 1) {
    $baseMessage('只能选择零件操作列的任意一行！', 'warning')
    return
  }
  reductionCostVisible.value = true
  _poComponentId.value = selectedCompArray.value[0].componentId
  const { data } = await getPurchaseCostReduction({ poComponentId: _poComponentId.value })
  reductionCostForm.beforePrice = data.beforePrice
  reductionCostForm.afterPrice = data.afterPrice
}
// 打开自动签收设定弹窗
const handleShowAutomaticSignature = () => {
  automaticSignatureVisible.value = true
}
// 关闭自动签收设定弹窗
const handleCloseAutomaticSignature = (value: boolean) => {
  automaticSignatureVisible.value = value
}
const delLoading = ref<boolean>(false)
// 删除
const handleDelPo = async () => {
  if (selectedPORow.value.size === 0) {
    $baseMessage('您未选中PO操作列的任何行', 'warning')
    return
  }
  $baseConfirm('确定要删除该条PO吗? ', '系统提示', async () => {
    try {
      delLoading.value = true
      const ids = selectedPOArray.value.join(',')
      // console.log(ids);

      const { data } = await deletePo({ ids })
      if (data === true) {
        $baseMessage('删除该条PO成功', 'success', 'hey')
        fetchData() //重新刷新表格
        clearTableSelect()
      }
    } catch (error) {
      console.error(error)
    } finally {
      delLoading.value = false
    }
  })
}
// 特殊Po删除
const handleSpecialDelPo = async () => {
  if (selectedPORow.value.size === 0) {
    $baseMessage('您未选中PO操作列的任何行', 'warning')
    return
  }
  $baseConfirm('确定要特殊删除该条PO吗? ', '系统提示', async () => {
    try {
      specialDelLoading.value = true
      const ids = selectedPOArray.value.join(',')
      const { data } = await specialDeletePo({ ids })
      if (data === true) {
        $baseMessage('特殊删除该条PO成功', 'success', 'hey')
        fetchData() //重新刷新表格
        clearTableSelect()
      }
    } catch (error) {
      console.error(error)
    } finally {
      specialDelLoading.value = false
    }
  })
}
// 跳转po详情
const handlePoDetail = async (row: any) => {
  // console.log(queryForm.pageNo);
  // router.push({
  //   path: '/purchase/poDetail',
  //   query: {
  //     title: "采购订单详情",
  //     from: row.po,
  //     poSkuId: row.poSkuId,
  //     poId: row.id,
  //     timestamp: Date.now(),
  //   },
  // })
  let del = 'true'
  // 前置接口
  const { data } = await checkPurchasePo({ poId: row.id })
  if (data) {
    // po详情不能改
    del = 'true'
  } else {
    del = 'false'
  }

  // const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
  // const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef
  // const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef
  // const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef
  // const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef
  // const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef
  // const wrapRef = scrollBarRef.wrapRef
  // const wrapRef2 = scrollBarRef2.wrapRef
  // const wrapRef3 = scrollBarRef3.wrapRef
  // const wrapRef4 = scrollBarRef4.wrapRef
  // const wrapRef5 = scrollBarRef5.wrapRef
  // const wrapRef6 = scrollBarRef6.wrapRef
  // const poStatus = {
  //   scrollTop: wrapRef.scrollTop,
  //   scrollTop2: wrapRef2.scrollTop,
  //   scrollTop3: wrapRef3.scrollTop,
  //   scrollTop4: wrapRef4.scrollTop,
  //   scrollTop5: wrapRef5.scrollTop,
  //   scrollTop6: wrapRef6.scrollTop,
  // }
  // sessionStorage.setItem('poStatus', JSON.stringify(poStatus))

  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query: {
      title: `${row.po}`,
      from: row.po,
      poSkuId: row.poSkuId,
      poId: row.id,
      // timestamp: Date.now(),
    },
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query: {
        title: `${row.po}`,
        from: row.po,
        poSkuId: row.poSkuId,
        poId: row.id,
        del,
        // timestamp: Date.now(),
      },
    })
    await changeTabsMeta({
      title: 'PO详情',
      meta: {
        title: `${tab.query.from}`,
      },
    })
  }
  // console.log(tabsStore.getVisitedRoutes);
}
// 跳转po详情
const handleDelPoDetail = (row: any) => {
  // console.log(queryForm.pageNo);
  router.push({
    path: '/purchase/poDetail',
    query: {
      title: '采购订单详情',
      from: row.po,
      poSkuId: row.poSkuId,
      poId: row.id,
      // timestamp: Date.now(),
      del: 'true',
      tab: 'view',
    },
  })

  // const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
  // const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef
  // const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef
  // const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef
  // const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef
  // const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef
  // const wrapRef = scrollBarRef.wrapRef
  // const wrapRef2 = scrollBarRef2.wrapRef
  // const wrapRef3 = scrollBarRef3.wrapRef
  // const wrapRef4 = scrollBarRef4.wrapRef
  // const wrapRef5 = scrollBarRef5.wrapRef
  // const wrapRef6 = scrollBarRef6.wrapRef
  // const poStatus = {
  //   scrollTop: wrapRef.scrollTop,
  //   scrollTop2: wrapRef2.scrollTop,
  //   scrollTop3: wrapRef3.scrollTop,
  //   scrollTop4: wrapRef4.scrollTop,
  //   scrollTop5: wrapRef5.scrollTop,
  //   scrollTop6: wrapRef6.scrollTop,
  // }
  // sessionStorage.setItem('poStatus', JSON.stringify(poStatus))
}

const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const handleTabClick = (tab: TabsPaneContext) => {
  poList.value = []
  // tableRef.value?.clearSelection()
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name)
  }
  activeName.value = queryForm.status
  queryForm.pageNo = 1
  queryForm.pageSize = 50
  fetchData()
  router.push({
    query: {
      ...route.query,
      tab: tab.props.name,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  // taxIncludedTotalPrice.value = 0
}
//采购订单col合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (
    columnIndex === 0 ||
    label === 'PO' ||
    label === '数据来源' ||
    label === '发布日期' ||
    label === '发布人' ||
    label === '站点' ||
    label === '请购人'
  ) {
    const id = row.id

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].id !== id ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  // 合并 SKU 行
  if (label === '采购负责人' || label === 'SKU图片' || label === 'SKU' || label === '数量') {
    const poSkuId = row.poSkuId

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].poSkuId === poSkuId && poList.value[i].id === row.id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].poSkuId !== poSkuId || poList.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}
//后两个tab采购订单col合并方法
const lastTowTabSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (label === 'PO' || label === '数据来源' || label === '发布日期' || label === '发布人' || label === '站点' || label === '请购人') {
    const id = row.id

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].id !== id ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  // 合并 SKU 行
  if (label === 'SKU图片' || label === 'SKU' || label === '数量') {
    const poSkuId = row.poSkuId

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].poSkuId === poSkuId && poList.value[i].id === row.id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].poSkuId !== poSkuId || poList.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}
/**
 * 分页
 */
const route = useRoute()
// 总记录数
const total = ref<number>(0)

// 列配置数据
const poBasicColumns = ref<any>([])
const skuColumns = ref<any>([])
const componentColumns = ref<any>([])

// 初始化列配置
const initColumnConfig = async () => {
  try {
    const { data } = await getOperationColumnList({ type: 12 })
    poBasicColumns.value = data
    poBasicColumns.value.forEach((item: any) => {
      item.minWidth = item.width
    })
    const { data: skuData } = await getOperationColumnList({ type: 13 })
    skuColumns.value = skuData
    skuColumns.value.forEach((item: any) => {
      item.minWidth = item.width
    })
    const { data: componentData } = await getOperationColumnList({ type: 14 })
    componentColumns.value = componentData
    componentColumns.value.forEach((item: any) => {
      item.minWidth = item.width
    })
  } catch (error) {
    console.error('初始化列配置失败:', error)
  }
}

// 拖拽结束处理
const handlePoBasicEnd = async () => {
  try {
    const req = poBasicColumns.value.map((item: any, index: number) => {
      return {
        userId: item.userId,
        columnId: item.columnId,
        sort: index,
      }
    })
    await updateSortOperationColumn(req)
  } catch (error) {
    console.error('保存PO基本信息组列顺序失败:', error)
  }
}

const handleSkuEnd = async () => {
  try {
    const req = skuColumns.value.map((item: any, index: number) => {
      return {
        userId: item.userId,
        columnId: item.columnId,
        sort: index,
      }
    })
    await updateSortOperationColumn(req)
  } catch (error) {
    console.error('保存SKU组列顺序失败:', error)
  }
}

const handleComponentEnd = async () => {
  try {
    const req = componentColumns.value.map((item: any, index: number) => {
      return {
        userId: item.userId,
        columnId: item.columnId,
        sort: index,
      }
    })
    await updateSortOperationColumn(req)
  } catch (error) {
    console.error('保存零件组列顺序失败:', error)
  }
}

// 列显示/隐藏切换
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}

// 计算列宽 - 使用缓存优化性能，避免每次渲染都重新计算
const columnWidthCache = ref<Map<string, number>>(new Map())

// 计算列宽函数 - 使用缓存
const handleCalculateWidth = (item: any) => {
  // 如果使用固定宽度（付款记录），直接返回
  if (item.label === '付款记录') {
    return tableColumnWidth.value
  }

  // 如果缓存中有该列的宽度，直接返回
  const cacheKey = item.label
  if (columnWidthCache.value.has(cacheKey)) {
    return columnWidthCache.value.get(cacheKey)!
  }

  // 计算宽度并缓存
  let width = item.minWidth
  switch (item.label) {
    case 'SKU': {
      width = flexColumnWidth(poList.value, 'SKU', 'sku')
      break
    }
    case '数量': {
      width = flexColumnWidth(poList.value, '数量', 'purchaseSkuNumber')
      break
    }
    case '零件名': {
      width = flexColumnWidth(poList.value, '零件名', 'componentName')
      break
    }
    case '零件数量': {
      width = flexColumnWidth(poList.value, '零件数量', 'purchaseCount')
      break
    }
    case '单位': {
      width = flexColumnWidth(poList.value, '单位', 'unit')
      break
    }
    case '含税总价': {
      width = flexColumnWidth(poList.value, '含税总价', 'taxIncludedPrice')
      break
    }
    case '已付金额': {
      width = flexColumnWidth(poList.value, '已付金额', 'payPrice')
      break
    }
    case '供应商': {
      width = flexColumnWidth(poList.value, '供应商', 'suppliser')
      break
    }
    default: {
      width = item.minWidth
    }
  }

  // 缓存计算结果
  columnWidthCache.value.set(cacheKey, width)
  return width
}

// 监听 poList 变化，清空缓存，确保数据更新后重新计算
watch(
  () => poList.value.length,
  () => {
    columnWidthCache.value.clear()
  },
  { deep: false }
)
const publisherOptions = ref<any>([])
const deraltPublisher = { userId: -1, userName: '全部发布人' }
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 50,
  keyWord: '',
  status: 0, //2待付款 3部分付款 4已付全款 5超额付款 6已完结 7已删除
  customsStatus: -1,
  publisher: deraltPublisher,
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const fetchData = async () => {
  try {
    listLoading.value = true
    const params = {
      keyWord: queryForm.keyWord,
      status: queryForm.status,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      customsStatus: queryForm.customsStatus,
      publisherId: queryForm.publisher.userId,
    }
    const { data } = await getPoList(params)
    if (data) {
      listLoading.value = false
      total.value = data.total
      // 先清空选择状态
      selectedPORow.value.clear()
      selectedCompArray.value = []

      // 批量处理数据，减少响应式更新次数
      // 使用 map 创建新数组，一次性替换 poList，而不是逐个修改属性
      poList.value = data.list.map((item: any) => {
        // 处理付款记录字符串
        const paymentRecord = item.payRecordList
          ? item.payRecordList
              .map((record: any) => {
                const percentage = parseInt(record.percentage.replace('%', ''))
                const createTime = record.createTime.split(' ')[0]
                const percentageClass = percentage < 0 ? 'red' : 'percentage'
                return `<span class="create-time">${createTime}</span>: <span class="${percentageClass}">${percentage}%</span> <span class="pay-price">(${record.payPrice})</span>`
              })
              .join('<br>')
          : ''

        // 返回新对象，批量设置所有属性，减少响应式触发
        return {
          ...item,
          selectedPoRow: false,
          payPrice: Number(item.payPrice).toFixed(2),
          paymentRecord,
        }
      })
      calculateColumnWidth()
    }
  } catch (error) {
    console.error(error)
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label !== 'SKU' && label !== '零件名' && label !== '付款记录' && label !== '供应商')
    return {
      textAlign: 'center',
    }
}
const lastTwoTabCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label !== 'SKU' && label !== '零件名' && label !== '付款记录' && label !== '供应商')
    return {
      textAlign: 'center',
    }
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
// 按 SKU 分组计算斑马纹 - 使用 computed 缓存，避免重复计算
const skuStripedMap = computed(() => {
  const map = new Map<string, boolean>()
  let currentSkuGroupIndex = 0
  let lastSkuKey: string | null = null

  // 遍历数据，为每个 SKU 组分配斑马纹状态
  poList.value.forEach((row: any) => {
    // 使用 poSkuId 和 id 组合作为 SKU 的唯一标识（与合并逻辑保持一致）
    const skuKey = `${row.id}_${row.poSkuId}`

    // 如果是新的 SKU 组，切换斑马纹状态
    if (skuKey !== lastSkuKey) {
      currentSkuGroupIndex++
      lastSkuKey = skuKey
    }

    // 奇数 SKU 组显示斑马纹
    map.set(skuKey, currentSkuGroupIndex % 2 === 1)
  })

  return map
})

const stripedRowClass = ({ row, rowIndex }: { row: any; rowIndex: number }): string => {
  // 按 SKU 来判断斑马纹（与合并逻辑保持一致）
  const skuKey = `${row.id}_${row.poSkuId}`
  const isStriped = skuStripedMap.value.get(skuKey) || false
  const stripedClass = isStriped ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.id === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名，确保返回字符串
  const classNames = [stripedClass, selectedClass].filter(Boolean)
  return classNames.length > 0 ? classNames.join(' ') : ''
}
// 设置零件名显示样式和图片撑满样式
const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.property === 'componentName') {
    const payPrice = Number(data.row.payPrice)
    const taxIncludedPrice = Number(data.row.taxIncludedPrice)

    if (payPrice === 0 && taxIncludedPrice !== payPrice) {
      return 'red'
    } else if (payPrice === 0 && taxIncludedPrice === payPrice && data.row.paymentRecord.length === 0) {
      return 'red'
    } else if (payPrice === taxIncludedPrice && data.row.paymentRecord.length > 0) {
      return 'green'
    } else if (payPrice > 0 && payPrice < taxIncludedPrice) {
      return 'yellow'
    }
  }
  if (data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}
const getLastTwoCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}
const payHistoryCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}

// onActivated(() => {
//   tableRef.value?.doLayout()
// })
const fetchBonusData = async () => {
  const { data } = await getPurchaseBonus()
  procurementBonus.value = data.procurementBonus
  procurementBonusCrossMonth.value = data.procurementBonusCrossMonth
}
onBeforeMount(() => {
  fetchBonusData()
  selectedPORow.value = new Set()
  selectedCompArray.value = []
  // const savedStatus = JSON.parse(sessionStorage.getItem('poStatus') || '{}')
  // const pageNo = savedStatus.pageNo
  // const pageSize = savedStatus.pageSize
  // const keyWord = savedStatus.keyWord
  // const _activeName = savedStatus.activeName
  // if (pageNo && pageSize) {
  //   Object.assign(queryForm, {
  //     pageNo,
  //     pageSize,
  //     keyWord
  //   });
  // }
  // if (_activeName) {
  //   activeName.value = _activeName
  //   queryForm.status = _activeName
  // }
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }
  fetchData()
})

// 获取采购发版人列表
const queryPublisherData = async () => {
  publisherOptions.value = []
  const { data } = await getPoPublisherList({
    name: '',
  })
  data.unshift(deraltPublisher)
  publisherOptions.value = data
}
// const setScrollPosition = (scrollBarPosition: number, tableRef: any) => {
//   if (scrollBarPosition) {
//     const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
//     const wrapRef = scrollBarRef.wrapRef
//     setTimeout(() => {
//       wrapRef.scrollTop = scrollBarPosition
//     }, 50)
//   }
// }
onMounted(() => {
  initColumnConfig()
  queryPublisherData()
  // nextTick(() => {
  //   const savedStatus = JSON.parse(sessionStorage.getItem('poStatus') || '{}')
  //   const scrollBarPosition = savedStatus.scrollTop
  //   const scrollBarPosition2 = savedStatus.scrollTop2
  //   const scrollBarPosition3 = savedStatus.scrollTop3
  //   const scrollBarPosition4 = savedStatus.scrollTop4
  //   const scrollBarPosition5 = savedStatus.scrollTop5
  //   const scrollBarPosition6 = savedStatus.scrollTop6
  //   if (scrollBarPosition) {
  //     setScrollPosition(scrollBarPosition, tableRef)
  //   }
  //   if (scrollBarPosition2) {
  //     setScrollPosition(scrollBarPosition2, tableRef2)
  //   }
  //   if (scrollBarPosition3) {
  //     setScrollPosition(scrollBarPosition3, tableRef3)
  //   }
  //   if (scrollBarPosition4) {
  //     setScrollPosition(scrollBarPosition4, tableRef4)
  //   }
  //   if (scrollBarPosition5) {
  //     setScrollPosition(scrollBarPosition5, tableRef5)
  //   }
  //   if (scrollBarPosition6) {
  //     setScrollPosition(scrollBarPosition6, tableRef6)
  //   }
  //   const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef;
  //   const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef;
  //   const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef;
  //   const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef;
  //   const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef;
  //   const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef;
  //   const wrapRef = scrollBarRef.wrapRef
  //   const wrapRef2 = scrollBarRef2.wrapRef
  //   const wrapRef3 = scrollBarRef3.wrapRef
  //   const wrapRef4 = scrollBarRef4.wrapRef
  //   const wrapRef5 = scrollBarRef5.wrapRef
  //   const wrapRef6 = scrollBarRef6.wrapRef
  //   setTimeout(() => {
  //     wrapRef.scrollTop = scrollBarPosition;
  //     wrapRef2.scrollTop = scrollBarPosition2;
  //     wrapRef3.scrollTop = scrollBarPosition3;
  //     wrapRef4.scrollTop = scrollBarPosition4;
  //     wrapRef5.scrollTop = scrollBarPosition5;
  //     wrapRef6.scrollTop = scrollBarPosition6;
  //   }, 50)
  // })
})

// onUnmounted(() => {
//   let length = tabsStore.getVisitedRoutes.length
//   if (tabsStore.getVisitedRoutes[length - 1].name !== 'PoDetail') {
//     sessionStorage.removeItem('poStatus')
//   }
// })
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

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px !important;
          }
          .right-panel {
            margin-bottom: 5px !important;
          }
        }

        .po-table-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }
      }
    }
  }
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

// 弹出框padding
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
// input框内容居中
.input-center {
  text-align: center;
  text-align-last: center;
}
// 分批付款表单左右margin
.form-center {
  margin: 0 20px;
}
// 分隔线margin
.divider-margin {
  margin-top: 0;
  margin-bottom: 20px;
}
.upload-width {
  width: 100%;
}

:deep(.red) {
  color: #fd4e4e;
}
:deep(.green) {
  color: #13ce66;
}
:deep(.yellow) {
  color: #e6a23c;
}

:deep(.create-time) {
  color: #4e88f3; /* 设置 createTime 的颜色 */
}

:deep(.percentage) {
  color: #24ada1; /* 设置 percentage 的颜色 */
}

:deep(.pay-price) {
  color: #8d5fcc; /* 设置 payPrice 的颜色 */
}

// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

// 图片样式
.image-cell {
  width: 130px;
  height: 130px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}

// 列设置面板样式
.column-settings {
  margin-right: 10px;
  margin-bottom: 10px;
}

.drag-group {
  margin-bottom: 16px;

  h4 {
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 600;
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
.disabled-handle {
  cursor: not-allowed;
}

// 警告框样式
.alert-content {
  .rule-item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #606266;
    margin-top: 4px;
  }
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px !important;
  padding-left: 0px !important;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
