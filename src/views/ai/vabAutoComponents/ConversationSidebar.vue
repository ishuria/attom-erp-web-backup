<template>
  <div class="ai-conversation-sidebar">
    <div class="header">
      <span class="title">会话</span>
      <el-button :icon="Plus" circle plain size="small" @click="aiStore.createConversation" />
    </div>
    <div class="list">
      <div
        v-for="item in aiStore.conversations"
        :key="item.id"
        :class="['conversation-item', { active: String(item.id) === String(aiStore.activeConversationId) }]"
        @click="aiStore.switchConversation(item.id)"
      >
        <div class="main">
          <span class="name">{{ item.title }}</span>
          <span class="time">{{ item.createdAt }}</span>
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
    item.title = title
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
  width: 280px;
  min-width: 280px;
  height: 100%;
  padding: 16px 12px;
  background: var(--el-fill-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
  }

  .list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    overflow-y: auto;
  }

  .conversation-item {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 10px;
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
    gap: 4px;
    min-width: 0;
  }

  .action-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
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

  .name,
  .time {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .name {
    font-size: 13px;
    color: var(--el-text-color-primary);
  }

  .time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

@media screen and (max-width: 1280px) {
  .ai-conversation-sidebar {
    width: 248px;
    min-width: 248px;
  }
}
</style>
