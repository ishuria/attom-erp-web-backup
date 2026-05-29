<template>
  <div class="step-form-container">
    <el-page-header style="margin-bottom: 0px" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span><strong>SKU详情</strong></span>
        </div>
      </template>
    </el-page-header>
    <el-card class="product-details-card" shadow="never">
      <el-row style="display: flex; width: 100%">
        <el-col :style="{ maxWidth: imageColumnHeight + 'px', paddingLeft: '0', paddingRight: '10px' }">
          <div class="image-cell" :style="{ height: imageColumnHeight + 'px', marginTop: 30 + 'px' }">
            <!-- 有图片时显示 -->
            <div v-if="sku.skuImgUrl" v-permissions="SkuPermission.skuImageColPermission()" class="image-preview">
              <img alt="" :src="sku.skuImgUrl" />
              <div class="image-actions">
                <el-icon @click="handlePreview(sku.skuImgUrl)"><zoom-in /></el-icon>
                <el-icon @click="handleRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else v-permissions="SkuPermission.skuImageColPermission()" class="upload-placeholder" @click="showSkuUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col style="flex: 1.3; padding: 0">
          <el-form :inline="true" label-position="top">
            <el-row style="width: 100%">
              <el-col :span="12">
                <el-form-item data-label="SKU" label="SKU">
                  <el-input v-model="sku.sku" disabled placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品名">
                  <el-input v-model="mergedProductName" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="6">
                <el-form-item label="北美FNSKU">
                  <el-input v-model="sku.northAmericaFnSku" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="欧洲FNSKU">
                  <el-input v-model="sku.europeFnSku" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="产品主品名">
                  <el-input v-model="sku.productName" @blur="handleUpdateSku" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="产品短描述">
                  <el-input v-model="sku.productDesc" @blur="handleUpdateSku" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="变体名">
                  <el-input v-model="sku.variantName" @blur="handleUpdateSku" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="6">
                <el-form-item data-label="UPC" label="UPC">
                  <el-input v-model="sku.upc" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="默认收货仓库">
                  <el-select v-model="sku.defaultRepository" placeholder="请选择默认收货仓库" @change="handleUpdateSku">
                    <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品经理">
                  <el-select
                    v-model="sku.productManager"
                    clearable
                    default-first-option
                    :disabled="!ableToEditProductManager"
                    filterable
                    :loading="peopleLoading"
                    placeholder="点击输入和搜索产品经理"
                    remote
                    :remote-method="remotePeopleMethod"
                    @change="handleUpdateSku"
                  >
                    <el-option v-for="item in peopleOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品设计">
                  <el-select
                    v-model="sku.productDesign"
                    clearable
                    default-first-option
                    :disabled="!ableToEditProductDesign"
                    filterable
                    :loading="peopleLoading"
                    placeholder="点击输入和搜索产品设计"
                    remote
                    :remote-method="remotePeopleMethod"
                    @change="handleUpdateSku"
                  >
                    <el-option v-for="item in peopleOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="4">
                <el-form-item label="总实际成本">
                  <el-input v-model="sku.procurementCost" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="起订量">
                  <el-input v-model="sku.minQuantity" type="number" @blur="handleUpdateSku" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="整箱数">
                  <el-input v-model="sku.numCartons" type="number" @blur="handleUpdateSku" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="采购负责人">
                  <el-select
                    v-model="sku.procurementManagerId"
                    clearable
                    :disabled="!ableToEditProcurementManager"
                    filterable
                    placeholder="点击输入或搜索采购"
                    @change="handleUpdateSku"
                  >
                    <el-option v-for="item in procurementManagerList" :key="item.userId" :label="item.userName" :value="item.userId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="近10次打包装箱数">
                  <el-input disabled />
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
                    <span style="font-size: var(--el-form-label-font-size)">质检清单</span>
                    <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer" @click="handlePacking"><edit /></el-icon>
                  </el-space>
                  <el-input v-model="qualityCheckList" disabled resize="none" :rows="11" type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-right: 0">
                  <el-space>
                    <span style="font-size: var(--el-form-label-font-size)">SKU备注</span>
                    <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer" @click="handleManagerRemarks">
                      <circle-plus-filled />
                    </el-icon>
                  </el-space>
                  <el-input v-model="sku.remarks" resize="none" :rows="11" type="textarea" @blur="handleRemarksChange" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-page-header style="margin-bottom: 0px" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span><strong>SKU零配件清单（与开票一致）</strong></span>
        </div>
      </template>
    </el-page-header>
    <div class="comprehensive-table-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="20" style="margin-top: 10px">
          <el-button type="primary" @click="handleCreateComponent">创建零件</el-button>
          <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
          <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel :span="4" style="margin-top: 10px">
          <div class="custom-table-right-tools">
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
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
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
        v-loading="updating"
        border
        :cell-class-name="clearPadding"
        :cell-style="cellStyle"
        class="noneHoveTable"
        :data="tableData"
        element-loading-text="数据更新中..."
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
        @cell-click="changeInput"
      >
        <el-table-column fixed="left" label="图片" prop="componentImage" width="77">
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.componentImage" class="image-preview">
                <img alt="" :src="row.componentImage" />
                <div class="image-actions">
                  <el-icon @click="handlePreview(row.componentImage)"><zoom-in /></el-icon>
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
        <el-table-column fixed="left" label="零件名" prop="componentName" :width="flexColumnWidth(tableData, '零件名', 'componentName')" />

        <el-table-column
          v-for="(item, index) in checkList"
          :key="index"
          :fixed="item.isFixed"
          :label="item.label"
          :min-width="item.minWidth"
          :prop="item.prop"
          :width="item.width"
        >
          <template #header>
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
            <span v-if="item.label === '数量'">
              <span>{{ row.quantity }}</span>
            </span>
            <span v-if="item.label === '出厂单价'">
              <div class="none">
                <el-input v-model="row.unitPrice" type="number" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.unitPrice }}</span>
            </span>
            <span v-if="item.label === '出厂总价'">
              <div class="none">
                <el-input v-model="row.totalPrice" type="number" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.totalPrice }}</span>
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
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%" @change="handleCurrencyChange(row)">
                <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </span>
            <span v-if="item.label === '起订量'">
              <div class="none">
                <el-input
                  v-model="row.minimumOrderQuantity"
                  type="number"
                  @blur="clickCancel($event, row)"
                  @keyup.enter="clickCancel($event, row)"
                />
              </div>
              <span>{{ row.minimumOrderQuantity }}</span>
            </span>
            <span v-if="item.label === '整箱数'">
              <div class="none">
                <el-input
                  v-model="row.numberFullCartons"
                  type="number"
                  @blur="clickCancel($event, row)"
                  @keyup.enter="clickCancel($event, row)"
                />
              </div>
              <span>{{ row.numberFullCartons }}</span>
            </span>
            <span v-if="item.label === '默认供应商'">
              <div class="supplier-select-container">
                <el-select v-model="row.defaultSuppliserId" @change="handleSuppliserChange(row)">
                  <el-option v-for="a in row.suppliserList" :key="a.id" :label="a.label" :value="a.id" />
                </el-select>
                <el-button
                  v-if="row.defaultSuppliserId && getSupplierName(row)"
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
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handleInvoicingChange(row)">
                <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </span>
            <span v-if="item.label === '默认采购方'">
              <el-select
                v-model="row.purchaseId"
                placeholder="请选择默认采购方"
                style="min-width: 100%"
                @change="handleDefaultPurchase(row)"
              >
                <el-option v-for="b in purchaseOption" :key="b.id" :label="b.label" :value="b.id" />
              </el-select>
            </span>
            <span v-if="item.label === '不报关'">
              <el-checkbox
                v-model="row.declareCustomsStatus"
                class="custom-checkbox"
                :false-value="0"
                :true-value="1"
                @change="handleDeclareCustoms(row)"
              />
            </span>
            <span v-if="item.label === '采购链接'">
              <div class="none">
                <el-input v-model="row.purchaseLink" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <el-tooltip content="" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.purchaseLink }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
              </el-tooltip>
            </span>
            <span v-if="item.label === '默认收货仓库'">
              <el-select
                v-model="row.defaultRepositoryId"
                filterable
                placeholder="输入和搜索默认收货仓库"
                style="min-width: 100%"
                @change="handleCurrencyChange(row)"
              >
                <el-option v-for="c in repositoryOption" :key="c.id" :label="c.label" :value="c.id" />
              </el-select>
            </span>
            <span v-if="item.label === '零件采购注意事项'">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </el-tooltip>
            </span>
            <span v-if="item.label === '合同条款'">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
              </el-tooltip>
            </span>
            <span v-if="item.label === '零件明细'">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row, $index }">
            <el-dropdown>
              <el-button text type="primary" @click="handleSupplier(row)">
                供应商
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleSupplier(row)">
                    <el-link type="primary" underline="never">供应商</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleAddOtherSku(row)">
                    <el-link type="primary" underline="never">添加到其他SKU</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleCopy(row)">
                    <el-link type="primary" underline="never">复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="showPrices(row)">
                    <el-link type="primary" underline="never">历史价格</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleUpdateComponentName(row)">
                    <el-link type="primary" underline="never">修改零件名</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleShowModify(row)">
                    <el-link type="primary" underline="never">修改零件报关</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDel(row, $index)">
                    <el-link type="danger" underline="never">删除</el-link>
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
    </div>

    <wang-editor
      :content="editorContent"
      :draft-field="draftField"
      :draft-id="detailId"
      source-page="skuDetailView"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorVisible"
      @click-boolean="clickEditorCancel"
      @click-child="clickEditorConfirm"
    />

    <!-- 创建零件 / 耗材 -->
    <vab-dialog v-model="addComponentVisible" :before-close="handlerCloseDialog" class="moldDialog" title="创建零件" width="570">
      <template #header>
        <span style="padding-left: 20px">{{ form.type === 0 ? '创建零件' : '创建耗材' }}</span>
      </template>
      <el-divider style="margin-top: 0" />
      <el-form
        ref="formRef"
        class="demo-form"
        label-position="right"
        label-width="auto"
        :model="form"
        :rules="rules"
        style="max-width: 480px; margin: 0 auto"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type">
            <el-option v-for="item in componentType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 0" label="零件名" prop="componentName">
          <el-input v-model="form.componentName" clearable placeholder="必须遵守格式规范：品名-规格参数" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="耗材名" prop="consumableName">
          <el-input v-model="mergedPartName" disabled />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="耗材种类" prop="materialType">
          <el-select v-model="form.materialType" clearable placeholder="请选择耗材种类">
            <el-option v-for="item in consumableTypeOption" :key="item.id" :label="item.consumablesName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-row v-if="form.type === 1" style="margin-bottom: 18px">
          <el-col :span="12">
            <el-form-item label="耗材尺寸" prop="size">
              <el-input v-model="form.size" clearable placeholder="22x15x10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尺寸单位" prop="unit">
              <el-input v-model="form.unit" clearable placeholder="cm" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="form.type === 1" label="规格/说明" prop="specification">
          <el-input v-model="form.specification" clearable placeholder="三层加硬空白" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="采购链接" prop="purchaseLink">
          <el-input v-model="form.purchaseLink" clearable placeholder="请输入采购链接" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="按单采购" prop="isSinglePurchase">
          <el-switch v-model="form.isSinglePurchase" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66" />
        </el-form-item>
        <el-form-item label="零件单位" prop="componentUnit">
          <el-input v-model="form.componentUnit" clearable placeholder="套, 个, 只, 片等" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <div class="supplier-select-container">
            <el-select
              v-model="form.supplier"
              allow-create
              clearable
              default-first-option
              filterable
              :loading="loading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remoteMethod"
              @blur="handleInput"
              @change="handleTaxDisabled"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button
              v-if="form.supplier"
              circle
              class="copy-btn"
              :icon="CopyDocument"
              size="small"
              type="primary"
              @click="handleClip(form.supplier)"
            />
          </div>
        </el-form-item>
        <el-form-item label="开票" prop="invoicing">
          <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handleInvoicingTaxChange">
            <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 0" label="不报关" prop="declareCustomsStatus">
          <el-checkbox v-model="form.declareCustomsStatus" :false-value="0" :true-value="1" />
        </el-form-item>
        <el-form-item v-show="taxVisible" label="实际税点" prop="actualTaxRate">
          <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13" />
        </el-form-item>
        <el-form-item v-show="taxVisible" label="开票税点" prop="invoicingTaxRate">
          <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="addComponentVisible = false">退出</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <!-- 打包注意事项 -->
    <vab-packing-precautions
      v-model="packingPrecautionsVisible"
      :sku-id="parseInt(route.query.skuId)"
      @update:packing-precautions-visible="handleClosePackingPrecautions"
      @update:table-value="handleTableDataValue"
    />
    <!-- 添加到其它SKU -->
    <vab-dialog
      v-model="addOtherSkuVisible"
      :before-close="handlerOtherSkuCloseDialog"
      class="moldDialog"
      title="零件复制到其他SKU"
      width="1525"
    >
      <el-divider style="margin-top: 0" />
      <div class="transfer-container">
        <el-transfer v-model="transferValue" :data="transferData" filterable :titles="['源列', '目的列']" />
      </div>
      <template #footer>
        <span>
          <el-button @click="addOtherSkuVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitOtherSku">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <!-- 更新零件名 -->
    <vab-dialog
      v-model="updateComponentNameVisible"
      :before-close="handlerUpdateComponentNameDialog"
      class="moldDialog"
      title="更新零件名"
      width="500"
    >
      <el-divider style="margin-top: 0" />
      <el-form ref="componentNameFormRef" :model="componentNameForm" style="margin: 0">
        <el-form-item label="零件名" prop="componentName" :rules="{ required: true, message: '请输入零件名', trigger: 'blur' }">
          <el-input v-model="componentNameForm.componentName" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="updateComponentNameVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitComponentName">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <!-- 添加零件 -->
    <vab-add-component
      :create-component-visible="createComponentVisible"
      @update:create-component-visible="handleCloseCreateComponent"
      @update:table-value="handleSubmitComponent"
    />
    <!-- 添加耗材 -->
    <vab-add-consumable
      :create-consumable-visible="createConsumableVisible"
      @update:create-consumable-visible="handleCloseCreateConsumable"
      @update:table-value="handleSubmitConsumable"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadSkuComponentImage" />
    <!-- SKU上传图片 -->
    <vab-image-upload v-model="skuImageUploadVisible" @image-upload="uploadImage" />
    <vab-dialog v-model="updateVisible" title="修改零件报关" width="35%">
      <el-form
        ref="modifyFormRef"
        label-position="left"
        label-width="auto"
        :model="modifyForm"
        require-asterisk-position="right"
        :rules="modifyFormRules"
        style="margin-left: 0; margin-right: 0"
      >
        <el-form-item label="每套SKU采购数量" prop="componentQuantity">
          <el-input v-model.trim="modifyForm.componentQuantity" clearable />
        </el-form-item>
        <el-form-item label="采购单位" prop="componentUnit">
          <el-input v-model="modifyForm.componentUnit" clearable />
        </el-form-item>
        <el-form-item v-if="ableToView" label="开票单位" prop="billingUnit">
          <el-input v-model="modifyForm.billingUnit" clearable />
        </el-form-item>
        <el-form-item v-if="ableToView" label="采购单位和开票单位比例">
          <div style="display: flex; align-items: center; width: 100%">
            每【{{ modifyForm.componentUnit }}】采购单位对应
            <el-input v-model.trim="modifyForm.quantity" clearable placeholder="请输入比例" style="width: 120px; flex: 1; margin: 0 6px" />
            【{{ modifyForm.billingUnit }}】开票单位
          </div>
          <div style="color: var(--el-color-danger)">非整数需保留10位小数点</div>
        </el-form-item>
        <el-form-item v-if="ableToView" label="HS" prop="hsId">
          <el-select v-model="modifyForm.hsId">
            <el-option v-for="item in hsOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="ableToView" label="法定单位">
          <el-input v-model="modifyForm.statutoryUnit" disabled />
        </el-form-item>
        <el-form-item v-if="ableToView" label="采购单位和法定第1单位比例">
          <div style="display: flex; align-items: center; width: 100%">
            每【{{ modifyForm.componentUnit }}】采购单位对应
            <el-input v-model.trim="modifyForm.quorum" clearable placeholder="请输入比例" style="width: 120px; margin: 0 6px; flex: 1" />
            【{{ modifyForm.statutoryUnit }}】法定第1单位
          </div>
          <div style="color: var(--el-color-danger)">非整数需保留10位小数点</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmModify">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 历史价格 -->
    <history-price-table v-model="historyPriceVisible" :list="historyPriceList" />

    <!-- 价格变更理由弹窗 -->
    <vab-dialog v-model="priceChangeReasonVisible" title="价格变更理由" width="400">
      <el-form label-position="top">
        <el-form-item label="请输入价格变更理由">
          <el-input v-model="priceChangeReason" clearable placeholder="请输入价格变更理由" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelPriceChange">取消</el-button>
        <el-button type="primary" @click="confirmPriceChange">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CirclePlusFilled, CopyDocument, Delete, Edit, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { getProductSkuDetailHistoryPriceList } from '/@/api/devlocal/commission'
import {
  addProductComponentOtherSku,
  copyProductComponent,
  createProductComponent,
  delComponentImage,
  delProductComponent,
  delSkuImage,
  getHsSelectList,
  getProductAllName,
  getProductAllSupplier,
  getProductComponentPurchase,
  getProductComponentStore,
  getProductConsumablesType,
  getProductDefaultListComponent,
  getProductQualityInspection,
  getProductSkuDetail,
  getProductSkuList,
  getProductSupplier,
  getSkuComponentInfo,
  saveProductComponentSuitDetail,
  saveProductContractTerms,
  saveProductPurchaseMatters,
  submitProductComponent,
  submitProductConsumable,
  updateProductComponent,
  updateProductComponentName,
  updateProductSku,
  updateProductSkuRemark,
  updateSkuComponentInfo,
  uploadComponentImage,
  uploadSkuImage,
} from '/@/api/devlocal/productInformation'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import { getUserProcurementName } from '/@/api/devlocal/user'
import {
  ROLE_BOSS_CODE,
  ROLE_INDUSTRIAL_DESIGN_CODE,
  ROLE_LOGISTISCSPECIALIST_CODE,
  ROLE_PRODUCTMANAGER_CODE,
  ROLE_PRODUCTMANNAGERLEAD_CODE,
  ROLE_PURCHASER_CODE,
  ROLE_PURCHASINGASSISTANT_CODE,
} from '/@/const/role'
import SkuPermission from '/@/permissions/sku'
import { useAclStore } from '/@/store/modules/acl'
import { useTabsStore } from '/@/store/modules/tabs'
import { useUserStore } from '/@/store/modules/user'
import { IGetCostReductionHistoryPriceList } from '/@/type/commission/commissionType'
import type { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { handleClip } from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuDetailView',
})

const currentUserName = useUserStore().getUsername
const roleCode = useAclStore().getRole[0]
const ableToEditProcurementManager = computed(() => {
  return (
    ableToEditProductManager.value ||
    ableToEditProductDesign.value ||
    currentUserName === sku.value.procurementManager ||
    roleCode === ROLE_BOSS_CODE
  )
})
const ableToEditProductManager = computed(() => {
  return currentUserName === sku.value.productManager || sku.value.supervisorNames.includes(currentUserName) || roleCode === ROLE_BOSS_CODE
})
const ableToEditProductDesign = computed(() => {
  return currentUserName === sku.value.productDesign || ableToEditProductManager.value || roleCode === ROLE_BOSS_CODE
})
const historyPriceVisible = ref<boolean>(false)
const historyPriceList = ref<IGetCostReductionHistoryPriceList[]>([])

// ========== 更新中loading状态 ==========
const updating = ref(false)

// ========== 价格变更理由相关 ==========
const priceChangeReasonVisible = ref<boolean>(false)
const priceChangeReason = ref<string>('')
/** 待提交的零件更新数据（价格变更时暂存） */
const pendingComponentUpdate = ref<any>(null)

/** 判断是否为价格字段 */
const isPriceField = (field: string): boolean => {
  return ['unitPrice', 'totalPrice', 'taxIncludedPrice'].includes(field)
}

/** 检测行数据中是否有价格字段变更 */
const hasPriceChange = (newRow: any, oldRow: any): boolean => {
  return (
    newRow.unitPrice !== oldRow.unitPrice || newRow.totalPrice !== oldRow.totalPrice || newRow.taxIncludedPrice !== oldRow.taxIncludedPrice
  )
}

/** 取消价格变更 */
const cancelPriceChange = () => {
  priceChangeReasonVisible.value = false
  priceChangeReason.value = ''
  // 恢复原始值
  if (pendingComponentUpdate.value && copyRow) {
    // 从tableData中找到对应行并恢复
    const row = tableData.value.find((r: any) => r.id === pendingComponentUpdate.value!.id)
    if (row) {
      Object.assign(row, copyRow)
    }
  }
  pendingComponentUpdate.value = null
}

/** 确认价格变更（附带理由） */
const confirmPriceChange = async () => {
  if (!priceChangeReason.value.trim()) {
    $baseMessage('请输入价格变更理由', 'error', 'hey')
    return
  }
  priceChangeReasonVisible.value = false
  const value = pendingComponentUpdate.value
  pendingComponentUpdate.value = null
  if (!value) return

  updating.value = true
  try {
    await updateProductComponent({
      ...value,
      changeReason: priceChangeReason.value,
    })
    await fetchComponentData()
    await fetchData()
  } catch {
    Object.assign(value, copyRow)
  } finally {
    priceChangeReason.value = ''
    updating.value = false
  }
}

const showPrices = async (row: any) => {
  historyPriceVisible.value = true

  const { data } = await getProductSkuDetailHistoryPriceList({ componentId: row.componentId, supplierId: row.defaultSuppliserId })
  if (data) {
    historyPriceList.value = data
  }
}
const handleCopy = async (row: any) => {
  $baseConfirm('确定要复制零件信息吗？', '系统提示', async () => {
    try {
      const { data } = await copyProductComponent({
        existingPartsListId: row.existingPartsListId,
        componentId: row.componentId,
        skuId: Number(route.query.skuId),
      })
      if (data) {
        $baseMessage('复制成功！', 'success', 'hey')
        fetchComponentData()
        fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 获取供应商名称的辅助函数
const getSupplierName = (row: any) => {
  if (!row.defaultSuppliserId || !row.suppliserList) return ''
  const supplier = row.suppliserList.find((item: any) => item.id === row.defaultSuppliserId)
  return supplier ? supplier.label : ''
}

const currentRoleCode = useAclStore().getRole[0]
const ableToView = computed(() => {
  return (
    currentRoleCode === ROLE_LOGISTISCSPECIALIST_CODE ||
    currentRoleCode === ROLE_BOSS_CODE ||
    currentRoleCode === ROLE_PURCHASER_CODE ||
    currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE ||
    currentRoleCode === ROLE_PRODUCTMANAGER_CODE ||
    currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE ||
    currentRoleCode === ROLE_INDUSTRIAL_DESIGN_CODE
  )
})
const updateVisible = ref<boolean>(false)
const modifyForm = reactive<any>({})
const modifyFormRef = ref<FormInstance>()
const modifyFormRules = reactive({
  componentQuantity: [
    { required: true, message: '请输入每套SKU采购数量', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === 0 || value === '0') {
          callback(new Error('零件数量不能为0'))
        } else if (value < 0) {
          callback(new Error('零件数量不能为负数'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const hsOption = ref<{ id: number; label: string }[]>([])
const fetchHsSelectList = async () => {
  const { data } = await getHsSelectList()
  hsOption.value = data
}
let _existingPartsListId = -1
let _suppliserId = -1
const updateRow = ref<any>({})
const handleShowModify = async (row: any) => {
  $baseConfirm('零件数量和单位的修改，需要和开票报关信息一起准确修改，否则报关资料会有错误！', null, async () => {
    updateRow.value = JSON.parse(JSON.stringify(row))
    updateVisible.value = true
    _existingPartsListId = row.existingPartsListId
    _suppliserId = row.defaultSuppliserId
    await fetchHsSelectList()
    // 重置表单
    Object.keys(modifyForm).forEach((key) => {
      modifyForm[key as keyof typeof modifyForm] = undefined
    })
    const { data } = await getSkuComponentInfo({ existingPartsListId: row.existingPartsListId, suppliserId: row.defaultSuppliserId })
    Object.assign(modifyForm, data)
    modifyForm.componentQuantity = row.quantity
    modifyForm.componentUnit = row.componentUnit
  })
}
const handleConfirmModify = async () => {
  try {
    // 表单验证
    await modifyFormRef.value?.validate(async (isValid: boolean) => {
      if (isValid) {
        updateRow.value.quantity = modifyForm.componentQuantity
        updateRow.value.componentUnit = modifyForm.componentUnit
        updateRow.value.sku = sku.value.sku

        const { data: data2 } = await updateSkuComponentInfo({
          existingPartsListId: _existingPartsListId,
          suppliserId: _suppliserId,
          hsId: modifyForm.hsId,
          statutoryCount: modifyForm.quorum,
          billQuantity: modifyForm.quantity,
          billingUnit: modifyForm.billingUnit,
          ...updateRow.value,
        })
        if (data2) {
          $baseMessage('修改成功！', 'success')
          updateVisible.value = false
          await fetchComponentData()
        }
      }
    })
  } catch (error) {
    if (error === false) {
      // 表单验证失败
      return
    }
  }
}
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute, changeTabsMeta } = tabsStore
const formRef = ref<FormInstance>()
const qualityCheckList = ref<any>()
const form = reactive<any>({
  type: 0,
  componentName: '',
  materialType: '',
  size: '',
  unit: '',
  specification: '',
  isSinglePurchase: 1,
  componentUnit: '',
  supplier: '',
  invoicing: 0,
  actualTaxRate: '',
  invoicingTaxRate: '',
  purchaseLink: '',
  declareCustomsStatus: 0,
})
const tableData = ref<any>([])
const imageColumnHeight = ref<number>(0)
// 动态设置图片列高度
const setImageColumnHeight = () => {
  const skuInput = document.querySelector('.el-form-item[data-label="SKU"]')
  const upcInput = document.querySelector('.el-form-item[data-label="UPC"]')

  if (skuInput && upcInput) {
    const createDateRect = skuInput.getBoundingClientRect()
    const skuTotalPriceRect = upcInput.getBoundingClientRect()
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30
  }
}
// 产品名 = 产品主品名-产品短描述-变体名
const mergedProductName = computed(() => {
  return `${sku.value.productName}-${sku.value.productDesc}-${sku.value.variantName}`
})
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否

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

const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 展示添加零件对话框
const handleAddComponent = () => {
  createComponentVisible.value = true
}
// 展示添加耗材对话框
const handleAddConsumable = () => {
  createConsumableVisible.value = true
}
// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {
  let list: ISubmitPurchaseComponent[] = []
  value.map((item: any): any => {
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
    const { data } = await submitProductComponent({
      skuId: Number(route.query.skuId),
      list,
    })
    if (data === true) {
      $baseMessage('添加零件提交成功', 'success', 'hey')
      fetchComponentData()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  let list: ISubmitPurchaseConsumable[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        suppliserId: Number(item.suppliserId),
        count: Number(item.count),
      })
    }
  })
  try {
    const { data } = await submitProductConsumable({
      skuId: Number(route.query.skuId),
      list,
    })
    if (data === true) {
      $baseMessage('添加耗材提交成功', 'success', 'hey')
      fetchComponentData()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
const peopleLoading = ref(false) //搜索产品经理和产品设计loading
const peopleOptions = ref<any[]>([]) //搜索选项
const peopleList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  if (query) {
    const { data } = await getProductAllName({
      name: query,
    })

    peopleList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    peopleLoading.value = true
    setTimeout(() => {
      peopleLoading.value = false
      peopleOptions.value = peopleList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    peopleOptions.value = []
  }
}

/** 获取采购负责人 */
const queryRemoteprocurementManager = async (query: string) => {
  if (query) {
    const { data } = await getUserProcurementName({
      name: query,
    })
    peopleList.value = data.map((item: any) => {
      return { value: `${item.userName}`, label: `${item.userName}` }
    })
    peopleLoading.value = true
    setTimeout(() => {
      peopleLoading.value = false
      peopleOptions.value = peopleList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    peopleOptions.value = []
  }
}
/** 获取采购负责人列表 */
const procurementManagerList = ref<{ userId: number; userName: string }[]>([])
const fetchProcurementManagerList = async () => {
  const { data } = await getUserProcurementName({
    name: '',
  })
  procurementManagerList.value = data
}

const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const taxDisabled = ref<boolean>(false)
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
      suppliserName: query,
    })

    supplierList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
// 处理远程搜索不重复选择
const handleInput = (e: any) => {
  const value = e.target.value
  if (value) {
    form.supplier = e.target.value
  }
}
const handleTaxDisabled = async (value: string) => {
  form.supplier = value // 自动设置为新输入的值
  if (value) {
    const { data } = await getProductSupplier({ suppliserName: value })

    if (data === null) {
      taxDisabled.value = false
    } else {
      const { actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate } = data
      taxDisabled.value = true
      if (form.invoicing === 0) {
        form.actualTaxRate = actualZTaxRate
        form.invoicingTaxRate = invoicingZTaxRate
      } else if (form.invoicing === 1) {
        form.actualTaxRate = actualPTaxRate
        form.invoicingTaxRate = invoicingPTaxRate
      } else {
        form.actualTaxRate = 0
        form.invoicingTaxRate = 0
      }
    }
  }
}
// 修改创建零件，创建耗材的开票
const taxVisible = ref<boolean>(true)
const handleInvoicingTaxChange = async (value: number) => {
  // 当选择的是创建耗材，并且选择无法开票的时候，才隐藏开票税点和实际税点
  if (form.type === 1 && value === 2) {
    taxVisible.value = false
  } else {
    taxVisible.value = true
  }
  if (form.supplier) {
    handleTaxDisabled(form.supplier)
  }
}
const componentNameForm = reactive<any>({
  componentName: '',
})
const updateComponentNameVisible = ref<boolean>(false)
const componentNameFormRef = ref<FormInstance>()
const handlerUpdateComponentNameDialog = () => {
  updateComponentNameVisible.value = false
}
const _row = ref<any>({})
const handleUpdateComponentName = (row: any) => {
  _row.value = row
  updateComponentNameVisible.value = true
  componentNameForm.componentName = row.componentName
}
const handleSubmitComponentName = async () => {
  componentNameFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { data } = await updateProductComponentName({
        existingPartsListId: _row.value.existingPartsListId!,
        componentName: componentNameForm.componentName,
        sku: sku.value.sku,
      })
      if (data === true) {
        updateComponentNameVisible.value = false
        _row.value.componentName = componentNameForm.componentName
        $baseMessage('修改零件名成功', 'success', 'hey')
      } else {
        $baseMessage('修改零件名失败', 'error', 'hey')
      }
    } else {
      $baseMessage('零件名不能为空', 'error', 'hey')
    }
  })
}
const sku = ref<any>({})
const componentType = [
  { label: '零件', value: 0 },
  { label: '耗材', value: 1 },
]
const currencyNumList = [
  {
    value: 0,
    label: 'RMB',
  },
  {
    value: 1,
    label: 'USD',
  },
  {
    value: 2,
    label: 'EUR',
  },
]

const invoicingNumList = [
  {
    value: 0,
    label: '专票',
  },
  {
    value: 1,
    label: '普票',
  },
  {
    value: 2,
    label: '无法开票',
  },
]

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
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
 * 图片删除功能
 */
const handleRemove = async () => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await delSkuImage({
        skuId: sku.value.skuId,
      })
      if (data == true) {
        sku.value.skuImgUrl = ''
        $baseMessage('SKU图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleComponentRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await delComponentImage({
        id: row.id,
      })
      if (data == true) {
        row.componentImage = ''
        $baseMessage('SKU零配件图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 修改默认供应商
const handleSuppliserChange = async (row: any) => {
  updating.value = true
  try {
    const { data } = await updateProductComponent(row)
    if (data === true) {
      await fetchData()
      await fetchComponentData()
    }
  } finally {
    updating.value = false
  }
}
const packingPrecautionsVisible = ref<boolean>(false)
const packingList = ref<any>() //质检清单数据
const handlePacking = async () => {
  packingPrecautionsVisible.value = true
}
const handleManagerRemarks = () => {
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0] // 获取 'YYYY-MM-DD' 格式
  sku.value.remarks = `${formattedDate}：\n${sku.value.remarks}`
}
const handleClosePackingPrecautions = (value: boolean) => {
  packingPrecautionsVisible.value = value
}

const handleTableDataValue = (value: any) => {
  qualityCheckList.value = value
    .map((item: any) => {
      const date = item.createTime ? item.createTime.split(' ')[0] : ''
      return `${date}: ${item.packagePrecautions || ''}`
    })
    .join('\n')
}

const handleUpdateSku = async () => {
  await updateProductSku({
    skuId: sku.value.skuId,
    productName: sku.value.productName,
    productDesc: sku.value.productDesc,
    variantName: sku.value.variantName,
    defaultRepository: sku.value.defaultRepository,
    minQuantity: sku.value.minQuantity,
    numCartons: sku.value.numCartons,
    productManager: sku.value.productManager,
    productDesign: sku.value.productDesign,
    procurementManager: procurementManagerList.value.find((item: any) => item.userId === sku.value.procurementManagerId)?.userName,
    procurementManagerId: sku.value.procurementManagerId,
  })
}
const handleRemarksChange = async () => {
  await updateProductSkuRemark({
    skuId: sku.value.skuId,
    remarks: sku.value.remarks,
  })
}
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 草稿字段
const draftField = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
const editorContent = ref<string>('')
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickEditorConfirm = async (val: any) => {
  if (draftField.value === 'purchaseMatters') {
    const { data } = await saveProductPurchaseMatters({ id: clickRow.value.id, text: val, sku: sku.value.sku })
    if (data === true) {
      editorContent.value = val
      clickRow.value.purchaseMatters = val
    }
  } else if (draftField.value === 'contractTerms') {
    const { data } = await saveProductContractTerms({ id: clickRow.value.id, text: val, sku: sku.value.sku })
    if (data === true) {
      editorContent.value = val
      clickRow.value.contractTerms = val
    }
  } else {
    const { data } = await saveProductComponentSuitDetail({ id: clickRow.value.id, text: val, sku: sku.value.sku })
    if (data === true) {
      editorContent.value = val
      clickRow.value.componentSuitDetail = val
    }
  }
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickEditorCancel = (val: any) => {
  wangEditorVisible.value = val
}

const rules = reactive({
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  componentName: [{ required: true, message: '请填写零件名', trigger: 'blur' }],
  materialType: [{ required: true, message: '请选择耗材种类', trigger: 'change' }],
  size: [
    { required: true, message: '请填写耗材尺寸', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请填写尺寸单位', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  specification: [
    { required: true, message: '请填写规格和说明', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  componentUnit: [
    { required: true, message: '请填写零件单位', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  supplier: [
    { required: true, message: '请输入供应商', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  declareCustomsStatus: [{ required: true, message: '请选择不报关', trigger: 'change' }],
  invoicing: [{ required: true, message: '请选择开票类型', trigger: 'change' }],
  actualTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (value === null || value === '' || value === undefined)) {
          callback(new Error('请填写实际税点'))
        } else {
          callback()
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  invoicingTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (value === null || value === '' || value === undefined)) {
          callback(new Error('请填写开票税点'))
        } else {
          callback()
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const addComponentVisible = ref<boolean>(false)

const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
  addOtherSkuVisible.value = false
}
const handlerCloseDialog = () => {
  addComponentVisible.value = false
}
const consumableTypeOption = ref<any>()
const handleCreateComponent = async () => {
  //点击创建零件
  addComponentVisible.value = true
  formRef.value?.resetFields()
  const { data } = await getProductConsumablesType() //获取耗材种类
  consumableTypeOption.value = data
  // 初始化开票税点和实际税点的显示
  taxVisible.value = true
}

function validateNoSpaces(rule: any, value: any, callback: any) {
  if (/\s/.test(value)) {
    callback(new Error('输入不能包含空格'))
  } else {
    callback()
  }
}
const mergedPartName = computed(() => {
  let type = ''
  if (form.materialType) {
    const i = consumableTypeOption.value.find((item: any) => item.id === form.materialType)
    type = i.consumablesName
  }
  return `${type}-${form.size}-${form.unit}-${form.specification}`
})

const handleSubmit = async () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      // addComponentVisible.value = false
      const newComponent = {
        componentName: form.type === 0 ? form.componentName : mergedPartName.value,
        unit: form.componentUnit,
        suppliser: form.supplier,
        invoicing: form.invoicing,
        actualTaxRate: form.actualTaxRate,
        invoicingTaxRate: form.invoicingTaxRate,
        type: form.type,
        status: form.isSinglePurchase,
        purchaseLink: form.type === 0 ? '' : form.purchaseLink,
      }
      try {
        const { data } = await createProductComponent({
          skuId: route.query.skuId,
          componentName: form.type === 0 ? form.componentName : mergedPartName.value,
          unit: form.componentUnit,
          suppliser: form.supplier,
          invoicing: form.invoicing,
          actualTaxRate: form.actualTaxRate,
          invoicingTaxRate: form.invoicingTaxRate,
          type: form.type,
          status: form.isSinglePurchase,
          purchaseLink: form.type === 0 ? '' : form.purchaseLink,
          declareCustomsStatus: form.type === 0 ? form.declareCustomsStatus : -1,
        })
        if (data) {
          // tableData.value.push(newComponent)
          fetchComponentData()
          fetchData()
          addComponentVisible.value = false
          $baseMessage('创建零件提交成功', 'success', 'hey')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}
const handleSubmitOtherSku = async () => {
  addOtherSkuVisible.value = false
  $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
    const { data } = await addProductComponentOtherSku({
      skuIds: `${transferValue.value}`,
      componentId: _compoenntId.value!,
    })
    if (data === true) {
      $baseMessage('添加到其他SKU成功', 'success', 'hey')
    }
  })
}
interface Option2 {
  key: number
  label: string
  initial: number
}

let states = ref<string[]>([])
let initials = ref<number[]>([])
const transferData = ref<Option2[]>([]) // 初始化为空数组
const transferValue = ref([])

// 生成数据
const generateData2 = () => {
  const data: Option2[] = []
  states.value.forEach((sku, index) => {
    data.push({
      label: sku,
      key: initials.value[index],
      initial: initials.value[index],
    })
  })
  return data
}
let _compoenntId = ref<number>()
// 添加其他 SKU 的逻辑
const handleAddOtherSku = async (row: any) => {
  states.value = []
  initials.value = []
  transferData.value = []
  transferValue.value = []
  const { data } = await getProductSkuList({ existingPartsListId: row.existingPartsListId })
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData2()
  _compoenntId.value = row.componentId
  addOtherSkuVisible.value = true
}

const handleDel = async (row: any, index: number) => {
  $baseConfirm('确定要删除零件信息吗', '系统提示', async () => {
    const { data } = await delProductComponent({
      componentId: row.componentId,
    })
    if (data) {
      tableData.value.splice(index, 1)
      fetchComponentData()
      fetchData()
      $baseMessage('SKU零配件删除成功', 'success', 'hey')
    }
  })
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
let copyRow: any
const detailId = ref<number>(-1)
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  // 解构 row 和 column 属性，便于后续使用
  const { purchaseMatters, contractTerms, componentSuitDetail } = row
  const { property } = column
  // 根据 column 的属性执行不同的逻辑
  switch (property) {
    case 'purchaseMatters': {
      detailId.value = row.id
      clickRow.value = row
      editorContent.value = purchaseMatters
      wangEditorTitle.value = '零件采购注意事项'
      draftField.value = 'purchaseMatters'
      wangEditorVisible.value = true
      break
    }
    case 'contractTerms': {
      clickRow.value = row
      detailId.value = row.id
      editorContent.value = contractTerms
      wangEditorTitle.value = '合同条款'
      draftField.value = 'contractTerms'
      wangEditorVisible.value = true
      break
    }
    case 'componentSuitDetail': {
      clickRow.value = row
      editorContent.value = componentSuitDetail
      wangEditorTitle.value = '套装零件明细'
      draftField.value = 'componentSuitDetail'
      wangEditorVisible.value = true
      break
    }
    // No default
  }
  // 缓存 cell 内部的 DOM 元素，避免重复访问
  const firstChild = cell?.children[0]?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[0]?.children[1]

  // 如果任一元素不存在，直接返回
  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  // 如果是第一次点击（firstChild 有 'none' 类名），执行以下逻辑
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    // 聚焦并全选输入框或文本框
    focusAndSelectInput(cell)
  }
}
// 处理零件table blur事件
const clickCancel = async (event: any, value: any) => {
  // console.log('修改前', copyRow.quantity)
  // console.log('修改后', value.quantity)
  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0].children[0]
    const t2 = rootElement.children[0].children[1]

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }

  // 只有在数据变化时才处理更新
  if (isEqual(value, copyRow)) {
    return // 数据没有变化，不执行更新
  }

  if (event.type === 'blur') {
    // 检测是否有价格字段变更
    const priceChanged = hasPriceChange(value, copyRow)
    if (priceChanged) {
      // 暂存数据，弹出理由弹窗
      pendingComponentUpdate.value = {
        id: value.id,
        sku: sku.value.sku,
        skuId: value.skuId,
        componentId: value.componentId,
        componentName: value.componentName,
        existingPartsListId: value.existingPartsListId,
        suppliserId: value.suppliserId,
        quantity: value.quantity,
        unitPrice: value.unitPrice,
        totalPrice: value.totalPrice,
        preTaxPrice: value.preTaxPrice,
        taxIncludedPrice: value.taxIncludedPrice,
        currency: value.currency,
        minimumOrderQuantity: value.minimumOrderQuantity,
        numberFullCartons: value.numberFullCartons,
        defaultSuppliserId: value.defaultSuppliserId,
        invoicing: value.invoicing,
        purchaseId: value.purchaseId,
        declareCustomsStatus: value.declareCustomsStatus,
        purchaseLink: value.purchaseLink,
        defaultRepositoryId: value.defaultRepositoryId,
        purchaseMatters: value.purchaseMatters,
        contractTerms: value.contractTerms,
      }
      priceChangeReasonVisible.value = true
      return
    }

    // 非价格变更，直接提交
    updating.value = true
    try {
      await updateProductComponent({
        id: value.id,
        sku: sku.value.sku,
        skuId: value.skuId,
        componentId: value.componentId,
        componentName: value.componentName,
        existingPartsListId: value.existingPartsListId,
        suppliserId: value.suppliserId,
        quantity: value.quantity,
        unitPrice: value.unitPrice,
        totalPrice: value.totalPrice,
        preTaxPrice: value.preTaxPrice,
        taxIncludedPrice: value.taxIncludedPrice,
        currency: value.currency,
        minimumOrderQuantity: value.minimumOrderQuantity,
        numberFullCartons: value.numberFullCartons,
        defaultSuppliserId: value.defaultSuppliserId,
        invoicing: value.invoicing,
        purchaseId: value.purchaseId,
        declareCustomsStatus: value.declareCustomsStatus,
        purchaseLink: value.purchaseLink,
        defaultRepositoryId: value.defaultRepositoryId,
        purchaseMatters: value.purchaseMatters,
        contractTerms: value.contractTerms,
      })
      // 数据更新后，重新获取组件数据
      await fetchComponentData()
      // 重新获取实际总成本
      await fetchData()
    } catch {
      // 更新失败时，恢复为原始值
      Object.assign(value, copyRow)
    } finally {
      updating.value = false
    }
  }
}

// 处理默认采购方
const handleDefaultPurchase = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item.type === 0) {
    //如果选择了为买单的采购方
    row.declareCustomsStatus = 1 //自动勾选不报关
  }
  if (item.label === '埃托姆') {
    //选择了埃托姆
    row.declareCustomsStatus = 0
    // 如果开票是无法开票 则切换成普票
    if (row.invoicing === 2) {
      row.invoicing = 1
    }
  } else if (item.label === 'Attom') {
    //选择了attom，开票变成无法开票
    row.invoicing = 2
  }
  if (item!.label === '云舟') {
    if (row.invoicing === 1) {
      row.declareCustomsStatus = 1
    } else if (row.invoicing === 2) {
      row.invoicing = 1
      $baseMessage('采购方为云舟，不能选择无法开票', 'error', 'hey')
    }
  }
  updating.value = true
  try {
    await updateProductComponent(row)
    await fetchData()
    await fetchComponentData()
  } finally {
    updating.value = false
  }
}
// 处理不报关
const handleDeclareCustoms = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item.type === 0 && row.declareCustomsStatus === 0) {
    //如果选择了为买单的采购方
    row.declareCustomsStatus = 1
    $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
  } else if (row.purchaseId === 2 && row.declareCustomsStatus === 1) {
    //选择了埃托姆
    row.declareCustomsStatus = 0
    $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
  } else if (item.label === '云舟' && row.invoicing === 1 && row.declareCustomsStatus === 0) {
    row.declareCustomsStatus = 1
    $baseMessage('采购方为云舟，开票类型为普票，无法取消不报关勾选', 'error', 'hey')
    return
  } else {
    updating.value = true
    try {
      await updateProductComponent(row)
      await fetchData()
      await fetchComponentData()
    } finally {
      updating.value = false
    }
  }
}
const handleCurrencyChange = async (row: any) => {
  updating.value = true
  try {
    await updateProductComponent(row)
    await fetchData()
    await fetchComponentData()
  } finally {
    updating.value = false
  }
}
const handleInvoicingChange = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item.label === 'Attom' && row.invoicing !== 2) {
    $baseMessage('采购方为attom，无法开票', 'error')
    row.invoicing = 2
  }
  if (item.label === '云舟' && row.invoicing === 1) {
    row.declareCustomsStatus = 1
  }
  if (row.invoicing === 2 && (item!.label === '云舟' || item!.label === '埃托姆')) {
    $baseMessage('采购方为云舟或埃托姆，不能选择无法开票', 'error', 'hey')
    row.invoicing = 1
  }
  updating.value = true
  try {
    const { data } = await updateProductComponent(row)
    if (data === true) {
      await fetchData()
      await fetchComponentData()
    }
  } finally {
    updating.value = false
  }
}

/**
 * 上传SKU图片
 */
async function uploadImage(file: File) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('skuId', sku.value.skuId)

    const { data } = await uploadSkuImage(uploadImgForm)
    if (data) {
      sku.value.skuImgUrl = data
      $baseMessage('图片上传成功！', 'success')
      skuImageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
const uploadSkuComponentImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('id', `${copyRow.id}`)

    const { data } = await uploadComponentImage(uploadImgForm)
    if (data) {
      copyRow.componentImage = data
      $baseMessage('图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
const handleSupplier = (row: any) => {
  router.push({
    path: '/productInfomation/skuSupplier',
    query: {
      title: 'SKU供应商',
      componentId: row.existingPartsListId,
      skuId: row.skuId,
      componentName: row.componentName,
      from: 'sku',
    },
  })
}
// sku详情数据
const fetchData = async () => {
  const { data } = await getProductSkuDetail({
    skuId: route.query.skuId,
  })
  Object.assign(sku.value, data)
}
const formattedPrice = (price: string) => {
  return parseFloat(price).toFixed(2)
}
const purchaseOption = ref<any>()
const repositoryOption = ref<any>()
const fetchComponentData = async () => {
  const { data } = await getProductDefaultListComponent({ skuId: route.query.skuId })
  tableData.value = data
  tableData.value.forEach(async (item: any) => {
    item.unitPrice = formattedPrice(item.unitPrice)
  })
}
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
  const { data: repository } = await getProductComponentStore()
  repositoryOption.value = repository
}
const fetchInspection = async () => {
  //获取质检清单数据
  const { data } = await getProductQualityInspection({
    skuId: parseInt(route.query.skuId),
  })
  packingList.value = data
  packingList.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime())
  handleTableDataValue(packingList.value) //初始化质检清单数据
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  switch (data.column.property) {
    case 'existingPartsListId':
    case 'componentUnit':
    case 'preTaxPrice':
    case 'actualTaxRate':
    case 'invoicingTaxRate':
    case 'quantity': {
      return {
        textAlign: 'center',
        color: '#999',
        cursor: 'not-allowed',
      }
    }
    case 'componentName': {
      return {
        textAlign: 'left',
        color: '#999',
        cursor: 'not-allowed',
      }
    }
    case 'purchaseMatters':
    case 'contractTerms':
    case 'purchaseLink':
    case 'componentSuitDetail': {
      return {
        textAlign: 'left',
      }
    }
    default: {
      return {
        textAlign: 'center',
      }
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  const label = data.column.label
  if (label === '图片') {
    return 'clear-padding'
  } else if (label === '数量' || label === '出厂单价' || label === '出厂总价' || label === '总含税价') {
    return 'reduce-padding'
  }
  return ''
}
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 6 })
  columns.value = data
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
    // // 设置 最小宽度
    // if (item.prop !== 'skuImageUrl' && item.prop !== 'componentUrl') {
    //   delete item.width
    // }
    // // 设置排序
    // if (['po', 'payDate', 'sellableDay'].includes(item.prop)) {
    //   item.sortable = true
    // }
  })
}
onBeforeMount(() => {
  fetchColumn()
  fetchData()
  fetchComponentData()
  fetchPurchaseAndRepository()
  fetchInspection()
  fetchProcurementManagerList()
})
onMounted(async () => {
  setImageColumnHeight()
  await changeTabsMeta({
    title: 'SKU详情',
    meta: {
      title: `${route.query.title}`,
    },
  })
})
</script>

<style lang="scss" scoped>
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

:deep(.el-form-item) {
  margin-right: 10px;
}
:deep(.el-card__body) {
  padding-right: 0;
  padding-bottom: 2px;
  padding-left: 0;
}
.product-details-card {
  border: 0;
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

.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}

.transfer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  :deep() {
    .el-transfer-panel {
      width: 660px;
      &__body {
        height: 500px;
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
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
}
:deep(input[type='number']) {
  -moz-appearance: textfield;
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
.disabled-handle {
  cursor: not-allowed;
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
</style>
