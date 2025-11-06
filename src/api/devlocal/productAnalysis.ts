import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IGetOperationAmazonCostListReq,
  IGetOperationAmazonCostListRes,
  IGetOperationAmazonPackagingInformationRes,
  IGetTrendOverviewReq,
  ITrendOverview,
  IUpdateOperationAmazonCostReq,
} from '/@/type/storeOperation/productAnalysisType'

/**
 * @description 运营-产品成本分析-成本核算列表查询
 */
export function getOperationAmazonCostList(data: IGetOperationAmazonCostListReq): Promise<IGetOperationAmazonCostListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-成本核算复制
 */
export function copyOperationAmazonCost(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/copy`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-成本核算删除
 */
export function deleteOperationAmazonCost(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/delete`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-成本核算逆算
 */
export function reverseCalcOperationAmazonCost(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/reverse/calc`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-成本核算新增
 */
export function addOperationAmazonCost(data: { sku: string; site: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-成本核算正算修改
 */
export function updateOperationAmazonCost(data: IUpdateOperationAmazonCostReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/cost/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品成本分析-包装信息获取
 * @param params
 * @returns
 */
export function getOperationAmazonPackagingInformation(params: {
  sku: string
  site: number
}): Promise<{ data: IGetOperationAmazonPackagingInformationRes }> {
  return request({
    url: `${BASE_API}/operation/amazon/packaging/information`,
    method: 'get',
    params,
  })
}
/**
 * @description 运营-产品分析-趋势总览
 * @param data IGetTrendOverviewReq
 * @returns { data: ITrendOverview[] }
 */
export function getTrendOverview(data: IGetTrendOverviewReq): Promise<{ data: ITrendOverview[] }> {
  return request({
    url: `${BASE_API}/product/analysis/trend/overview`,
    method: 'post',
    data,
  })
}
