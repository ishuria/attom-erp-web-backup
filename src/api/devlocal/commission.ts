import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IGetCommissionArtTypeListRes,
  IGetCommissionProductTypeListRes,
  IGetCommissionSettingRes,
  IGetCommissionTaskPictureListReq,
  IGetCommissionTaskPictureListRes,
  IGetDevelopDesignTaskListRes,
  IGetLongCommissionTaskListReq,
  IGetLongCommissionTaskListRes,
  IGetReductionCostListRes,
  IUpdateCommissionArtTypeReq,
  IUpdateCommissionProductTypeReq,
  IUpdateCommissionSetting1Req,
  IUpdateCommissionTaskPictureReq,
  IUpdateDevelopDesignTaskReq,
  IUpdateLongCommissionTaskReq,
  IUpdateReductionCostTaskReq
} from '/@/type/commission/commissionType'

/**
 * @description 提成系数设定-美工类型
 */
export function getCommissionArtTypeList(params: { keyWord: string }): Promise<IGetCommissionArtTypeListRes> {
  return request({
    url: `${BASE_API}/commission/art/type/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 提成系数设定-美工类型-修改
 */
export function updateCommissionArtType(data: IUpdateCommissionArtTypeReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/art/type/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成系数设定-产品类型
 */
export function getCommissionProductTypeList(params: { keyWord: string }): Promise<IGetCommissionProductTypeListRes> {
  return request({
    url: `${BASE_API}/commission/product/type/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 提成系数设定-产品类型-修改
 */
export function updateCommissionProductType(data: IUpdateCommissionProductTypeReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/product/type/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成系数设定-参数设定列表
 */
export function getCommissionSetting(): Promise<IGetCommissionSettingRes> {
  return request({
    url: `${BASE_API}/commission/setting`,
    method: 'get',
  })
}
/**
 * @description 提成系数设定-参数设定列表1确定提交
 */
export function updateCommissionSetting1(data: IUpdateCommissionSetting1Req): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/setting1/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成系数设定-参数设定2table修改
 */
export function updateCommissionSetting2(data: { id: number, targetRate: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/setting2/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成任务-美工图片任务列表查询
 */
export function getCommissionTaskPictureList(params: IGetCommissionTaskPictureListReq): Promise<IGetCommissionTaskPictureListRes> {
  return request({
    url: `${BASE_API}/commission/task/picture/list`,
    method: 'get',
    params
  })
}
/**
 * @description 提成任务-美工图片暂停
 */
export function pauseCommissionTaskPicture(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/pause`,
    method: 'post',
    params
  })
}
/**
 * @description 提成任务-美工图片继续
 */
export function continueCommissionTaskPicture(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/continue`,
    method: 'post',
    params
  })
}
/**
 * @description 提成任务-美工图片修改
 */
export function updateCommissionTaskPicture(data: IUpdateCommissionTaskPictureReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成任务-美工长期列表查询
 */
export function getLongCommissionTaskList(params: IGetLongCommissionTaskListReq): Promise<IGetLongCommissionTaskListRes> {
  return request({
    url: `${BASE_API}/long/commission/task/list`,
    method: 'get',
    params
  })
}
/**
 * @description 提成任务-美工长期修改
 */
export function updateLongCommissionTask(data: IUpdateLongCommissionTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成任务-美工长期继续
 */
export function continueLongCommissionTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/continue`,
    method: 'post',
    params
  })
}
/**
 * @description 提成任务-美工长期暂停
 */
export function pauseLongCommissionTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/pause`,
    method: 'post',
    params
  })
}
/**
 * @description 产品开发设计提成任务-列表查询
 */
export function getDevelopDesignTaskList(params: IGetLongCommissionTaskListReq): Promise<IGetDevelopDesignTaskListRes> {
  return request({
    url: `${BASE_API}/develop/design/task/list`,
    method: 'get',
    params
  })
}
/**
 * @description 产品开发设计提成任务-继续
 */
export function continueDevelopDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/continue`,
    method: 'post',
    params
  })
}
/**
 * @description 产品开发设计提成任务-暂停
 */
export function pauseDevelopDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/pause`,
    method: 'post',
    params
  })
}
/**
 * @description 产品开发设计提成任务-修改
 */
export function updateDevelopDesignTask(data: IUpdateDevelopDesignTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/update`,
    method: 'post',
    data
  })
}
/**
 * @description 采购降本提成任务-列表获取
 */
export function getReductionCostList(params: IGetLongCommissionTaskListReq): Promise<IGetReductionCostListRes> {
  return request({
    url: `${BASE_API}/cost/reduction/list`,
    method: 'get',
    params
  })
}
/**
 * @description 采购降本提成任务-审核通过
 */
export function passReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/pass`,
    method: 'post',
    params
  })
}
/**
 * @description 采购降本提成任务-审核不通过
 */
export function notPassReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/not/pass`,
    method: 'post',
    params
  })
}
/**
 * @description 采购降本提成任务-暂停
 */
export function pauseReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/pause`,
    method: 'post',
    params
  })
}
/**
 * @description 采购降本提成任务-继续
 */
export function continueReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/continue`,
    method: 'post',
    params
  })
}
/**
 * @description 采购降本提成任务-修改
 */
export function updateReductionCostTask(data: IUpdateReductionCostTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/update`,
    method: 'post',
    data
  })
}