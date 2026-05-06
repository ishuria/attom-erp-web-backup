import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  FavoritePromptAddPayload,
  FavoritePromptUpdatePayload,
} from '/@/type/ai/favoritePrompt'

/**
 * 查询当前登录用户的常用提示词列表
 */
export function listFavoritePrompts(params?: { category?: string }) {
  return request({
    url: `${BASE_API}/favorite/prompt/list`,
    method: 'get',
    params,
  })
}

/**
 * 新增一条常用提示词
 */
export function addFavoritePrompt(data: FavoritePromptAddPayload) {
  return request({
    url: `${BASE_API}/favorite/prompt/add`,
    method: 'post',
    data,
  })
}

/**
 * 修改一条常用提示词（增量更新，仅传非空字段）
 */
export function updateFavoritePrompt(data: FavoritePromptUpdatePayload) {
  return request({
    url: `${BASE_API}/favorite/prompt/update`,
    method: 'post',
    data,
  })
}

/**
 * 删除一条常用提示词
 */
export function deleteFavoritePrompt(id: number) {
  return request({
    url: `${BASE_API}/favorite/prompt/${id}`,
    method: 'delete',
  })
}
