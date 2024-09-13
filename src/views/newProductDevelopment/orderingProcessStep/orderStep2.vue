<template>
    <div>
        <h2 style="text-align: center;">请选择需要添加到采购单里的零件</h2>
        <el-table 
            ref="tableRef" 
      
            border stripe
            :data="progressProductList" 
            :header-cell-style="{'text-align': 'center'}"
            @cell-click="tableInputChange"
            :cell-style="{ textAlign: 'center'}"
            @selection-change="setSelectRows"
        >
            <el-table-column label="图片" min-width="100" prop="componentImg">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" data-img="img" />
                </template>
            </el-table-column>
            <el-table-column label="已有零件ID" width="120" prop="componentId" >
            </el-table-column>   
            <el-table-column label="零件名"  min-width="160" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>  
            <el-table-column label="数量"  min-width="70" prop="componentQuantity" >
                <template #default="{ row }">
                    {{ row.componentQuantity  }}
                </template>
            </el-table-column>
            <el-table-column label="单位"  min-width="70" prop="componentUnit" >
                <template #default="{ row }">
                    {{ row.componentUnit  }}
                </template>
            </el-table-column>
            <el-table-column label="出厂单价" min-width="70" prop="unitPrice">
                <template #header>
                    出厂<br>单价
                </template>
                <template #default="{ row }">
                    {{ row.unitPrice  }}
                </template>
            </el-table-column>    
            <el-table-column label="出厂总价"  min-width="70" prop="totalPrice">
                <template #header>
                    出厂<br>总价
                </template>
                <template #default="{ row }">
                    {{ row.totalPrice  }}
                </template>
            </el-table-column>
            <el-table-column label="运费(含税)" prop="freight" width="100">
            </el-table-column>    
            <el-table-column label="总未税价" prop="preTaxPrice" width="100">
            </el-table-column>
            <el-table-column label="总含税价"  min-width="100" prop="taxIncludedPrice" >
            </el-table-column>    
            <el-table-column label="货币" prop="currency" width="110px">
                <template #default = "{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" disabled>
                        <el-option v-for="dict in currencyList" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="供应商" min-width="140" prop="supplier">
            </el-table-column>
            <el-table-column type="selection" width="38" fixed="right">
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
            </template>
      </el-table>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSkip">跳过</el-button>
            <el-button native-type="submit" type="primary" @click="handleContinue">继续</el-button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { IComponentAdd } from '/@/type/orderProcess/orderProcessType';
import { getComponentList } from '/@/api/devlocal/progressSample';
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils';
import { currencyList } from '../indexCommon';
import { reviewStepNo2Savetw } from '~/src/api/devlocal/orderProcess';
import { convertString } from '~/src/utils/stringUtils';

defineOptions({
    name: 'OrderStep2',
})
const route: any = useRoute()
const props = defineProps<{ step1Data: number | undefined }>()

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()

const listLoading = ref<boolean>(true)
const selectRows = ref<any>([])
const suppliserIds = ref<number[]>([])
// 拿样零件添加列表
const progressProductList = ref<IComponentAdd[]>([])

// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      emit("update:priviewListValue", row.componentImg)
      emit("update:imagePreviewVisibale", true)
    }
}

const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
}
const setSelectRows = (value: string) => {
  selectRows.value = value
}
// 获取拿样零件添加数据
const fetchDataComponent = async () =>{
    try {
        // 拿样零件添加列表
        const {data} = await getComponentList({progressId: route.query.progressId})
        progressProductList.value = data
        
        progressProductList.value.forEach((item: any) => {
            delete item.actualTaxRate
            delete item.includedInCost
            delete item.invoicing
            delete item.invoicingTaxRate
            delete item.purchaseLink
            delete item.remarks
            item.unitPrice = formattedPrice(item.unitPrice)
            item.totalPrice = formattedPrice(item.totalPrice)
        })
        progressProductList.value.sort((a:IComponentAdd,b:IComponentAdd) => a.componentId! - b.componentId!)
    }catch(e){
        console.error(e as Error)
    }
}
onMounted(async ()=>{
    fetchDataComponent()
})

// 当点击跳过的时候
const handleSkip = () => {
    emit('change-step', 2)
}
// 当点击继续的时候
const handleContinue = async () => {
    selectRows.value.forEach((item: any) => {
        suppliserIds.value.push(item.supplierId)
    })

    const id = suppliserIds.value + ""
   
    try {
        const { data } = await reviewStepNo2Savetw({ suppliserIds: id, reviewId: props.step1Data })
        if (data === true) {
            emit('change-step', 2)
        }
    } catch (error) {
        console.error(error)
    }
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
</style>
  