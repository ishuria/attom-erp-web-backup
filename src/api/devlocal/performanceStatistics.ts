import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddAdjustDetailReq,
  ICheckoutReq,
  IGetAdjustDetail,
  IGetAdjustDetailReq,
  IGetAdjustDetailRes,
  IGetAssessmentListReq,
  IGetAssessmentListRes,
  IGetOperationCommissionReq,
  IGetOperationCommissionRes,
  IGetProductManagerAssessmentListReq,
  IGetProductManagerAssessmentListRes,
  IGetUserAttendanceListRes,
  IMinimumMonthlyAssessment,
  IUpdateProductManagerAssessmentReq,
} from '/@/type/employeeManagement/performanceStatistics'

/**
 * @description 产品经理考核数设定参数列表
 */
export function getProductManagerAssessmentList(data: IGetProductManagerAssessmentListReq): Promise<IGetProductManagerAssessmentListRes> {
  return request({
    url: `${BASE_API}/product/manager/assessment/list`,
    method: 'post',
    data,
  })
}

/**
 * 更新用户免考核状态
 * @param params
 * @returns
 */
export function updateProductManagerNoAssessment(params: { id: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/user/attendance/no_assessment/update`,
    method: 'post',
    params,
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
    data,
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
    data,
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
    data,
  })
}
/**
 * 绩效统计-主管考勤统计明细
 * @param data
 * @returns
 */
export function getUserAttendanceListBySupervisor(data: IGetAssessmentListReq): Promise<IGetUserAttendanceListRes> {
  return request({
    url: `${BASE_API}/user/attendance/manager/list`,
    method: 'post',
    data,
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
    data,
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
    data,
  })
}

/**
 * 调整明细-来源列表
 * @param data
 * @returns
 */
export function getAdjustDetailSource(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/performance/adjust/detail/source/list`,
    method: 'get',
  })
}
/**
 * 查询当月 人员 对应调整明细
 * @param params
 * @returns
 */
export function getAdjustDetailByUser(params: { userId: number; month: string }): Promise<{ data: IGetAdjustDetail[] }> {
  return request({
    url: `${BASE_API}/performance/adjust/detail/by_user`,
    method: 'get',
    params,
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
    data,
  })
}

/**
 * 查询产品经理列表
 * @returns
 */
export function getProductManager(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/product/manager/user/list`,
    method: 'get',
  })
}

/**
 * 最大超额完成数-查询
 * @returns
 */
export function getMaximumOverfulfillment(): Promise<{ data: string }> {
  return request({
    url: `${BASE_API}/get/maximum/overfulfillment`,
    method: 'get',
  })
}
/**
 * 最大超额完成数-修改
 * @param data
 * @returns
 */
export function updateMaximumOverfulfillment(params: { number: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/update/maximum/overfulfillment`,
    method: 'post',
    params,
  })
}
/**
 * 考核数结账
 * @param data
 * @returns
 */
export function checkoutAssessmentNumber(data: ICheckoutReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/assessment/number/checkout`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取最低每月考核数
 * @returns 最低每月考核数列表
 */
export function getMinimumMonthlyAssessments(): Promise<{ data: IMinimumMonthlyAssessment[] }> {
  return request({
    url: `${BASE_API}/get/minimum/monthly/assessments`,
    method: 'get',
  })
}
/**
 * @description 更新最低每月考核数
 * @param params
 * @returns
 */
export function updateMinimumMonthlyAssessment(params: { id: number; number: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/update/minimum/monthly/assessments`,
    method: 'post',
    params,
  })
}

/**
 * @description 运营绩效-运营奖金查询
 */
export function getOperationCommission(data: IGetOperationCommissionReq): Promise<IGetOperationCommissionRes> {
  return request({
    url: `/operation/commission/summary`,
    method: 'post',
    data,
  })
}
