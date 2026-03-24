import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IKeyProductsItem } from '~/src/type/storeOperation/keyProducts'
import { IGetOperationAmazonSKUList } from '~/src/type/storeOperation/productPerformanceType'
import {
  IAssessAdjustRes,
  IGetFrontPageAssessmentDataRes,
  IGetFrontPageAttendanceOverview,
  IGetFrontPageBonusRes,
  IGetFrontPageDestroyValueDetailRes,
  IGetFrontPageDestroyValueRes,
  IGetFrontPageFbaCountSaleDayChartRes,
  IGetFrontPageHistoryAssessmentRecordsReq,
  IGetFrontPageHistoryAssessmentRecordsRes,
  IGetFrontPageInventoryProductsTotalValue,
  IGetFrontPageJobLevelCommission,
  IGetFrontPageMonthlyAssessment,
  IGetFrontPageNewProductSaleDayChartRes,
  IGetFrontPagePerformanceHistory,
  IGetFrontPagePerformanceHistoryReq,
  IGetFrontPagePersonalBonusRes,
  IGetFrontPageProductProfitRes,
  IGetFrontPageProfitScoreRes,
  IGetFrontPageProgressProjectsRes,
  ILowVolumeProductStorageFee,
  IRankItem,
  IWarehouseCapacityItem,
} from '/@/type/index/frontPage'

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
export function getFrontPageHistoryAssessmentRecords(
  data: IGetFrontPageHistoryAssessmentRecordsReq
): Promise<IGetFrontPageHistoryAssessmentRecordsRes> {
  return request({
    url: `${BASE_API}/front_page/history/assessment/records`,
    method: 'post',
    data,
  })
}

/**
 * 首页-总提成
 * @returns
 */
export function getFrontPageBonus(): Promise<{ data: IGetFrontPageBonusRes }> {
  return request({
    url: `${BASE_API}/front_page/bonus`,
    method: 'get',
  })
}
/**
 * 首页-销毁货值
 * @returns
 */
export function getFrontPageDestroyValue(): Promise<{ data: IGetFrontPageDestroyValueRes }> {
  return request({
    url: `${BASE_API}/front_page/destroy_value`,
    method: 'get',
  })
}
/**
 * 首页-销毁货值-负责人
 * @returns
 */
export function getFrontPageLeadDestroyValue(): Promise<{ data: IGetFrontPageDestroyValueRes }> {
  return request({
    url: `${BASE_API}/front_page/lead/destroy_value`,
    method: 'get',
  })
}
/**
 * 首页-销毁货值-详情
 * @returns
 */
export function getFrontPageDestroyValueDetail(): Promise<{ data: IGetFrontPageDestroyValueDetailRes }> {
  return request({
    url: `${BASE_API}/front_page/destroy_value/detail`,
    method: 'get',
  })
}
/**
 * 首页-销毁货值-负责人详情
 * @returns
 */
export function getFrontPageDestroyValueLeadDetail(): Promise<{ data: IGetFrontPageDestroyValueDetailRes }> {
  return request({
    url: `${BASE_API}/front_page/destroy_value/lead/detail`,
    method: 'get',
  })
}
/**
 * 首页-绩效历史
 * @returns
 */
export function getFrontPagePerformanceHistory(
  data: IGetFrontPagePerformanceHistoryReq
): Promise<{ data: IGetFrontPagePerformanceHistory[] }> {
  return request({
    url: `${BASE_API}/front_page/performance/history`,
    method: 'post',
    data,
  })
}
/**
 * 首页-绩效历史-汇总
 * @param params { startMonth: string, endMonth: string }
 * @returns { data: Record<string, IGetFrontPagePerformanceHistory[]> }
 */
export function getFrontPagePerformanceHistorySummary(params: { startMonth: string; endMonth: string }): Promise<{
  data: Record<string, IGetFrontPagePerformanceHistory[]>
}> {
  return request({
    url: `${BASE_API}/front_page/performance/history/summary`,
    method: 'get',
    params,
  })
}
/**
 * 首页-绩效历史-人员列表
 * @returns
 */
export function getFrontPageProductManagerSelectOption(params: { type: number }): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/front_page/product_manager/select_option`,
    method: 'get',
    params,
  })
}
/**
 * 运营分类-用户列表
 * @param params { userId: number }
 * @returns { data: { id: number; label: string }[] }
 */
export function getOperationTypeUserList(params: { userId: number }): Promise<{ data: { id: number; typeName: string }[] }> {
  return request({
    url: `${BASE_API}/operation/type/user/list`,
    method: 'get',
    params,
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
    params,
  })
}
/**
 * 首页-排行新品提成
 * @returns
 */
export function getFrontPageRankNewProductOneYearCommission(params: { month: string }): Promise<{ data: IRankItem[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/new_product_one_year_commission`,
    method: 'get',
    params,
  })
}
/**
 * 首页-排行新品提成(过去6个月月均)
 * @returns
 */
export function getFrontPageRankNewProductCommission(params: { month: string }): Promise<{ data: IRankItem[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/new_product_commission`,
    method: 'get',
    params,
  })
}
/**
 * 首页-考核数调整查询
 * @returns
 */
export function getMonthlyAndNextMonthAssess(): Promise<{ data: IAssessAdjustRes }> {
  return request({
    url: `${BASE_API}/assessment/number/adjust/list`,
    method: 'get',
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
    params,
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
    params,
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
    params,
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
    params,
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
    params,
  })
}
/**
 * 首页-排行考核数完成-月份列表
 * @returns
 */
export function getFrontPageHistoryMonthList(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/front_page/rank/history/month`,
    method: 'get',
  })
}

/**
 * 首页-调整明细-月份列表
 * @returns
 */
export function getFrontPageAdjustDetailMonth(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/front_page/adjust/detail/month`,
    method: 'get',
  })
}

/**
 * 首页-考核结账月份列表
 * @returns
 */
export function getFrontPageBillingMonth(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/front_page/billing/month`,
    method: 'get',
  })
}
/**
 * 首页-TOP30新品销售额排行
 * @returns
 */
export function getFrontPageTop30ProductSale(): Promise<{ data: IGetOperationAmazonSKUList[] }> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/top30/list`,
    method: 'get',
  })
}
/**
 * 首页-TOP50亏损产品排行
 * @returns
 */
export function getFrontPageTop50ProductLoss(params: { userId: number }): Promise<{ data: IGetOperationAmazonSKUList[] }> {
  return request({
    url: `${BASE_API}/operation/amazon/sku/top50/loss/list`,
    method: 'get',
    params,
  })
}
/**
 * 首页-库存货值统计
 * @returns
 */
export function getFrontPageInventoryProductsTotalValue(params: {
  startDate: string
  endDate: string
}): Promise<{ data: IGetFrontPageInventoryProductsTotalValue[] }> {
  return request({
    url: `${BASE_API}/front_page/inventory_value/get`,
    method: 'get',
    params,
  })
}
/**
 * 首页-库存货值统计-更新
 * @returns
 */
export function updateFrontPageInventoryProductsTotalValue(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/front_page/inventory_value/update`,
    method: 'post',
  })
}
/**
 * 首页-仓库容量
 * @returns
 */
export function getFrontPageWarehouseCapacity(params: { startDate: string; endDate: string }): Promise<{ data: IWarehouseCapacityItem[] }> {
  return request({
    url: `${BASE_API}/front_page/warehouse_capacity/get`,
    method: 'get',
    params,
  })
}
/**
 * 首页-仓库容量-更新
 * @returns
 */
export function updateFrontPageWarehouseCapacity(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/front_page/warehouse_capacity/update`,
    method: 'post',
  })
}

/**
 * 首页-职级提成展示
 * @param params
 * @returns
 */
export function getFrontPageJobLevelCommission(params: { month: string }): Promise<{ data: IGetFrontPageJobLevelCommission[] }> {
  return request({
    url: `${BASE_API}/front_page/job_level/commission`,
    method: 'get',
    params,
  })
}
/**
 * 首页-低动销产品仓储费
 * @param params
 * @returns
 */
export function getLowVolumeProductStorageFee(data: {
  id: number
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}): Promise<{ data: { list: ILowVolumeProductStorageFee[]; total: number } }> {
  return request({
    url: `${BASE_API}/low/volume/product/storageFees`,
    method: 'post',
    data,
  })
}

/**
 * 首页-考勤概览-用户列表
 * @returns 首页-考勤概览-用户列表
 */
export function getFrontPageAttendanceUserList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/front_page/attendance/user/select_option`,
    method: 'get',
  })
}

/**
 * 首页-考勤概览
 * @returns 首页-考勤概览
 */
export function getFrontPageAttendanceOverview(data: {
  startMonth: string
  endMonth: string
  orderByField: string
  orderDirection: string
}): Promise<{ data: IGetFrontPageAttendanceOverview[] }> {
  return request({
    url: `${BASE_API}/front_page/attendance/user/list`,
    method: 'post',
    data,
  })
}
/**
 *
 * 首页-利润分预览
 * @param params
 * @returns
 */
export function getFrontPageProfitScore(params: {
  month: string
  pageNo: number
  pageSize: number
  userId: number
}): Promise<{ data: IGetFrontPageProfitScoreRes }> {
  return request({
    url: `${BASE_API}/front_page/profit/score`,
    method: 'get',
    params,
  })
}
/**
 * 首页-个人奖金
 * @param params { month: string }
 * @returns IGetFrontPagePersonalBonusRes
 */
export function getFrontPagePersonalBonus(params: { month: string }): Promise<IGetFrontPagePersonalBonusRes> {
  return request({
    url: `${BASE_API}/front_page/user/bonus`,
    method: 'get',
    params,
  })
}
/**
 * 首页-Vine回评追踪卡片
 * @param params { userId: number }
 * @returns IKeyProductsItem[]
 */
export function getFrontPageVineReviewCard(params: { userId: number }): Promise<{ data: IKeyProductsItem[] }> {
  return request({
    url: `${BASE_API}/front_page/vine/review/list`,
    method: 'get',
    params,
  })
}
/**
 * 首页-剩余FBA库存数（单日期）
 * @param params { userId: number, site: number, startDate: string, endDate: string }
 * @returns IGetFrontPageFbaCountSaleDayChartRes[]
 */
export function getFrontPageFbaCountSaleDayChart(data: {
  userId: number
  site: number
  dates: string[]
  type: number
}): Promise<{ data: IGetFrontPageFbaCountSaleDayChartRes }> {
  return request({
    url: `${BASE_API}/front_page/fba/count/chart`,
    method: 'post',
    data,
  })
}

export function getShippingErrorChart(data: {
  dateType: string
  includeReceiving: boolean
  startMonth: string
  endMonth: string
}): Promise<{ data: { month: string; errorCount: number }[] }> {
  return request({
    url: `${BASE_API}/front_page/shipping/error/chart`,
    method: 'post',
    data,
  })
}

/**
 * 首页-上新天数销售额/利润图表
 * @param data { userId: number, site: number, month: string, dataType: 'sales' | 'profit', dayRange: string }
 * @returns IGetFrontPageNewProductSaleDayChartRes
 */
export function getFrontPageNewProductSaleDayChart(data: {
  userId: number
  site: number
  month: string
  dataType: string
  dayRange?: string
}): Promise<{ data: IGetFrontPageNewProductSaleDayChartRes[] }> {
  return request({
    url: `${BASE_API}/front_page/new_product/sale_day/chart`,
    method: 'post',
    data,
  })
}
