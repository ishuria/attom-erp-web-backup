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
      <div :class="['bubble', `is-${message.status || 'success'}`]">
        <template v-if="message.role === 'user'">
          <div class="plain">{{ message.content }}</div>
        </template>
        <template v-else>
          <typing-indicator v-if="message.status === 'loading' && !message.content" />
          <div v-else class="markdown-body" v-html="htmlContent" />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
</script>

<style lang="scss" scoped>
.ai-message-item {
  display: flex;
  gap: 12px;
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
    flex: 0 0 36px;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-color-white);
    background: linear-gradient(135deg, var(--el-color-primary), #3e8bff);
    border-radius: 50%;

    &.is-logo-avatar {
      color: var(--el-text-color-primary);
      background: transparent;
      border: 0;
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
    gap: 6px;
    min-width: 0;
  }

  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .bubble {
    max-width: 70%;
    padding: 14px 16px;
    overflow-wrap: anywhere;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 14px;
    font-size: 16px;

    &.is-error {
      color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
      border-color: var(--el-color-danger-light-5);
    }
  }

  .plain {
    font-size: 16px;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  .markdown-body {
    font-size: 16px;
    line-height: 1.8;

    :deep(p) {
      margin: 0 0 8px;
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }

    :deep(pre) {
      padding: 10px 12px;
      overflow: auto;
      background: var(--el-fill-color-dark);
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.7;
    }

    :deep(code) {
      font-family: Monaco, Consolas, monospace;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 20px;
      margin: 8px 0;
    }
  }
}
</style>
