<template>
  <!-- 创建耗材 -->
  <vab-dialog 
    v-model="visible" 
    :before-close="handleCloseDialog" 
    class="moldDialog"
    title="创建耗材"
    width="570"
  >
    <el-divider style="margin-top: 0;"/>
    <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin-right: 10px; margin-left: 10px;" >
      <el-form-item label="耗材名" prop="componentName">
        <el-input v-model="mergedPartName" disabled />
      </el-form-item>  
      <el-form-item label="耗材种类" prop="materialType">
        <el-select v-model="form.materialType" clearable placeholder="请选择耗材种类" >
          <el-option
            v-for="item in consumableTypeOption"
            :key="item.id"
            :label="item.consumablesName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-row style="margin-bottom: 18px;">
        <el-col :span="12">
          <el-form-item label="耗材尺寸" prop="size">
            <el-input v-model="form.size" clearable placeholder="22x15x10"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="尺寸单位" prop="sizeUnit">
            <el-input v-model="form.sizeUnit" clearable placeholder="cm" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="规格/说明" prop="specification">
        <el-input v-model="form.specification" clearable placeholder="三层加硬空白"/>
      </el-form-item>
        <el-form-item label="按单采购" prop="status">
      <el-switch v-model="form.status" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66;"/>
      </el-form-item>
      <el-form-item label="零件单位" prop="unit">
        <el-input v-model="form.unit" clearable placeholder="套, 个, 只, 片等" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="suppliser">
        <el-select
          v-model="form.suppliser"
          allow-create
          clearable
          default-first-option
          filterable
          :loading="loading"
          placeholder="点击输入和搜索"
          remote
          :remote-method="remoteMethod"
          @blur="handleInput"
          @change="handleTaxDisabled"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开票" prop="invoicing">
        <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingTaxChange">
          <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="taxVisible" label="实际税点" prop="actualTaxRate">
        <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
      </el-form-item>
      <el-form-item v-show="taxVisible" label="开票税点" prop="invoicingTaxRate">
        <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleCloseDialog">退出</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { getProductAllSupplier, getProductSupplier } from '/@/api/devlocal/productInformation'

defineOptions({
  name: 'VabCreateConsumable'
})

const props = defineProps<{
  modelValue: boolean
  consumableTypes: { consumablesName: string, id: number }[]
}>()
const emit = defineEmits(['update:modelValue', 'submit'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const consumableTypeOption = computed(() => props.consumableTypes)
// 开票税点和实际税点可见
const taxVisible = ref<boolean>(true)
const handleInvoicingTaxChange = async (value: number) => {
  if (value === 2) {
    taxVisible.value = false
  } else {
    taxVisible.value = true
  }
  if(form.supplier) {
    handleTaxDisabled(form.supplier)
  }
}
const invoicingNumList = [
  {
    value: 0,
    label: '专票',
  },
  {
    value: 1,
    label: '普票',
  },
  {
    value: 2,
    label: '无法开票',
  },
]
const formRef = ref<FormInstance>()
const form = reactive<any>({
  componentName: '',
  unit: '',
  suppliser: '',
  invoicing: 0,
  actualTaxRate: '',
  invoicingTaxRate: '',
  status: 0,
  size: '',
  sizeUnit: '',
  specification: ''
})
const rules = reactive({
  materialType: [
    { required: true, message: '请选择耗材种类', trigger: 'change' },
  ],
  size: [
    { required: true, message: '请填写耗材尺寸', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  sizeUnit: [
    { required: true, message: '请填写尺寸单位', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请填写零件单位', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  specification: [
    { required: true, message: '请填写规格和说明', trigger: 'blur' },
    { validator: validateNoSpaces, trigger: 'blur' },
  ],
  suppliser: [
    { required: true, message: '请填写供应商名称', trigger: 'blur' },
  ],
  invoicing: [
    { required: true, message: '请选择开票类型', trigger: 'change' },
  ],
  actualTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (!value || value === '') && !taxDisabled) {
          callback(new Error('请填写实际税点'));
        } else {
          callback();
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  invoicingTaxRate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.invoicing !== 2 && (!value || value === '') && !taxDisabled) {
          callback(new Error('请填写开票税点'));
        } else {
          callback();
        }
        if (/\s/.test(value)) {
          callback(new Error('输入不能包含空格'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
})
function validateNoSpaces (rule: any, value: any, callback: any) {
  if (/\s/.test(value)) {
    callback(new Error('输入不能包含空格'));
  } else {
    callback();
  }
}
// 耗材名自动生成
const mergedPartName = computed(() => {
  let type = ''
  if (form.materialType) {
    const i = consumableTypeOption.value.find((item: any) => item.id === form.materialType)
    type = i?.consumablesName || ''
  }
  
  return `${type}-${form.size}${form.sizeUnit}-${form.specification}`
})
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const taxDisabled = ref<boolean>(false)
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
      suppliserName: query
    })
    // console.log(data);
    supplierList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
// 处理远程搜索不重复选择
const handleInput = (e: any) => {
  const value = e.target.value
  if (value) {
    form.supplier = e.target.value
  }
}
const handleTaxDisabled = async (value: string) => {
  if(value) {
    const { data } = await getProductSupplier({ suppliserName: value })
    
    if(data === null) {
      taxDisabled.value = false
    } else {
      const { actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate } = data
      taxDisabled.value = true
      if(form.invoicing === 0) {
        form.actualTaxRate = actualZTaxRate
        form.invoicingTaxRate = invoicingZTaxRate
      } else if(form.invoicing === 1) {
        form.actualTaxRate = actualPTaxRate
        form.invoicingTaxRate = invoicingPTaxRate
      } else {
        form.actualTaxRate = 0
        form.invoicingTaxRate = 0
      }
    }
  }
}

const handleSubmit = async () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        const newConsumable = {
          componentName: mergedPartName.value,
          unit: form.unit,
          suppliser: form.suppliser,
          invoicing: form.invoicing,
          actualTaxRate: form.actualTaxRate,
          invoicingTaxRate: form.invoicingTaxRate,
          status: form.status,
        }
        emit('submit', newConsumable)
      } catch (error) {
        console.error(error)
      }
    }
  })
}
const handleCloseDialog = () => {
  visible.value = false
}
watch(visible, (val) => {
  if (val) {
    formRef.value?.resetFields()
  }
})
</script>
