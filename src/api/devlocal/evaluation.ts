import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

export function getList(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/list`,
    method: 'get',
    params,
  })
}

export function getEvaluationById(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/getById`,
    method: 'get',
    params,
  })
}

export function getEvaluationTrendList(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/getTrendList`,
    method: 'get',
    params,
  })
}

export function getEvaluationCostParameter(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/getCostParameter`,
    method: 'get',
    params,
  })
}

export function getEvaluationScoreParameter(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/score`,
    method: 'get',
    params,
  })
}

export function getEvaluationScoreDetail(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/score/detail`,
    method: 'get',
    params,
  })
}


export function getEvaluationShareInfo(params?: any) {
  return request({
    url: `${BASE_API}/evaluation/share`,
    method: 'get',
    params,
  })
}



export function doAddEvaluation(data?: any) {
  return request({
    url: `${BASE_API}/evaluation/add`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

export function updateEvaluation(data?: any) {
  return request({
    url: `${BASE_API}/evaluation/update`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

export function updateEvaluationScoreParams(data?: any) {
  return request({
    url: `${BASE_API}/evaluation/score/update`,
    method: 'post',
    data,
  })
}

export function updateEvaluationCostParams(data?: any) {
  return request({
    url: `${BASE_API}/evaluation/updateCostParameter`,
    method: 'post',
    data,
  })
}

export function updateSharePerson(data?: any) {
  return request({
    url: `${BASE_API}/evaluation/update/share`,
    method: 'post',
    data,
  })
}

// =============================== 产品成本核算与推进 ===============================

/**
 * 添加
 * @param data 传递的参数
 * @returns Promise
 */
export function addEstimatedCostAccounting(data?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/add`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 修改
 * @param data 传递的参数
 * @returns Promise
 */
export function updateEstimatedCostAccounting(data?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/update`,
    method: 'post',
    data,
  })
}

/**
 * 获取数据列表
 * @param params 传递的参数
 * @returns Promise
 */
export function getEstimatedCostAccountingList(params?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/list`,
    method: 'get',
    params,
  })
}

/**
 * 上传文件
 * @param data 传递的参数
 * @returns Promise
 */
export function uploadFileBoBakend(data?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}


/**
 * 删除
 * @param data 传递的参数
 * @returns Promise
 */
export function deleteEstimatedCostAccounting(data?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/delete`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 复制
 * @param data 传递的参数
 * @returns Promise 
 */
export function copyEstimatedCostAccounting(data?: any) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/copy`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

