<template>
  <div>
    <vab-dialog v-model="visible" title="备注和日志" width="20%" @opened="handleDialogOpened">
      <div class="field-label">备注</div>
      <el-input ref="remarkInputRef" v-model="remark" class="log-input" placeholder="请输入运营备注" :rows="5" type="textarea" />
      <div class="dialog-actions">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="success" @click="confirmUpdateRemark">保存</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
      <el-divider />
      <div class="field-label">日志</div>
      <!-- 格式化工具栏 -->
      <div class="format-toolbar">
        <el-button size="small" @click="applyFormat('bold')">
          <strong>B</strong>
          &nbsp;加粗
        </el-button>
        <el-button size="small" @click="applyFormat('red')">
          <span style="color: red">A</span>
          &nbsp;标红
        </el-button>
      </div>
      <!-- 富文本编辑区 -->
      <div ref="editorRef" class="rich-editor" contenteditable="true" data-placeholder="请输入操作日志" @paste="handlePaste"></div>

      <!-- 按钮区 -->
      <div class="dialog-actions">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="confirmUpdateOperationLog">确定</el-button>
      </div>

      <!-- 历史标题 -->
      <div class="history-title">日志历史</div>

      <!-- 历史表格 -->
      <el-table border :data="list" max-height="600" stripe>
        <el-table-column label="日期" prop="date" width="160" />
        <el-table-column label="内容" prop="content">
          <template #default="{ row }">
            <div v-html="row.content"></div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus'

defineOptions({
  name: 'OperationLogDialog',
})

const props = defineProps<{
  row: any
  // 获取历史日志，返回 { list }
  fetchHistoryLogApi: (row: any) => Promise<{ list: any[] }>
  // 新增/保存日志，返回是否成功
  addLogApi: (row: any, content: string) => Promise<boolean>
  // 更新备注
  updateRemarkApi: (row: any, remark: string) => Promise<boolean>
}>()
const visible = defineModel({ default: false })
const remark = ref<string>('')
const remarkInputRef = ref<InstanceType<typeof ElInput> | null>(null)
const editorRef = ref<HTMLDivElement | null>(null)
const draftMap = ref<Record<string | number, string>>({})

const handleDialogOpened = () => {
  const textarea = remarkInputRef.value?.$el.querySelector('textarea') as HTMLTextAreaElement
  if (textarea) {
    textarea.focus()
    textarea.setSelectionRange(0, 0)
  }
  if (editorRef.value) {
    editorRef.value.innerHTML = draftMap.value[props.row.id] || ''
  }
}

const getEditorContent = () => editorRef.value?.innerHTML || ''

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

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

const confirmUpdateOperationLog = async () => {
  const ok = await props.addLogApi(props.row, getEditorContent())
  if (ok) {
    $baseMessage('操作日志新增成功！', 'success')
    visible.value = false
  }
}
const handleAdd = async () => {
  const ok = await props.addLogApi(props.row, getEditorContent())
  if (ok) {
    $baseMessage('操作日志新增成功！', 'success')
    if (editorRef.value) {
      editorRef.value.innerHTML = ''
    }
    draftMap.value[props.row.id] = ''
    fetchHistoryLog()
  }
}
const confirmUpdateRemark = async () => {
  if (!props.updateRemarkApi) return
  const ok = await props.updateRemarkApi(props.row, remark.value)
  if (ok) {
    $baseMessage('运营备注修改成功！', 'success')
    props.row.operationRemark = remark.value
  }
}
const handleConfirm = async () => {
  if (!props.updateRemarkApi) return
  const ok = await props.updateRemarkApi(props.row, remark.value)
  if (ok) {
    $baseMessage('运营备注修改成功！', 'success')
    props.row.operationRemark = remark.value
    visible.value = false
  }
}
const list = ref<any[]>([])
const fetchHistoryLog = async () => {
  const { list: historyList } = await props.fetchHistoryLogApi(props.row)
  list.value = historyList ?? []
}
watch(
  () => visible.value,
  (val) => {
    if (val) {
      remark.value = props.row.operationRemark || ''
      fetchHistoryLog()
    } else {
      draftMap.value[props.row.id] = getEditorContent()
    }
  }
)
</script>

<style lang="scss" scoped>
.field-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.log-input {
  margin-bottom: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 4px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.format-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.rich-editor {
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  font-size: 16px;
  line-height: 1.5;
  outline: none;
  margin-bottom: 12px;
  word-break: break-all;

  // 强制子元素继承统一字体大小，防止浏览器插入的内联 font-size 导致大小不一
  &,
  :deep(*) {
    font-size: inherit !important;
    line-height: inherit !important;
  }

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
