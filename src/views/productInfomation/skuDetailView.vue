<template>
   <div class="step-form-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> SKU详情 </strong></span>
                </div>
            </template>
        </el-page-header>
        <el-card class="product-details-card" shadow="never">
            <el-row :gutter="20">
                <el-col :span="2" class="custom-upload" >
                    <el-upload list-type="picture-card" :auto-upload="false" :http-request="uploadImage">
                            <el-icon v-if="!form.imageUrl"><Plus /></el-icon>

                            <!-- 预先显示已经存在的图片 -->
                            <template v-if="form.imageUrl">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="form.imageUrl" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview">
                                            <el-icon @click.stop="handlePreview(form)"><zoom-in /></el-icon>
                                        </span>
                                        <span class="el-upload-list__item-delete">
                                            <el-icon @click.stop="handleRemove(form)"><Delete /></el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview">
                                        <el-icon @click.stop="handlePreview(form)"><zoom-in /></el-icon>
                                    </span>
                                    <span class="el-upload-list__item-delete">
                                        <el-icon @click.stop="handleRemove(form)"><Delete /></el-icon>
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
                                    <el-input v-model="sku.code" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品主品名">
                                    <el-input v-model="sku.productName" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品短描述">
                                    <el-input v-model="sku.shortDescription"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="width: 100%">
                            <el-col :span="6">
                                <el-form-item label="北美FNSKU">
                                    <el-input v-model="sku.originalList" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="欧洲FNSKU">
                                    <el-input v-model="sku.originalList" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="变体名">
                                    <el-input v-model="sku.variantName" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="width: 100%">
                            <el-col :span="6">
                                <el-form-item label="UPC">
                                    <el-input v-model="sku.upc" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="默认收货仓库">
                                    <el-select v-model="sku.upc" placeholder="请选择默认收货仓库"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品经理">
                                    <el-input v-model="sku.productDesign" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"> 
                                <el-form-item label="产品设计">
                                    <el-input v-model="sku.productDesign" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="width: 100%">
                            <el-col :span="4">
                                <el-form-item label="总实际成本">
                                    <el-input v-model="sku.totalCost"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="起订量">
                                    <el-input v-model="sku.moq"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="整箱数">
                                    <el-input v-model="sku.boxQuantity"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"> 
                                <el-form-item label="近10次打包装箱数">
                                    <el-input v-model="sku.packagingQuantities" ></el-input>
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
                                    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 11 }" v-model="packingPrecautionsValue"></el-input>
                        </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="">
                                    <el-space>
                                        <span style="font-size: var(--el-form-label-font-size);">产品经理自己看的备注</span>
                                        <el-icon size="large" style="color: var(--el-color-primary); cursor: pointer;" @click="handleManagerRemarks"><CirclePlusFilled /></el-icon>
                                    </el-space>
                                    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 11 }" v-model="managerRemarks"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <div class="comprehensive-table-container">
            <el-page-header  @back="goBack" style="margin-bottom: 0px;">
                <template #content>
                    <div class="flex items-center">
                        <span> <strong> SKU零配件清单（与开票一致） </strong></span>
                    </div>
                </template>
            </el-page-header>
            <vab-query-form>
                <vab-query-form-left-panel style="margin-top: 10px;">
                    <el-button type="primary" @click="handleAddComponent">创建零件</el-button>
                    <el-button type="primary">添加零件</el-button>
                    <el-button type="primary" @click="handleAddConsumables">创建耗材</el-button>
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
            >
                <el-table-column align="center" label="图片" class="image-wall" min-width="100">
                    <template #default="{ row, $index }">
                        <el-upload list-type="picture-card" :auto-upload="false" :http-request="uploadImage">
                            <el-icon v-if="!row.imageUrl"><Plus /></el-icon>

                            <!-- 预先显示已经存在的图片 -->
                            <template v-if="row.imageUrl">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="row.imageUrl" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview">
                                            <el-icon @click.stop="handlePreview(row)"><zoom-in /></el-icon>
                                        </span>
                                        <span class="el-upload-list__item-delete">
                                            <el-icon @click.stop="handleRemove(row)"><Delete /></el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview">
                                        <el-icon @click.stop="handlePreview(row)"><zoom-in /></el-icon>
                                    </span>
                                    <span class="el-upload-list__item-delete">
                                        <el-icon @click.stop="handleRemove(row)"><Delete /></el-icon>
                                    </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" prop="reviewComponentId" width="80">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.reviewComponentId }}</span>
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
                            <el-option v-for="dict in currencyList" :key="dict.value"
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
                <el-table-column align="center" label="默认供应商" min-width="140" prop="supplier">
                    <template #default="{row}">
                        <el-select  placeholder="" clearable filterable>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="130">
                    <template #default = "{ row }">
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingChange(row)">
                            <el-option v-for="dict in invoicingList" :key="dict.value"
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

                <el-table-column align="center" label="默认采购方" min-width="140" prop="purchaser">
                    <template #default="{row}">
                        <el-select placeholder="请选择默认采购方" style="min-width: 100%;">
                        
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="不报关" prop="purchaseToOrder" align="center" min-width="75">
                    <template #default = "{ row }">
                        <el-checkbox v-model="row.purchaseToOrder" :true-value="'1'" :false-value="'0'" class="custom-checkbox" />
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
                <el-table-column  label="默认收货仓库" prop="remarks" min-width="125">
                    <template #default="{ row }">
                        <el-select 
                            v-model="row.componentInfo!" 
                            value-key="id"
                            placeholder="请选择收货仓库"
                            filterable
                            clearable
                            allow-create
                            style="min-width: 100%;"
                        >
                            
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
                  <template #default="{ row }">
                    <el-dropdown>
                      <el-button text type="primary" v-permissions="{ permission: ['newProduct:evaluation:add'] }">
                        修改
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleSupplier">供应商</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleAddOtherSku">添加到其他SKU</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="danger" :underline="false" @click="handleDel">删除</el-link>
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
            width="500"
            class="moldDialog"
            :before-close="handlerCloseDialog"
        >
            <el-divider style="margin-top: 0;"/>
            <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" style="max-width: 340px; margin: 0 auto;">
                <el-form-item label="零件名" prop="componentName">
                    <el-input v-model="form.componentName" clearable />
                </el-form-item>
                <el-form-item label="供应商" prop="supplier">
                    <el-input v-model="form.supplier" clearable  />
                </el-form-item>
                <el-form-item label="开票" prop="invoicing">
                    <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%;">
                        <el-option v-for="dict in invoicingList" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实际税点" prop="actualTaxRate">
                    <el-input v-model="form.actualTaxRate" clearable />
                </el-form-item>
                <el-form-item label="开票税点" prop="invoicingTaxRate">
                    <el-input v-model="form.invoicingTaxRate" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="addComponentVisible = false">退出</el-button>
                    <el-button type="primary" @click="handleSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 创建耗材-->
        <el-dialog 
            v-model="addConsumablesVisible" 
            :close-on-click-modal="false" 
            title="创建耗材" 
            width="500"
            class="moldDialog"
            :before-close="handlerConsumablesCloseDialog"
        >
            <el-divider style="margin-top: 0;"/>
            <el-form ref="formConsumablesRef" class="demo-form" label-position="right" label-width="auto" :model="formConsumables" style="max-width: 340px; margin: 0 auto;" :rules="rules">
                <el-form-item label="耗材名">
                    <el-input
                        v-model="mergedPartName"
                        :disabled="true"
                        placeholder="合并后的零件名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="耗材种类" prop="materialType">
                    <el-select v-model="formConsumables.materialType" clearable />
                </el-form-item>
                <el-form-item label="尺寸" prop="size">
                    <el-input v-model="formConsumables.size" clearable  />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="formConsumables.unit" clearable  />
                </el-form-item>
                <el-form-item label="规格和说明" prop="specification">
                    <el-input v-model="formConsumables.specification" clearable />
                </el-form-item>
                <el-form-item label="按单采购" prop="isSinglePurchase">
                    <el-checkbox v-model="formConsumables.isSinglePurchase" class="custom-checkbox"></el-checkbox>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="addConsumablesVisible = false">退出</el-button>
                    <el-button type="primary" @click="handleSubmitConsumables">确认</el-button>
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

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
/* 基础用法 */
interface Option2 {
  key: number
  label: string
  initial: string
}

const generateData2 = () => {
  const data: Option2[] = []
  const states = ['California', 'Illinois', 'Maryland', 'Texas', 'Florida', 'Colorado', 'Connecticut ']
  const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT']
  states.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      initial: initials[index],
    })
  })
  return data
}
const transferData = ref<Option2[]>(generateData2())
const transferValue = ref([])
const filterMethod = (query: any, item: any) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}
const sku = ref({
  code: 'NHome-X003UMLWLX',
  productName: '可食用内粉',
  shortDescription: '5g粗粉',
  originalList: '2024-7-29: 检查产品配件是否齐全, 外观是否有破损和刮痕。\n2024-6-29: 胶条和亚克力板嵌入槽里集中定配。\n2024-5-29: 检查人偶底座是否能与配套支架完美契合。\n2024-5-22: 小塞宝贝（外翻）：几滴和薄薄的色差有严重问题的需要返厂处理。\n2024-2-29: 软皮使用说明书，每片或每方板上贴单面高透明胶。',
  variantName: '斑色',
  productDesign: '王文育',
  supplier: '云舟-川桥路',
  upc: '699035922947',
  totalCost: 12.5,
  moq: 100,
  boxQuantity: 100,
  packagingQuantities: '25(150箱), 30(50箱), 50(10箱)',
  managerNotes: '2024-06-26: 亚克力板的薄后问题要在敲定群里沟通。\n2024-05-20: 往外不在安的单价提高0.21元/爿。需要厂家努力好，应订\n2024-05-16: 去秋杭来做底 单价提高0.3元/双。\n2024-05-15: 南通息换供应商，成本15.97元/套。税后17.17元/套。\n底托和插扣压条需要我司购买，并发到厂家产加工，让他们安装到底座\n应压工厂的地址如下：\n曹县彭意不业有限公司：王先生 13793040890 山东省菏泽市曹县仙明\n2024-05-15: 往胶压条是走到长度，1688挂账中是现货长度，下单\n时要考虑上（视情长4mm 平方，看根长度，数量）\n2024-05-15: 胶带我司需要收到供应商'
})
const imageUrl = ref('')
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const handlePreview = (form: any) => {
    imagePreviewVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(form.imageUrl)
}
/**
 * 图片删除功能
 */
 const handleRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{

        row.imageUrl = ""

        // const delImgForm = new FormData()
        // delImgForm.append('type', '2')
        // delImgForm.append('imageId', file.name)

        // const { data } = await deleteImage(delImgForm)
        // if (data == true) {
        //     $baseMessage("此条产品图片信息删除成功!","success","hey")
        // }
    })
    
  } catch (error) {
    console.error(error)
  }
}
const packingPrecautionsVisible = ref<boolean>(false)
const handlePacking = () => {
    packingPrecautionsVisible.value = true
}
const handleManagerRemarks = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 获取 'YYYY-MM-DD' 格式
    managerRemarks.value = `${formattedDate}：\n${managerRemarks.value}`
}
const handleClosePackingPrecautions = (value: boolean) => {
    packingPrecautionsVisible.value = value
}
const packingPrecautionsValue = ref<string>('')
const managerRemarks = ref<string>('')
    
const handleTableDataValue = (value: any) => {
    packingPrecautionsValue.value = value
        .map((item: any) => `${item.date}: ${item.packingPrecautions}`)
        .join('\n');
}
const tableData = [
  {
    imageUrl: "https://via.placeholder.com/150",
    reviewComponentId: 'R001',
    componentName: '零件A',
    quantity: 100,
    componentUnit: '个',
    unitPrice: 10.00,
    totalPrice: 1000.00,
    preTaxPrice: 950.00,
    taxIncludedPrice: 1050.00,
    currency: 'CNY',
    minimumOrderQuantity: 10,
    numberFullCartons: 5,
    supplier: '供应商A',
    invoicing: '增值税',
    actualTaxRate: '13%',
    invoicingTaxRate: '13%',
    purchaser: '采购方A',
    purchaseToOrder: '0',
    purchaseLink: 'http://example.com/purchaseA',
    componentInfo: null,
    purchaseMatters: '硅胶部分采购价格=0.57一个含税运，不含税=0.5一个。不锈钢吸管，吸管刷，和白卡纸盒全部采购好之后寄到五河县伟田塑胶制品有限公司，让伟田帮我们打包好发过来。',
    contractTerms: '硅胶吸管套产品色号：椰奶白11-0608TCX COCONUT MILK，冷灰Pantone Cool Grey 9C，粉色PANTONG 4064C，浅绿色PANTONE 9504 U，浅蓝色Pantone 290 C，深蓝色Pantone 2376 C；',
    componentImgUrl: [], // 这里可以填入图片的 URL
  },
  {
    reviewComponentId: 'R002',
    componentName: '零件B',
    quantity: 200,
    componentUnit: '箱',
    unitPrice: 20.00,
    totalPrice: 4000.00,
    preTaxPrice: 3700.00,
    taxIncludedPrice: 4200.00,
    currency: 'USD',
    minimumOrderQuantity: 5,
    numberFullCartons: 10,
    supplier: '供应商B',
    invoicing: '普通发票',
    actualTaxRate: '5%',
    invoicingTaxRate: '5%',
    purchaser: '采购方B',
    purchaseToOrder: '1',
    purchaseLink: 'http://example.com/purchaseB',
    componentInfo: null,
    purchaseMatters: '注意事项B',
    contractTerms: '合同条款B',
    componentImgUrl: [], // 这里可以填入图片的 URL
  },
  {
    reviewComponentId: 'R003',
    componentName: '零件C',
    quantity: 150,
    componentUnit: '套',
    unitPrice: 15.00,
    totalPrice: 2250.00,
    preTaxPrice: 2100.00,
    taxIncludedPrice: 2500.00,
    currency: 'EUR',
    minimumOrderQuantity: 2,
    numberFullCartons: 3,
    supplier: '供应商C',
    invoicing: '增值税',
    actualTaxRate: '10%',
    invoicingTaxRate: '10%',
    purchaser: '采购方C',
    purchaseToOrder: '0',
    purchaseLink: 'http://example.com/purchaseC',
    componentInfo: null,
    purchaseMatters: '注意事项C',
    contractTerms: '合同条款C',
    componentImgUrl: [], // 这里可以填入图片的 URL
  },
];

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
    const { data } = await reviewStepNo3UpdatePurchaseMatters({ reviewComponentId: clickRow.value.reviewComponentId, purchaseMatters: val})
    if (data === true) {
        attentionCopy.value = val
        clickRow.value.purchaseMatters = val
    }
}
const clickContractConfirm = async (val: any) => {
    const { data } = await reviewStepNo3UpdateContractTerms({ reviewComponentId: clickRow.value.reviewComponentId, contractTerms: val})
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
    materialType: [
        { required: true, message: '请选择耗材种类', trigger: 'change' },
    ],
    size: [
        { required: true, message: '请填写尺寸', trigger: 'blur' },
        { validator: validateNoSpaces, trigger: 'blur' },
    ],
    unit: [
        { required: true, message: '请填写单位', trigger: 'blur' },
        { validator: validateNoSpaces, trigger: 'blur' },
    ],
    specification: [
        { required: true, message: '请填写规格和说明', trigger: 'blur' },
        { validator: validateNoSpaces, trigger: 'blur' },
    ],
});
const formRef = ref<FormInstance>()
const formConsumablesRef = ref<FormInstance>()
const form = ref<any>({})
const formConsumables = ref({
    materialType: '',
    size: '',
    unit: '',
    specification: '',
    isSinglePurchase: false,
});
const mergedPartName = computed(() => {
    return `${formConsumables.value.materialType}-${formConsumables.value.size}-${formConsumables.value.unit}-${formConsumables.value.specification}`;
});
const addComponentVisible = ref<boolean>(false)
const addConsumablesVisible = ref<boolean>(false)
const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const handlerCloseDialog = () => {
    addComponentVisible.value = false
}
const handlerConsumablesCloseDialog = () => {
    addConsumablesVisible.value = false
}
const handleAddComponent = () => {
    addComponentVisible.value = true
    formRef.value?.resetFields()
}
const handleAddConsumables = () => {
    addConsumablesVisible.value = true
    formConsumablesRef.value?.resetFields()
}
function validateNoSpaces (rule: any, value: any, callback: any) {
    if (/\s/.test(value)) {
        callback(new Error('输入不能包含空格'));
    } else {
        callback();
    }
}
const handleSubmit = () => {
    formRef.value?.validate((valid: any) => {
        if (valid) {
            addComponentVisible.value = false
            $baseMessage('表单提交成功', 'success', 'hey')
        }
        else $baseMessage('表单提交失败', 'error', 'hey')
    })
    // const newComponent: IreviewStepNo3ComponentList = {
    //     actualTaxRate: '',
    //     componentImgUrl: '',
    //     componentName: '',
    //     componentUnit: '',
    //     contractTerms: '',
    //     currency: null,
    //     freight: '',
    //     invoicing: null,
    //     invoicingTaxRate: '',
    //     minimumOrderQuantity: null,
    //     numberFullCartons: null,
    //     orderEntryId: 0,
    //     preTaxPrice: '',
    //     purchaseLink: '',
    //     purchaseMatters: '',
    //     quantity: null,
    //     reviewComponentId: null,
    //     reviewId: null,
    //     supplier: '',
    //     taxIncludedPrice: '',
    //     totalPrice: '',
    //     unitPrice: '',
    //     variant: '',
    // }
    // let classReviewId: number | undefined
    // if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
    //     classReviewId = props.step1Data
    // } else {
    //     classReviewId = route.query.reviewId
    // }
    // const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
    // newComponent.reviewComponentId = data
    // componentList.value.push(newComponent)
    // fetchDataComponent()
    // fetchVariantsData()
}
const handleSubmitOtherSku = () => {
    addOtherSkuVisible.value = false
    $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
        
        
    }
);
}
const handleSubmitConsumables = () => {
    formConsumablesRef.value?.validate((valid: any) => {
        if (valid) {
            addConsumablesVisible.value = false
            $baseMessage('表单提交成功', 'success', 'hey')
        }
        else $baseMessage('表单提交失败', 'error', 'hey')
    })
    
    // const newComponent: IreviewStepNo3ComponentList = {
    //     actualTaxRate: '',
    //     componentImgUrl: '',
    //     componentName: '',
    //     componentUnit: '',
    //     contractTerms: '',
    //     currency: null,
    //     freight: '',
    //     invoicing: null,
    //     invoicingTaxRate: '',
    //     minimumOrderQuantity: null,
    //     numberFullCartons: null,
    //     orderEntryId: 0,
    //     preTaxPrice: '',
    //     purchaseLink: '',
    //     purchaseMatters: '',
    //     quantity: null,
    //     reviewComponentId: null,
    //     reviewId: null,
    //     supplier: '',
    //     taxIncludedPrice: '',
    //     totalPrice: '',
    //     unitPrice: '',
    //     variant: '',
    // }
    // let classReviewId: number | undefined
    // if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
    //     classReviewId = props.step1Data
    // } else {
    //     classReviewId = route.query.reviewId
    // }
    // const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
    // newComponent.reviewComponentId = data
    // componentList.value.push(newComponent)
    // fetchDataComponent()
    // fetchVariantsData()
}
const handleAddOtherSku = () => {
    addOtherSkuVisible.value = true
};

const handleDel = () => {
    $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{
        const secondConfirm = await $baseConfirm('确定删除，是否继续？', '系统提示');

        if (secondConfirm) {
            // 执行添加到其他SKU的逻辑
            console.log('零件已添加到其他SKU');
            // API 请求
        } else {
            console.log('操作已取消');
        }
        
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
        const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
        attentionCopy.value = data
        row.purchaseMatters = data
        wangEditorTitle.value = '零件采购注意事项'
        classify.value = 'purchaseMatters'
        wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
    } else if (column.property == 'contractTerms'){
            clickRow.value = row
            const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
            contractCopy.value = data
            row.contractTerms = data
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
        // await reviewStepNo3ComponentUpdate(value)
        // fetchDataComponent()
        // fetchVariantsData()
    }
}
const handleCurrencyChange = async (row: any) => {
    // await reviewStepNo3ComponentUpdate({
    //     ...row,
    //     currency: parseInt(row.currency),
    // })
    // fetchDataComponent()
    // fetchVariantsData()
}
const handleInvoicingChange = async (row: any) => {
    // await reviewStepNo3ComponentUpdate({
    //     ...row,
    //     invoicing: parseInt(row.invoicing),
    // })
    // fetchDataComponent()
    // fetchVariantsData()
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
const imageForm = ref(new FormData()) as any;
async function uploadImage(params: any) {
//   try {
//     const index = clickIconRowIndex.value!;
//     const currentComponent = componentList.value[index];

//     // 检查 params.file 是否有效
//     if (!params.file) {
//       throw new Error('文件无效');
//     }

//     const imageForm = new FormData();
//     imageForm.append('file', params.file);
//     imageForm.append('reviewComponentId', currentComponent.reviewComponentId as any);

//     // 上传图片
//     reviewStepNo3ComponentUpload(imageForm)
//         .then(({ data }) => {
//         if (!data) {
//             throw new Error('上传图片失败');
//         }
//         const imageListCopy = [...(currentComponent.componentImgUrl || [])];
//         imageListCopy.push({ url: data });

//         componentList.value[clickIconRowIndex.value!].componentImgUrl = imageListCopy;
//         componentList.value[clickIconRowIndex.value!].hide = imageListCopy.length > 0;

//             // 提示成功信息
//             $baseMessage('图片上传成功!', 'success', 'hey');
        
//         })
//         .catch(error => {
//             console.error(error);
//             $baseMessage('图片上传失败!', 'error', 'hey');
//         });
        

//   } catch (error) {
//     console.error(error);
//     $baseMessage('图片上传失败!', 'error', 'hey');
//   }
}

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
const handleSupplier = () => {
    router.push({
        path: '/productInfomation/skuSupplier',
        query: {
        title: "SKU供应商",
        timestamp: Date.now(),
        },
    })
}

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




</style>