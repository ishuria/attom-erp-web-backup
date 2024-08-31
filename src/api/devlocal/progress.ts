import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IDelImgQueryReq, IImageQueryReq, IProgressQueryReq, ProgressImgSort, IProgress, ISharelistQueryReq, ISampleListQueryReq, IProgressMoldAddQueryReq, IProgressMoldUpdateQueryReq, IProgressCostAccountingAdd, IProgressCostAccountingUpdate, IProgressCostAccountingUpload, IProgressComponentList, IProgressComponentUpdate, IProgressComponentAndSuppliserCopy, IProgressAddSample, IProgressSampleUpdate } from '/@/type/progress/progressType'

/**
 * 获取新品进度管理数据
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
 */
export function getProgressSharelist(params?: number) {
  return request({
    url: `${BASE_API}/progress/share`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-评估id查询新款评估信息
 */
export function getByIdQueryEvaluation(params?: number) {
  return request({
    url: `${BASE_API}/evaluation/getById`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-样品进度
 */
export function getProgressSampleList(params?: ISampleListQueryReq) {
  return request({
    url: `${BASE_API}/progress/sample/list`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-查询开发日志
 */
export function getProgressLog(params?: number) {
  return request({
    url: `${BASE_API}/progress/log`,
    method: 'get',
    params,
  })
}
/**
 * 新品进度-开模进度列表
 */
export function getProgressMoldList(params?: ISampleListQueryReq) {
  return request({
    url: `${BASE_API}/progress/mold/list`,
    method: 'get',
    params,
  })
}
/**
 * 成本核算-根据新品进度id检索列表
 */
export function getProgressCostAccountingList(params?: number) {
  return request({
    url: `${BASE_API}/progress/costAccounting/list`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单-根据新品进度id查询零件列表
 */
export function getProgressComponentList(params?: IProgressComponentList) {
  return request({
    url: `${BASE_API}/progress/component/list`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单-根据新品进度id查询零件列表
 */
export function getProgressGetComponentList(params?: number) {
  return request({
    url: `${BASE_API}/progress/get/componentList`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单-下拉供应商信息列表
 */
export function getProgressGetSuppliserList(params?: number) {
  return request({
    url: `${BASE_API}/progress/get/suppliserList`,
    method: 'get',
    params,
  })
}
/**
 * 零件清单- 样品追踪
 */
export function getProgressGetSample(params?: number) {
  return request({
    url: `${BASE_API}/progress/get/sample`,
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
export function updateProgressImgSort(data?: ProgressImgSort) {
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
export function copyProgress(data?: number) {
  return request({
    url: `${BASE_API}/progress/copy`,
    method: 'post',
    data,
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
export function updateProgressMold(data?: IProgressMoldUpdateQueryReq) {
  return request({
    url: `${BASE_API}/progress/mold/update`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-添加成本核算
 */
export function ProgressCostAccountingAdd(data?: IProgressCostAccountingAdd) {
  return request({
    url: `${BASE_API}/progress/costAccounting/add`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-删除进度产品成本核算
 * @param accountingId 新品进度产品成本核算id
 */
export function ProgressCostAccountingDelete(data?: number) {
  return request({
    url: `${BASE_API}/progress/costAccounting/delete`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-修改产品成本核算
 * @param accountingId 新品进度产品成本核算id
 */
export function ProgressCostAccountingUpdate(data?: IProgressCostAccountingUpdate) {
  return request({
    url: `${BASE_API}/progress/costAccounting/update`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-成本核算推进复制
 * @param accountingId 新品进度产品成本核算id
 */
export function ProgressCostAccountingCopy(data?: number) {
  return request({
    url: `${BASE_API}/progress/costAccounting/copy`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-图片上传
 */
export function ProgressCostAccountingUpload(data?: IProgressCostAccountingUpload) {
  return request({
    url: `${BASE_API}/progress/costAccounting/upload`,
    method: 'post',
    data,
  })
}
/**
 * 成本核算-图片上传
 */
export function ProgressCostAccountingUpdateSort(data?: number[]) {
  return request({
    url: `${BASE_API}/progress/costAccounting/update/sort`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-新增零件
 */
export function ProgressComponentAdd(data?: number) {
  return request({
    url: `${BASE_API}/progress/component/add`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-新增零件
 */
export function ProgressComponentUpdate(data?: IProgressComponentUpdate) {
  return request({
    url: `${BASE_API}/progress/component/update`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-新增供应商
 * @param componentId 零件id
 */
export function ProgressSuppliserAdd(data?: number) {
  return request({
    url: `${BASE_API}/progress/suppliser/add`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-供应商id删除供应商
 * @param suppliserId 供应商id
 */
export function ProgressSuppliserDel(data?: number) {
  return request({
    url: `${BASE_API}/progress/suppliser/del`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-复制
 * @param suppliserId 供应商id
 */
export function ProgressComponentAndSuppliserCopy(data?: IProgressComponentAndSuppliserCopy) {
  return request({
    url: `${BASE_API}/progress/componentAndSuppliser/copy`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-拿样
 */
export function ProgressAddSample(data?: IProgressAddSample) {
  return request({
    url: `${BASE_API}/progress/add/sample`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-拿样
 * @param sampleId 样品id
 */
export function ProgressSampleReceipt(data?: number) {
  return request({
    url: `${BASE_API}/progress/sample/receipt`,
    method: 'post',
    data,
  })
}
/**
 * 零件清单-拿样
 */
export function ProgressSampleUpdate(data?: IProgressSampleUpdate) {
  return request({
    url: `${BASE_API}/progress/sample/update`,
    method: 'post',
    data,
  })
}