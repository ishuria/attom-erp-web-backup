<template>
  <vab-dialog v-model="dialogVisible" title="修改FNSKU" width="500px" @close="handleClose">
    <el-form ref="formRef" label-position="top" :model="form" :rules="formRules">
      <el-form-item label="北美FNSKU" prop="northAmericaFnSku">
        <el-input v-model="form.northAmericaFnSku" clearable placeholder="请输入北美FNSKU" />
      </el-form-item>
      <el-form-item label="欧洲FNSKU" prop="europeFnSku">
        <el-input v-model="form.europeFnSku" clearable placeholder="请输入欧洲FNSKU" />
      </el-form-item>
      <el-form-item label="日本FNSKU" prop="jpFnSku">
        <el-input v-model="form.jpFnSku" clearable placeholder="请输入日本FNSKU" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="saveLoading" type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { updateSkuFnSku } from '/@/api/devlocal/productInformation'
import { $baseMessage } from '/@/hooks'

defineOptions({
  name: 'FnSkuDialog',
})

const props = defineProps<{
  modelValue: boolean
  rowData?: {
    sku?: string
    northAmericaFnSku?: string
    europeFnSku?: string
    jpFnSku?: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const dialogVisible = ref<boolean>(false)
const saveLoading = ref<boolean>(false)
const formRef = ref<FormInstance>()
const form = reactive<{
  sku?: string
  northAmericaFnSku?: string
  europeFnSku?: string
  jpFnSku?: string
}>({
  sku: '',
  northAmericaFnSku: '',
  europeFnSku: '',
  jpFnSku: '',
})
const formRules = reactive<any>({})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val && props.rowData) {
      form.sku = props.rowData.sku || ''
      form.northAmericaFnSku = props.rowData.northAmericaFnSku || ''
      form.europeFnSku = props.rowData.europeFnSku || ''
      form.jpFnSku = props.rowData.jpFnSku || ''
    }
  },
  { immediate: true }
)

// 监听 dialogVisible 变化，同步到 modelValue
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
  form.sku = ''
  form.northAmericaFnSku = ''
  form.europeFnSku = ''
  form.jpFnSku = ''
}

const handleConfirm = async () => {
  if (!form.sku) return
  try {
    saveLoading.value = true
    const { data } = await updateSkuFnSku({
      sku: form.sku,
      northAmericaFnSku: form.northAmericaFnSku,
      europeFnSku: form.europeFnSku,
      jpFnSku: form.jpFnSku,
    })
    if (data) {
      $baseMessage('修改成功！', 'success')
      handleClose()
      emit('success')
    }
  } catch (error) {
    console.error('修改FNSKU失败:', error)
  } finally {
    saveLoading.value = false
  }
}
</script>
