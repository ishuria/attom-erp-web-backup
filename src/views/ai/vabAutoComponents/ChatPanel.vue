<template>
  <div class="ai-chat-panel">
    <div v-if="busyMessage" class="toolbar">
      <div v-if="busyMessage" class="busy-banner">
        {{ busyMessage }}
      </div>
    </div>

    <div v-if="!aiStore.activeMessages.length" class="empty-state">
      <h4>开始一段新的对话</h4>
      <p>输入你的问题，模块会为当前会话生成回复。</p>
    </div>

    <message-list v-else :messages="aiStore.activeMessages" />

    <message-input
      :disabled="inputDisabled"
      :fullscreen="fullscreen"
      :placeholder="inputPlaceholder"
      :feishu-loading="aiStore.feishuDocCreating"
      @send="aiStore.sendMessage"
      @create-feishu-doc="aiStore.handleCreateFeishuDoc"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAiStore } from '/@/store/modules/ai'
import ChatPanelMessageInput from '/@/views/ai/vabAutoComponents/MessageInput.vue'
import ChatPanelMessageList from '/@/views/ai/vabAutoComponents/MessageList.vue'

defineProps<{
  fullscreen?: boolean
}>()

defineOptions({
  name: 'ChatPanel',
})

const aiStore = useAiStore()
const currentTitle = computed(() => aiStore.activeConversation?.title ?? 'AI 助手')
const busyState = computed(() => aiStore.activeConversationBusyState)
const hasActiveConversation = computed(() => !!aiStore.activeConversationId)
const inputDisabled = computed(() => !hasActiveConversation.value || aiStore.loading || aiStore.isStreaming || !!busyState.value)
const busyMessage = computed(() => busyState.value?.message ?? '')
const inputPlaceholder = computed(() =>
  !hasActiveConversation.value ? '当前没有会话，暂时不能发送消息' : busyState.value?.message ?? '输入消息，Shift+Enter 换行，Enter 发送'
)

const MessageInput = ChatPanelMessageInput
const MessageList = ChatPanelMessageList
</script>

<style lang="scss" scoped>
.ai-chat-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  height: 100%;
  padding: 4px 16px 2px;

  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  .busy-banner {
    font-size: 13px;
    color: var(--el-color-warning-dark-2);
    background: var(--el-color-warning-light-9);
    border: 1px solid var(--el-color-warning-light-5);
    border-radius: 10px;
    padding: 10px 12px;
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
