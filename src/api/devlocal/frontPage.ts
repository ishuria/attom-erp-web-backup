import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IGetFrontPageAssessmentDataRes, IGetFrontPageProgressProjectsRes } from '/@/type/index/frontPage'


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
