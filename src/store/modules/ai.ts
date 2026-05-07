import dayjs from 'dayjs'
import {
  checkFeishuDoc,
  createAiConversation,
  createCommonChatConversation,
  createFeishuDoc,
  conversationUnreadCount,
  deleteAiConversation,
  getAiConversationList,
  getAiMessageList,
  getFeishuUrl,
  sendAiChatMessage,
  updateAiConversationTitle,
} from '/@/api/devlocal/ai'

import type {
  ChatAttachment,
  ChatConversation,
  ChatConversationBusyState,
  ChatMessage,
  CreateConversationOptions,
  EnsureConversationOptions,
} from '/@/type/ai/chat'

// 为本地兜底消息生成临时主键，避免渲染层依赖后端 id。
const createLocalId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

// 统一兼容后端不同字段命名，保持 store 内部结构稳定。
const normalizeConversation = (item: any): ChatConversation => ({
  id: item?.id ?? createLocalId('conv'),
  title: item?.title ?? '新建对话',
  createdAt: item?.createdAt ?? item?.createTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
  unreadCount: Math.max(0, Number(item?.unreadCount ?? item?.unreadNum ?? item?.noReadCount ?? 0) || 0),
  messageCount: Math.max(0, Number(item?.messageCount ?? item?.msgCount ?? 0) || 0),
})

// 根据文件名后缀推断 MIME，便于历史消息回显时判断走图片预览还是文档卡片。
const inferMimeType = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    txt: 'text/plain',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
  }
  return map[ext] ?? 'application/octet-stream'
}

const fileNameFromUrl = (url: string) => {
  try {
    const path = url.split('?')[0].split('#')[0]
    return decodeURIComponent(path.split('/').pop() ?? '') || url
  } catch {
    return url
  }
}

// 后端历史消息中的附件字段格式不固定：可能是 URL 字符串数组，也可能是对象数组。
// 这里抹平成视图层期望的 ChatAttachment 结构，保证刷新后图片/文档仍能正常渲染。
const normalizeAttachments = (raw: any): ChatAttachment[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  const list = raw
    .map((item, index): ChatAttachment | null => {
      if (!item) return null
      if (typeof item === 'string') {
        const name = fileNameFromUrl(item)
        return {
          id: `${createLocalId('att')}_${index}`,
          name,
          size: 0,
          type: inferMimeType(name),
          url: item,
          status: 'success',
        }
      }
      const url: string = item.url ?? item.fileUrl ?? item.path ?? ''
      const name: string = item.name ?? item.fileName ?? (url ? fileNameFromUrl(url) : `file-${index + 1}`)
      const type: string = item.type ?? item.mimeType ?? inferMimeType(name)
      return {
        id: item.id ?? `${createLocalId('att')}_${index}`,
        name,
        size: Number(item.size ?? item.fileSize ?? 0) || 0,
        type,
        url: url || undefined,
        status: 'success',
      }
    })
    .filter((it): it is ChatAttachment => it !== null)
  return list.length > 0 ? list : undefined
}

// 消息列表也做同样的字段归一，减少视图层判断分支。
const normalizeMessage = (item: any): ChatMessage => ({
  id: item?.id ?? createLocalId('msg'),
  role: item?.role ?? 'assistant',
  content: item?.content ?? '',
  createdAt: item?.createdAt ?? item?.createTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
  status: item?.status ?? 'success',
  attachments: normalizeAttachments(item?.attachments ?? item?.fileList ?? item?.files),
})

const pickArray = (response: any) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.rows)) return response.rows
  if (Array.isArray(response?.list)) return response.list
  return []
}

// 某些接口直接返回对象，某些接口包在 data 中，这里统一抹平。
const pickObject = (response: any) => response?.data ?? response ?? {}

const normalizeCreateConversationOptions = (options?: CreateConversationOptions): CreateConversationOptions => ({
  payload: options?.payload ? { ...options.payload } : undefined,
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 用首条消息生成会话标题：折叠空白、单行、超长截断
const deriveTitleFromMessage = (content: string) => {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (!normalized) return '新建对话'
  return normalized.length > 30 ? `${normalized.slice(0, 30)}…` : normalized
}

// 持久化"激活会话 + 新建会话模式"，用于浏览器硬刷新后恢复用户上一次的对话状态
const ACTIVE_STATE_STORAGE_KEY = 'ai_chat_active_state'

interface PersistedActiveState {
  activeConversationId: number | string | null
  isNewChatMode: boolean
}

const readPersistedActiveState = (): PersistedActiveState | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_STATE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      activeConversationId: parsed.activeConversationId ?? null,
      isNewChatMode: !!parsed.isNewChatMode,
    }
  } catch {
    return null
  }
}

const writePersistedActiveState = (state: PersistedActiveState) => {
  try {
    localStorage.setItem(ACTIVE_STATE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 忽略 quota / disabled storage 等异常
  }
}

const clearPersistedActiveState = () => {
  try {
    localStorage.removeItem(ACTIVE_STATE_STORAGE_KEY)
  } catch {
    // 同上
  }
}

export const useAiStore = defineStore('ai', {
  state: () => ({
    // 弹窗/侧边 AI 面板的打开状态。
    isOpen: true,
    // 当前是否处于流式或请求中，供输入框和发送按钮禁用使用。
    isStreaming: false,
    loading: false,
    // 避免重复初始化会话列表。
    initialized: false,
    currentModel: 'gpt-4o-mini',
    conversations: [] as ChatConversation[],
    activeConversationId: null as number | string | null,
    // 按 conversationId 缓存消息，切换会话时无需反复清空重建。
    messages: {} as Record<string, ChatMessage[]>,
    conversationBusyMap: {} as Record<string, ChatConversationBusyState>,
    feishuDocCreatingMap: {} as Record<string, boolean>,
    searchKeyword: '',
    pendingAttachments: [] as ChatAttachment[],
    networkOnline: true,
    // 新建聊天模式：无激活会话，输入框可用，发送时才创建会话。
    isNewChatMode: false,
  }),
  getters: {
    // 当前激活会话对象。
    activeConversation(state) {
      return state.conversations.find((item) => String(item.id) === String(state.activeConversationId))
    },
    // 当前激活会话对应的消息列表。
    activeMessages(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? (state.messages[key] ?? []) : []
    },
    activeConversationBusyState(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? (state.conversationBusyMap[key] ?? null) : null
    },
    activeFeishuDocCreating(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? !!state.feishuDocCreatingMap[key] : false
    },
    // 没有激活会话或请求进行中时，不允许发送。
    canSend(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return !state.loading && !state.isStreaming && !state.conversationBusyMap[key] && !!state.activeConversationId
    },
    // 基于搜索关键词过滤会话列表。
    filteredConversations(state) {
      const keyword = state.searchKeyword.trim().toLowerCase()
      if (!keyword) return state.conversations
      return state.conversations.filter((item) => item.title.toLowerCase().includes(keyword))
    },
    // 按 createdAt 分为今天/昨天/更早三组。
    groupedConversations() {
      const list = this.filteredConversations
      const now = dayjs()
      const today: ChatConversation[] = []
      const yesterday: ChatConversation[] = []
      const earlier: ChatConversation[] = []

      for (const item of list) {
        const d = dayjs(item.createdAt)
        if (d.isSame(now, 'day')) today.push(item)
        else if (d.isSame(now.subtract(1, 'day'), 'day')) yesterday.push(item)
        else earlier.push(item)
      }

      const groups: { label: string; items: ChatConversation[] }[] = []
      if (today.length) groups.push({ label: '今天', items: today })
      if (yesterday.length) groups.push({ label: '昨天', items: yesterday })
      if (earlier.length) groups.push({ label: '更早', items: earlier })
      return groups
    },
  },
  actions: {
    setModel(model: string) {
      this.currentModel = model
    },
    openModal() {
      this.isOpen = true
    },
    closeModal() {
      this.isOpen = false
    },
    toggleModal() {
      this.isOpen = !this.isOpen
    },
    // 统一更新本地会话标题，确保侧边栏列表和当前激活会话读取的是同一份状态。
    setConversationTitle(id: number | string, title: string) {
      const key = String(id)
      const conversationIndex = this.conversations.findIndex((item) => String(item.id) === key)
      if (conversationIndex === -1) return

      const list = [...this.conversations]
      list[conversationIndex] = {
        ...list[conversationIndex],
        title,
      }
      this.conversations = list
    },
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    },
    setNetworkOnline(online: boolean) {
      this.networkOnline = online
    },
    addPendingAttachment(attachment: ChatAttachment) {
      this.pendingAttachments = [...this.pendingAttachments, attachment]
    },
    updatePendingAttachment(id: string, patch: Partial<ChatAttachment>) {
      const index = this.pendingAttachments.findIndex((a) => a.id === id)
      if (index === -1) return
      const list = [...this.pendingAttachments]
      list[index] = { ...list[index], ...patch }
      this.pendingAttachments = list
    },
    removePendingAttachment(id: string) {
      this.pendingAttachments = this.pendingAttachments.filter((a) => a.id !== id)
    },
    clearPendingAttachments() {
      this.pendingAttachments = []
    },
    setConversationUnreadCount(id: number | string, unreadCount: number) {
      const key = String(id)
      const conversationIndex = this.conversations.findIndex((item) => String(item.id) === key)
      if (conversationIndex === -1) return

      const list = [...this.conversations]
      list[conversationIndex] = {
        ...list[conversationIndex],
        unreadCount: Math.max(0, Number(unreadCount) || 0),
      }
      this.conversations = list
    },
    // 持久化当前激活会话 + 是否处于新建会话模式，便于刷新后恢复
    persistActiveState() {
      writePersistedActiveState({
        activeConversationId: this.activeConversationId,
        isNewChatMode: this.isNewChatMode,
      })
    },
    // 初始化只做一次；具体是否在空列表时自动创建会话，由 options 控制。
    async ensureInitialized(options?: EnsureConversationOptions) {
      if (this.initialized && !options?.forceRefresh) return
      // 首次进入时先从 localStorage 恢复状态，让浏览器硬刷新也能保持上次会话或新建会话面板
      if (!this.initialized) {
        const persisted = readPersistedActiveState()
        if (persisted) {
          this.activeConversationId = persisted.activeConversationId
          this.isNewChatMode = persisted.isNewChatMode
        }
      }
      await this.loadConversations(options)
      this.initialized = true
    },
    // 拉取会话列表，并在需要时自动补建首个会话。
    async loadConversations(options?: EnsureConversationOptions) {
      const createIfEmpty = options?.createIfEmpty ?? true
      const currentActiveConversationId = this.activeConversationId
      const wasInNewChatMode = this.isNewChatMode

      try {
        const response = await getAiConversationList()
        this.conversations = pickArray(response).map(normalizeConversation)
      } catch {
        this.conversations = []
      }

      if (this.conversations.length === 0 && createIfEmpty) {
        await this.createConversation(options?.createOptions)
        return
      }

      if (currentActiveConversationId != null) {
        const matchedConversation = this.conversations.find((item) => String(item.id) === String(currentActiveConversationId))
        if (matchedConversation) {
          // 通过 switchConversation 复用懒加载消息逻辑，覆盖刷新后命中持久化 id 但内存无消息的场景
          await this.switchConversation(matchedConversation.id)
          return
        }
      }

      // 用户处于"新建会话但未发送"的空白状态时，保持新会话面板，避免被强制切到最新历史
      if (wasInNewChatMode) {
        this.isNewChatMode = true
        this.activeConversationId = null
        this.persistActiveState()
        return
      }

      if (this.conversations.length > 0) await this.switchConversation(this.conversations[0].id)
    },
    // 统一的会话创建入口，允许页面层透传业务上下文参数。
    async createConversation(options?: CreateConversationOptions) {
      const normalizedOptions = normalizeCreateConversationOptions(options)

      const response = await createAiConversation(normalizedOptions.payload)
      const conversation = normalizeConversation(pickObject(response))
      this.conversations.unshift(conversation)
      await this.switchConversation(conversation.id)
      return conversation
    },
    // 进入新建聊天模式：取消激活会话，展示空白对话窗口，等用户发送时再建会话。
    enterNewChatMode() {
      this.isNewChatMode = true
      this.activeConversationId = null
      this.persistActiveState()
    },
    // 切换会话时按需懒加载消息，避免初次进入一次性拉取全部历史。
    async switchConversation(id: number | string) {
      this.isNewChatMode = false
      this.activeConversationId = id
      this.persistActiveState()
      const targetConversation = this.conversations.find((item) => String(item.id) === String(id))

      if ((targetConversation?.unreadCount ?? 0) > 0) {
        void this.conversationUnreadCount(id)
      }

      // 每次切换都重拉：unreadCount 仅在 conversations 重拉时才会更新，
      // 在 dialog 已打开期间到达的新消息可能不会反映到该字段，缓存短路会漏读。
      // loadMessages 失败时保留旧缓存（见 loadMessages 注释），网络抖动安全。
      await this.loadMessages(id)
    },
    async conversationUnreadCount(id: number | string) {
      const key = String(id)
      const targetConversation = this.conversations.find((item) => String(item.id) === key)
      const previousUnreadCount = Math.max(0, Number(targetConversation?.unreadCount) || 0)
      if (!previousUnreadCount) return

      // 乐观更新：先本地清零让红点立即消失，请求失败再回滚
      this.setConversationUnreadCount(id, 0)

      try {
        const response = await conversationUnreadCount(id)
        const success = response?.data ?? response
        if (success === false) {
          this.setConversationUnreadCount(id, previousUnreadCount)
        }
      } catch (e) {
        this.setConversationUnreadCount(id, previousUnreadCount)
        console.warn('[ai] decrease unread failed, rolled back', e)
      }
    },
    // 消息接口失败时保留现有本地消息，避免把空态误写成欢迎语。
    async loadMessages(id: number | string) {
      const key = String(id)
      try {
        const response = await getAiMessageList(id)
        const list = pickArray(response).map(normalizeMessage)
        this.messages[key] = list
      } catch {
        this.messages[key] = this.messages[key] ?? []
      }
    },
    // 删除当前激活会话后，优先切到列表中的下一个；如果已空则保留零会话状态。
    async removeConversation(id: number | string) {
      await deleteAiConversation(id)

      this.conversations = this.conversations.filter((item) => String(item.id) !== String(id))
      delete this.messages[String(id)]
      delete this.conversationBusyMap[String(id)]

      if (String(this.activeConversationId) === String(id)) {
        if (this.conversations.length > 0) await this.switchConversation(this.conversations[0].id)
        else {
          this.activeConversationId = null
          this.persistActiveState()
        }
      }
    },
    // 发送消息时先落本地消息，再等待接口返回，保证界面响应及时。
    async sendMessage(content: string) {
      const question = content.trim()
      if (!question) return

      // 新建聊天模式：先调用创建接口，拿到真实 id 后再发送。
      if (!this.activeConversationId && this.isNewChatMode) {
        try {
          const response = await createCommonChatConversation()
          const conversation = normalizeConversation(pickObject(response))
          this.conversations.unshift(conversation)
          this.activeConversationId = conversation.id
          this.isNewChatMode = false
          this.persistActiveState()

          // 用首条消息作为会话标题，本地立即更新 + 后台同步到服务端，失败不阻断发送
          const derivedTitle = deriveTitleFromMessage(question)
          if (derivedTitle && derivedTitle !== conversation.title) {
            this.setConversationTitle(conversation.id, derivedTitle)
            void updateAiConversationTitle({ id: conversation.id, title: derivedTitle }).catch(() => {})
          }
        } catch (err: any) {
          ElMessage.error(`创建会话失败：${err?.msg ?? err?.message ?? '请稍后重试'}`)
          return
        }
      }

      if (!this.activeConversationId) return
      if (this.conversationBusyMap[String(this.activeConversationId)]) return
      const conversationId = this.activeConversationId
      const key = String(conversationId)
      const attachments = this.pendingAttachments.length > 0 ? [...this.pendingAttachments] : undefined
      const attachmentUrls = attachments?.filter((a) => a.url).map((a) => a.url!)
      const userMessage: ChatMessage = {
        id: createLocalId('msg'),
        role: 'user',
        content: question,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 'success',
        attachments,
      }
      const assistantMessage: ChatMessage = {
        id: createLocalId('msg'),
        role: 'assistant',
        content: '',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 'loading',
      }
      this.messages[key] = this.messages[key] ?? []
      this.messages[key].push(userMessage, assistantMessage)
      this.clearPendingAttachments()
      const updateAssistantMessage = (patch: Partial<ChatMessage>) => {
        const lastIndex = this.messages[key].length - 1
        const list = [...this.messages[key]]
        list[lastIndex] = {
          ...list[lastIndex],
          ...patch,
        }
        this.messages[key] = list
      }
      this.loading = true
      this.isStreaming = true

      try {
        try {
          const response = await sendAiChatMessage({
            conversationId,
            content: question,
            model: this.currentModel,
            attachments: attachmentUrls,
          })
          const payload = pickObject(response)
          if (typeof payload === 'string') {
            updateAssistantMessage({
              content: payload,
              status: 'success',
            })
          } else {
            updateAssistantMessage({
              content: payload?.content ?? payload?.reply ?? payload?.message ?? '已收到请求，但未返回可展示内容。',
              status: 'success',
            })
          }
        } catch (requestError: any) {
          updateAssistantMessage({
            content: `请求失败：${requestError?.msg ?? requestError?.message ?? '请稍后重试'}`,
            status: 'error',
          })
        }
      } catch (streamError: any) {
        updateAssistantMessage({
          content: assistantMessage.content || `请求失败：${streamError?.message ?? '响应异常'}`,
          status: 'error',
        })
      } finally {
        this.loading = false
        this.isStreaming = false
      }
    },
    setConversationBusy(
      conversationId: number | string,
      payload: {
        reason: ChatConversationBusyState['reason']
        message: string
        placeholderText?: string
      }
    ) {
      const key = String(conversationId)
      const placeholderMessageId = createLocalId('msg')
      const placeholderMessage: ChatMessage = {
        id: placeholderMessageId,
        role: 'assistant',
        content: payload.placeholderText ?? '',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 'loading',
      }

      this.messages[key] = this.messages[key] ?? []
      this.messages[key] = [...this.messages[key], placeholderMessage]
      this.conversationBusyMap[key] = {
        reason: payload.reason,
        message: payload.message,
        placeholderMessageId,
      }
    },
    finishConversationBusy(conversationId: number | string, content: string) {
      const key = String(conversationId)
      const busyState = this.conversationBusyMap[key]
      if (!busyState) return

      const nextContent = content.trim() || '已收到请求，但未返回可展示内容。'
      const list = [...(this.messages[key] ?? [])]
      const targetIndex = list.findIndex((item) => String(item.id) === String(busyState.placeholderMessageId))

      if (targetIndex >= 0) {
        list[targetIndex] = {
          ...list[targetIndex],
          content: nextContent,
          status: 'success',
        }
        this.messages[key] = list
      }

      delete this.conversationBusyMap[key]
    },
    async waitForConversationReply(
      conversationId: number | string,
      options?: {
        interval?: number
        maxAttempts?: number
      }
    ) {
      const key = String(conversationId)
      const interval = options?.interval ?? 5000
      const maxAttempts = options?.maxAttempts ?? 48

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        if (!this.conversationBusyMap[key]) return

        try {
          const response = await getAiMessageList(conversationId)
          const list = pickArray(response).map(normalizeMessage)
          const hasReply = list.some((item: ChatMessage) => item.role === 'assistant' && !!item.content.trim())

          if (hasReply) {
            this.messages[key] = list
            delete this.conversationBusyMap[key]
            return
          }
        } catch {
          // 轮询阶段忽略单次失败，避免短暂网络抖动直接打断等待态。
        }

        await sleep(interval)
      }

      const busyState = this.conversationBusyMap[key]
      const timeoutMessage =
        busyState?.reason === 'evaluation-research-report'
          ? 'AI调研报告结果等待超时，请稍后重新进入会话查看。'
          : '标题优化结果等待超时，请稍后重新进入会话查看。'
      this.failConversationBusy(conversationId, timeoutMessage)
    },
    failConversationBusy(conversationId: number | string, errorMessage: string) {
      const key = String(conversationId)
      const busyState = this.conversationBusyMap[key]
      if (!busyState) return

      const list = [...(this.messages[key] ?? [])]
      const targetIndex = list.findIndex((item) => String(item.id) === String(busyState.placeholderMessageId))

      if (targetIndex >= 0) {
        list[targetIndex] = {
          ...list[targetIndex],
          content: errorMessage.trim() || '请求失败，请稍后重试',
          status: 'error',
        }
        this.messages[key] = list
      }

      delete this.conversationBusyMap[key]
    },
    async handleCreateFeishuDoc(prompt?: string) {
      // 捕获目标会话 id：用户在请求过程中可能切换会话，loading 状态必须始终落在按钮所在的会话上
      const targetConversationId = this.activeConversationId
      if (!targetConversationId) return
      const key = String(targetConversationId)
      if (this.feishuDocCreatingMap[key]) return

      try {
        const response = await checkFeishuDoc()
        const canCreate = response?.data ?? response
        if (!canCreate) {
          const urlResponse = await getFeishuUrl(1)
          const url = urlResponse?.data ?? urlResponse

          this.feishuDocCreatingMap[key] = true
          ElMessage.info('飞书文档创建中')
          this.closeModal()

          // 跨 origin 场景下（内网入口写、外网 origin 回调）localStorage 不共享，pending 队列
          // 失效。改用 window.opener.postMessage：回调 tab 完成 token 交换后通知本 tab，本 tab
          // 用闭包里持有的 conversationId / prompt 直接发起 createFeishuDoc。
          let timeoutId!: ReturnType<typeof setTimeout>
          const handler = async (event: MessageEvent) => {
            if (event.data?.type !== 'feishu-doc-authorized') return
            // 仅信任来自外部 origin 的消息，避免本页脚本误触
            if (event.origin === window.location.origin) return
            window.removeEventListener('message', handler)
            clearTimeout(timeoutId)
            try {
              await createFeishuDoc(targetConversationId, prompt)
            } catch {
              ElMessage.error('飞书文档创建失败')
            } finally {
              delete this.feishuDocCreatingMap[key]
            }
          }
          window.addEventListener('message', handler)
          timeoutId = setTimeout(
            () => {
              window.removeEventListener('message', handler)
              delete this.feishuDocCreatingMap[key]
              ElMessage.warning('飞书授权等待超时，请重试')
            },
            10 * 60 * 1000
          )

          window.open(url, '_blank')
          return
        }

        this.feishuDocCreatingMap[key] = true
        ElMessage.info('飞书文档创建中')
        this.closeModal()

        await createFeishuDoc(targetConversationId, prompt)
        delete this.feishuDocCreatingMap[key]
      } catch {
        delete this.feishuDocCreatingMap[key]
        ElMessage.error('操作失败')
      }
    },
    // 重试发送失败的消息：移除失败的 assistant 消息，重新发送对应的 user 消息。
    async retryMessage(messageId: number | string) {
      if (!this.activeConversationId) return
      const key = String(this.activeConversationId)
      const list = [...(this.messages[key] ?? [])]
      const targetIndex = list.findIndex((item) => String(item.id) === String(messageId))
      if (targetIndex === -1) return

      // 找到对应的前一条 user 消息
      let userContent = ''
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (list[i].role === 'user') {
          userContent = list[i].content
          break
        }
      }
      if (!userContent) return

      // 移除失败的 assistant 消息
      list.splice(targetIndex, 1)
      this.messages[key] = list

      // 重新发送
      await this.sendMessage(userContent)
    },
    // 供页面卸载或重新进入时重置 AI 模块状态。
    resetState() {
      this.isOpen = true
      this.isStreaming = false
      this.loading = false
      this.initialized = false
      this.currentModel = 'gpt-4o-mini'
      this.conversations = []
      this.activeConversationId = null
      this.messages = {}
      this.conversationBusyMap = {}
      this.feishuDocCreatingMap = {}
      this.searchKeyword = ''
      this.pendingAttachments = []
      this.networkOnline = true
      this.isNewChatMode = false
      clearPersistedActiveState()
    },
  },
})
