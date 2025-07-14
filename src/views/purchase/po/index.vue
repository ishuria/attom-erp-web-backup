<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待付款" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button
              v-permissions="{ permission: ['purchase:pay'] }"
              :loading="fullPaymentLoading"
              type="success"
              @click="handlePaymentPaid"
            >
              已付全款/尾款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:batch'] }"
              :loading="installmentLoading"
              type="warning"
              @click="handleShowInstallment"
            >
              分批付款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:refund'] }"
              :loading="refundLoading"
              type="danger"
              @click="handleShowRefund"
            >
              退款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:total:price:allocation'] }"
              :loading="priceSharingLoading"
              type="primary"
              @click="handleShowTotalPriceSharing"
            >
              总价分摊
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:generate:contract'] }"
              :loading="generateContractLoading"
              type="primary"
              @click="handleGenerateContract"
            >
              生成合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:aggregation:contract'] }"
              :loading="mergeContractLoading"
              type="primary"
              @click="handleShowMergeContract"
            >
              聚合合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:remittance:template'] }"
              :loading="moneyTransferLoading"
              type="primary"
              @click="handleShowGenerateMoneyTransfer"
            >
              生成汇款模板
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:cost:reduction:apply'] }"
              :loading="reduceCostLoading"
              type="primary"
              @click="handleReduceCost"
            >
              降本提成申请
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:component:auto:query'] }"
              type="primary"
              @click="handleShowAutomaticSignature"
            >
              自动签收设定
            </el-button>
            <el-button v-permissions="{ permission: ['purchase:po:delete'] }" :loading="delLoading" type="danger" @click="handleDelPo">
              删除
            </el-button>
            <div v-if="currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE || currentRoleCode === ROLE_PURCHASER_CODE" style="margin: 0 10px 10px 0"> 
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="success">采购奖金：{{ procurementBonus }}</el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="danger">
                跨月调整金额：{{ procurementBonusCrossMonth }}
              </el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="primary">含税价格合计：{{ taxIncludedTotalPrice }}</el-text>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="PO操作" prop="selectedPoRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllPoRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedPoRow" @change="handleSelectedPoRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')" />
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="部分付款" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button
              v-permissions="{ permission: ['purchase:pay'] }"
              :loading="fullPaymentLoading"
              type="success"
              @click="handlePaymentPaid"
            >
              已付全款/尾款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:batch'] }"
              :loading="installmentLoading"
              type="warning"
              @click="handleShowInstallment"
            >
              分批付款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:refund'] }"
              :loading="refundLoading"
              type="danger"
              @click="handleShowRefund"
            >
              退款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:total:price:allocation'] }"
              :loading="priceSharingLoading"
              type="primary"
              @click="handleShowTotalPriceSharing"
            >
              总价分摊
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:generate:contract'] }"
              :loading="generateContractLoading"
              type="primary"
              @click="handleGenerateContract"
            >
              生成合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:aggregation:contract'] }"
              :loading="mergeContractLoading"
              type="primary"
              @click="handleShowMergeContract"
            >
              聚合合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:remittance:template'] }"
              :loading="moneyTransferLoading"
              type="primary"
              @click="handleShowGenerateMoneyTransfer"
            >
              生成汇款模板
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:cost:reduction:apply'] }"
              :loading="reduceCostLoading"
              type="primary"
              @click="handleReduceCost"
            >
              降本提成申请
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:component:auto:query'] }"
              type="primary"
              @click="handleShowAutomaticSignature"
            >
              自动签收设定
            </el-button>
            <el-button v-permissions="{ permission: ['purchase:po:delete'] }" :loading="delLoading" type="danger" @click="handleDelPo">
              删除
            </el-button>
            <div v-if="currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE || currentRoleCode === ROLE_PURCHASER_CODE" style="margin: 0 10px 10px 0"> 
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="success">采购奖金：{{ procurementBonus }}</el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="danger">
                跨月调整金额：{{ procurementBonusCrossMonth }}
              </el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="primary">含税价格合计：{{ taxIncludedTotalPrice }}</el-text>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef2"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="PO操作" prop="selectedPoRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllPoRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedPoRow" @change="handleSelectedPoRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image
                fit="fill"
                :lazy="true"
                :src="row.skuImageUrl"
                style="width: 100%; height: 100%"
                @click="showPreviewImage(row.skuImageUrl)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')" />
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已付全款" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button
              v-permissions="{ permission: ['purchase:pay'] }"
              :loading="fullPaymentLoading"
              type="success"
              @click="handlePaymentPaid"
            >
              已付全款/尾款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:batch'] }"
              :loading="installmentLoading"
              type="warning"
              @click="handleShowInstallment"
            >
              分批付款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:refund'] }"
              :loading="refundLoading"
              type="danger"
              @click="handleShowRefund"
            >
              退款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:total:price:allocation'] }"
              :loading="priceSharingLoading"
              type="primary"
              @click="handleShowTotalPriceSharing"
            >
              总价分摊
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:generate:contract'] }"
              :loading="generateContractLoading"
              type="primary"
              @click="handleGenerateContract"
            >
              生成合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:aggregation:contract'] }"
              :loading="mergeContractLoading"
              type="primary"
              @click="handleShowMergeContract"
            >
              聚合合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:remittance:template'] }"
              :loading="moneyTransferLoading"
              type="primary"
              @click="handleShowGenerateMoneyTransfer"
            >
              生成汇款模板
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:cost:reduction:apply'] }"
              :loading="reduceCostLoading"
              type="primary"
              @click="handleReduceCost"
            >
              降本提成申请
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:component:auto:query'] }"
              type="primary"
              @click="handleShowAutomaticSignature"
            >
              自动签收设定
            </el-button>
            <el-button v-permissions="{ permission: ['purchase:po:delete'] }" :loading="delLoading" type="danger" @click="handleDelPo">
              删除
            </el-button>
            <div v-if="currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE || currentRoleCode === ROLE_PURCHASER_CODE" style="margin: 0 10px 10px 0"> 
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="success">采购奖金：{{ procurementBonus }}</el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="danger">
                跨月调整金额：{{ procurementBonusCrossMonth }}
              </el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="primary">含税价格合计：{{ taxIncludedTotalPrice }}</el-text>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef3"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="PO操作" prop="selectedPoRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllPoRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedPoRow" @change="handleSelectedPoRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image
                fit="fill"
                :lazy="true"
                :src="row.skuImageUrl"
                style="width: 100%; height: 100%"
                @click="showPreviewImage(row.skuImageUrl)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')"/>
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="超额付款" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button
              v-permissions="{ permission: ['purchase:pay'] }"
              :loading="fullPaymentLoading"
              type="success"
              @click="handlePaymentPaid"
            >
              已付全款/尾款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:batch'] }"
              :loading="installmentLoading"
              type="warning"
              @click="handleShowInstallment"
            >
              分批付款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:refund'] }"
              :loading="refundLoading"
              type="danger"
              @click="handleShowRefund"
            >
              退款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:total:price:allocation'] }"
              :loading="priceSharingLoading"
              type="primary"
              @click="handleShowTotalPriceSharing"
            >
              总价分摊
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:generate:contract'] }"
              :loading="generateContractLoading"
              type="primary"
              @click="handleGenerateContract"
            >
              生成合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:aggregation:contract'] }"
              :loading="mergeContractLoading"
              type="primary"
              @click="handleShowMergeContract"
            >
              聚合合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:remittance:template'] }"
              :loading="moneyTransferLoading"
              type="primary"
              @click="handleShowGenerateMoneyTransfer"
            >
              生成汇款模板
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:cost:reduction:apply'] }"
              :loading="reduceCostLoading"
              type="primary"
              @click="handleReduceCost"
            >
              降本提成申请
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:component:auto:query'] }"
              type="primary"
              @click="handleShowAutomaticSignature"
            >
              自动签收设定
            </el-button>
            <el-button v-permissions="{ permission: ['purchase:po:delete'] }" :loading="delLoading" type="danger" @click="handleDelPo">
              删除
            </el-button>
            <div v-if="currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE || currentRoleCode === ROLE_PURCHASER_CODE" style="margin: 0 10px 10px 0"> 
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="success">采购奖金：{{ procurementBonus }}</el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="danger">
                跨月调整金额：{{ procurementBonusCrossMonth }}
              </el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="primary">含税价格合计：{{ taxIncludedTotalPrice }}</el-text>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef4"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="PO操作" prop="selectedPoRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllPoRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedPoRow" @change="handleSelectedPoRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image
                fit="fill"
                :lazy="true"
                :src="row.skuImageUrl"
                style="width: 100%; height: 100%"
                @click="showPreviewImage(row.skuImageUrl)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')"/>
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已完结" :name="6">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button
              v-permissions="{ permission: ['purchase:pay'] }"
              :loading="fullPaymentLoading"
              type="success"
              @click="handlePaymentPaid"
            >
              已付全款/尾款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:batch'] }"
              :loading="installmentLoading"
              type="warning"
              @click="handleShowInstallment"
            >
              分批付款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:pay:refund'] }"
              :loading="refundLoading"
              type="danger"
              @click="handleShowRefund"
            >
              退款
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:total:price:allocation'] }"
              :loading="priceSharingLoading"
              type="primary"
              @click="handleShowTotalPriceSharing"
            >
              总价分摊
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:generate:contract'] }"
              :loading="generateContractLoading"
              type="primary"
              @click="handleGenerateContract"
            >
              生成合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:aggregation:contract'] }"
              :loading="mergeContractLoading"
              type="primary"
              @click="handleShowMergeContract"
            >
              聚合合同
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:remittance:template'] }"
              :loading="moneyTransferLoading"
              type="primary"
              @click="handleShowGenerateMoneyTransfer"
            >
              生成汇款模板
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:cost:reduction:apply'] }"
              :loading="reduceCostLoading"
              type="primary"
              @click="handleReduceCost"
            >
              降本提成申请
            </el-button>
            <el-button
              v-permissions="{ permission: ['purchase:component:auto:query'] }"
              type="primary"
              @click="handleShowAutomaticSignature"
            >
              自动签收设定
            </el-button>
            <el-button v-permissions="{ permission: ['purchase:po:delete'] }" :loading="delLoading" type="danger" @click="handleDelPo">
              删除
            </el-button>
            <div v-if="currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE || currentRoleCode === ROLE_PURCHASER_CODE" style="margin: 0 10px 10px 0"> 
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="success">采购奖金：{{ procurementBonus }}</el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="danger">
                跨月调整金额：{{ procurementBonusCrossMonth }}
              </el-text>
              <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0" type="primary">含税价格合计：{{ taxIncludedTotalPrice }}</el-text>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef5"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getLastTwoCellClass"
          :cell-style="lastTwoTabCellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="lastTowTabSpanMethod"
        >
        <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handleDelPoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image
                fit="fill"
                :lazy="true"
                :src="row.skuImageUrl"
                style="width: 100%; height: 100%"
                @click="showPreviewImage(row.skuImageUrl)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')"/>
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已删除" :name="7">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form v-permissions="{ permission: ['purchase:po:query'] }" inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableRef6"
          v-loading="listLoading"
          v-permissions="{ permission: ['purchase:po:query'] }"
          border
          :cell-class-name="getLastTwoCellClass"
          :cell-style="lastTwoTabCellStyle"
          class="noneHoveTable"
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="lastTowTabSpanMethod"
        >
        <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku"  >
                <el-link style="margin-right: 3px;" type="primary" @click="handleDelPoDetail(row)">{{ row.po }}</el-link>
                <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)"/>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" min-width="115" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName" />
          <el-table-column label="站点" min-width="135" prop="siteName" />
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image
                fit="fill"
                :lazy="true"
                :src="row.skuImageUrl"
                style="width: 100%; height: 100%"
                @click="showPreviewImage(row.skuImageUrl)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(poList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="purchaseSkuNumber" :width="flexColumnWidth(poList, '数量', 'purchaseSkuNumber')" />
          <el-table-column label="零件操作" prop="selectedCompRow" width="50">
            <template #header>
              <el-checkbox @change="handleSelectAllCompRow($event)" />
            </template>
            <template #default="{ row }">
              <el-checkbox v-model="row.selectedCompRow" @change="handleSelectedCompRow($event, row)" />
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(poList, '零件名', 'componentName')" />
          <el-table-column label="零件数量" prop="purchaseCount" :width="flexColumnWidth(poList, '零件数量', 'purchaseCount')" />
          <el-table-column label="单位" prop="unit" :width="flexColumnWidth(poList, '单位', 'unit')" />
          <el-table-column label="含税运费" min-width="100" prop="freight" />
          <el-table-column label="模具含税" min-width="100" prop="moldCost" />
          <el-table-column label="含税总价" prop="taxIncludedPrice" :width="flexColumnWidth(poList, '含税总价', 'taxIncludedPrice')" />
          <el-table-column label="已付金额" prop="payPrice" :width="flexColumnWidth(poList, '已付金额', 'payPrice')" />
          <el-table-column label="货币" prop="currency" width="90">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="付款记录" :min-width="tableColumnWidth" prop="paymentRecord">
            <template #default="{ row }">
              <div class="hover-opacity" style="cursor: pointer" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser" :width="flexColumnWidth(poList, '供应商', 'suppliser')"/>
          <el-table-column label="采购方" min-width="100" prop="purchase" />
          <el-table-column label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <vab-pagination
          v-permissions="{ permission: ['purchase:po:query'] }"
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 付款记录表 -->
    <vab-dialog
      v-model="paymentHistoryVisible"
      v-permissions="{ permission: ['purchase:pay:record'] }"
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
          <el-upload
            class="form-upload"
            :class="{ hide: refundForm.hide }"
            :file-list="refundForm.imageList"
            :http-request="uploadImage"
            list-type="picture-card"
          >
            <el-icon><plus /></el-icon>
            <template #file="{ file }">
              <div>
                <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRefundVoucherRemove">
                    <el-icon><delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseRefundDialog">关闭</el-button>
        <el-button :loading="refundLoading" type="primary" @click="handleConfirmRefund">确认</el-button>
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
      <el-form ref="reductionCostFormRef" :model="reductionCostForm" :rules="reductionCostFormRules" style="margin: 0">
        <el-form-item label="优化前价格" prop="beforePrice">
          <el-input v-model="reductionCostForm.beforePrice" type="number" />
        </el-form-item>
        <el-form-item label="优化后价格" prop="afterPrice">
          <el-input v-model="reductionCostForm.afterPrice" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeReductionCost">取消</el-button>
        <el-button :loading="reduceCostLoading" type="primary" @click="confirmReductionCost">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Search, UploadFilled, ZoomIn } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type TableInstance, type TabsPaneContext, type UploadFile, dayjs } from 'element-plus'
import { debounce } from 'lodash'
import { ref } from 'vue'
import { downloadFile } from '/@/api/devlocal/download'
import {
  aggregationContract,
  applyPurchaseReductionCost,
  checkPurchasePo,
  delPayRecord,
  deletePo,
  generatePoContract,
  generateRemittance,
  getComponentPayRecord,
  getPoList,
  getPurchaseBonus,
  getPurchaseCostReduction,
  purchaseTotalAp,
  updateComponentAllPay,
  updateComponentPayPart,
  updateComponentRefund,
  updatePayRecord,
} from '/@/api/devlocal/purchasePo'
import { ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import handleClipboard from '/@/utils/clipboard'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { flexColumnWidth } from '/@/utils/tableColum'
import type { CurrencyCode } from '/@/views/purchase/constantOption'
import { currencyMap } from '/@/views/purchase/constantOption'

defineOptions({
  name: 'Po',
})

const disabledDate = (time: Date) => {
  const date = dayjs(time)
  const now = dayjs()
  // 不能选择晚于今天的日期
  return date.isAfter(now, 'day')
}
const currentRoleCode = useAclStore().getRole[0];
const procurementBonus = ref<number>(0)
const procurementBonusCrossMonth = ref<number>(0)
const _poComponentId = ref<number>(0)
const reductionCostVisible = ref<boolean>(false)
const reductionCostForm = reactive<any>({})
const reductionCostFormRef = ref<FormInstance>()
const reductionCostFormRules = reactive<FormRules>({
  beforePrice: [{ required: true, message: '请输入优化前价格', trigger: 'blur' }],
  afterPrice: [{ required: true, message: '请输入优化后价格', trigger: 'blur' }],
})
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
const tableRef = ref<TableInstance>()
const tableRef2 = ref<TableInstance>()
const tableRef3 = ref<TableInstance>()
const tableRef4 = ref<TableInstance>()
const tableRef5 = ref<TableInstance>()
const tableRef6 = ref<TableInstance>()
// 合同列表
const contractList = ref<any>([])

const activeName = ref<number>(2)
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
// po选中的行转化为数组
const selectedPOArray = ref<any>([])

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
const tableColumnWidth = ref<number>(90)
// 含税价格合计
const taxIncludedTotalPrice = ref<number>(0)
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
    // 找出所有相同id的行，累加它们的含税总价
    const sameIdRows = poList.value.filter((item: any) => item.id === rowId)
    const totalPrice = sameIdRows.reduce((sum: number, item: any) => {
      return sum + Number(item.taxIncludedPrice)
    }, 0)
    taxIncludedTotalPrice.value = Number((taxIncludedTotalPrice.value + totalPrice).toFixed(2))
  } else {
    selectedPORow.value.delete(rowId)
    // 找出所有相同id的行，累减它们的含税总价
    const sameIdRows = poList.value.filter((item: any) => item.id === rowId)
    const totalPrice = sameIdRows.reduce((sum: number, item: any) => {
      return sum + Number(item.taxIncludedPrice)
    }, 0)
    taxIncludedTotalPrice.value = Number((taxIncludedTotalPrice.value - totalPrice).toFixed(2))
  }
  selectedPOArray.value = Array.from(selectedPORow.value)
}
// 全选po操作列
const handleSelectAllPoRow = (event: any) => {
  if (event) {
    poList.value.forEach((item: any) => {
      item.selectedPoRow = true
      selectedPORow.value.add(item.id)
      taxIncludedTotalPrice.value += Number(item.taxIncludedPrice)
    })
    taxIncludedTotalPrice.value = Number(taxIncludedTotalPrice.value.toFixed(2))
    // console.log(selectedPORow.value);
  } else {
    poList.value.forEach((item: any) => {
      item.selectedPoRow = false
    })
    selectedPORow.value.clear()
    taxIncludedTotalPrice.value = 0
    // console.log(selectedPORow.value);
  }
  selectedPOArray.value = Array.from(selectedPORow.value)
}
// 将选择的component行加入到component数组里
const handleSelectedCompRow = (event: any, row: any) => {
  if (event) {
    selectedCompArray.value.push(row)
  } else {
    const index = selectedCompArray.value.findIndex((item: any) => item.componentId === row.componentId)
    selectedCompArray.value.splice(index, 1)
  }
}
// 全选零件操作列
const handleSelectAllCompRow = (event: any) => {
  if (event) {
    poList.value.forEach((item: any) => {
      item.selectedCompRow = true
      selectedCompArray.value.push(item)
    })
    // console.log(selectedCompRow.value);
  } else {
    poList.value.forEach((item: any) => {
      item.selectedCompRow = false
    })
    selectedCompArray.value = []
    // console.log(selectedCompRow.value);
  }
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
    let componentIds: string = selectedCompArray.value.map((item: any) => item.componentId).join(',')
    let poIds: string = Array.from(new Set(selectedCompArray.value.map((item: any) => item.id))).join(',')
    const { data } = await updateComponentAllPay({
      componentIds,
      poIds,
    })
    if (data === true) {
      $baseMessage('已付尾款/全款成功', 'success', 'hey')
      fetchData() //重新刷新表格
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

  selectedCompArray.value.forEach((item: any) => {
    item.selectedCompRow = false
  })
  selectedCompArray.value = []
}
const installmentLoading = ref<boolean>(false)
// 确认分批付款
const handleConfirmInstallment = async () => {
  installmentFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        installmentLoading.value = true
        let componentIds: string = selectedCompArray.value.map((item: any) => item.componentId).join(',')
        let poIds: string = Array.from(new Set(selectedCompArray.value.map((item: any) => item.id))).join(',')
        const { data } = await updateComponentPayPart({
          componentInfo: {
            componentIds,
            poIds,
          },
          unitPrice: installmentForm.price,
          percentage: installmentForm.percent,
        })
        if (data === true) {
          $baseMessage('分批付款成功', 'success', 'hey')
          handleCloseInstallmentDialog()
          fetchData() //重新刷新表格
          // clearTableSelect()
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
async function uploadImage(params: any) {
  refundForm.hide = true
  refundForm.refundVoucher = params.file
}
// 退款凭证图片预览事件
const handlePreview = (file: UploadFile) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(file.url!)
}
// 删除退款凭证
const handleRefundVoucherRemove = () => {
  refundForm.imageList = []
  refundForm.hide = false
  refundForm.refundVoucher = null
}
// 关闭退款弹窗
const handleCloseRefundDialog = () => {
  refundRef.value?.resetFields()
  refundVisible.value = false
}
const refundLoading = ref<boolean>(false)
// 确认退款
const handleConfirmRefund = async () => {
  refundRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        refundLoading.value = true
        let formData = new FormData()
        formData.append('unitPrice', refundForm.price)
        formData.append('percentage', refundForm.percent)
        formData.append('file', refundForm.refundVoucher)
        formData.append('componentIds', `${selectedCompArray.value[0].componentId}`)
        formData.append('poIds', selectedCompArray.value[0].id)
        const { data } = await updateComponentRefund(formData)
        if (data === true) {
          $baseMessage('退款提交成功', 'success', 'hey')
          handleCloseRefundDialog()
          fetchData() //重新刷新表格
          // clearTableSelect()
        }
      } catch (error) {
        console.error(error)
      } finally {
        refundLoading.value = false
      }
    }
  })
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
        priceSharingLoading.value = true
        let componentIds: string = selectedCompArray.value.map((item: any) => item.componentId).join(',')
        const { data } = await purchaseTotalAp({
          componentIds,
          totalMoney: totalPriceSharingForm.tax,
          totalFreight: totalPriceSharingForm.shippingFee,
        })
        if (data === true) {
          $baseMessage('总价分摊提交成功', 'success')
          handleCloseTotalPriceSharingDialog()
          fetchData() //重新刷新表格
          // clearTableSelect()
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
    poSkuComponentId = selectedCompArray.value.map((item: any) => item.componentId)
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
        // clearTableSelect()
      }
    } catch (error) {
      console.error(error)
    } finally {
      delLoading.value = false
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

  const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
  const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef
  const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef
  const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef
  const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef
  const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef
  const wrapRef = scrollBarRef.wrapRef
  const wrapRef2 = scrollBarRef2.wrapRef
  const wrapRef3 = scrollBarRef3.wrapRef
  const wrapRef4 = scrollBarRef4.wrapRef
  const wrapRef5 = scrollBarRef5.wrapRef
  const wrapRef6 = scrollBarRef6.wrapRef
  const poStatus = {
    scrollTop: wrapRef.scrollTop,
    scrollTop2: wrapRef2.scrollTop,
    scrollTop3: wrapRef3.scrollTop,
    scrollTop4: wrapRef4.scrollTop,
    scrollTop5: wrapRef5.scrollTop,
    scrollTop6: wrapRef6.scrollTop,
  }
  sessionStorage.setItem('poStatus', JSON.stringify(poStatus))

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
        del
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
      tab: 'view'
    },
  })

  const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
  const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef
  const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef
  const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef
  const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef
  const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef
  const wrapRef = scrollBarRef.wrapRef
  const wrapRef2 = scrollBarRef2.wrapRef
  const wrapRef3 = scrollBarRef3.wrapRef
  const wrapRef4 = scrollBarRef4.wrapRef
  const wrapRef5 = scrollBarRef5.wrapRef
  const wrapRef6 = scrollBarRef6.wrapRef
  const poStatus = {
    scrollTop: wrapRef.scrollTop,
    scrollTop2: wrapRef2.scrollTop,
    scrollTop3: wrapRef3.scrollTop,
    scrollTop4: wrapRef4.scrollTop,
    scrollTop5: wrapRef5.scrollTop,
    scrollTop6: wrapRef6.scrollTop,
  }
  sessionStorage.setItem('poStatus', JSON.stringify(poStatus))
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
  taxIncludedTotalPrice.value = 0
}
//采购订单col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
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
  if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
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
const lastTowTabSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
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
  if (columnIndex === 4 || columnIndex === 5 || columnIndex === 6) {
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
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 50,
  keyWord: '',
  status: 2, //2待付款 3部分付款 4已付全款 5超额付款 6已完结 7已删除
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
    const { data } = await getPoList(queryForm)
    if (data) {
      listLoading.value = false
      total.value = data.total
      poList.value = data.list
      selectedPORow.value.clear()
      selectedCompArray.value = []
      // 每个零件的付款进度进行处理
      poList.value.forEach((item: any) => {
        item.selectedCompRow = false
        item.selectedPoRow = false
        item.payPrice = Number(item.payPrice).toFixed(2)
        item.paymentRecord = item.payRecordList
          .map((record: any) => {
            const percentage = parseInt(record.percentage.replace('%', '')) // 去掉%并转换为整数
            const createTime = record.createTime.split(' ')[0]
            if (percentage < 0) {
              return `
                <span class="create-time">${createTime}</span>:
                <span class="red">${percentage}%</span>
                <span class="pay-price">(${record.payPrice})</span>`
            } else {
              return `
                <span class="create-time">${createTime}</span>:
                <span class="percentage">${percentage}%</span>
                <span class="pay-price">(${record.payPrice})</span>`
            }
          })
          .join('<br>')
      })
      calculateColumnWidth()
    }
  } catch (error) {
    console.error(error)
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex !== 6 && data.columnIndex !== 9 && data.columnIndex !== 17 && data.columnIndex !== 18)
    return {
      textAlign: 'center',
    }
}
const lastTwoTabCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 8 && data.columnIndex !== 16 && data.columnIndex !== 17)
    return {
      textAlign: 'center',
    }
}
let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row
  const currentId = row.id
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId
    currentGroupIndex++
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
}
// 设置零件名显示样式和图片撑满样式
const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.property === 'componentName') {
    const payPrice = Number(data.row.payPrice)
    const taxIncludedPrice = Number(data.row.taxIncludedPrice)

    if (payPrice === 0) {
      return 'red'
    } else if (payPrice === taxIncludedPrice) {
      return 'green'
    } else if (payPrice > 0 && payPrice < taxIncludedPrice) {
      return 'yellow'
    }
  }
  if (data.columnIndex === 5) {
    return 'clear-padding'
  }
  return ''
}
const getLastTwoCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 4) {
    return 'clear-padding'
  }
  return ''
}
const payHistoryCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 4) {
    return 'clear-padding'
  }
  return ''
}
const paymentHistoryCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex === 0 || data.columnIndex === 2 || data.columnIndex === 5) {
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign: 'center',
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})
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
const setScrollPosition = (scrollBarPosition: number, tableRef: any) => {
  if (scrollBarPosition) {
    const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
    const wrapRef = scrollBarRef.wrapRef
    setTimeout(() => {
      wrapRef.scrollTop = scrollBarPosition
    }, 50)
  }
}
onMounted(() => {
  nextTick(() => {
    const savedStatus = JSON.parse(sessionStorage.getItem('poStatus') || '{}')
    const scrollBarPosition = savedStatus.scrollTop
    const scrollBarPosition2 = savedStatus.scrollTop2
    const scrollBarPosition3 = savedStatus.scrollTop3
    const scrollBarPosition4 = savedStatus.scrollTop4
    const scrollBarPosition5 = savedStatus.scrollTop5
    const scrollBarPosition6 = savedStatus.scrollTop6
    if (scrollBarPosition) {
      setScrollPosition(scrollBarPosition, tableRef)
    }
    if (scrollBarPosition2) {
      setScrollPosition(scrollBarPosition2, tableRef2)
    }
    if (scrollBarPosition3) {
      setScrollPosition(scrollBarPosition3, tableRef3)
    }
    if (scrollBarPosition4) {
      setScrollPosition(scrollBarPosition4, tableRef4)
    }
    if (scrollBarPosition5) {
      setScrollPosition(scrollBarPosition5, tableRef5)
    }
    if (scrollBarPosition6) {
      setScrollPosition(scrollBarPosition6, tableRef6)
    }
    // const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef;
    // const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef;
    // const scrollBarRef3: any = tableRef3.value!.$refs.scrollBarRef;
    // const scrollBarRef4: any = tableRef4.value!.$refs.scrollBarRef;
    // const scrollBarRef5: any = tableRef5.value!.$refs.scrollBarRef;
    // const scrollBarRef6: any = tableRef6.value!.$refs.scrollBarRef;
    // const wrapRef = scrollBarRef.wrapRef
    // const wrapRef2 = scrollBarRef2.wrapRef
    // const wrapRef3 = scrollBarRef3.wrapRef
    // const wrapRef4 = scrollBarRef4.wrapRef
    // const wrapRef5 = scrollBarRef5.wrapRef
    // const wrapRef6 = scrollBarRef6.wrapRef
    // setTimeout(() => {
    //   wrapRef.scrollTop = scrollBarPosition;
    //   wrapRef2.scrollTop = scrollBarPosition2;
    //   wrapRef3.scrollTop = scrollBarPosition3;
    //   wrapRef4.scrollTop = scrollBarPosition4;
    //   wrapRef5.scrollTop = scrollBarPosition5;
    //   wrapRef6.scrollTop = scrollBarPosition6;
    // }, 50)
  })
})
onUnmounted(() => {
  let length = tabsStore.getVisitedRoutes.length
  if (tabsStore.getVisitedRoutes[length - 1].name !== 'PoDetail') {
    sessionStorage.removeItem('poStatus')
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

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px !important;
          }
          .el-form {
            .el-form-item:first-child {
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin-bottom: 5px !important;
            }
          }
        }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            .cell {
              padding-right: 0px !important;
              padding-left: 0px !important;
            }
          }
        }
      }
    }
  }
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
// 设置付款记录表的行高
// :deep(.payRecord .el-table__body .cell) {
//   min-height: 72.2px;
//   line-height: 72.2px;
// }
.hide :deep(.el-upload--picture-card) {
  display: none;
}
// 让图片过渡消失
:deep(.form-upload .el-upload-list--picture-card .el-upload-list__item) {
  padding: 0;
  margin: 0;
  transition: none;
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
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
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px !important;
  padding-left: 0px !important;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
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
.hover-opacity {
  transition: opacity 0.3s; /* 添加过渡效果 */
}

.hover-opacity:hover {
  opacity: 0.5; /* Hover 时透明度 */
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
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
</style>
