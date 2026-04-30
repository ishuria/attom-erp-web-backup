<template>
  <div
    class="ai-chat-panel"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div v-if="isDragover" class="panel-dropzone-overlay">
      <vab-icon icon="upload-cloud-2-line" />
      <span>松开鼠标上传附件</span>
      <span class="hint">支持 PDF / Word / Excel / CSV / Markdown / ZIP / 图片</span>
    </div>
    <!-- 侧边栏切换（无状态栏时显示） -->
    <div v-if="!currentTitle || !aiStore.activeMessages.length" class="sidebar-toggle-bar">
      <el-tooltip :content="sidebarVisible ? '隐藏侧边栏' : '显示侧边栏'" placement="top">
        <el-button text circle size="small" @click="emit('toggleSidebar')">
          <vab-icon :icon="sidebarVisible ? 'menu-fold-line' : 'menu-unfold-line'" />
        </el-button>
      </el-tooltip>
    </div>

    <!-- 网络断开提示 -->
    <div v-if="!aiStore.networkOnline" class="network-banner">
      <vab-icon icon="wifi-off-line" />
      <span>网络已断开，消息将在恢复后发送</span>
    </div>

    <!-- 顶部状态栏 -->
    <div v-if="currentTitle && aiStore.activeMessages.length" class="context-bar">
      <div class="context-bar-left">
        <el-tooltip :content="sidebarVisible ? '隐藏侧边栏' : '显示侧边栏'" placement="top">
          <el-button text circle size="small" class="sidebar-toggle" @click="emit('toggleSidebar')">
            <vab-icon :icon="sidebarVisible ? 'menu-fold-line' : 'menu-unfold-line'" />
          </el-button>
        </el-tooltip>
        <vab-icon icon="file-text-line" class="context-icon" />
        <el-tooltip :content="currentTitle" placement="top" :show-after="300">
          <span class="context-title">{{ currentTitle }}</span>
        </el-tooltip>
      </div>
      <el-dropdown placement="bottom-end" trigger="click" @command="handleContextCommand">
        <el-button text circle size="small">
          <vab-icon icon="more-2-fill" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="feishuDoc">生成飞书文档</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 忙碌状态提示 -->
    <div v-if="busyMessage" class="toolbar">
      <div class="busy-banner">
        {{ busyMessage }}
      </div>
    </div>

    <!-- 空状态 / 新建聊天模式 -->
    <div v-if="!aiStore.activeMessages.length" class="empty-state">
      <h4>{{ aiStore.isNewChatMode ? '你好！有什么可以帮助你的吗？' : '开始一段新的对话' }}</h4>
      <div class="quick-prompts">
      </div>
    </div>

    <message-list v-else :messages="aiStore.activeMessages" />

    <message-input
      ref="messageInputRef"
      :disabled="inputDisabled"
      :fullscreen="fullscreen"
      :placeholder="inputPlaceholder"
      :feishu-loading="aiStore.feishuDocCreating"
      @send="aiStore.sendMessage"
      @create-feishu-doc="aiStore.handleCreateFeishuDoc"
    />
  </div>
</template>

<script lang="ts" setup>
import { $baseMessage } from '/@/hooks'
import { useAiStore } from '/@/store/modules/ai'
import ChatPanelMessageInput from '/@/views/ai/vabAutoComponents/MessageInput.vue'
import ChatPanelMessageList from '/@/views/ai/vabAutoComponents/MessageList.vue'

defineProps<{
  fullscreen?: boolean
  sidebarVisible?: boolean
}>()

defineOptions({
  name: 'ChatPanel',
})

const emit = defineEmits<{
  toggleSidebar: []
}>()

const aiStore = useAiStore()


const currentTitle = computed(() => aiStore.activeConversation?.title ?? '')
const busyState = computed(() => aiStore.activeConversationBusyState)
const hasActiveConversation = computed(() => !!aiStore.activeConversationId)
const inputDisabled = computed(
  () => (!hasActiveConversation.value && !aiStore.isNewChatMode) || aiStore.loading || aiStore.isStreaming || !!busyState.value
)
const busyMessage = computed(() => busyState.value?.message ?? '')
const inputPlaceholder = computed(() => {
  if (!hasActiveConversation.value && !aiStore.isNewChatMode) return '当前没有会话，暂时不能发送消息'
  return busyState.value?.message ?? '输入消息，Shift+Enter 换行，Enter 发送'
})

const handleQuickPrompt = (question: string) => {
  if (inputDisabled.value) return
  aiStore.sendMessage(question)
}

const handleContextCommand = (command: string) => {
  if (command === 'feishuDoc') {
    aiStore.handleCreateFeishuDoc()
    return
  }
  if (command === 'exportPdf') {
    $baseMessage('PDF 导出即将上线', 'info', 'hey')
    return
  }
  if (command === 'shareLink') {
    $baseMessage('分享链接即将上线', 'info', 'hey')
  }
}

// 监听网络状态
onMounted(() => {
  const updateOnlineStatus = () => aiStore.setNetworkOnline(navigator.onLine)
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  updateOnlineStatus()
})

// 拖拽上传：覆盖整个聊天面板
const messageInputRef = ref<InstanceType<typeof ChatPanelMessageInput> | null>(null)
const isDragover = ref(false)
let dragCounter = 0

const hasFileType = (event: DragEvent) => {
  const types = event.dataTransfer?.types
  if (!types) return false
  return Array.from(types).includes('Files')
}

const handleDragEnter = (event: DragEvent) => {
  if (inputDisabled.value || !hasFileType(event)) return
  dragCounter++
  isDragover.value = true
}

const handleDragOver = (event: DragEvent) => {
  if (inputDisabled.value || !hasFileType(event)) return
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = () => {
  dragCounter = Math.max(0, dragCounter - 1)
  if (dragCounter === 0) isDragover.value = false
}

const handleDrop = (event: DragEvent) => {
  dragCounter = 0
  isDragover.value = false
  if (inputDisabled.value) return
  const files = Array.from(event.dataTransfer?.files ?? [])
  if (!files.length) return
  void messageInputRef.value?.processFiles(files)
}

const MessageInput = ChatPanelMessageInput
const MessageList = ChatPanelMessageList
</script>

<style lang="scss" scoped>
.ai-chat-panel {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  height: 100%;
  padding: 4px 16px 2px;

  .panel-dropzone-overlay {
    position: absolute;
    inset: 4px 16px 2px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-color-primary);
    background: rgb(238 244 255 / 0.92);
    border: 2px dashed var(--el-color-primary);
    border-radius: 16px;
    pointer-events: none;
    backdrop-filter: blur(2px);

    .vab-icon {
      font-size: 36px;
    }

    .hint {
      font-size: 12px;
      font-weight: 400;
      color: var(--el-text-color-secondary);
    }
  }

  .network-banner {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    font-size: 13px;
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
    border: 1px solid var(--el-color-danger-light-7);
    border-radius: 8px;
  }

  .context-bar {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--el-fill-color-lighter);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;
  }

  .sidebar-toggle-bar {
    display: flex;
    align-items: center;
    padding: 2px 0;
  }

  .context-bar-left {
    display: flex;
    gap: 6px;
    align-items: center;
    min-width: 0;
  }

  .context-icon {
    flex-shrink: 0;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }

  .context-title {
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  .busy-banner {
    font-size: 13px;
    color: var(--el-color-warning-dark-2);
    background: var(--el-color-warning-light-9);
    border: 1px solid var(--el-color-warning-light-5);
    border-radius: 10px;
    padding: 10px 12px;
  }

  .empty-state {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);

    h4 {
      margin: 0 0 8px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0 0 20px;
      font-size: 14px;
    }
  }

  .quick-prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
}
</style>
