<template>
  <div class="ai-conversation-sidebar">
    <div class="header">
      <span class="title">会话</span>
      <el-button v-if="showCreateButton" circle :icon="Plus" plain size="small" @click="handleCreateConversation" />
    </div>
    <div class="list">
      <div
        v-for="item in aiStore.conversations"
        :key="item.id"
        :class="['conversation-item', { active: String(item.id) === String(aiStore.activeConversationId) }]"
        @click="aiStore.switchConversation(item.id)"
      >
        <span v-if="item.unreadCount" class="unread-count">
          {{ formatUnreadCount(item.unreadCount) }}
        </span>
        <div class="main">
          <div class="headline">
            <span class="name">{{ item.title }}</span>
          </div>
        </div>
        <el-dropdown placement="bottom-end" trigger="click" @command="(command) => handleCommand(command, item)">
          <button class="action-trigger" type="button" @click.stop>
            <vab-icon icon="more-2-fill" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="rename">重命名</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $baseMessage } from '/@/hooks'
import { Plus } from '@element-plus/icons-vue'
import { useAiStore } from '/@/store/modules/ai'
import { updateAiConversationTitle } from '/@/api/devlocal/ai'
import type { ChatConversation } from '/@/type/ai/chat'

defineOptions({
  name: 'ConversationSidebar',
})

const aiStore = useAiStore()
const handleCreateConversation = () => aiStore.createConversation()

const formatUnreadCount = (count?: number) => {
  const normalizedCount = Math.max(0, Number(count) || 0)
  if (!normalizedCount) return ''
  if (normalizedCount > 99) return '99+'
  return String(normalizedCount)
}

withDefaults(
  defineProps<{
    fullscreen?: boolean
    showCreateButton?: boolean
  }>(),
  {
    fullscreen: false,
    showCreateButton: true,
  }
)

const handleDelete = async (id: number | string) => {
  try {
    await ElMessageBox.confirm('确认删除该会话？', '提示', {
      type: 'warning',
    })
    await aiStore.removeConversation(id)
    $baseMessage('会话已删除', 'success', 'hey')
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    $baseMessage('会话删除失败', 'error', 'hey')
  }
}

const handleRename = async (item: ChatConversation) => {
  try {
    const { value } = await ElMessageBox.prompt('', '重命名会话', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: item.title,
      inputPattern: /\S+/,
      inputErrorMessage: '会话名称不能为空',
    })
    const title = value.trim()
    if (!title || title === item.title) return

    await updateAiConversationTitle({
      id: item.id,
      title,
    })
    aiStore.setConversationTitle(item.id, title)
    $baseMessage('会话名称已更新', 'success', 'hey')
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    $baseMessage('会话名称更新失败', 'error', 'hey')
  }
}

const handleCommand = async (command: string, item: ChatConversation) => {
  if (command === 'rename') {
    await handleRename(item)
    return
  }

  if (command === 'delete') await handleDelete(item.id)
}
</script>

<style lang="scss" scoped>
.ai-conversation-sidebar {
  display: flex;
  flex-direction: column;
  width: 344px;
  min-width: 344px;
  height: 100%;
  padding: 18px 14px;
  background: var(--el-fill-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
  }

  .list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow-y: auto;
  }

  .conversation-item {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 16px 44px 16px 14px;
    text-align: left;
    cursor: pointer;
    background: var(--el-bg-color);
    border: 1px solid transparent;
    border-radius: 10px;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;

    &.active {
      border-color: var(--el-color-primary-light-5);
      box-shadow: inset 0 0 0 1px var(--el-color-primary-light-5);
    }

    &:hover {
      border-color: var(--el-border-color);
      background: var(--el-fill-color-extra-light);
    }
  }

  .main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .headline {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .action-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 8px;
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: var(--el-text-color-primary);
      background: var(--el-fill-color);
    }
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .name {
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  .unread-count {
    position: absolute;
    top: 6px;
    right: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    color: var(--el-color-white);
    background: var(--el-color-danger);
    border-radius: 999px;
    transform: translate(50%, 0);
  }
}

@media screen and (max-width: 1280px) {
  .ai-conversation-sidebar {
    width: 300px;
    min-width: 300px;
  }
}
</style>
