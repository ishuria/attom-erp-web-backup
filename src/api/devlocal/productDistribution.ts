import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddDistributionListReq,
  IGetDistributionListRes,
  IGetDistributionProductListReq,
  IGetDistributionProductListRes,
  IUpdateDistributionAsinUserReq,
  IUpdateDistributionUserType
} from '/@/type/storeOperation/productDistributionType'


/**
 * @description 查询自动认领设定列表
 */
export function getDistributionList(): Promise<IGetDistributionListRes> {
  return request({
    url: `${BASE_API}/distribution/list`,
    method: 'get',
  })
}
/**
 * @description 删除自动认领设定
 */
export function delDistributionList(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/distribution/delete`,
    method: 'post',
    params
  })
}
/**
 * @description 产品分配-查询站点列表
 */
export function getDistributionSiteList(): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/distribution/site/list`,
    method: 'get',
  })
}
/**
 * @description 产品分配-查询运营人员列表
 */
export function getDistributionOptionUserList(): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/distribution/option/user/list`,
    method: 'get',
  })
}
/**
 * @description 产品分配-查询运营人对应的分类列表
 */
export function getDistributionUserTypeList(params: { userId: number }): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/distribution/user/type/list`,
    method: 'get',
    params
  })
}
/**
 * @description 查询产品分配列表
 */
export function getDistributionProductList(params: IGetDistributionProductListReq): Promise<IGetDistributionProductListRes> {
  return request({
    url: `${BASE_API}/distribution/product/list`,
    method: 'get',
    params
  })
}
/**
 * @description 添加自动认领设定
 */
export function addDistributionList(data: IAddDistributionListReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/distribution/add`,
    method: 'post',
    data
  })
}
/**
 * @description 产品分配-修改运营人员
 */
export function updateDistributionAsinUser(data: IUpdateDistributionAsinUserReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/distribution/asin/user`,
    method: 'post',
    data
  })
}
/**
 * @description 产品分配-修改运营人对应的分类修改
 */
export function updateDistributionUserType(data: IUpdateDistributionUserType): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/distribution/user/type`,
    method: 'post',
    data
  })
}

/**
 * 产品分配-查询全部运营人对应的运营分类列表
 * @returns 
 */
export function getDistributionUserType() {
  return request({
    url: `${BASE_API}/distribution/option/user/all/list`,
    method: 'get',
  })
}