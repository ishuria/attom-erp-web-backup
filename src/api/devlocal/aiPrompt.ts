import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

/**
 * 获取AI提示词配置列表
 */
export function getAiPromptList(params?: any) {
  return request({
    url: `${BASE_API}/prompt/config/list`,
    method: 'get',
    params,
  })
}

/**
 * 新增AI提示词配置
 */
export function addAiPrompt(data?: any) {
  return request({
    url: `${BASE_API}/prompt/config/add`,
    method: 'post',
    data,
  })
}

/**
 * 修改用户自定义提示词
 */
export function updateUserPrompt(data?: any) {
  return request({
    url: `${BASE_API}/prompt/config/update`,
    method: 'post',
    data,
  })
}

/**
 * 删除AI提示词
 */
export function deleteAiPrompt(id: number) {
  return request({
    url: `${BASE_API}/ai/prompt/delete/${id}`,
    method: 'delete',
  })
}

/**
 * 保存为新版本
 */
export function savePromptConfigVersion(data: { configId: number; prompt: string; remark?: string }) {
  return request({
    url: `${BASE_API}/prompt/config/save-version`,
    method: 'post',
    data,
  })
}

/**
 * 查询历史版本列表
 */
export function getPromptConfigHistory(configId: number) {
  return request({
    url: `${BASE_API}/prompt/config/history`,
    method: 'get',
    params: { configId },
  })
}

/**
 * 删除历史版本
 */
export function deletePromptConfigHistory(id: number) {
  return request({
    url: `${BASE_API}/prompt/config/history/${id}`,
    method: 'delete',
  })
}

/**
 * 回滚历史版本
 */
export function rollbackPromptConfig(data: { configId: number; historyId: number }) {
  return request({
    url: `${BASE_API}/prompt/config/rollback`,
    method: 'post',
    data,
  })
}

/**
 * 修改提示词负责人（仅 BOSS）
 */
export function updatePromptConfigOwner(data: { flowComponentId: number; ownerUserId: number | null }) {
  return request({
    url: `${BASE_API}/prompt/config/owner`,
    method: 'post',
    data,
  })
}

/**
 * 提示词功能 + 负责人 列表（BOSS 负责人管理面板用）
 */
export function getFlowComponentOwnerList(params?: { functionName?: string }) {
  return request({
    url: `${BASE_API}/prompt/flow-component/list`,
    method: 'get',
    params,
  })
}
