<template>
  <el-dialog
    v-model="visible"
    :before-close="handleClose"
    class="feedback-dialog"
    :close-on-click-modal="false"
    title="打包意见反馈"
    width="60%"
    @opened="handleDialogOpened"
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
    <div v-if="visible" class="wang-editor-container" style="margin-top: 16px">
      <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor
        v-model="html"
        class="wang-editor-content"
        :default-config="editorConfig"
        mode="default"
        @on-created="handleCreated"
      />
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="handleSubmit">提交反馈</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
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

const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref('')
const submitLoading = ref(false)
// 已有反馈记录的 id，有则覆盖写，无则新建
const existingFeedbackId = ref<number | null>(null)

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock'],
}

const editorConfig = reactive<any>({
  placeholder: '请输入打包反馈内容...',
  readOnly: false,
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024,
      async customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        try {
          const { uploadEditorImage } = await import('/@/api/devlocal/progress')
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await uploadEditorImage(formData)
          let imageUrl = ''
          if (data?.url) {
            imageUrl = data.url
          } else if (typeof data === 'string') {
            imageUrl = data
          } else {
            throw new Error('上传失败：无法获取图片地址')
          }
          insertFn(imageUrl, file.name, imageUrl)
          $baseMessage('图片上传成功!', 'success', 'hey')
        } catch (error: any) {
          $baseMessage(error?.message || '图片上传失败，请重试', 'error', 'hey')
        }
      },
    },
  },
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor)
}

const handleDialogOpened = async () => {
  await nextTick()
  existingFeedbackId.value = null
  if (props.currentRow?.id) {
    try {
      const { data } = await getPackageFeedbackByTaskId({ taskId: props.currentRow.id })
      if (data?.id) {
        existingFeedbackId.value = data.id
        html.value = data.feedbackContent || ''
        if (editorRef.value) {
          editorRef.value.setHtml(html.value)
        }
      }
    } catch (e) {
      // 暂无反馈记录，从空白开始
    }
  }
  editorRef.value?.focus()
}

const handleSubmit = async () => {
  if (!editorRef.value) return
  const content = editorRef.value.getHtml()
  const text = editorRef.value.getText().trim()
  if (!text && !content.includes('<img')) {
    $baseMessage('请输入反馈内容', 'warning', 'hey')
    return
  }
  submitLoading.value = true
  try {
    let success = false
    if (existingFeedbackId.value) {
      // 已有记录 → 覆盖写（编辑器中已含完整内容）
      const { data } = await updatePackageFeedbackContent({
        id: existingFeedbackId.value,
        feedbackContent: content,
      })
      success = !!data
    } else {
      // 首次提交 → 新建记录
      const { data } = await addPackageFeedback({
        taskId: props.currentRow.id,
        feedbackContent: content,
      })
      success = !!data
    }
    if (success) {
      $baseMessage('反馈提交成功', 'success', 'hey')
      emit('submitted')
      handleClose()
    }
  } finally {
    submitLoading.value = false
  }
}

const handleClose = () => {
  html.value = ''
  existingFeedbackId.value = null
  visible.value = false
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) editor.destroy()
})
</script>

<style lang="scss" scoped>
.feedback-info {
  margin-bottom: 12px;
}

.wang-editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  .wang-editor-content {
    height: 300px;
    overflow-y: auto;
  }
}
</style>
