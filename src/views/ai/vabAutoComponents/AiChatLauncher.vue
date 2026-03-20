<template>
  <button class="ai-chat-launcher" type="button" @click="aiStore.toggleModal">
    <el-icon :size="22">
      <chat-dot-round />
    </el-icon>
  </button>
</template>

<script lang="ts" setup>
import { ChatDotRound } from '@element-plus/icons-vue'
import { useAiStore } from '/@/store/modules/ai'

defineOptions({
  name: 'AiChatLauncher',
})

const aiStore = useAiStore()
</script>

<style lang="scss" scoped>
.ai-chat-launcher {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1999;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  color: var(--el-color-white);
  cursor: pointer;
  background: linear-gradient(135deg, var(--el-color-primary), #2dd4bf);
  border: 0;
  border-radius: 50%;
  box-shadow: 0 14px 28px rgba(16, 185, 129, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(16, 185, 129, 0.32);
  }
}
</style>
