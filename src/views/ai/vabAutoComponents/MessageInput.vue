<template>
  <div class="ai-message-input">
    <div class="input-shell" :class="{ 'is-disabled': disabled }">
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
      <div class="actions">
        <div class="meta">
          <span class="hint">Shift+Enter 换行</span>
          <span class="count">{{ draft.length }}/3000</span>
        </div>
        <el-button type="primary" round :disabled="disabled || !draft.trim()" @click="handleSend">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  fullscreen?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  send: [value: string]
}>()

defineOptions({
  name: 'MessageInput',
})

const draft = ref('')
const autosizeConfig = computed(() => ({
  minRows: 1,
  maxRows: props.fullscreen ? 12 : 8,
}))

const handleSend = () => {
  if (props.disabled) return
  const value = draft.value.trim()
  if (!value) return
  emit('send', value)
  draft.value = ''
}
</script>

<style lang="scss" scoped>
.ai-message-input {
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);

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
  }

  :deep(.el-button.is-round) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 72px;
    height: 30px;
    padding: 0 14px;
    line-height: 1;
    font-weight: 600;
  }
}
</style>
