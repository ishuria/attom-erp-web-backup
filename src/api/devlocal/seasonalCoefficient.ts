import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IAddSeasonalCoefficientReq,
  IBooleanResp,
  IDailySeasonalCoefficient,
  IGetSeasonalCoefficientListReq,
  IGetSeasonalCoefficientListRes,
  IId,
  IPlatFormItem,
  ISeasonalCoefficientDashboardReq,
  ISeasonalCoefficientDashboardRes,
  ISite,
  ISiteList,
  IUpdateSeasonalCoefficientReq,
} from '/@/type/storeOperation/seasonalCoefficientType'

/**
 * @description 季节系数列表
 */
export function getSeasonalCoefficientList(params: IGetSeasonalCoefficientListReq): Promise<IGetSeasonalCoefficientListRes> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 季节系数每日列表
 * @param params
 * @returns
 */
export function getSeasonalCoefficientDailyList(params: { id: number; siteId: number }): Promise<{ data: IDailySeasonalCoefficient[] }> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/daily/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 季节系数的站点列表
 */
export function getSeasonalCoefficientSiteList(): Promise<{ data: ISiteList[] }> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/site/list`,
    method: 'get',
  })
}
/**
 * @description 修改季节系数
 */
export function updateSeasonalCoefficient(data: IUpdateSeasonalCoefficientReq): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 删除季节系数
 */
export function delSeasonalCoefficient(params: IId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/del`,
    method: 'post',
    params,
  })
}
/**
 * @description 获取季节系数的品类列表
 */
export function getSeasonalCoefficientSite(params: ISite): Promise<{ data: ISiteList[] }> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/site`,
    method: 'get',
    params,
  })
}
/**
 * @description 添加季节系数
 */
export function addSeasonalCoefficient(data: IAddSeasonalCoefficientReq): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 季节系数看板 - 平台列表
 */
export function getSeasonalCoefficientPlatformList(): Promise<{ data: IPlatFormItem[] }> {
  return request({
    url: `${BASE_API}/platform/list`,
    method: 'get',
  })
}
/**
 * @description 季节系数看板 - 按平台获取站点列表
 */
export function getSeasonalCoefficientSiteListByPlatform(platformId: number): Promise<{ data: ISiteList[] }> {
  return request({
    url: `${BASE_API}/platform/site/${platformId}`,
    method: 'get',
  })
}
/**
 * @description 季节系数看板 - 按站点获取种类列表
 */
export function getSeasonalCoefficientKindList(site: number): Promise<{ data: ISiteList[] }> {
  return request({
    url: `${BASE_API}/kind/list/${site}`,
    method: 'get',
  })
}
/**
 * @description 季节系数看板数据
 */
export function getSeasonalCoefficientDashboard(data: ISeasonalCoefficientDashboardReq): Promise<ISeasonalCoefficientDashboardRes> {
  return request({
    url: `${BASE_API}/product/seasonal`,
    method: 'post',
    data,
  })
}
