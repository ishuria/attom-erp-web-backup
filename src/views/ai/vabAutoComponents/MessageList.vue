<template>
  <div ref="containerRef" class="ai-message-list">
    <message-item v-for="item in messages" :key="item.id" :message="item" />
  </div>
</template>

<script lang="ts" setup>
import type { ChatMessage } from '/@/type/ai/chat'
import { aiScrollToBottom } from '/@/utils/aiScroll'
import MessageItem from '/@/views/ai/vabAutoComponents/MessageItem.vue'

const props = defineProps<{
  messages: ChatMessage[]
}>()

defineOptions({
  name: 'MessageList',
})

const containerRef = ref<HTMLElement>()

const scrollToBottom = () => {
  aiScrollToBottom(containerRef.value)
}

watch(
  () => props.messages.map((item) => `${item.id}_${item.content}_${item.status}`).join('|'),
  async () => {
    await nextTick()
    scrollToBottom()
  },
  {
    immediate: true,
  }
)

defineExpose({
  scrollToBottom,
})
</script>

<style lang="scss" scoped>
.ai-message-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  padding-right: 4px;
  overflow-y: auto;
}
</style>
