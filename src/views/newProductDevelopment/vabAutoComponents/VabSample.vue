<template>

    <el-dialog
        title="拿样"
        v-model="sampleVisible"
        width="25%"
        :before-close="childCloseDialog"
    >

        <el-form 
            ref="sampleFormRef"
            :model="sampleForm" 
            :rules="rules"
            label-width="auto" 
            style="max-width: 600px"
            
        >
            <el-form-item label="零件名" prop="componentInfo">
                <el-select 
                    v-model="sampleForm.componentInfo!" 
                    value-key="id"
                    placeholder="请选择拿样零件或输入拿样零件"
                    filterable
                    clearable
                    allow-create
                    :reserve-keyword = "false"
                    @change="componentSelectChange"
                    
                >
                    <el-option v-for="val,idx in componentList" :label="val.label!" :value="val" :key="val.id!"/>
                </el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="suppliserInfo">
                
                <el-select 
                    v-model="sampleForm.suppliserInfo!" 
                    value-key="id"
                    placeholder="请选择供应商或输入供应商"
                    filterable
                    clearable
                    allow-create
                    :reserve-keyword = "false"
                    :disabled="suppliserFlag"
                >
                    <el-option v-for="val,idx in supplisertList" :label="val.label!" :value="val" :key="val.id!"/>
                </el-select>

            </el-form-item>

            <el-form-item label="1688单号" prop="orderNo1688">
                <el-input type="input" v-model="sampleForm.orderNo1688" />
            </el-form-item>

            <el-form-item label="物流单号" prop="logisticsNo">
                <el-input type="input" v-model="sampleForm.logisticsNo" />
            </el-form-item>

            <el-form-item label="拿样金额" prop="price">
                <el-input type="input" v-model="sampleForm.price" />
            </el-form-item>

            <el-form-item label="下大货可退拿样金额" prop="bulkGoodsReturnable">
                <el-input type="input" v-model="sampleForm.bulkGoodsReturnable" />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="sampleForm.remark" />
            </el-form-item>

        </el-form>

        <template #footer>
            <span>
                <el-button @click="childCloseDialog">取消</el-button>
                <el-button type="primary" @click="submitForm(sampleFormRef)">确认</el-button>
            </span>
        </template>
    </el-dialog>
    
    
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';
import {getComponentInfoList,getSuppliserInfoList,addSample} from '/@/api/devlocal/progressSample'
import {ISampleAddReq, ISampleItem,} from '/@/type/progress/sampleAndComponentType'

defineComponent({
    name:"VabSample"
})

const props = defineProps<{
    visible:boolean
    progressId:string
    closeDialog: () => void
    refreshComponent: () => void
}>();

const sampleFormRef = ref<FormInstance>()
const componentList = ref<ISampleItem[]>([])
const supplisertList = ref<ISampleItem[]>([])
const suppliserFlag = ref<boolean>(true)


interface AddSampleForm {
  progressId: string
  componentInfo?:ISampleItem | null
  suppliserInfo?: ISampleItem | null
  orderNo1688: string
  logisticsNo: string
  price: string
  bulkGoodsReturnable:string
  remark: string

}
const sampleVisible = ref<boolean>(false)
const progressId = ref<string>()

// 拿样form
let sampleForm = reactive<AddSampleForm>({
  progressId: props.progressId,
  componentInfo:null,
  suppliserInfo:null,
  orderNo1688:'',
  logisticsNo:'',
  price:'',
  bulkGoodsReturnable:'',
  remark:''
})

const rules = reactive<FormRules<AddSampleForm>>({
  progressId: [
    { 
        required: true, 
        message: '进度id不能为空！',
         trigger: 'change' 
    },
  ],
  componentInfo: [
    {
      required: true,
      message: '零件名不能为空！',
      trigger: 'change',
    },
  ],
  suppliserInfo: [
    {
      required: true,
      message: '供应商不能为空!',
      trigger: 'change',
    },
  ],
  price: [
    {
      required: true,
      message: '拿样金额不能为空！',
      trigger: 'blur',
    },
  ],
  orderNo1688: [
    {
      validator: (rule, value, callback) => {
        if (!value && !sampleForm.logisticsNo) {
          callback(new Error('1688和物流单号至少要填一个！'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  logisticsNo: [
    {
      validator: (rule, value, callback) => {
        if (!value && !sampleForm.orderNo1688) {
          callback(new Error('1688和物流单号至少要填一个！'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  bulkGoodsReturnable: [
  {
      required: true,
      message: '下大货可退拿样金额不能为空！',
      trigger: 'blur',
    },
  ]
})


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
        console.log(sampleForm);
        let params:ISampleAddReq = {
            progressId: sampleForm.progressId,
            orderNo1688: sampleForm.orderNo1688,
            logisticsNo: sampleForm.logisticsNo,
            price: sampleForm.price,
            bulkGoodsReturnable: sampleForm.bulkGoodsReturnable,
            remark:sampleForm.remark
        }

        // 处理零件
        if (sampleForm && typeof sampleForm.componentInfo ==='object'){
            params.componentId = sampleForm.componentInfo?.id!
            params.componentName = sampleForm.componentInfo?.label!
        }else{
            params.componentId = -1
            params.componentName = sampleForm.componentInfo as string
        }

        // 处理供应商
        if (sampleForm && typeof sampleForm.suppliserInfo ==='object'){
            params.suppliserId = sampleForm.suppliserInfo?.id!
            params.supplierName = sampleForm.suppliserInfo?.label!
        }else{
            params.suppliserId = -1
            params.supplierName = sampleForm.suppliserInfo as string
        }
        
       const {data} = await addSample({...params})
       if (data === true){
            $baseMessage("新增拿样零件成功","success","hey")
            childCloseDialog()
            if(params.componentId === -1 || params.suppliserId === -1){
                props.refreshComponent()
            }
       }

    } else {
      console.log('error submit!', fields)
    }
  })
}

watchEffect(()=>{
    sampleVisible.value = props.visible
    progressId.value = props.progressId
    if(sampleVisible.value === true) fetchData()
})

// 零件名selct切换
const componentSelectChange = async (value: ISampleItem) =>{
    suppliserFlag.value = false
    
    if (value && typeof value === 'object'){
        const {data} = await getSuppliserInfoList({componentId:value.id!})
        supplisertList.value = data
    }
}

const childCloseDialog = async () =>{
    sampleFormRef.value!.resetFields()
    props.closeDialog()
}
const fetchData = async () => {
    const {data} = await getComponentInfoList({progressId:parseInt(props.progressId)})
    componentList.value = data
}


</script>