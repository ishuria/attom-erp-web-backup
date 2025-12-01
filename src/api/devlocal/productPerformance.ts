import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IGetKeyProductsListReq, IGetKeyProductsListRes } from '~/src/type/storeOperation/keyProducts'
import type {
  IFilterAmazonSKUListReq,
  IFilterWalmartListReq,
  IGetOperationAmazonAsinRankListReq,
  IGetOperationAmazonParentAsinRankListReq,
  IGetOperationAmazonSKUListReq,
  IGetOperationAmazonSKUListRes,
  IGetOperationAmazonSkuRankListReq,
  IGetOperationAmazonSkuRankListRes,
  IGetOperationAmazonSkuVocListRes,
  IGetOperationArtListReq,
  IGetOperationArtListRes,
  IGetOperationAsinListRes,
  IGetOperationColumnListRes,
  IGetOperationParentAsinRes,
  IGetOperationTypeListReq,
  IGetOperationTypeListRes,
  IGetUserAmazonOperationRes,
  IHideOrShowOperationColumnReq,
  IUpdateRemarkAmazonOperationReq,
  IUpdateSortOperationColumnReq,
} from '/@/type/storeOperation/productPerformanceType'

/**
 * @description 产品表现-亚马逊看板SKU列表
 */
export function getOperationAmazonSKUList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/list`,
    method: 'post',
    data,
  })
}

/**
 * @description 产品表现-货币下拉列表
 */
export function getCurrencyList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/currency/list`,
    method: 'get',
  })
}
/**
 * @description 产品表现-开发人员下拉列表
 */
export function getDevelopUserList(): Promise<{ data: { id: number; label: string }[] }> {
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
    params,
  })
}
/**
 * @description 产品表现-运营分类新增
 */
export function addOperationTypeList(data: { typeName: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-运营分类删除
 */
export function delOperationTypeList(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/delete`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-运营分类修改
 */
export function updateOperationTypeList(data: { id: number; typeName: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/type/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-SKU运营分类修改
 */
export function updateOperationSKUOperateTypeList(data: { id: number; typeId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/sku/operateType/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现ASIN-运营分类修改
 */
export function updateOperationASINOperateTypeList(data: { id: number; typeId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/asin/operateType/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品分析-运营分类修改
 */
export function updateProductAnalysisOperateTypeList(data: { asin: string; site: number; typeId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/analysis/operateType/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-SKU停产状态修改
 */
export function updateOperationSKUDisContinuedStatus(data: { skuId: number; siteId: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/sku/discontinuedStatus/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-SKU运营筛选
 */
export function filterAmazonSKUList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/screening/list`,
    method: 'post',
    data,
  })
}
export function updateOperationASINDisContinuedStatus(data: { asin: string; siteId: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/asin/discontinuedStatus/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品看板表现-asin列表
 */
export function getOperationAsinList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAsinListRes> {
  return request({
    url: `${BASE_API}/operation/asin/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-ASIN运营筛选
 */
export function filterOperationAmazonAsinList(data: IFilterAmazonSKUListReq): Promise<IGetOperationAsinListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/screening/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品看板表现-parentAsin列表
 */
export function getOperationParentAsinList(data: IGetOperationAmazonSKUListReq): Promise<IGetOperationParentAsinRes> {
  return request({
    url: `${BASE_API}/operation/parent/asin/list`,
    method: 'post',
    data,
  })
}

/**
 * @description 产品表现-亚马逊看板SKU列表(美工)
 */
export function getOperationAmazonArtDesignList(data: IGetOperationArtListReq): Promise<IGetOperationArtListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/art/design/sku/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现列名查询
 */
export function getOperationColumnList(params: { type: number }): Promise<IGetOperationColumnListRes> {
  return request({
    url: `${BASE_API}/operation/column/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 产品看板表现列隐藏
 */
export function hideOrShowOperationColumn(data: IHideOrShowOperationColumnReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/column/hiddenOrShow`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现看板-列拖动
 */
export function updateSortOperationColumn(data: IUpdateSortOperationColumnReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/column/update/sort`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-运营备注修改
 */
export function updateRemarkAmazonOperation(data: IUpdateRemarkAmazonOperationReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/remark/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-亚马逊看板SKU维度货币
 */
export function getCurrencySKUAmazonOperation(): Promise<{ data?: number }> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/currency`,
    method: 'get',
  })
}
/**
 * @description 产品表现-亚马逊看板Asin维度货币
 */
export function getCurrencyASINAmazonOperation(): Promise<{ data?: number }> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/currency`,
    method: 'get',
  })
}
/**
 * @description 产品表现-亚马逊看板ParentAsin维度货币
 */
export function getCurrencyParentASINAmazonOperation(): Promise<{ data?: number }> {
  return request({
    url: `${BASE_API}/operation/amazon/parent/asin/currency`,
    method: 'get',
  })
}
/**
 * @description 产品表现-亚马逊看板Sku维度货币修改
 */
export function updateCurrencySKUAmazonOperation(data: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/currency/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-亚马逊看板Asin维度货币修改
 */
export function updateCurrencyASINAmazonOperation(data: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/currency/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-亚马逊看板ParentAsin维度货币修改
 */
export function updateCurrencyParentASINAmazonOperation(data: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/amazon/parent/asin/currency/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品表现-获取人员信息
 */
export function getUserAmazonOperation(): Promise<IGetUserAmazonOperationRes> {
  return request({
    url: `${BASE_API}/operation/amazon/user`,
    method: 'get',
  })
}

/**
 * @description 产品表现-获取美工人员信息
 */
export function getUserAmazonArtDesignOperation(): Promise<IGetUserAmazonOperationRes> {
  return request({
    url: `${BASE_API}/operation/amazon/artDesign/user`,
    method: 'get',
  })
}

/**
 * 产品表现SKU-查询小类排名
 * @returns
 */
export function getOperationAmazonSkuRankList(data: IGetOperationAmazonSkuRankListReq): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/rank`,
    method: 'post',
    data,
  })
}
/**
 * 产品表现SKU-查询大类排名
 * @returns
 */
export function getOperationAmazonSkuRankCateList(data: IGetOperationAmazonSkuRankListReq): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/cateRank`,
    method: 'post',
    data,
  })
}
/**
 * 产品表现ASIN-查询小类排名
 * @returns
 */
export function getOperationAmazonAsinRankList(data: IGetOperationAmazonAsinRankListReq): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/rank`,
    method: 'post',
    data,
  })
}
/**
 * 产品表现ASIN-查询大类排名
 * @returns
 */
export function getOperationAmazonAsinRankCateList(data: IGetOperationAmazonAsinRankListReq): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/asin/cateRank`,
    method: 'post',
    data,
  })
}
/**
 * 产品表现ParentAsin-查询小类排名
 * @returns
 */
export function getOperationAmazonParentAsinRankList(
  data: IGetOperationAmazonParentAsinRankListReq
): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/parent/asin/rank`,
    method: 'post',
    data,
  })
}
/**
 * 产品表现ParentAsin-查询大类排名
 * @returns
 */
export function getOperationAmazonParentAsinRankCateList(
  data: IGetOperationAmazonParentAsinRankListReq
): Promise<IGetOperationAmazonSkuRankListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/parent/asin/cateRank`,
    method: 'post',
    data,
  })
}

/**
 * 产品表现SKU-查询Voc满意度趋势
 * @returns
 */
export function getOperationAmazonSkuVocList(data: IGetOperationAmazonSkuRankListReq): Promise<IGetOperationAmazonSkuVocListRes> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/voc`,
    method: 'post',
    data,
  })
}

/**
 * 产品表现-获取最新更新日期
 * @param params 类型 0 sku 1 asin 2 parent_asin 3 美工图片任务明细 4 美工长期明细 5 产品开发设计明细
 * @returns 日期
 */
export function getOperationUpdateDate(params: { type: number }): Promise<{ data?: string }> {
  return request({
    url: `${BASE_API}/operation/update/date`,
    method: 'get',
    params,
  })
}

// ------------------------------ 沃尔玛 ------------------------------
/**
 * @description 产品表现-沃尔玛列表
 */
export function getOperationWalmartList(data: IGetOperationAmazonSKUListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/walmart/list`,
    method: 'post',
    data,
  })
}

export function getWalmartSiteList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/walmart/site/list`,
    method: 'get',
  })
}

export function getWalmartCurrencyList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/walmart/currency/list`,
    method: 'get',
  })
}

export function getCurrencyWalmartOperation(): Promise<{ data?: number }> {
  return request({
    url: `${BASE_API}/operation/walmart/currency`,
    method: 'get',
  })
}

export function updateCurrencyWalmartOperation(data: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/walmart/currency/update`,
    method: 'post',
    data,
  })
}

export function updateOperationWalmartDisContinuedStatus(data: { id: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/walmart/discontinuedStatus/update`,
    method: 'post',
    data,
  })
}

export function updateRemarkWalmartOperation(data: { id: number; remark: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/walmart/remark/update`,
    method: 'post',
    data,
  })
}

export function filterWalmartList(data: IFilterWalmartListReq): Promise<IGetOperationAmazonSKUListRes> {
  return request({
    url: `${BASE_API}/operation/walmart/screening/list`,
    method: 'post',
    data,
  })
}

export function updateOperationWalmartOperateTypeList(data: { id: number; typeId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/walmart/operateType/update`,
    method: 'post',
    data,
  })
}

/**
 * 店铺运营-获取关键产品列表
 * @param data 请求参数
 * @returns 关键产品列表
 */
export function getKeyProductsList(data: IGetKeyProductsListReq): Promise<IGetKeyProductsListRes> {
  return request({
    url: `${BASE_API}/operation/key/products/list`,
    method: 'post',
    data,
  })
}
/**
 * 店铺运营-更新关键产品状态
 * @param params id: number; status: number
 * @returns boolean
 */
export function updateKeyProductsStatus(params: { id: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/key/products/status/update`,
    method: 'post',
    params,
  })
}
