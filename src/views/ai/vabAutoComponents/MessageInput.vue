<template>
  <div class="ai-message-input">
    <el-input
      v-model="draft"
      type="textarea"
      :rows="3"
      resize="none"
      :maxlength="3000"
      :disabled="disabled"
      placeholder="输入消息，Shift+Enter 换行，Enter 发送"
      @keydown.enter.exact.prevent="handleSend"
    />
    <div class="actions">
      <span class="hint">Shift+Enter 换行</span>
      <el-button type="primary" :loading="disabled" @click="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [value: string]
}>()

defineOptions({
  name: 'MessageInput',
})

const draft = ref('')

const handleSend = () => {
  const value = draft.value.trim()
  if (!value) return
  emit('send', value)
  draft.value = ''
}
</script>

<style lang="scss" scoped>
.ai-message-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hint {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
