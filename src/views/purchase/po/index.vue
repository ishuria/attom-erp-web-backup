<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待付款" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" @click="handlePaymentPaid">已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" @click="handleGenerateContract">生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="danger" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO操作" prop="selectedPoRow">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedPoRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100px">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img" style="width: 55px; height: 55px">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop=""></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
      </el-tab-pane>
      <el-tab-pane label="部分付款" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" @click="handlePaymentPaid">已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" @click="handleGenerateContract">生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="danger" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO操作" prop="selectedPoRow">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedPoRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 

      </el-tab-pane>
      <el-tab-pane label="已付全款" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" @click="handlePaymentPaid">已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" @click="handleGenerateContract">生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="danger" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO操作" prop="selectedPoRow">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedPoRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
      </el-tab-pane>
      <el-tab-pane label="超额付款" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" @click="handlePaymentPaid">已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" @click="handleGenerateContract">生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="danger" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO操作" prop="selectedPoRow">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedPoRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
      </el-tab-pane>
      <el-tab-pane label="已完结" :name="6">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" @click="handlePaymentPaid">已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" @click="handleGenerateContract">生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="lastTwoTabCellStyle"
          :span-method="lastTowTabSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
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
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="lastTwoTabCellStyle"
          :span-method="lastTowTabSpanMethod"
          @cell-click="changeInput"
        >
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件操作" prop="selectedCompRow" width="90">
            <template #default="{ row }">
              <el-checkbox class="custom-checkbox" @change="handleSelectedCompRow($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90"></el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="paymentRecord">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.paymentRecord"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>    
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" />
    <!-- 付款记录表 -->
    <el-dialog 
      v-model="paymentHistoryVisible" 
      :close-on-click-modal="false" 
      title="付款记录" 
      width="35%"
      class="moldDialog"
      :before-close="handleClosePaymentHistoryDialog"
    >
      <el-divider style="margin-top: 0; margin-bottom: 20px"/>
      <div >
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="paymentProgressList"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changePaymentHistoryInput"
          :cell-style="paymentHistoryCellStyle"
        >
          <el-table-column label="付款日期" min-width="120" prop="createTime">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.createTime" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)"></el-input>
              </div>
              <span>{{ row.createTime.split(' ')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额" min-width="130" prop="payPrice">
            <template #default="{ row }">
              <el-input v-model="row.payPrice" @change="handleUpdatePrice(row)" class="input-center"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="付款百分比" min-width="130" prop="percentage" ></el-table-column>
          <el-table-column label="操作人" min-width="130" prop="createUser"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDelPayRecord(row, $index)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </div>
      <template #footer></template>
    </el-dialog>
    <!-- 分批付款 -->
    <el-dialog
      v-model="installmentVisible"
      :close-on-click-modal="false" 
      title="分批付款" 
      width="20%"
      class="moldDialog"
      :before-close="handleCloseInstallmentDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form ref="installmentFormRef" label-position="top" label-width="auto" class="form-center" :model="installmentForm">
        <el-form-item label="百分比" prop="percent">
          <el-input v-model="installmentForm.percent" @input="handleComputePrice" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="installmentMoneyVisible" label="金额" prop="price">
          <el-input v-model="installmentForm.price" @input="handleComputePercent" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseInstallmentDialog">关闭</el-button>
        <el-button type="primary" @click="handleConfirmInstallment">确认</el-button>
      </template>
    </el-dialog>
    <!-- 退款 -->
    <el-dialog
      v-model="refundVisible"
      :close-on-click-modal="false" 
      title="退款" 
      width="30%"
      class="moldDialog"
      :before-close="handleCloseRefundDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form ref="refundRef" label-position="top" label-width="auto" class="form-center" :model="refundForm">
        <el-form-item label="百分比" prop="percent">
          <el-input v-model="refundForm.percent" @input="handleComputeRefundPrice" clearable></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="refundForm.price" @input="handleComputeRefundPercent" clearable></el-input>
        </el-form-item>
        <el-form-item label="凭证上传">
          <el-upload action="#" drag multiple class="upload-width">
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
        <el-button @click="handleCloseRefundDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 总价分摊 -->
    <el-dialog
      v-model="totalPriceSharingVisible"
      :close-on-click-modal="false" 
      title="总价分摊" 
      width="20%"
      class="moldDialog"
      :before-close="handleCloseTotalPriceSharingDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form ref="totalPriceSharingFormRef" label-position="top" label-width="auto" class="form-center" :model="totalPriceSharingForm" :rules="totalPriceSharingRules">
        <el-form-item label="总含税价" prop="tax">
          <el-input v-model="totalPriceSharingForm.tax" clearable></el-input>
        </el-form-item>
        <el-form-item label="总含税运费" prop="shippingFee">
          <el-input v-model="totalPriceSharingForm.shippingFee" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseTotalPriceSharingDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 聚合合同 -->
    <el-dialog
      v-model="mergeContractVisible"
      :close-on-click-modal="false" 
      title="聚合合同-请上传需要聚合的合同" 
      width="30%"
      class="moldDialog"
      :before-close="handleCloseMergeContractDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form class="form-center">
        <el-form-item >
          <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" v-model:file-list="contractList" 
          drag multiple class="upload-width" :show-file-list="true" :auto-upload="false">
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
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 生成汇款模板 -->
    <el-dialog
      v-model="generateMoneyTransferVisible"
      :close-on-click-modal="false" 
      title="生成汇款模板" 
      width="35%"
      class="moldDialog"
      :before-close="handleCloseGenerateMoneyTransferDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form label-position="top" label-width="auto" class="form-center">
        <el-form-item label="日期">
          <el-date-picker 
            v-model="generateMoneyTransferTime" 
            end-placeholder="结束日期" 
            range-separator="至" 
            start-placeholder="开始日期" 
            type="datetimerange" 
            time-format="HH:mm" 
            format="YYYY-MM-DD HH:mm" 
            :editable="false"	
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseGenerateMoneyTransferDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 自动签收设定 -->
    <vab-automatic-signature
      :automaticSignatureVisible="automaticSignatureVisible"
      @update:automatic-signature-visible="handleCloseAutomaticSignature"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { deletePo, delPayRecord, getComponentPayRecord, getPoList, updateComponentAllPay, updateComponentPayPart, updatePayRecord } from '/@/api/devlocal/purchasePo'
import { CurrencyCode, currencyMap } from '/@/views/purchase/constantOption'

defineOptions({
  name: 'poTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const tableRef = ref<TableInstance>()

const contractList = ref<any>([])
const activeName = ref<number>(2)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
// 采购订单数据
const poList = ref<any>([])
// po选中的行
const selectedPORow = ref<Set<number>>(new Set())
// po选中的行转化为数组
const selectedPOArray = ref<any>([])
// component选中的行
const selectedCompRow = ref<Set<any>>(new Set())
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
  price: null
})
// 分批付款表单ref
const installmentFormRef = ref<FormInstance>()
// 退款显示与否
const refundVisible = ref<boolean>(false)
// 退款表单
const refundForm = reactive<any>({
  percent: null,
  price: null,
  refundVoucher: null
})
// 退款ref
const refundRef = ref<FormInstance>()
// 总价分摊显示与否
const totalPriceSharingVisible = ref<boolean>(false)
// 总价分摊表单数据
const totalPriceSharingForm = reactive<any>({
  tax: null,
  shippingFee: null
})
// 总价分摊表单ref
const totalPriceSharingFormRef = ref<FormInstance>()
// 总价分摊rules
const totalPriceSharingRules = reactive<any>({
  tax: [
    { required: true, message: '总含税价不能为空', trigger: 'blur' }
  ]
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
 
// 将选择的po行加入到po数组里
const handleSelectedPoRow = (event: any, row: any) => {
  const rowId = row.id; // 假设每行都有一个唯一的 id
  
  if (event) {
    selectedPORow.value.add(rowId); // 选中，添加到 Set 中
  } else {
    selectedPORow.value.delete(rowId); // 取消选中，从 Set 中删除
  }
  
  // 将 Set 转换回数组
  selectedPOArray.value = Array.from(selectedPORow.value);
 
};
// 将选择的component行加入到component数组里
const handleSelectedCompRow = (event: any, row: any) => {
  const rowCompId = row.componentId; 
  if (event) {
    selectedCompRow.value.add(row); // 选中，添加到 Set 中
  } else {
    selectedCompRow.value.delete(row); // 取消选中，从 Set 中删除
  }
  selectedCompArray.value = Array.from(selectedCompRow.value);
};

// 关闭付款进度弹窗
const handleClosePaymentHistoryDialog = () => {
  paymentHistoryVisible.value = false
  // 生成提取后的付款进度数据显示到表格上
  payHistoryRow.value.paymentRecord = paymentProgressList.value
    .map((item: any) => {
      return `${item.createTime}: ${item.percentage}(${item.payPrice})`;
    })
    .join('<br>');
}
// 展示付款进度弹窗
const handleShowPaymentHistory = async (row: any) => {
  try {
    const { data } = await getComponentPayRecord({
      poSkuComponentId: row.componentId
    })
    if (data) {
      paymentProgressList.value = data
      paymentProgressList.value.forEach((item: any) => {
        item.createTime = item.createTime.split(' ')[0]
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
    await updatePayRecord({
      id: row.id,
      price: row.payPrice
    })
  } catch (error) {
    console.error(error)
  }
}
// 删除付款进度
const handleDelPayRecord = async (row: any, index: number) => {
  try {
    const { data } = await delPayRecord({
      id: row.componentId
    })
    if (data === true) {
      $baseMessage('删除该条付款记录成功', 'success', 'hey')
      paymentProgressList.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  }
}
// 处理已付尾款/全款
const handlePaymentPaid = async () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  try {
    let componentIds: any = []
    let poIds: any = new Set()
    selectedCompArray.value.forEach((item: any) => {
      componentIds.push(item.componentId)
      poIds.add(item.id)
    })
    // ,号连接
    componentIds = componentIds.join()
    // 先转为数组，然后,号连接
    poIds = Array.from(poIds).join()
    const { data } = await updateComponentAllPay({
      componentIds: componentIds,
      poIds: poIds
    })
    if (data === true) {
      $baseMessage('已付尾款/全款成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
// 展示分批付款弹窗
const handleShowInstallment = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  } else if (selectedCompRow.value.size === 1) { //只选择了一行，全展示
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
    installmentForm.price = (tax * (Number(value) / 100.00)).toFixed(2)
  }
}
// 计算分批付款的百分比
const handleComputePercent = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    installmentForm.percent = (Number(value) / tax * 100).toFixed(2)
  }
}
// 关闭分批付款弹窗
const handleCloseInstallmentDialog = () => {
  installmentFormRef.value?.resetFields()
  installmentVisible.value = false
}
// 确认分批付款
const handleConfirmInstallment = async () => {
  try {
    let componentIds: any = []
    let poIds: any = new Set()
    selectedCompArray.value.forEach((item: any) => {
      componentIds.push(item.componentId)
      poIds.add(item.id)
    })
    // ,号连接
    componentIds = componentIds.join()
    // 先转为数组，然后,号连接
    poIds = Array.from(poIds).join()
    const { data } = await updateComponentPayPart({
      componentInfo: {
        componentIds: componentIds,
        poIds: poIds
      },
      unitPrice: installmentForm.price,
      percentage: installmentForm.percent
    })
    if (data === true) {
      $baseMessage('分批付款成功', 'success', 'hey')
      handleCloseInstallmentDialog()
    }
  } catch (error) {
    console.error(error)
  }
}
// 展示退款弹窗
const handleShowRefund = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  refundVisible.value = true
}
// 计算退款的金额
const handleComputeRefundPrice = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    // 金额 = 含税总价 * (百分比 / 100)
    refundForm.price = (tax * (Number(value) / 100.00)).toFixed(2)
  }
}
// 计算退款的百分比
const handleComputeRefundPercent = (value: string) => {
  const tax = Number(selectedCompArray.value[0].taxIncludedPrice)
  if (value) {
    refundForm.percent = (Number(value) / tax * 100).toFixed(2)
  }
}
// 关闭退款弹窗
const handleCloseRefundDialog = () => {
  refundRef.value?.resetFields()
  refundVisible.value = false
}
// 展示总价分摊弹窗
const handleShowTotalPriceSharing = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
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
// 处理生成合同
const handleGenerateContract = () => {
  // 如果没有选中行
  if (selectedPORow.value.size === 0) {
    $baseMessage('您未选中PO操作列的任何行', 'warning')
    return
  }
   
  
}
// 展示聚合合同弹窗
const handleShowMergeContract = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  mergeContractVisible.value = true
}
// 关闭聚合合同弹窗
const handleCloseMergeContractDialog = () => {
  mergeContractVisible.value = false
}
// 展示生成汇款模板弹窗
const handleShowGenerateMoneyTransfer = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  generateMoneyTransferVisible.value = true
  generateMoneyTransferTime.value = ''
}
// 关闭生成汇款模板弹窗
const handleCloseGenerateMoneyTransferDialog = () => {
  generateMoneyTransferVisible.value = false
}
// 降本提成申请PO
const handleReduceCost = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
}
// 打开自动签收设定弹窗
const handleShowAutomaticSignature = () => {
  // 判断是否选中零件操作
  if (selectedCompRow.value.size === 0) {
    $baseMessage('您未选中零件操作列的任何行', 'warning')
    return
  }
  automaticSignatureVisible.value = true
}
// 关闭自动签收设定弹窗
const handleCloseAutomaticSignature = (value: boolean) => {
  automaticSignatureVisible.value = value
}
// 删除
const handleDelPo = async () => {
  if (selectedPORow.value.size === 0) {
    $baseMessage('您未选中PO操作列的任何行', 'warning')
    return
  }
  $baseConfirm('确定要删除该条PO吗? ', "系统提示", async () => {
    try {
      const ids = selectedPOArray.value.join()
      // console.log(ids);
      
      const { data } = await deletePo(ids)
      if (data === true) {
        $baseMessage("删除该条PO成功", "success", "hey");
      }
    } catch (error) {
      console.error(error)
    }
  });
}
// 跳转po详情
const handlePoDetail = (row: any) => {
  router.push({
    path: '/purchase/poDetail',
    query: {
      title: "采购订单详情",
      from: row.po,
      poSkuId: row.poSkuId,
      poId: row.id,
      timestamp: Date.now(),
    },
  })
}





/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}
const changePaymentHistoryInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')
  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
      textareaElement.select()
    }
  }
}
/**
 * 输入失焦事件
 */
const clickCancel = async (event: any, value: any) =>{

  const t1 = getRootElement(event["srcElement"],".cell").children[0]

  if (t1){
    if (t1.classList[0] !== "el-select") {
      t1.classList.add("none")
    }
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  // await updateProgressManage({...value})
}
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  poList.value = []
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name);  
  }
  fetchData()
}
//采购订单col合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1; // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    const id = row.id;

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].id !== id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 合并 SKU 行
  if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
    const poSkuId = row.poSkuId;

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].poSkuId === poSkuId && poList.value[i].id === row.id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].poSkuId !== poSkuId || poList.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 };
}
//后两个tab采购订单col合并方法
const lastTowTabSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1; // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
    const id = row.id;

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].id !== id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 合并 SKU 行
  if (columnIndex === 4 || columnIndex === 5 || columnIndex === 6) {
    const poSkuId = row.poSkuId;

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < poList.value.length; i++) {
      if (poList.value[i].poSkuId === poSkuId && poList.value[i].id === row.id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || poList.value[rowIndex - 1].poSkuId !== poSkuId || poList.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 };
}
/**
 * 分页
 */
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 2, //2待付款 3部分付款 4已付全款 5超额付款 6已完结 7已删除
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
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
      // 每个零件的付款进度进行处理
      poList.value.forEach((item: any) => {      
        item.payPrice = Number(item.payPrice).toFixed(2)
        item.paymentRecord = item.payRecordList
          .map((item: any) => {
            return `${item.createTime.split(' ')[0]}: ${item.percentage}(${item.payPrice})`;
          })
          .join('<br>');
      })
    }
  } catch (error) {
    console.error(error)
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if(data.columnIndex !== 6 && data.columnIndex !== 9 && data.columnIndex !== 22)
    return {
      textAlign:'center'
    } 
}
const lastTwoTabCellStyle = ({row, column, rowIndex, columnIndex}: any): any => {
  if (columnIndex === 5 && columnIndex !== 8 && columnIndex !== 21) {
    return {
      textAlign:'center'
    } 
  }
}
const paymentHistoryCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 2 || data.columnIndex === 3) {
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign: 'center'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  fetchData()
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
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}


// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 开模申请
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
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>

