import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IAddHSListReq,
  IAddHTSListReq,
  IGetHSListReq,
  IGetHSListRes,
  IGetHTSListReq,
  IGetHTSListRes,
  IGetHtsSkuListReq,
  IGetHtsSkuListRes,
  IGetPurchaseComponentHsInfo,
  IUpdateHSListReq,
  IUpdateHTSListReq,
  IUpdatePurchaseComponentHs,
} from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import type {
  IBooleanRes,
  IClearAllMatchComponent,
  IClearMatchComponent,
  IClearUnlockMatchShipment,
  IGetCheckMatchListRes,
  IGetMatchPackageListReq,
  IGetMatchPackageListRes,
  IGetMatchPoListReq,
  IGetMatchPoListRes,
  IGetMatchSentListRes,
  IGetYfwbAggregationListRes,
  IId,
  IIds,
  IInsertAllMatchComponent,
  IInvoiceDetailResp,
  IShipId,
  IStringRes,
  ISubmitMatchSentList,
  IUpdateBgShipmentLeg,
  IUpdateMatchComponentActualCount,
  IUpdateMatchQuality,
  IUpdateMatchSkuCount,
  IUpdateShipment,
  IUpdateShipmentFreightFee,
  IUpdateShipmentLeg,
  IUpdateShipmentLegCurrency,
  IUpdateShipmentLegPay,
  IUpdateShipmentPay,
} from '/@/type/customsDeclarationAndTaxRefund/matchPo'
import type {
  ICleanTaxRefundInvoice,
  IContractValidateTaxRefundBatch,
  IFinishTaxRefundInvoiceRes,
  IGetTaxRefundBatchDetailQuery,
  IGetTaxRefundBatchDetailRes,
  IGetTaxRefundBatchListQuery,
  IGetTaxRefundBatchListRes,
  IGetTaxRefundInvoiceListQuery,
  IGetTaxRefundInvoiceListRes,
  IGetTaxRefundInvoiceMatchQuery,
  IGetTaxRefundInvoiceMatchRes,
  IGetTaxRefundListQuery,
  IGetTaxRefundProfitMarginQuery,
  IGetTaxRefundProfitMarginRes,
  ISubmitTaxRefundInvoiceMatch,
  ITaxRefundInvoiceDelete,
  ITaxRefundInvoiceRes,
  IUpdateTaxRefundBatchDate,
  IUpdateTaxRefundBatchFreightFee,
  IUpdateTaxRefundBatchRemark,
  IUpdateTaxRefundInvoice,
  IUpdateTaxRefundInvoiceDetail,
} from '/@/type/customsDeclarationAndTaxRefund/refundTax'

/**
 * @description 匹配PO、报关资料列表获取
 */
export const getMatchPoList = (data: IGetMatchPoListReq): Promise<IGetMatchPoListRes> => {
  return request({
    url: `${BASE_API}/shipment/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列查看
 */
export const getCheckMatchList = (data: IGetMatchPoListReq): Promise<IGetCheckMatchListRes> => {
  return request({
    url: `${BASE_API}/shipment/detail/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配接口
 */
export const getMatchPackageList = (data: IGetMatchPackageListReq): Promise<IGetMatchPackageListRes> => {
  return request({
    url: `${BASE_API}/shipment/match/packageList`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改SKU实际数量
 */
export const updateMatchSkuActualCount = (data: IUpdateMatchSkuCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/mUpdate`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改零件的实际数量
 */
export const updateMatchComponentActualCount = (data: IUpdateMatchComponentActualCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/actual/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改零件的退税报关数量
 */
export const updateMatchComponentCustomCount = (data: IUpdateMatchComponentActualCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/customDeclaration/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配插入全部
 */
export const insertAllMatchComponent = (data: IInsertAllMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/insertAll`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配清空
 */
export const clearMatchComponent = (data: IClearMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/clear`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配清空全部
 */
export const clearAllMatchComponent = (data: IClearAllMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/clear/all`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表获取
 */
export const getMatchSentList = (params: IGetMatchPoListReq): Promise<IGetMatchSentListRes> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表-归档
 */
export const archiveMatchSentList = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/archive`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表-确定
 */
export const submitMatchSentList = (data: ISubmitMatchSentList): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/submit`,
    method: 'post',
    data,
  })
}
/**
 * 匹配、报关资料已报未发-修改备注
 * @param data id: number, remark: string
 * @returns boolean
 */
export const updateShipmentYfwbRemark = (data: { id: number; remark: string }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/shipment/yfwb/update`,
    method: 'post',
    data,
  })
}
/**
 * 匹配PO、报关资料已发未报-聚合列表修改备注
 * @param data id: number, remark: string
 * @returns boolean
 */
export const updateShipmentYfwbAggregationRemark = (data: { id: number; remark: string }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/shipment/yfwb/aggregation/remark/update`,
    method: 'post',
    data,
  })
}
/**
 * 匹配PO、报关资料已发未报-聚合列表归档
 * @param data id: number, remark: string
 * @returns boolean
 */
export const updateShipmentYfwbAggregationArchiving = (params: { id: number }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/shipment/yfwb/aggregation/archiving/update`,
    method: 'post',
    params,
  })
}

/**
 * 匹配PO、报关资料已发未报-聚合列表查询
 * @param data IGetMatchPoListReq
 * @returns IGetYfwbAggregationListRes
 */
export const getShipmentYfwbAggregationList = (data: IGetMatchPoListReq): Promise<IGetYfwbAggregationListRes> => {
  return request({
    url: `${BASE_API}/shipment/yfwb/aggregation/list`,
    method: 'post',
    data,
  })
}
/**
 * 匹配PO、报关资料已发未报-聚合归档
 * @param data IGetMatchPoListReq
 * @returns IGetYfwbAggregationListRes
 */
export const archiveShipmentYfwbAggregation = (
  data: { poId: number; poComponentId: number; sku: string }[]
): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/shipment/yfwb/aggregation/batch/archiving`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-清空
 */
export const clearMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clear`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-清空所有
 */
export const clearAllMatchShipment = (params: IIds): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clear/all`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-删除
 */
export const delMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/del`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-开始装箱前置接口
 */
export const lockMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/lock`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料匹配-清空所有并解锁
 */
export const clearUnlockMatchShipment = (params: IClearUnlockMatchShipment): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clearUnlock`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-确定提交
 */
export const submitMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/submit`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-确定提交check
 */
export const submitMatchShipmentCheck = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/submit/check`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-匹配-确定提交
 */
export const updateMatchQuality = (data: IUpdateMatchQuality): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/quality/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料-打包归档
 */
export const archivePackageShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/package/archive`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-撤销打包归档
 */
export const cancelArchivePackageShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/package/cancel/archive`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料修改合同编号、reference id 货代单号
 */
export const updateShipment = (data: IUpdateShipment): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关资料退税运费修改
 */
export const updateShipmentFreightFee = (params: IUpdateShipmentFreightFee): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update/freightFee`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料付款状态修改
 */
export const updateShipmentPay = (params: IUpdateShipmentPay): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update/pay`,
    method: 'post',
    params,
  })
}
/**
 * 匹配PO、报关资料-修改货代渠道可见
 * @param params
 * @returns
 */
export const updateShipmentChannel = (params: { id: number; channelId: number }): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update/channel`,
    method: 'post',
    params,
  })
}

/**
 * @description 头程运费-获取数据列表
 */
export const getShipmentCostList = (params: IShipId) => {
  return request({
    url: `${BASE_API}/shipment/cost/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-撤销装箱
 */
export const cancelShipmentEncasement = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/cancel/encasement`,
    method: 'post',
    params,
  })
}
/**
 * @description 头程运费-添加费用
 */
export const addShipmentCost = (params: {
  shipId: number
  costName: string
  shipmentId: string
  channelId: number
}): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/cost/add`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-生成报关资料
 */
export const generateCustomsDeclaration = (params: IIds) => {
  return request({
    url: `${BASE_API}/shipment/generate/customs/declaration`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO-清关资料生成
 */
export const generateTaxRefund = (params: IIds) => {
  return request({
    url: `${BASE_API}/shipment/generate/taxRefund`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费币种
 */
export const getShipmentLegCurrencyList = () => {
  return request({
    url: `${BASE_API}/shipment/leg/currencyList`,
    method: 'get',
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费付款状态修改
 */
export const updateShipmentLegPay = (params: IUpdateShipmentLegPay): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/pay`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费货币修改
 */
export const updateShipmentLegCurrency = (params: IUpdateShipmentLegCurrency): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/currency`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费删除
 */
export const delShipmentLeg = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/delete`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关清关资料-头程运费修改
 */
export const updateShipmentLeg = (data: IUpdateShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费报关状态修改
 */
export const updateBgShipmentLeg = (params: IUpdateBgShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/bg`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关清关资料-头程运费计入退税运费修改
 */
export const updateInTaxRefundStatusShipmentLeg = (params: IUpdateBgShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/inTaxRefundStatus`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关清关资料-头程运费清关状态修改
 */
export const updateQgShipmentLeg = (params: IUpdateBgShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/qg`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关资料-退税归档
 */
export const archiveTaxRefund = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/archive`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关资料-撤销退税归档
 */
export const cancelArchiveTaxRefund = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/cancel/archive`,
    method: 'post',
    params,
  })
}

/**
 * @description 匹配PO、报关资料-出库归档
 */
export const archiveOutbound = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/outbound/archive`,
    method: 'post',
    params,
  })
}
/**
 * @description 匹配PO、报关资料-撤销出库归档
 */
export const cancelArchiveOutbound = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/outbound/cancel`,
    method: 'post',
    params,
  })
}

/**
 * @description 退税批次-查询
 */
export const getTaxRefundBatchList = (params: IGetTaxRefundBatchListQuery): Promise<IGetTaxRefundBatchListRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 退税批次-更新报关单出库日期
 */
export const updateTaxRefundBatchDate = (params: IUpdateTaxRefundBatchDate): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/update/date`,
    method: 'post',
    params,
  })
}
/**
 * @description 退税批次-更新退税批次备注
 */
export const updateTaxRefundBatchRemark = (params: IUpdateTaxRefundBatchRemark): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/remark`,
    method: 'post',
    params,
  })
}
/**
 * @description 退税批次-退税完成
 */
export const updateTaxRefundBatchStatus = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/status`,
    method: 'post',
    params,
  })
}

/**
 * 退税批次-撤销到待退税
 * @param params
 * @returns
 */
export const updateCancleTaxRefundBatchStatus = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/cancel`,
    method: 'post',
    params,
  })
}

/**
 * @description 退税批次-退税运费
 */
export const updateTaxRefundBatchFreightFee = (params: IUpdateTaxRefundBatchFreightFee): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/freightFee`,
    method: 'post',
    params,
  })
}

/**
 * @description 退税批次-采购合同校验
 */
export const validateTaxRefundBatchContract = (data: IContractValidateTaxRefundBatch): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/contract/validate`,
    method: 'post',
    data,
  })
}

/**
 * @description 退税批次-明细
 */
export const getTaxRefundBatchDetail = (params: IGetTaxRefundBatchDetailQuery): Promise<IGetTaxRefundBatchDetailRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/detail`,
    method: 'get',
    params,
  })
}
/**
 * 退税批次中的出库归档
 * @param data
 * @returns
 */
export const archiveTaxRefundBatchOutbound = (data: { contractNumber: string }): Promise<{ data: string }> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/outbound/archive`,
    method: 'post',
    data,
  })
}

/**
 * 退税批次-发票归集
 * @param data
 * @returns
 */
export const archiveTaxRefundBatchInvoice = (data: { path: string; id: number }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/invoice/archive`,
    method: 'post',
    data,
  })
}

/**
 * @description 退税管理 - 查询列表
 */
export const getTaxRefundList = (data: IGetTaxRefundListQuery): Promise<IGetTaxRefundBatchDetailRes> => {
  return request({
    url: `${BASE_API}/taxRefund/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理-发票文件上传
 */
export const uploadTaxRefund = (data: FormData) => {
  return request({
    url: `${BASE_API}/taxRefund/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
/**
 * @description 退税管理-发票导入完成
 */
export const finishTaxRefundInvoice = (data: string[]): Promise<ITaxRefundInvoiceRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/finish`,
    method: 'post',
    data,
  })
}

/**
 * @description 退税管理-重复发票导入完成
 */
export const finishTaxRefundInvoiceRepeat = (data: string[]): Promise<IFinishTaxRefundInvoiceRes> => {
  return request({
    url: `${BASE_API}/taxRefund/repeat/invoice/finish`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理 - 发票列表查询
 */
export const getTaxRefundInvoiceList = (data: IGetTaxRefundInvoiceListQuery): Promise<IGetTaxRefundInvoiceListRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理 - 发票匹配列表清空
 */
export const cleanTaxRefundInvoice = (params: ICleanTaxRefundInvoice): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/clean`,
    method: 'post',
    params,
  })
}
/**
 * @description 退税管理-删除发票
 */
export const deleteTaxRefundInvoice = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/delete`,
    method: 'post',
    params,
  })
}
/**
 * @description 退税管理-匹配
 */
export const getTaxRefundInvoiceMatch = (data: IGetTaxRefundInvoiceMatchQuery): Promise<IGetTaxRefundInvoiceMatchRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/match`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理-发票修改
 */
export const updateTaxRefundInvoice = (data: IUpdateTaxRefundInvoice): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理-发票明细修改
 */
export const updateTaxRefundInvoiceDetail = (data: IUpdateTaxRefundInvoiceDetail): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/detail/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理-发票匹配第一次提交
 */
export const submitTaxRefundInvoiceMatch = (data: ISubmitTaxRefundInvoiceMatch): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/match/submit`,
    method: 'post',
    data,
  })
}

/**
 * @description 退税管理-发票剩余匹配信息获取
 */
export const getInvoiceDetail = (params: { detailId: number }): Promise<IInvoiceDetailResp> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/detail`,
    method: 'get',
    params,
  })
}

/**
 * @description 退税管理-发票匹配第二次提交
 */
export const submitConfirmTaxRefundInvoiceMatch = (): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/invoice/match/submitConfirm`,
    method: 'post',
  })
}
/**
 * @description 退税管理-删除匹配
 */
export const deleteTaxRefundMatch = (data: ITaxRefundInvoiceDelete): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/delete/match`,
    method: 'post',
    data,
  })
}
/**
 * @description 退税管理-查询批次利润率
 */
export const getTaxRefundProfitMargin = (data: IGetTaxRefundProfitMarginQuery): Promise<IGetTaxRefundProfitMarginRes> => {
  return request({
    url: `${BASE_API}/taxRefund/profit/margin`,
    method: 'post',
    data,
  })
}

/**
 * @description Hs列表
 */
export const getHSList = (params: IGetHSListReq): Promise<IGetHSListRes> => {
  return request({
    url: `${BASE_API}/hs/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 修改Hs
 */
export const updateHSList = (data: IUpdateHSListReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hs/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 删除Hs
 */
export const delHSList = (params: { id: number }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hs/del`,
    method: 'post',
    params,
  })
}
/**
 * @description 添加Hs
 */
export const addHSList = (data: IAddHSListReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hs/add`,
    method: 'post',
    data,
  })
}
/**
 * @description HTS列表
 */
export const getHTSList = (data: IGetHTSListReq): Promise<IGetHTSListRes> => {
  return request({
    url: `${BASE_API}/hts/list`,
    method: 'post',
    data,
  })
}
/**
 * @description 删除hts
 */
export const delHTSList = (params: { id: number }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hts/del`,
    method: 'post',
    params,
  })
}
/**
 * @description 添加Hs
 */
export const addHTSList = (data: IAddHTSListReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hts/add`,
    method: 'post',
    data,
  })
}
/**
 * @description 修改HTS
 */
export const updateHTSList = (data: IUpdateHTSListReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/hts/update`,
    method: 'post',
    data,
  })
}
/**
 * Hts查看Sku列表
 * @returns
 */
export const getHtsSkuList = (data: IGetHtsSkuListReq): Promise<IGetHtsSkuListRes> => {
  return request({
    url: `${BASE_API}/hts/sku/list`,
    method: 'post',
    data,
  })
}
/**
 * 获取费用名
 * @param params
 * @returns
 */
export const getCostNameListByChannelId = (params: { channelId: number }): Promise<{ data: { id: number; label: string }[] }> => {
  return request({
    url: `${BASE_API}/freight/forwarder/costName/list`,
    method: 'get',
    params,
  })
}

/**
 * 退税管理 发票匹配导出 前置接口
 * @param data
 * @returns
 */
export const checkTaxRefundInvoiceExport = (data: { fromDate: string; toDate: string }): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/match/invoice/export/check`,
    method: 'post',
    data,
  })
}

/**
 * 退税管理 云舟催票文件 前置接口
 * @param data
 * @returns
 */
export const taxRefundInvoiceBeforeCheck = (data: any): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/hasten/invoice/check`,
    method: 'post',
    data,
  })
}

/**
 * 退税批次 出口发票生成 前置接口
 * @param data
 * @returns
 */
export const checkTaxRefundBatchAiTuoMuExport = (params: { ids: string }): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/batch/aiTuoMuExport/check`,
    method: 'post',
    params,
  })
}

/**
 * po零件hs信息查询
 * @param params
 * @returns
 */
export const getPurchaseComponentHsInfo = (params: { id: number }): Promise<{ data: IGetPurchaseComponentHsInfo }> => {
  return request({
    url: `${BASE_API}/purchase/component/hs/info`,
    method: 'get',
    params,
  })
}
/**
 * po零件hs信息修改
 */
export const updatePurchaseComponentHs = (data: IUpdatePurchaseComponentHs): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/purchase/component/hs/update`,
    method: 'post',
    data,
  })
}

/**
 * 匹配报关-上传入仓单PDF
 * @param data
 * @returns
 */
export function uploadWarehouseReceiptPDF(data: FormData): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/upload/warehouse/receipt/pdf`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 上传关税单
 */
export function uploadTariffBillPDF(data: FormData) {
  return request({
    url: `${BASE_API}/upload/tariff/bill/pdf`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 合同导入
 * @param data
 * @returns
 */
export function importContractNumber(data: { sourcePath: string; targetPath: string; shipmentId: string }) {
  return request({
    url: `${BASE_API}/shipment/contract/import`,
    method: 'post',
    data,
  })
}

/**
 * 退税报关资料上传
 * @returns
 */
export function uploadTaxRefundCheckFile(data: FormData) {
  return request({
    url: `${BASE_API}/taxRefund/check`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 退税管理 云舟催票文件 前置接口
 * @param data
 * @returns
 */
export const taxRefundCifPriceUpdate = (data: any): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/update`,
    method: 'post',
    data,
  })
}

/**
 * 退税报关资料上传
 * @returns
 */
export function uploadPreOrderFormCheckFile(data: FormData) {
  return request({
    url: `${BASE_API}/preOrderForm/check`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
