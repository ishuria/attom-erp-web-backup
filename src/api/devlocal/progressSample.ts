import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IProgressSample,
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
  ISampleQueryResp,
  ISampleReceiptReq,
  ISampleReceiptResp,
  ISampleOrderReq,
  ISampleOrderResp,
  ISampleComponentListReq,
  ISampleComponentListResp,
  ISampleSuppliserListReq,
  ISampleSuppliserListResp,
  ISampleAddReq,
  ISampleAddResp,
  ITrialCalculationReq,
  ITrialCalculationAddResp,
  ITrialCalculationResp,
  ITrialCalculationGetResp,
  IUpdateProgressLogReq,
  IupdateTrialcalculationProductdesc,
  IgetTrialCalculationProductDesc,
  IupdateProgressProductdesc,
  IupdateProgressPriceInfo,
  IgetProgressProductDesc
} from '/@/type/progress/sampleAndComponentType'
import { IProgressId } from '~/src/type/progress/progressType'

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
 * 获取零件清单中实际的成本
 */
export function getProgressCalculation(params?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/get/calculation`,
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

/**
 * 样品追踪-手动签收
 * @param data
 * @returns
 */
export function updateSampleReceipt(params?: ISampleReceiptReq): Promise<ISampleReceiptResp> {
  return request({
    url: `${BASE_API}/progress/sample/receipt`,
    method: 'post',
    params,
  })
}

/**
 * 样品追踪-单号修改
 * @param data
 * @returns
 */
export function updateSampleOrder(data?: ISampleOrderReq): Promise<ISampleOrderResp> {
  return request({
    url: `${BASE_API}/progress/sample/update`,
    method: 'post',
    data,
  })
}

/**
 * 拿样-零件列表
 * @param params
 * @returns
 */
export function getComponentInfoList(params: ISampleComponentListReq): Promise<ISampleComponentListResp> {
  return request({
    url: `${BASE_API}/progress/get/componentList`,
    method: 'get',
    params,
  })
}

/**
 * 拿样-供应商列表
 * @param params
 * @returns
 */
export function getSuppliserInfoList(params: ISampleSuppliserListReq): Promise<ISampleSuppliserListResp> {
  return request({
    url: `${BASE_API}/progress/get/suppliserList`,
    method: 'get',
    params,
  })
}

/**
 * 拿样-提交拿样
 * @param data
 * @returns
 */
export function addSample(data?: ISampleAddReq): Promise<ISampleAddResp> {
  return request({
    url: `${BASE_API}/progress/add/sample`,
    method: 'post',
    data,
  })
}

/**
 * 拿样-拿样清单成本试算
 * @param params
 * @returns
 */
export function getTrialCalculation(params: ITrialCalculationReq): Promise<ITrialCalculationGetResp> {
  return request({
    url: `${BASE_API}/progress/get/trialcalculation`,
    method: 'get',
    params,
  })
}

/**
 * 拿样清单成本试算-添加
 * @param data
 * @returns
 */
export function addTrialCalculation(params?: ITrialCalculationReq): Promise<ITrialCalculationAddResp> {
  return request({
    url: `${BASE_API}/progress/add/trialcalculation`,
    method: 'post',
    params,
  })
}

/**
 * 拿样清单成本试算-更新
 * @param data
 * @returns
 */
export function updateTrialCalculation(data?: IProgressSample): Promise<ITrialCalculationResp> {
  return request({
    url: `${BASE_API}/progress/update/trialcalculation`,
    method: 'post',
    data,
  })
}

/**
 * 拿样清单成本试算-保存
 * @param data
 * @returns
 */
export function saveTrialCalculation(params?: IProgressSample): Promise<ITrialCalculationResp> {
  return request({
    url: `${BASE_API}/progress/save/trialcalculation`,
    method: 'post',
    params,
  })
}


/**
 * 拿样与核算-修改开发日志
 */
export function updateProgressLog(data?: IUpdateProgressLogReq) :Promise<IComponentCopyResp>{
  return request({
    url: `${BASE_API}/progress/update/log`,
    method: 'post',
    data,
  })
}

/**
 * 拿样清单成本试算-修改产品描述
 */
export function updateTrialcalculationProductdesc(params?: IupdateTrialcalculationProductdesc){
  return request({
    url: `${BASE_API}/progress/update/trialcalculation/productdesc`,
    method: 'post',
    params,
  })
}
/**
 * 拿样清单成本试算-获取产品描述
 * @param params
 * @returns
 */
export function getTrialCalculationProductDesc(params: IgetTrialCalculationProductDesc) {
  return request({
    url: `${BASE_API}/progress/get/trialcalculation/productdesc`,
    method: 'get',
    params,
  })
}
/**
 * 成本核算-修改产品描述
 */
export function updateProgressProductdesc(params?: IupdateProgressProductdesc){
  return request({
    url: `${BASE_API}/progress/update/productdesc`,
    method: 'post',
    params,
  })
}
/**
 * 拿样清单成本试算-修改产品描述
 */
export function updateProgressPriceInfo(params?: IupdateProgressPriceInfo){
  return request({
    url: `${BASE_API}/progress/update/priceInfo`,
    method: 'post',
    params,
  })
}
/**
 * 成本核算-获取产品描述
 * @param params
 * @returns
 */
export function getProgressProductDesc(params: IgetProgressProductDesc) {
  return request({
    url: `${BASE_API}/progress/get/productdesc`,
    method: 'get',
    params,
  })
}
/**
 * 成本核算-获取产品价格信息
 * @param params
 * @returns
 */
export function getProgressPriceInfo(params: IgetProgressProductDesc) {
  return request({
    url: `${BASE_API}/progress/get/priceInfo`,
    method: 'get',
    params,
  })
}