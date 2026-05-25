import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type { IreviewId } from '/@/type/orderProcess/orderProcessType'
import type {
  IReviewCommonReq,
  IReviewCommonResp,
  IReviewMoldResp,
  IReviewQueryReq,
  IReviewQueryResp,
  IReviewStep2Req,
  IReviewStepNo1Req,
  IReviewStepResp,
  IReviewStepUpdateReq,
  IUpdateReviewStepNo3Vine,
  IVariantInfoResp,
} from '/@/type/review/review'

// 新品审核与记录-获取新品审核列表
export function getReviewList(data?: IReviewQueryReq): Promise<IReviewQueryResp> {
  return request({
    url: `${BASE_API}/review/list`,
    method: 'post',
    data,
  })
}

// 新品订货流程-检查提交审核信息-查询获取信息及主管可行性审批查询
export function getReviewByReviewId(params?: IReviewCommonReq): Promise<IReviewCommonResp> {
  return request({
    url: `${BASE_API}/review/check/get`,
    method: 'get',
    params,
  })
}

// 检查提交审核信息 - 开模信息
export function getMoldInfoByReviewId(params?: IReviewCommonReq): Promise<IReviewMoldResp> {
  return request({
    url: `${BASE_API}/review/get/mold`,
    method: 'get',
    params,
  })
}

// 新品订货流程-零件信息完善与售价核对-查询变体列表信息
export function getVariantList(params?: IReviewCommonReq): Promise<IVariantInfoResp> {
  return request({
    url: `${BASE_API}/review/stepsNo3/variantList`,
    method: 'get',
    params,
  })
}

// 新品订货审批-主管可行性审批通过
export function reviewStepNo1Pass(data?: IReviewStepNo1Req): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo1/pass`,
    method: 'post',
    data,
  })
}

// 新品订货审批-主管可行性审批不通过
export function reviewStepNo1Fail(data?: IReviewStepNo1Req): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo1/fail`,
    method: 'post',
    data,
  })
}

// 新品订货审批-sku创建查询接口
export function getSkuVariantList(params?: IReviewCommonReq): Promise<IReviewCommonResp> {
  return request({
    url: `${BASE_API}/review/sku/create/list`,
    method: 'get',
    params,
  })
}
// 获取评估id
export function getReviewEvaluationId(params?: IreviewId) {
  return request({
    url: `${BASE_API}/review/evaluationId`,
    method: 'get',
    params,
  })
}
// 新品订货审批-主管可行性审批不通过
export function reviewStepNo2Pass(data?: IReviewStep2Req): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo2/pass`,
    method: 'post',
    data,
  })
}
/**
 * 新品订货审批-SKU创建审批不通过
 * @param params
 * @returns
 */
export function reviewStepNo2Fail(data: { reviewId: number; reason: string }): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo2/failed`,
    method: 'post',
    data,
  })
}

// 新品订货审批-终审 SKU 批量生成
export function generateReviewSku(reviewId: number): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/sku/generate/${reviewId}`,
    method: 'post',
  })
}

// 新品订货审批-运营分货查询接口
export function getDistributionList(params?: IReviewCommonReq): Promise<IReviewCommonResp> {
  return request({
    url: `${BASE_API}/review/distribution/list`,
    method: 'get',
    params,
  })
}

// 新品订货审批-运营分货数量修改
export function updateStepNoQuantity(data?: IReviewStepUpdateReq): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo3/quantity/update`,
    method: 'post',
    data,
  })
}
/**
 * 新品订货审批-运营分货完成状态修改
 * @param params
 * @returns
 */
export function updateDistributionCompleted(params: { id: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/distribution/completed/update`,
    method: 'post',
    params,
  })
}
// 新品订货审批流程-运营修改Vine
export function updateReviewStepNo3Vine(data?: IUpdateReviewStepNo3Vine): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo3/vine`,
    method: 'post',
    data,
  })
}

/**
 * 新品订货审批-运营分货不通过
 * @param params
 * @returns
 */
export function reviewStepNo3Fail(params: { reviewId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/stepNo3/failed`,
    method: 'post',
    params,
  })
}

// 新品订货审批-运营分货提交
export function reviewStepNo3Save(params?: IReviewCommonReq): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/stepNo3/submit`,
    method: 'post',
    params,
  })
}
// 查询步骤是否禁止编辑
export function reviewStepEditDisabledStatus(params: { reviewId: number; step: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/step/edit-disabled/status`,
    method: 'get',
    params,
  })
}

// 新品订货审批-产品经理审核查询接口
export function reviewProductList(params?: IReviewCommonReq): Promise<IReviewCommonResp> {
  return request({
    url: `${BASE_API}/review/product/list`,
    method: 'get',
    params,
  })
}

/**
 * 新品订货审批-运营重新分货
 * @param params
 * @returns
 */
export function reviewStepNo4Fail(params: { reviewId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/stepNo4/failed`,
    method: 'post',
    params,
  })
}
/**
 * 新品订货审批-采购审核通过
 * @param params
 * @returns
 */
export function reviewStepNo5Pass(params: { reviewId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/stepNo5/pass`,
    method: 'post',
    params,
  })
}
// 新品订货审批-发布PO
export function releasePo(params?: IReviewCommonReq): Promise<IReviewStepResp> {
  return request({
    url: `${BASE_API}/review/release/po`,
    method: 'post',
    params,
  })
}
/**
 * 新品订货审批-归档
 * @param params
 * @returns
 */
export function updateReviewArchived(params: { reviewId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/archive`,
    method: 'post',
    params,
  })
}

// 新品订货审批-采购审核不通过
export function purchaseReviewNoFail(data?: { reviewId: number; reason: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/review/purchase/fail`,
    method: 'post',
    data,
  })
}
