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
            <el-row :gutter="20">
                <el-col :span="2" class="custom-upload" > 
                    <el-upload 
                        list-type="picture-card" 
                        :file-list="sku.imageList" 
                        :class="{ hide: sku.hide }"
                        :http-request="uploadImage"
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
                <el-col :span="12" style="padding-right: 0px;">
                    <el-form label-position="top" :inline="true">
                        <el-row style="width: 100%">
                            <el-col :span="12">
                                <el-form-item label="SKU">
                                    <el-input v-model="sku.sku" placeholder="" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品主品名">
                                    <el-input v-model="sku.productName"  @blur="handleUpdateSku"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品短描述" >
                                    <el-input v-model="sku.productDesc" @blur="handleUpdateSku"></el-input>
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
                            <el-col :span="6">
                                <el-form-item label="变体名" >
                                    <el-input v-model="sku.variantName" @blur="handleUpdateSku" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="width: 100%">
                            <el-col :span="6">
                                <el-form-item label="UPC">
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
                                    <el-input v-model="sku.productManager" @blur="handleUpdateSku"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"> 
                                <el-form-item label="产品设计" >
                                    <el-input v-model="sku.productDesign" @blur="handleUpdateSku"></el-input>
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
                                    <el-input v-model="sku.minQuantity" @blur="handleUpdateSku"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="整箱数" >
                                    <el-input v-model="sku.numCartons" @blur="handleUpdateSku"></el-input>
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
               
                <el-col :span="10" style="padding-right: 0px;padding-left: 0px;">
                    <el-form label-position="top" >
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="">
                                    <el-space>
                                        <span style="font-size: var(--el-form-label-font-size);">质检清单</span>
                                        <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer;" @click="handlePacking"><Edit /></el-icon>
                                    </el-space>
                                    <el-input type="textarea" :rows="11" v-model="sku.qualityChecklist" disabled resize="none"></el-input>
                        </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="">
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
                <vab-query-form-left-panel style="margin-top: 10px;">
                    <el-button type="primary" @click="handleAddComponent">创建零件</el-button>
                    <el-button type="primary">添加零件</el-button>
                    <el-button type="primary">添加耗材</el-button>
                </vab-query-form-left-panel>
            </vab-query-form>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="tableData"
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="changeInput"
                height="400"
                class="noneHoveTable"
            >
                <el-table-column align="center" label="图片" class="image-wall" min-width="100">
                    <template #default="{ row, $index }">
                        <el-upload 
                            list-type="picture-card" 
                            :file-list="row.imageList" 
                            :class="{ hide: row.hide }"
                            :http-request="(file) => uploadSkuComponentImage(file, row)"
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
                                            @click="handleComponentRemove(file, row)"
                                        >
                                            <el-icon><Delete /></el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" prop="existingPartsListId" width="80">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.existingPartsListId }}</span>
                    </template>
                </el-table-column>   
                <el-table-column label="零件名" prop="componentName" width="120">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.componentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="60" prop="quantity" align="center">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.quantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.quantity }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="60" prop="componentUnit" align="center">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出厂单价" prop="unitPrice" min-width="60" align="center">
                    <template #header>
                        出厂<br>单价
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.unitPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.unitPrice }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="出厂总价" prop="totalPrice" min-width="60" align="center">
                    <template #header>
                        出厂<br>总价
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.totalPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row,)" />
                        </div>
                        <span>{{ row.totalPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="60">
                    <template #header>
                        总未<br>税价
                    </template>
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.preTaxPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="60">
                    <template #header>
                        总含<br>税价
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.taxIncludedPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.taxIncludedPrice }}</span>
                    </template>
                </el-table-column>    
                <el-table-column label="货币" width="105px" prop="currency">
                    <template #default="{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                            <el-option v-for="dict in currencyNumList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="80">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.minimumOrderQuantity }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="80">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.numberFullCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.numberFullCartons }}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="默认供应商" min-width="140" prop="defaultSuppliserId">
                    <template #default="{row}">
                        <el-select v-model="row.defaultSuppliserId" placeholder=""  @change="handleSuppliserChange(row)">
                            <el-option 
                                v-for="item in row.suppliserList"
                                :label="item.label"
                                :value="item.id"
                                :key="item.id"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="130">
                    <template #default = "{ row }">
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingChange(row)">
                            <el-option v-for="dict in invoicingNumList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
                    <template #header>
                        实际<br>税点
                    </template>
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.actualTaxRate }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                    <template #header>
                        开票<br>税点
                    </template>
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.invoicingTaxRate }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="默认采购方" min-width="140" prop="purchaseId">
                    <template #default="{row}">
                        <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                            <el-option 
                                v-for="item in purchaseOption"
                                :label="item.label"
                                :value="item.id"
                                :key="item.id"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="不报关" prop="declareCustomsStatus" align="center" min-width="75">
                    <template #default = "{ row }">
                        <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleCurrencyChange(row)"/>
                    </template>
                </el-table-column>
                <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.purchaseLink" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>
                            <el-text truncated>
                                {{ row.purchaseLink }}
                            </el-text>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column  label="默认收货仓库" prop="defaultRepositoryId" min-width="125">
                    <template #default="{ row }">
                        <!-- <el-input v-model="row.defaultRepositoryId" clearable /> -->
                        <el-select v-model="row.defaultRepositoryId" placeholder="输入和搜索默认收货仓库" style="min-width: 100%;" filterable @change="handleCurrencyChange(row)">
                            <el-option 
                                v-for="item in repositoryOption"
                                :label="item.label"
                                :value="item.id"
                                :key="item.id"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.purchaseMatters"  />
                        </div>
                        <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.contractTerms"  />
                        </div>
                        <span class="overflow-text">{{ removeHtmlTags(row.contractTerms) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150" align="center">
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
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleAddOtherSku(row.componentId)">添加到其他SKU</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleUpdateComponentName(row)">修改</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="danger" :underline="false" @click="handleDel(row, $index)">删除</el-link>
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
        <!-- 创建零件 -->
        <el-dialog 
            v-model="addComponentVisible" 
            :close-on-click-modal="false" 
            title="创建零件" 
            width="570"
            class="moldDialog"
            :before-close="handlerCloseDialog"
        >
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
                    <el-input v-model="form.componentName" clearable
     
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="form.type === 1" label="耗材名" prop="consumableName">
                    <el-input
                        v-model="form.consumableName"
                       
                        clearable
                    ></el-input>
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
                            <el-input v-model="form.size" clearable  />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="尺寸单位" prop="unit">
                            <el-input v-model="form.unit" clearable  />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="规格/说明" prop="specification">
                    <el-input v-model="form.specification" clearable />
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
                <el-form-item label="实际税点" prop="actualTaxRate">
                    <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled"/>
                </el-form-item>
                <el-form-item label="开票税点" prop="invoicingTaxRate">
                    <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled"/>
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
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    </div>
</template>

<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { Delete, Plus, ZoomIn, Edit, CirclePlusFilled, ArrowDown } from '@element-plus/icons-vue'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { reviewStepNo3ContractTerms, reviewStepNo3PurchaseMatters, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters } from '/@/api/devlocal/orderProcess';
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { FormInstance, UploadFile } from 'element-plus';
import { currencyList, invoicingList } from '../newProductDevelopment/indexCommon';
import type { UploadProps } from 'element-plus'
import { addProductComponentOtherSku, createProductComponent, delComponentImage, delProductComponent, delSkuImage, getChangeProductComponent, getProductAllSupplier, getProductComponentPurchase, getProductComponentStore, getProductComponentSuppliser, getProductConsumablesType, getProductDefaultListComponent, getProductQualityInspection, getProductSkuDetail, getProductSkuList, getProductSupplier, saveProductContractTerms, saveProductPurchaseMatters, updateProductComponent, updateProductComponentName, updateProductSku, updateProductSkuRemark, uploadComponentImage, uploadSkuImage } from '/@/api/devlocal/productInformation';

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const formRef = ref<FormInstance>()

const form = reactive<any>({
    type: 0,
    componentName: '',
    consumableName: '',
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
    console.log(data);
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
const handleTaxDisabled = async (value: string) => {
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
const handleInvoicingTaxChange = async (value: number) => {
   
    if(form.supplier) {
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
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const handlePreview = (file: UploadFile) => {
    imagePreviewVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(file.url!)
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
            $baseMessage("SKU图片删除成功!","success","hey")
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
    sku.value.qualityChecklist = value
        .map((item: any) => `${item.createTime.split(' ')[0]}: ${item.packagePrecautions}`)
        .join('\n');
}
const tableData = ref<any>([])
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
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};


const rules = reactive({
    type: [
        { required: true, message: '请选择类型', trigger: 'change' },
    ],
    componentName: [
        { required: true, message: '请填写零件名', trigger: 'blur' },
    ],
    consumableName: [
        { required: true, message: '请填写耗材名', trigger: 'blur' },
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
        { required: true, message: '请填写实际税点', trigger: 'blur' },
        { validator: validateNoSpaces, trigger: 'blur' },
    ],
    invoicingTaxRate: [
        { required: true, message: '请填写开票税点', trigger: 'blur' },
        { validator: validateNoSpaces, trigger: 'blur' },
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
const handleAddComponent = async () => { //点击创建零件
    addComponentVisible.value = true
    formRef.value?.resetFields()
    const { data } = await getProductConsumablesType() //获取耗材种类
    consumableTypeOption.value = data  
}

function validateNoSpaces (rule: any, value: any, callback: any) {
    if (/\s/.test(value)) {
        callback(new Error('输入不能包含空格'));
    } else {
        callback();
    }
}
const mergedPartName = computed(() => {
    return `${form.value.materialType}-${form.value.size}-${form.value.unit}-${form.value.specification}`;
});
const mergedComponentName = computed(() => {
    return `${form.value.componentName}-${form.value.specification}`;
});
const handleSubmit = async () => {
    formRef.value?.validate(async (valid: any) => {
        if (valid) {
            addComponentVisible.value = false
            const newComponent = {
                componentName: form.type === 0 ? `${form.componentName}-${form.specification}` : `${form.materialType}-${form.size}-${form.unit}-${form.specification}`,
                unit: form.componentUnit,
                suppliser: form.supplier,
                invoicing: form.invoicing,
                actualTaxRate: form.actualTaxRate,
                invoicingTaxRate: form.invoicingTaxRate,
                type: form.type,
                status: form.isSinglePurchase
            }
            const { data} = await createProductComponent({
                skuId: route.query.skuId,
                componentName: form.type === 0 ? `${form.componentName}-${form.specification}` : `${form.materialType}-${form.size}-${form.unit}-${form.specification}`,
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
                $baseMessage('表单提交成功', 'success', 'hey')
            }
        }
        else $baseMessage('表单提交失败', 'error', 'hey')
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
            $baseMessage('添加成功', 'success', 'hey')
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
const handleAddOtherSku = async (componentId: number) => {
  const { data } = await getProductSkuList()
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData2()
  _compoenntId.value = componentId
  addOtherSkuVisible.value = true
}


const handleDel = async (row: any, index: number) => {
    $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{
        $baseConfirm('确定删除，是否继续？', '系统提示', async () => {
            const { data } = await delProductComponent({
                componentId: row.componentId
            })
            if (data) {
                tableData.value.splice(index, 1)
                fetchComponentData()
                fetchData()
                $baseMessage('SKU零配件删除成功', 'success', 'hey')
            }
        });
    })
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
    // let el = getSpecificChildren(cell, "img")[0];
    // if (getDataAttribute(el,'img') && el){
    //   emit("update:priviewListValue", row.componentImg.url)
    //   emit("update:imagePreviewVisibale", true)
    // }
    if (!cell.children[0].children[0]
        || !cell.children[0].children[1]
        || !cell.children[0].children[0].classList
        || !cell.children[0].children[1].classList) {
        return
    }

    if (column.property == 'purchaseMatters') {
        // 查询零件采购注意事项
        clickRow.value = row
        // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.id })
        attentionCopy.value = row.purchaseMatters
        // row.purchaseMatters = data
        wangEditorTitle.value = '零件采购注意事项'
        classify.value = 'purchaseMatters'
        wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
    } else if (column.property == 'contractTerms'){
            clickRow.value = row
            // const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.id })
            contractCopy.value = row.contractTerms
            // row.contractTerms = data
            wangEditorTitle.value = '合同条款'
            classify.value = 'contractTerms'
            wangEditorContractVisible.value = !wangEditorContractVisible.value
    } else {
            cell.children[0].children[0].classList.remove('none')
            cell.children[0].children[1].classList.add('none')
    }


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
// 零件table blur事件
const clickCancle = async (event:any,value:any) =>{
    const t1 = getRootElement(event["srcElement"],".cell").children[0]
    if (t1){
      t1.classList.add("none")
    }
  
    const t2 = getRootElement(event["srcElement"],".cell").children[1]
    if (t2){
      t2.classList.remove("none")
    }
    
    if (event.type === 'blur') {
        // 执行失去焦点处理逻辑
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
        fetchComponentData()
    }

    // 重新获取实际总成本
    fetchData()
}
const handleCurrencyChange = async (row: any) => {
    await updateProductComponent(row)
    fetchData()
    fetchComponentData()
}
const handleInvoicingChange = async (row: any) => {
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
        
        sku.value.imageList = [{ url: data }]
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
        
        row.imageList = [{ url: data }]
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
        // 获取供应商列表
        const { data: suppliser } = await getProductComponentSuppliser({
            componentId: item.existingPartsListId
        })
        item.suppliserList = suppliser
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
    handleTableDataValue(packingList.value) //初始化质检清单数据
}
onMounted(async ()=>{
  fetchData()
  fetchComponentData()
  fetchPurchaseAndRepository()
  fetchInspection()
})
</script>

<style scoped>
/* :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 89.164px;
} */
:deep(.el-form-item) {
    margin-right: 10px;
}
:deep(.el-card__body) {
    padding-bottom: 2px;
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
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.overflow-text {
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
  display: block;
}
.custom-upload {
    display: flex;
    justify-content: center;
    align-items: center; 
}
.transfer-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中，如果需要 */
    
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
</style>