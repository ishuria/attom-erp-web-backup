<template>
    <div class="container">
        <div class="table-container">
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="list" 
                :header-cell-style="{ 'text-align': 'center' }"
            
            >
                <el-table-column align="center" label="属于变体" min-width="120" prop="currency">
                    <template #default="{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币"  style="min-width: 11px;">
                            
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零件图片" min-width="100">
                    <template #default="{ row }">
                        <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                    </template>
                </el-table-column>
                <el-table-column label="零件ID" align="center" min-width="70" prop="componentName" >
                    <template #default="{ row }">
                        {{ row.componentName  }}
                    </template>
                </el-table-column>   
                <el-table-column label="零件名" prop="componentName">
                    <template #default="{ row }">
                        <span>{{ row.componentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="每个SKU需要数量"  width="100" prop="componentQuantity" >
                    <template #header>
                        每个SKU<br>需要数量
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.componentQuantity }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位"  min-width="60" prop="componentUnit" >
                    <template #default="{ row }">
                        <span>{{ row.componentUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出厂单价" prop="unitPrice" min-width="70">
                    <template #header>
                        出厂<br>单价
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.unitPrice }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="出厂总价" prop="totalPrice" min-width="70">
                    <template #header>
                        出厂<br>总价
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.totalPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="每个SKU运费(含税)" prop="freight" align="center" min-width="100">
                    <template #header>
                        每个SKU<br>运费(含税)
                    </template>
                    <template #default="{ row }">
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
                        <span>
                            <el-text truncated>
                                {{ row.supplier }}
                            </el-text>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="60">
                    <template #default = "{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 11px;">
                            
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60">
                    <template #header>
                        实际<br>税点
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.actualTaxRate }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60">
                    <template #header>
                        开票<br>税点
                    </template>
                    <template #default="{ row }">
                        <span>{{ row.invoicingTaxRate }}</span>
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
                        
                    >
                        <el-option v-for="val,idx in list" :label="val.label!" :value="val" :key="val.id!"/>
                    </el-select>
                </el-table-column>
                <el-table-column  label="零件采购注意事项" prop="remarks" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.remarks }}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="合同条款" prop="remarks" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.remarks }}</span>
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
                    <span>{{ row.length }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="width" label="宽(cm)" min-width="90">
                <template #default="{ row }">
                    <span>{{ row.width }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="height" label="高(cm)" min-width="90">
                <template #default="{ row }">
                    <span>{{ row.height }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="重量(g)">
                <template #default="{ row }">
                    <span>{{ row.weight }}</span>
                </template>
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="lastfirstMileMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packaging" >
                <template #default="{ row }">
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
                    <span>{{ row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
            <el-table-column prop="roi" label="ROI"></el-table-column>
            <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
                <template #default="{ row }">
                    <span>{{ row.weightCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
                <template #default="{ row }">
                    <span>{{ row.volumeCoefficient }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tariff" label="关税%">
                <template #default="{ row }">

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
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">下一步</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderCheckStep2',
})

import { currencyList, firstLegChannelColumns } from '../indexCommon'

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])


// 当点击保存并继续的时候
const handleSaveAndContinue = () => {
    emit('change-step', 2)
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 0)
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
</style>
  