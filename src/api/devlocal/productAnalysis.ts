import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IGetExpenseCompositionRes,
  IGetOperationAmazonCostListReq,
  IGetOperationAmazonCostListRes,
  IGetOperationAmazonPackagingInformationRes,
  IGetOperationLogManualRes,
  IGetOperationLogRes,
  IGetProductInfoRes,
  IGetSearchTermPerformanceRes,
  IGetSkuSiteDailyCostRes,
  IGetStorageAgeRes,
  IGetTrendOverviewChartReq,
  IGetTrendOverviewChartRes,
  IGetTrendOverviewTableReq,
  IGetTrendOverviewTableRes,
  IProductAdvertisementSettingResp,
  IProductAdvertisementSettingUpdateReq,
  ISPAdsTableReq,
  ISPAdsTableRes,
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
 * @description 运营-产品分析-趋势总览-表格数据（分页）
 * @param data IGetTrendOverviewTableReq
 * @returns IGetTrendOverviewTableRes
 */
export function getTrendOverviewTable(data: IGetTrendOverviewTableReq): Promise<IGetTrendOverviewTableRes> {
  return request({
    url: `${BASE_API}/product/analysis/trend/overview/table`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营-产品分析-趋势总览-图表数据（完整数据）
 * @param data IGetTrendOverviewChartReq
 * @returns IGetTrendOverviewChartRes
 */
export function getTrendOverviewChart(data: IGetTrendOverviewChartReq): Promise<IGetTrendOverviewChartRes> {
  return request({
    url: `${BASE_API}/product/analysis/trend/overview/chart`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品分析-支出构成
 * @param params { sku: string; siteId: number }
 * @returns IGetExpenseCompositionRes
 */
export function getExpenseComposition(params: {
  sku: string
  siteId: number
  startDate: string
  endDate: string
}): Promise<IGetExpenseCompositionRes> {
  return request({
    url: `${BASE_API}/product/analysis/expense/breakdown`,
    method: 'get',
    params,
  })
}

/**
 * @description 运营-产品分析-库龄
 * @param params { sku: string; siteId: number }
 * @returns IGetStorageAgeRes
 */
export function getStorageAge(params: { sku: string; siteId: number }): Promise<IGetStorageAgeRes> {
  return request({
    url: `${BASE_API}/product/analysis/storage/age`,
    method: 'get',
    params,
  })
}
/**
 * @description 运营-产品分析-SKU每日成本
 * @param params { sku: string; siteId: number; startDate: string; endDate: string }
 * @returns IGetSkuSiteDailyCostRes
 */
export function getSkuSiteDailyCost(params: {
  sku: string
  siteId: number
  startDate: string
  endDate: string
}): Promise<IGetSkuSiteDailyCostRes> {
  return request({
    url: `${BASE_API}/product/analysis/sku/daily_cost`,
    method: 'get',
    params,
  })
}
/**
 * @description 运营-产品分析-操作日志
 * @param params { asin: string; siteId: number; type: number }
 * @returns IGetOperationLogRes
 */
export function getOperationLog(data: {
  asin: string
  siteId: number
  type: number
  pageNo: number
  pageSize: number
  startDate: string
  endDate: string
}): Promise<IGetOperationLogRes> {
  return request({
    url: `${BASE_API}/product/analysis/operation/log`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品分析-操作日志-新增
 * @param data { asin: string; siteId: number; content: string }
 * @returns { data: boolean }
 */
export function addOperationLog(data: { asin: string; siteId: number; content: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/analysis/operation/log/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品分析-操作日志-手动输入日志汇总
 * @param data { operationUserId?: number; siteId?: number; startDate?: string; endDate?: string; pageNo: number; pageSize: number; type: number }
 * @returns IGetOperationLogManualRes
 */
export function getOperationLogManualList(data: {
  userId: number
  siteId: number
  startDate: string
  endDate: string
  pageNo: number
  pageSize: number
  keyWord: string
}): Promise<IGetOperationLogManualRes> {
  return request({
    url: `${BASE_API}/product/analysis/manual/operation/log`,
    method: 'post',
    data,
  })
}
/**
 * @description 运营-产品分析-产品信息
 * @param params { sku: string; siteId: number }
 * @returns IGetProductInfoRes
 */
export function getProductInfo(params: { sku: string; siteId: number }): Promise<IGetProductInfoRes> {
  return request({
    url: `${BASE_API}/product/analysis/info`,
    method: 'get',
    params,
  })
}

/**
 * @description 运营-产品分析-搜索词表现
 * @param data { asin: string; siteId: number; keyword: string; pageNo: number; pageSize: number }
 * @returns IGetSearchTermPerformanceRes
 */
export function getSearchTermPerformance(data: {
  asin: string
  siteId: number
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
  startDate: string
  endDate: string
}): Promise<IGetSearchTermPerformanceRes> {
  return request({
    url: `${BASE_API}/product/analysis/search_term/performance`,
    method: 'post',
    data,
  })
}

/**
 * @description 上传SP文件
 * @param data { file: File; siteId: number }
 * @returns { data: boolean }
 */
export function uploadSpFile(data: FormData): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/upload/sp/file`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
/**
 * @description 运营-产品分析-SP-ST-Share-广告组名称列表
 * @param params { siteId: number; field: string; type: number }
 * @returns { data: string[] }
 */
export function getSPCampaignNameList(params: { siteId: number; field: string; type: number }): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/product/analysis/campaign_name/list`,
    method: 'get',
    params,
  })
}

/**
 * @description 运营-产品分析-SP-ST-Share-广告组计算
 * @returns { data: boolean }
 */
export function calculateSpAds(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/analysis/sp/ads/calculate`,
    method: 'post',
  })
}

/**
 * @description 查询初始ACOS配置值
 * @returns { data: number } 初始ACOS值
 */
export function queryInitialAcos(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/product/analysis/initial/acos`,
    method: 'get',
  })
}

/**
 * @description 更新初始ACOS配置值
 * @param initialAcos 初始ACOS值
 * @returns { data: boolean }
 */
export function updateInitialAcos(initialAcos: number): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/analysis/initial/acos/update`,
    method: 'post',
    params: { initialAcos },
  })
}

/**
 * @description 商品分析-SP广告饼图-表格
 * @param data ISPAdsTableReq
 * @returns ISPAdsTableRes
 */
export function querySPAdsTable(data: ISPAdsTableReq): Promise<ISPAdsTableRes> {
  return request({
    url: `${BASE_API}/product/analysis/sp/ads/table`,
    method: 'post',
    data,
  })
}

/**
 * @description 商品分析-广告设置-查询
 * @param params { asin: string; siteId: number }
 * @returns { data: IProductAdvertisementSettingResp }
 */
export function queryProductAdvertisementSetting(params: {
  asin: string
  siteId: number
}): Promise<{ data: IProductAdvertisementSettingResp }> {
  return request({
    url: `${BASE_API}/product/analysis/advertisement/setting`,
    method: 'get',
    params,
  })
}

/**
 * @description 商品分析-广告设置-新增/更新
 * @param data IProductAdvertisementSettingUpdateReq
 * @returns { data: boolean }
 */
export function upsertProductAdvertisementSetting(data: IProductAdvertisementSettingUpdateReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/analysis/advertisement/setting/update`,
    method: 'post',
    data,
  })
}
