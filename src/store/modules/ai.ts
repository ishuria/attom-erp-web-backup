import dayjs from 'dayjs'
import {
  cancelAiStream,
  checkFeishuDoc,
  createAiConversation,
  createCommonChatConversation,
  createFeishuDoc,
  conversationUnreadCount,
  deleteAiConversation,
  getAiConversationList,
  getAiMessageFlowTrace,
  getAiMessageList,
  getFeishuUrl,
  updateAiConversationTitle,
} from '/@/api/devlocal/ai'
import { streamAiMessage } from '/@/utils/aiStream'

import type {
  AiFlowStepRow,
  AiStreamStepEvent,
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
  lastMessageAt: item?.lastMessageAt ?? undefined,
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
  // 后端 messageStatus=ERROR 时 status 由调用层另行判断，这里仅透传 requestId 关联思考过程
  requestId: item?.requestId ?? undefined,
  // 后端按会话级 DISTINCT request_id 标记是否存在过程事件；旧消息或 build 失败的消息会是 false
  hasProgress: typeof item?.hasProgress === 'boolean' ? item.hasProgress : undefined,
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

// 安全 JSON.parse：失败时返回原字符串，避免 progress eventData 异常时整面板报错
const safeJsonParse = (raw: any): any => {
  if (raw == null) return null
  if (typeof raw !== 'string') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

const normalizeCreateConversationOptions = (options?: CreateConversationOptions): CreateConversationOptions => ({
  payload: options?.payload ? { ...options.payload } : undefined,
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 与后端 buildStepSummary 对齐的思考链文案拼装，给 fetchMessageFlowTrace 拉到的
 * 历史 row（无 summary 字段）补一份本地文案，保证历史与实时展示一致。
 */
const buildStepSummary = (
  stepType: string,
  stepStatus: string,
  vertexName?: string,
  vertexId?: string,
  toolName?: string,
  durationMs?: number,
  errorMessage?: string
): string => {
  const name = vertexName || vertexId || '未知节点'
  const tool = toolName || '未知工具'
  if (stepType === 'error') {
    return `流程异常: ${errorMessage || '(无详情)'}`
  }
  if (stepType === 'tool') {
    if (stepStatus === 'error') return `工具 ${tool} 调用失败`
    return durationMs == null ? `已调用工具 ${tool}` : `已调用工具 ${tool} (${durationMs}ms)`
  }
  // vertex
  if (stepStatus === 'running') return `正在执行 ${name}...`
  if (stepStatus === 'error') return `${name} 执行失败`
  if (durationMs == null) return `${name} 已完成`
  return `${name} 已完成 (${(durationMs / 1000).toFixed(1)}s)`
}

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
    // 按 conversationId 隔离的流式/loading 状态，支持多会话并行
    streamingMap: {} as Record<string, boolean>,
    loadingMap: {} as Record<string, boolean>,
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
    // 按 conversationId 隔离的"思考链"步骤事件（vertex / tool / error，含 summary 文案）
    liveStepsMap: {} as Record<string, AiStreamStepEvent[]>,
    // 历史思考链缓存：key = requestId（来自 GET /flow-trace）
    stepsCache: {} as Record<string, AiStreamStepEvent[]>,
    // 按 conversationId 隔离的 AbortController，用于"停止"按钮中断 fetch
    abortControllerMap: {} as Record<string, AbortController>,
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
    activeIsStreaming(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? !!state.streamingMap[key] : false
    },
    activeLoading(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? !!state.loadingMap[key] : false
    },
    activeLiveSteps(state): AiStreamStepEvent[] {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? (state.liveStepsMap[key] ?? []) : []
    },
    // 没有激活会话或请求进行中时，不允许发送。
    canSend(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return !!key && !state.loadingMap[key] && !state.streamingMap[key] && !state.conversationBusyMap[key]
    },
    // 基于搜索关键词过滤会话列表。
    filteredConversations(state) {
      const keyword = state.searchKeyword.trim().toLowerCase()
      if (!keyword) return state.conversations
      return state.conversations.filter((item) => item.title.toLowerCase().includes(keyword))
    },
    // 按 lastMessageAt（无则回退 createdAt）分为今天/昨天/更早三组。
    groupedConversations() {
      const list = this.filteredConversations
      const now = dayjs()
      const today: ChatConversation[] = []
      const yesterday: ChatConversation[] = []
      const earlier: ChatConversation[] = []

      for (const item of list) {
        const d = dayjs(item.lastMessageAt ?? item.createdAt)
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
      // 不再 early return：本地 unreadCount=0 不代表后端真的是 0。
      // 例如 sendMessage 流式刚结束，后端 addConversationUnreadCount 已 +1，
      // 但前端 conversations 列表此刻仍是过期快照，必须强行触发后端 markRead + WebSocket 推送。
      // switchConversation 路径在外层已做 `unreadCount > 0` 预判，不会受影响。

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
      // setConversationBusy 注入的本地占位（id=local-xxx）不在服务端列表里，
      // 流式期间若被全量覆盖，streamConversationReply 的 updatePlaceholder 会按 id 找不到目标、
      // 静默丢弃后续 chunk，UI 看似"不流式"。finishConversationBusy 清掉 busyMap 后，
      // 下一次调用会正常拉到持久化的最终消息。
      if (this.conversationBusyMap[key]) return
      try {
        const response = await getAiMessageList(id)
        const list = pickArray(response).map(normalizeMessage)
        this.messages[key] = list
      } catch {
        this.messages[key] = this.messages[key] ?? []
      }
    },
    /**
     * 拉取指定 requestId 的 Flow 执行链路（结构化思考链步骤，带内存缓存）。
     *
     * - 命中 stepsCache → 直接返回
     * - 否则调 GET /messages/{requestId}/flow-trace，转为 AiStreamStepEvent[] 后缓存返回
     * - 老消息（progress_detail 表上线前）返回空数组，由面板显示"无思考过程数据"
     * - force=true：强制覆盖现有缓存，用于流式结束后用完整版替换 SSE 推送的预览版
     */
    async fetchMessageFlowTrace(conversationId: number | string, requestId: string, force = false): Promise<AiStreamStepEvent[]> {
      if (!requestId) return []
      if (!force && this.stepsCache[requestId]) return this.stepsCache[requestId]
      try {
        const response = await getAiMessageFlowTrace(conversationId, requestId)
        const rows = pickArray(response) as AiFlowStepRow[]
        const steps: AiStreamStepEvent[] = rows.map((r) => {
          const startTime = r.startTime ? new Date(r.startTime).getTime() : undefined
          const createdAt = r.createdAt ? new Date(r.createdAt).getTime() : undefined
          // 工具步骤携带入参，工具 / vertex 步骤都带出参（供详情 tab 展示）
          const supportsIO = r.stepType === 'tool' || r.stepType === 'vertex'
          return {
            stepType: r.stepType,
            stepStatus: r.stepStatus,
            vertexId: r.vertexId,
            vertexName: r.vertexName,
            toolName: r.toolName,
            stepInputs: r.stepType === 'tool' ? r.stepInputs : undefined,
            stepOutputs: supportsIO ? r.stepOutputs : undefined,
            // 历史接口没有 summary，前端复刻后端模板规则补一份
            summary: buildStepSummary(r.stepType, r.stepStatus, r.vertexName, r.vertexId, r.toolName, r.durationMs, r.errorMessage),
            durationMs: r.durationMs,
            errorMessage: r.errorMessage,
            stepOrder: r.stepOrder,
            timestamp: r.startTime ?? r.createdAt,
            receivedAt: startTime ?? createdAt,
          }
        })
        this.stepsCache[requestId] = steps
        return steps
      } catch {
        return []
      }
    },
    /**
     * 主动取消当前活动会话的流式调用（"停止"按钮）。
     *
     * 顺序：先调后端 cancel API（让 LangFlow 端 flow 真正终止），再 abort 本地 fetch。
     * 原因：abort 会触发后端 emitter onError(Broken pipe)，按"客户端断开"分支处理（不取消 handle），
     * 必须先走显式 cancel API 才能取消 LangFlow。
     */
    async cancelStream(conversationId?: number | string) {
      const cid = conversationId ?? this.activeConversationId
      if (!cid) return
      const key = String(cid)
      try {
        await cancelAiStream(cid)
      } catch (e) {
        console.warn('[ai] cancel API 失败', e)
      }
      this.abortControllerMap[key]?.abort()
      delete this.abortControllerMap[key]
    },
    // 删除当前激活会话后，优先切到列表中的下一个；如果已空则保留零会话状态。
    async removeConversation(id: number | string) {
      await deleteAiConversation(id)

      const idKey = String(id)
      this.conversations = this.conversations.filter((item) => String(item.id) !== idKey)
      delete this.messages[idKey]
      delete this.conversationBusyMap[idKey]
      // 流式相关状态全部清理，并中止正在进行的 fetch
      this.abortControllerMap[idKey]?.abort()
      delete this.abortControllerMap[idKey]
      delete this.streamingMap[idKey]
      delete this.loadingMap[idKey]
      delete this.liveStepsMap[idKey]

      if (String(this.activeConversationId) === idKey) {
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
      // 文字与附件至少有一项非空才发送（仅图片场景：question 空但 pendingAttachments 非空）
      if (!question && this.pendingAttachments.length === 0) return

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
      this.loadingMap[key] = true
      this.streamingMap[key] = true
      // 重置该会话的思考过程实时面板，确保新一轮流式不会显示上次残留事件
      this.liveStepsMap[key] = []
      // 创建 AbortController 让"停止"按钮能中断 fetch；旧的（理论上不会有）先 abort 防御
      this.abortControllerMap[key]?.abort()
      const abortController = new AbortController()
      this.abortControllerMap[key] = abortController

      let accumulated = ''
      try {
        await streamAiMessage(
          {
            conversationId,
            content: question,
            model: this.currentModel,
            attachments: attachmentUrls,
          },
          {
            onChunk: (chunk) => {
              accumulated += chunk
              updateAssistantMessage({ content: accumulated })
            },
            onStep: (step) => {
              // 结构化思考链步骤：按会话 key 累积，前端 panel 实时渲染
              this.liveStepsMap[key] = [...(this.liveStepsMap[key] ?? []), { ...step, receivedAt: Date.now() }]
            },
            onDone: (payload) => {
              updateAssistantMessage({
                content: accumulated || payload?.content || '已收到请求，但未返回可展示内容。',
                status: 'success',
              })
            },
            onError: (message) => {
              updateAssistantMessage({
                content: accumulated || `请求失败：${message}`,
                status: 'error',
              })
            },
          },
          abortController.signal
        )
      } catch (streamError: any) {
        const lastIndex = this.messages[key].length - 1
        if (this.messages[key][lastIndex]?.status !== 'error') {
          updateAssistantMessage({
            content: accumulated || `请求失败：${streamError?.message ?? '响应异常'}`,
            status: 'error',
          })
        }
      } finally {
        delete this.loadingMap[key]
        delete this.streamingMap[key]
        // 仅当本次 controller 仍然挂在 map 上才清掉（避免覆盖后续新发起的 sendMessage）
        if (this.abortControllerMap[key] === abortController) {
          delete this.abortControllerMap[key]
        }

        // 流式结束后 reload 消息（让本地 assistant 消息拿到真实 requestId），
        // 并把 liveSteps 缓存到 stepsCache，避免用户立即点击"查看思考过程"再走一次接口
        const cachedSteps = [...(this.liveStepsMap[key] ?? [])]
        delete this.liveStepsMap[key]
        try {
          await this.loadMessages(conversationId)
          if (cachedSteps.length > 0) {
            const list = this.messages[key] ?? []
            const lastAssistant = [...list].reverse().find((m) => m.role === 'assistant')
            if (lastAssistant?.requestId) {
              this.stepsCache[lastAssistant.requestId] = cachedSteps
              // 后端 progress 落库为 fire-and-forget，reload 时 DISTINCT 查询可能还未读到刚写入的行，
              // 这里强制将刚结束流式的消息标为 hasProgress=true，避免按钮抖动消失/出现
              lastAssistant.hasProgress = true
              // 异步用 /flow-trace 完整版替换 SSE 推送的预览版（不阻塞，不 await）
              // 流结束后用户再点开「详情」时能看到完整 outputs（去掉截断尾巴）
              this.fetchMessageFlowTrace(conversationId, lastAssistant.requestId, true).catch(() => {})
            }
          }
        } catch {
          // reload 失败不影响主流程：用户再点开会自己走 historic API
        }
      }
    },
    setConversationBusy(
      conversationId: number | string,
      payload: {
        reason: ChatConversationBusyState['reason']
        message?: string
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

      // 先标 busy 再 push 占位：让任何并发的 loadMessages 在 push 前就被 busyMap 守卫拦住。
      this.conversationBusyMap[key] = {
        reason: payload.reason,
        message: payload.message,
        placeholderMessageId,
      }
      this.messages[key] = this.messages[key] ?? []
      this.messages[key] = [...this.messages[key], placeholderMessage]
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
    // 流式接收任意"已通过 setConversationBusy 占位"的会话回复，把 chunk 写入占位 assistant 消息。
    // 与 waitForConversationReply 处于同一调用位置，但走 SSE 流式而非轮询。
    // 用于研报、标题优化等"会话由后端创建 + 前端只等 assistant 首条回复"的场景。
    async streamConversationReply(conversationId: number | string) {
      const key = String(conversationId)
      const busyState = this.conversationBusyMap[key]
      if (!busyState) return

      const placeholderMessageId = busyState.placeholderMessageId

      // 若中途 messages[key] 被全量覆盖（如外部刷新绕过 busy 守卫），按 id 找不到占位时回退重新 append，避免静默丢 chunk。
      const updatePlaceholder = (patch: Partial<ChatMessage>) => {
        const list = [...(this.messages[key] ?? [])]
        const idx = list.findIndex((item) => String(item.id) === String(placeholderMessageId))
        if (idx === -1) {
          list.push({
            id: placeholderMessageId,
            role: 'assistant',
            content: '',
            status: 'loading',
            ...patch,
          })
        } else {
          list[idx] = { ...list[idx], ...patch }
        }
        this.messages[key] = list
      }

      this.streamingMap[key] = true
      this.loadingMap[key] = true
      this.liveStepsMap[key] = []

      let accumulated = ''
      try {
        await streamAiMessage(
          { conversationId },
          {
            onChunk: (chunk) => {
              accumulated += chunk
              updatePlaceholder({ content: accumulated })
            },
            onStep: (step) => {
              this.liveStepsMap[key] = [...(this.liveStepsMap[key] ?? []), step]
            },
            onDone: (payload) => {
              const finalContent = accumulated || (typeof payload === 'object' ? payload?.content : '') || ''
              this.finishConversationBusy(conversationId, finalContent)
            },
            onError: (message) => {
              this.failConversationBusy(conversationId, accumulated || `请求失败：${message}`)
            },
          }
        )
      } catch (streamError: any) {
        // streamAiMessage 内部已通过 onError 标记失败，这里仅在仍处忙碌态时兜底，避免遗留 busy 状态。
        if (this.conversationBusyMap[key]) {
          this.failConversationBusy(conversationId, accumulated || `请求失败：${streamError?.message ?? '响应异常'}`)
        }
      } finally {
        delete this.streamingMap[key]
        delete this.loadingMap[key]
        delete this.liveStepsMap[key]
      }
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
      // 中止所有遗留 fetch
      for (const key of Object.keys(this.abortControllerMap)) {
        this.abortControllerMap[key]?.abort()
      }
      this.streamingMap = {}
      this.loadingMap = {}
      this.liveStepsMap = {}
      this.abortControllerMap = {}
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
