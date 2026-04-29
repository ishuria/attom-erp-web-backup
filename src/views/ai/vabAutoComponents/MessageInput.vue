<template>
  <div class="ai-message-input">
    <!-- 附件按钮移到输入框外部 -->
    <div class="toolbar-outer">
      <el-tooltip content="上传附件" placement="top">
        <el-button circle text size="small" :disabled="disabled || totalAttachments >= 10" @click="triggerFileInput">
          <vab-icon icon="attachment-2" />
        </el-button>
      </el-tooltip>
    </div>
    <div class="input-shell" :class="{ 'is-disabled': disabled }">
      <div v-if="aiStore.pendingAttachments.length" class="attachment-preview-bar">
        <template v-for="file in aiStore.pendingAttachments" :key="file.id">
          <!-- 图片类型：缩略图预览 -->
          <div v-if="file.type.startsWith('image/')" class="attachment-image" :class="{ 'is-error': file.status === 'error' }" :title="`${file.name} (${formatFileSize(file.size)})`">
            <el-image
              v-if="file.status === 'success' && file.url"
              :src="file.url"
              :preview-src-list="imagePreviewList"
              :initial-index="imagePreviewIndex(file.id)"
              fit="cover"
              preview-teleported
              class="image-thumb"
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
            <button v-if="file.status !== 'uploading'" type="button" class="chip-remove" :class="{ 'is-error': file.status === 'error' }" @click="removeAttachment(file.id)">
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
        />
      </div>
      <input ref="fileInputRef" type="file" class="hidden-file-input" :accept="allAcceptTypes" multiple @change="handleFileSelect" />
      <div class="actions">
        <div class="meta">
          <span class="hint">Shift+Enter 换行</span>
          <span :class="['count', charCountClass]">剩余 {{ remaining }} 字</span>
        </div>
        <div class="action-buttons">
          <el-button class="feishu-btn" :disabled="disabled || feishuLoading" :loading="feishuLoading" @click="handleCreateFeishuDoc">生成飞书文档</el-button>
          <el-button class="send-btn" type="primary" circle :disabled="disabled || (!draft.trim() && !aiStore.pendingAttachments.length)" @click="handleSend">
            <vab-icon icon="send-plane-fill" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $baseMessage } from '/@/hooks'
import { deleteAiFiles, uploadAiFiles } from '/@/api/devlocal/ai'
import { useAiStore } from '/@/store/modules/ai'
import type { ChatAttachment } from '/@/type/ai/chat'

const emit = defineEmits<{
  send: [value: string]
  createFeishuDoc: []
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

const imagePreviewList = computed(() => aiStore.pendingAttachments.filter((a) => a.type.startsWith('image/') && a.status === 'success' && a.url).map((a) => a.url!))

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

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const files = Array.from(input.files)
  input.value = ''

  const validFiles: File[] = []

  for (const file of files) {
    if (aiStore.pendingAttachments.length + validFiles.length >= 10) {
      $baseMessage('最多上传 10 个附件', 'warning', 'hey')
      break
    }

    const ext = getFileExtension(file.name)
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      $baseMessage(`不支持的文件格式: ${ext}`, 'error', 'hey')
      continue
    }

    if (file.size > MAX_FILE_SIZE) {
      $baseMessage(`${file.name} 超出 20MB 限制`, 'error', 'hey')
      continue
    }

    if (file.type.startsWith('image/') && aiStore.pendingAttachments.filter((a) => a.type.startsWith('image/')).length >= 4) {
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
  emit('send', value || '(附件)')
  draft.value = ''
}

const handleCreateFeishuDoc = () => {
  if (props.disabled) return
  emit('createFeishuDoc')
}
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
    background:
      linear-gradient(180deg, rgb(255 255 255 / 0.98), rgb(247 249 252 / 0.98)),
      var(--el-bg-color);
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
