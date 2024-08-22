import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'


import { 
  ICostAccounting,
  IEvaluationScore,
  IEvaluationQueryReq,
  IEvaluationKeyWordTrendReq,
  IEvaluationSharePersonReq,
  IEstimatedCostAccountingQueryReq,
  EstimatedCostAccountingProductRelease,
} from '/@/type/evaluation/evaluationType'


export function getList(params?: IEvaluationQueryReq) {
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

export function getEvaluationTrendList(params?: IEvaluationKeyWordTrendReq) {
  return request({
    url: `${BASE_API}/evaluation/getTrendList`,
    method: 'get',
    params,
  })
}

export function getEvaluationCostParameter() {
  return request({
    url: `${BASE_API}/evaluation/getCostParameter`,
    method: 'get',
  })
}

export function getEvaluationScoreParameter() {
  return request({
    url: `${BASE_API}/evaluation/score`,
    method: 'get',
  })
}

export function getEvaluationScoreDetail(params?: IEstimatedCostAccountingQueryReq) {
  return request({
    url: `${BASE_API}/evaluation/score/detail`,
    method: 'get',
    params,
  })
}


export function getEvaluationShareInfo(params?: IEstimatedCostAccountingQueryReq) {
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

export function updateEvaluationScoreParams(data?: IEvaluationScore) {
  return request({
    url: `${BASE_API}/evaluation/score/update`,
    method: 'post',
    data,
  })
}

export function updateEvaluationCostParams(data?: ICostAccounting) {
  return request({
    url: `${BASE_API}/evaluation/updateCostParameter`,
    method: 'post',
    data,
  })
}

export function updateSharePerson(data?: IEvaluationSharePersonReq) {
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
 * 获取产品成本核算列表
 * @param params 传递的参数
 * @returns Promise
 */
export function getEstimatedCostAccountingList(params?: IEstimatedCostAccountingQueryReq) {
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


/**
 * 获取对应货币汇率
 * @param params 货币
 * @returns Promise
 */
export function getExchangeRate(params?: any) {
  return request({
    url: `${BASE_API}/get/exchangeRate`,
    method: 'get',
    params,
  })
}



/**
 * 发布到新品进度管理
 * @param params 
 * @returns Promise
 */
export function addEstimatedCostAccountingProductRelease(data?: EstimatedCostAccountingProductRelease) {
  return request({
    url: `${BASE_API}/product/release`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}