import { BASE_API } from '/@/api/devlocal/api'
import type {
  IAutoMationDefaultPramsRules,
  IAutoMationQueryReq,
  IAutoMationResult,
  IAutoMationRules,
  IAutoMationUpdateReq,
} from '/@/type/storeOperation/autoMation'
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
