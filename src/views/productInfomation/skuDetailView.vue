<template>
  <div class="step-form-container">
    <el-page-header  @back="goBack" style="margin-bottom: 0px;">
      <template #content>
        <div class="flex items-center">
          <span> <strong> SKU详情 </strong></span>
        </div>
      </template>
    </el-page-header>
    <el-card class="product-details-card" shadow="never" >
      <el-row style="display: flex; width: 100%">
        <el-col :style="{ maxWidth: imageColumnHeight + 'px', paddingLeft: '0',paddingRight: '10px' }"> 
          <el-upload 
            list-type="picture-card" 
            :file-list="sku.imageList" 
            :class="{ hide: sku.hide }"
            :http-request="uploadImage"
            class="upload-align"
            :style="{ height: imageColumnHeight + 'px' }"
          >
            <el-icon ><Plus /></el-icon>
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-col>
        <el-col style="flex: 1.3; padding: 0">
          <el-form label-position="top" :inline="true">
            <el-row style="width: 100%">
              <el-col :span="12">
                <el-form-item label="SKU" data-label="SKU">
                  <el-input v-model="sku.sku" placeholder="" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品名">
                  <el-input v-model="mergedProductName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="6">
                <el-form-item label="北美FNSKU">
                  <el-input v-model="sku.northAmericaFnSku" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="欧洲FNSKU">
                  <el-input v-model="sku.europeFnSku" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="产品主品名">
                  <el-input v-model="sku.productName" @blur="handleUpdateSku" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="产品短描述">
                  <el-input v-model="sku.productDesc" @blur="handleUpdateSku" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="变体名" >
                  <el-input v-model="sku.variantName" @blur="handleUpdateSku" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
                <el-col :span="6">
                    <el-form-item label="UPC" data-label="UPC">
                        <el-input v-model="sku.upc" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="默认收货仓库">
                        <el-select v-model="sku.defaultRepository" placeholder="请选择默认收货仓库" @change="handleUpdateSku">
                            <el-option
                                v-for="item in defaultRepositoryOption"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="产品经理" >
                        <el-select
                            v-model="sku.productManager"
                            filterable
                            remote
                            default-first-option
                            placeholder="点击输入和搜索"
                            :remote-method="remotePeopleMethod"
                            :loading="peopleLoading"
                            @change="handleUpdateSku"
                            clearable
                        >
                            <el-option
                                v-for="item in peopleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6"> 
                    <el-form-item label="产品设计" >
                        <el-select
                            v-model="sku.productDesign"
                            filterable
                            remote
                            default-first-option
                            placeholder="点击输入和搜索"
                            :remote-method="remotePeopleMethod"
                            :loading="peopleLoading"
                            @change="handleUpdateSku"
                            clearable
                        >
                            <el-option
                                v-for="item in peopleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="width: 100%">
                <el-col :span="4">
                    <el-form-item label="总实际成本">
                        <el-input v-model="sku.procurementCost" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="起订量" >
                        <el-input type="number" v-model="sku.minQuantity" @blur="handleUpdateSku"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="整箱数" >
                        <el-input type="number" v-model="sku.numCartons" @blur="handleUpdateSku"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"> 
                    <el-form-item label="近10次打包装箱数">
                        <el-input disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-col>
        
        <el-col style="flex: 1; padding: 0">
          <el-form label-position="top" >
            <el-row>
              <el-col :span="12">
                <el-form-item >
                  <el-space>
                    <span style="font-size: var(--el-form-label-font-size);">质检清单</span>
                    <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer;" @click="handlePacking"><Edit /></el-icon>
                  </el-space>
                  <el-input type="textarea" :rows="11" v-model="qualityCheckList" disabled resize="none"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-right: 0">
                    <el-space>
                      <span style="font-size: var(--el-form-label-font-size);">产品经理自己看的备注</span>
                      <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer;" @click="handleManagerRemarks"><CirclePlusFilled /></el-icon>
                    </el-space>
                    <el-input type="textarea" :rows="11" v-model="sku.remarks" @blur="handleRemarksChange" resize="none"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
        
    <el-page-header  @back="goBack" style="margin-bottom: 0px;">
      <template #content>
        <div class="flex items-center">
          <span> <strong> SKU零配件清单（与开票一致） </strong></span>
        </div>
      </template>
    </el-page-header>
    <div class="comprehensive-table-container">
      <vab-query-form>
        <vab-query-form-left-panel style="margin-top: 10px;" :span="20">
          <el-button type="primary" @click="handleCreateComponent">创建零件</el-button>
          <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
          <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel style="margin-top: 10px;" :span="4">
          <div class="custom-table-right-tools">
            <el-popover :width="220">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columns" :animation="600" handle=".handle">
                <div
                  v-for="item in columns"
                  :key="item.label"
                  style="font-size: var(--el-font-size-base); display: flex; align-items: center;"
                >
                  <vab-icon class="handle" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" style="display: flex; align-items: center;" class="icon-hover">
                    <el-icon><View /></el-icon>
                  </span>
                  <span v-else @click="handleChecked(item)" class="icon-hover" style="cursor: pointer; display: flex; align-items: center;">
                    <el-icon v-show="!item.checked"><Hide /></el-icon>
                    <el-icon v-show="item.checked"><View /></el-icon>
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
          </div>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table 
        ref="tableRef" 
        stripe border 
        :data="tableData"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="cellStyle"
        @cell-click="changeInput"
        class="noneHoveTable"
        :cell-class-name="clearPadding"
      >
        <el-table-column
          v-for="(item, index) in checkList"
          :key="index"
          :label="item.label"
          :min-width="item.minWidth || flexColumnWidth(tableData, '零件名', 'componentName')"
          :prop="item.prop"
        >
          <template #header>
            <span v-if="item.label === '出厂单价'">
              出厂<br />单价
            </span>
            <span v-if="item.label === '出厂总价'">
              出厂<br />总价
            </span>
            <span v-if="item.label === '总未税价'">
              总未<br />税价
            </span>
            <span v-if="item.label === '总含税价'">
              总含<br />税价
            </span>
            <span v-if="item.label === '实际税点'">
              实际<br />税点
            </span>
            <span v-if="item.label === '开票税点'">
              开票<br />税点
            </span>
          </template>
          <template #default="{ row }">
            <span v-if="item.label === '图片'">
              <el-upload 
                list-type="picture-card" 
                :file-list="row.imageList" 
                :class="{ hide: row.hide }"
                :http-request="(file) => uploadSkuComponentImage(file, row)"
                class="component-upload"
                
              >
                <el-icon><Plus /></el-icon>
                <template #file="{ file }">
                  <img  class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleComponentRemove(file, row)">
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </template>
              </el-upload>
            </span>
            <span v-if="item.label === '数量'">
              <div class="none">
                <el-input type="number" v-model="row.quantity" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.quantity }}</span>
            </span>
            <span v-if="item.label === '出厂单价'">
              <div class="none">
                <el-input type="number" v-model="row.unitPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.unitPrice }}</span>
            </span>
            <span v-if="item.label === '出厂总价'">
              <div class="none">
                <el-input type="number" v-model="row.totalPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row,)" />
              </div>
              <span>{{ row.totalPrice }}</span>
            </span>
            <span v-if="item.label === '总含税价'">
              <div class="none">
                <el-input type="number" v-model="row.taxIncludedPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.taxIncludedPrice }}</span>
            </span>
            <span v-if="item.label === '货币'">
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                  <el-option 
                    v-for="dict in currencyNumList" 
                    :key="dict.value"
                    :value="dict.value" 
                    :label="dict.label"
                  ></el-option>
              </el-select>
            </span>
            <span v-if="item.label === '起订量'">
              <div class="none">
                <el-input type="number" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.minimumOrderQuantity }}</span>
            </span>
            <span v-if="item.label === '整箱数'">
              <div class="none">
                <el-input type="number" v-model="row.numberFullCartons" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.numberFullCartons }}</span>
            </span>
            <span v-if="item.label === '默认供应商'">
              <el-select v-model="row.defaultSuppliserId" @change="handleSuppliserChange(row)">
                <el-option 
                  v-for="item in row.suppliserList"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </span>
            <span v-if="item.label === '开票'">
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingChange(row)">
                <el-option 
                  v-for="dict in invoicingNumList" 
                  :key="dict.value"
                  :value="dict.value" 
                  :label="dict.label"
                ></el-option>
              </el-select>
            </span>
            <span v-if="item.label === '默认采购方'">
              <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleDefaultPurchase(row)">
                <el-option 
                  v-for="item in purchaseOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </span>
            <span v-if="item.label === '不报关'">
              <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleDeclareCustoms(row)"/>
            </span>
            <span v-if="item.label === '采购链接'">
              <div class="none">
                <el-input v-model="row.purchaseLink" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <el-tooltip effect="dark" content="" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row.purchaseLink }}</div>
                </template>
                <el-text truncated>{{ row.purchaseLink }}</el-text>
              </el-tooltip>
            </span>
            <span v-if="item.label === '默认收货仓库'">
              <el-select v-model="row.defaultRepositoryId" placeholder="输入和搜索默认收货仓库" style="min-width: 100%;" filterable @change="handleCurrencyChange(row)">
                <el-option 
                  v-for="item in repositoryOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </span>
            <span v-if="item.label === '零件采购注意事项'">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
              </el-tooltip>
            </span>
            <span v-if="item.label === '合同条款'">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.contractTerms) }}</span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" >
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
                    <el-link type="primary" :underline="false" >供应商</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleAddOtherSku(row)">
                    <el-link type="primary" :underline="false" >添加到其他SKU</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleUpdateComponentName(row)">
                    <el-link type="primary" :underline="false" >修改</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDel(row, $index)">
                    <el-link type="danger" :underline="false" >删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
        </template>
      </el-table>
    </div>

    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorAttentionVisible"
      :content="attentionCopy"
      @clickChild="clickAttentionConfirm"
      @clickBoolean="clickAttentionCancel"
      :classify="classify"
    >
    </wangEditor>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorContractVisible"
      :content="contractCopy"
      @clickChild="clickContractConfirm"
      @clickBoolean="clickContractCancel"
      :classify="classify"
    >
    </wangEditor>
    <!-- 创建零件 / 耗材 -->
    <el-dialog 
        v-model="addComponentVisible" 
        :close-on-click-modal="false" 
        title="创建零件" 
        width="570"
        class="moldDialog"
        :before-close="handlerCloseDialog"
    >
      <template #header>
        <span style="padding-left: 20px">{{ form.type === 0 ? '创建零件' : '创建耗材' }}</span>
      </template>
      <el-divider style="margin-top: 0;"/>
      <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" style="max-width: 480px; margin: 0 auto;" :rules="rules" >
          <el-form-item label="类型" prop="type">
              <el-select v-model="form.type">
                  <el-option
                      v-for="item in componentType"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                  >
                  </el-option>       
              </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === 0" label="零件名" prop="componentName">
            <el-input v-model="form.componentName" clearable placeholder="必须遵守格式规范：品名-规格参数"></el-input>
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="耗材名" prop="consumableName">
            <el-input v-model="mergedPartName" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="耗材种类" prop="materialType">
            <el-select v-model="form.materialType" clearable placeholder="请选择耗材种类" >
              <el-option
                v-for="item in consumableTypeOption"
                :label="item.consumablesName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row style="margin-bottom: 18px;" v-if="form.type === 1" >
            <el-col :span="12">
              <el-form-item label="耗材尺寸" prop="size">
                <el-input v-model="form.size" clearable placeholder="22x15x10"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="尺寸单位" prop="unit">
                <el-input v-model="form.unit" clearable placeholder="cm" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="form.type === 1" label="规格/说明" prop="specification">
            <el-input v-model="form.specification" clearable placeholder="三层加硬空白"/>
          </el-form-item>
          <el-form-item label="按单采购" v-if="form.type === 1" prop="isSinglePurchase" >
            <el-switch v-model="form.isSinglePurchase" style="--el-switch-on-color: #13ce66;" :active-value="1" :inactive-value="0"/>
          </el-form-item>
          <el-form-item label="零件单位" prop="componentUnit">
            <el-input v-model="form.componentUnit" clearable placeholder="套, 个, 只, 片等" />
          </el-form-item>
          <el-form-item label="供应商" prop="supplier">
            <el-select
              v-model="form.supplier"
              filterable
              remote
              allow-create
              default-first-option
              placeholder="点击输入和搜索"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="handleTaxDisabled"
              @blur="handleInput"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开票" prop="invoicing">
            <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingTaxChange">
              <el-option v-for="dict in invoicingNumList" :key="dict.value"
                  :value="dict.value" :label="dict.label" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="taxVisible" label="实际税点" prop="actualTaxRate">
            <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
          </el-form-item>
          <el-form-item v-show="taxVisible" label="开票税点" prop="invoicingTaxRate">
            <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled"placeholder="税点如果是13个点则输入0.13"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="addComponentVisible = false">退出</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
          </span>
        </template>
    </el-dialog>
    <!-- 打包注意事项 -->
    <VabPackingPrecautions 
        :packingPrecautionsVisible="packingPrecautionsVisible"
        @update:packingPrecautionsVisible="handleClosePackingPrecautions"
        @update:tableValue="handleTableDataValue"
    />
    <!-- 添加到其它SKU -->
    <el-dialog 
        v-model="addOtherSkuVisible" 
        :close-on-click-modal="false" 
        title="零件复制到其他SKU" 
        width="800"
        class="moldDialog"
        :before-close="handlerOtherSkuCloseDialog"
    >
        <el-divider style="margin-top: 0;"/>
        <div class="transfer-container">
            <el-transfer 
                v-model="transferValue" 
                :data="transferData" 
                
                filterable 
                :titles="['源列', '目的列']"
            />
        </div>
        <template #footer>
            <span>
                <el-button @click="addOtherSkuVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitOtherSku">确认</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 更新零件名 -->
    <el-dialog 
        v-model="updateComponentNameVisible" 
        :close-on-click-modal="false" 
        title="更新零件名" 
        width="500"
        class="moldDialog"
        :before-close="handlerUpdateComponentNameDialog"
    >
        <el-divider style="margin-top: 0;"/>
        <el-form ref="componentNameFormRef" :model="componentNameForm">
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
    </el-dialog>
    <!-- 添加零件 -->
    <VabCreateComponent 
      :createComponentVisible="createComponentVisible"
      @update:createComponentVisible="handleCloseCreateComponent"
      @update:tableValue="handleSubmitComponent"
    />
    <!-- 添加耗材 -->
    <VabCreateConsumable 
      :createConsumableVisible="createConsumableVisible"
      @update:createConsumableVisible="handleCloseCreateConsumable"
      @update:tableValue="handleSubmitConsumable"
    />
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CirclePlusFilled, Delete, Edit, Hide, Plus, View, ZoomIn } from '@element-plus/icons-vue'
import { FormInstance, UploadFile } from 'element-plus'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { addProductComponentOtherSku, createProductComponent, delComponentImage, delProductComponent, delSkuImage, getProductAllName, getProductAllSupplier, getProductComponentPurchase, getProductComponentStore, getProductConsumablesType, getProductDefaultListComponent, getProductQualityInspection, getProductSkuDetail, getProductSkuList, getProductSupplier, saveProductContractTerms, saveProductPurchaseMatters, submitProductComponent, submitProductConsumable, updateProductComponent, updateProductComponentName, updateProductSku, updateProductSkuRemark, uploadComponentImage, uploadSkuImage } from '/@/api/devlocal/productInformation'
import { useTabsStore } from '/@/store/modules/tabs'
import { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

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
})
const tableData = ref<any>([])
const imageColumnHeight = ref<number>(0)
// 动态设置图片列高度
const setImageColumnHeight = () => {
  const skuInput = document.querySelector('.el-form-item[data-label="SKU"]');
  const upcInput = document.querySelector('.el-form-item[data-label="UPC"]');

  if (skuInput && upcInput) {
    const createDateRect = skuInput.getBoundingClientRect();
    const skuTotalPriceRect = upcInput.getBoundingClientRect();
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30;
  }
}
// 产品名 = 产品主品名-产品短描述-变体名
const mergedProductName = computed(() => {
  return `${sku.value.productName}-${sku.value.productDesc}-${sku.value.variantName}`
})
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否

const columns = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
    disableCheck: true,
    checked: true,
    minWidth: 79,
  },
  {
    label: '零件ID',
    prop: 'existingPartsListId',
    checked: true,
    minWidth: 80,
  },
  {
    label: '零件名',
    prop: 'componentName',
    disableCheck: true,
    checked: true,
    minWidth: null,
  },
  {
    label: '数量',
    prop: 'quantity',
    checked: true,
    minWidth: 60,
  },
  {
    label: '单位',
    prop: 'componentUnit',
    checked: true,
    minWidth: 60,
  },
  {
    label: '出厂单价',
    prop: 'unitPrice',
    checked: true,
    minWidth: 80,
  },
  {
    label: '出厂总价',
    prop: 'totalPrice',
    checked: true,
    minWidth: 80,
  },
  {
    label: '总未税价',
    prop: 'preTaxPrice',
    checked: true,
    minWidth: 75,
  },
  {
    label: '总含税价',
    prop: 'taxIncludedPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '货币',
    prop: 'currency',
    checked: true,
    minWidth: 105,
  },
  {
    label: '起订量',
    prop: 'minimumOrderQuantity',
    checked: true,
    minWidth: 75,
  },
  {
    label: '整箱数',
    prop: 'numberFullCartons',
    checked: true,
    minWidth: 75,
  },
  {
    label: '默认供应商',
    prop: 'defaultSuppliserId',
    checked: true,
    minWidth: 205,
  },
  {
    label: '开票',
    prop: 'invoicing',
    checked: true,
    minWidth: 130,
  },
  {
    label: '实际税点',
    prop: 'actualTaxRate',
    checked: true,
    minWidth: 60,
  },
  {
    label: '开票税点',
    prop: 'invoicingTaxRate',
    checked: true,
    minWidth: 60,
  },
  {
    label: '默认采购方',
    prop: 'purchaseId',
    checked: true,
    minWidth: 130,
  },
  {
    label: '不报关',
    prop: 'declareCustomsStatus',
    checked: true,
    minWidth: 75,
  },
  {
    label: '采购链接',
    prop: 'purchaseLink',
    checked: true,
    minWidth: 140,
  },
  {
    label: '默认收货仓库',
    prop: 'defaultRepositoryId',
    checked: true,
    minWidth: 160,
  },
  {
    label: '零件采购注意事项',
    prop: 'purchaseMatters',
    checked: true,
    minWidth: 200,
  },
  {
    label: '合同条款',
    prop: 'contractTerms',
    checked: true,
    minWidth: 200,
  },
])
const checkList = ref<any>(columns.value.filter((item: any) => item.checked));
// 监听 columns 顺序变化
watch(columns, () => {
  checkList.value = columns.value.filter((item: any) => item.checked);
}, { deep: true })

const handleChecked = (item: any) => {
  item.checked = !item.checked
  if (item.checked) { // 如果是要不隐藏
    // 添加到 checkList，按照 columns 的顺序插入
    const index = columns.value.findIndex((i: any) => i.label === item.label);
    checkList.value.splice(index, 0, item);
  } else { // 如果是要隐藏
    // 从 checkList 中移除
    const index = checkList.value.findIndex((i: any) => i.label === item.label);
    if (index !== -1) {
      checkList.value.splice(index, 1);
    }
  }
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
        count: Number(item.count)                 
      })
    }
 })
 try {
   const { data } = await submitProductComponent({
    skuId: Number(route.query.skuId),
     list
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
        count: Number(item.count)                 
      })
    }
 })
 try {
   const { data } = await submitProductConsumable({
    skuId: Number(route.query.skuId),
    list
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
        name: query
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
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const taxDisabled = ref<boolean>(false)
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
        suppliserName: query
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
  form.supplier = value; // 自动设置为新输入的值
  if(value) {
    const { data } = await getProductSupplier({ suppliserName: value })
    
    if(data!==null) {
      const {actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate, suppliserId } = data
      taxDisabled.value = true
      if(form.invoicing === 0) {
        form.actualTaxRate = actualZTaxRate
        form.invoicingTaxRate = invoicingZTaxRate
      } else if(form.invoicing === 1) {
        form.actualTaxRate = actualPTaxRate
        form.invoicingTaxRate = invoicingPTaxRate
      } else {
        form.actualTaxRate = 0
        form.invoicingTaxRate = 0
      }
    } else {
      taxDisabled.value = false
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
  componentName: ''
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
  componentNameFormRef.value?.resetFields()
}
const handleSubmitComponentName = async () => {
  componentNameFormRef.value?.validate(async (valid: any) => { 
    if(valid) {
      const { data } = await updateProductComponentName({
        existingPartsListId: _row.value.existingPartsListId!,
        componentName: componentNameForm.componentName
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
const defaultRepositoryOption = [
  { label: '云舟', value: 1 },
  { label: '云梧舟', value: 2 },
  { label: '埃托姆', value: 3 },
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
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false
}
const handlePreview = (file: UploadFile) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(file.url!)
}
/**
 * 图片删除功能
 */
const handleRemove = async (file: UploadFile) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await delSkuImage({
        skuId: sku.value.skuId
      })
      if (data == true) {
        sku.value.imageList = []
        sku.value.hide = false
        $baseMessage("SKU图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleComponentRemove = async (file: UploadFile, row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await delComponentImage({
        id: row.id
      })
      if (data == true) {
        row.imageList = []
        row.hide = false
        $baseMessage("SKU零配件图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 修改默认供应商
const handleSuppliserChange = async (row: any) => {
  const { data } = await updateProductComponent(row)
  if (data === true) {
    fetchData()
    fetchComponentData()
  }
}
const packingPrecautionsVisible = ref<boolean>(false)
const packingList = ref<any>() //质检清单数据
const handlePacking = async () => {
  packingPrecautionsVisible.value = true
}
const handleManagerRemarks = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // 获取 'YYYY-MM-DD' 格式
  sku.value.remarks = `${formattedDate}：\n${sku.value.remarks}`
}
const handleClosePackingPrecautions = (value: boolean) => {
  packingPrecautionsVisible.value = value
}
    
const handleTableDataValue = (value: any) => {
  qualityCheckList.value = value
    .map((item: any) => `${item.createTime.split(' ')[0]}: ${item.packagePrecautions}`)
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
  })
}
const handleRemarksChange = async () => {
  await updateProductSkuRemark({
    skuId: sku.value.skuId,
    remarks: sku.value.remarks
  })
}
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
// 点击零件采购注意事项弹出富文本框是否显示
const wangEditorAttentionVisible = ref<boolean>(false)
// 点击合同条款弹出富文本框是否显示
const wangEditorContractVisible = ref<boolean>(false)
const attentionCopy = ref<string>('')
const contractCopy = ref<string>('')
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickAttentionConfirm = async (val: any) => {
    const { data } = await saveProductPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val})
    if (data === true) {
        attentionCopy.value = val
        clickRow.value.purchaseMatters = val
    }
    // await updateProductComponent(clickRow.value)
}
const clickContractConfirm = async (val: any) => {
    const { data } = await saveProductContractTerms({ id: clickRow.value.id, contractTerms: val})
    if (data === true) {
        contractCopy.value = val
        clickRow.value.contractTerms = val
    }
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickAttentionCancel = (val: any) => {
  wangEditorAttentionVisible.value = val
}
const clickContractCancel = (val: any) => {
  wangEditorContractVisible.value = val
}

const rules = reactive({
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
  ],
  componentName: [
    { required: true, message: '请填写零件名', trigger: 'blur' },
  ],
  materialType: [
    { required: true, message: '请选择耗材种类', trigger: 'change' },
  ],
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
  invoicing: [
    { required: true, message: '请选择开票类型', trigger: 'change' },
  ],
  actualTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (!value || value === '')) {
          callback(new Error('请填写实际税点'));
        } else {
          callback();
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  invoicingTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (!value || value === '')) {
          callback(new Error('请填写开票税点'));
        } else {
          callback();
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

const addComponentVisible = ref<boolean>(false)

const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const handlerCloseDialog = () => {
    addComponentVisible.value = false
}
const consumableTypeOption = ref<any>()
const handleCreateComponent = async () => { //点击创建零件
  addComponentVisible.value = true
  formRef.value?.resetFields()
  const { data } = await getProductConsumablesType() //获取耗材种类
  consumableTypeOption.value = data  
  // 初始化开票税点和实际税点的显示
  taxVisible.value = true
}

function validateNoSpaces (rule: any, value: any, callback: any) {
    if (/\s/.test(value)) {
        callback(new Error('输入不能包含空格'));
    } else {
        callback();
    }
}
const mergedPartName = computed(() => {
    let type = ''
    if(form.materialType){
        const i = consumableTypeOption.value.find((item: any) => item.id === form.materialType)
        type=i.consumablesName
    }
    return `${type}-${form.size}-${form.unit}-${form.specification}`;
});
const mergedComponentName = computed(() => {
    return `${form.componentName}-${form.specification}`;
});
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
                status: form.isSinglePurchase
            }
      try {
        const { data} = await createProductComponent({
                skuId: route.query.skuId,
                componentName: form.type === 0 ? form.componentName : mergedPartName.value,
                unit: form.componentUnit,
                suppliser: form.supplier,
                invoicing: form.invoicing,
                actualTaxRate: form.actualTaxRate,
                invoicingTaxRate: form.invoicingTaxRate,
                type: form.type,
                status: form.isSinglePurchase
            })
            if (data) {
                tableData.value.push(newComponent)
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
            componentId: _compoenntId.value!
        })
        if(data === true) {
            $baseMessage('添加到其他SKU成功', 'success', 'hey')
        }
    });
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
    states.value= []
    initials.value=[]
    transferData.value=[]
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
    $baseConfirm('确定要删除零件信息吗',"系统提示", async () => {
      const { data } = await delProductComponent({
          componentId: row.componentId
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
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  // 解构 row 和 column 属性，便于后续使用
  const { purchaseMatters, contractTerms } = row;
  const { property } = column;
  // 根据 column 的属性执行不同的逻辑
  if (property === 'purchaseMatters') {
    clickRow.value = row;
    attentionCopy.value = purchaseMatters;
    wangEditorTitle.value = '零件采购注意事项';
    classify.value = 'purchaseMatters';
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value;
  } else if (property === 'contractTerms') {
    clickRow.value = row;
    contractCopy.value = contractTerms;
    wangEditorTitle.value = '合同条款';
    classify.value = 'contractTerms';
    wangEditorContractVisible.value = !wangEditorContractVisible.value;
  } 
  // 缓存 cell 内部的 DOM 元素，避免重复访问
  const firstChild = cell?.children[0]?.children[0].children[0];
  const secondChild = cell?.children[0]?.children[0].children[1];

  // 如果任一元素不存在，直接返回
  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  // 如果是第一次点击（firstChild 有 'none' 类名），执行以下逻辑
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    // 聚焦并全选输入框或文本框
    focusAndSelectInput(cell);
  }

}
// 处理零件table blur事件
const clickCancel = async (event: any, value: any) => {
  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0].children[0];
    const t2 = rootElement.children[0].children[1];

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }

  // 只有在数据变化时才处理更新
  if (isEqual(value, copyRow)) {
    return; // 数据没有变化，不执行更新
  }

  if (event.type === 'blur') {
    // 执行失去焦点时的处理逻辑
    await updateProductComponent({
      id: value.id,
      skuId: value.skuId,
      componentId: value.componentId,
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
    fetchComponentData()
  }
  // 重新获取实际总成本
  fetchData()
};

// 处理默认采购方
const handleDefaultPurchase = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if(item.type === 0) { //如果选择了为买单的采购方
    row.declareCustomsStatus = 1 //自动勾选不报关
  }
  if(item.label === '埃托姆') { //选择了埃托姆
    row.declareCustomsStatus = 0
  } else if (item.label === 'Attom') { //选择了attom，开票变成无法开票
    row.invoicing = 2
  }
  await updateProductComponent(row)
  fetchData()
  fetchComponentData()
}
// 处理不报关
const handleDeclareCustoms = async (row: any) => {
    const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
    if(item.type === 0) { //如果选择了为买单的采购方
        if(row.declareCustomsStatus === 0) {
            row.declareCustomsStatus = 1
            $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
        }
    } else if(row.purchaseId === 2) { //选择了埃托姆
        if(row.declareCustomsStatus === 1) {
            row.declareCustomsStatus = 0
            $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
        } 
    } else {
        await updateProductComponent(row)
        fetchData()
        fetchComponentData()
    }
}
const handleCurrencyChange = async (row: any) => {
    await updateProductComponent(row)
    fetchData()
    fetchComponentData()
}
const handleInvoicingChange = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if (item.label === 'Attom') {
    if (row.invoicing !== 2) {
      $baseMessage('采购方为attom，无法开票', 'error')
      row.invoicing = 2
    }
  }
    const { data } = await updateProductComponent(row)
    if (data === true) {
        fetchData()
        fetchComponentData()
    }
}
// 点击图标的行的下标
const clickIconRowIndex = ref<number>()
/**
 * 点击添加图标事件
 */
const handleIconClick = (index: number) => {
  // 获得点击行的下标
  clickIconRowIndex.value = index
}

/**
 * 上传图片
 */
const uploadImgForm = ref(new FormData()) as any;

async function uploadImage(params: any) {
    sku.value.hide = true
    try {
        uploadImgForm.value = new FormData(); // 每次上传前重置 FormData
        uploadImgForm.value.append('file', params.file);
        uploadImgForm.value.append('skuId', sku.value.skuId);

        const { data } = await uploadSkuImage(uploadImgForm.value)
        Object.assign(sku.value.imageList, [{ url: data }])
    } catch (error) {
        console.error(error)
    }
}
async function uploadSkuComponentImage(params: any, row: any) {
  row.hide = true
  try {
      uploadImgForm.value = new FormData(); // 每次上传前重置 FormData
      uploadImgForm.value.append('file', params.file);
      uploadImgForm.value.append('id', row.id);

      const { data } = await uploadComponentImage(uploadImgForm.value)
      
      Object.assign(row.imageList, [{ url: data }])
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
            title: "SKU供应商",
            componentId: row.existingPartsListId,
            skuId: row.skuId,
            componentName: row.componentName,
            from: "sku",
            timestamp: Date.now(),
        },
    })
}
// sku详情数据
const fetchData = async () =>{
 
  const { data } = await getProductSkuDetail({
    skuId: route.query.skuId
  })
  Object.assign(sku.value, data)
  
  if (!sku.value.skuImgUrl) {
    sku.value.hide = false
    sku.value.imageList = []
  } else {
    sku.value.hide = true
    sku.value.imageList = [{ url: sku.value.skuImgUrl }]
  }
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
        if(!item.componentImage) {
            item.hide = false
            item.imageList = []
        } else if (item.componentImage){
            item.hide = true
            item.imageList = [{ url: item.componentImage }]
        }
    })
}
const fetchPurchaseAndRepository = async () => {
    const { data: purchase } = await getProductComponentPurchase()
    purchaseOption.value = purchase
    const { data: repository } = await getProductComponentStore()
    repositoryOption.value = repository
}
const fetchInspection = async () => { //获取质检清单数据
    const { data } = await getProductQualityInspection({
        skuId: parseInt(route.query.skuId)
    })
    packingList.value = data
    packingList.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
    handleTableDataValue(packingList.value) //初始化质检清单数据
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.column.property === 'existingPartsListId' || data.column.property === 'componentUnit' || data.column.property === 'preTaxPrice' ||
    data.column.property === 'actualTaxRate' || data.column.property === 'invoicingTaxRate') {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  } else if (data.column.property === 'componentName') {
    return {
      textAlign: 'left',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  } else if (data.column.property === 'purchaseMatters' || data.column.property === 'contractTerms' || data.column.property === 'purchaseLink') {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
const clearPadding = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): string => {
  if (data.column.property === 'componentImage') {
    return 'clear-padding'
  }
  return ''
}
onBeforeMount(()=>{
  fetchData()
  fetchComponentData()
  fetchPurchaseAndRepository()
  fetchInspection()
})
onMounted(() => {
  setImageColumnHeight();
  changeTabsMeta({
    title: 'SKU详情',
    meta: {
      title: `${route.query.title}`,
    },
  })
})
</script>

<style scoped>

:deep(.el-form-item) {
    margin-right: 10px;
}
:deep(.el-card__body) {
    padding-bottom: 2px;
    padding-right: 0;
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
:deep(.component-upload .el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  transition: none;
  margin: 0;
}
:deep(.component-upload .el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
:deep(.el-table .el-table__body .cell) {
  line-height: inherit;
}
.overflow-text {
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
  display: block;
}

.transfer-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中，如果需要 */
}
/* 上面的图片上传框对齐 */
.upload-align {
  margin-top: 30px;
  width: 100%;
  height: 100%;
}
:deep(.upload-align .el-upload-list--picture-card) {
  width: 100%;
  height: 100%;
}

:deep(.upload-align .el-upload-list--picture-card .el-upload-list__item) {
  transition: none;  
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

:deep(.upload-align .el-upload--picture-card) {
  width: 100%;
  height: 100%;
}

.hide :deep(.el-upload--picture-card) {
  display: none
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
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}

.icon-hover:hover {
  background-color: #f2f2f2; /* 浅灰色背景 */
  color: var(--el-color-primary);
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
</style>