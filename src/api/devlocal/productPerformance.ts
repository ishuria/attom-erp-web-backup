import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IGetOperationAmazonSKUListReq,
  IGetOperationAmazonSKUListRes,
  IGetOperationTypeListReq
} from '/@/type/storeOperation/productPerformanceType'


/**
 * @description 产品表现-亚马逊看板SKU列表
 */
export function getOperationAmazonSKUList(params: IGetOperationAmazonSKUListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/list`,
    method: 'get',
    params
  })
}
/**
 * @description 产品表现-货币下拉列表
 */
export function getCurrencyList(): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/currency/list`,
    method: 'get',
  })
}
/**
 * @description 产品表现-开发人员下拉列表
 */
export function getDevelopUserList(): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/develop/user/list`,
    method: 'get',
  })
}
/**
 * @description 产品表现-运营分类列表
 */
export function getOperationTypeList(params: IGetOperationTypeListReq): Promise<{ data: { id: number, typeName: string }[] }> {
  return request({
    url: `${BASE_API}/operation/type/list`,
    method: 'get',
    params
  })
}
/**
 * @description 产品表现-运营分类新增
 */
export function addOperationTypeList(params: { typeName: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/add`,
    method: 'get',
    params
  })
}