<template>
  <package-editor-dialog
    v-model="visible"
    :initial-html="editorHtml"
    :loading="submitLoading"
    placeholder="请输入打包反馈内容..."
    title="打包意见反馈"
    @save="handleSubmit"
  >
    <div class="feedback-info">
      <el-descriptions border :column="2">
        <el-descriptions-item label="PO">{{ currentRow?.po }}</el-descriptions-item>
        <el-descriptions-item label="SKU">{{ currentRow?.sku }}</el-descriptions-item>
        <el-descriptions-item label="品名">{{ currentRow?.desc || currentRow?.productName }}</el-descriptions-item>
        <el-descriptions-item label="产品图片">
          <el-image v-if="currentRow?.skuImageUrl" fit="fill" :src="currentRow?.skuImageUrl" style="width: 60px; height: 60px" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </package-editor-dialog>
</template>

<script lang="ts" setup>
import { addPackageFeedback, getPackageFeedbackByTaskId, updatePackageFeedbackContent } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'VabPackageFeedbackDialog',
})

const props = defineProps<{
  modelValue: boolean
  currentRow: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submitted: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const editorHtml = ref('')
const submitLoading = ref(false)
const existingFeedbackId = ref<number | null>(null)

// 弹窗打开时加载已有反馈
watch(visible, async (val) => {
  if (!val) return
  existingFeedbackId.value = null
  editorHtml.value = ''
  if (props.currentRow?.id) {
    try {
      const { data } = await getPackageFeedbackByTaskId({ taskId: props.currentRow.id })
      if (data?.id) {
        existingFeedbackId.value = data.id
        editorHtml.value = data.feedbackContent || ''
      }
    } catch {
      // 暂无反馈记录，从空白开始
    }
  }
})

const handleSubmit = async (content: string, text: string) => {
  if (!text.trim() && !content.includes('<img')) {
    $baseMessage('请输入反馈内容', 'warning', 'hey')
    return
  }
  submitLoading.value = true
  try {
    let success = false
    if (existingFeedbackId.value) {
      const { data } = await updatePackageFeedbackContent({
        id: existingFeedbackId.value,
        feedbackContent: content,
      })
      success = !!data
    } else {
      const { data } = await addPackageFeedback({
        taskId: props.currentRow.id,
        feedbackContent: content,
      })
      success = !!data
    }
    if (success) {
      $baseMessage('反馈提交成功', 'success', 'hey')
      emit('submitted')
      editorHtml.value = ''
      existingFeedbackId.value = null
      visible.value = false
    }
  } finally {
    submitLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.feedback-info {
  margin-bottom: 12px;
}
</style>
