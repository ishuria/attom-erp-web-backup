<template>
  <div :class="['ai-message-item', `is-${message.role}`]">
    <div :class="['avatar', { 'is-logo-avatar': showLogoAvatar }]">
      <img v-if="showLogoAvatar" alt="网站图标" :src="yunzhouLogo" />
      <span v-else>{{ avatarText }}</span>
    </div>
    <div class="content-wrap">
      <div class="meta">
        <span class="name">{{ roleText }}</span>
        <span v-if="message.createdAt" class="time">{{ message.createdAt }}</span>
      </div>
      <div :class="['bubble', `is-${message.status || 'success'}`, `is-role-${message.role}`]">
        <template v-if="message.role === 'user'">
          <div class="plain">{{ message.content }}</div>
        </template>
        <template v-else>
          <typing-indicator v-if="message.status === 'loading' && !message.content" />
          <div v-else class="markdown-body" v-html="htmlContent" @click="handleMarkdownAction" />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $baseMessage } from '/@/hooks'
import yunzhouLogo from '/@/icon/yunzhou.svg'
import type { ChatMessage } from '/@/type/ai/chat'
import { renderAiMarkdown } from '/@/utils/aiMarkdown'
import TypingIndicator from '/@/views/ai/vabAutoComponents/TypingIndicator.vue'

const props = defineProps<{
  message: ChatMessage
}>()

defineOptions({
  name: 'MessageItem',
})

const avatarText = computed(() => {
  if (props.message.role === 'user') return '我'
  if (props.message.role === 'system') return '系'
  return 'AI'
})

const showLogoAvatar = computed(() => props.message.role !== 'user')

const roleText = computed(() => {
  if (props.message.role === 'user') return '我'
  if (props.message.role === 'system') return '系统'
  return 'AI 助手'
})

const htmlContent = computed(() => renderAiMarkdown(props.message.content))

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

const handleMarkdownAction = async (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  if (!target?.closest('.markdown-code-copy')) return

  const codeElement = target.closest('.markdown-code-block')?.querySelector('code')
  const codeText = codeElement?.textContent ?? ''
  await copyCodeText(codeText)
}
</script>

<style lang="scss" scoped>
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
    font-size: 13px;
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
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .name {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .bubble {
    max-width: min(82%, 920px);
    padding: 16px 18px;
    overflow-wrap: anywhere;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 20px;
    font-size: 16px;
    transition:
      box-shadow 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;

    &.is-role-assistant,
    &.is-role-system {
      background:
        linear-gradient(180deg, rgb(255 255 255 / 0.98), rgb(247 249 255 / 0.98)),
        var(--el-bg-color);
      border-color: rgb(93 122 255 / 0.12);
      box-shadow:
        0 14px 30px rgb(15 23 42 / 0.06),
        inset 0 1px 0 rgb(255 255 255 / 0.8);
    }

    &.is-role-user {
      background: linear-gradient(135deg, var(--el-color-primary), #3e8bff);
      border-color: transparent;
      box-shadow: 0 14px 28px rgb(62 139 255 / 0.18);
    }

    &.is-error {
      color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
      border-color: var(--el-color-danger-light-5);
      box-shadow: none;
    }
  }

  .plain {
    font-size: 16px;
    line-height: 1.85;
    color: var(--el-color-white);
    white-space: pre-wrap;
  }

  .markdown-body {
    font-size: 16px;
    line-height: 1.85;
    color: var(--el-text-color-primary);

    :deep(> :first-child) {
      margin-top: 0;
    }

    :deep(> :last-child) {
      margin-bottom: 0;
    }

    :deep(p) {
      margin: 0 0 12px;
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin: 24px 0 12px;
      line-height: 1.4;
      letter-spacing: -0.02em;
      color: var(--el-text-color-primary);
    }

    :deep(h1) {
      font-size: 26px;
    }

    :deep(h2) {
      font-size: 22px;
    }

    :deep(h3) {
      font-size: 19px;
    }

    :deep(h4) {
      font-size: 16px;
    }

    :deep(strong) {
      font-weight: 700;
      color: var(--el-text-color-primary);
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

    :deep(blockquote) {
      padding: 12px 14px 12px 16px;
      margin: 16px 0;
      color: var(--el-text-color-secondary);
      background: linear-gradient(90deg, rgb(73 118 255 / 0.08), rgb(73 118 255 / 0.02));
      border: 1px solid rgb(73 118 255 / 0.1);
      border-left: 4px solid var(--el-color-primary-light-5);
      border-radius: 12px;
    }

    :deep(hr) {
      margin: 20px 0;
      border: 0;
      border-top: 1px solid var(--el-border-color-lighter);
    }

    :deep(.markdown-code-block) {
      margin: 16px 0;
      overflow: hidden;
      background: #161b26;
      border: 1px solid rgb(255 255 255 / 0.06);
      border-radius: 16px;
      box-shadow: 0 14px 30px rgb(15 23 42 / 0.18);
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
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: rgb(232 237 247 / 0.78);
      text-transform: uppercase;
    }

    :deep(.markdown-code-copy) {
      padding: 4px 10px;
      font-size: 12px;
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
      padding: 14px 16px 16px;
      margin: 0;
      overflow: auto;
      color: #e8edf7;
      background: transparent;
      font-size: 14px;
      line-height: 1.75;
    }

    :deep(code) {
      font-family: 'SFMono-Regular', Monaco, Consolas, monospace;
    }

    :deep(:not(pre) > code) {
      padding: 2px 7px;
      font-size: 0.9em;
      color: var(--el-color-primary-dark-2);
      background: var(--el-color-primary-light-9);
      border: 1px solid rgb(93 122 255 / 0.1);
      border-radius: 8px;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 20px;
      margin: 12px 0;
    }

    :deep(li + li) {
      margin-top: 6px;
    }

    :deep(.markdown-table-wrap) {
      position: relative;
      margin: 16px 0;
      overflow-x: auto;
      background:
        linear-gradient(180deg, rgb(255 255 255 / 0.96), rgb(247 249 253 / 0.98)),
        var(--el-bg-color);
      border: 1px solid rgb(93 122 255 / 0.1);
      border-radius: 16px;
      box-shadow:
        0 10px 24px rgb(17 24 39 / 0.06),
        inset 0 1px 0 rgb(255 255 255 / 0.78);
    }

    :deep(.markdown-table-wrap::after) {
      position: sticky;
      top: 0;
      right: 0;
      display: block;
      width: 28px;
      height: 100%;
      pointer-events: none;
      content: '';
      background: linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / 0.9));
      float: right;
    }

    :deep(table) {
      width: 100%;
      min-width: 560px;
      border-collapse: collapse;
      font-size: 14px;
      line-height: 1.6;
    }

    :deep(thead tr) {
      background: linear-gradient(180deg, rgb(93 122 255 / 0.12), rgb(93 122 255 / 0.05));
    }

    :deep(th),
    :deep(td) {
      padding: 12px 14px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(th + th),
    :deep(td + td) {
      border-left: 1px solid var(--el-border-color-lighter);
    }

    :deep(th) {
      font-weight: 600;
      color: var(--el-text-color-primary);
      white-space: nowrap;
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

    .markdown-body {
      font-size: 15px;

      :deep(table) {
        min-width: 420px;
      }
    }
  }
}
</style>
