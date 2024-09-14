<template>
    <div class="container">
        <div class="table-container">
            <vab-query-form>
                <vab-query-form-left-panel>
                    <el-button type="primary" @click="handleAddComponent">新增</el-button>
                    <el-button type="primary">添加零件</el-button>
                    <el-button type="primary">添加耗材</el-button>
                </vab-query-form-left-panel>
            </vab-query-form>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="componentList" 
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="changeInput"
            >
                <el-table-column align="center" label="属于变体" min-width="140">
                    <template #default="{ row }">
                        <el-select v-model="row.orderEntryId" placeholder="请选择变体" @change="handleVariantChange(row)" style="min-width: 100%;">
                            <el-option
                                v-for="item in variantsSelectList"
                                :label="item.label"
                                :key="item.id"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零件图片" class="image-wall" min-width="100">
                    <template #default="{ row, $index }">
                        <el-upload 
                            list-type="picture-card" 
                            :file-list="row.componentImgUrl" 
                            :class="{ hide: row.hide }"
                            :http-request="uploadImage"
                        >
                            <div 
                                style="width: 75px; height: 75px; display: flex; align-items: center; justify-content: center;"
                                @click="handleIconClick($index)"
                            >
                                <el-icon ><Plus /></el-icon>
                            </div>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file, row)"
                                        >
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span
                                            class="el-upload-list__item-delete"
                                            @click="handleRemove(file, row)"
                                        >
                                            <el-icon><Delete /></el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" min-width="70" prop="reviewComponentId" width="100">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.reviewComponentId" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.reviewComponentId }}</span>
                    </template>
                </el-table-column>   
                <el-table-column label="零件名" prop="componentName" width="120">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="textarea" autofocus v-model="row.componentName" :autosize="{ minRows: 2, maxRows: 7 }"
                            @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.componentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="每个SKU需要数量"  width="100" prop="quantity" align="center">
                    <template #header>
                        每个SKU<br>需要数量
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.quantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.quantity }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位"  min-width="70" prop="componentUnit" align="center">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.componentUnit" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.componentUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出厂单价" prop="unitPrice" min-width="70" align="center">
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

                <el-table-column label="出厂总价" prop="totalPrice" min-width="70" align="center">
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
                <el-table-column label="每个SKU运费(含税)" prop="freight" align="center" min-width="100">
                    <template #header>
                        每个SKU<br>运费(含税)
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.freight" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.freight }}</span>
                    </template>
                </el-table-column>    
                <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="70">
                    <template #header>
                        总未<br>税价
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.preTaxPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="70">
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
                <el-table-column label="货币" width="110px" prop="currency">
                    <template #default="{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                            <el-option v-for="dict in currencyList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="100">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.minimumOrderQuantity }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="100">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.numberFullCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.numberFullCartons }}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
                    <template #default="{row}">
                        <div class="none">
                            <el-input type="text" autofocus v-model="row.supplier" 
                            @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>
                            <el-text truncated>
                                {{ row.supplier }}
                            </el-text>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="140">
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
                        <div class="none">
                            <el-input type="text" v-model="row.actualTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.actualTaxRate }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                    <template #header>
                        开票<br>税点
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.invoicingTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.invoicingTaxRate }}</span>
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
                <el-table-column  label="收货仓库" prop="remarks" min-width="100">
                    <el-select 
                        v-model="list.componentInfo!" 
                        value-key="id"
                        placeholder="请选择收货仓库"
                        filterable
                        clearable
                        allow-create
                        :reserve-keyword = "false"
                        
                    >
                        <el-option v-for="val,idx in list" :label="val.label!" :value="val" :key="val.id!"/>
                    </el-select>
                </el-table-column>
                <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.purchaseMatters"  />
                        </div>
                        <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.contractTerms"  />
                        </div>
                        <span>{{ removeHtmlTags(row.contractTerms) }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="150">
                    <template #default="{ row }">
                        <el-space>
                            <el-link type="primary" :underline="false" @click="handleComponentCopy(row)">复制</el-link>
                            <el-link type="primary" :underline="false" @click="handleComponentDel(row)">删除</el-link>
                        </el-space>
                    </template>
                </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
            </template>
        </el-table>
        <vab-alert type="error">
            <h3>--上述产品配件必须和开票一致。如果同一个供应商的零件被分成多行，则每行都需要单独开票。相同供应商的零件尽量合并，实在无法合并的再拆分开。</h3>
            <h3>--为了精准核算利润，运费需要准确填写。</h3>
        </vab-alert>
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
    </div>
    <div class="table-container">
        <el-table 
            ref="tableRef" 
            stripe border 
            :data="variantsList" 
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
            :cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column label="变体" min-width="100" prop="variant" align="center"></el-table-column>
            <el-table-column prop="site" label="站点" min-width="135">
                <template #default="{ row }">
                    <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" style="min-width: 100%;">
                        <el-option v-for="dict in estimatedCostAccountingSiteColumnsNum" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="外汇币种" min-width="100" prop="currencyType">
            </el-table-column>
            <el-table-column label="汇率" min-width="100" prop="foreignExchange">
            </el-table-column>
            <el-table-column prop="actualTotalCost" label="实际总成本￥" min-width="120"></el-table-column>
            <el-table-column prop="packagingLength" label="长(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packagingLength" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.packagingLength }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="packagingWidth" label="宽(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packagingWidth" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.packagingWidth }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="packagingHeight" label="高(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packagingHeight" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.packagingHeight }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="weight" label="重量(g)">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weight" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.weight }}</span>
                </template>
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="firstMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packagingPrice" >
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packagingPrice" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.packagingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140">
                <template #default="{ row }">
                    <el-select 
                        v-model="row.firstMileChannel" 
                        placeholder="请选择头程渠道"
                        style="min-width: 100%"
                        @change="handlerEstimatendChange(row)"
                    >
                        <el-option 
                            v-for="dict in firstLegChannelColumnsNum" 
                            :key="dict.value" 
                            :value="dict.value"
                            :label="dict.label"
                        >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="最终售价$" min-width="100" prop="finalSellingPrice">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.finalSellingPrice" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.finalSellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
            <el-table-column prop="roi" label="ROI"></el-table-column>
            <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weightCoefficient" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.weightCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.volumeCoefficient" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.volumeCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tariff" label="关税%">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.tariff" @keyup.enter="clickVariantsCancle($event, row)" @blur="clickVariantsCancle($event, row)" />
                    </div>
                    <span>{{ row.tariff }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="platformCommission" label="平台佣金" min-width="100"></el-table-column>
            <el-table-column prop="storageFee" label="仓储费2个月$" min-width="140"></el-table-column>
           
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">逆算</el-link>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
            </template>
        </el-table>
        <vab-alert type="error">
            <h3>--请输入精确的产品包装尺寸（精确到小数点后1位），重量（精确到整数）和最终售价。</h3>
            <h3>--如果开专票则实际产品成本=总含税价/(1+开票税点)；如果开普票则则实际产品成本=总含税价</h3>
        </vab-alert>
    </div>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">保存并继续</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderStep3',
})
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import { currencyList, firstLegChannelColumnsNum, invoicingList, estimatedCostAccountingSiteColumnsNum, siteReflectCurrencyAndExchangeRate } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentImtDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate, reviewStepNo3ComponentUpload, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3SaveTh, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters, reviewStepNo3VariantList, reviewStepNo3VariantUpdate } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList, IreviewStepNo3VariantListResp } from '/@/type/orderProcess/orderProcessType';
import { convertString } from '/@/utils/stringUtils';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { getExchangeRate } from '~/src/api/devlocal/evaluation';

const props = defineProps<{ step1Data: number }>()

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
// 变体列表
const variantsList = ref<IreviewStepNo3VariantList[]>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
const list = ref<any>([])
const route: any = useRoute()
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

// 零件信息完善与售价核对修改站点
const handlerSiteChange = async (row: IreviewStepNo3VariantList) =>{
    // 外币币种
    row.currencyType = siteReflectCurrencyAndExchangeRate.get(convertString(row.site))!
    const {data} = await getExchangeRate({currency:row.currencyType})
    row.foreignExchange = data
    row.site = row.site
    await reviewStepNo3VariantUpdate({
        currencyType: row.currencyType,
        finalSellingPrice: row.finalSellingPrice!,
        firstMileChannel: row.firstMileChannel,
        foreignExchange: row.foreignExchange,
        orderEntryId: row.orderEntryId,
        packagingHeight: row.packagingHeight!,
        packagingLength: row.packagingLength!,
        packagingPrice: row.packagingPrice!,     
        packagingWidth: row.packagingWidth!,     
        site: row.site,
        tariff: row.tariff!,
        volumeCoefficient: row.volumeCoefficient!,
        weight: row.weight!,
        weightCoefficient: row.weightCoefficient!,
    })
}
const handleVariantChange = async (row: any) => {
    let _variant: any = {}
    variantsSelectList.value.forEach((item: any) => {
        if(item.id == row.orderEntryId) {
            _variant.variant = item.label
        }
    })
    console.log(_variant);
        
    await reviewStepNo3ComponentUpdate({
        ...row,
        variant: _variant.variant
    })

    fetchDataComponent()
    fetchVariantsData()
}
const handleCurrencyChange = async (row: any) => {
    await reviewStepNo3ComponentUpdate({
        ...row,
        currency: parseInt(row.currency),
    })
    fetchDataComponent()
    fetchVariantsData()
}
const handleInvoicingChange = async (row: any) => {
    await reviewStepNo3ComponentUpdate({
        ...row,
        invoicing: parseInt(row.invoicing),
    })
    fetchDataComponent()
    fetchVariantsData()
}
// 头程渠道修改
const handlerEstimatendChange = async (row:IreviewStepNo3VariantList) =>{
    await reviewStepNo3VariantUpdate({
        currencyType: row.currencyType,
        finalSellingPrice: row.finalSellingPrice!,
        firstMileChannel: row.firstMileChannel,
        foreignExchange: row.foreignExchange,
        orderEntryId: row.orderEntryId,
        packagingHeight: row.packagingHeight!,
        packagingLength: row.packagingLength!,
        packagingPrice: row.packagingPrice!,     
        packagingWidth: row.packagingWidth!,     
        site: row.site,
        tariff: row.tariff!,
        volumeCoefficient: row.volumeCoefficient!,
        weight: row.weight!,
        weightCoefficient: row.weightCoefficient!,
    })
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
  try {
    const index = clickIconRowIndex.value!;
    const currentComponent = componentList.value[index];
    
    // 创建 FormData 对象并添加文件和组件 ID
    imageForm.value = new FormData();
    imageForm.value.append('file', params.file);
    imageForm.value.append('reviewComponentId', currentComponent.reviewComponentId);

    // 上传图片
    const { data } = await reviewStepNo3ComponentUpload(imageForm.value);
    // 确保 data 是有效的图片 URL
    if (!data) {
      throw new Error('上传图片失败');
    }
    
    // 更新当前组件的图片列表
    const imageListCopy = [...(currentComponent.componentImgUrl || [])];
    imageListCopy.push({ url: data });

    componentList.value[index].componentImgUrl = imageListCopy;

    // 更新 hide 状态
    componentList.value[index].hide = imageListCopy.length > 0;

    // componentList.value.forEach((item: any, index: number) => {
    //     console.log(item.componentImgUrl);
    // })
    // 提示成功信息
    $baseMessage('图片上传成功!', 'success', 'hey');
    
  } catch (error) {
    console.error(error);
    $baseMessage('图片上传失败!', 'error', 'hey');
  }
}

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (file: UploadFile, row: any) => {
    console.log(row);
    
    emit("update:priviewListValue", row.componentImgUrl[0].url)
    emit("update:imagePreviewVisibale", true)
}
/**
 * 图片删除功能
 */
const handleRemove = async (file: UploadFile, row: any) => {
    try {
        $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
            const { data } = await reviewStepNo3ComponentImtDel({ reviewComponentId: row.reviewComponentId})
            if (data === true) {
                $baseMessage("此零件图片信息删除成功!", "success", "hey");

                // 从 row.componentImgUrl 中删除对应的文件
                const fileIndex = row.componentImgUrl.findIndex((img: any) => img.url === file.url);
                if (fileIndex !== -1) {
                    row.componentImgUrl.splice(fileIndex, 1);
                }

                // 如果 componentImgUrl 为空，则设置 hide 为 false
                if (row.componentImgUrl.length === 0) {
                    row.hide = false;
                }
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}
// 新增逻辑
const handleAddComponent = async () => {
    const newComponent: IreviewStepNo3ComponentList = {
        actualTaxRate: '',
        componentImgUrl: '',
        componentName: '',
        componentUnit: '',
        contractTerms: '',
        currency: null,
        freight: '',
        invoicing: null,
        invoicingTaxRate: '',
        minimumOrderQuantity: null,
        numberFullCartons: null,
        orderEntryId: null,
        preTaxPrice: '',
        purchaseLink: '',
        purchaseMatters: '',
        quantity: null,
        reviewComponentId: null,
        reviewId: null,
        supplier: '',
        taxIncludedPrice: '',
        totalPrice: '',
        unitPrice: '',
        variant: '',
    }
    let classReviewId: number | undefined
    if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
        classReviewId = props.step1Data
    } else {
        classReviewId = route.query.reviewId
    }
    const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
    newComponent.reviewComponentId = data
    componentList.value.push(newComponent)
    fetchDataComponent()
    fetchVariantsData()
}
// 删除逻辑
const handleComponentDel = (row: IreviewStepNo3ComponentList) => {
    try {
        $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{

            const {data} = await reviewStepNo3ComponentDel({ reviewComponentId: row.reviewComponentId! })
                if (data === true){
                    const index = componentList.value.findIndex((item: IreviewStepNo3ComponentList) => item.reviewComponentId === row.reviewComponentId);
                    if (index !== -1) {
                        componentList.value.splice(index, 1);
                    }
                    $baseMessage("零件信息删除成功！","success","hey")
                    fetchDataComponent()
                    fetchVariantsData()
                }
        })
       
    } catch(e){
        console.log(e as Error)
   }
}
// 复制逻辑
const copyRow = ref<any>(null)
const handleComponentCopy = (row: IreviewStepNo3ComponentList) => {
    $baseConfirm('是否要复制本条零件信息？', '复制', async () => {
        const { data } = await reviewStepNo3ComponentCopy({ reviewComponentId: row.reviewComponentId! })
        if (data === true) {
            copyRow.value = JSON.parse(JSON.stringify(row))
            const index = componentList.value.findIndex(item => item === row)
            componentList.value.splice(index + 1, 0, copyRow.value)
            $baseMessage(`复制成功！`, "success", "hey")
            fetchDataComponent()
            fetchVariantsData()
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
        await reviewStepNo3ComponentUpdate(value)
        fetchDataComponent()
        fetchVariantsData()
    }
}
// 变体table blur事件
const clickVariantsCancle = async (event:any,value:any) =>{
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
        await reviewStepNo3VariantUpdate(value)
        fetchVariantsData()
    }
}
// 当点击保存的时候
const handleSave = async () => {
    let classReviewId: number | undefined
    if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
        classReviewId = props.step1Data
    } else {
        classReviewId = route.query.reviewId
    }
    const { data } = await reviewStepNo3SaveTh({ reviewId: classReviewId! })
    if (data === true) {
        $baseMessage("当前信息已保存。","success","hey")
    }
}
// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
    let classReviewId: number | undefined
    if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
        classReviewId = props.step1Data
    } else {
        classReviewId = route.query.reviewId
    }
    const { data } = await reviewStepNo3SaveTh({ reviewId: classReviewId! })
    if (data === true) {
        $baseMessage("当前信息已保存。","success","hey")
        emit('change-step', 3)
    }
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 1)
}

// 获取拿样零件添加数据
const fetchDataComponent = async () =>{
    try {
        // 拿样零件添加列表
        let classReviewId: number | undefined
        if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
            classReviewId = props.step1Data
        } else {
            classReviewId = route.query.reviewId
        }
        const { data } = await reviewStepNo3ComponentList({reviewId: classReviewId!})
        componentList.value = data
        componentList.value.forEach((item: any, index: number) => {
            item.currency = convertString(item.currency)
            item.invoicing = convertString(item.invoicing)
            if (item.componentImgUrl && item.componentImgUrl.trim() !== "") {
                item.hide = true;
                item.componentImgUrl = [{ url: item.componentImgUrl }];
            } else {
                item.hide = false;
                item.componentImgUrl = []; // 如果没有图片,确保这是空的
            }
            // console.log(item.componentImgUrl);
        })
        // 获取下拉变体列表
        const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! });
        variantsSelectList.value = variantSelectList
        variantsSelectList.value.unshift({ label: '变体共用', id: 0 })
    }catch(e){
        console.error(e as Error)
    }
}
// 获取变体列表
const fetchVariantsData = async () => {
    let classReviewId: number | undefined
    if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
        classReviewId = props.step1Data
    } else {
        classReviewId = route.query.reviewId
    }
    try {
        const { data } = await reviewStepNo3VariantList({ reviewId: classReviewId! })
        variantsList.value = data
    } catch (error) {
        console.error(error)
    }
}
onMounted(async ()=>{
    fetchDataComponent()
    fetchVariantsData()
})
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.table-container {
  flex: 1;
  
}
.none {
    display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
</style>
  