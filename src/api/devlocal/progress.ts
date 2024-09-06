import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { 
  IProgressQueryReq, 
  IProgressImgSort, 
  IProgress, 
  ISharelistQueryReq, 
  ISampleListQueryReq, 
  IProgressMoldAddQueryReq, 
  IProgressMoldUpdateQueryReq, 
  IProgressSampleUpdate, 
  IProgressId, 
  ISampleId, 
  IIdNo, 
  IGetByIdQueryEvaluationResp, 
  ISampleListResp, 
  IProgressMoldListResp, 
  IProgressMoldUpdateResp, 
  IShareListResp,
  IComponentId,
  IProgressSampleReceiptResp,
  ISharePersonReq,
  IProgressFilterResp} from '/@/type/progress/progressType'

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
 * 新品进度-获取参与人员列表
 */
export function getProgressPersonList() {
  return request({
    url: `${BASE_API}/progress/person/list`,
    method: 'get',
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
export function copyProgress(params?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/copy`,
    method: 'post',
    params,
  })
}
/**
 * 新品进度-修改共享人
 */
export function updateProgressSharelist(data?: ISharelistQueryReq) {
  return request({
    url: `${BASE_API}/progress/update/share`,
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
/**
 * 样品进度-手动签收
 */
export function ProgressSampleReceipt(params?: ISampleId): Promise<IProgressSampleReceiptResp> {
  return request({
    url: `${BASE_API}/progress/sample/receipt`,
    method: 'post',
    params,
  })
}
/**
 * 样品进度-修改1688单号or物流单号
 */
export function ProgressSampleUpdate(data?: IProgressSampleUpdate) {
  return request({
    url: `${BASE_API}/progress/sample/update`,
    method: 'post',
    data,
  })
}
/**
 * 新品进度-归档
 */
export function updateProgressArchive(params?: IProgressId) {
  return request({
    url: `${BASE_API}/progress/archive`,
    method: 'post',
    params,
  })
}
/**
 * 新品进度-参与人员筛选
 */
export function getProgressFilter(data?: ISharePersonReq): Promise<IProgressFilterResp>{
  return request({
    url: `${BASE_API}/progress/filter`,
    method: 'post',
    data,
  })
}




