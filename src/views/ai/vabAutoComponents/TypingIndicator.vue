<template>
  <div class="ai-typing-indicator">
    <span />
    <span />
    <span />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TypingIndicator',
})
</script>

<style lang="scss" scoped>
.ai-typing-indicator {
  display: inline-flex;
  gap: 6px;
  align-items: center;

  span {
    width: 6px;
    height: 6px;
    background: var(--el-text-color-secondary);
    border-radius: 50%;
    animation: aiTyping 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes aiTyping {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
</style>
