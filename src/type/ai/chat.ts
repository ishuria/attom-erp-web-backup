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
 * AI 思考链步骤事件（结构化，前端友好）。
 *
 * 来源：
 * - 流式实时：SSE `step` 事件 payload（后端从 LangFlow 节点 / 工具事件解析后推送）
 * - 历史回放：GET /flow-trace 接口返回，由前端补充 summary / 转换 receivedAt
 */
export interface AiStreamStepEvent {
  stepType: 'vertex' | 'tool' | 'error' | string
  stepStatus: 'running' | 'success' | 'error' | string
  vertexId?: string
  vertexName?: string
  toolName?: string
  /**
   * 工具入参 JSON 字符串（仅工具步骤）。
   * 后端按 8KB 截断后推送，前端用 JSON.parse 美化后展示在工具行展开区。
   */
  stepInputs?: string
  /**
   * 步骤输出预览（仅 tool / vertex 步骤）。
   * SSE 推送按 1KB 截断作为流式预览，完整版由 fetchMessageFlowTrace 覆盖。
   */
  stepOutputs?: string
  /** 后端拼装的中文进度文案，可直接渲染 */
  summary?: string
  durationMs?: number
  errorMessage?: string
  stepOrder?: number
  /** 后端时间戳（ISO 8601 或毫秒） */
  timestamp?: string | number
  /** 前端接收时打的本地时间戳（毫秒），用于步间隔展示 */
  receivedAt?: number
}

/** GET /api/v1/ai/conversations/{cid}/messages/{requestId}/flow-trace 响应 row */
export interface AiFlowStepRow {
  id: number
  stepType: string
  stepStatus: string
  vertexId?: string
  vertexName?: string
  componentType?: string
  toolName?: string
  stepInputs?: string
  stepOutputs?: string
  stepLogs?: string
  errorMessage?: string
  durationMs?: number
  startTime?: string
  endTime?: string
  source?: string
  stepOrder?: number
  createdAt?: string
}

export interface ChatConversation {
  id: number | string
  title: string
  createdAt?: string
  /** 最近一条消息时间，用于列表显示和分组排序 */
  lastMessageAt?: string
  unreadCount?: number
  messageCount?: number
}

export interface ChatConversationBusyState {
  reason: 'chat' | 'title-optimization' | 'evaluation-research-report'
  message?: string
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
