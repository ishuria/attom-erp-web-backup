<template>

    <el-dialog
        title="拿样"
        v-model="sampleVisible"
        width="25%"
        :before-close="props.closeDialog"
    >

        <el-form 
            ref="sampleFormRef"
            :model="sampleForm" 
            :rules="rules"
            label-width="auto" 
            style="max-width: 600px"
            
        >
            <el-form-item label="零件名" prop="componentId">
                <el-select 
                    v-model="sampleForm.componentId" 
                    placeholder="请选择拿样零件或输入拿样零件"
                    filterable
                    clearable
                    allow-create
                    :reserve-keyword = "false"
                >
                    <el-option label="Zone one" value="shanghai" />
                </el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="suppliser">
                
                <el-select 
                    v-model="sampleForm.suppliser" 
                    placeholder="请选择供应商或输入供应商"
                    filterable
                    clearable
                    allow-create
                    :reserve-keyword = "false"
                >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
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
                <el-button @click="props.closeDialog">取消</el-button>
                <el-button type="primary" @click="submitForm(sampleFormRef)">确认</el-button>
            </span>
        </template>
    </el-dialog>
    
    
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';


defineComponent({
    name:"VabSample"
})

const props = defineProps<{
    visible:boolean
    progressId:string
    closeDialog: (done: any) => void
}>();

const sampleFormRef = ref<FormInstance>()

interface AddSampleForm {

  progressId: string
  componentId: string
  suppliser: string
  orderNo1688: string
  logisticsNo: string
  price: string
  bulkGoodsReturnable:string
  remark: string

}

const sampleVisible = ref<boolean>(false)
const progressId = ref<string>()

// 拿样form
const sampleForm = reactive<AddSampleForm>({
  progressId: props.progressId,
  componentId:'',
  suppliser:'',
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
  componentId: [
    {
      required: true,
      message: '零件不能为空！',
      trigger: 'change',
    },
  ],
  suppliser: [
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
})


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

watchEffect(()=>{
    sampleVisible.value = props.visible
    progressId.value = props.progressId
    
})

</script>