import { BASE_API } from '/@/api/devlocal/api'
import {
  GetPriceProfitScatterResponse,
  GetSaleTrendParams,
  GetSaleTrendResponse,
  IAutoMationDefaultPramsRules,
  IAutomationLogRules,
  IAutoMationQueryReq,
  IAutoMationResult,
  IAutoMationRules,
  IAutoMationUpdateReq,
  IOperationStockRulesSiteParams,
} from '/@/type/storeOperation/autoMation'
import {
  IOperationStockDefaultParams,
  IOperationStockLogRules,
  IOperationStocksItem,
  IOperationStockUpdateReq,
} from '/@/type/storeOperation/operationStock.ts'
import request from '/@/utils/request'

/**
 * 运营自动化-查询
 * @param data 查询参数
 * @returns 运营自动化数据列表
 */
export function queryOperationAutoMationList(data?: IAutoMationQueryReq): Promise<IAutoMationRules> {
  return request({
    url: `${BASE_API}/operation/auto/rules/list`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-修改
 * @param data 修改参数
 * @returns 修改结果
 */
export function updateOperationAutoMation(data?: IAutoMationUpdateReq): Promise<IAutoMationResult> {
  return request({
    url: `${BASE_API}/operation/auto/rules/update`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-批量修改
 * @param data 修改参数
 * @returns 修改结果
 */
export function updateBatchOperationAutoMation(data?: IAutoMationUpdateReq): Promise<IAutoMationResult> {
  return request({
    url: `${BASE_API}/operation/auto/rules/batch/update`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-获取默认参数信息
 * @returns 默认参数列表
 */
export function queryDefaultParamsOperationAutoMation(): Promise<IAutoMationDefaultPramsRules> {
  return request({
    url: `${BASE_API}/operation/auto/rules/query/default`,
    method: 'get',
  })
}

/**
 * 运营自动化-修改默认参数信息
 * @param data 修改参数
 * @returns 修改结果
 */
export function updateDefailtParmasOperationAutoMation(data?: IAutoMationUpdateReq): Promise<IAutoMationResult> {
  return request({
    url: `${BASE_API}/operation/auto/rules/update/default`,
    method: 'post',
    data,
  })
}

export function querySystemOperationLogListOperationAutoMation(params: {
  pageNo: number
  pageSize: number
  id: number
}): Promise<IAutomationLogRules> {
  return request({
    url: `${BASE_API}/operation/auto/rules/log`,
    method: 'get',
    params,
  })
}

/**
 * 运营自动化-库存查询
 * @param data 查询参数
 * @returns 运营自动化库存规则数据列表
 */
export function queryPriceAdjustmentInventoryRulesList(
  data?: IAutoMationQueryReq
): Promise<{ data: { list: IOperationStocksItem[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/list`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-调价库存修改
 * @param data  修改参数
 * @returns true成功 false失败
 */
export function updateOperationStock(data?: IOperationStockUpdateReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/update`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-获取调价默认参数
 * @param data  修改参数
 * @returns true成功 false失败
 */
export function queryOperationStock(): Promise<{ data: IOperationStockDefaultParams }> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/default/params`,
    method: 'get',
  })
}

/**
 * 运营自动化-获取调价默认参数
 * @param data  修改参数
 * @returns true成功 false失败
 */
export function updateOperationStockDefaultParams(data?: IOperationStockDefaultParams): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/update/default/params`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-调价库存批量
 * @param data  修改参数
 * @returns true成功 false失败
 */
export function updateBatchOperationStock(data?: IOperationStockUpdateReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/batch/update`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-调价库存日志查询
 * @param data
 */
export function queryOperationStockLogList(data: { pageNo: number; pageSize: number; id: number }): Promise<IOperationStockLogRules> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/logs`,
    method: 'post',
    data,
  })
}

/**
 * 运营自动化-调价库存站点默认参数
 * @param data
 */
export function querySiteOperations(): Promise<{ data: IOperationStockRulesSiteParams[] }> {
  return request({
    url: `${BASE_API}/operation/stock/rules/site/default/params`,
    method: 'get',
  })
}

/**
 * 运营自动化-调价库存站点默认参数
 * @param data
 */
export function updateOperationStockRulesParams(data: IOperationStockRulesSiteParams): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/stock/rules/site/default/params/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取销量趋势数据
 * @param params 请求参数
 * @returns Promise<GetSaleTrendResponse>
 */
export function getSaleTrend(params: GetSaleTrendParams): Promise<GetSaleTrendResponse> {
  return request({
    url: `${BASE_API}/operation/stock/auto/rules/sale/trend`,
    method: 'get',
    params,
  })
}

/**
 * @description 获取价格利润散点
 * @param params 请求参数
 * @returns Promise<GetSaleTrendResponse>
 */
export function getPriceProfitScatter(params: GetSaleTrendParams): Promise<GetPriceProfitScatterResponse> {
  return request({
    url: `${BASE_API}/operation/rules/price/profit/scatter`,
    method: 'get',
    params,
  })
}
