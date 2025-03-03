import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IGetProductManagerAssessmentListReq,
  IGetProductManagerAssessmentListRes,
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

export function updateProductManagerAssessment(data: IUpdateProductManagerAssessmentReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/update/product/manager/assessment`,
    method: 'post',
    data
  })
}