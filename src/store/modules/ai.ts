import dayjs from 'dayjs'
import {
  createAiConversation,
  deleteAiConversation,
  getAiConversationList,
  getAiMessageList,
  sendAiChatMessage,
  updateAiConversationTitle,
} from '/@/api/devlocal/ai'
import type { ChatConversation, ChatMessage } from '/@/type/ai/chat'
import { streamAiMessage } from '/@/utils/aiStream'

const createLocalId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

const normalizeConversation = (item: any): ChatConversation => ({
  id: item?.id ?? createLocalId('conv'),
  title: item?.title ?? '新建对话',
  createdAt: item?.createdAt ?? item?.createTime ?? dayjs().format('YYYY-MM-DD HH:mm:ss'),
})

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

const pickObject = (response: any) => response?.data ?? response ?? {}

const createWelcomeMessage = (): ChatMessage => ({
  id: createLocalId('msg'),
  role: 'assistant',
  content: '您好，我是 标题优化 助手。请输入您的问题，我会尽力为您提供帮助。',
  createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  status: 'success',
})

export const useAiStore = defineStore('ai', {
  state: () => ({
    isOpen: true,
    isStreaming: false,
    loading: false,
    initialized: false,
    currentModel: 'gpt-4o-mini',
    conversations: [] as ChatConversation[],
    activeConversationId: null as number | string | null,
    messages: {} as Record<string, ChatMessage[]>,
  }),
  getters: {
    activeConversation(state) {
      return state.conversations.find((item) => String(item.id) === String(state.activeConversationId))
    },
    activeMessages(state) {
      const key = state.activeConversationId == null ? '' : String(state.activeConversationId)
      return key ? (state.messages[key] ?? []) : []
    },
    canSend(state) {
      return !state.loading && !state.isStreaming && !!state.activeConversationId
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
    async ensureInitialized() {
      if (this.initialized) return
      await this.loadConversations()
      this.initialized = true
    },
    async loadConversations() {
      try {
        const response = await getAiConversationList()
        this.conversations = pickArray(response).map(normalizeConversation)
      } catch {
        this.conversations = []
      }

      if (this.conversations.length === 0) {
        await this.createConversation()
        return
      }

      if (!this.activeConversationId) await this.switchConversation(this.conversations[0].id)
    },
    async createConversation() {
      try {
        const response = await createAiConversation()
        const conversation = normalizeConversation(pickObject(response))
        this.conversations.unshift(conversation)
        await this.switchConversation(conversation.id)
        return
      } catch {}

      const fallbackConversation = {
        id: createLocalId('conv'),
        title: '新建对话',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
      this.conversations.unshift(fallbackConversation)
      this.activeConversationId = fallbackConversation.id
      this.messages[String(fallbackConversation.id)] = [createWelcomeMessage()]
    },
    async switchConversation(id: number | string) {
      this.activeConversationId = id
      const key = String(id)
      if (!this.messages[key]) await this.loadMessages(id)
    },
    async loadMessages(id: number | string) {
      const key = String(id)
      try {
        const response = await getAiMessageList(id)
        const list = pickArray(response).map(normalizeMessage)
        this.messages[key] = list.length > 0 ? list : [createWelcomeMessage()]
      } catch {
        this.messages[key] = this.messages[key] ?? [createWelcomeMessage()]
      }
    },
    async removeConversation(id: number | string) {
      await deleteAiConversation(id)

      this.conversations = this.conversations.filter((item) => String(item.id) !== String(id))
      delete this.messages[String(id)]

      if (String(this.activeConversationId) === String(id)) {
        if (this.conversations.length > 0) await this.switchConversation(this.conversations[0].id)
        else await this.createConversation()
      }
    },
    async updateTitleIfNeeded(conversationId: number | string, content: string) {
      const key = String(conversationId)
      const visibleMessages = (this.messages[key] ?? []).filter((item) => item.role !== 'system')
      if (visibleMessages.length > 2) return

      const title = content.trim().slice(0, 20) || '新建对话'
      const current = this.conversations.find((item) => String(item.id) === key)
      if (current) current.title = title

      try {
        await updateAiConversationTitle({ id: conversationId, title })
      } catch {}
    },
    async sendMessage(content: string) {
      const question = content.trim()
      if (!question) return

      if (!this.activeConversationId) await this.createConversation()
      if (!this.activeConversationId) return

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
      this.loading = true
      this.isStreaming = true

      let hasStreamChunk = false

      try {
        // 优先走流式接口；若当前后端未提供该能力，再自动回退到普通消息接口。
        await streamAiMessage(
          {
            conversationId,
            content: question,
            model: this.currentModel,
          },
          {
            onChunk: (chunk) => {
              hasStreamChunk = true
              assistantMessage.content += chunk
            },
            onDone: () => {
              assistantMessage.status = 'success'
            },
            onError: (message) => {
              throw new Error(message)
            },
          }
        )
      } catch (streamError: any) {
        if (!hasStreamChunk) {
          try {
            const response = await sendAiChatMessage({
              conversationId,
              content: question,
              model: this.currentModel,
            })
            const payload = pickObject(response)
            assistantMessage.content = payload?.content ?? payload?.reply ?? payload?.message ?? '已收到请求，但未返回可展示内容。'
            assistantMessage.status = 'success'
          } catch (requestError: any) {
            assistantMessage.content = `请求失败：${requestError?.msg ?? requestError?.message ?? '请稍后重试'}`
            assistantMessage.status = 'error'
          }
        } else {
          assistantMessage.content = assistantMessage.content || `请求失败：${streamError?.message ?? '流式响应异常'}`
          assistantMessage.status = 'error'
        }
      } finally {
        this.loading = false
        this.isStreaming = false
      }

      await this.updateTitleIfNeeded(conversationId, question)
    },
    resetState() {
      this.isOpen = true
      this.isStreaming = false
      this.loading = false
      this.initialized = false
      this.currentModel = 'gpt-4o-mini'
      this.conversations = []
      this.activeConversationId = null
      this.messages = {}
    },
  },
})
