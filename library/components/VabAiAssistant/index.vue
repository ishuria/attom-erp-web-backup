<template>
  <div class="vab-ai-assistant">
    <el-badge class="vab-ai-assistant-badge" :hidden="notificationStore.unreadCount <= 0" type="danger" :value="notificationStore.displayUnreadCount">
      <vab-icon class="vab-ai-assistant-icon" icon="openai-line" @click="openChatDialog" />
    </el-badge>
    <ai-chat-dialog v-model="dialogVisible" :create-conversation-if-empty-on-open="false" />
  </div>
</template>

<script lang="ts" setup>
import { useNotificationStore } from '/@/store/modules/notification'
import AiChatDialog from '/@/views/ai/vabAutoComponents/AiChatDialog.vue'

defineOptions({
  name: 'VabAiAssistant',
})

const notificationStore = useNotificationStore()
const dialogVisible = ref(false)

const openChatDialog = () => {
  dialogVisible.value = true
  void notificationStore.markAllRead()
}
</script>

<style lang="scss" scoped>
.vab-ai-assistant {
  :deep(.vab-ai-assistant-badge) {
    display: inline-flex;
    margin-left: 15px;
    cursor: pointer;

    .el-badge__content {
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      padding: 0 5px;
      border: 0;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }
  }

  :deep(.vab-ai-assistant-icon) {
    font-size: 18px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
