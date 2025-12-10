import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type { IProgressId } from '/@/type/progress/progressType'
import type {
  IComponentAddReq,
  IComponentAddResp,
  IComponentCopyReq,
  IComponentCopyResp,
  IComponentImageResp,
  IComponentQueryReq,
  IComponentQueryResp,
  IComponentUpdateResp,
  ICostAccountingCopyReq,
  ICostAccountingCopyResp,
  ICostAccountingDeleteReq,
  ICostAccountingDeleteResp,
  ICostAccountingImageResp,
  ICostAccountingQueryReq,
  ICostAccountingQueryResp,
  ICostAccountingUpdateResp,
  ICostAccountingUpdateSortResp,
  IGetSampleFeeRefundListReq,
  IGetSampleFeeRefundListResp,
  IProgressCostAccountResp,
  IProgressEstimatedCostAccounting,
  IProgressProdcutComponent,
  IProgressSample,
  ISampleAddReq,
  ISampleAddResp,
  ISampleComponentListReq,
  ISampleComponentListResp,
  ISampleOrderReq,
  ISampleOrderResp,
  ISampleQueryReq,
  ISampleQueryResp,
  ISampleReceiptReq,
  ISampleReceiptResp,
  ISampleSuppliserListReq,
  ISampleSuppliserListResp,
  ISubmitProgressComponentQuery,
  ISubmitProgressConsumableQuery,
  ISuppliersAddReq,
  ISuppliersAddResp,
  ISuppliersDeleteReq,
  ISuppliersDeleteResp,
  ITrialCalculationAddResp,
  ITrialCalculationGetResp,
  ITrialCalculationReq,
  ITrialCalculationResp,
  IUpdateProgressLogReq,
  IgetProgressProductDesc,
  IgetTrialCalculationProductDesc,
  IupdateProgressPriceInfo,
  IupdateProgressProductdesc,
  IupdateTrialcalculationProductdesc,
} from '/@/type/progress/sampleAndComponentType'
import type { IBooleanResp } from '/@/type/purchase/po'

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
 * @description 零件清单-删除图片
 */
export function componentDeleteImage(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/progress/delete/trial/img`,
    method: 'post',
    params,
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
 * @description 样品追踪 修改备注
 */
export function updateSampleTrackRemark(data: { id: number; remark: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/progress/sample/remark/save`,
    method: 'post',
    data,
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
 * @description 成本核算-删除图片信息
 */
export function costAccountingDeleteImage(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/progress/costAccounting/delete/img`,
    method: 'post',
    params,
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
 * 零件清单-表格table拖拽排序
 * @param data
 * @returns
 */
export function componentUpdateRowSort(data?: string[]): Promise<ICostAccountingUpdateSortResp> {
  return request({
    url: `${BASE_API}/progress/component/update/sort`,
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
export function updateProgressLog(data?: IUpdateProgressLogReq): Promise<IComponentCopyResp> {
  return request({
    url: `${BASE_API}/progress/update/log`,
    method: 'post',
    data,
  })
}

/**
 * 拿样清单成本试算-修改产品描述
 */
export function updateTrialcalculationProductdesc(params?: IupdateTrialcalculationProductdesc) {
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
export function updateProgressProductdesc(params?: IupdateProgressProductdesc) {
  return request({
    url: `${BASE_API}/progress/update/productdesc`,
    method: 'post',
    params,
  })
}
/**
 * 拿样清单成本试算-修改产品描述
 */
export function updateProgressPriceInfo(params?: IupdateProgressPriceInfo) {
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

// 添加零件提交
export function submitProgressComponent(data?: ISubmitProgressComponentQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/progress/submit/component`,
    method: 'post',
    data,
  })
}
// 添加耗材提交
export function submitProgressConsumable(data?: ISubmitProgressConsumableQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/progress/submit/consumables`,
    method: 'post',
    data,
  })
}
// 新品进度成本核算-逆算
export function reverseCalculateProgress(params?: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/progress/reverse/calculation`,
    method: 'post',
    params,
  })
}
// 新品进度拿样清单成本试算-逆算
export function reverseCalculateProgressSample(params?: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/progress/sample/reverse/calculation`,
    method: 'post',
    params,
  })
}

// 样品费退还列表
export function getSampleFeeRefundList(params: IGetSampleFeeRefundListReq): Promise<IGetSampleFeeRefundListResp> {
  return request({
    url: `${BASE_API}/sample/fee/refund/list`,
    method: 'get',
    params,
  })
}
/**
 * 样品费退还-修改状态
 * @param data { id: number; refundStatus: number }
 * @returns { data: boolean }
 */
export function updateSampleFeeRefund(params: { id: number; refundStatus: number }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sample/fee/refund/update`,
    method: 'post',
    params,
  })
}
/**
 * 样品费退还-修改备注
 * @param params { id: number; remark: string }
 * @returns { data: boolean }
 */
export function updateSampleFeeRefundRemark(params: { id: number; refundRemark: string }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sample/fee/refund/update/remark`,
    method: 'post',
    params,
  })
}
/**
 * 样品费退还-上传退款凭证
 * @param data FormData
 * @returns { data: string }
 */
export function updateSampleFeeRefundProof(data: FormData): Promise<{ data: string }> {
  return request({
    url: `${BASE_API}/sample/fee/refund/upload/proof`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 样品费退还-删除退款凭证
 * @param params { id: number }
 * @returns { data: boolean }
 */
export function deleteSampleFeeRefundProof(params: { id: number }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sample/fee/refund/delete/proof`,
    method: 'post',
    params,
  })
}
