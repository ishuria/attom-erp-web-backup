import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type { CreateConversationPayload } from '/@/type/ai/chat'

const AI_BASE_API = `${BASE_API}/ai`

/**
 * 获取 AI 会话列表
 * 用于初始化左侧会话栏数据。
 */
export const getAiConversationList = (id?: number | string) => {
  return request({
    url: `${AI_BASE_API}/conversations/list/${id}`,
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
 * 发送 AI 对话消息
 * 当前方法用于非流式问答场景，流式能力由独立的 stream 方法处理。
 * @param data.conversationId 会话 ID
 * @param data.content 用户输入内容
 * @param data.model 模型标识，可选
 */
export const sendAiChatMessage = (data: { conversationId: number | string; content: string; model?: string }) => {
  return request({
    url: `${AI_BASE_API}/conversations/${data.conversationId}/messages`,
    method: 'post',
    data,
  })
}
