import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IGetPlanPoListQuery,
  IGetPlanPoListResp,
  IGetPoDetailResp,
  IGetPoSkuComponentListResp,
  IGetSupplierRateResp,
  IId,
  IIds,
  IPoSkuId,
  ISupplierId,
  IUpdatePoContractTerms,
  IUpdatePoPurchaseMatters,
  IUpdatePoSkuComponent
} from '/@/type/purchase/po'

// 采购计划-获取采购计划PlanPo
export function getPlanPoList(params?: IGetPlanPoListQuery): Promise<IGetPlanPoListResp> {
  return request({
    url: `${BASE_API}/purchase/planPo/list`,
    method: 'get',
    params,
  })
}

// 查询po sku 零件采购注意事项
export function getPoPurchaseMatters(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/purchaseMatters`,
    method: 'get',
    params,
  })
}
// 采购计划-详情PO数据获取
export function getPoDetail(params: IId): Promise<IGetPoDetailResp> {
  return request({
    url: `${BASE_API}/purchase/po/detail`,
    method: 'get',
    params,
  })
}
// 采购计划 - POSKU配件详情表
export function getPoSkuComponentList(params: IPoSkuId): Promise<IGetPoSkuComponentListResp> {
  return request({
    url: `${BASE_API}/purchase/po/skuComponent/list`,
    method: 'get',
    params,
  })
}
// 查询po sku 零件的合同条款
export function getPoContractTerms(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/contractTerms`,
    method: 'get',
    params,
  })
}
// 采购计划 - 获取供应商税点信息
export function getSupplierRate(params?: ISupplierId): Promise<IGetSupplierRateResp> {
  return request({
    url: `${BASE_API}/purchase/suppliser/rate`,
    method: 'get',
    params,
  })
}
// 更新po sku 零件采购注意事项
export function updatePoPurchaseMatters(params?: IUpdatePoPurchaseMatters) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/update/purchaseMatters`,
    method: 'post',
    params,
  })
}
// 采购计划-批量删除
export function deletePlanPo(params?: IIds) {
  return request({
    url: `${BASE_API}/purchase/planPo/delete`,
    method: 'post',
    params,
  })
}
// 采购计划-未达起订量
export function updatePlanPoStatus(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/planPo/update/status`,
    method: 'post',
    params,
  })
}
// 采购计划-发布PO
export function releasePlanPo(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/release/po`,
    method: 'post',
    params,
  })
}
// 更新po sku 零件采购合同条款
export function updatePoContractTerms(params: IUpdatePoContractTerms) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/update/contractTerms`,
    method: 'post',
    params,
  })
}
// 采购计划 - POSKU零件清单删除
export function deletePoSkuComponent(params: IId) {
  return request({
    url: `${BASE_API}/purchase/po/skuComponent/delete`,
    method: 'post',
    params,
  })
}
// 采购计划-po sku 零件修改
export function updatePoSkuComponent(data: IUpdatePoSkuComponent) {
  return request({
    url: `${BASE_API}/purchase/po/update`,
    method: 'post',
    data,
  })
}