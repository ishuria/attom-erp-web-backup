<template>
  <div class="vab-ai-assistant">
    <vab-icon class="vab-ai-assistant-icon" icon="openai-line" @click="openChatDialog" />
    <ai-chat-dialog v-model="dialogVisible" :create-conversation-if-empty-on-open="false" />
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import AiChatDialog from '/@/views/ai/vabAutoComponents/AiChatDialog.vue'

defineOptions({
  name: 'VabAiAssistant',
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const dialogVisible = ref(false)

const openChatDialog = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.vab-ai-assistant {
  :deep(.vab-ai-assistant-icon) {
    margin-left: 15px;
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
