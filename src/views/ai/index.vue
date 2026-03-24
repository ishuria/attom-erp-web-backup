<template>
  <div class="ai-module-page no-background-container">
    <vab-card class="intro-card" shadow="never">
      <div class="intro">
        <div class="copy">
          <p class="eyebrow">AI 模块</p>
          <h2>通用聊天能力入口</h2>
          <p class="desc">
            当前页面承载新的 AI 对话模块实现。右下角悬浮按钮可打开聊天弹窗；首次进入页面时，也会自动为用户初始化默认会话。
          </p>
          <div class="actions">
            <el-button type="primary" @click="aiStore.openModal">打开聊天窗口</el-button>
          </div>
        </div>
        <div class="meta">
          <div class="meta-item">
            <span class="label">当前模型</span>
            <strong>{{ aiStore.currentModel }}</strong>
          </div>
          <div class="meta-item">
            <span class="label">会话数量</span>
            <strong>{{ aiStore.conversations.length }}</strong>
          </div>
        </div>
      </div>
    </vab-card>

    <ai-chat-launcher />
    <ai-chat-modal />
  </div>
</template>

<script lang="ts" setup>
import { useAiStore } from '/@/store/modules/ai'
import AiChatLauncher from '/@/views/ai/vabAutoComponents/AiChatLauncher.vue'
import AiChatModal from '/@/views/ai/vabAutoComponents/AiChatModal.vue'

defineOptions({
  name: 'AiIndex',
})

const aiStore = useAiStore()

onMounted(async () => {
  // 进入页面时先初始化会话，避免首次打开弹窗仍需等待接口返回。
  await aiStore.ensureInitialized()
  aiStore.openModal()
})

onUnmounted(() => {
  aiStore.closeModal()
})
</script>

<style lang="scss" scoped>
.ai-module-page {
  min-height: var(--el-container-height);

  .intro-card {
    min-height: 260px;
  }

  .intro {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(260px, 1fr);
    gap: 20px;
    align-items: stretch;
  }

  .copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 16px;
  }

  .eyebrow {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--el-color-primary);
    text-transform: uppercase;
  }

  h2 {
    margin: 0 0 12px;
    font-size: 28px;
    color: var(--el-text-color-primary);
  }

  .desc {
    max-width: 620px;
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
    color: var(--el-text-color-secondary);
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .meta {
    display: grid;
    gap: 12px;
    padding: 16px;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    padding: 18px;
    background: linear-gradient(135deg, var(--el-fill-color-light), var(--el-fill-color-lighter));
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 16px;
  }

  .label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  strong {
    font-size: 18px;
    color: var(--el-text-color-primary);
  }
}

@media screen and (max-width: 960px) {
  .ai-module-page {
    .intro {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-wrap: wrap;
    }
  }
}
</style>
