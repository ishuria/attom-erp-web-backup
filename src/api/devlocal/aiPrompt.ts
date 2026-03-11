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
