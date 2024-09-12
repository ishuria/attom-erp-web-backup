import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { 
    IreviewId, 
    IreviewStepNo1Del, 
    IreviewStepNo1SaveOn, 
    IreviewStepNo2Savetw, 
    IreviewStepNo3ComponentDel, 
    IreviewStepNo3ComponentListResp, 
    IreviewStepNo3ComponentUpdate 
} from '/@/type/orderProcess/orderProcessType'

/**
 * 新品进度-开模进度列表
 */
export function reviewStepNo3ComponentList(params?: IreviewId): Promise<IreviewStepNo3ComponentListResp>{
    return request({
      url: `${BASE_API}/review/stepsNo3/component/list`,
      method: 'get',
      params,
    })
}





/**
 * 新品订货流程-删除变体信息
 */
export function reviewStepNo1Del(params?: IreviewStepNo1Del) {
    return request({
      url: `${BASE_API}/review/stepsNo1/delete`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-产品基础信息输入保存
 */
export function reviewStepNo1SaveOn(data?: IreviewStepNo1SaveOn) {
    return request({
      url: `${BASE_API}/review/save/on`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-拿样零件添加-继续
 */
export function reviewStepNo2Savetw(params?: IreviewStepNo2Savetw) {
    return request({
      url: `${BASE_API}/review/save/tw`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-添加
 */
export function reviewStepNo3ComponentAdd(params?: IreviewId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/add`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-删除
 */
export function reviewStepNo3ComponentDel(params?: IreviewStepNo3ComponentDel) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/delete`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-零件复制
 */
export function reviewStepNo3ComponentCopy(params?: IreviewStepNo3ComponentDel) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/copy`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-修改
 */
export function reviewStepNo3ComponentUpdate(data?: IreviewStepNo3ComponentUpdate) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/update`,
      method: 'post',
      data,
    })
}