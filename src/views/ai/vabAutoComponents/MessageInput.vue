<template>
  <div class="ai-message-input">
    <!-- 附件按钮移到输入框外部 -->
    <div class="toolbar-outer">
      <el-tooltip content="上传附件（支持粘贴 / 拖拽）" placement="top">
        <el-button circle text size="small" :disabled="disabled || totalAttachments >= 10" @click="triggerFileInput">
          <vab-icon icon="attachment-2" />
        </el-button>
      </el-tooltip>
      <el-popover
        v-model:visible="promptPopoverVisible"
        placement="top-start"
        :width="480"
        trigger="click"
        popper-class="prompt-popover"
        :show-arrow="true"
      >
        <template #reference>
          <el-button circle text size="small" :disabled="disabled" title="常用提示词">
            <vab-icon icon="lightbulb-flash-line" />
          </el-button>
        </template>
        <div class="prompt-panel">
          <div class="prompt-panel__header">
            <span class="prompt-panel__title">常用提示词</span>
            <el-button text size="small" type="primary" @click="handleAdd">
              <vab-icon icon="add-line" />
              新增
            </el-button>
          </div>
          <el-scrollbar max-height="480px">
            <ul v-if="commonPrompts.length" class="prompt-list">
              <li v-for="item in commonPrompts" :key="item.id" class="prompt-item" @click="handlePickPrompt(item)">
                <el-tooltip :content="item.prompt" placement="left" :show-after="500" :disabled="item.prompt.length < 60">
                  <div class="prompt-item__preview">{{ item.prompt }}</div>
                </el-tooltip>
                <div class="prompt-item__meta">
                  <el-tag v-if="item.category" size="small" type="info" effect="plain">{{ item.category }}</el-tag>
                </div>
                <div class="prompt-item__actions" @click.stop>
                  <el-button circle text size="small" title="编辑" @click.stop="handleEdit(item)">
                    <vab-icon icon="edit-line" />
                  </el-button>
                  <el-button circle text size="small" title="删除" @click.stop="handleDelete(item)">
                    <vab-icon icon="delete-bin-line" />
                  </el-button>
                </div>
              </li>
            </ul>
            <el-empty v-else description="暂无常用提示词，点击右上角新增" :image-size="60" />
          </el-scrollbar>
        </div>
      </el-popover>
    </div>
    <favorite-prompt-edit-dialog
      v-model:visible="editDialogVisible"
      :mode="editDialogMode"
      :item="editingItem"
      @saved="loadCommonPrompts"
    />
    <el-dialog
      v-model="feishuDialogVisible"
      title="生成飞书文档"
      width="80%"
      top="4vh"
      append-to-body
      :close-on-click-modal="false"
      @closed="handleFeishuDialogClosed"
    >
      <div class="feishu-prompt-dialog">
        <div v-if="commonPrompts.length" class="feishu-prompt-dialog__section">
          <div class="feishu-prompt-dialog__section-title">从常用提示词选择</div>
          <el-scrollbar max-height="260px">
            <ul class="feishu-prompt-list">
              <li
                v-for="item in commonPrompts"
                :key="item.id"
                class="feishu-prompt-item"
                :class="{ 'is-selected': selectedFeishuPromptId === item.id }"
                @click="handleSelectFeishuPromptInDialog(item)"
              >
                <div class="feishu-prompt-item__preview">{{ item.prompt }}</div>
                <el-tag v-if="item.category" size="small" type="info" effect="plain">{{ item.category }}</el-tag>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="feishu-prompt-dialog__section">
          <div class="feishu-prompt-dialog__section-title">文档生成要求</div>
          <div class="md-editor-container">
            <v-md-editor
              v-model="feishuPromptDraft"
              height="680px"
              placeholder="请输入文档生成要求，或从上方选择一条（支持 Markdown）"
              left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | save"
              :disabled-menus="[]"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="feishuDialogVisible = false">取消</el-button>
        <el-button
          :disabled="!feishuPromptDraft.trim() || feishuLoading"
          :loading="feishuLoading"
          type="primary"
          @click="handleConfirmFeishuDoc"
        >
          确定生成文档
        </el-button>
      </template>
    </el-dialog>
    <div class="input-shell" :class="{ 'is-disabled': disabled }">
      <div v-if="aiStore.pendingAttachments.length" class="attachment-preview-bar">
        <template v-for="file in aiStore.pendingAttachments" :key="file.id">
          <!-- 图片类型：缩略图预览 -->
          <div
            v-if="file.type.startsWith('image/')"
            class="attachment-image"
            :class="{ 'is-error': file.status === 'error' }"
            :title="`${file.name} (${formatFileSize(file.size)})`"
          >
            <el-image
              v-if="file.status === 'success' && file.url"
              class="image-thumb"
              fit="cover"
              :initial-index="imagePreviewIndex(file.id)"
              :preview-src-list="imagePreviewList"
              preview-teleported
              :src="file.url"
            />
            <div v-else class="image-placeholder">
              <vab-icon icon="image-line" />
              <span v-if="file.status === 'uploading'" class="chip-progress">{{ file.progress ?? 0 }}%</span>
            </div>
            <button type="button" class="chip-remove" @click="removeAttachment(file.id)">
              <vab-icon icon="close-line" />
            </button>
          </div>
          <!-- 非图片类型：文件标签 -->
          <div v-else class="attachment-chip" :title="`${file.name} (${formatFileSize(file.size)})`">
            <vab-icon :icon="getFileIcon(file.type)" class="chip-icon" />
            <span class="chip-name">{{ file.name }}</span>
            <span v-if="file.status === 'uploading'" class="chip-progress">{{ file.progress ?? 0 }}%</span>
            <button
              v-if="file.status !== 'uploading'"
              type="button"
              class="chip-remove"
              :class="{ 'is-error': file.status === 'error' }"
              @click="removeAttachment(file.id)"
            >
              <vab-icon icon="close-line" />
            </button>
          </div>
        </template>
      </div>
      <div class="input-row">
        <el-input
          v-model="draft"
          type="textarea"
          :autosize="autosizeConfig"
          resize="none"
          :maxlength="3000"
          :disabled="disabled"
          :placeholder="placeholder || '输入消息，Shift+Enter 换行，Enter 发送'"
          @keydown.enter.exact.prevent="handleSend"
          @paste="handlePaste"
        />
      </div>
      <input ref="fileInputRef" type="file" class="hidden-file-input" :accept="allAcceptTypes" multiple @change="handleFileSelect" />
      <div class="actions">
        <div class="meta">
          <span class="hint">Shift+Enter 换行</span>
          <span :class="['count', charCountClass]">剩余 {{ remaining }} 字</span>
        </div>
        <div class="action-buttons">
          <el-button class="feishu-btn" :disabled="disabled || feishuLoading" :loading="feishuLoading" @click="handleOpenFeishuDialog">
            生成飞书文档
          </el-button>
          <el-button
            v-if="aiStore.isStreaming"
            class="stop-btn"
            type="danger"
            circle
            title="停止生成"
            @click="aiStore.cancelStream"
          >
            <vab-icon icon="stop-fill" />
          </el-button>
          <el-button
            v-else
            class="send-btn"
            type="primary"
            circle
            :disabled="disabled || (!draft.trim() && !aiStore.pendingAttachments.length)"
            @click="handleSend"
          >
            <vab-icon icon="send-plane-fill" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import { ElMessageBox } from 'element-plus'
import { $baseMessage } from '/@/hooks'
import { deleteAiFiles, uploadAiFiles } from '/@/api/devlocal/ai'
import { deleteFavoritePrompt, listFavoritePrompts } from '/@/api/devlocal/favoritePrompt'
import { useAiStore } from '/@/store/modules/ai'
import type { ChatAttachment } from '/@/type/ai/chat'
import type { FavoritePromptItem } from '/@/type/ai/favoritePrompt'
import FavoritePromptEditDialog from '/@/views/ai/vabAutoComponents/FavoritePromptEditDialog.vue'

VMdEditor.use(githubTheme)

const emit = defineEmits<{
  send: [value: string]
  createFeishuDoc: [prompt: string]
}>()

defineOptions({
  name: 'MessageInput',
})

const props = defineProps<{
  disabled?: boolean
  fullscreen?: boolean
  placeholder?: string
  feishuLoading?: boolean
}>()

const aiStore = useAiStore()
const draft = ref('')
const fileInputRef = ref<HTMLInputElement>()

const promptPopoverVisible = ref(false)
const commonPrompts = ref<FavoritePromptItem[]>([])
const editDialogVisible = ref(false)
const editDialogMode = ref<'add' | 'edit'>('add')
const editingItem = ref<FavoritePromptItem | null>(null)

const loadCommonPrompts = async () => {
  try {
    const res: any = await listFavoritePrompts()
    commonPrompts.value = res?.data ?? []
  } catch {
    commonPrompts.value = []
  }
}

const handlePickPrompt = (item: FavoritePromptItem) => {
  if (props.disabled) return
  draft.value = draft.value ? `${draft.value}\n${item.prompt}` : item.prompt
  promptPopoverVisible.value = false
  nextTick(() => {
    const el = document.querySelector<HTMLTextAreaElement>('.ai-message-input .el-textarea__inner')
    el?.focus()
    if (el) el.selectionStart = el.selectionEnd = draft.value.length
  })
}

const handleAdd = () => {
  promptPopoverVisible.value = false
  editDialogMode.value = 'add'
  editingItem.value = null
  editDialogVisible.value = true
}

const handleEdit = (item: FavoritePromptItem) => {
  promptPopoverVisible.value = false
  editDialogMode.value = 'edit'
  editingItem.value = item
  editDialogVisible.value = true
}

const handleDelete = async (item: FavoritePromptItem) => {
  promptPopoverVisible.value = false
  try {
    await ElMessageBox.confirm('确认删除该常用提示词？', '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    await deleteFavoritePrompt(item.id)
    $baseMessage('删除成功', 'success', 'hey')
    await loadCommonPrompts()
  } catch {
    $baseMessage('删除失败，请稍后重试', 'error', 'hey')
  }
}

onMounted(() => {
  void loadCommonPrompts()
})

const autosizeConfig = computed(() => ({
  minRows: 1,
  maxRows: props.fullscreen ? 12 : 8,
}))

const remaining = computed(() => 3000 - draft.value.length)

const charCountClass = computed(() => {
  const left = remaining.value
  if (left < 50) return 'is-danger'
  if (left < 200) return 'is-warning'
  return ''
})

const totalAttachments = computed(() => aiStore.pendingAttachments.length)

const imagePreviewList = computed(() =>
  aiStore.pendingAttachments.filter((a) => a.type.startsWith('image/') && a.status === 'success' && a.url).map((a) => a.url!)
)

const imagePreviewIndex = (id: string) => {
  const image = aiStore.pendingAttachments.find((a) => a.id === id)
  return image ? imagePreviewList.value.indexOf(image.url!) : 0
}

const allAcceptTypes = '.pdf,.docx,.txt,.md,.xlsx,.csv,.zip,.jpg,.jpeg,.png,.webp,.gif'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt', '.md', '.xlsx', '.csv', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.zip'])

const getFileExtension = (name: string) => {
  const idx = name.lastIndexOf('.')
  return idx === -1 ? '' : name.slice(idx).toLowerCase()
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image-line'
  if (mimeType.includes('pdf')) return 'file-pdf-line'
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'file-excel-2-line'
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'file-zip-line'
  return 'file-text-line'
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const MIME_EXT_MAP: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

// 粘贴的截图等可能没有文件名或扩展名，用 MIME 兜底重命名
const normalizeFile = (file: File): File => {
  if (file.name && getFileExtension(file.name)) return file
  const ext = MIME_EXT_MAP[file.type] || ''
  const baseName = file.type.startsWith('image/') ? 'pasted-image' : 'pasted-file'
  return new File([file], `${baseName}-${Date.now()}${ext}`, { type: file.type })
}

const processFiles = async (rawFiles: File[]) => {
  if (props.disabled || !rawFiles.length) return

  const files = rawFiles.map(normalizeFile)
  const validFiles: File[] = []

  for (const file of files) {
    if (aiStore.pendingAttachments.length + validFiles.length >= 10) {
      $baseMessage('最多上传 10 个附件', 'warning', 'hey')
      break
    }

    const ext = getFileExtension(file.name)
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      $baseMessage(`不支持的文件格式: ${ext || file.type || '未知'}`, 'error', 'hey')
      continue
    }

    if (file.size > MAX_FILE_SIZE) {
      $baseMessage(`${file.name} 超出 20MB 限制`, 'error', 'hey')
      continue
    }

    if (
      file.type.startsWith('image/') &&
      aiStore.pendingAttachments.filter((a) => a.type.startsWith('image/')).length +
        validFiles.filter((f) => f.type.startsWith('image/')).length >=
        4
    ) {
      $baseMessage('最多同时发送 4 张图片', 'warning', 'hey')
      continue
    }

    validFiles.push(file)
  }

  if (!validFiles.length) return

  // 先添加 uploading 状态的附件占位
  const attachments: ChatAttachment[] = validFiles.map((file) => ({
    id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    status: 'uploading' as const,
    progress: 0,
  }))
  attachments.forEach((att) => aiStore.addPendingAttachment(att))

  try {
    const response = await uploadAiFiles(validFiles)
    const urls: string[] = response?.data ?? response ?? []

    // 按顺序回填 URL，标记为成功
    attachments.forEach((att, i) => {
      aiStore.updatePendingAttachment(att.id, {
        status: 'success',
        progress: 100,
        url: urls[i],
      })
    })
  } catch {
    // 上传失败，标记所有附件为 error
    attachments.forEach((att) => {
      aiStore.updatePendingAttachment(att.id, {
        status: 'error',
        progress: 0,
      })
    })
    $baseMessage('文件上传失败，请重试', 'error', 'hey')
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const files = Array.from(input.files)
  input.value = ''
  void processFiles(files)
}

const handlePaste = (event: ClipboardEvent) => {
  if (props.disabled) return
  const files = Array.from(event.clipboardData?.files ?? [])
  if (!files.length) return
  // 仅当剪贴板带文件时拦截，普通文本粘贴行为不变
  event.preventDefault()
  void processFiles(files)
}

const removeAttachment = async (id: string) => {
  const attachment = aiStore.pendingAttachments.find((a) => a.id === id)
  if (attachment?.url) {
    try {
      await deleteAiFiles([attachment.url])
    } catch {
      // 服务端删除失败不阻断本地移除
    }
  }
  aiStore.removePendingAttachment(id)
}

const handleSend = () => {
  if (props.disabled) return
  const value = draft.value.trim()
  if (!value && !aiStore.pendingAttachments.length) return
  // 仅上传图片不输入文字时，默认补一句"请分析图片中的内容"作为 content：
  // 1) 聊天气泡显示该文字 + 图片，避免空白气泡
  // 2) LangFlow ChatInput 拿到非空 input_value，避开 chatbot flow required=true 限制
  // 3) AI 直接得到明确指令而不是空 prompt
  emit('send', value || '请分析图片中的内容')
  draft.value = ''
}

const feishuDialogVisible = ref(false)
const feishuPromptDraft = ref('')
const selectedFeishuPromptId = ref<number | null>(null)

const handleOpenFeishuDialog = () => {
  if (props.disabled || props.feishuLoading) return
  feishuPromptDraft.value = ''
  selectedFeishuPromptId.value = null
  feishuDialogVisible.value = true
}

const handleSelectFeishuPromptInDialog = (item: FavoritePromptItem) => {
  selectedFeishuPromptId.value = item.id
  feishuPromptDraft.value = item.prompt
}

const handleConfirmFeishuDoc = () => {
  const value = feishuPromptDraft.value.trim()
  if (!value || props.disabled || props.feishuLoading) return
  feishuDialogVisible.value = false
  emit('createFeishuDoc', value)
}

const handleFeishuDialogClosed = () => {
  feishuPromptDraft.value = ''
  selectedFeishuPromptId.value = null
}

defineExpose({ processFiles, handleOpenFeishuDialog })
</script>

<style lang="scss" scoped>
.ai-message-input {
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);

  .toolbar-outer {
    display: flex;
    gap: 2px;
    align-items: center;
    margin-bottom: 6px;
    padding-left: 4px;
  }

  .input-shell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px 7px;
    background: linear-gradient(180deg, rgb(255 255 255 / 0.98), rgb(247 249 252 / 0.98)), var(--el-bg-color);
    border: 1px solid rgb(15 23 42 / 0.08);
    border-radius: 24px;
    box-shadow:
      0 10px 30px rgb(15 23 42 / 0.05),
      inset 0 1px 0 rgb(255 255 255 / 0.9);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;

    &:focus-within {
      border-color: rgb(62 139 255 / 0.35);
      box-shadow:
        0 16px 38px rgb(62 139 255 / 0.1),
        0 0 0 4px rgb(62 139 255 / 0.08);
    }

    &.is-disabled {
      opacity: 0.72;
      box-shadow: none;
    }
  }

  .attachment-preview-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .attachment-chip {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    max-width: 200px;
    padding: 4px 8px;
    font-size: 12px;
    color: var(--el-text-color-regular);
    background: var(--el-fill-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;

    .chip-icon {
      flex-shrink: 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .chip-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chip-progress {
      flex-shrink: 0;
      font-size: 11px;
      color: var(--el-color-primary);
    }

    .chip-remove {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      margin-left: 2px;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 50%;

      &:hover {
        color: var(--el-color-danger);
        background: var(--el-color-danger-light-9);
      }
    }
  }

  .attachment-image {
    position: relative;
    width: 64px;
    height: 64px;
    overflow: hidden;
    background: var(--el-fill-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;

    &.is-error {
      border-color: var(--el-color-danger-light-5);
    }

    .image-thumb {
      width: 100%;
      height: 100%;
    }

    .image-placeholder {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 20px;
      color: var(--el-text-color-placeholder);
    }

    .chip-remove {
      position: absolute;
      top: 2px;
      right: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      background: rgb(0 0 0 / 0.45);
      border: 0;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s;

      &:hover {
        background: rgb(0 0 0 / 0.7);
      }
    }

    &:hover .chip-remove {
      opacity: 1;
    }
  }

  .hidden-file-input {
    display: none;
  }

  .input-row {
    display: flex;
    align-items: flex-end;
  }

  :deep(.el-textarea) {
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
  }

  :deep(.el-textarea__inner) {
    padding: 0;
    min-height: 24px !important;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-primary);
    background: transparent;
    border: 0;
    box-shadow: none;

    &::placeholder {
      color: var(--el-text-color-placeholder);
    }
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    min-height: 30px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
  }

  .feishu-btn {
    border-radius: 10px;
  }

  .send-btn {
    width: 58px;
    height: 38px;
    background: linear-gradient(135deg, #3e8bff 0%, #6366f1 100%);
    border: none;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgb(62 139 255 / 0.32);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #5c9dff 0%, #7c7ff6 100%);
      box-shadow: 0 6px 20px rgb(62 139 255 / 0.48);
      transform: scale(1.1);
    }

    &:active:not(:disabled) {
      transform: scale(0.94);
      box-shadow: 0 1px 4px rgb(62 139 255 / 0.25);
    }

    &:disabled {
      background: var(--el-fill-color-darker);
      box-shadow: none;
    }

    .vab-icon {
      font-size: 18px;
      color: #fff;
      transition: transform 0.3s ease;
    }

    &:hover:not(:disabled) .vab-icon {
      transform: translateX(1px) translateY(-1px);
    }
  }

  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }

  .hint,
  .count {
    font-size: 11px;
    line-height: 1;
    color: var(--el-text-color-secondary);
  }

  .count {
    color: var(--el-text-color-placeholder);

    &.is-warning {
      color: var(--el-color-warning);
    }

    &.is-danger {
      color: var(--el-color-danger);
    }
  }
}
</style>

<style lang="scss">
.prompt-popover.el-popper {
  padding: 8px;

  .prompt-panel {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px 8px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &__title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .prompt-list {
    padding: 4px 0;
    margin: 0;
    list-style: none;
  }

  .prompt-item {
    position: relative;
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.15s ease;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &__preview {
      display: -webkit-box;
      padding-right: 56px;
      overflow: hidden;
      font-size: 13px;
      line-height: 1.5;
      color: var(--el-text-color-primary);
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__meta {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-top: 4px;
      min-height: 18px;
    }

    &__actions {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 2;
      display: flex;
      gap: 0;
      align-items: center;
      opacity: 0.55;
      transition: opacity 0.15s ease;
      pointer-events: auto;
    }

    &:hover &__actions {
      opacity: 1;
    }
  }
}

.feishu-prompt-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__section-title {
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .md-editor-container {
    width: 100%;
  }

  .md-editor-container .v-md-editor {
    width: 100%;
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    box-shadow: none;
  }

  .md-editor-container .v-md-editor--fullscreen {
    z-index: 9999;
    border-radius: 0;
  }

  .md-editor-container .v-md-editor__toolbar {
    border-bottom: 1px solid var(--el-border-color);
  }

  .md-editor-container .v-md-editor__editor-wrapper {
    border-right: 1px solid var(--el-border-color);
  }
}

.feishu-prompt-list {
  padding: 4px;
  margin: 0;
  list-style: none;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.feishu-prompt-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  & + & {
    margin-top: 2px;
  }

  &:hover {
    background: var(--el-fill-color-light);
  }

  &.is-selected {
    background: var(--el-color-primary-light-9);
    outline: 1px solid var(--el-color-primary-light-5);
  }

  &__preview {
    flex: 1;
    display: -webkit-box;
    overflow: hidden;
    font-size: 13px;
    line-height: 1.5;
    color: var(--el-text-color-primary);
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
