import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IAssessAdjustRes, IGetFrontPageAssessmentDataRes, IGetFrontPageBonusRes, IGetFrontPageHistoryAssessmentRecordsReq, IGetFrontPageHistoryAssessmentRecordsRes, IGetFrontPageMonthlyAssessment, IGetFrontPagePerformanceHistory, IGetFrontPagePerformanceHistoryReq, IGetFrontPageProductProfitRes, IGetFrontPageProgressProjectsRes, IRankItem } from '/@/type/index/frontPage'


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

/**
 * 首页-绩效历史
 * @returns 
 */
export function getFrontPagePerformanceHistory(data: IGetFrontPagePerformanceHistoryReq): Promise<{ data: IGetFrontPagePerformanceHistory[] }> {
  return request({
    url: `${BASE_API}/front_page/performance/history`,
    method: 'post',
    data
  })
}
/**
 * 首页-绩效历史-人员列表
 * @returns 
 */
export function getFrontPageProductManagerSelectOption(): Promise<{ data: { id: number, label: string }[] }> {
  return request({
    url: `${BASE_API}/front_page/product_manager/select_option`,
    method: 'get'
  })
}
/**
 * 首页-排行超额完成
 * @returns 
 */
export function getFrontPageRankOverAchieved(params: { month: string }): Promise<{ data: IRankItem[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/overAchieved`,
    method: 'get',
    params
  })
}
/**
 * 首页-排行新品提成
 * @returns 
 */
export function getFrontPageRankNewProductCommission(): Promise<{ data: IRankItem[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/new_product_commission`,
    method: 'get'
  })
}

/**
 * 首页-考核数调整查询
 * @returns 
 */
export function getMonthlyAndNextMonthAssess(): Promise<{ data: IAssessAdjustRes }> {
  return request({
    url: `${BASE_API}/assessment/number/adjust/list`,
    method: 'get'
  })
}
/**
 * 首页-考核数调整提交
 * @param params 
 * @returns 
 */
export function submitAssess(params: { number: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/assessment/number/adjust/submit`,
    method: 'post',
    params
  })
}
/**
 * 首页-当月产品利润分
 * @returns 
 */
export function getMonthlyProductProfit(params: { month: string }): Promise<{ data: IGetFrontPageProductProfitRes[] }> {
  return request({
    url: `${BASE_API}/front_page/monthly/product/profit`,
    method: 'get',
    params
  })
}
/**
 * 首页-当月考核数 加回
 * @returns 
 */
export function getMonthlyAssessmentPlus(params: { month: string }): Promise<{ data: IGetFrontPageMonthlyAssessment[] }> {
  return request({
    url: `${BASE_API}/front_page/monthly/assessment/plus`,
    method: 'get',
    params
  })
}
/**
 * 首页-当月考核数 减免
 * @returns 
 */
export function getMonthlyAssessmentMinus(params: { month: string }): Promise<{ data: IGetFrontPageMonthlyAssessment[] }> {
  return request({
    url: `${BASE_API}/front_page/monthly/assessment/minus`,
    method: 'get',
    params
  })
}

/**
 * 首页-排行考核数完成
 * @param params 
 * @returns 
 */
export function getFrontPageRankAssessmentFinish(params: { month: string }): Promise<{ data: IRankItem[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/assessment_finish`,
    method: 'get',
    params
  })
}
/**
 * 首页-排行考核数完成-月份列表
 * @returns 
 */
export function getFrontPageHistoryMonthList(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/history/month`,
    method: 'get'
  })
}