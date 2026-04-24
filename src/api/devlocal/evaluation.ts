import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  EstimatedCostAccountingProductRelease,
  EstimatedCostAccountingProductReleaseRes,
  ICostAccounting,
  IEstimatedCostAccountingQueryReq,
  IEvaluationKeyWordTrendReq,
  IEvaluationQueryReq,
  IEvaluationScore,
  IEvaluationSharePersonReq,
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

/**
 * 新款评估-跑分查重
 * @param params 参数
 * @returns Promise
 */
export function checkPlagiarisme(params: { amazonFrontendKeywords: string; amazonBackendKeywords: string }): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/evaluation/plagiarism/check`,
    method: 'get',
    params,
  })
}

/**
 * 获取国家列表
 * @returns Promise
 */
export function getCountryList(): Promise<{ data: { countryId: number; countryName: string }[] }> {
  return request({
    url: `${BASE_API}/country/list`,
    method: 'get',
  })
}
/**
 * 复制新款评估
 * @param params 参数
 * @returns
 */
export function copyEvaluation(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/evaluation/copy`,
    method: 'post',
    params,
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
 * @description 新款评估头程渠道更新
 */
export function updateEstimatedCostAccountingFirstMileChannel(data?: { id: number; channelId?: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/firstMileChannel/update`,
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
 * @description 新款评估-成本核算删除图片
 */
export function evaluationCostDeleteImg(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/evaluation/cost/delete/img`,
    method: 'post',
    params,
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
 * 修改排序
 * @param data
 * @returns
 */
export function updateEstimatedCostAccountingSort(data?: string[]) {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/update/sort`,
    method: 'post',
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
export function addEstimatedCostAccountingProductRelease(
  data?: EstimatedCostAccountingProductRelease
): Promise<{ data: EstimatedCostAccountingProductReleaseRes }> {
  return request({
    url: `${BASE_API}/product/release`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * @description 成本核算-获取所有销售站点的数据
 */
export function getSalesSiteList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/sales/site/list`,
    method: 'get',
  })
}

/**
 * @description 新品评估成本核算-逆算
 */
export function reverseCalculateEstimatedCostAccounting(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/estimatedCostAccounting/reverse/calculation`,
    method: 'post',
    params,
  })
}
