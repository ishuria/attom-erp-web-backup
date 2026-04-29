<template>
  <div class="ai-conversation-sidebar">
    <div class="header">
    </div>
    <div class="search-bar">
      <el-input v-model="aiStore.searchKeyword" placeholder="搜索会话..." clearable :prefix-icon="Search" size="default" />
    </div>
    <div v-if="showCreateButton" class="create-entry" @click="handleCreateConversation">
      <vab-icon icon="add-circle-line" />
      <span>新建会话</span>
    </div>
    <div class="list">
      <template v-if="aiStore.groupedConversations.length">
        <div v-for="group in aiStore.groupedConversations" :key="group.label" class="group">
          <div class="group-header" @click="toggleGroup(group.label)">
            <vab-icon :icon="collapsedGroups[group.label] ? 'arrow-right-s-line' : 'arrow-down-s-line'" />
            <span class="group-label">{{ group.label }}</span>
            <span class="group-count">({{ group.items.length }})</span>
          </div>
          <div v-show="!collapsedGroups[group.label]" class="group-items">
            <div
              v-for="item in group.items"
              :key="item.id"
              :class="['conversation-item', { active: String(item.id) === String(aiStore.activeConversationId) }]"
              @click="aiStore.switchConversation(item.id)"
              @dblclick="startInlineRename(item)"
            >
              <span v-if="item.unreadCount" class="unread-count">
                {{ formatUnreadCount(item.unreadCount) }}
              </span>
              <div class="main">
                <div class="headline">
                  <el-tooltip
                    v-if="!renamingId || String(renamingId) !== String(item.id)"
                    :content="item.title"
                    placement="top"
                    :show-after="300"
                  >
                    <span class="name">{{ item.title }}</span>
                  </el-tooltip>
                  <el-input
                    v-else
                    v-model="renamingValue"
                    size="small"
                    class="rename-input"
                    @keydown.enter="confirmInlineRename(item)"
                    @keydown.escape="cancelInlineRename"
                    @blur="confirmInlineRename(item)"
                  />
                </div>
                <div class="subtitle">
                  <span>{{ formatRelativeTime(item.createdAt) }}</span>
                  <span v-if="item.messageCount">· {{ item.messageCount }} 条消息</span>
                </div>
              </div>
              <el-dropdown placement="bottom-end" trigger="click" @command="(command) => handleCommand(command, item)">
                <button class="action-trigger" type="button" @click.stop>
                  <vab-icon icon="more-2-fill" />
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="rename">重命名</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-hint">
        <span>{{ aiStore.searchKeyword ? '未找到匹配的会话' : '暂无会话' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { $baseMessage } from '/@/hooks'
import { Plus, Search } from '@element-plus/icons-vue'
import { useAiStore } from '/@/store/modules/ai'
import { updateAiConversationTitle } from '/@/api/devlocal/ai'
import type { ChatConversation } from '/@/type/ai/chat'

defineOptions({
  name: 'ConversationSidebar',
})

const aiStore = useAiStore()
const handleCreateConversation = () => aiStore.enterNewChatMode()

const formatUnreadCount = (count?: number) => {
  const normalizedCount = Math.max(0, Number(count) || 0)
  if (!normalizedCount) return ''
  if (normalizedCount > 99) return '99+'
  return String(normalizedCount)
}

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = dayjs(dateStr)
  const now = dayjs()
  if (d.isSame(now, 'day')) return d.format('HH:mm')
  if (d.isSame(now.subtract(1, 'day'), 'day')) return '昨天'
  return d.format('MM/DD')
}

withDefaults(
  defineProps<{
    fullscreen?: boolean
    showCreateButton?: boolean
  }>(),
  {
    fullscreen: false,
    showCreateButton: false,
  }
)

const collapsedGroups = ref<Record<string, boolean>>({})

const toggleGroup = (label: string) => {
  collapsedGroups.value[label] = !collapsedGroups.value[label]
}

const renamingId = ref<number | string | null>(null)
const renamingValue = ref('')

const startInlineRename = (item: ChatConversation) => {
  renamingId.value = item.id
  renamingValue.value = item.title
}

const cancelInlineRename = () => {
  renamingId.value = null
  renamingValue.value = ''
}

const confirmInlineRename = async (item: ChatConversation) => {
  if (renamingId.value === null) return
  const title = renamingValue.value.trim()
  if (!title || title === item.title) {
    cancelInlineRename()
    return
  }

  try {
    await updateAiConversationTitle({ id: item.id, title })
    aiStore.setConversationTitle(item.id, title)
    $baseMessage('会话名称已更新', 'success', 'hey')
  } catch {
    $baseMessage('会话名称更新失败', 'error', 'hey')
  } finally {
    cancelInlineRename()
  }
}

const handleDelete = async (id: number | string) => {
  try {
    await ElMessageBox.confirm('确认删除该会话？', '提示', { type: 'warning' })
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

    await updateAiConversationTitle({ id: item.id, title })
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
  if (command === 'copyLink') {
    $baseMessage('即将上线', 'info', 'hey')
    return
  }
  if (command === 'export') {
    $baseMessage('即将上线', 'info', 'hey')
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
    margin-bottom: 12px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
  }

  .search-bar {
    margin-bottom: 12px;

    :deep(.el-input__wrapper) {
      border-radius: 10px;
    }
  }

  .create-entry {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-color-primary);
    cursor: pointer;
    background: var(--el-color-primary-light-9);
    border: 1px dashed var(--el-color-primary-light-5);
    border-radius: 10px;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background: var(--el-color-primary-light-8);
      border-color: var(--el-color-primary-light-3);
    }
  }

  .list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-height: 0;
    overflow-y: auto;
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .group-header {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 8px 4px 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  .group-label {
    flex-shrink: 0;
  }

  .group-count {
    font-weight: 400;
    color: var(--el-text-color-placeholder);
  }

  .group-items {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .conversation-item {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 12px 44px 12px 14px;
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

  .headline {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .name {
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rename-input {
    :deep(.el-input__wrapper) {
      padding: 2px 8px;
      font-size: 14px;
    }
  }

  .subtitle {
    display: flex;
    gap: 2px;
    font-size: 11px;
    color: var(--el-text-color-placeholder);
    white-space: nowrap;
  }

  .action-trigger {
    position: absolute;
    top: 50%;
    right: -25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 8px;
    transform: translateY(-50%);
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: var(--el-text-color-primary);
      background: var(--el-fill-color);
    }
  }

  .unread-count {
    position: absolute;
    top: 6px;
    right: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    color: var(--el-color-white);
    background: var(--el-color-danger);
    border-radius: 999px;
  }

  .empty-hint {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
    font-size: 13px;
    color: var(--el-text-color-placeholder);
  }
}

@media screen and (max-width: 1280px) {
  .ai-conversation-sidebar {
    width: 300px;
    min-width: 300px;
  }
}
</style>
