<template>
  <div class="ai-chat-panel">
    <div class="toolbar">

    </div>

    <div v-if="!aiStore.activeMessages.length" class="empty-state">
      <h4>开始一段新的对话</h4>
      <p>输入你的问题，模块会为当前会话生成回复。</p>
    </div>

    <message-list v-else :messages="aiStore.activeMessages" />

    <message-input :disabled="aiStore.loading || aiStore.isStreaming" @send="aiStore.sendMessage" />
  </div>
</template>

<script lang="ts" setup>
import { useAiStore } from '/@/store/modules/ai'
import ChatPanelMessageInput from '/@/views/ai/vabAutoComponents/MessageInput.vue'
import ChatPanelMessageList from '/@/views/ai/vabAutoComponents/MessageList.vue'

defineOptions({
  name: 'ChatPanel',
})

const aiStore = useAiStore()
const currentTitle = computed(() => aiStore.activeConversation?.title ?? 'AI 助手')

const MessageInput = ChatPanelMessageInput
const MessageList = ChatPanelMessageList
</script>

<style lang="scss" scoped>
.ai-chat-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  height: 100%;
  padding: 18px 20px 16px;

  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }


  .empty-state {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);

    h4 {
      margin: 0 0 8px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
