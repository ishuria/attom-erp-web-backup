import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddOperationSubcategoryRankingReq,
  IBatchUpdateCommissionTaskPictureReq,
  IBatchUpdateDevelopDesignTaskReq,
  IGetCommissionArtTypeListRes,
  IGetCommissionDetailDevelopListReq,
  IGetCommissionDetailDevelopListRes,
  IGetCommissionDetailLongListRes,
  IGetCommissionDetailPictureListReq,
  IGetCommissionDetailPictureListRes,
  IGetCommissionProductTypeListRes,
  IGetCommissionSettingRes,
  IGetCommissionTaskPictureListReq,
  IGetCommissionTaskPictureListRes,
  IGetCostReductionHistoryPriceList,
  IGetDevelopDesignTaskListRes,
  IGetLongCommissionTaskListReq,
  IGetLongCommissionTaskListRes,
  IGetOperationSubcategoryRankingListRes,
  IGetReductionCostDetailListReq,
  IGetReductionCostDetailListRes,
  IGetReductionCostListRes,
  IGetSkuProfitGroupDetailList,
  IGetSkuProfitScoreDetailListReq,
  IOperationCommissionCoefficientRes,
  IUpdateCommissionArtTypeReq,
  IUpdateCommissionProductTypeReq,
  IUpdateCommissionSetting1Req,
  IUpdateCommissionTaskPictureReq,
  IUpdateDevelopDesignTaskReq,
  IUpdateLongCommissionTaskReq,
  IUpdateOperationSubcategoryRankingReq,
  IUpdateReductionCostTaskReq,
} from '/@/type/commission/commissionType'

import { ITaxRefundBonusDetailResp, ITaxRefundBonusQuery } from '/@/type/commission/taxRefundBonusDetail.ts'

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
 * @description 提成系数设定-产品类型-修改评分
 */
export function updateCommissionProductTypeScore(params: {
  userId: number
  totalScore: number
  oemScore: number
}): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/product/type/update/score`,
    method: 'post',
    params,
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
    data,
  })
}
/**
 * @description 提成系数设定-参数设定2table修改
 */
export function updateCommissionSetting2(data: { id: number; targetRate: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/setting2/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成任务-美工图片任务列表查询
 */
export function getCommissionTaskPictureList(data: IGetCommissionTaskPictureListReq): Promise<IGetCommissionTaskPictureListRes> {
  return request({
    url: `${BASE_API}/commission/task/picture/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成任务-美工图片暂停
 */
export function pauseCommissionTaskPicture(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/pause`,
    method: 'post',
    params,
  })
}
/**
 * @description 提成任务-美工图片继续
 */
export function continueCommissionTaskPicture(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/continue`,
    method: 'post',
    params,
  })
}
/**
 * @description 提成任务-美工图片修改
 */
export function updateCommissionTaskPicture(data: IUpdateCommissionTaskPictureReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 提成任务-美工图片批量修改
 */
export function batchUpdateCommissionTaskPicture(data: IBatchUpdateCommissionTaskPictureReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/batch/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 提成任务-美工图片批量取消
 */
export function batchCancleCommissionTaskPicture(data: { ids: number[] }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/task/picture/batch/cancel`,
    method: 'post',
    data,
  })
}

/**
 * @description 提成任务-美工长期列表查询
 */
export function getLongCommissionTaskList(data: IGetLongCommissionTaskListReq): Promise<IGetLongCommissionTaskListRes> {
  return request({
    url: `${BASE_API}/long/commission/task/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成任务-美工长期修改
 */
export function updateLongCommissionTask(data: IUpdateLongCommissionTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成任务-美工长期继续
 */
export function continueLongCommissionTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/continue`,
    method: 'post',
    params,
  })
}
/**
 * @description 提成任务-美工长期暂停
 */
export function pauseLongCommissionTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/long/commission/task/pause`,
    method: 'post',
    params,
  })
}
/**
 * @description 产品开发设计提成任务-列表查询
 */
export function getDevelopDesignTaskList(data: IGetLongCommissionTaskListReq): Promise<IGetDevelopDesignTaskListRes> {
  return request({
    url: `${BASE_API}/develop/design/task/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品开发设计提成任务-继续
 */
export function continueDevelopDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/continue`,
    method: 'post',
    params,
  })
}
/**
 * @description 产品开发设计提成任务-暂停
 */
export function pauseDevelopDesignTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/pause`,
    method: 'post',
    params,
  })
}
/**
 * @description 产品开发设计提成任务-修改
 */
export function updateDevelopDesignTask(data: IUpdateDevelopDesignTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品开发设计提成任务-批量修改
 */
export function batchUpdateDevelopDesignTask(data: IBatchUpdateDevelopDesignTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/develop/design/task/batch/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 采购降本提成任务-列表获取
 */
export function getReductionCostList(data: IGetLongCommissionTaskListReq): Promise<IGetReductionCostListRes> {
  return request({
    url: `${BASE_API}/cost/reduction/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 采购降本提成任务-审核通过
 */
export function passReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/pass`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购降本提成任务-审核不通过
 */
export function notPassReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/not/pass`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购降本提成任务-暂停
 */
export function pauseReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/pause`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购降本提成任务-继续
 */
export function continueReductionCostTask(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/continue`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购降本提成任务-修改
 */
export function updateReductionCostTask(data: IUpdateReductionCostTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/cost/reduction/task/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成明细-美工图片任务列表查询
 */
export function getCommissionDetailPictureList(data: IGetCommissionDetailPictureListReq): Promise<IGetCommissionDetailPictureListRes> {
  return request({
    url: `${BASE_API}/commission/task/detail/picture/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成明细-美工长期任务列表查询
 */
export function getCommissionDetailLongList(data: IGetCommissionDetailPictureListReq): Promise<IGetCommissionDetailLongListRes> {
  return request({
    url: `${BASE_API}/long/commission/task/detail/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 产品开发设计提成任务明细-获取列表
 */
export function getCommissionDetailDevelopList(data: IGetCommissionDetailDevelopListReq): Promise<IGetCommissionDetailDevelopListRes> {
  return request({
    url: `${BASE_API}/develop/design/task/detail/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 采购降本提成任务明细-列表获取
 */
export function getReductionCostDetailList(params: IGetReductionCostDetailListReq): Promise<IGetReductionCostDetailListRes> {
  return request({
    url: `${BASE_API}/cost/reduction/detail/list`,
    method: 'get',
    params,
  })
}

/**
 * 获取采购降本提成任务-月份列表
 */
export function getReductionCostDetailMonth(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/cost/reduction/detail/month`,
    method: 'get',
  })
}

/**
 * 查询提成任务明细-产品开发设计-人员列表
 */
export function getDevelopDesignDetailUserList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/develop/design/task/detail/user/list`,
    method: 'get',
  })
}

/**
 * 提成-产品明细-人员列表
 * @returns
 */
export function getDevelopDesignDetailPersonList() {
  return request({
    url: `${BASE_API}/commission/product/detail/user/list`,
    method: 'get',
  })
}

/**
 * 查询提成任务明细-产品开发设计-角色列表
 */
export function getDevelopDesignDetailRoleList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/develop/design/task/detail/role/list`,
    method: 'get',
  })
}

/**
 * 获取提成明细的发放月份
 */
export function getCommissionTypeMonth(params: { type: number }): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/commission/type/month`,
    method: 'get',
    params,
  })
}

/**
 * 获取采购降本提成任务-用户列表
 */
export function getCostReductionUserList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/cost/reduction/user/list`,
    method: 'get',
  })
}
/**
 * 获取采购降本提成任务-历史价格列表
 * @param params
 * @returns
 */
export function getCostReductionHistoryPriceList(params: { id: number }): Promise<{ data: IGetCostReductionHistoryPriceList[] }> {
  return request({
    url: `${BASE_API}/cost/reduction/history/price`,
    method: 'get',
    params,
  })
}
/**
 * 获取产品SKU详情-历史价格列表
 * @param params
 * @returns
 */
export function getProductSkuDetailHistoryPriceList(params: {
  componentId: number
  supplierId: number
}): Promise<{ data: IGetCostReductionHistoryPriceList[] }> {
  return request({
    url: `${BASE_API}/sku/detail/history/price`,
    method: 'get',
    params,
  })
}
/**
 * 获取人员等级下拉列表
 * @returns 人员等级下拉列表
 */
export function getUserPersonLevelDropdownList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/user/person/level/dropdown`,
    method: 'get',
  })
}

/**
 * 获取退税奖金明细-用户列表
 */
export function getTaxRefundBonusDetailUserList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/taxRefund/bonus/detail/user/list`,
    method: 'get',
  })
}

/**
 * 获取退税奖金明细-月份列表
 */
export function getTaxRefundBonusDetailMonth(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/taxRefund/bonus/detail/month`,
    method: 'get',
  })
}

/**
 * 获取退税奖金明细数据
 */
export function queryTaxRefundBonusDetailMonthList(data: ITaxRefundBonusQuery): Promise<ITaxRefundBonusDetailResp> {
  return request({
    url: `${BASE_API}/taxRefund/detail/list`,
    method: 'post',
    data,
  })
}

// ============ 运营奖金相关 ============

/**
 * @description 运营奖金-ASIN明细列表
 */
export function getOperationBonusAsinDetailList(data: {
  userId: number
  month: string
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
  operationTypeId?: number
}): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/asin/detail`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营奖金-ASIN汇总列表
 */
export function getOperationBonusAsinSummaryList(data: {
  userId: number
  month: string
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
  platformCode: string
}): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/asin/summary`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营奖金-奖金明细列表
 */
export function getOperationBonusDetailList(data: {
  userId: number
  month: string
  site: number
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}): Promise<{ data: { list: any[]; total: number; totalPrice: number } }> {
  return request({
    url: `${BASE_API}/operation/commission/detail`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营奖金-Walmart明细列表
 */
export function getOperationBonusWalmartDetailList(data: {
  userId: number
  month: string
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/walmart/detail`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营奖金-Walmart奖金明细列表
 */
export function getOperationBonusWalmartCommissionDetailList(data: {
  userId: number
  month: string
  site: number
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}): Promise<{ data: { list: any[]; total: number; totalPrice: number } }> {
  return request({
    url: `${BASE_API}/operation/walmart/commission/detail`,
    method: 'post',
    data,
  })
}

/**
 * @description 运营奖金-Walmart站点列表
 */
export function getWalmartOperationSiteList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/platform/walmart/site/list`,
    method: 'get',
  })
}
/**
 * @description 运营奖金-Amazon站点列表
 */
export function getAmazonOperationSiteList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/platform/amazon/site/list`,
    method: 'get',
  })
}
/**
 * @description 运营奖金-老品利润历史列表
 */
export function getOldProductProfitHistoryList(params: {
  keyWord: string
  pageNo: number
  pageSize: number
  startMonth: string
  endMonth: string
  userId: number
}): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/distribution/old/profit/history/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 获取老品提成比例
 */
export function getOldProductProportion(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/operation/old/commission/proportion`,
    method: 'get',
  })
}

/**
 * @description 更新老品提成比例
 */
export function updateOldProductProportion(params: { proportion: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/old/commission/proportion/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 获取运营绩效-运营考核参数
 */
export function getOperationCommissionCoefficient(): Promise<IOperationCommissionCoefficientRes> {
  return request({
    url: `${BASE_API}/operation/commission/coefficient`,
    method: 'get',
  })
}

/**
 * @description 更新运营绩效-运营考核参数
 */
export function updateOperationCommissionCoefficient(data: {
  id: number
  valThreshold: number
  stepValue: number
  dayThreshold?: number
  commissionReduction: number
}): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/commission/coefficient/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取运营小类排名配置
 */
export function getOperationSubcategoryRankingList(): Promise<IGetOperationSubcategoryRankingListRes> {
  return request({
    url: `${BASE_API}/operation/commission/subcategoryRanking/list`,
    method: 'get',
  })
}

/**
 * @description 更新运营小类排名配置
 */
export function updateOperationSubcategoryRanking(data: IUpdateOperationSubcategoryRankingReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/commission/subcategoryRanking/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 新增运营小类排名配置
 */
export function addOperationSubcategoryRanking(data: IAddOperationSubcategoryRankingReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/operation/commission/subcategoryRanking/add`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取ASIN汇总-月份列表
 */
export function getAsinSummaryMonthList(type: string): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/operation/asin/summary/month/${type}`,
    method: 'get',
  })
}

/**
 * @description 获取ASIN明细-月份列表
 */
export function getAsinDetailMonthList(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/operation/asin/month`,
    method: 'get',
  })
}

/**
 * @description 获取Walmart明细-月份列表
 */
export function getWalmartDetailMonthList(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/operation/walmart/detail/month`,
    method: 'get',
  })
}

/**
 * @description 获取运营奖金明细-月份列表
 */
export function getOperationCommissionDateList(): Promise<{ data: string[] }> {
  return request({
    url: `${BASE_API}/operation/commission/date`,
    method: 'get',
  })
}

/**
 * @description 获取ASIN汇总-考核指标详情
 */
export function getAsinSummaryIndicator(params: { id: number }): Promise<{ data: any[] }> {
  return request({
    url: `${BASE_API}/operation/asin/summary/indicator`,
    method: 'get',
    params,
  })
}

/**
 * @description 运营ASIN汇总-修改币种
 */
export function updateCurrencyOperationAsinSummary(params: { currency: number }): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/asin/summary/currency/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 运营ASIN汇总-获取币种
 */
export function getCurrencyOperationAsinSummary(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/operation/asin/summary/currency`,
    method: 'get',
  })
}

/**
 * @description 运营ASIN明细-修改币种
 */
export function updateCurrencyOperationAsinDetail(params: { currency: number }): Promise<{ data: { list: any[]; total: number } }> {
  return request({
    url: `${BASE_API}/operation/asin/detail/currency/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 运营ASIN明细-获取币种
 */
export function getCurrencyOperationAsinDetail(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/operation/asin/detail/currency`,
    method: 'get',
  })
}

/**
 * @description Walmart汇总-修改币种
 */
export function updateCurrencyOperationWalmartSummary(params: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/walmart/operation/summary/currency/update`,
    method: 'post',
    params,
  })
}

/**
 * @description Walmart汇总-获取币种
 */
export function getCurrencyOperationWalmartSummary(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/walmart/operation/summary/currency`,
    method: 'get',
  })
}

/**
 * @description Walmart明细-修改币种
 */
export function updateCurrencyOperationWalmartDetail(params: { currency: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/walmart/operation/detail/currency/update`,
    method: 'post',
    params,
  })
}

/**
 * @description Walmart明细-获取币种
 */
export function getCurrencyOperationWalmartDetail(): Promise<{ data: number }> {
  return request({
    url: `${BASE_API}/walmart/operation/detail/currency`,
    method: 'get',
  })
}

/**
 * @description SKU利润分明细列表
 */
export function getSkuProfitScoreDetailList(params: IGetSkuProfitScoreDetailListReq): Promise<{
  data: { list: any[]; total: number }
}> {
  return request({
    url: `${BASE_API}/sku/profit/score/detail/list`,
    method: 'get',
    params,
  })
}

/**
 * @description SKU利润分组明细列表（含图片）
 */
export function getSkuProfitGroupDetailList(params: { groupId: number }): Promise<{ data: IGetSkuProfitGroupDetailList[] }> {
  return request({
    url: `${BASE_API}/sku/profit/group/detail/list`,
    method: 'get',
    params,
  })
}
