import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IFilterAmazonSKUListReq,
  IGetOperationAmazonSKUListReq,
  IGetOperationAmazonSKUListRes,
  IGetOperationAsinListRes,
  IGetOperationParentAsinRes,
  IGetOperationTypeListReq,
  IGetOperationTypeListRes
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
export function getOperationTypeList(params: IGetOperationTypeListReq): Promise<IGetOperationTypeListRes> {
  return request({
    url: `${BASE_API}/operation/type/list`,
    method: 'get',
    params
  })
}
/**
 * @description 产品表现-运营分类新增
 */
export function addOperationTypeList(data: { typeName: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/add`,
    method: 'post',
    data
  })
}
/**
 * @description 产品表现-运营分类删除
 */
export function delOperationTypeList(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/delete`,
    method: 'post',
    data
  })
}
/**
 * @description 产品表现-运营分类修改
 */
export function updateOperationTypeList(data: { id: number, typeName: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/update`,
    method: 'post',
    data
  })
}
/**
 * @description 产品表现-SKU运营分类修改
 */
export function updateOperationSKUOperateTypeList(data: { id: number, typeId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/sku/operateType/update`,
    method: 'post',
    data
  })
}
/**
 * @description 产品表现-SKU停产状态修改
 */
export function updateOperationSKUDisContinuedStatus(data: { id: number, status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/sku/discontinuedStatus/update`,
    method: 'post',
    data
  })
}
/**
 * @description 产品表现-SKU运营筛选
 */
export function filterAmazonSKUList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/screening/list`,
    method: 'post',
    data
  })
}
/**
 * @description 产品看板表现-asin列表
 */
export function getOperationAsinList(params: IGetOperationAmazonSKUListReq): Promise<IGetOperationAsinListRes> {
  return request({
    url: `${BASE_API}/operation/asin/list`,
    method: 'get',
    params
  })
}
/**
 * @description 产品表现-ASIN运营筛选
 */
export function filterOperationAmazonAsinList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAsinListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/screening/list`,
    method: 'post',
    data
  })
}
/**
 * @description 产品看板表现-parentAsin列表
 */
export function getOperationParentAsinList(params: IGetOperationAmazonSKUListReq): Promise<IGetOperationParentAsinRes> {
  return request({
    url: `${BASE_API}/operation/parent/asin/list`,
    method: 'get',
    params
  })
}