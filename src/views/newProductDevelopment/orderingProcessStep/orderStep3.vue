<template>
    <div class="container">
        <div class="table-container">
            <vab-query-form>
                <vab-query-form-left-panel>
                    <el-button type="primary">新增</el-button>
                    <el-button type="primary">添加零件</el-button>
                    <el-button type="primary">添加耗材</el-button>
                </vab-query-form-left-panel>
            </vab-query-form>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="tablelist" 
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="changeInput"
            >
                <el-table-column align="center" label="属于变体" min-width="120" prop="variants">
                    <template #default="{ row }">
                        <el-select v-model="row.variants" placeholder="请选择变体"  style="min-width: 11px;">
                            
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零件图片" min-width="100">
                    <template #default="{ row }">
                        <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" min-width="70" prop="componentName" width="100">
                    <template #default="{ row }">
                        {{ row.componentName  }}
                    </template>
                </el-table-column>   
                <el-table-column label="零件名" prop="componentName" width="120">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="textarea" autofocus v-model="row.componentName" :autosize="{ minRows: 2, maxRows: 7 }"
                            @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.componentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="每个SKU需要数量"  width="100" prop="componentQuantity" align="center">
                    <template #header>
                        每个SKU<br>需要数量
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.componentQuantity" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.componentQuantity }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位"  min-width="60" prop="componentUnit" align="center">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.componentUnit" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                            <el-input type="text" v-model="row.unitPrice" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                            <el-input type="text" v-model="row.totalPrice" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row,)" />
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
                            <el-input type="text" v-model="row.freight" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                <el-table-column label="总含税价" prop="taxIncludedPrice" min-width="70">
                    <template #header>
                        总含<br>税价
                    </template>
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.taxIncludedPrice" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                <el-table-column label="起订量" prop="createTime" align="center" min-width="100">
                    <template #default = "{ row }">
                    <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="整箱数" prop="createTime" align="center" min-width="100">
                    <template #default = "{ row }">
                    <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
                    <template #default="{row}">
                        <div class="none">
                            <el-input type="text" autofocus v-model="row.supplier" 
                            @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                            <el-input type="text" v-model="row.actualTaxRate" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                            <el-input type="text" v-model="row.invoicingTaxRate" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.invoicingTaxRate }}</span>
                    </template>
                </el-table-column>

                
                <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.purchaseLink" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                <el-table-column  label="零件采购注意事项" prop="attention" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.attention"  />
                        </div>
                        <span>{{ row.attention }}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="合同条款" prop="hetong" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.hetong"  />
                        </div>
                        <span>{{ row.hetong }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="120">
                    <template #default="{ row }">
                        <el-link type="primary" :underline="false">复制</el-link>
                        <el-link type="primary" :underline="false">删除</el-link>
                    </template>
                </el-table-column>
            <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
            </template>
        </el-table>
        <vab-alert type="error">
            <p>--上述产品配件必须和开票一致。如果同一个供应商的零件被分成多行，则每行都需要单独开票。相同供应商的零件尽量合并，实在无法合并的再拆分开。</p>
            <p>--为了精准核算利润，运费需要准确填写。</p>
        </vab-alert>
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
                        <el-input type="text" v-model="row.length" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.length }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="width" label="宽(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.width" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.width }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="height" label="高(cm)" min-width="90">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.height" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.height }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="重量(g)">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weight" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.weight }}</span>
                </template>
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="lastfirstMileMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packaging" >
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packaging" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
                        <el-input type="text" v-model="row.sellingPrice" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
            <el-table-column prop="roi" label="ROI"></el-table-column>
            <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.weightCoefficient" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.weightCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.volumeCoefficient" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.volumeCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tariff" label="关税%">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.tariff" @keydown="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
            <p>--请输入精确的产品包装尺寸（精确到小数点后1位），重量（精确到整数）和最终售价。</p>
            <p>--如果开专票则实际产品成本=总含税价/(1+开票税点)；如果开普票则则实际产品成本=总含税价</p>
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
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { currencyList, firstLegChannelColumns, invoicingList } from '../indexCommon'

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
    const tablelist = [
  {
    variants: 'Variant A',
    componentImg: 'https://via.placeholder.com/75',
    componentName: 'Component 1',
    componentQuantity: 100,
    componentUnit: 'pcs',
    unitPrice: 10,
    totalPrice: 1000,
    freight: 50,
    preTaxPrice: 950,
    taxIncludedPrice: 1020,
    currency: 'USD',
    createTime: '2024-09-12 10:00:00',
    supplier: 'Supplier A',
    oem: 1,
    actualTaxRate: '5%',
    invoicingTaxRate: '10%',
    purchaseLink: 'https://example.com/component1',
    attention: 'Important notice about Component 1',
  },
  {
    variants: 'Variant B',
    componentImg: 'https://via.placeholder.com/75',
    componentName: 'Component 2',
    componentQuantity: 50,
    componentUnit: 'pcs',
    unitPrice: 15,
    totalPrice: 750,
    freight: 30,
    preTaxPrice: 720,
    taxIncludedPrice: 792,
    currency: 'EUR',
    createTime: '2024-09-11 09:00:00',
    supplier: 'Supplier B',
    oem: 0,
    actualTaxRate: '6%',
    invoicingTaxRate: '12%',
    purchaseLink: 'https://example.com/component2',
    attention: 'Attention needed for shipping',
  },
  {
    variants: 'Variant C',
    componentImg: 'https://via.placeholder.com/75',
    componentName: 'Component 3',
    componentQuantity: 200,
    componentUnit: 'pcs',
    unitPrice: 20,
    totalPrice: 4000,
    freight: 100,
    preTaxPrice: 3900,
    taxIncludedPrice: 4290,
    currency: 'CNY',
    createTime: '2024-09-10 08:00:00',
    supplier: 'Supplier C',
    oem: 1,
    actualTaxRate: '3%',
    invoicingTaxRate: '7%',
    purchaseLink: 'https://example.com/component3',
    attention: 'Check quality before shipping',
  }
];

/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 


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
    } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
        textareaElement.focus()
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
</style>
  