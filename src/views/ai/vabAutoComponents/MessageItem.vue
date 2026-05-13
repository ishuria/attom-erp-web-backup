<template>
  <!-- system 消息独立渲染为 info banner -->
  <div v-if="message.role === 'system'" class="system-banner">
    <div class="system-banner-icon">
      <vab-icon icon="lightbulb-line" />
    </div>
    <div class="system-banner-content" v-html="htmlContent" />
  </div>

  <!-- user / assistant 消息 -->
  <div v-else :class="['ai-message-item', `is-${message.role}`]">
    <div :class="['avatar', { 'is-logo-avatar': showLogoAvatar }]">
      <img v-if="showLogoAvatar" alt="网站图标" :src="yunzhouLogo" />
      <span v-else>{{ avatarText }}</span>
    </div>
    <div class="content-wrap">
      <div class="meta">
        <span class="name">{{ roleText }}</span>
        <span v-if="message.createdAt && message.status !== 'loading'" class="time">{{ message.createdAt }}</span>
      </div>
      <!-- 附件渲染区（图片） -->
      <div v-if="imageAttachments.length" class="attachment-images">
        <div v-for="(img, idx) in imageAttachments" :key="img.id" class="attachment-image-item" @click="openImagePreview(idx)">
          <img :src="img.url || img.name" :alt="img.name" />
        </div>
    </div>
      <!-- 附件渲染区（文档） -->
      <div v-if="docAttachments.length" class="attachment-docs">
        <div v-for="doc in docAttachments" :key="doc.id" class="attachment-doc-card">
          <vab-icon :icon="getFileIcon(doc.type)" class="doc-icon" />
          <div class="doc-info">
            <span class="doc-name">{{ doc.name }}</span>
            <span class="doc-meta">{{ formatFileSize(doc.size) }}</span>
          </div>
          <el-button text size="small" @click="handleViewDoc(doc)">查看</el-button>
        </div>
      </div>
      <!-- 思考过程：仅 assistant 消息展示。流式中默认展开实时累加；历史消息默认折叠，点击 lazy 加载 -->
      <div v-if="message.role === 'assistant' && showProgressSection" class="progress-section">
        <button type="button" class="progress-toggle" :disabled="!progressTogglable" @click="toggleProgress">
          <vab-icon :icon="progressExpanded ? 'arrow-down-s-line' : 'arrow-right-s-line'" />
          <span>{{ progressExpanded ? '收起思考过程' : '查看思考过程' }}</span>
          <span v-if="progressSteps.length > 0" class="progress-count">（{{ progressSteps.length }} 步）</span>
        </button>
        <message-progress-panel v-if="progressExpanded" :steps="progressSteps" :loading="progressLoading" />
      </div>
      <div :class="['bubble', `is-${message.status || 'success'}`, `is-role-${message.role}`]">
        <template v-if="message.role === 'user'">
          <div class="plain">{{ message.content }}</div>
        </template>
        <template v-else>
          <typing-indicator v-if="message.status === 'loading' && !message.content" />
          <div v-else ref="markdownBodyRef" class="markdown-body" @click="handleMarkdownAction" v-html="htmlContent" />
          <span v-if="message.role === 'assistant' && message.status === 'loading' && message.content" class="streaming-cursor">▌</span>
        </template>
        <!-- 发送失败重试按钮 -->
        <button v-if="message.status === 'error' && message.role === 'assistant'" type="button" class="retry-btn" @click="handleRetry">
          <vab-icon icon="error-warning-line" />
        </button>
      </div>
    </div>
    <el-image-viewer
      v-if="showViewer"
      hide-on-click-modal
      :initial-index="viewerIndex"
      :url-list="viewerList"
      @close="showViewer = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { $baseMessage } from '/@/hooks'
import { useAiStore } from '/@/store/modules/ai'
import yunzhouLogo from '/@/icon/yunzhou.svg'
import type { AiStreamStepEvent, ChatAttachment, ChatMessage } from '/@/type/ai/chat'
import { renderAiMarkdown } from '/@/utils/aiMarkdown'
import { enhanceStickyTableScrollbars } from '/@/views/ai/vabAutoComponents/composables/useStickyTableScrollbar'
import MessageProgressPanel from '/@/views/ai/vabAutoComponents/MessageProgressPanel.vue'
import TypingIndicator from '/@/views/ai/vabAutoComponents/TypingIndicator.vue'

const props = defineProps<{
  message: ChatMessage
  /** 当前会话 id，用于 lazy 拉取 progress 历史。父组件需透传。 */
  conversationId?: number | string
}>()

defineOptions({
  name: 'MessageItem',
})

const aiStore = useAiStore()

const avatarText = computed(() => {
  if (props.message.role === 'user') return '我'
  return 'AI'
})

const showLogoAvatar = computed(() => props.message.role !== 'user')

const roleText = computed(() => {
  if (props.message.role === 'user') return '我'
  return 'AI 助手'
})

const htmlContent = computed(() => renderAiMarkdown(props.message.content))

const markdownBodyRef = ref<HTMLElement>()
let stickyTableCleanup: (() => void) | null = null

watch(
  htmlContent,
  () => {
    nextTick(() => {
      stickyTableCleanup?.()
      stickyTableCleanup = null
      if (markdownBodyRef.value) {
        stickyTableCleanup = enhanceStickyTableScrollbars(markdownBodyRef.value)
      }
    })
  },
  { immediate: true, flush: 'post' }
)

onBeforeUnmount(() => {
  stickyTableCleanup?.()
  stickyTableCleanup = null
})

const attachments = computed(() => props.message.attachments ?? [])
const imageAttachments = computed(() => attachments.value.filter((a) => a.type.startsWith('image/')))
const docAttachments = computed(() => attachments.value.filter((a) => !a.type.startsWith('image/')))

// === 思考过程（思考链步骤）展示 ===
// 流式中：实时显示 store.liveSteps（不依赖 requestId）
// 历史：lazy 拉取 store.fetchMessageFlowTrace（依赖 message.requestId）
const isCurrentlyStreaming = computed(
  () => props.message.role === 'assistant' && props.message.status === 'loading',
)
// 历史消息是否有思考过程：后端 hasProgress 字段；为 undefined 时（兼容旧后端）回退按 requestId 判断
const hasHistoricalProgress = computed(() => {
  if (typeof props.message.hasProgress === 'boolean') return props.message.hasProgress
  return !!props.message.requestId
})
// 折叠按钮显示条件：assistant 且（流式中 或 历史有思考过程）
const showProgressSection = computed(
  () => props.message.role === 'assistant' && (isCurrentlyStreaming.value || hasHistoricalProgress.value),
)
// 按钮是否可点（流式中始终可点；历史需要有 requestId 且 hasProgress）
const progressTogglable = computed(
  () => isCurrentlyStreaming.value || (!!props.message.requestId && hasHistoricalProgress.value),
)

const progressExpanded = ref(false)
const historySteps = ref<AiStreamStepEvent[]>([])
const progressLoading = ref(false)

const progressSteps = computed<AiStreamStepEvent[]>(() =>
  isCurrentlyStreaming.value ? aiStore.activeLiveSteps : historySteps.value,
)

const toggleProgress = async () => {
  if (!progressTogglable.value) return
  progressExpanded.value = !progressExpanded.value
  if (
    progressExpanded.value &&
    !isCurrentlyStreaming.value &&
    historySteps.value.length === 0 &&
    props.message.requestId &&
    props.conversationId != null
  ) {
    progressLoading.value = true
    try {
      historySteps.value = await aiStore.fetchMessageFlowTrace(props.conversationId, props.message.requestId)
    } finally {
      progressLoading.value = false
    }
  }
}

// 流式开始 → 立即展开；流式结束 → 自动折叠（让用户主动点开历史回放，避免占屏）。
// 必须 immediate=true：组件挂载时 isCurrentlyStreaming 已经是 true（store 在挂载前已置 status='loading'），
// 默认 watch 不立即触发会导致面板看起来一直折叠。
watch(
  isCurrentlyStreaming,
  (now, prev) => {
    if (now) progressExpanded.value = true
    if (!now && prev) progressExpanded.value = false
  },
  { immediate: true },
)

const showViewer = ref(false)
const viewerList = ref<string[]>([])
const viewerIndex = ref(0)

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

const openImagePreview = (index: number) => {
  viewerList.value = imageAttachments.value.map((a) => a.url || a.name)
  viewerIndex.value = index
  showViewer.value = true
}

const handleViewDoc = (doc: ChatAttachment) => {
  if (doc.url) {
    window.open(doc.url, '_blank')
  } else {
    $baseMessage('文件预览暂不可用', 'info', 'hey')
  }
}

const handleRetry = () => {
  if (props.message.id) {
    aiStore.retryMessage(props.message.id)
  }
}

const fallbackCopyText = async (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const copyCodeText = async (text: string) => {
  if (!text.trim()) return

  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
    else await fallbackCopyText(text)
    $baseMessage('代码已复制', 'success', 'hey')
  } catch {
    $baseMessage('代码复制失败', 'error', 'hey')
  }
}

const toFullSizeUrl = (url: string) => {
  if (url.startsWith('https://m.media-amazon.com/images')) {
    return url.replace(/\._[A-Za-z0-9_]+(?=\.[^.]+$)/, '')
  }
  return url
}

const handleMarkdownAction = async (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  if (!target) return

  if (target.tagName === 'IMG') {
    const src = (target as HTMLImageElement).src
    if (src) {
      const container = event.currentTarget as HTMLElement
      const allImgs = Array.from(container.querySelectorAll('img'))
      const urls = allImgs.map((img) => img.src).filter(Boolean).map(toFullSizeUrl)
      viewerList.value = urls
      viewerIndex.value = Math.max(urls.indexOf(toFullSizeUrl(src)), 0)
      showViewer.value = true
    }
    return
  }

  if (!target.closest('.markdown-code-copy')) return

  const codeElement = target.closest('.markdown-code-block')?.querySelector('code')
  const codeText = codeElement?.textContent ?? ''
  await copyCodeText(codeText)
}
</script>

<style lang="scss" scoped>
.progress-section {
  margin-top: 6px;
}

.progress-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: #909399;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    color: #606266;
    background: #f5f7fa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.progress-count {
  margin-left: 2px;
  font-variant-numeric: tabular-nums;
}

.system-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  padding: 10px 14px;
  border-left: 3px solid var(--el-color-primary-light-3);
  background: var(--el-color-primary-light-9);
  border-radius: 0 8px 8px 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--el-text-color-regular);

  .system-banner-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 14px;
    color: var(--el-color-primary);
  }

  .system-banner-content {
    min-width: 0;

    :deep(p) {
      margin: 0;
    }
  }
}

.streaming-cursor {
  display: inline;
  font-weight: 400;
  color: var(--el-text-color-primary);
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.ai-message-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;

  &.is-user {
    flex-direction: row-reverse;

    .content-wrap {
      align-items: flex-end;
    }

    .meta {
      justify-content: flex-end;
    }
  }

  .avatar {
    display: flex;
    flex: 0 0 38px;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    font-size: 16px;
    font-weight: 700;
    color: var(--el-color-white);
    background: linear-gradient(135deg, var(--el-color-primary), #3e8bff);
    border-radius: 50%;
    box-shadow: 0 8px 18px rgb(62 139 255 / 0.18);

    &.is-logo-avatar {
      box-shadow: none;
      background: linear-gradient(135deg, rgb(255 255 255 / 0.85), rgb(244 247 255 / 0.95));
      border: 1px solid rgb(93 122 255 / 0.12);
    }

    img {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
  }

  .content-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .meta {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }

  .name {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  // 图片附件：每张独占一行，便于跟父级 align-items 一起完成左/右对齐
  .attachment-images {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: min(82%, 400px);
  }

  .attachment-image-item {
    width: 200px;
    overflow: hidden;
    cursor: zoom-in;
    border-radius: 10px;

    img {
      width: 100%;
      height: 100%;
      max-height: 180px;
      object-fit: cover;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  // 文档附件卡片
  .attachment-docs {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: min(82%, 360px);
  }

  .attachment-doc-card {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;

    .doc-icon {
      flex-shrink: 0;
      font-size: 22px;
      color: var(--el-color-primary);
    }

    .doc-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .doc-name {
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .doc-meta {
      font-size: 11px;
      color: var(--el-text-color-placeholder);
    }
  }

  .bubble {
    position: relative;
    max-width: min(82%, 1200px);
    padding: 16px 18px;
    overflow-wrap: break-word;
    word-break: break-word;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 20px;
    font-size: 16px;
    transition:
      box-shadow 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;

    &.is-role-assistant {
      max-width: min(94%, 1600px);
      background:
        linear-gradient(180deg, rgb(255 255 255 / 0.98), rgb(247 249 255 / 0.98)),
        var(--el-bg-color);
      border-color: rgb(93 122 255 / 0.12);
      box-shadow:
        0 14px 30px rgb(15 23 42 / 0.06),
        inset 0 1px 0 rgb(255 255 255 / 0.8);
    }

    &.is-role-user {
      max-width: min(72%, 720px);
      padding: 10px 14px;
      background: var(--el-color-primary);
      border-color: transparent;
      border-radius: 18px 18px 6px 18px;
      box-shadow: 0 2px 8px rgb(62 139 255 / 0.18);
      font-size: 15px;
    }

    &.is-error {
      color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
      border-color: var(--el-color-danger-light-5);
      box-shadow: none;
    }
  }

  .plain {
    font-size: 15px;
    line-height: 1.55;
    color: var(--el-color-white);
    white-space: pre-wrap;
  }

  // 重试按钮
  .retry-btn {
    position: absolute;
    right: 8px;
    bottom: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 14px;
    color: var(--el-color-danger);
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 50%;

    &:hover {
      background: var(--el-color-danger-light-9);
    }
  }

  .markdown-body {
    font-size: 16px;
    line-height: 1.6;
    color: var(--el-text-color-primary);

    :deep(> :first-child) {
      margin-top: 0;
    }

    :deep(> :last-child) {
      margin-bottom: 0;
    }

    :deep(p) {
      margin: 0 0 8px;
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }

    // 数字标题加粗+主色
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin: 14px 0 6px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.02em;
      color: var(--el-color-primary);
    }

    :deep(h1) {
      font-size: 24px;
    }

    :deep(h2) {
      font-size: 22px;
    }

    :deep(h3) {
      font-size: 20px;
    }

    :deep(h4) {
      font-size: 18px;
    }

    :deep(strong) {
      font-weight: 700;
      color: var(--el-text-color-primary);
    }

    // 描述文字使用 secondary 颜色
    :deep(li) {
      color: var(--el-text-color-secondary);
    }

    :deep(a) {
      color: var(--el-color-primary);
      text-decoration: underline;
      text-decoration-color: color-mix(in srgb, var(--el-color-primary) 35%, transparent);
      text-underline-offset: 3px;

      &:hover {
        text-decoration-color: currentColor;
      }
    }

    :deep(img) {
      display: block;
      max-width: 70%;
      height: auto;
      margin: 0 auto;
      cursor: zoom-in;
      border-radius: 8px;
    }

    :deep(blockquote) {
      padding: 8px 12px 8px 14px;
      margin: 10px 0;
      color: var(--el-text-color-secondary);
      background: linear-gradient(90deg, rgb(73 118 255 / 0.08), rgb(73 118 255 / 0.02));
      border: 1px solid rgb(73 118 255 / 0.1);
      border-left: 2.5px solid var(--el-border-color-darker);
      border-radius: 12px;
    }

    :deep(hr) {
      margin: 12px 0;
      border: 0;
      border-top: 1px solid var(--el-border-color-lighter);
    }

    :deep(.markdown-code-block) {
      margin: 10px 0;
      overflow: hidden;
      background: #161b26;
      border: 1px solid rgb(255 255 255 / 0.06);
      border-radius: 12px;
      box-shadow: 0 2px 6px rgb(15 23 42 / 0.08);
    }

    :deep(.markdown-code-header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px;
      background: rgb(255 255 255 / 0.04);
      border-bottom: 1px solid rgb(255 255 255 / 0.08);
    }

    :deep(.markdown-code-lang) {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: rgb(232 237 247 / 0.78);
      text-transform: uppercase;
    }

    :deep(.markdown-code-copy) {
      padding: 4px 10px;
      font-size: 13px;
      color: #f4f7fb;
      cursor: pointer;
      background: rgb(255 255 255 / 0.08);
      border: 1px solid rgb(255 255 255 / 0.08);
      border-radius: 999px;
      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;

      &:hover {
        background: rgb(255 255 255 / 0.14);
        border-color: rgb(255 255 255 / 0.16);
        transform: translateY(-1px);
      }
    }

    :deep(pre) {
      padding: 12px 14px;
      margin: 0;
      overflow: auto;
      color: #e8edf7;
      background: transparent;
      font-size: 14px;
      line-height: 1.6;
    }

    :deep(code) {
      font-family: 'SFMono-Regular', Monaco, Consolas, monospace;
    }

    :deep(:not(pre) > code) {
      padding: 2px 7px;
      font-size: 0.92em;
      color: var(--el-text-color-primary);
      background: var(--el-fill-color);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 6px;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 20px;
      margin: 6px 0;
    }

    :deep(li ul),
    :deep(li ol) {
      margin: -2px 0;
    }

    :deep(li + li) {
      margin-top: 2px;
    }

    :deep(.markdown-table-outer) {
      position: relative;
      margin: 10px 0;
    }

    :deep(.markdown-table-wrap) {
      position: relative;
      overflow-x: auto;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 12px;
    }

    :deep(.markdown-table-sticky-scrollbar) {
      position: sticky;
      bottom: 0;
      z-index: 2;
      height: 12px;
      margin-top: -12px;
      overflow-x: auto;
      overflow-y: hidden;

      &.is-hidden {
        display: none;
      }

      &::-webkit-scrollbar {
        height: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--el-border-color);
        border-radius: 6px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--el-border-color-darker);
      }
    }

    :deep(.markdown-table-sticky-spacer) {
      height: 1px;
    }

    :deep(table) {
      width: max-content;
      min-width: 100%;
      border-collapse: collapse;
      font-size: 16px;
      line-height: 1.5;
    }

    :deep(thead tr) {
      background: linear-gradient(180deg, rgb(93 122 255 / 0.12), rgb(93 122 255 / 0.05));
    }

    :deep(th) {
      max-width: 240px;
      padding: 6px 10px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      text-align: left;
      vertical-align: top;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(td) {
      max-width: 240px;
      padding: 6px 10px;
      font-weight: 400;
      text-align: left;
      vertical-align: top;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(th + th),
    :deep(td + td) {
      border-left: 1px solid var(--el-border-color-lighter);
    }

    :deep(td:first-child) {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    :deep(tbody tr:nth-child(even)) {
      background: color-mix(in srgb, var(--el-fill-color-light) 55%, transparent);
    }

    :deep(tbody tr:hover) {
      background: rgb(93 122 255 / 0.06);
    }

    :deep(tbody tr:last-child td) {
      border-bottom: 0;
    }

    :deep(td img),
    :deep(th img) {
      width: auto;
      height: auto;
      max-width: 200px;
      max-height: 120px;
      cursor: zoom-in;
      object-fit: contain;
    }
  }
}

@media screen and (max-width: 768px) {
  .ai-message-item {
    gap: 10px;

    .avatar {
      flex-basis: 34px;
      width: 34px;
      height: 34px;
    }

    .bubble {
      max-width: 100%;
      padding: 13px 14px;
    }

    .attachment-images {
      max-width: 100%;
    }

    .attachment-docs {
      max-width: 100%;
    }

    .markdown-body {
      font-size: 15px;

      :deep(table) {
        min-width: 420px;
      }
    }
  }
}
</style>
