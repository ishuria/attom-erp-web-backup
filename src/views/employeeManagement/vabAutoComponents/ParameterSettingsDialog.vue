<template>
  <div>
    <vab-dialog v-model="visible" title="参数设定" width="16%">
      <el-form ref="parameterSettingsFormRef" :model="parameterSettingsForm" :rules="parameterSettingsRules" style="margin-left: 0; margin-right: 0; margin-bottom: 20px;" >
        <el-form-item label="最大超额完成数" prop="count">
          <el-input v-model="parameterSettingsForm.count" clearable />
        </el-form-item>
      </el-form>
      <el-table border>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="最低每月考核数" prop="number" />
      </el-table>
      <template #footer>
        <el-button type="primary" @click="updateParameterSettings">修改</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import { getMaximumOverfulfillment, updateMaximumOverfulfillment } from '/@/api/devlocal/performanceStatistics'

defineOptions({
  name: 'ParameterSettingsDialog',
})
const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
watch(() => props.modelValue, async (val) => {
  if (val) {
    await fetchData()
  }
})
const parameterSettingsForm = reactive<any>({
  count: undefined,
})
const parameterSettingsFormRef = ref<FormInstance>()
const parameterSettingsRules = reactive<any>({
  count: [{ required: true, message: '请输入最大超额完成数', trigger: 'blur' }],
})
const fetchData = async () => {
  const { data } = await getMaximumOverfulfillment()
  parameterSettingsForm.count = data
}
const updateParameterSettings = async () => {
  parameterSettingsFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateMaximumOverfulfillment({
        number: parameterSettingsForm.count,
      })
      if (data) {
        $baseMessage("修改成功！", 'success')
      }
    }
  })
}
</script>