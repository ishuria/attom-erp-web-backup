import dayjs from 'dayjs'
import { createAiConversation, deleteAiConversation, getAiConversationList, getAiMessageList, sendAiChatMessage } from '/@/api/devlocal/ai'

import type {
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
})

// 消息列表也做同样的字段归一，减少视图层判断分支。
const normalizeMessage = (item: any): ChatMessage => ({
  id: item?.id ?? createLocalId('msg'),
  role: item?.role ?? 'assistant',
  content: item?.content ?? '',
  createdAt: item?.createdAt ?? item?.createTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
  status: item?.status ?? 'success',
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
      return key ? state.conversationBusyMap[key] ?? null : null
    },
    // 没有激活会话或请求进行中时，不允许发送。
    canSend(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return !state.loading && !state.isStreaming && !state.conversationBusyMap[key] && !!state.activeConversationId
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
    // 初始化只做一次；具体是否在空列表时自动创建会话，由 options 控制。
    async ensureInitialized(options?: EnsureConversationOptions) {
      if (this.initialized && !options?.forceRefresh) return
      await this.loadConversations(options)
      this.initialized = true
    },
    // 拉取会话列表，并在需要时自动补建首个会话。
    async loadConversations(options?: EnsureConversationOptions) {
      const createIfEmpty = options?.createIfEmpty ?? true
      const currentActiveConversationId = this.activeConversationId

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
          this.activeConversationId = matchedConversation.id
          return
        }
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
    // 切换会话时按需懒加载消息，避免初次进入一次性拉取全部历史。
    async switchConversation(id: number | string) {
      this.activeConversationId = id
      const key = String(id)
      if (!this.messages[key]) await this.loadMessages(id)
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
        else this.activeConversationId = null
      }
    },
    // 发送消息时先落本地消息，再等待接口返回，保证界面响应及时。
    async sendMessage(content: string) {
      const question = content.trim()
      if (!question) return

      if (!this.activeConversationId) return
      if (this.conversationBusyMap[String(this.activeConversationId)]) return
      const conversationId = this.activeConversationId
      const key = String(conversationId)
      const userMessage: ChatMessage = {
        id: createLocalId('msg'),
        role: 'user',
        content: question,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 'success',
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

      this.failConversationBusy(conversationId, '标题优化结果等待超时，请稍后重新进入会话查看。')
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
    },
  },
})
