<template>
    
    <!-- 样品追踪dailog -->
    <el-dialog 
        v-model="sampleVisible" 
        :close-on-click-modal="false"
        :before-close = "props.closeDialogHandler"
        title="样品追踪"
        width="70%">

        <el-table 
            :data="sampleTableList" 
            style="width: 100%" 
            @cell-click="sampleTableInputChage"
            height="570"
            border stripe
        >
            <el-table-column 
                v-for="(item, index) in sampleTranckTableCloums" 
                :key="index" align="center" 
                :label="item.label"
                :prop="item.prop" :min-width="item.minWidth || 100" width="auto"

            >
                <template #default="{row}">
                    <div v-if="item.prop === 'componentImg'">
                        <el-image v-if="row.componentImg"style="width: 100px; height: 100px" :src="row.componentImg" fit="fill" />
                    </div>

                    <div v-if="item.prop === 'createTime'">
                        <span>{{ formatDate(new Date(row.createTime)) }}</span>
                    </div>

                    <div v-if="item.prop === 'receiptDate'">
                        <span v-if="row.receiptDate">{{ formatDate(new Date(row.receiptDate)) }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" label="操作" min-width="160">
                    <template #default="{ row }">
                        <el-dropdown >
                            <el-button text type="primary" @click="manualReceipt(row)">
                            手动签收
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="orderNo1688Update(row)">1688订单号修改</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="logisticsNoUpdate(row)">物流订单修改</el-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
        </el-table>

    </el-dialog>

    <el-dialog 
        :model-value="orderVisible"
        width="400"
        :title="dialogFlag === true ?'物流单号修改':'1688订单号修改'"
        :close-on-click-modal="false"
        :before-close="orderDialogClose"
    >
        <el-form 
            ref="formRef"
            :model="orderForm"
            label-width="auto" 
            style="max-width: 400px"
        >
            <el-form-item label="1688订单号" prop="orderNo1688" v-if="!dialogFlag">
                <el-input v-model="orderForm.orderNo"/>
            </el-form-item>

            
            <el-form-item label="物流单号" prop="logisticsNo" v-if="dialogFlag">
                <el-input v-model="orderForm.logisticsNo"/>
            </el-form-item>

        </el-form>

        <template #footer>
            <span>
                <el-button @click="orderDialogClose">取消</el-button>
                <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>

import {ISampleTrack,ISampleOrderReq} from '/@/type/progress/sampleAndComponentType'
import {sampleTranckTableCloums} from '../productProgressComponent'
import { getSampleList,updateSampleReceipt,updateSampleOrder } from '/@/api/devlocal/progressSample'
import { formatDate } from '/@/utils/dateUtils'
import {getSpecificChildren} from '/@/utils/nodeUtils'
import { FormInstance, } from 'element-plus'
import {convertString} from '/@/utils/stringUtils'
import { ArrowDown } from '@element-plus/icons-vue'

defineComponent({
    name:"VabSampleTranck"
})

const sampleTableList = ref<ISampleTrack[]>([])
const sampleVisible = ref<boolean>(false)
const orderVisible = ref<boolean>(false)
const progressId = ref<string>()
const dialogFlag = ref<boolean>(false)
const formRef = ref<FormInstance>()

const props = defineProps<{
    visible:boolean
    progressId:string
    closeDialogHandler: (done: any) => void
}>();

const emit = defineEmits<{
    (e: 'update:priviewListValue', value: string): void
 }>()

 // 订单号
const orderForm = reactive({
    sampleId:'',
    orderNo:'',
    logisticsNo:'',
})


const fetachData = async()=>{
  const { data } = await getSampleList({progressId:props.progressId})
  sampleTableList.value = data
}

watchEffect(()=>{
    sampleVisible.value = props.visible
    progressId.value = props.progressId
    if (sampleVisible.value === true) fetachData()
})

// 拿样table单击事件
const sampleTableInputChage = (row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    if (getSpecificChildren(cell, "img")[0]){
        emit("update:priviewListValue",row.componentImg)
    }
}

// 手动签收
const manualReceipt = async (row:ISampleTrack) =>{

    $baseConfirm('确定要手动签收此条样品记录吗',"系统提示", async ()=>{

        const {data} = await updateSampleReceipt({sampleId:row.sampleId})
        
        row.receiptDate = data.receiptDate
        if (data != null || data != undefined){
            $baseMessage(`样品${row.componentName}手动签收成功！`,"success","hey")
        }

    })

}

// 1688单号修改
const orderNo1688Update = (row:ISampleTrack) =>{
    orderForm.sampleId = ''
    orderVisible.value = true
    dialogFlag.value = false
    orderForm.sampleId = convertString(row.sampleId)
}

// 物流单号修改
const logisticsNoUpdate = (row:ISampleTrack) =>{
    orderForm.sampleId = ''
    orderVisible.value = true
    dialogFlag.value = true
    orderForm.sampleId = convertString(row.sampleId)
}

const orderDialogClose = () =>{
    orderVisible.value = false
    orderForm.sampleId = ''
    orderForm.logisticsNo = ''
    orderForm.orderNo = ''
}

// 修改提交
const submitForm = async (formEl: FormInstance | undefined) => {
  let orderParam:ISampleOrderReq = {
    sampleId: orderForm.sampleId
  }


  if (dialogFlag.value === false) {
    if (orderForm.orderNo === ''){
        $baseMessage("1688订单号不能为空！","error","hey")
        return
    }
    orderParam.order1688No = orderForm.orderNo
  }else {
    if (orderForm.logisticsNo === ''){
        $baseMessage("物流单号不能为空！","error","hey")
        return
    }
    orderParam.logisticsNo = orderForm.logisticsNo

  }

  $baseConfirm(`确定要修改${dialogFlag.value === true ?'物流单号':'1688订单号'}`,"系统提示", async ()=>{
    const {data} = await updateSampleOrder({...orderParam})
    if(data === true){
        if (orderForm.orderNo !== ''){
            $baseMessage("1688订单号修改成功！","success","hey")
            const index = sampleTableList.value.findIndex((item:ISampleTrack) => item.sampleId === parseInt(orderForm.sampleId));
            if (index !== -1) {
                sampleTableList.value[index].orderNo1688 = orderForm.orderNo;
            }
            orderDialogClose()
            return
        }

        if (orderForm.logisticsNo !== ''){
            $baseMessage("物流单号修改成功！","success","hey")
            const index = sampleTableList.value.findIndex((item:ISampleTrack) => item.sampleId === parseInt(orderForm.sampleId));
            if (index !== -1) {
                sampleTableList.value[index].logisticsNo = orderForm.logisticsNo;
            }
            orderDialogClose()
            return
        }

    }
  })

}


</script>