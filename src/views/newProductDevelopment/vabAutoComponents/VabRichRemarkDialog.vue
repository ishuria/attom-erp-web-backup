<template>
  <vab-dialog
    v-model="visible"
    :title="props.title"
    width="25%"
    @close="handleCloseDialog"
    @opened="handleOpened"
  >
    <!-- 格式化工具栏 -->
    <div class="format-toolbar">
      <el-button size="small" @click="applyFormat('bold')">
        <strong>B</strong>&nbsp;加粗
      </el-button>
      <el-button size="small" @click="applyFormat('red')">
        <span style="color: red">A</span>&nbsp;标红
      </el-button>
    </div>
    <!-- 富文本编辑区 -->
    <div
      ref="editorRef"
      class="rich-editor"
      contenteditable="true"
      data-placeholder="请输入内容"
    ></div>
    <template #footer>
      <el-button @click="handleCloseDialog">取消</el-button>
      <el-button type="primary" @click="handleConfirmUpdate">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabRichRemarkDialog'
})

const props = defineProps<{
  modelValue: boolean
  title: string
  remark: string
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const editorRef = ref<HTMLDivElement | null>(null)

const emit = defineEmits(['update:modelValue', 'update:remark'])

const handleOpened = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.remark || ''
    editorRef.value.focus()
  }
}

const applyFormat = (type: 'bold' | 'red') => {
  editorRef.value?.focus()
  if (type === 'bold') {
    document.execCommand('bold')
  } else {
    const currentColor = document.queryCommandValue('foreColor')
    if (currentColor === 'rgb(255, 0, 0)') {
      const wasBold = document.queryCommandState('bold')
      document.execCommand('removeFormat')
      if (wasBold) document.execCommand('bold')
    } else {
      document.execCommand('foreColor', false, 'red')
    }
  }
}

const handleCloseDialog = () => {
  visible.value = false
}
const handleConfirmUpdate = () => {
  emit('update:remark', editorRef.value?.innerHTML || '')
}
</script>

<style lang="scss" scoped>
.format-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.rich-editor {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  word-break: break-all;

  &:focus {
    border-color: var(--el-color-primary);
  }

  &:empty::before {
    content: attr(data-placeholder);
    color: var(--el-text-color-placeholder);
    pointer-events: none;
  }
}
</style>
