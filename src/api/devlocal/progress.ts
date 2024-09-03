import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { 
  IDelImgQueryReq, 
  IImageQueryReq, 
  IProgressQueryReq, 
  IProgressImgSort, 
  IProgress, 
  ISharelistQueryReq, 
  ISampleListQueryReq, 
  IProgressMoldAddQueryReq, 
  IProgressMoldUpdateQueryReq, 
  IProgressCostAccountingAdd, 
  IProgressCostAccountingUpdate, 
  IProgressCostAccountingUpload, 
  IProgressComponentList, 
  IProgressComponentUpdate, 
  IProgressComponentAndSuppliserCopy, 
  IProgressAddSample, 
  IProgressSampleUpdate, 
  IProgressId, 
  IGetByIdQueryEvaluation, 
  ISupplierId, 
  ISampleId, 
  IIdNo, 
  IGetByIdQueryEvaluationResp, 
  ISampleListResp, 
  IProgressMoldListResp, 
  IProgressMoldUpdateResp, 
  IProgressCostAccountingUpdateResp, 
  IAccountingId,
  IProgressCostAccountingCopyResp,
  IProgressCostAccountingUploadResp,
  IShareListResp,
  IComponentId} from '/@/type/progress/progressType'

/**
 * 新品进度-获取新品进度管理列表
 * @param params 
 * @returns 
 */
export function getList(params?: IProgressQueryReq) {
  return request({
    url: `${BASE_API}/progress/list`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-获取共享人列表
 * @param progressId 进度id
 */
export function getProgressSharelist(params: IProgressId): Promise<IShareListResp> {
  return request({
    url: `${BASE_API}/progress/share`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-评估id查询新款评估信息
 * @param idNo 评估id
 */
export function getByIdQueryEvaluation(params: IIdNo): Promise<IGetByIdQueryEvaluationResp>{
  return request({
    url: `${BASE_API}/evaluation/getById`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-样品进度
 */
export function getProgressSampleList(params?: ISampleListQueryReq): Promise<ISampleListResp> {
  return request({
    url: `${BASE_API}/progress/sample/list`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-查询开发日志
 */
export function getProgressLog(params?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/log`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-开模进度列表
 */
export function getProgressMoldList(params?: ISampleListQueryReq): Promise<IProgressMoldListResp>{
  return request({
    url: `${BASE_API}/progress/mold/list`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单-下拉零件列表
 */
export function getProgressComponentList(params?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/get/componentList`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单-下拉供应商信息列表
 */
export function getProgressSuppliserList(params?: IComponentId) {
  return request({
    url: `${BASE_API}/progress/get/suppliserList`,
    method: 'get',
    params,
  })
}

/**
 * 图片上传请求
 */
export function uploadFile(data: FormData) {
  return request({
    url: `${BASE_API}/progress/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
/**
 * 图片删除功能
 */
export function deleteImage(data: FormData) {
  return request({
    url: `${BASE_API}/progress/del/image`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}
/**
 * 拖拽修改图片排序
 */
export function updateProgressImgSort(data?: IProgressImgSort) {
  return request({
    url: `${BASE_API}/progress/img/sort`,
    method: 'post',
    data,
  })
}
/**
 * 新品进度-修改
 */
export function updateProgressManage(data?: IProgress) {
  return request({
    url: `${BASE_API}/progress/update`,
    method: 'post',
    data,
  })
}
/**
 * 新品进度-复制
 */
export function copyProgress(data?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/copy`,
    headers: { 'content-type': 'multipart/form-data' },
    method: 'post',
    data,
  })
}
/**
 * 新品进度-修改共享人
 */
export function updateProgressSharelist(data?: ISharelistQueryReq) {
  return request({
    url: `${BASE_API}/progress/share`,
    method: 'post',
    data,
  })
}
/**
 * 新品进度-开模申请
 */
export function updateProgressMoldAdd(data?: IProgressMoldAddQueryReq) {
  return request({
    url: `${BASE_API}/progress/mold/add`,
    method: 'post',
    data,
  })
}
/**
 * 新品进度-开模进度审核
 */
export function updateProgressMold(data?: IProgressMoldUpdateQueryReq): Promise<IProgressMoldUpdateResp> {
  return request({
    url: `${BASE_API}/progress/mold/update`,
    method: 'post',
    data,
  })
}








