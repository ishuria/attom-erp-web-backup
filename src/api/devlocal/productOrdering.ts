import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IGetOperationOrderListReq,
  IGetOperationOrderListRes,
  IGetOperationOrderSkuReq,
  IGetOperationOrderSkuRes,
  IGetOperationOrderSpringFestival,
  IGetOperationOrdersSmoothness,
  IGetOperationOrderTable,
  IGetRepackageDetail,
  IReleaseOperationPlanPoReq,
  IReleaseOperationPlanPoRes,
  IUpdateOperationOrderShipmentQuantityReq,
} from '/@/type/storeOperation/productOrdering'

// 产品订货-查询列表
export function getOperationOrderList(data: IGetOperationOrderListReq): Promise<IGetOperationOrderListRes> {
  return request({
    url: `${BASE_API}/operation/order/list`,
    method: 'post',
    data,
  })
}

// 产品订货沃尔玛-查询列表
export function getOperationWalmartOrderList(data: IGetOperationOrderListReq): Promise<IGetOperationOrderListRes> {
  return request({
    url: `${BASE_API}/operation/walmart/order/list`,
    method: 'post',
    data,
  })
}
// 产品订货-平滑指数设定获取
export function getOperationOrderSmoothness(): Promise<{ data: IGetOperationOrdersSmoothness }> {
  return request({
    url: `${BASE_API}/operation/order/smoothness`,
    method: 'get',
  })
}
// 产品订货-平滑指数修改
export function updateOperationOrderSmoothness(data: IGetOperationOrdersSmoothness): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/order/smoothness/update`,
    method: 'post',
    data,
  })
}
// 产品订货-春节备货系数
export function getOperationOrderSpringFestival(): Promise<{ data: IGetOperationOrderSpringFestival }> {
  return request({
    url: `${BASE_API}/operation/order/spring/festival`,
    method: 'get',
  })
}
// 产品订货-春节备货系数修改
export function updateOperationOrderSpringFestival(data: IGetOperationOrderSpringFestival): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/operation/order/spring/festival/update`,
    method: 'post',
    data,
  })
}

// 产品订货-发货数列表查询
export function getOperationOrderShippingInspection(): Promise<{ data: any }> {
  return request({
    url: `${BASE_API}/operation/order/shipping/inspection`,
    method: 'get',
  })
}
// 产品订货-发布订货提交
export function releaseOperationPlanPo(data: IReleaseOperationPlanPoReq): Promise<IReleaseOperationPlanPoRes> {
  return request({
    url: `${BASE_API}/operation/release/planPo`,
    method: 'post',
    data,
  })
}
// 产品订货-发布订货查询
export function getOperationOrderSku(data: IGetOperationOrderSkuReq): Promise<IGetOperationOrderSkuRes> {
  return request({
    url: `${BASE_API}/operation/order/get/sku`,
    method: 'post',
    data,
  })
}
/**
 * 产品订货-发货数检查-确认
 * @param data
 * @returns
 */
export function updateOperationOrderShipmentQuantity(data: IUpdateOperationOrderShipmentQuantityReq[]): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/order/shipment/quantity/update`,
    method: 'post',
    data,
  })
}
/**
 * 产品订货-订货表查询
 * @param params
 * @returns
 */
export function getOperationOrderTable(params: { sku: string; site: number }): Promise<{ data: IGetOperationOrderTable[] }> {
  return request({
    url: `${BASE_API}/package/task/order/detail`,
    method: 'get',
    params,
  })
}

/**
 * 产品订货-装错货补发明细查询
 */
export function getOperationRepackageTable(params: { sku: string; site: number }): Promise<{ data: IGetRepackageDetail[] }> {
  return request({
    url: `${BASE_API}/package/task/repackage/detail`,
    method: 'get',
    params,
  })
}
