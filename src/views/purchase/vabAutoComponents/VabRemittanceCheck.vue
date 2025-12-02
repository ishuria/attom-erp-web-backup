<template>
  <vab-dialog v-model="dialogVisible" title="汇款校验" width="20%">
    <el-form ref="formRef" class="form-center" label-position="top" label-width="auto" :model="form" :rules="rules">
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { purchaseRemittanceCheck } from '/@/api/devlocal/purchasePo'

defineOptions({
  name: 'VabRemittanceCheck',
})

const dialogVisible = defineModel<boolean>({ default: false })
const loading = ref<boolean>(false)
const formRef = ref<FormInstance>()
const form = reactive<{
  path?: string
}>({
  path: undefined,
})

const rules = reactive<FormRules>({
  path: [{ required: true, message: '请输入路径！', trigger: 'blur' }],
})

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate(async (isValid: boolean) => {
      if (isValid) {
        loading.value = true
        const { data } = await purchaseRemittanceCheck({
          path: form.path!,
        })

        if (data) {
          $baseMessage('汇款校对成功！', 'success')
        }
        dialogVisible.value = false
        loading.value = false
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
}

watch(dialogVisible, (visible) => {
  if (!visible) {
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
.form-center {
  margin: 0;
}
</style>
