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
                <el-table-column align="center" label="属于变体" min-width="120" prop="variant">
                    <template #default="{ row }">
                        <el-select v-model="row.variant" placeholder="请选择变体"  style="min-width: 11px;">
                            
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零件图片" min-width="100">
                    <template #default="{ row }">
                        <el-image style="width: 75px; height: 75px" :src="row.componentImgUrl" fit="fill" data-img="img" />
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
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;">
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
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;">
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
                        <span>{{ row.purchaseMatters }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.contractTerms"  />
                        </div>
                        <span>{{ row.contractTerms }}</span>
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
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
        >
            <el-table-column label="变体" min-width="100" prop="currency">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币"  style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="site" label="站点" min-width="135">
                <template #default="{ row }">
                    <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%;">
                        <el-option v-for="dict in list" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="外汇币种" min-width="100">
                <template #default="{ row }">
                    <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                </template>
            </el-table-column>

            <el-table-column prop="price" label="实际总成本￥" min-width="120">
                <template #default="{ row }">
                    <span>{{ row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="length" label="长(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.length" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.length }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="width" label="宽(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.width" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.width }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="height" label="高(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.height" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.height }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="重量(g)">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weight" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.weight }}</span>
                </template>
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="lastfirstMileMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packaging" >
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packaging" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.packaging }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140">
                <template #default="{ row }">
                    <el-select 
                        v-model="row.firstMileChannel" 
                        placeholder="请选择头程渠道"
                        style="min-width: 100%"
                    >
                        <el-option 
                            v-for="dict in firstLegChannelColumns" 
                            :key="dict.value" 
                            :value="dict.value"
                            :label="dict.label"
                        >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="最终售价$" min-width="100" prop="sellingPrice">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.sellingPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
            <el-table-column prop="roi" label="ROI"></el-table-column>
            <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weightCoefficient" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.weightCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.volumeCoefficient" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.volumeCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tariff" label="关税%">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.tariff" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
import { currencyList, firstLegChannelColumns, invoicingList } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate } from '/@/api/devlocal/orderProcess';
import { IreviewStepNo3ComponentList } from '/@/type/orderProcess/orderProcessType';
import { convertString } from '~/src/utils/stringUtils';

const props = defineProps<{ step1Data: number }>()

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
const componentList = ref<IreviewStepNo3ComponentList[]>([])
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
    attentionCopy.value = val
}
const clickContractConfirm = async (val: any) => {
    contractCopy.value = val
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
    const { data } = await reviewStepNo3ComponentAdd({ reviewId: props.step1Data})
    newComponent.reviewComponentId = data
    componentList.value.push(newComponent)
    fetchDataComponent()
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
                }
        })
    } catch(e){
        console.log(e as Error)
   }
}
const copyRow = ref<any>(null)
const handleComponentCopy = (row: IreviewStepNo3ComponentList) => {
    $baseConfirm('是否要复制本条新品进度信息？', '复制', async () => {
        const { data } = await reviewStepNo3ComponentCopy({ reviewComponentId: row.reviewComponentId! })
        if (data === true) {
            copyRow.value = JSON.parse(JSON.stringify(row))
            const index = componentList.value.findIndex(item => item === row)
            componentList.value.splice(index + 1, 0, copyRow.value)
            $baseMessage(`复制成功！`, "success", "hey")
        }
    }, null)
}
/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && el){
      emit("update:priviewListValue", row.componentImg)
      emit("update:imagePreviewVisibale", true)
    }
    if (!cell.children[0].children[0]
        || !cell.children[0].children[1]
        || !cell.children[0].children[0].classList
        || !cell.children[0].children[1].classList) {
    return
    }

    if (column.property == 'purchaseMatters') {
    
        attentionCopy.value = row.purchaseMatters
        wangEditorTitle.value = '零件采购注意事项'
        classify.value = 'purchaseMatters'
        wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
        contractCopy.value = row.contractTerms
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

// table blur事件
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
    }
    
}
// 当点击保存的时候
const handleSave = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击保存并继续的时候
const handleSaveAndContinue = () => {
    $baseMessage("当前信息已保存。","success","hey")
    emit('change-step', 3)
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 1)
}
// 获取拿样零件添加数据
const fetchDataComponent = async () =>{
    try {
        // 拿样零件添加列表
        const { data } = await reviewStepNo3ComponentList({reviewId: props.step1Data})
        componentList.value = data
        
        componentList.value.forEach((item: any) => {
            item.currency = convertString(item.currency)
            item.invoicing = convertString(item.invoicing)
        })
    }catch(e){
        console.error(e as Error)
    }
}

onMounted(async ()=>{
    fetchDataComponent()
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
</style>
  