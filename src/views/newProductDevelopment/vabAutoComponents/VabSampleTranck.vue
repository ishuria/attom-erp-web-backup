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
        >
            <el-table-column 
                v-for="(item, index) in sampleTranckTableCloums" 
                :key="index" align="center" 
                :label="item.label"
                :prop="item.prop" :min-width="item.minWidth || 100" width="auto"

            >
                <template #default="{row}">
                    <div v-if="item.prop === 'componentImg'">
                        <el-image style="width: 100px; height: 100px" :src="row.componentImg" fit="fill" />
                    </div>

                    <div v-if="item.prop === 'createTime'">
                        <span>{{ formatDate(new Date(row.createTime)) }}</span>
                    </div>

                    <div v-if="item.prop === 'receiptDate'">
                        <span v-if="row.receiptDate">{{ formatDate(new Date(row.receiptDate)) }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="140">
                <template #default="scope">
                    <el-button text type="primary" @click="manualReceipt(scope.row)">手动签收</el-button>
                    <el-button text type="primary" @click="orderNo1688Update(scope.row)">1688订单号修改</el-button>
                    <el-button text type="primary" @click="logisticsNoUpdate(scope.row)">物流订单修改</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>

    <el-dialog 
        :model-value="orderVisible"
        width="400"
        title="单号修改"
        :close-on-click-modal="false"
    >
        <el-form 
            ref="formRef"
            :model="orderForm" 
            :rules="rules"
            label-width="auto" 
            style="max-width: 300px"
            
        >
            <el-form-item label="1688单号" prop="orderNo1688">
                <el-input :model-value="orderForm.orderNo"/>
            </el-form-item>

            
            <el-form-item label="物流单号" prop="logisticsNo">
                <el-input :model-value="orderForm.logisticsNo"/>
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

import {ISampleTrack} from '/@/type/progress/sampleAndComponentType'
import {sampleTranckTableCloums} from '../productProgressComponent'
import { getSampleList } from '/@/api/devlocal/progressSample'
import { formatDate } from '/@/utils/dateUtils'
import {getSpecificChildren} from '/@/utils/nodeUtils'
import { FormInstance, FormRules } from 'element-plus'
defineComponent({
    name:"VabSampleTranck"
})

const sampleTableList = ref<ISampleTrack[]>([])
const sampleVisible = ref<boolean>(false)
const orderVisible = ref<boolean>(false)
const progressId = ref<string>()
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
    orderNo:'',
    logisticsNo:'',
})


const rules = reactive<FormRules>({
 orderNo1688: [
    { 
        required: true, 
        message: '1688订单号',
         trigger: 'blur' 
    },
  ],
  logisticsNo: [
    {
      required: true,
      message: '物流单号',
      trigger: 'blur',
    },
  ],
})

const fetachData = async()=>{
  const { data } = await getSampleList({progressId:props.progressId})
  sampleTableList.value = data
}

watchEffect(()=>{
    fetachData()
    sampleVisible.value = props.visible
    progressId.value = props.progressId
    
})

// 拿样table单击事件
const sampleTableInputChage = (row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    if (getSpecificChildren(cell, "img")[0]){
        emit("update:priviewListValue",row.componentImg)
    }
}

// 手动签收
const manualReceipt = (row:ISampleTrack) =>{
    
}

// 1688单号修改
const orderNo1688Update = (row:ISampleTrack) =>{
    orderVisible.value = true
}

// 物流单号修改
const logisticsNoUpdate = (row:ISampleTrack) =>{
    orderVisible.value = true
}

const orderDialogClose = () =>{
    orderVisible.value = false
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>