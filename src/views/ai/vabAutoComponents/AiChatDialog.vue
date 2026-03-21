<template>
  <vab-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="false"
    :title="title"
    width="65vw"
  >
    <div class="ai-chat-dialog">
      <div class="dialog-body">
        <conversation-sidebar :show-create-button="showCreateButton" />
        <chat-panel />
      </div>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { CreateConversationOptions } from '/@/type/ai/chat'
import { nextTick } from 'vue'
import { useAiStore } from '/@/store/modules/ai'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    disabled?: boolean
    showCreateButton?: boolean
    forceCreateConversationOnOpen?: boolean
    createConversationOptions?: CreateConversationOptions
    refreshConversationsOnOpen?: boolean
  }>(),
  {
    title: '标题优化助手',
    showCreateButton: true,
    forceCreateConversationOnOpen: false,
    refreshConversationsOnOpen: true,
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
      if (props.forceCreateConversationOnOpen) {
        await nextTick()
        if (!aiStore.initialized) {
          await aiStore.ensureInitialized({
            createIfEmpty: false,
          })
        }
        await aiStore.createConversation(props.createConversationOptions ? { ...props.createConversationOptions } : undefined)
      } else {
        if (props.refreshConversationsOnOpen) {
          // 每次打开都同步一次服务端会话列表，避免标题、会话列表和本地缓存不一致。
          await aiStore.ensureInitialized({
            forceRefresh: true,
          })
        } else {
          await aiStore.ensureInitialized()
        }
      }
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
  height: min(82vh, 920px);
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
    height: min(78vh, 820px);
  }
}

@media screen and (max-width: 768px) {
  .ai-chat-dialog {
    height: 74vh;
  }

  .dialog-body {
    flex-direction: column;
  }
}
</style>
