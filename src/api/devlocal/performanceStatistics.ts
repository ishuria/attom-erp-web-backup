import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddAdjustDetailReq,
  IGetAdjustDetail,
  IGetAdjustDetailReq,
  IGetAdjustDetailRes,
  IGetAssessmentListReq,
  IGetAssessmentListRes,
  IGetProductManagerAssessmentListReq,
  IGetProductManagerAssessmentListRes,
  IGetUserAttendanceListRes,
  IUpdateProductManagerAssessmentReq
} from '/@/type/employeeManagement/performanceStatistics'

/**
 * @description 产品经理考核数设定参数列表
 */
export function getProductManagerAssessmentList(data: IGetProductManagerAssessmentListReq): Promise<IGetProductManagerAssessmentListRes> {
  return request({
    url: `${BASE_API}/product/manager/assessment/list`,
    method: 'post',
    data
  })
}
/**
 * 修改产品经理考核数设定参数
 * @param data 
 * @returns 
 */
export function updateProductManagerAssessment(data: IUpdateProductManagerAssessmentReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/update/product/manager/assessment`,
    method: 'post',
    data
  })
}
/**
 * 绩效统计-产品经理考核列表数据获取
 * @param data 
 * @returns 
 */
export function getAssessmentList(data: IGetAssessmentListReq): Promise<IGetAssessmentListRes> {
  return request({
    url: `${BASE_API}/assessment/list`,
    method: 'post',
    data
  })
}
/**
 * 绩效统计-考勤统计明细
 * @param data 
 * @returns 
 */
export function getUserAttendanceList(data: IGetAssessmentListReq): Promise<IGetUserAttendanceListRes> {
  return request({
    url: `${BASE_API}/user/attendance/list`,
    method: 'post',
    data
  })
}

/**
 * 调整明细-新增
 * @param data
 * @returns 
 */
export function addAdjustDetail(data: IAddAdjustDetailReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/performance/add/adjust/detail`,
    method: 'post',
    data
  })
}

/**
 * 调整明细-查询
 * @param data
 * @returns 
 */
export function getAdjustDetail(data: IGetAdjustDetailReq): Promise<IGetAdjustDetailRes> {
  return request({
    url: `${BASE_API}/performance/adjust/detail/list`,
    method: 'post',
    data
  })
}

/**
 * 调整明细-删除
 * @param params
 * @returns 
 */
export function deleteAdjustDetail(data: IGetAdjustDetail): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/performance/adjust/detail/delete`,
    method: 'post',
    data
  })
}

/**
 * 查询产品经理列表
 * @returns 
 */
export function getProductManager(): Promise<{ data: { id: number, label: string}[] }> {
  return request({
    url: `${BASE_API}/product/manager/user/list`,
    method: 'get'
  })
}
