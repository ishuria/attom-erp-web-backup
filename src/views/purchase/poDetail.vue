<template>
  <div class="step-form-container poDetail-container">
    <div :class="{ none: detailsNone }">
      <el-page-header style="margin-bottom: 0px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span>
              <strong>{{ handlePoTitle() }}</strong>
            </span>
            <el-button
              v-if="route.query.from !== 'plannedPoDetail' && route.query.from !== 'plannedPoCreate'"
              style="margin-left: 10px"
              type="primary"
            >
              SKU替换
            </el-button>
          </div>
        </template>
      </el-page-header>
      <el-card class="product-details-card" shadow="never">
        <el-row style="display: flex; width: 100%">
          <el-col class="custom-upload" :style="{ maxWidth: imageColumnHeight + 'px', padding: '0' }">
            <el-form label-position="top">
              <el-form-item label="订货套数">
                <el-input v-model="poDetailData.purchaseSkuNumber" :disabled="orderCount" @change="handleUpdateSkuCount" />
              </el-form-item>
              <el-form-item>
                <div class="image-cell" :style="{ height: imageColumnHeight + 'px', marginTop: 30 + 'px' }">
                  <!-- 有图片时显示 -->
                  <div v-if="poDetailData.skuImgUrl" class="image-preview">
                    <img alt="" :src="poDetailData.skuImgUrl" />
                    <div class="image-actions">
                      <el-icon @click="handlePreview(poDetailData.skuImgUrl)"><zoom-in /></el-icon>
                      <el-icon @click="handleRemove"><delete /></el-icon>
                    </div>
                  </div>
                  <!-- 无图片时显示 -->
                  <div v-else class="upload-placeholder" @click="showSkuUploadDialog">
                    <el-icon><plus /></el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="flex: 1.3; padding: 0">
            <el-form :inline="true" label-position="top">
              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="SKU">
                    <el-input v-model="poDetailData.sku" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品名称">
                    <el-input v-model="poDetailData.productName" @change="handleUpdateSku" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item data-label="创建日期" label="创建日期">
                    <el-input v-model="poDetailData.createTime" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品经理">
                    <el-input v-model="poDetailData.productManager" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品设计">
                    <el-input v-model="poDetailData.productDesign" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="8">
                  <el-form-item label="PO站点">
                    <el-select v-model="poDetailData.site" placeholder="请选择站点" @change="handleUpdatePoSite">
                      <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="需新品质检">
                    <el-checkbox
                      v-model="poDetailData.qualityMark"
                      class="custom-checkbox"
                      :disabled="route.query.del === 'true'"
                      :false-value="0"
                      :true-value="1"
                      @change="handleUpdateQualityMark"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收货仓库">
                    <el-select v-model="poDetailData.repositoryId" placeholder="请选择收货仓库" @change="handleUpdateSku">
                      <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="4">
                  <el-form-item data-label="SKU总含税价" label="SKU总含税价">
                    <el-input v-model="poDetailData.orderTotalPrice" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="起订量">
                    <el-input v-model="poDetailData.minQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整箱数">
                    <el-input v-model="poDetailData.numCartons" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="我方打包整箱数(近10次)">
                    <el-input v-model="poDetailData.packedTenRecord" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col style="flex: 1; padding: 0">
            <el-form label-position="top">
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">SKU备注</span>
                    </el-space>
                    <el-input v-model="poDetailData.skuRemarks" disabled resize="none" :rows="11" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-right: 0">
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">PO备注(仅采购填写)</span>
                    </el-space>
                    <el-input v-model="poDetailData.poRemarks" resize="none" :rows="11" type="textarea" @change="handleRemarksChange" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header style="margin-bottom: 0px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span><strong>SKU零配件清单（与开票一致）</strong></span>
          </div>
        </template>
      </el-page-header>
      <div class="comprehensive-table-container">
        <vab-query-form>
          <vab-query-form-left-panel :span="21" style="margin-top: 10px">
            <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
            <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
            <el-button type="primary" @click="handleUpdateAllComponentPrice">价格更新</el-button>
            <el-button type="primary" @click="handleShowUpdatePurchaserDialog">采购方和不报关更新</el-button>
            <el-text class="text-center" type="danger">注意：零件名修改仅限品名规范修正，严禁将一个零件的名字修改为另外一个零件</el-text>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="3" style="margin-top: 10px">
            <div class="custom-table-right-tools">
              <el-popover popper-style="max-height: 500px; overflow: auto;" :width="220">
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
                  :on-end="handleEnd"
                  :on-move="handleMove"
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
              </el-popover>
            </div>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="skuComponentList"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column label="图片" prop="componentUrl">
            <template #default="{ row }">
              <div class="image-cell">
                <!-- 有图片时显示 -->
                <div v-if="row.componentUrl" class="image-preview">
                  <img alt="" :src="row.componentUrl" />
                  <div class="image-actions">
                    <el-icon @click="handlePreview(row.componentUrl)"><zoom-in /></el-icon>
                    <el-icon @click="handleComponentRemove(row)"><delete /></el-icon>
                  </div>
                </div>
                <!-- 无图片时显示 -->
                <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
                  <el-icon><plus /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(skuComponentList, '零件名', 'componentName')">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.componentName" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.componentName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in checkList"
            :key="index"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleCalculateWidth(item)"
            :prop="item.prop"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '订货总数'">
                订货
                <br />
                总数
              </span>
              <span v-if="item.label === '多订数量'">
                多订
                <br />
                数量
              </span>
              <span v-if="item.label === '使用已有库存'">
                使用已
                <br />
                有库存
              </span>
              <span v-if="item.label === '已有库存'">
                已有
                <br />
                库存
              </span>
              <span v-if="item.label === '出厂单价'">
                出厂
                <br />
                单价
              </span>
              <span v-if="item.label === '出厂总价'">
                出厂
                <br />
                总价
              </span>
              <span v-if="item.label === '含税运费'">
                含税
                <br />
                运费
              </span>
              <span v-if="item.label === '模具费含税'">
                模具费
                <br />
                含税
              </span>
              <span v-if="item.label === '总未税价'">
                总未
                <br />
                税价
              </span>
              <span v-if="item.label === '总含税价'">
                总含
                <br />
                税价
              </span>
              <span v-if="item.label === '实际税点'">
                实际
                <br />
                税点
              </span>
              <span v-if="item.label === '开票税点'">
                开票
                <br />
                税点
              </span>
              <span v-if="item.label === '采购单位'">
                采购
                <br />
                单位
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'"></span>
              <span v-if="item.label === '零件名'"></span>
              <span v-if="item.label === '零件明细'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
                  </template>
                  <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
                </el-tooltip>
              </span>
              <span v-if="item.label === '订货总数'">
                <div class="none">
                  <el-input
                    v-model="row.purchaseCount"
                    type="number"
                    @blur="clickOtherCancel($event, row)"
                    @keyup.enter="clickOtherCancel($event, row)"
                  />
                </div>
                <span>{{ row.purchaseCount }}</span>
              </span>
              <span v-if="item.label === '多订数量'">
                <div class="none">
                  <el-input
                    v-model="row.moreCount"
                    type="number"
                    @blur="clickOtherCancel($event, row)"
                    @keyup.enter="clickOtherCancel($event, row)"
                  />
                </div>
                <span>{{ row.moreCount }}</span>
              </span>
              <span v-if="item.label === '使用已有库存'">
                <div class="none">
                  <el-input
                    v-model="row.useStockCount"
                    type="number"
                    @blur="clickOtherCancel($event, row)"
                    @keyup.enter="clickOtherCancel($event, row)"
                  />
                </div>
                <span>{{ row.useStockCount }}</span>
              </span>

              <span v-if="item.label === '出厂单价'">
                <div class="none">
                  <el-input
                    v-model="row.unitPrice"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.unitPrice }}</span>
              </span>
              <span v-if="item.label === '出厂总价'">
                <div class="none">
                  <el-input
                    v-model="row.totalPrice"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.totalPrice }}</span>
              </span>
              <span v-if="item.label === '含税运费'">
                <div class="none">
                  <el-input v-model="row.freight" type="number" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.freight }}</span>
              </span>
              <span v-if="item.label === '模具费含税'">
                <div class="none">
                  <el-input v-model="row.moldCost" type="number" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.moldCost }}</span>
              </span>
              <span v-if="item.label === '总含税价'">
                <div class="none">
                  <el-input
                    v-model="row.taxIncludedPrice"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.taxIncludedPrice }}</span>
              </span>
              <span v-if="item.label === '货币'">
                <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%" @change="updateSkuComponent(row)">
                  <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </span>
              <span v-if="item.label === '开票单位'">
                <div class="none">
                  <el-input
                    v-model="row.billingUnit"
                    type="string"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.billingUnit }}</span>
              </span>
              <span v-if="item.label === '每零件单位对应的开票单位数量'">
                <div class="none">
                  <el-input v-model="row.quantity" type="string" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.quantity }}</span>
              </span>
              <span v-if="item.label === '订单号'">
                <div class="none">
                  <el-input v-model="row.orderNo" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
                </div>
                <div class="order-no-container">
                  <el-tooltip content=" " effect="dark" placement="top">
                    <template #content>
                      <div class="custom-tooltip">{{ removeHtmlTags(row.orderNo) }}</div>
                    </template>
                    <div class="multi-line-ellipsis">{{ removeHtmlTags(row.orderNo) }}</div>
                  </el-tooltip>
                  <el-button
                    v-if="row.orderNo"
                    circle
                    class="copy-btn"
                    :icon="CopyDocument"
                    size="small"
                    type="primary"
                    @click.stop="handleClip(row.orderNo)"
                  />
                </div>
              </span>
              <span v-if="item.label === '零件采购注意事项'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                  </template>
                  <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </el-tooltip>
              </span>
              <span v-if="item.label === '供应商'">
                <div class="supplier-select-container">
                  <el-select
                    v-model="row.suppliserId"
                    placeholder=""
                    @change="handleSupplierAndInvoicingChange(row)"
                    @focus="handleGetRow(row)"
                  >
                    <el-option v-for="s in row.suppliserList" :key="s.id" :label="s.label" :value="s.id" />
                  </el-select>
                  <el-button
                    v-if="row.suppliserId && getSupplierName(row)"
                    circle
                    class="copy-btn"
                    :icon="CopyDocument"
                    size="small"
                    type="primary"
                    @click="handleClip(getSupplierName(row))"
                  />
                </div>
              </span>
              <span v-if="item.label === '开票'">
                <el-select
                  v-model="row.invoicing"
                  placeholder="请选择开票类型"
                  style="min-width: 100%"
                  @change="handleInvoicingChange(row)"
                  @focus="handleGetRow(row)"
                >
                  <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </span>
              <span v-if="item.label === '实际税点'">
                <div class="none">
                  <el-input
                    v-model="row.actualTaxRate"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.actualTaxRate }}</span>
              </span>
              <span v-if="item.label === '开票税点'">
                <div class="none">
                  <el-input
                    v-model="row.invoicingTaxRate"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.invoicingTaxRate }}</span>
              </span>
              <span v-if="item.label === '采购方'">
                <el-select
                  v-model="row.purchaseId"
                  placeholder="请选择默认采购方"
                  style="min-width: 100%"
                  @change="handleDefaultPurchase(row)"
                  @focus="handleGetRow(row)"
                >
                  <el-option v-for="p in purchaseOption" :key="p.id" :label="p.label" :value="p.id" />
                </el-select>
              </span>
              <span v-if="item.label === '不报关'">
                <el-checkbox
                  v-model="row.customsDeclarationStatus"
                  class="custom-checkbox"
                  :false-value="0"
                  :true-value="1"
                  @change="handleDeclareCustoms(row)"
                />
              </span>
              <span v-if="item.label === '采购链接'">
                <div class="none">
                  <el-input
                    v-model="row.purchaseLink"
                    type="text"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <el-tooltip content="" effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ row.purchaseLink }}</div>
                  </template>
                  <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
                </el-tooltip>
              </span>
              <span v-if="item.label === '起订量'">
                <div class="none">
                  <el-input
                    v-model="row.minQuantity"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.minQuantity }}</span>
              </span>
              <span v-if="item.label === '整箱数'">
                <div class="none">
                  <el-input
                    v-model="row.numCartons"
                    type="number"
                    @blur="clickCancel($event, row)"
                    @keyup.enter="clickCancel($event, row)"
                  />
                </div>
                <span>{{ row.numCartons }}</span>
              </span>
              <span v-if="item.label === '收货仓库'">
                <el-select
                  v-model="row.repositoryId"
                  filterable
                  placeholder="输入和搜索收货仓库"
                  style="min-width: 100%"
                  @change="updateSkuComponent(row)"
                >
                  <el-option v-for="r in repositoryOption" :key="r.id" :label="r.label" :value="r.id" />
                </el-select>
              </span>
              <span v-if="item.label === '合同条款'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
                  </template>
                  <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" @click="handleUpdateComponentPrice(row)">
                  更新单价
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleUpdateComponentPrice(row)">
                      <el-link type="primary" underline="never">更新单价</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelPoSKuComponent(row, $index)">
                      <el-link type="danger" underline="never">删除</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="showModify(row)">
                      <el-link type="primary" underline="never">修改零件报关</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <el-footer class="button-center">
          <el-button v-if="previousVisible" type="primary" @click="handleFetchPreviousData">上一个</el-button>
          <el-button v-if="nextVisible" type="primary" @click="handleFetchNextData">下一个</el-button>
          <el-button type="warning" @click="handleAddSKU">添加SKU</el-button>
          <el-button v-if="poSkuIdList.length > 1 && route.query.from !== 'plannedPoDetail'" type="danger" @click="handleDelSKU">
            删除SKU
          </el-button>
          <el-button v-if="poSkuIdList.length > 1 && route.query.from === 'plannedPoDetail'" type="danger" @click="handleDelPlanPoSKU">
            删除SKU
          </el-button>
        </el-footer>
      </div>
    </div>
    <div :class="{ none: createNone }">
      <el-page-header style="margin-bottom: 0px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span><strong>采购计划创建</strong></span>
          </div>
        </template>
      </el-page-header>
      <el-card class="product-details-card" shadow="never">
        <el-row style="display: flex; width: 100%">
          <el-col class="custom-upload" :style="{ maxWidth: imageColumnHeight + 'px', padding: '0' }">
            <el-form label-position="top">
              <el-form-item label="订货套数">
                <el-input v-model="poDetailData.purchaseSkuNumber" :disabled="createDisabled" @change="handleUpdateCreateSkuCount" />
              </el-form-item>
              <el-form-item>
                <div class="image-cell" :style="{ height: imageColumnHeight + 'px', marginTop: 30 + 'px' }">
                  <!-- 有图片时显示 -->
                  <div v-if="poDetailData.skuImgUrl" class="image-preview">
                    <img alt="" :src="poDetailData.skuImgUrl" />
                    <div class="image-actions">
                      <el-icon @click="handlePreview(poDetailData.skuImgUrl)"><zoom-in /></el-icon>
                    </div>
                  </div>
                  <!-- 无图片时显示 -->
                  <div v-else class="upload-placeholder">
                    <el-icon><plus /></el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="flex: 1.3; padding: 0">
            <el-form :inline="true" label-position="top">
              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="SKU">
                    <el-select
                      v-model.trim="poDetailData.sku"
                      default-first-option
                      filterable
                      :loading="skuLoading"
                      placeholder="点击输入和搜索"
                      remote
                      :remote-method="remotePeopleMethod"
                      @change="handleCreatePlanPo"
                    >
                      <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品名称">
                    <el-input v-model="poDetailData.productName" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item data-label="创建日期2" label="创建日期">
                    <el-input v-model="poDetailData.createTime" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品经理">
                    <el-input v-model="poDetailData.productManager" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品设计">
                    <el-input v-model="poDetailData.productDesign" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="8">
                  <el-form-item label="PO站点">
                    <el-select v-model="poDetailData.site" :disabled="createDisabled" placeholder="请选择站点" @change="updateCreate">
                      <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="需新品质检">
                    <el-checkbox
                      v-model="poDetailData.qualityMark"
                      class="custom-checkbox"
                      :false-value="0"
                      :true-value="1"
                      @change="updateCreate"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收货仓库">
                    <el-select
                      v-model="poDetailData.repositoryId"
                      :disabled="createDisabled"
                      placeholder="请选择收货仓库"
                      @change="updateCreate"
                    >
                      <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="4">
                  <el-form-item data-label="SKU总含税价2" label="SKU总含税价">
                    <el-input v-model="poDetailData.orderTotalPrice" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="起订量">
                    <el-input v-model="poDetailData.minQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整箱数">
                    <el-input v-model="poDetailData.numCartons" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="我方打包整箱数(近10次)">
                    <el-input v-model="poDetailData.packedTenRecord" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col style="flex: 1; padding: 0">
            <el-form label-position="top">
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">SKU备注</span>
                    </el-space>
                    <el-input v-model="poDetailData.skuRemarks" disabled resize="none" :rows="11" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-right: 0">
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">PO备注</span>
                    </el-space>
                    <el-input
                      v-model="poDetailData.poRemarks"
                      :disabled="createDisabled"
                      resize="none"
                      :rows="11"
                      type="textarea"
                      @change="updateCreate"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header style="margin-bottom: 0px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span><strong>SKU零配件清单（与开票一致）</strong></span>
          </div>
        </template>
      </el-page-header>
      <div class="comprehensive-table-container">
        <vab-query-form>
          <vab-query-form-left-panel :span="24" style="margin-top: 10px">
            <!-- <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
            <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
            <el-text type="danger" class="text-center">注意：零件名修改仅限品名规范修正，严禁将一个零件的名字修改为另外一个零件</el-text> -->
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="skuComponentList"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="changeCreateInput"
        >
          <el-table-column align="center" fixed="left" label="图片" width="81.2px">
            <template #default="{ row }">
              <div class="image-cell">
                <!-- 有图片时显示 -->
                <div v-if="row.componentUrl" class="image-preview">
                  <img alt="" :src="row.componentUrl" />
                  <div class="image-actions">
                    <el-icon @click="handlePreview(row.componentUrl)"><zoom-in /></el-icon>
                  </div>
                </div>
                <!-- 无图片时显示 -->
                <div v-else class="upload-placeholder">
                  <el-icon><plus /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="零件ID" prop="existingPartsListId" width="80" />
          <el-table-column
            fixed="left"
            label="零件名"
            prop="componentName"
            :width="flexColumnWidth(skuComponentList, '零件名', 'componentName')"
          >
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.componentName"
                  @blur="clickCreateOtherCancel($event, row)"
                  @keyup.enter="clickCreateOtherCancel($event, row)"
                />
              </div>
              <span>{{ row.componentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="零件明细" min-width="120" prop="componentSuitDetail">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订货总数"
            prop="purchaseCount"
            :width="flexColumnWidth(skuComponentList, '订货', 'purchaseCount')"
          >
            <template #header>
              订货
              <br />
              总数
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.purchaseCount"
                  class="reduce-input"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.purchaseCount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="多订数量" prop="moreCount" :width="flexColumnWidth(skuComponentList, '多订', 'moreCount')">
            <template #header>
              多订
              <br />
              数量
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.moreCount"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.moreCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="使用已有库存"
            prop="useStockCount"
            :width="flexColumnWidth(skuComponentList, '使用已', 'useStockCount')"
          >
            <template #header>
              使用已
              <br />
              有库存
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.useStockCount"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.useStockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="已有库存" prop="stock" :width="flexColumnWidth(skuComponentList, '已有', 'stock')">
            <template #header>
              已有
              <br />
              库存
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购单位" prop="unit" :width="flexColumnWidth(skuComponentList, '单位', 'unit')">
            <template #header>
              采购
              <br />
              单位
            </template>
          </el-table-column>

          <el-table-column align="center" label="出厂单价" prop="unitPrice" :width="flexColumnWidth(skuComponentList, '出厂', 'unitPrice')">
            <template #header>
              出厂
              <br />
              单价
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.unitPrice"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="出厂总价"
            prop="totalPrice"
            :width="flexColumnWidth(skuComponentList, '出厂', 'totalPrice')"
          >
            <template #header>
              出厂
              <br />
              总价
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.totalPrice"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="含税运费" prop="freight" :width="flexColumnWidth(skuComponentList, '含税', 'freight')">
            <template #header>
              含税
              <br />
              运费
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.freight"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.freight }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模具费含税"
            prop="moldCost"
            :width="flexColumnWidth(skuComponentList, '模具费', 'moldCost')"
          >
            <template #header>
              模具费
              <br />
              含税
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.moldCost"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.moldCost }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总未税价"
            prop="preTaxPrice"
            :width="flexColumnWidth(skuComponentList, '总未', 'preTaxPrice')"
          >
            <template #header>
              总未
              <br />
              税价
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总含税价"
            prop="taxIncludedPrice"
            :width="flexColumnWidth(skuComponentList, '总含', 'taxIncludedPrice')"
          >
            <template #header>
              总含
              <br />
              税价
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.taxIncludedPrice"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.taxIncludedPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="货币" prop="currency" width="105px">
            <template #default="{ row }">
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%" @change="updateCreate">
                <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单号" min-width="100" prop="orderNo">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.orderNo"
                  @blur="clickCreateOtherCancel($event, row)"
                  @keyup.enter="clickCreateOtherCancel($event, row)"
                />
              </div>
              <span>{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商" min-width="205" prop="suppliserId">
            <template #default="{ row }">
              <div class="supplier-select-container">
                <el-select v-model="row.suppliserId" @change="updateCreate">
                  <el-option v-for="item in row.suppliserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
                <el-button
                  v-if="row.suppliserId && getSupplierName(row)"
                  circle
                  class="copy-btn"
                  :icon="CopyDocument"
                  size="small"
                  type="primary"
                  @click="handleClip(getSupplierName(row))"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开票" prop="oem" width="130">
            <template #default="{ row }">
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handleUpdateInvoicing(row)">
                <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际税点" min-width="60" prop="actualTaxRate">
            <template #header>
              实际
              <br />
              税点
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.actualTaxRate"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.actualTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
            <template #header>
              开票
              <br />
              税点
            </template>
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.invoicingTaxRate"
                  type="number"
                  @blur="clickCreateCancel($event, row, $index)"
                  @keyup.enter="clickCreateCancel($event, row, $index)"
                />
              </div>
              <span>{{ row.invoicingTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购方" min-width="130" prop="purchaseId">
            <template #default="{ row }">
              <el-select
                v-model="row.purchaseId"
                placeholder="请选择默认采购方"
                style="min-width: 100%"
                @change="handleCreateDefaultPurchase(row)"
              >
                <el-option v-for="item in purchaseOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.customsDeclarationStatus"
                class="custom-checkbox"
                :false-value="0"
                :true-value="1"
                @change="handleCreateCustoms(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="采购链接" min-width="140" prop="purchaseLink">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.purchaseLink"
                  type="text"
                  @blur="clickCreateOtherCancel($event, row)"
                  @keyup.enter="clickCreateOtherCancel($event, row)"
                />
              </div>
              <el-tooltip content="" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.purchaseLink }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column align="center" label="起订量" min-width="80" prop="minQuantity">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.minQuantity"
                  type="number"
                  @blur="clickCreateOtherCancel($event, row)"
                  @keyup.enter="clickCreateOtherCancel($event, row)"
                />
              </div>
              <span>{{ row.minQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="整箱数" min-width="80" prop="numCartons">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.numCartons"
                  type="number"
                  @blur="clickCreateOtherCancel($event, row)"
                  @keyup.enter="clickCreateOtherCancel($event, row)"
                />
              </div>
              <span>{{ row.numCartons }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收货仓库" min-width="160" prop="repositoryId">
            <template #default="{ row }">
              <el-select
                v-model="row.repositoryId"
                filterable
                placeholder="输入和搜索收货仓库"
                style="min-width: 100%"
                @change="updateCreate"
              >
                <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="合同条款" min-width="200" prop="contractTerms">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" min-width="100">
            <template #default="{ $index }">
              <el-link type="danger" underline="never" @click="handleCreateDelComponent($index)">删除</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <el-footer class="button-center">
          <el-button v-if="createPreviousVisible" type="primary" @click="handleFetchCreatePrevious">上一个</el-button>
          <el-button v-if="createNextVisible" type="primary" @click="handleFetchCreateNext">下一个</el-button>
          <el-button type="warning" @click="handleCreateAddSKU">添加SKU</el-button>
          <el-button :disabled="createDisabled" type="danger" @click="handleDelCreateSKU">删除SKU</el-button>
          <el-button :disabled="createDisabled" :loading="createPoLoading" type="success" @click="createSku">创建PO</el-button>
        </el-footer>
      </div>
    </div>
    <div :class="{ none: deleteNone }">
      <el-page-header style="margin-bottom: 0px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span>
              <strong>{{ route.query.from }}</strong>
            </span>
          </div>
        </template>
      </el-page-header>
      <el-card class="product-details-card" shadow="never">
        <el-row style="display: flex; width: 100%">
          <el-col class="custom-upload" :style="{ maxWidth: imageColumnHeight + 'px', padding: '0' }">
            <el-form label-position="top">
              <el-form-item label="订货套数">
                <el-input v-model="poDetailData.purchaseSkuNumber" disabled />
              </el-form-item>
              <el-form-item>
                <div class="image-cell" :style="{ height: imageColumnHeight + 'px', marginTop: 30 + 'px' }">
                  <!-- 有图片时显示 -->
                  <div v-if="poDetailData.skuImgUrl" class="image-preview">
                    <img alt="" :src="poDetailData.skuImgUrl" />
                    <div class="image-actions">
                      <el-icon @click="handlePreview(poDetailData.skuImgUrl)"><zoom-in /></el-icon>
                    </div>
                  </div>
                  <!-- 无图片时显示 -->
                  <div v-else class="upload-placeholder">
                    <el-icon><plus /></el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="flex: 1.3; padding: 0">
            <el-form :inline="true" label-position="top">
              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="SKU">
                    <el-input v-model="poDetailData.sku" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品名称">
                    <el-input v-model="poDetailData.productName" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item data-label="创建日期3" label="创建日期">
                    <el-input v-model="poDetailData.createTime" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品经理">
                    <el-input v-model="poDetailData.productManager" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产品设计">
                    <el-input v-model="poDetailData.productDesign" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="PO站点">
                    <el-select v-model="poDetailData.site" disabled placeholder="请选择站点">
                      <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收货仓库">
                    <el-select v-model="poDetailData.repositoryId" disabled placeholder="请选择收货仓库">
                      <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="4">
                  <el-form-item data-label="SKU总含税价3" label="SKU总含税价">
                    <el-input v-model="poDetailData.orderTotalPrice" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="起订量">
                    <el-input v-model="poDetailData.minQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整箱数">
                    <el-input v-model="poDetailData.numCartons" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="我方打包整箱数(近10次)">
                    <el-input v-model="poDetailData.packedTenRecord" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col style="flex: 1; padding: 0">
            <el-form label-position="top">
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">SKU备注</span>
                    </el-space>
                    <el-input v-model="poDetailData.skuRemarks" disabled resize="none" :rows="11" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-right: 0">
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size)">PO备注</span>
                    </el-space>
                    <el-input v-model="poDetailData.poRemarks" disabled resize="none" :rows="11" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header style="margin-bottom: 15px" @back="goBack">
        <template #title>退出</template>
        <template #content>
          <div class="flex items-center">
            <span><strong>SKU零配件清单（与开票一致）</strong></span>
          </div>
        </template>
      </el-page-header>
      <div class="comprehensive-table-container">
        <el-table
          ref="tableRef"
          border
          :cell-class-name="getCellClass"
          class="noneHoveTable"
          :data="skuComponentList"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
        >
          <el-table-column align="center" fixed="left" label="图片" width="81.2px">
            <template #default="{ row }">
              <div class="image-cell">
                <!-- 有图片时显示 -->
                <div v-if="row.componentUrl" class="image-preview">
                  <img alt="" :src="row.componentUrl" />
                  <div class="image-actions">
                    <el-icon @click="handlePreview(row.componentUrl)"><zoom-in /></el-icon>
                  </div>
                </div>
                <!-- 无图片时显示 -->
                <div v-else class="upload-placeholder">
                  <el-icon><plus /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="left" label="零件ID" prop="existingPartsListId" width="80" />
          <el-table-column
            fixed="left"
            label="零件名"
            prop="componentName"
            :width="flexColumnWidth(skuComponentList, '零件名', 'componentName')"
          />
          <el-table-column label="零件明细" prop="componentSuitDetail" width="100">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订货总数"
            prop="purchaseCount"
            :width="flexColumnWidth(skuComponentList, '订货', 'purchaseCount')"
          >
            <template #header>
              订货
              <br />
              总数
            </template>
          </el-table-column>
          <el-table-column align="center" label="多订数量" prop="moreCount" :width="flexColumnWidth(skuComponentList, '多订', 'moreCount')">
            <template #header>
              多订
              <br />
              数量
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="使用已有库存"
            prop="useStockCount"
            :width="flexColumnWidth(skuComponentList, '使用已', 'useStockCount')"
          >
            <template #header>
              使用已
              <br />
              有库存
            </template>
          </el-table-column>
          <el-table-column align="center" label="已有库存" prop="stock" :width="flexColumnWidth(skuComponentList, '已有', 'stock')">
            <template #header>
              已有
              <br />
              库存
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购单位" prop="unit" :width="flexColumnWidth(skuComponentList, '单位', 'unit')">
            <template #header>
              采购
              <br />
              单位
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂单价" prop="unitPrice" :width="flexColumnWidth(skuComponentList, '出厂', 'unitPrice')">
            <template #header>
              出厂
              <br />
              单价
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="出厂总价"
            prop="totalPrice"
            :width="flexColumnWidth(skuComponentList, '出厂', 'totalPrice')"
          >
            <template #header>
              出厂
              <br />
              总价
            </template>
          </el-table-column>
          <el-table-column align="center" label="含税运费" prop="freight" :width="flexColumnWidth(skuComponentList, '含税', 'freight')">
            <template #header>
              含税
              <br />
              运费
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模具费含税"
            prop="moldCost"
            :width="flexColumnWidth(skuComponentList, '模具费', 'moldCost')"
          >
            <template #header>
              模具费
              <br />
              含税
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总未税价"
            prop="preTaxPrice"
            :width="flexColumnWidth(skuComponentList, '总未', 'preTaxPrice')"
          >
            <template #header>
              总未
              <br />
              税价
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总含税价"
            prop="taxIncludedPrice"
            :width="flexColumnWidth(skuComponentList, '总含', 'taxIncludedPrice')"
          >
            <template #header>
              总含
              <br />
              税价
            </template>
          </el-table-column>
          <el-table-column label="货币" prop="currency" width="105px">
            <template #default="{ row }">
              <el-select v-model="row.currency" disabled placeholder="请选择货币" style="min-width: 100%">
                <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单号" min-width="100" prop="orderNo" />
          <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商" min-width="205" prop="suppliserId">
            <template #default="{ row }">
              <div class="supplier-display-container">
                <span class="supplier-name">{{ getSupplierName(row) }}</span>
                <el-button
                  v-if="getSupplierName(row)"
                  circle
                  class="copy-btn"
                  :icon="CopyDocument"
                  size="small"
                  type="primary"
                  @click="handleClip(getSupplierName(row))"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开票" prop="oem" width="130">
            <template #default="{ row }">
              <el-select v-model="row.invoicing" disabled placeholder="请选择开票类型" style="min-width: 100%">
                <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际税点" min-width="60" prop="actualTaxRate">
            <template #header>
              实际
              <br />
              税点
            </template>
          </el-table-column>
          <el-table-column align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
            <template #header>
              开票
              <br />
              税点
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购方" min-width="130" prop="purchaseId">
            <template #default="{ row }">
              <el-select v-model="row.purchaseId" disabled placeholder="请选择默认采购方" style="min-width: 100%">
                <el-option v-for="item in purchaseOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="不报关" min-width="75" prop="customsDeclarationStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="采购链接" min-width="140" prop="purchaseLink">
            <template #default="{ row }">
              <el-tooltip content="" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.purchaseLink }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column align="center" label="起订量" min-width="80" prop="minQuantity" />
          <el-table-column align="center" label="整箱数" min-width="80" prop="numCartons" />
          <el-table-column label="收货仓库" min-width="160" prop="repositoryId">
            <template #default="{ row }">
              <el-select v-model="row.repositoryId" disabled filterable placeholder="输入和搜索收货仓库" style="min-width: 100%">
                <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="合同条款" min-width="200" prop="contractTerms">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="130">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="handleShowModify(row)">
                {{ route.query.tab === 'view' ? '查看' : '修改' }}零件报关
              </el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
          </template>
        </el-table>
        <el-footer class="button-center">
          <el-button v-if="previousVisible" type="primary" @click="handleFetchPreviousData">上一个</el-button>
          <el-button v-if="nextVisible" type="primary" @click="handleFetchNextData">下一个</el-button>
        </el-footer>
      </div>
    </div>
    <wang-editor
      :classify="classify"
      :content="editorContent"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorVisible"
      @click-boolean="clickEditorCancel"
      @click-child="clickEditorConfirm"
    />

    <!-- 添加零件 -->
    <vab-add-component
      :create-component-visible="createComponentVisible"
      :sku="sku"
      type="po"
      @update:create-component-visible="handleCloseCreateComponent"
      @update:table-value="handleSubmitComponent"
    />
    <!-- 添加耗材 -->
    <vab-add-consumable
      :create-consumable-visible="createConsumableVisible"
      :sku="sku"
      type="po"
      @update:create-consumable-visible="handleCloseCreateConsumable"
      @update:table-value="handleSubmitConsumable"
    />
    <!-- 采购方更新 -->
    <vab-dialog
      v-model="updatePurchaserVisible"
      :before-close="handleCloseUpdatePurchaserDialog"
      class="dialog"
      title="采购方更新"
      width="15%"
    >
      <el-divider class="divider-margin" />
      <div style="margin: 0">
        <el-checkbox v-model="purchaser0" label="更新SKU库" size="large" />
        <el-checkbox v-model="purchaser1" label="更新零件库" size="large" />
      </div>
      <template #footer>
        <span>
          <el-button @click="updatePurchaserVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmUpdatePurchaser">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <!-- 添加 SKU -->
    <vab-dialog v-model="addSKUVisible" title="添加SKU" width="20%">
      <el-form ref="addSkuFormRef" :model="addSkuForm" style="margin-right: 20px; margin-left: 20px">
        <el-form-item label="选择要添加的SKU" prop="sku">
          <el-select
            v-model="addSkuForm.sku"
            clearable
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remotePeopleMethod"
          >
            <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAddSku">取消</el-button>
        <el-button :loading="addSkuLoading" type="primary" @click="handleConfirmAddSKU">确认</el-button>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- SKU上传图片 -->
    <vab-image-upload v-model="skuImageUploadVisible" @image-upload="uploadImage" />
    <!-- 零件上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadSkuComponentImage" />
    <!-- 零件报关修改 -->
    <vab-dialog v-model="modifyVisible" :title="`${route.query.tab === 'view' ? '查看' : '修改'}零件报关`" width="20%">
      <el-form
        ref="modifyFormRef"
        label-position="left"
        label-width="auto"
        :model="modifyForm"
        :rules="modifyFormRules"
        style="margin-left: 0; margin-right: 0"
      >
        <el-form-item label="采购单位" prop="unit">
          <el-input v-model="modifyForm.unit" disabled />
        </el-form-item>
        <el-form-item label="开票单位" prop="billingUnit">
          <el-input v-model="modifyForm.billingUnit" clearable />
        </el-form-item>
        <el-form-item label="每零件单位有多少个开票单位" prop="quantity">
          <el-input-number
            v-model="modifyForm.quantity"
            align="left"
            controls-position="right"
            :min="0"
            :precision="10"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button v-if="route.query.tab !== 'view'" type="primary" @click="handleConfirmModify">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CopyDocument, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { getProductComponentPurchase, getProductComponentStore } from '/@/api/devlocal/productInformation'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import {
  addPoSKU,
  createPlanPo,
  deleteComponentImg,
  deletePoSku,
  deletePoSkuComponent,
  deletePurchasePlanPo,
  deletePurchasePlanPoSkuComponent,
  deleteSkuImg,
  getPoContractTerms,
  getPoDetail,
  getPoPurchaseMatters,
  getPoSkuComponentList,
  getPoSkuComponentSuitDetail,
  getPoSkuIdList,
  getPoSkuList,
  getPurchaseComponentCustomInfo,
  getPurchaseSKU,
  submitPurchaseComponent,
  submitPurchaseConsumable,
  updateAllComponentPrice,
  updateBuyerAndCustomsDeclaration,
  updateComponentPrice,
  updateCreateComponent,
  updateCreateSkuCount,
  updatePoContractTerms,
  updatePoPurchaseMatters,
  updatePoRemarks,
  updatePoSite,
  updatePoSkuComponent,
  updatePoSkuComponentSuitDetail,
  updatePoSkuComponentSuppliser,
  updatePurchaseComponentCustomInfo,
  updatePurchasePlanPoQualityMark,
  updateSkuCount,
  updateSkuDetail,
  updateSkuImg,
  uploadComponentImg,
} from '/@/api/devlocal/purchasePo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSkuStore } from '/@/store/modules/sku'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IPurchaseOption, IRepositoryOption, ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { handleClip } from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { handleActivePath, handleMatched, handleTabs } from '/@/utils/routes'
import { _addSku, _clearSKUs, _deleteSku, _updateSku } from '/@/utils/sku'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { currencyNumList, invoicingNumList } from '/@/views/purchase/constantOption.ts'

defineOptions({
  name: 'PoDetail',
})

// 获取供应商名称的辅助函数
const getSupplierName = (row: any) => {
  if (!row.suppliserId || !row.suppliserList) return ''
  const supplier = row.suppliserList.find((item: any) => item.id === row.suppliserId)
  return supplier ? supplier.label : ''
}

const addSkuLoading = ref<boolean>(false)

const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<any>({})
const modifyFormRef = ref()

// 表单验证规则
const modifyFormRules = {
  billingUnit: [
    { required: true, message: '请输入开票单位', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === null || value === undefined || value === '') {
          callback(new Error('请输入开票单位'))
        } else {
          // 检查是否为纯数字，如果是数字则提示错误
          const numValue = parseFloat(value)
          if (!isNaN(numValue) && value.toString().trim() === numValue.toString()) {
            callback(new Error('开票单位不能为数字'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur',
    },
  ],
  quantity: [
    { required: true, message: '请输入每零件单位有多少个开票单位', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === null || value === undefined || value === '') {
          callback(new Error('请输入每零件单位有多少个开票单位'))
        } else if (value <= 0) {
          callback(new Error('数量必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const handleShowModify = async (row: any) => {
  if (route.query.tab === 'view') {
    await fetchPurchaseComponentCustomInfo(row)
  } else {
    await showModify(row)
  }
}
const fetchPurchaseComponentCustomInfo = async (row: any) => {
  modifyVisible.value = true
  const { data } = await getPurchaseComponentCustomInfo({ id: row.id })
  Object.assign(modifyForm, data)
}
const showModify = (row: any) => {
  $baseConfirm('需要一起修改否则报关资料会有错误！', null, async () => {
    await fetchPurchaseComponentCustomInfo(row)
  })
}
const handleConfirmModify = async () => {
  try {
    // 表单验证
    await modifyFormRef.value.validate()

    const { data } = await updatePurchaseComponentCustomInfo({ ...modifyForm })
    if (data) {
      $baseMessage('修改零件报关信息成功！', 'success')
      modifyVisible.value = false
    }
  } catch (error: any) {
    if (error.errors) {
      // 表单验证失败
      $baseMessage('请检查表单输入', 'error')
    } else {
      $baseMessage('修改零件报关信息失败！', 'error')
    }
  }
}
const createPoLoading = ref<boolean>(false)
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
const columns = ref<any>([])

const checkList = computed(() => {
  return columns.value.filter((item: any) => item.checked)
})
// 是否显示或隐藏列
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
// 计算某些列的自适应宽度
const handleCalculateWidth = (item: any) => {
  switch (item.label) {
    case '订货总数': {
      return flexColumnWidth(skuComponentList.value, '订货', 'purchaseCount')
    }
    case '使用已有库存': {
      return flexColumnWidth(skuComponentList.value, '使用已', 'useStockCount')
    }
    case '已有库存': {
      return flexColumnWidth(skuComponentList.value, '已有', 'stock')
    }
    case '单位': {
      return flexColumnWidth(skuComponentList.value, '单位', 'unit')
    }
    case '出厂单价': {
      return flexColumnWidth(skuComponentList.value, '出厂', 'unitPrice')
    }
    case '出厂总价': {
      return flexColumnWidth(skuComponentList.value, '出厂', 'totalPrice')
    }
    case '含税运费': {
      return flexColumnWidth(skuComponentList.value, '含税', 'freight')
    }
    case '模具费含税': {
      return flexColumnWidth(skuComponentList.value, '模具费', 'moldCost')
    }
    case '总未税价': {
      return flexColumnWidth(skuComponentList.value, '总未', 'preTaxPrice')
    }
    case '总含税价': {
      return flexColumnWidth(skuComponentList.value, '总含', 'taxIncludedPrice')
    }
    default: {
      return item.minWidth
    }
  }
}
// 详情div显示与否
const detailsNone = ref<boolean>(false)
// 创建div显示与否
const createNone = ref<boolean>(true)
// 已删除显示与否
const deleteNone = ref<boolean>(true)
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const routesStore = useRoutesStore()
const { changeTabsMeta, delVisitedRoute } = tabsStore
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
// 创建进来的，需要判断sku填没填，没填就都disabled掉
const createDisabled = ref<boolean>(false)
// po详情
const poDetailData = ref<any>({})
const sku = ref<string>('')
// PoSku配件数据
const skuComponentList = ref<any>([])
// 添加SKU是否可见
const addSKUVisible = ref<boolean>(false)
// 添加SKU表单
const addSkuForm = reactive<any>({
  sku: '',
})
const addSkuFormRef = ref<FormInstance>()
const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<any[]>([]) //搜索选项
const skuList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  query = query.trim()
  if (query) {
    const { data } = await getPoSkuList({
      sku: query,
    })

    skuList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    skuLoading.value = true
    setTimeout(() => {
      skuLoading.value = false
      skuOptions.value = skuList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    skuOptions.value = []
  }
}
const handleCloseAddSku = () => {
  addSkuFormRef.value?.resetFields()
  addSKUVisible.value = false
}
// planPo更新需新品质检
const handleUpdateQualityMark = async () => {
  await updatePurchasePlanPoQualityMark({
    poSkuId: poDetailData.value.poSkuId,
    status: poDetailData.value.qualityMark,
  })
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const skuStore = useSkuStore()
const tempCurId = ref<string>('')
// 选择sku的请求和赋值
const afterGetSku = async (_sku: string) => {
  const { data } = await getPurchaseSKU({
    sku: _sku,
  })
  if (data) {
    // 选择了sku或者添加了SKU，其他输入框就不用disable
    createDisabled.value = false
    // 获取旧的订货套数
    oldPurchaseNumber.value = data.poSkuDetail.purchaseSkuNumber

    // 将数据显示在页面上
    Object.assign(poDetailData.value, data.poSkuDetail)
    poDetailData.value.createTime = poDetailData.value.createTime ? poDetailData.value.createTime.split(' ')[0] : ''

    // Object.assign(skuComponentList.value, data.componentList)
    skuComponentList.value = data.componentList
    skuComponentList.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
    })
    // 存入新的数据
    tempCurId.value = generateUUID()
    // 深拷贝对象，避免引用问题
    const newSku = {
      poDetailData: JSON.parse(JSON.stringify(poDetailData.value)),
      skuComponentList: JSON.parse(JSON.stringify(skuComponentList.value)),
    }
    _addSku(newSku, tempCurId.value)
    console.log('存入新数据', skuStore.data)
    console.log(tempCurId.value)
    handleShowCreatePreviousOrNext()
    // fetchPurchaseAndRepository()
  }
}
// 确认添加sku
const handleConfirmAddSKU = async () => {
  addSkuLoading.value = true
  try {
    // 如果是创建，就是和上面一样的接口
    if (route.query.from === 'plannedPoCreate') {
      // 存入新的数据
      afterGetSku(addSkuForm.sku)

      $baseMessage('添加SKU成功', 'success')
      handleCloseAddSku()
    } else {
      const { data: addPoSkuData } = await addPoSKU({
        poId: poDetailData.value.id,
        sku: addSkuForm.sku,
      })
      if (addPoSkuData) {
        $baseMessage('添加SKU成功', 'success')
        handleCloseAddSku()
        router.replace({ query: { ...route.query, poSkuId: addPoSkuData.poSkuDetail.poSkuId } })
      }
    }
  } catch (error) {
    console.error(error)
  }
  addSkuLoading.value = false
}
// 更新采购方是否可见
const updatePurchaserVisible = ref<boolean>(false)
const purchaser0 = ref<boolean>(false)
const purchaser1 = ref<boolean>(false)
// 控制上一个显示
const previousVisible = ref<boolean>(false)
// 控制下一个显示
const nextVisible = ref<boolean>(false)
// 创建的上一个显示
const createPreviousVisible = ref<boolean>(false)
// 创建的下一个显示
const createNextVisible = ref<boolean>(false)
// po的SkuId列表
const poSkuIdList = ref<number[]>([])
// 当前skuId在id列表的下标
const poSkuIdIndex = ref<number>()

// 处理订单详情的标题
const handlePoTitle = () => {
  if (route.query.from === 'plannedPoDetail') {
    return '计划详情'
  } else {
    return route.query.from
  }
}
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否
//点击添加零件
const handleAddComponent = async () => {
  if (route.query.from === 'plannedPoCreate' && !poDetailData.value.sku) {
    $baseMessage('请先创建SKU', 'warning')
    return
  }
  sku.value = poDetailData.value.sku
  createComponentVisible.value = true
}
//点击添加耗材
const handleAddConsumable = () => {
  if (route.query.from === 'plannedPoCreate' && !poDetailData.value.sku) {
    $baseMessage('请先创建SKU', 'warning')
    return
  }
  sku.value = poDetailData.value.sku
  createConsumableVisible.value = true
}

// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {
  if (route.query.from === 'plannedPoCreate') {
    return
  }
  let list: ISubmitPurchaseComponent[] = []
  value.forEach((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        sku: item.sku,
        suppliserId: Number(item.suppliserId),
        count: Number(item.count),
      })
    }
  })

  try {
    const { data } = await submitPurchaseComponent({
      poId: poDetailData.value.id,
      poSkuId: poDetailData.value.poSkuId,
      list,
    })
    if (data === true) {
      $baseMessage('添加零件提交成功', 'success', 'hey')
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  if (route.query.from === 'plannedPoCreate') {
    return
  }
  let list: ISubmitPurchaseConsumable[] = []
  value.forEach((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        suppliserId: Number(item.suppliserId),
        count: Number(item.count),
      })
    }
  })
  try {
    const { data } = await submitPurchaseConsumable({
      poId: poDetailData.value.id,
      poSkuId: poDetailData.value.poSkuId,
      list,
    })
    if (data === true) {
      $baseMessage('添加耗材提交成功', 'success', 'hey')
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 打开更新采购方对话框
const handleShowUpdatePurchaserDialog = () => {
  updatePurchaserVisible.value = true
}
// 关闭更新采购方对话框
const handleCloseUpdatePurchaserDialog = () => {
  updatePurchaserVisible.value = false
}

// 点击更新采购方确认
const handleConfirmUpdatePurchaser = async () => {
  // 都不选，点击确认，判断两个都没勾选，就直接报错，必须勾选一个
  if (!purchaser0.value && !purchaser1.value) {
    $baseMessage('两个选项至少勾选一个', 'error', 'hey')
  } else if (purchaser0.value && !purchaser1.value) {
    //只勾选了第一个，点击确认，可以提交，传递参数0
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '0',
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  } else if (!purchaser0.value && purchaser1.value) {
    //只勾选了第二个，点击确认，可以提交，传递参数1
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '1',
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  } else if (purchaser0.value && purchaser1.value) {
    //勾选两个，提交0，1
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '0,1',
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  }
}

// PO详情SKU订货套数更新
const handleUpdateSkuCount = async () => {
  try {
    const { data } = await updateSkuCount({
      poId: Number(route.query.poId),
      poSkuId: poDetailData.value.poSkuId,
      count: poDetailData.value.purchaseSkuNumber,
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 创建修改订货套数
const handleUpdateCreateSkuCount = async () => {
  try {
    const { data } = await updateCreateSkuCount({
      newPurchaseSkuNumber: Number(poDetailData.value.purchaseSkuNumber),
      oldPurchaseSkuNumber: oldPurchaseNumber.value,
      componentList: skuComponentList.value,
    })
    if (data) {
      // 旧的等于新的
      oldPurchaseNumber.value = Number(poDetailData.value.purchaseSkuNumber)
      poDetailData.value.orderTotalPrice = data.skuTotalPrice
      skuComponentList.value = data.componentList
      updateCreate()

      skuComponentList.value.forEach((item: any) => {
        item.unitPrice = formattedPrice(item.unitPrice)
      })
    }
  } catch (error) {
    console.error(error)
  }
}
const updateCreate = () => {
  const newSku = {
    tempId: tempCurId.value,
    poDetailData: JSON.parse(JSON.stringify(poDetailData.value)),
    skuComponentList: JSON.parse(JSON.stringify(skuComponentList.value)),
  }
  _updateSku(newSku)
  // console.log('更新', skuStore.data);
}
// 采购sku详情更新
const handleUpdateSku = async () => {
  try {
    const { data } = await updateSkuDetail({
      poSkuId: poDetailData.value.poSkuId,
      productName: poDetailData.value.productName,
      repositoryId: poDetailData.value.repositoryId,
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 采购PO的站点更新
const handleUpdatePoSite = async () => {
  try {
    const { data } = await updatePoSite({
      id: poDetailData.value.id,
      site: poDetailData.value.site,
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 采购PO的备注更新
const handleRemarksChange = async () => {
  try {
    const { data } = await updatePoRemarks({
      id: poDetailData.value.id,
      remarks: poDetailData.value.poRemarks,
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
const editorContent = ref<string>('')
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickEditorConfirm = async (val: any) => {
  switch (classify.value) {
    case 'purchaseMatters': {
      await updatePoPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val })

      editorContent.value = val
      clickRow.value.purchaseMatters = val
      if (route.query.from === 'plannedPoCreate') {
        updateCreate()
      }

      break
    }
    case 'contractTerms': {
      await updatePoContractTerms({ id: clickRow.value.id, contractTerms: val })

      editorContent.value = val
      clickRow.value.contractTerms = val
      if (route.query.from === 'plannedPoCreate') {
        updateCreate()
      }

      break
    }
    case 'componentSuitDetail': {
      await updatePoSkuComponentSuitDetail({ id: clickRow.value.id, componentSuitDetail: val })

      editorContent.value = val
      clickRow.value.componentSuitDetail = val
      if (route.query.from === 'plannedPoCreate') {
        updateCreate()
      }

      break
    }
    // No default
  }
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickEditorCancel = (val: any) => {
  wangEditorVisible.value = val
}

/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
let copyRow: any
const detailId = ref<number>(-1)
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  switch (column.property) {
    case 'purchaseMatters': {
      // 查询零件采购注意事项
      clickRow.value = row
      detailId.value = row.id
      const { data } = await getPoPurchaseMatters({ id: row.id })
      editorContent.value = data
      row.purchaseMatters = data
      wangEditorTitle.value = '零件采购注意事项'
      classify.value = 'purchaseMatters'
      wangEditorVisible.value = true

      break
    }
    case 'contractTerms': {
      clickRow.value = row
      const { data } = await getPoContractTerms({ id: row.id })
      editorContent.value = data
      row.contractTerms = data
      wangEditorTitle.value = '合同条款'
      classify.value = 'contractTerms'
      wangEditorVisible.value = true

      break
    }
    case 'componentSuitDetail': {
      clickRow.value = row
      const { data } = await getPoSkuComponentSuitDetail({ id: row.id })
      editorContent.value = data
      row.componentSuitDetail = data
      wangEditorTitle.value = '零件明细'
      classify.value = 'componentSuitDetail'
      wangEditorVisible.value = true

      break
    }
    // No default
  }
  const firstChild = cell?.children[0]?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const changeCreateInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    detailId.value = row.id
    editorContent.value = row.purchaseMatters
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorVisible.value = true
  } else if (column.property == 'contractTerms') {
    clickRow.value = row
    detailId.value = row.id
    editorContent.value = row.contractTerms
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorVisible.value = true
  } else if (column.property == 'componentSuitDetail') {
    clickRow.value = row
    detailId.value = row.id
    editorContent.value = row.componentSuitDetail
    wangEditorTitle.value = '零件明细'
    classify.value = 'componentSuitDetail'
    wangEditorVisible.value = true
  }
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
// let deleteRow: any
// const changeDeleteInput = async (row: any, column: any, cell: HTMLTableCellElement) => {

//   const firstChild = cell?.children[0]?.children[0]
//   const secondChild = cell?.children[0]?.children[1]

//   if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
//     return
//   }

//   deleteRow = JSON.parse(JSON.stringify(row))

//   if (firstChild.classList.contains('none')) {
//     firstChild.classList.remove('none')
//     secondChild.classList.add('none')

//     focusAndSelectInput(cell)
//   }
//   // console.log(deleteRow)
// }
// 零件table blur事件
// const clickDeleteCancel = async (event: any, value: any) => {
//   const rootElement = getRootElement(event.srcElement, '.cell')

//   if (rootElement) {
//     const t1 = rootElement.children[0]
//     const t2 = rootElement.children[1]

//     if (t1) t1.classList.add('none')
//     if (t2) t2.classList.remove('none')
//   }
//   if (isEqual(deleteRow, value)) {
//     return
//   }
//   // console.log(value)
//   if (event.type === 'blur') {
//     // 执行失去焦点处理逻辑
//     try {
//       const { data } = await updatePoSkuComponent(value)
//       if (data === true) {
//         fetchSkuComponent()
//         fetchData()
//       } else {
//         Object.assign(value, deleteRow)
//       }
//     } catch {
//       // 更新失败时，恢复为原始值
//       Object.assign(value, deleteRow)
//     }
//   }
// }
// 修改po-sku零件信息
const updateSkuComponent = async (row: any) => {
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 零件table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0].children[0]
    const t2 = rootElement.children[0].children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      const { data } = await updatePoSkuComponent(value)
      if (data === true) {
        fetchSkuComponent()
        fetchData()
      } else {
        Object.assign(value, copyRow)
      }
    } catch {
      // 更新失败时，恢复为原始值
      Object.assign(value, copyRow)
      // console.log('更新失败，恢复为原始值')
    }
  }
}
const clickCreateOtherCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  updateCreate()
}
// 创建blur修改
const clickCreateCancel = async (event: any, value: any, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    // 修改请求
    value.isUpdate = true
    const { data } = await updateCreateComponent(skuComponentList.value)

    skuComponentList.value = data.componentList
    poDetailData.value.orderTotalPrice = data.skuTotalPrice
    skuComponentList.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
    })
    updateCreate()
  }
}

// 零件table blur事件
const clickOtherCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0].children[0]
    const t2 = rootElement.children[0].children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateSkuComponent(value)
      await fetchSkuComponent()
    } catch {
      // 更新失败时，恢复为原始值
      Object.assign(value, copyRow)
    }
  }
}
// 更新价格
const handleUpdateAllComponentPrice = async () => {
  $baseConfirm('确定要更新价格吗？', null, async () => {
    try {
      const { data } = await updateAllComponentPrice({
        poSkuId: parseInt(route.query.poSkuId),
      })
      if (data === true) {
        $baseMessage('该SKU下的所有零件价格全部更新成功', 'success', 'hey')
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 更新单价
const handleUpdateComponentPrice = async (row: any) => {
  $baseConfirm('确定要更新单价吗？', null, async () => {
    try {
      const { data } = await updateComponentPrice({
        poSkuComponentId: row.id,
      })
      if (data === true) {
        $baseMessage('单价更新成功', 'success', 'hey')
      }
    } catch (error) {
      console.error(error)
    }
  })
}

// 修改默认供应商
const handleSupplierAndInvoicingChange = async (row: any) => {
  try {
    const { data } = await updatePoSkuComponentSuppliser({
      poId: parseInt(route.query.poId),
      poSkuId: parseInt(route.query.poSkuId),
      poSkuComponentId: row.id,
      existAlreadyComponentId: row.existingPartsListId,
      suppliserId: row.suppliserId,
      invoicing: row.invoicing,
    })
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
    // const { data } = await updatePoSkuComponent(row)
  } catch (error) {
    row.suppliserId = originalRow.suppliserId
    console.error(error)
  }
  // fetchSupplierRate(row)
}
// 修改开票类型
const handleInvoicingChange = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.label === 'Attom' && row.invoicing !== 2) {
    $baseMessage('采购方为attom，无法开票', 'error')
    row.invoicing = 2
  }
  if (item!.label === '云舟' && row.invoicing === 1) {
    row.customsDeclarationStatus = 1
  }
  const { data } = await updatePoSkuComponent(row)
  if (data === true) {
    fetchSkuComponent()
    fetchData()
  } else {
    row.invoicing = originalRow.invoicing
  }
}
let originalRow: any
const handleGetRow = (row: any) => {
  originalRow = { ...row }
}
// 修改默认采购方
const handleDefaultPurchase = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.type === 0) {
    //如果选择了为买单的采购方
    row.customsDeclarationStatus = 1 //自动勾选不报关
  }
  if (item!.label === '埃托姆') {
    //选择了埃托姆
    row.customsDeclarationStatus = 0
  } else if (item!.label === 'Attom') {
    //选择了attom，开票变成无法开票
    row.invoicing = 2
  }
  if (item!.label === '云舟' && row.invoicing === 1) {
    row.customsDeclarationStatus = 1
  }
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    row.purchaseId = originalRow.purchaseId
    console.error(error)
  }
}
// 创建修改开票
const handleUpdateInvoicing = (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.label === 'Attom' && row.invoicing !== 2) {
    $baseMessage('采购方为attom，无法开票', 'error')
    row.invoicing = 2
  }
  if (item!.label === '云舟' && row.invoicing === 1) {
    row.customsDeclarationStatus = 1
  }
  updateCreate()
}
// 创建修改采购方
const handleCreateDefaultPurchase = (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.type === 0) {
    //如果选择了为买单的采购方
    row.customsDeclarationStatus = 1 //自动勾选不报关
  }
  if (item!.label === '埃托姆') {
    //选择了埃托姆
    row.customsDeclarationStatus = 0
  } else if (item!.label === 'Attom') {
    //选择了attom，开票变成无法开票
    row.invoicing = 2
  }
  if (item!.label === '云舟' && row.invoicing === 1) {
    row.customsDeclarationStatus = 1
  }
  updateCreate()
}
// 创建修改不报关
const handleCreateCustoms = (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.type === 0) {
    //如果选择了为买单的采购方
    if (row.customsDeclarationStatus === 0) {
      row.customsDeclarationStatus = 1
      $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
    }
  } else if (
    row.purchaseId === 2 && //选择了埃托姆
    row.customsDeclarationStatus === 1
  ) {
    row.customsDeclarationStatus = 0
    $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
  }
  if (item!.label === '云舟' && row.invoicing === 1 && row.customsDeclarationStatus === 0) {
    row.customsDeclarationStatus = 1
    $baseMessage('采购方为云舟，开票类型为普票，无法取消不报关勾选', 'error', 'hey')
    return
  }
  updateCreate()
}
// 处理不报关
const handleDeclareCustoms = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item!.type === 0) {
    //如果选择了为买单的采购方
    if (row.customsDeclarationStatus === 0) {
      row.customsDeclarationStatus = 1
      $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
    }
  } else if (row.purchaseId === 2) {
    //选择了埃托姆
    if (row.customsDeclarationStatus === 1) {
      row.customsDeclarationStatus = 0
      $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
    }
  } else {
    // updateSkuComponent(row)
  }
  if (item!.label === '云舟' && row.invoicing === 1 && row.customsDeclarationStatus === 0) {
    row.customsDeclarationStatus = 1
    $baseMessage('采购方为云舟，开票类型为普票，无法取消不报关勾选', 'error', 'hey')
    return
  }
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    row.customsDeclarationStatus = row.customsDeclarationStatus === 0 ? 1 : 0
    console.error(error)
  }
}
const handleCreateAddSKU = () => {
  if (skuStore.data.length > 0) {
    if (poDetailData.value.site == null) {
      $baseMessage('请选择PO站点', 'error')
      return
    }
    if (poDetailData.value.repositoryId == null) {
      $baseMessage('请选择收货仓库', 'error')
      return
    }
  }
  addSKUVisible.value = true
}
// 添加SKU
const handleAddSKU = async () => {
  addSKUVisible.value = true
}
const handleDelCreateSKU = () => {
  const skuData = skuStore.data
  let length = skuData.length
  let index = skuData.findIndex((item: any) => item.tempId === tempCurId.value)
  // 删除：如果只有一个，删除后就全为空
  if (length === 1) {
    _deleteSku(tempCurId.value)
    $baseMessage('删除SKU成功', 'success')
    poDetailData.value = {}
    skuComponentList.value = []
    handleShowCreatePreviousOrNext()
    createDisabled.value = true
  } else {
    // 如果大于一个，那就是两个及两个以上，先删除
    // console.log('删除前的id', tempCurId.value);
    _deleteSku(tempCurId.value)
    $baseMessage('删除SKU成功', 'success')
    // console.log('删除后的', skuStore.data);
    // console.log('删除前的length', length);
    // console.log('删除前的index', index);

    // 如果删除之前的index是0，就是跳到下一个
    if (index === 0) {
      tempCurId.value = skuData[index + 1].tempId
      Object.assign(poDetailData.value, skuData[index + 1].poDetailData)
      skuComponentList.value = skuData[index + 1].skuComponentList
      handleShowCreatePreviousOrNext()
    } else {
      tempCurId.value = skuData[index - 1].tempId
      Object.assign(poDetailData.value, skuData[index - 1].poDetailData)
      skuComponentList.value = skuData[index - 1].skuComponentList
      handleShowCreatePreviousOrNext()
    }
  }
}
// 创建SKU
const createSku = async () => {
  let flag = false
  createPoLoading.value = true
  // 遍历data的所有
  skuStore.data.forEach((item: any) => {
    if (item.poDetailData.site == null) {
      $baseMessage(`请选择${item.poDetailData.sku}的PO站点`, 'error')
      flag = true
      return
    }
    if (item.poDetailData.repositoryId == null) {
      $baseMessage(`请选择${item.poDetailData.sku}的收货仓库`, 'error')
      flag = true
      return
    }
  })
  if (!flag) {
    const createReq = skuStore.data.map((item: any) => {
      const transformedItem = {
        componentList: item.skuComponentList,
        poSkuDetail: item.poDetailData, // 替换键名
      }
      return transformedItem
    })

    const { data } = await createPlanPo(createReq)
    if (data) {
      $baseMessage('创建PO成功', 'success')
      goBack()
    }
  }
  createPoLoading.value = false
}
// 采购订单PO详情删除SKU
const handleDelSKU = async () => {
  // 只有一个sku的 删除的是po
  if (poSkuIdList.value.length === 1) {
    $baseConfirm('确定要删除PO吗', '系统提示', async () => {
      try {
        const { data } = await deletePoSku({
          poSkuId: poDetailData.value.poSkuId,
        })
        if (data === true) {
          $baseMessage('删除PO成功', 'success', 'hey')
          goBack()
        }
      } catch (error) {
        console.error(error)
      }
    })
  } else if (poSkuIdList.value.length > 1) {
    // 有多个sku的 删除当前sku
    try {
      $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
        const { data } = await deletePoSku({
          poSkuId: poDetailData.value.poSkuId,
        })
        if (data === true) {
          $baseMessage('删除SKU成功', 'success', 'hey')
          // 如果是最后一个 就去上一个
          if (poSkuIdIndex.value === poSkuIdList.value.length - 1) {
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! - 1] }
            router.push({ path: '/purchase/poDetail', query })
          } else {
            // 如果是第一个或者和中间 就去下一个
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! + 1] }
            router.push({ path: '/purchase/poDetail', query })
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
// 采购计划详情删除SKU
const handleDelPlanPoSKU = async () => {
  // 只有一个sku的 删除的是po
  if (poSkuIdList.value.length === 1) {
    $baseConfirm('确定要删除PO吗', '系统提示', async () => {
      try {
        const { data } = await deletePurchasePlanPo({
          poSkuId: poDetailData.value.poSkuId,
        })
        if (data === true) {
          $baseMessage('删除PO成功', 'success', 'hey')
          goBack()
        }
      } catch (error) {
        console.error(error)
      }
    })
  } else if (poSkuIdList.value.length > 1) {
    // 有多个sku的 删除当前sku
    try {
      $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
        const { data } = await deletePurchasePlanPo({
          poSkuId: poDetailData.value.poSkuId,
        })
        if (data === true) {
          $baseMessage('删除SKU成功', 'success', 'hey')
          // 如果是最后一个 就去上一个
          if (poSkuIdIndex.value === poSkuIdList.value.length - 1) {
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! - 1] }
            router.push({ path: '/purchase/poDetail', query })
          } else {
            // 如果是第一个或者和中间 就去下一个
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! + 1] }
            router.push({ path: '/purchase/poDetail', query })
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
// 零件创建删除
const handleCreateDelComponent = (index: number) => {
  skuComponentList.value.splice(index, 1)
  updateCreate()
}
// po-sku零配件删除
const handleDelPoSKuComponent = async (row: any, index: number) => {
  // console.log(route.query.from)
  if (route.query.from === 'plannedPoDetail') {
    //采购计划的详情
    $baseConfirm('确定要删除该条零件信息吗', '系统提示', async () => {
      try {
        const { data } = await deletePurchasePlanPoSkuComponent({
          id: row.id,
        })
        if (data === true) {
          skuComponentList.value.splice(index, 1)
          fetchSkuComponent()
          fetchData()
          $baseMessage('该条零件删除成功', 'success', 'hey')
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    })
  } else {
    $baseConfirm('确定要删除该条零件信息吗', '系统提示', async () => {
      try {
        const { data } = await deletePoSkuComponent({
          id: row.id,
        })
        if (data === true) {
          skuComponentList.value.splice(index, 1)
          fetchSkuComponent()
          fetchData()
          $baseMessage('该条零件删除成功', 'success', 'hey')
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    })
  }
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 图片预览事件
const handlePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imageUploadVisible = ref<boolean>(false)
const skuImageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}
const showSkuUploadDialog = () => {
  skuImageUploadVisible.value = true
}
/**
 * 上传图片
 */
async function uploadImage(file: File) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('poSkuId', poDetailData.value.poSkuId)
    const { data } = await updateSkuImg(uploadImgForm)
    if (data) {
      $baseMessage('图片上传成功', 'success', 'hey')
      skuImageUploadVisible.value = false
      poDetailData.value.skuImgUrl = data
    } else {
      $baseMessage('图片上传失败', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
    poDetailData.value.hide = false
  }
}
async function uploadSkuComponentImage(file: File) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('id', copyRow.id)

    const { data } = await uploadComponentImg(uploadImgForm)
    if (data) {
      $baseMessage('图片上传成功', 'success', 'hey')
      imageUploadVisible.value = false
      copyRow.componentUrl = data
    } else {
      $baseMessage('图片上传失败', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
/**
 * 图片删除功能
 */
const handleRemove = async () => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await deleteSkuImg({
        poSkuId: poDetailData.value.poSkuId,
      })
      if (data === true) {
        poDetailData.value.skuImgUrl = ''
        $baseMessage('SKU详情图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleComponentRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await deleteComponentImg({
        id: row.id,
      })
      if (data == true) {
        row.componentUrl = ''
        $baseMessage('SKU零配件图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 当点击创建的上一个按钮
const handleFetchCreatePrevious = () => {
  const skuData = skuStore.data
  let index = skuData.findIndex((item: any) => item.tempId === tempCurId.value)
  // console.log('index', index);

  tempCurId.value = skuData[index - 1].tempId
  // 将数据显示在页面上
  Object.assign(poDetailData.value, skuData[index - 1].poDetailData)
  poDetailData.value.createTime = poDetailData.value.createTime ? poDetailData.value.createTime.split(' ')[0] : ''
  skuComponentList.value = skuData[index - 1].skuComponentList
  skuComponentList.value.forEach((item: any) => {
    item.unitPrice = formattedPrice(item.unitPrice)
  })
  handleShowCreatePreviousOrNext()
}
// 当点击创建的下一个按钮
const handleFetchCreateNext = () => {
  const skuData = skuStore.data
  let index = skuData.findIndex((item: any) => item.tempId === tempCurId.value)
  tempCurId.value = skuData[index + 1].tempId
  // 将数据显示在页面上
  Object.assign(poDetailData.value, skuData[index + 1].poDetailData)
  poDetailData.value.createTime = poDetailData.value.createTime ? poDetailData.value.createTime.split(' ')[0] : ''

  skuComponentList.value = skuData[index + 1].skuComponentList
  skuComponentList.value.forEach((item: any) => {
    item.unitPrice = formattedPrice(item.unitPrice)
  })
  handleShowCreatePreviousOrNext()
}
// 当点击上一个按钮
const handleFetchPreviousData = async () => {
  // 获取当前路由的查询参数
  const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! - 1] }
  await delVisitedRoute(handleActivePath(route, true))
  // 修改路由
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query,
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query,
    })
    await changeTabsMeta({
      title: 'PO详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
// 当点击下一个按钮
const handleFetchNextData = async () => {
  // 获取当前路由的查询参数
  const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! + 1] }
  await delVisitedRoute(handleActivePath(route, true))
  // 修改路由
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query,
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query,
    })
    await changeTabsMeta({
      title: 'PO详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
// 价格保留两位小数
const formattedPrice = (price: string) => {
  return parseFloat(price).toFixed(2)
}
// 获取采购方和收货仓库
const repositoryOption = ref<IRepositoryOption[]>([])
const purchaseOption = ref<IPurchaseOption[]>([])
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
  const { data: repository } = await getProductComponentStore()
  repositoryOption.value = repository
}
// 获取PoSKU配件详情表
const fetchSkuComponent = async () => {
  try {
    const { data } = await getPoSkuComponentList({
      poSkuId: parseInt(route.query.poSkuId),
    })
    if (data) {
      skuComponentList.value = data
      skuComponentList.value.forEach((item: any) => {
        if (item.unitPrice) {
          item.unitPrice = formattedPrice(item.unitPrice)
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 获取po详情数据
const fetchData = async () => {
  try {
    const { data } = await getPoDetail({
      id: parseInt(route.query.poSkuId),
    })
    if (data) {
      poDetailData.value = data
      poDetailData.value.createTime = data.createTime ? data.createTime.split(' ')[0] : ''
    }
  } catch (error) {
    console.error(error)
  }
}

// 获取po的skuId列表
const fetchPoSkuIdList = async () => {
  const { data } = await getPoSkuIdList({
    id: parseInt(route.query.poId),
  })
  // console.log(data); // [1, 2, 28]或者[31]或者[32]
  poSkuIdList.value = data
  handleShowPreviousOrNext()
}

// 处理上一个还是下一个显示
const handleShowPreviousOrNext = () => {
  const lastIndex = poSkuIdList.value.length - 1
  poSkuIdIndex.value = poSkuIdList.value.indexOf(parseInt(route.query.poSkuId))
  // console.log(poSkuIdList.value)
  // console.log(poSkuIdIndex.value)
  // console.log(lastIndex)
  if (lastIndex === -1) {
    previousVisible.value = false
    nextVisible.value = false
  }
  // 只有一个SKU，都不显示
  else if (lastIndex === 0) {
    previousVisible.value = false
    nextVisible.value = false
  } else if (poSkuIdIndex.value === lastIndex && lastIndex !== -1) {
    // 如果就是末尾的skuId，不显示下一个
    previousVisible.value = true
    nextVisible.value = false
  } else if (poSkuIdIndex.value === 0) {
    // 如果是第一个，不显示上一个
    previousVisible.value = false
    nextVisible.value = true
  } else {
    previousVisible.value = true
    nextVisible.value = true
  }
}
// 处理创建的上一个还是下一个
const handleShowCreatePreviousOrNext = () => {
  let length = skuStore.data.length
  let lastIndex = skuStore.data.findIndex((item: any) => item.tempId === tempCurId.value)
  if (length === 0 || length === 1) {
    createPreviousVisible.value = false
    createNextVisible.value = false
  } else if (length - 1 === lastIndex) {
    createPreviousVisible.value = true
    createNextVisible.value = false
  } else if (lastIndex === 0) {
    createPreviousVisible.value = false
    createNextVisible.value = true
  } else {
    createPreviousVisible.value = true
    createNextVisible.value = true
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const property = data.column.property
  if (property === 'existingPartsListId' || property === 'stock' || property === 'preTaxPrice') {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'center',
    }
  } else if (
    property === 'componentName' ||
    property === 'purchaseLink' ||
    property === 'purchaseMatters' ||
    property === 'contractTerms' ||
    property === 'componentSuitDetail' ||
    property === 'orderNo'
  ) {
    return {
      textAlign: 'left',
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label === '图片') {
    return 'clear-padding'
  }
  if (
    label === '订货总数' ||
    label === '多订数量' ||
    label === '使用已有库存' ||
    label === '出厂单价' ||
    label === '出厂总价' ||
    label === '含税运费' ||
    label === '模具费含税' ||
    label === '总含税价' ||
    label === '实际税点' ||
    label === '开票税点'
  ) {
    return 'reduce-padding'
  }
  return ''
}
const oldPurchaseNumber = ref<number>()
// 创建planPo
const handleCreatePlanPo = async () => {
  try {
    // 判断是否是第一次创建
    if (skuStore.data.length === 0) {
      // 第一次创建
      afterGetSku(poDetailData.value.sku)
    } else {
      // 已存在数据，获取最新数据并更新
      const { data } = await getPurchaseSKU({
        sku: poDetailData.value.sku,
      })
      const currentIndex = skuStore.data.findIndex((item) => item.tempId === tempCurId.value)
      if (currentIndex !== -1) {
        // 保留用户修改过的字段
        const updatedPoDetail = {
          ...data.poSkuDetail,
          site: poDetailData.value.site,
          repositoryId: poDetailData.value.repositoryId,
          purchaseSkuNumber: poDetailData.value.purchaseSkuNumber,
        }

        // 更新store和页面数据
        skuStore.data[currentIndex].poDetailData = updatedPoDetail
        skuStore.data[currentIndex].skuComponentList = data.componentList

        // 更新页面显示
        Object.assign(poDetailData.value, updatedPoDetail)
        poDetailData.value.createTime = poDetailData.value.createTime ? poDetailData.value.createTime.split(' ')[0] : ''
        skuComponentList.value = data.componentList
        skuComponentList.value.forEach((item: any) => {
          item.unitPrice = formattedPrice(item.unitPrice)
        })

        $baseMessage('SKU信息已更新', 'success')
      }
    }
  } catch (error) {
    console.error(error)
  }
}
// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  if (route.query.from === 'plannedPoDetail' || route.query.from === 'plannedPoCreate') {
    router.push({ path: '/purchase/plannedPo' })
  } else {
    router.push({ path: '/purchase/po' })
  }
  _clearSKUs()
}
const imageColumnHeight = ref<number>(0)
// 动态设置 详情 的图片列高度
const setImageColumnHeight = () => {
  const createDateInput = document.querySelector('.el-form-item[data-label="创建日期"]')
  const skuTotalPriceInput = document.querySelector('.el-form-item[data-label="SKU总含税价"]')

  if (createDateInput && skuTotalPriceInput) {
    const createDateRect = createDateInput.getBoundingClientRect()
    const skuTotalPriceRect = skuTotalPriceInput.getBoundingClientRect()
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30
  }
}
// 动态设置 创建 的图片列高度
const setImageColumnHeight2 = () => {
  const createDateInput = document.querySelector('.el-form-item[data-label="创建日期2"]')
  const skuTotalPriceInput = document.querySelector('.el-form-item[data-label="SKU总含税价2"]')

  if (createDateInput && skuTotalPriceInput) {
    const createDateRect = createDateInput.getBoundingClientRect()
    const skuTotalPriceRect = skuTotalPriceInput.getBoundingClientRect()
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30
  }
}
// 动态设置 已删除进来的 的图片列高度
const setImageColumnHeight3 = () => {
  const createDateInput = document.querySelector('.el-form-item[data-label="创建日期3"]')
  const skuTotalPriceInput = document.querySelector('.el-form-item[data-label="SKU总含税价3"]')

  if (createDateInput && skuTotalPriceInput) {
    const createDateRect = createDateInput.getBoundingClientRect()
    const skuTotalPriceRect = skuTotalPriceInput.getBoundingClientRect()
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30
  }
}
const siteList = ref<{ id: number; label: string }[]>([])
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
const listLoading = ref<boolean>(false)
// 订货套数是否可改
const orderCount = ref<boolean>(false)
onBeforeMount(async () => {
  fetchSiteData()
  // 如果不是创建，订单详情div显示
  if (route.query.from !== 'plannedPoCreate') {
    listLoading.value = true
    const routesStore = useRoutesStore()
    // 改变路由激活到采购订单
    if (route.query.from !== 'plannedPoDetail') {
      // console.log(routesStore.getTabMenu)
      orderCount.value = true
      routesStore.changeActiveMenu('/purchase/po')
    }
    if (route.query.del === 'true') {
      deleteNone.value = false
      detailsNone.value = true
    } else {
      deleteNone.value = true
      detailsNone.value = false
    }
    createNone.value = true
    if (deleteNone.value && createNone.value && !detailsNone.value) {
      fetchColumn()
    }
    await fetchPoSkuIdList()
    await fetchPurchaseAndRepository()
    await fetchData()
    await fetchSkuComponent()
    listLoading.value = false
  } else if (route.query.from === 'plannedPoCreate') {
    // 一进来 disable掉
    createDisabled.value = true
    fetchPurchaseAndRepository()
    // 是创建的话，创建div显示
    createNone.value = false
    detailsNone.value = true
    _clearSKUs() //一进页面只清空一次
    handleShowCreatePreviousOrNext()
  }
})
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 7 })
  columns.value = data
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
  })
}
onMounted(() => {
  let title = ''
  if (route.query.from === 'plannedPoCreate') {
    title = '采购计划创建'
  } else if (route.query.from === 'plannedPoDetail') {
    title = '采购计划订单详情'
  } else {
    title = route.query.from
  }
  if (route.query.del === 'true') {
    setImageColumnHeight3()
  } else if (route.query.from === 'plannedPoCreate') {
    //设置图片列宽度高度
    setImageColumnHeight2()
  } else {
    setImageColumnHeight()
  }
  changeTabsMeta({
    title: 'PO详情',
    meta: {
      title,
    },
  })
})
</script>

<style lang="scss" scoped>
// 供应商显示容器样式
.supplier-display-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;

  .supplier-name {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

// 供应商选择框容器样式
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

// 订单号容器样式
.order-no-container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 100%;
  gap: 8px;

  .el-tooltip {
    min-width: 0; // 允许内容收缩
    overflow: hidden;
  }

  .multi-line-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 100%;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

.poDetail-container {
  :deep() {
    .product-details-card {
      border: 0;

      // 设置el-card的padding和下面表格左右两侧对齐
      .el-card__body {
        padding-right: 0;
        padding-bottom: 0;
        padding-left: 0;
      }
    }
  }
}

:deep(.el-form-item) {
  margin-right: 10px;
}
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
.custom-checkbox {
  transform: scale(1.2);
  transform-origin: center;
}
.none {
  display: none;
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}
.transfer-container {
  display: flex;
  align-items: center; /* 垂直居中，如果需要 */
  justify-content: center; /* 水平居中 */
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.text-center {
  margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
  line-height: 1;
  text-align: center;
}
.button-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
// 分隔线margin
.divider-margin {
  margin-top: 0;
  margin-bottom: 20px;
}
// 弹出框的body的padding-top
:deep(.dialog .el-dialog__body) {
  padding-top: 0;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.el-table :deep(.reduce-padding .cell) {
  padding-right: 2px;
  padding-left: 2px;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
// .el-table :deep(.reduce-input .cell .el-input .el-input__wrapper) {
//   padding: 0 !important;
// }
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
}
:deep(input[type='number']) {
  -moz-appearance: textfield;
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
// 图片样式
.image-cell {
  width: 100%;
  height: 75px;

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
