<template>
  <vab-dialog v-model="visible" center class="print-count-dialog" title="打印数量" width="420px">
    <el-form ref="printFormRef" class="print-count-form" label-position="top" :model="printForm" :rules="printFormRules">
      <el-form-item v-if="showSignedBoxCount" label="签收箱数" prop="signedBoxCount">
        <el-input-number v-model="printForm.signedBoxCount" controls-position="right" :min="1" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input-number v-model="printForm.count" controls-position="right" :min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="printLoading" type="primary" @click="handleConfirmPrint">打印</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { printSign } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'VabPrintCountDialog',
})

const props = withDefaults(
  defineProps<{
    signId: number
    showSignedBoxCount?: boolean
  }>(),
  {
    showSignedBoxCount: true,
  }
)
const visible = defineModel<boolean>({ default: false })
const printForm = reactive<{ count?: number; signedBoxCount?: number }>({
  count: 1,
  signedBoxCount: 1,
})
const printFormRef = ref<FormInstance>()
const printFormRules = computed<FormRules>(() => ({
  ...(props.showSignedBoxCount ? { signedBoxCount: [{ required: true, message: '请输入签收箱数', trigger: 'blur' }] } : {}),
  count: [{ required: true, message: '请输入打印数量', trigger: 'blur' }],
}))
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
    const printParams = {
      signId: props.signId,
      quantity: printForm.count!,
      signedBoxCount: props.showSignedBoxCount ? printForm.signedBoxCount! : null,
    }
    const { data } = await printSign(printParams)
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
      if (props.showSignedBoxCount) {
        printForm.signedBoxCount = 1
      }
      nextTick(() => {
        printFormRef.value?.clearValidate()
      })
    }
  },
  { flush: 'post' }
)
</script>

<style lang="scss" scoped>
:global(.print-count-dialog) {
  max-width: calc(100vw - 32px);
}

.print-count-form {
  margin: 0;
}

.print-count-form :deep(.el-input-number) {
  width: 100%;
}

.print-count-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
