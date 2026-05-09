export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
}

export interface ChatMessage {
  id?: number | string
  role: ChatRole
  content: string
  createdAt?: string
  status?: 'loading' | 'success' | 'error'
  attachments?: ChatAttachment[]
  /** 关联本次流式请求；用于查询历史思考过程（user / assistant 共享同一 requestId） */
  requestId?: string
  /** 后端是否记录到思考过程事件。为 false 时前端不展示"查看思考过程"按钮 */
  hasProgress?: boolean
}

/**
 * LangFlow 原始过程事件（来自 SSE progress 帧 data 或 GET /progress 响应解构后形态）。
 *
 * - SSE 实时模式：event = 'progress' 帧的 data 解析后即此结构
 * - 历史回放模式：GET /progress 接口的 row 解构后转成此结构
 */
export interface LangFlowProgressEvent {
  /** vertices_sorted / build_start / add_message / log / end_vertex / end / error 等 */
  event: string
  /** 不同 event 对应不同 data 结构，前端按 event 类型解析 */
  data: any
  /**
   * 事件接收/记录时间（毫秒 epoch）。用于面板展示总耗时与每步间隔。
   * - 流式中 = store 在 onProgress 收到事件时打的本地时间戳
   * - 历史回放 = 后端 ai_chat_message_progress.created_at 转 ms
   */
  receivedAt?: number
}

/** GET /api/v1/ai/conversations/{cid}/messages/{requestId}/progress 响应 row */
export interface AiMessageProgress {
  id: number
  eventType: string
  /** 原始事件 data JSON 字符串，前端用 JSON.parse 解构 */
  eventData: string
  createdAt: string
}

export interface ChatConversation {
  id: number | string
  title: string
  createdAt?: string
  unreadCount?: number
  messageCount?: number
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
