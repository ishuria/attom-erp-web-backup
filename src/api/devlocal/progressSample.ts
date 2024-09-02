import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IProgressProdcutComponent,
  IProgressEstimatedCostAccounting,
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
  IComponentCopyResp,
  IComponentImageResp,
  IComponentUpdateResp,
  IProgressCostAccountResp,
  ICostAccountingImageResp,
  ICostAccountingUpdateSortResp,
  ICostAccountingCopyReq,
  ICostAccountingCopyResp,
  ICostAccountingUpdateResp,
  ICostAccountingDeleteReq,
  ICostAccountingDeleteResp,
  ISampleQueryReq,
  ISampleQueryResp

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

/**
 * 零件清单-图片上传
 * @param data
 * @returns
 */
export function componentUploadImage(data?: any): Promise<IComponentImageResp> {
  return request({
    url: `${BASE_API}/progress/component/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 零件清单-修改
 * @param data
 * @returns
 */
export function updateComponenet(data?: IProgressProdcutComponent): Promise<IComponentUpdateResp> {
  return request({
    url: `${BASE_API}/progress/component/update`,
    method: 'post',
    data,
  })
}


/**
 * 样品追踪数据列表
 * @param params
 * @returns
 */
export function getSampleList(params?: ISampleQueryReq): Promise<ISampleQueryResp> {
  return request({
    url: `${BASE_API}/progress/get/sample`,
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
 * 成本核算-添加
 * @param data
 * @returns
 */
export function addCostAccounting(data?: any): Promise<IProgressCostAccountResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/add`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 成本核算-图片上传
 * @param data
 * @returns
 */
export function costAccountingUploadImage(data?: any): Promise<ICostAccountingImageResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 成本核算-表格table拖拽排序
 * @param data
 * @returns
 */
export function costAccountingUpdateRowSort(data?: string[]): Promise<ICostAccountingUpdateSortResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/update/sort`,
    method: 'post',
    data,
  })
}

/**
 * 成本核算-复制
 * @param data
 * @returns
 */
export function costAccountingCopy(params?: ICostAccountingCopyReq): Promise<ICostAccountingCopyResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/copy`,
    method: 'post',
    params,
  })
}

/**
 * 成本核算-修改
 * @param data
 * @returns
 */
export function costAccountingUpdate(data?: IProgressEstimatedCostAccounting): Promise<ICostAccountingUpdateResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/update`,
    method: 'post',
    data,
  })
}

/**
 * 成本核算-删除
 * @param data
 * @returns
 */
export function costAccountingDelete(data?: ICostAccountingDeleteReq): Promise<ICostAccountingDeleteResp> {
  return request({
    url: `${BASE_API}/progress/costAccounting/delete`,
    headers: { 'content-type': 'multipart/form-data' },
    method: 'post',
    data,
  })
}
