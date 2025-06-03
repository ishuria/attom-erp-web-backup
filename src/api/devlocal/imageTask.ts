import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddArtDesignTaskReq,
  IArtDesignTaskMargin,
  IClaimArtDesignTaskReq,
  IConfirmOtherSkuArtDesignSellingPointRes,
  IGetArtDesignSelectionReasonsList,
  IGetArtDesignTaskListReq,
  IGetArtDesignTaskListRes,
  IGetArtDesignTaskMarginRes,
  IGetArtDesignTaskStatisticsRes,
  IGetCopywritingRes,
  IGetSellingPoint,
  IGetSellingPointRes,
  IQueryArtDesignTaskDistributionRes,
  ISaveArtDesignCopywritingReq,
  ISaveBatchSellingPointReq,
  IUpdateArtDesignDemandAddressReq,
  IUpdateArtDesignTaskDistributeReq
} from '/@/type/listingTask/imageTaskType'

/**
 * @description 获取美工任务列表
 * @param IGetArtDesignTaskListReq 
 */
export function getArtDesignTaskList(data: IGetArtDesignTaskListReq): Promise<IGetArtDesignTaskListRes> {
  return request({
    url: `${BASE_API}/artdesign/task/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 美工任务-发布任务
 * @param IAddArtDesignTaskReq 
 */
export function addArtDesignTask(data: IAddArtDesignTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 美工任务-删除美工任务
 * @param id
 */
export function delArtDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/delete`,
    method: 'post',
    params,
  })
}
/**
 * @description 美工任务-任务认领
 * @param IClaimArtDesignTaskReq
 */
export function claimArtDesignTask(params: IClaimArtDesignTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/claim`,
    method: 'post',
    params,
  })
}
/**
 * @description 美工任务-余量设定查询
 */
export function getArtDesignTaskMargin(): Promise<IGetArtDesignTaskMarginRes> {
  return request({
    url: `${BASE_API}/artdesign/task/margin/query`,
    method: 'get',
  })
}
/**
 * @description 美工任务-余量设定修改
 * @data IArtDesignTaskMargin
 */
export function updateArtDesignTaskMargin(data: IArtDesignTaskMargin): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/margin/update`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-任务量统计
 */
export function getArtDesignTaskStatistics(): Promise<IGetArtDesignTaskStatisticsRes> {
  return request({
    url: `${BASE_API}/artdesign/task/statistics`,
    method: 'get',
  })
}
/**
 * @description 美工任务-长期提成
 */
export function updateLongTermArtDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/long/term`,
    method: 'post',
    params
  })
}
/**
 * @description 美工任务-完成
 */
export function finishArtDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/finish`,
    method: 'post',
    params
  })
}
/**
 * @description 美工任务-备注
 */
export function updateArtDesignTaskRemark(data: { id: number, remark: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/remark`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-美工人员列表
 */
export function getArtDesignTaskUserList() {
  return request({
    url: `${BASE_API}/artdesign/task/user/list`,
    method: 'get',
  })
}
/**
 * @description 美工任务-任务分配修改
 */
export function updateArtDesignTaskDistribute(data: IUpdateArtDesignTaskDistributeReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/task/distribution/update`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-查看卖点
 */
export function getArtDesignSellingPoint(params: { sku: string }): Promise<IGetSellingPointRes> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/query`,
    method: 'get',
    params
  })
}
/**
 * @description 美工任务-卖点保存
 */
export function saveArtDesignSellingPoint(data: IGetSellingPoint): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/save`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-卖点下拉列表
 */
export function getArtDesignSellingPointDropdownList(): Promise<{ data: { id: number, label: string }[]}> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/dropdown/list`,
    method: 'get',
  })
}
/**
 * @description 美工任务-从其他SKU导入确认
 */
export function confirmOtherSkuArtDesignSellingPoint(params: { sku: string }): Promise<IConfirmOtherSkuArtDesignSellingPointRes> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/other/sku`,
    method: 'get',
    params
  })
}
/**
 * @description 美工任务-查看文案
 */
export function getArtDesignCopywriting(params: { sku: string }): Promise<IGetCopywritingRes> {
  return request({
    url: `${BASE_API}/artdesign/copywriting/query`,
    method: 'get',
    params
  })
}
/**
 * @description 美工任务-文案保存
 */
export function saveArtDesignCopywriting(data: ISaveArtDesignCopywritingReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/copywriting/save`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-卖点批量查看
 */
export function getBatchArtDesignSellingPoint(params: { skus: string }): Promise<IGetSellingPointRes> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/batch/query`,
    method: 'get',
    params
  })
}
/**
 * @description 美工任务-卖点批量填写保存
 */
export function saveBatchArtDesignSellingPoint(data: ISaveBatchSellingPointReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/sell/point/batch`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-选品理由下拉列表
 */
export function getArtDesignSelectionReasons(): Promise<{ data: { id: number, label: string}[] }> {
  return request({
    url: `${BASE_API}/artdesign/selection/reasons`,
    method: 'get',
  })
}
/**
 * @description 美工任务-选品理由设定列表
 */
export function getArtDesignSelectionReasonsList(): Promise<{ data: IGetArtDesignSelectionReasonsList[] }> {
  return request({
    url: `${BASE_API}/artdesign/selection/reasons/list`,
    method: 'get',
  })
}
/**
 * @description 美工任务-删除选品理由
 */
export function delArtDesignSelectionReasons(data: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/selection/reasons/delete`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-添加选品理由
 */
export function addArtDesignSelectionReasons(data: { reason: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/selection/reasons/add`,
    method: 'post',
    data
  })
}
/**
 * @description 美工任务-需求文件地址修改
 */
export function updateArtDesignDemandAddress(data: IUpdateArtDesignDemandAddressReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/artdesign/demand/address/update`,
    method: 'post',
    data
  })
}
/**
 * listing-图片任务 已分配人员查询
 * @param params 
 * @returns 
 */
export function queryArtDesignTaskDistribution(params: { taskId: number }): Promise<IQueryArtDesignTaskDistributionRes> {
  return request({
    url: `${BASE_API}/artdesign/task/distribution/query`,
    method: 'post',
    params
  })
}