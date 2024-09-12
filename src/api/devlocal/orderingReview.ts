import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IReviewQueryReq,
  IReviewQueryResp,
  IReviewCommonReq,
  IReviewCommonResp,
  IReviewMoldResp,
  IVariantInfoResp,
} from '/@/type/review/review'

// 新品审核与记录-获取新品审核列表
export function getReviewList(params?: IReviewQueryReq): Promise<IReviewQueryResp> {
  return request({
    url: `${BASE_API}/review/list`,
    method: 'get',
    params,
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
