import { IComponentCopyResp } from './../../type/progress/sampleAndComponentType';
import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IComponentQueryReq,
  IComponentQueryResp,
  ICostAccountingQueryReq,
  ICostAccountingQueryResp,
  IComponentAddReq,
  IComponentAddResp,
  ISuppliersAddReq,
  ISuppliersAddResp,
  ISuppliersDeleteReq,
  ISuppliersDeleteResp,
  IComponentCopyReq,
  IComponentCopyResp
} from '/@/type/progress/sampleAndComponentType'

/**
 * 获取零件清单数据列表
 * @param params
 * @returns
 */
export function getComponentList(params?: IComponentQueryReq): Promise<IComponentQueryResp> {
  return request({
    url: `${BASE_API}/progress/component/list`,
    method: 'get',
    params,
  })
}

/**
 * 获取新品进度成本核算数据列表
 * @param params
 * @returns
 */
export function getCostAccountingList(params?: ICostAccountingQueryReq): Promise<ICostAccountingQueryResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/list`,
    method: 'get',
    params,
  })
}

/**
 * 零件清单-添加零件
 * @param params
 * @returns
 */
export function addComponent(params?: IComponentAddReq): Promise<IComponentAddResp> {
  return request({
    url: `${BASE_API}/progress/component/add`,
    method: 'post',
    params,
  })
}

/**
 * 零件清单-添加供应商
 * @param params
 * @returns
 */
export function addSuppliers(params?: ISuppliersAddReq): Promise<ISuppliersAddResp> {
  return request({
    url: `${BASE_API}/progress/suppliser/add`,
    method: 'post',
    params,
  })
}

/**
 * 零件清单-删除供应商
 * @param params
 * @returns
 */
export function deleteSuppliers(params?: ISuppliersDeleteReq): Promise<ISuppliersDeleteResp> {
  return request({
    url: `${BASE_API}/progress/suppliser/del`,
    method: 'post',
    params,
  })
}

/**
 * 零件清单-零件复制
 * @param params
 * @returns
 */
export function copyComponent(params?: IComponentCopyReq): Promise<IComponentCopyResp> {
  return request({
    url: `${BASE_API}/progress/componentAndSuppliser/copy`,
    method: 'post',
    params,
  })
}
