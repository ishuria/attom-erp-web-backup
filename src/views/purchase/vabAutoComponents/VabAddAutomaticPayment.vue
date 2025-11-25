<template>
  <vab-dialog v-model="dialogVisible" title="添加自动付款" width="20%">
    <el-form ref="formRef" class="form-center" label-position="top" label-width="auto" :model="form" :rules="rules">
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" clearable />
      </el-form-item>
      <el-form-item label="付款类型">
        <el-radio-group v-model="form.type">
          <el-radio :value="0">付全款</el-radio>
          <el-radio :value="1">付尾款</el-radio>
          <el-radio :value="2">按比例</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="showPercent" label="付款比例" prop="percent">
        <el-input v-model="form.percent" clearable>
          <template #append>%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { purchaseAddAutoPay } from '/@/api/devlocal/purchasePo'

defineOptions({
  name: 'VabAddAutomaticPayment',
})

// interface Props {
//   loading?: boolean
// }

// const props = withDefaults(defineProps<Props>(), {
//   loading: false,
// })

const dialogVisible = defineModel<boolean>({ default: false })

const loading = ref<boolean>(false)

const formRef = ref<FormInstance>()

const form = reactive<{
  path: string | null
  percent: string | null
  type: number
}>({
  path: null,
  percent: null,
  type: 2,
})

const showPercent = computed(() => {
  return form.type === 2
})

const rules = reactive<FormRules>({
  path: [{ required: true, message: '请输入路径！', trigger: 'blur' }],
  percent: [
    {
      validator: (_rule, value, callback) => {
        // 只有当选择"按比例"时，付款比例才是必填的
        if (form.type === 2) {
          if (!value || value.trim() === '') {
            callback(new Error('请输入付款比例！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate(async (isValid: boolean) => {
      if (isValid) {
        loading.value = true
        const { data } = await purchaseAddAutoPay({
          path: form?.path!,
          payProportion: Number(form?.percent!),
          balancePayment: form?.type!,
        })

        if (data === true) {
          $baseMessage('采购合同文件处理成功！', 'success')
        } else {
          $baseMessage('采购合同文件处理失败！请联系IT', 'error')
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
