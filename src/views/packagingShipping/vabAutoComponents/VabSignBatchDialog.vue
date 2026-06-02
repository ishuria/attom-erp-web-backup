<template>
  <vab-dialog v-model="visible" title="批量签收" width="20%" @close="handleCancel">
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
      <el-form-item label="签收箱数" prop="signedBoxCount">
        <el-input v-model="form.signedBoxCount" clearable />
      </el-form-item>
      <el-form-item label="签收物流单号" prop="signOrder">
        <el-input v-model="form.signOrder" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: 'VabSignBatchDialog',
})

defineProps<{
  loading?: boolean
}>()

const visible = defineModel<boolean>({ default: false })
const emit = defineEmits<{
  (event: 'confirm', value: { signedBoxCount?: number; signOrder: string }): void
}>()

const formRef = ref<FormInstance>()
const form = reactive<{ signedBoxCount: string; signOrder: string }>({
  signedBoxCount: '1',
  signOrder: '',
})
const rules = reactive<FormRules<{ signedBoxCount: string; signOrder: string }>>({
  signedBoxCount: [{ pattern: /^[1-9]\d*$/, message: '签收箱数必须为正整数', trigger: 'blur' }],
  signOrder: [{ required: true, message: '请输入签收物流单号', trigger: 'blur' }],
})

const resetForm = () => {
  formRef.value?.resetFields()
}

const handleCancel = () => {
  resetForm()
  visible.value = false
}

const handleConfirm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  emit('confirm', {
    signedBoxCount: form.signedBoxCount ? Number(form.signedBoxCount) : undefined,
    signOrder: form.signOrder,
  })
}
</script>
