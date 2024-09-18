<template>
    <div class="container">
        <div class="table-container">
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="componentList" 
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="changeInput"
                height="400"
            >
                <el-table-column align="center" label="属于变体" min-width="140" prop="variant">
                    <template #default="{ row }">
                        <el-select v-model="row.variant" placeholder="请选择变体"  style="min-width: 100%;" disabled>
                            <el-option
                                v-for="item in variantsSelectList"
                                :label="item.label"
                                :key="item.id"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零件图片" min-width="100">
                    <template #default="{ row, $index }">
                        <el-image width="75px" height="75px" :src="row.componentImgUrl" data-img="img" />
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" min-width="70" prop="reviewComponentId" width="100">
                </el-table-column>   
                <el-table-column label="零件名" prop="componentName" width="120">
                </el-table-column>
                <el-table-column label="每个SKU需要数量"  width="100" prop="quantity" align="center">
                    <template #header>
                        每个SKU<br>需要数量
                    </template>
                </el-table-column>
                <el-table-column label="单位"  min-width="70" prop="componentUnit" align="center">
                </el-table-column>
                <el-table-column label="出厂单价" prop="unitPrice" min-width="70" align="center">
                    <template #header>
                        出厂<br>单价
                    </template>
                </el-table-column>

                <el-table-column label="出厂总价" prop="totalPrice" min-width="70" align="center">
                    <template #header>
                        出厂<br>总价
                    </template>
                </el-table-column>
                <el-table-column label="每个SKU运费(含税)" prop="freight" align="center" min-width="100">
                    <template #header>
                        每个SKU<br>运费(含税)
                    </template>
                </el-table-column>    
                <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="70">
                    <template #header>
                        总未<br>税价
                    </template>
                </el-table-column>
                <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="70">
                    <template #header>
                        总含<br>税价
                    </template>
                </el-table-column>    
                <el-table-column label="货币" width="110px" prop="currency">
                    <template #default="{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" disabled>
                            <el-option v-for="dict in currencyList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="100">
                </el-table-column> 
                <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="100">
                </el-table-column> 
                <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="140">
                    <template #default = "{ row }">
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" disabled>
                            <el-option v-for="dict in invoicingList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
                    <template #header>
                        实际<br>税点
                    </template>
                </el-table-column>

                <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                    <template #header>
                        开票<br>税点
                    </template>
                </el-table-column>

                
                <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                    <template #default="{ row }">
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
                        disabled
                    >
                        <el-option v-for="val,idx in list" :label="val.label!" :value="val" :key="val.id!"/>
                    </el-select>
                </el-table-column>
                <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
                    <template #default="{ row }">
                        <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                    <template #default="{ row }">
                        <span>{{ removeHtmlTags(row.contractTerms) }}</span>
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
            @clickBoolean="clickAttentionCancel"
            @clickChild="clickAttentionConfirm"
            :classify="classify"
        >
        </wangEditor>
        <wangEditor
            :title="wangEditorTitle"
            :wangEditorVisible="wangEditorContractVisible"
            :content="contractCopy"
            @clickBoolean="clickContractCancel"
            @clickChild="clickContractConfirm"
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
                    <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%;" disabled>
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
            </el-table-column>

            <el-table-column prop="packagingWidth" label="宽(cm)" min-width="90">
            </el-table-column>

            <el-table-column prop="packagingHeight" label="高(cm)" min-width="90">
            </el-table-column>

            <el-table-column prop="weight" label="重量(g)">
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="firstMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packagingPrice" >
            </el-table-column>
            <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140">
                <template #default="{ row }">
                    <el-select 
                        v-model="row.firstMileChannel" 
                        placeholder="请选择头程渠道"
                        style="min-width: 100%"
                        disabled
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
            </el-table-column>
            <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
            <el-table-column prop="roi" label="ROI"></el-table-column>
            <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
            </el-table-column>
            <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
            </el-table-column>
            <el-table-column prop="tariff" label="关税%">
            </el-table-column>
            <el-table-column prop="platformCommission" label="平台佣金" min-width="100"></el-table-column>
            <el-table-column prop="storageFee" label="仓储费2个月$" min-width="140"></el-table-column>
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
            <el-button native-type="submit" type="primary" @click="handleSave">下一步</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderCheckStep2',
})
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import { currencyList, firstLegChannelColumnsNum, invoicingList, estimatedCostAccountingSiteColumnsNum, siteReflectCurrencyAndExchangeRate } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentImtDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate, reviewStepNo3ComponentUpload, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3SaveTh, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters, reviewStepNo3VariantList, reviewStepNo3VariantUpdate } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList, IreviewStepNo3VariantListResp } from '/@/type/orderProcess/orderProcessType';
import { convertString } from '/@/utils/stringUtils';

const emit = defineEmits<{ 
    (e: 'changeCheck-step', value: number): void
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
    wangEditorAttentionVisible.value = false
}
const clickContractConfirm = async (val: any) => {
    wangEditorContractVisible.value = false
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

const route: any = useRoute()
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && el){
      emit("update:priviewListValue", row.componentImgUrl)
      emit("update:imagePreviewVisibale", true)
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
    }
}


// 当点击下一步的时候
const handleSave = async () => {
    emit('changeCheck-step', 2)
}

// 当点击上一步的时候
const handleGoback = () => {
    emit('changeCheck-step', 0)
}

// 获取拿样零件添加数据
const fetchDataComponent = async () =>{
    try {
        // 拿样零件添加列表
        const { data } = await reviewStepNo3ComponentList({reviewId: parseInt(route.query.reviewId)})
        componentList.value = data
        componentList.value.forEach((item: any, index: number) => {
            item.currency = convertString(item.currency)
            item.invoicing = convertString(item.invoicing)
        })
        // console.log(componentList.value);
        
        // 获取下拉变体列表
        const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: parseInt(route.query.reviewId) })
        variantsSelectList.value = variantSelectList
    }catch(e){
        console.error(e as Error)
    }
}
// 获取变体列表
const fetchVariantsData = async () => {
    try {
        const { data } = await reviewStepNo3VariantList({ reviewId: parseInt(route.query.reviewId) })
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
  