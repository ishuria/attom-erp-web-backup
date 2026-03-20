<template>
  <vab-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="false"
    :title="title"
    width="1080px"
  >
    <div class="ai-chat-dialog">
      <div class="dialog-body">
        <conversation-sidebar />
        <chat-panel />
      </div>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { useAiStore } from '/@/store/modules/ai'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    title: '标题优化助手',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineOptions({
  name: 'AiChatDialog',
})

const aiStore = useAiStore()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})

watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      aiStore.openModal()
      // 对话框打开前先初始化会话，避免用户看到空白状态闪烁。
      await aiStore.ensureInitialized()
    } else {
      aiStore.closeModal()
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.ai-chat-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: min(74vh, 720px);
}

.dialog-header-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.dialog-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 18px;
}

@media screen and (max-width: 1280px) {
  .ai-chat-dialog {
    height: min(72vh, 660px);
  }
}

@media screen and (max-width: 768px) {
  .ai-chat-dialog {
    height: 72vh;
  }

  .dialog-body {
    flex-direction: column;
  }
}
</style>
