<template>
  <vab-dialog 
    v-model="visible" 
    :before-close="handlerCloseDialog" 
    class="moldDialog"
    title="收货仓库"
    width="600"
  >
    <el-divider style="margin-top: 0;"/>
    <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="rules" style="width: 70%; margin: 0 auto;">
      <el-form-item label="仓库名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="仓库性质" prop="characteristic">
        <el-select v-model="form.characteristic" placeholder="请选择仓库性质" style="min-width: 100%;" >
            <el-option v-for="item in warehouseOption" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库状态" prop="status">
      <el-select v-model="form.status" placeholder="请选择仓库状态" style="min-width: 100%;">
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      </el-form-item>
      <el-form-item label="仓库地址" prop="address">
        <el-input v-model="form.address" clearable />
      </el-form-item>
      <el-form-item label="联系人" prop="associates">
        <el-input v-model="form.associates" clearable />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" clearable type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handlerCloseDialog">退出</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

defineOptions({
  name: 'VabAddRepository'
})

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const formRef = ref<FormInstance>()
const form = reactive<any>({})
  const rules = reactive<any>({
  name: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' },
  ],
  characteristic: [
    { required: true, message: '请选择仓库性质', trigger: 'change' },
  ],
  status: [
    { required: true, message: '请选择仓库状态', trigger: 'change' },
  ],
  associates: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
  ],
})
const handlerCloseDialog = () => {
  visible.value = false
}

const handleSubmit = async () => {
  await formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('submit', { ...form })
      visible.value = false
      formRef.value?.resetFields()
    }
  })
}

watch(visible, (val) => {
  if (val) {
    formRef.value?.resetFields()
  }
})
</script>