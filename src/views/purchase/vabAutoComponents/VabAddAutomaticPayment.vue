<template>
  <vab-dialog v-model="dialogVisible" title="添加自动付款" width="20%">
    <el-form ref="formRef" class="form-center" label-position="top" label-width="auto" :model="form" :rules="rules">
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" clearable />
      </el-form-item>
      <el-form-item label="付款比例" prop="percent">
        <el-input v-model="form.percent" clearable>
          <template #append>%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="props.loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: 'VabAddAutomaticPayment',
})

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  confirm: [data: { path: string; percent: string }]
}>()

const dialogVisible = defineModel<boolean>({ default: false })

const formRef = ref<FormInstance>()

const form = reactive<{
  path: string | null
  percent: string | null
}>({
  path: null,
  percent: null,
})

const rules = reactive<FormRules>({
  path: [{ required: true, message: '请输入路径！', trigger: 'blur' }],
  percent: [{ required: true, message: '请输入付款比例！', trigger: 'blur' }],
})

const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((isValid: boolean) => {
    if (isValid) {
      emit('confirm', {
        path: form.path!,
        percent: form.percent!,
      })
    }
  })
}

// const resetForm = () => {
//   formRef.value?.resetFields()
//   form.path = null
//   form.percent = null
// }

// watch(dialogVisible, (visible) => {
//   if (!visible) {
//     resetForm()
//   }
// })
</script>

<style lang="scss" scoped>
.form-center {
  margin: 0;
}
</style>
