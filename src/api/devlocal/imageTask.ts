import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IAddArtDesignTaskReq,
  IArtDesignTaskMargin,
  IClaimArtDesignTaskReq,
  IGetArtDesignTaskListReq,
  IGetArtDesignTaskListRes,
  IGetArtDesignTaskMarginRes,
  IGetArtDesignTaskStatisticsRes,
  IUpdateArtDesignTaskDistributeReq
} from '/@/type/listingTask/imageTaskType'

/**
 * @description 获取美工任务列表
 * @param IGetArtDesignTaskListReq 
 */
export function getArtDesignTaskList(params: IGetArtDesignTaskListReq): Promise<IGetArtDesignTaskListRes> {
  return request({
    url: `${BASE_API}/artdesign/task/list`,
    method: 'get',
    params,
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