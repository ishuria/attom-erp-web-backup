<template>
  <vab-dialog v-model="visible" title="打印数量" width="20%">
    <el-form ref="printFormRef" :model="printForm" :rules="printFormRules" style="margin: 0">
      <el-form-item label="数量" prop="count">
        <el-input-number v-model="printForm.count" :min="1" style="width: 100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button :loading="printLoading" type="primary" @click="handleConfirmPrint">打印</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { printSign } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'VabPrintCountDialog',
})

const props = defineProps<{
  signId: number
}>()
const visible = defineModel<boolean>({ default: false })
const printForm = reactive<{ count?: number }>({
  count: 1,
})
const printFormRef = ref<FormInstance>()
const printFormRules = reactive<FormRules>({
  count: [{ required: true, message: '请输入打印数量', trigger: 'blur' }],
})
const printLoading = ref<boolean>(false)

const handleConfirmPrint = async () => {
  const isValid = await printFormRef.value?.validate().catch(() => false)
  if (!isValid) return

  if (!props.signId) {
    $baseMessage('缺少签收记录，请刷新后重试', 'error')
    return
  }

  try {
    printLoading.value = true
    const { data } = await printSign({
      signId: props.signId,
      quantity: printForm.count!,
    })
    if (data) {
      $baseMessage('打印成功!', 'success')
      visible.value = false
    } else {
      $baseMessage('打印失败!', 'error')
    }
  } catch {
    $baseMessage('打印失败!', 'error')
  } finally {
    printLoading.value = false
  }
}

watch(
  visible,
  (value) => {
    if (value) {
      printForm.count = 1
      nextTick(() => {
        printFormRef.value?.clearValidate()
      })
    }
  },
  { flush: 'post' }
)
</script>
