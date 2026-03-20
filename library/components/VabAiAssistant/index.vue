<template>
  <div class="vab-ai-assistant">
    <vab-icon class="vab-ai-assistant-icon" icon="openai-line" @click="openChatDialog" />
    <ai-chat-dialog v-model="dialogVisible" />
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
  if (!theme.value.showAiAssistant) {
    $baseMessage('请先在主题设置中启用AI助手', 'warning', 'hey')
    return
  }

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
