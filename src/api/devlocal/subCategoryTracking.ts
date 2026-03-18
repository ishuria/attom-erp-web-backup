import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

/**
 * 根据SKU和站点查询产品信息（ASIN、小类排名、父体销量）
 */
export function getProductInfoBySkuAndSite(params: {
  sku: string
  siteCode: number
}): Promise<{ data: { asin: string; currentSubcategoryRank: number | null; monthOrderVolume: number | null } }> {
  return request({
    url: `${BASE_API}/product/get/productInfo`,
    method: 'get',
    params,
  })
}

/**
 * 小类目标追踪 - 查询列表
 */
export function getSubCategoryTrackingList(params: {
  keyWord?: string
  pageNo: number
  pageSize: number
}): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/product/tracking/list`,
    method: 'get',
    params,
  })
}

/**
 * 小类目标追踪 - 添加
 */
export function addSubCategoryTracking(data: {
  operationUserId: number | null
  site: number | null
  sku: string
  competitorHighestRank: number | null
  targetSubcategoryRank: number | null
  targetCompetitor: string
  targetCompetitorParentSales: number | null
  targetParentSales: number | null
}): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/product/tracking/add`,
    method: 'post',
    data,
  })
}

/**
 * 小类目标追踪 - 修改
 */
export function updateSubCategoryTracking(data: {
  id: number | null
  competitorHighestRank: number | null
  targetSubcategoryRank: number | null
  targetCompetitor: string
  targetCompetitorParentSales: number | null
  targetParentSales: number | null
}): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/tracking/update`,
    method: 'post',
    data,
  })
}

/**
 * 小类目标追踪 - 删除
 */
export function deleteSubCategoryTracking(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/tracking/delete`,
    method: 'post',
    params,
  })
}
