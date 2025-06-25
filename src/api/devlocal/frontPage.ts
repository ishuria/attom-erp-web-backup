import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IGetFrontPageAssessmentDataRes, IGetFrontPageBonusRes, IGetFrontPageHistoryAssessmentRecordsReq, IGetFrontPageHistoryAssessmentRecordsRes, IGetFrontPageProgressProjectsRes } from '/@/type/index/frontPage'


/**
 * 首页-推进中的项目
 * @returns 
 */
export function getFrontPageProgressProjects(): Promise<IGetFrontPageProgressProjectsRes> {
  return request({
    url: `${BASE_API}/front/page/progress/projects`,
    method: 'get',
  })
}

/**
 * 首页-项目总数
 * @returns 
 */
export function getFrontPageAssessmentData(): Promise<IGetFrontPageAssessmentDataRes> {
  return request({
    url: `${BASE_API}/front_page/assessment/data`,
    method: 'get',
  })
}

/**
 * 首页-历史考核记录
 * @param data 
 * @returns 
 */
export function getFrontPageHistoryAssessmentRecords(data: IGetFrontPageHistoryAssessmentRecordsReq): Promise<IGetFrontPageHistoryAssessmentRecordsRes> {
  return request({
    url: `${BASE_API}/front_page/history/assessment/records`,
    method: 'post',
    data
  })
}

/**
 * 首页-总提成
 * @returns 
 */
export function getFrontPageBonus(): Promise<{ data: IGetFrontPageBonusRes }> {
  return request({
    url: `${BASE_API}/front_page/bonus`,
    method: 'get'
  })
}
