<template>
  <transition name="ai-fade">
    <div v-if="aiStore.isOpen" class="ai-chat-modal-mask" @click.self="aiStore.closeModal">
      <div class="ai-chat-modal">
        <div class="modal-header">
          <div class="left">
            <strong>{{ title }}</strong>
            <span>可复用的 AI 对话模块</span>
          </div>
          <el-button :icon="Close" circle text @click="aiStore.closeModal" />
        </div>
        <div class="modal-body">
          <conversation-sidebar />
          <chat-panel />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { useAiStore } from '/@/store/modules/ai'
import ChatPanel from '/@/views/ai/vabAutoComponents/ChatPanel.vue'
import ConversationSidebar from '/@/views/ai/vabAutoComponents/ConversationSidebar.vue'

const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'AI 助手',
  }
)

defineOptions({
  name: 'AiChatModal',
})

const aiStore = useAiStore()
</script>

<style lang="scss" scoped>
.ai-chat-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
  background: rgba(15, 23, 42, 0.18);
}

.ai-chat-modal {
  display: flex;
  flex-direction: column;
  width: 760px;
  max-width: calc(100vw - 24px);
  height: 560px;
  max-height: calc(100vh - 48px);
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 16px;
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.modal-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.ai-fade-enter-active,
.ai-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ai-fade-enter-from,
.ai-fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .ai-chat-modal-mask {
    padding: 12px;
  }

  .ai-chat-modal {
    width: 100%;
    height: calc(100vh - 24px);
  }

  .modal-body {
    flex-direction: column;
  }
}
</style>
