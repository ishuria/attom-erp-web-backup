import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type { CreateConversationPayload, EvaluationResearchReportPayload } from '/@/type/ai/chat'

const AI_BASE_API = `${BASE_API}/ai`

/**
 * 获取 AI 会话列表
 * 用于初始化左侧会话栏数据。
 */
export const getAiConversationList = () => {
  return request({
    url: `${AI_BASE_API}/conversations/list`,
    method: 'get',
  })
}

/**
 * 创建 AI 会话
 * 用于首次进入或主动新建会话时生成新的会话记录。
 */
export const createAiConversation = (data?: CreateConversationPayload) => {
  return request({
    url: `${AI_BASE_API}/conversations/add`,
    method: 'post',
    data,
  })
}

/**
 * 新建聊天模式下创建会话（通用聊天）
 * 无需传递参数，后端自动生成会话。
 */
export const createCommonChatConversation = () => {
  return request({
    url: `${AI_BASE_API}/conversations/common/chat/add`,
    method: 'post',
  })
}

/**
 * 新款评估-生成 AI 调研报告会话
 */
export const createEvaluationResearchReportConversation = (data: EvaluationResearchReportPayload) => {
  return request({
    url: `${AI_BASE_API}/conversations/evaluation/add`,
    method: 'post',
    data,
  })
}

/**
 * 删除指定 AI 会话
 * @param id 会话 ID
 */
export const deleteAiConversation = (id: number | string) => {
  return request({
    url: `${AI_BASE_API}/conversations/${id}`,
    method: 'post',
  })
}

/**
 * 获取指定会话的消息列表
 * @param conversationId 会话 ID
 */
export const getAiMessageList = (conversationId: number | string) => {
  return request({
    url: `${AI_BASE_API}/conversations/${conversationId}/messages`,
    method: 'get',
  })
}

/**
 * 主动取消指定会话当前活动的流式调用（"停止"按钮路径）。
 * 后端通过 AiStreamRegistry 找到对应 UpstreamCallHandle，
 * build 模式会自动调 LangFlow {@code POST /api/v1/build/{job_id}/cancel}。
 */
export const cancelAiStream = (conversationId: number | string) => {
  return request({
    url: `${AI_BASE_API}/conversations/${conversationId}/cancel`,
    method: 'post',
  })
}

/**
 * 拉取指定 requestId 的 LangFlow 思考过程事件历史。
 *
 * 返回 row 列表（{id, eventType, eventData, createdAt}），按 id 升序（即接收顺序）。
 * eventData 是 LangFlow 原始事件 data 字段的 JSON 字符串，调用方需 JSON.parse 后使用。
 *
 * @param conversationId 会话 ID
 * @param requestId 来自 ChatMessage.requestId（user/assistant 共享同一 requestId）
 */
export const getAiMessageProgress = (conversationId: number | string, requestId: string) => {
  return request({
    url: `${AI_BASE_API}/conversations/${conversationId}/messages/${requestId}/progress`,
    method: 'get',
  })
}

/**
 * 更新会话标题
 * @param data.id 会话 ID
 * @param data.title 新的会话标题
 */
export const updateAiConversationTitle = (data: { id: number | string; title: string }) => {
  return request({
    url: `${AI_BASE_API}/conversations/${data.id}/title`,
    method: 'post',
    data: {
      title: data.title,
    },
  })
}

/**
 * 减少指定 AI 会话未读消息数量
 * @param conversationId 会话 ID
 */
export const conversationUnreadCount = (conversationId: number | string) => {
  return request({
    url: `${AI_BASE_API}/conversations/${conversationId}/unread-count`,
    method: 'post',
  })
}

/**
 * 发送 AI 对话消息
 * 当前方法用于非流式问答场景，流式能力由独立的 stream 方法处理。
 * @param data.conversationId 会话 ID
 * @param data.content 用户输入内容
 * @param data.model 模型标识，可选
 */
export const sendAiChatMessage = (data: { conversationId: number | string; content?: string; model?: string; attachments?: string[] }) => {
  return request({
    url: `${AI_BASE_API}/conversations/${data.conversationId}/messages`,
    method: 'post',
    data,
  })
}

export const checkFeishuDoc = () => {
  return request({ url: `${AI_BASE_API}/conversations/create/feishu/doc/check`, method: 'get' })
}

export const getFeishuUrl = (id: number | string = 1) => {
  return request({ url: `${BASE_API}/btn/fei_shu/url/${id}`, method: 'get' })
}

export const createFeishuDoc = (conversationId: number | string, prompt?: string) => {
  return request({
    url: `${AI_BASE_API}/conversations/create/feishu/doc`,
    method: 'post',
    data: { conversationId, prompt },
  })
}

/**
 * 上传多个文件（图片/附件）
 * 返回文件路径列表
 */
export const uploadAiFiles = (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return request({
    url: `${BASE_API}/ai/image/uploads`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 批量删除 AI 文件
 * @param fileUrls 文件完整 URL 列表
 */
export const deleteAiFiles = (fileUrls: string[]) => {
  return request({
    url: `${BASE_API}/ai/image/deletes`,
    method: 'post',
    data: fileUrls,
  })
}
