export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id?: number | string
  role: ChatRole
  content: string
  createdAt?: string
  status?: 'loading' | 'success' | 'error'
}

export interface ChatConversation {
  id: number | string
  title: string
  createdAt?: string
  unreadCount?: number
}

export interface ChatConversationBusyState {
  reason: 'chat' | 'title-optimization' | 'evaluation-research-report'
  message: string
  placeholderMessageId?: number | string
}

export interface CreateConversationPayload {
  operationSkuId?: number | string
  [key: string]: any
}

export interface EvaluationResearchReportPayload {
  evaluationId: number
  productName: string
  competitorAsin?: string
  coreKeyWord?: string
  count: number
  userIdea?: string
}

export interface CreateConversationOptions {
  payload?: CreateConversationPayload
}

export interface EnsureConversationOptions {
  createIfEmpty?: boolean
  createOptions?: CreateConversationOptions
  forceRefresh?: boolean
}

export interface ChatModuleConfig {
  enabled?: boolean
  defaultModel?: string
  showLauncher?: boolean
  title?: string
  welcomeMessage?: string
  enableConversation?: boolean
  placement?: 'bottom-right'
}
