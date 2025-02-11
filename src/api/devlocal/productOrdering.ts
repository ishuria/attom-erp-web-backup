import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IGetOperationOrderListReq,
  IGetOperationOrderListRes,
  IGetOperationOrderSpringFestival,
  IGetOperationOrdersSmoothness,
  IReleaseOperationPlanPoReq
} from '/@/type/storeOperation/productOrdering'

// 产品订货-查询列表
export function getOperationOrderList(data: IGetOperationOrderListReq): Promise<IGetOperationOrderListRes> {
  return request({
    url: `${BASE_API}/operation/order/list`,
    method: 'post',
    data
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
    data
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
export function updateOperationOrderSpringFestival(data: IGetOperationOrderSpringFestival): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/order/spring/festival/update`,
    method: 'post',
    data
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
export function releaseOperationPlanPo(data: IReleaseOperationPlanPoReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/release/planPo`,
    method: 'post',
    data
  })
}