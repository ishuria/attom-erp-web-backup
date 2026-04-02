<template>
  <vab-dialog v-model="visible" title="提交审批" width="25%" @close="handleClose">
    <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin: 0 60px">
      <el-form-item label="SKU">
        <el-text>{{ row?.sku }}</el-text>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-text>{{ row?.taskType }}</el-text>
      </el-form-item>
      <el-form-item label="文件路径" prop="filePath">
        <el-input v-model="form.filePath" clearable placeholder="请输入文件路径" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 60px">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="success" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { type FormInstance, type FormRules } from 'element-plus'
import { submitApprovalArtDesignTask } from '/@/api/devlocal/imageTask'
import type { IGetArtDesignTaskList } from '/@/type/listingTask/imageTaskType'

defineOptions({
  name: 'SubmitApproval',
})

const props = defineProps<{
  row: IGetArtDesignTaskList | null
}>()

const emit = defineEmits<{
  confirm: []
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const formRef = ref<FormInstance>()
const form = reactive<{ filePath: string }>({
  filePath: '',
})
const rules = reactive<FormRules<{ filePath: string }>>({
  filePath: [{ required: true, message: '请输入文件路径', trigger: 'blur' }],
})

const handleClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const handleConfirm = async () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await submitApprovalArtDesignTask({
        id: props.row!.id!,
        filePath: form.filePath,
      })
      if (data) {
        $baseMessage('提交审批成功！', 'success')
        handleClose()
        emit('confirm')
      }
    }
  })
}
</script>
