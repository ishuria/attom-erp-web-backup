import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
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
  IId,
  IIds,
  IInsertAllMatchComponent,
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
  IUpdateShipmentPay
} from '/@/type/customsDeclarationAndTaxRefund/matchPo'

/**
 * @description 匹配PO、报关资料列表获取
 */
export const getMatchPoList = (params: IGetMatchPoListReq): Promise<IGetMatchPoListRes> => {
  return request({
    url: `${BASE_API}/shipment/list`,
    method: 'get',
    params
  })
}
/**
 * @description 匹配PO、报关资料详情列查看
 */
export const getCheckMatchList = (params: IGetMatchPoListReq): Promise<IGetCheckMatchListRes> => {
  return request({
    url: `${BASE_API}/shipment/detail/list`,
    method: 'get',
    params
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配接口
 */
export const getMatchPackageList = (params: IGetMatchPackageListReq): Promise<IGetMatchPackageListRes> => {
  return request({
    url: `${BASE_API}/shipment/match/packageList`,
    method: 'get',
    params
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改SKU实际数量
 */
export const updateMatchSkuActualCount = (data: IUpdateMatchSkuCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/mUpdate`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改零件的实际数量
 */
export const updateMatchComponentActualCount = (data: IUpdateMatchComponentActualCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/actual/update`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配修改零件的退税报关数量
 */
export const updateMatchComponentCustomCount = (data: IUpdateMatchComponentActualCount): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/customDeclaration/update`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配插入全部
 */
export const insertAllMatchComponent = (data: IInsertAllMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/insertAll`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配清空
 */
export const clearMatchComponent = (params: IClearMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/clear`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料详情列表匹配清空全部
 */
export const clearAllMatchComponent = (params: IClearAllMatchComponent): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/component/clear/all`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表获取
 */
export const getMatchSentList = (params: IGetMatchPoListReq): Promise<IGetMatchSentListRes> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/list`,
    method: 'get',
    params
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表-归档
 */
export const archiveMatchSentList = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/archive`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料已报未发列表-确定
 */
export const submitMatchSentList = (data: ISubmitMatchSentList): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/ybwf/submit`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料-匹配-清空
 */
export const clearMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clear`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-匹配-清空所有
 */
export const clearAllMatchShipment = (params: IIds): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clear/all`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-匹配-删除
 */
export const delMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/del`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-匹配-开始装箱前置接口
 */
export const lockMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/lock`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料匹配-清空所有并解锁
 */
export const clearUnlockMatchShipment = (params: IClearUnlockMatchShipment): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/clearUnlock`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-匹配-确定提交
 */
export const submitMatchShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/submit`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-匹配-确定提交
 */
export const updateMatchQuality = (data: IUpdateMatchQuality): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/match/quality/update`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料-打包归档
 */
export const archivePackageShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/package/archive`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-撤销打包归档
 */
export const cancelArchivePackageShipment = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/package/cancel/archive`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料修改合同编号、reference id 货代单号
 */
export const updateShipment = (data: IUpdateShipment): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关资料退税运费修改
 */
export const updateShipmentFreightFee = (params: IUpdateShipmentFreightFee): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update/freightFee`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料付款状态修改
 */
export const updateShipmentPay = (params: IUpdateShipmentPay): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/update/pay`,
    method: 'post',
    params
  })
}
/**
 * @description 头程运费-获取数据列表
 */
export const getShipmentCostList = (params: IShipId) => {
  return request({
    url: `${BASE_API}/shipment/cost/list`,
    method: 'get',
    params
  })
}
/**
 * @description 匹配PO、报关资料-撤销装箱
 */
export const cancelShipmentEncasement = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/cancel/encasement`,
    method: 'post',
    params
  })
}
/**
 * @description 头程运费-添加费用
 */
export const addShipmentCost = (params: IShipId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/cost/add`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-生成报关资料
 */
export const generateCustomsDeclaration = (params: IIds) => {
  return request({
    url: `${BASE_API}/shipment/generate/customs/declaration`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO-清关资料生成
 */
export const generateTaxRefund = (params: IIds) => {
  return request({
    url: `${BASE_API}/shipment/generate/taxRefund`,
    method: 'post',
    params
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
    params
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费货币修改
 */
export const updateShipmentLegCurrency = (params: IUpdateShipmentLegCurrency): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/currency`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费删除
 */
export const delShipmentLeg = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/delete`,
    method: 'post',
    params
  })
}

/**
 * @description 匹配PO、报关清关资料-头程运费修改
 */
export const updateShipmentLeg = (data: IUpdateShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/update`,
    method: 'post',
    data
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费报关状态修改
 */
export const updateBgShipmentLeg = (params: IUpdateBgShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/bg`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关清关资料-头程运费清关状态修改
 */
export const updateQgShipmentLeg = (params: IUpdateBgShipmentLeg): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/leg/qg`,
    method: 'post',
    params
  })
}

/**
 * @description 匹配PO、报关资料-退税归档
 */
export const archiveTaxRefund = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/archive`,
    method: 'post',
    params
  })
}

/**
 * @description 匹配PO、报关资料-撤销退税归档
 */
export const cancelArchiveTaxRefund = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/taxRefund/cancel/archive`,
    method: 'post',
    params
  })
}

/**
 * @description 匹配PO、报关资料-出库归档
 */
export const archiveOutbound = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/outbound/archive`,
    method: 'post',
    params
  })
}
/**
 * @description 匹配PO、报关资料-撤销出库归档
 */
export const cancelArchiveOutbound = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/outbound/cancel`,
    method: 'post',
    params
  })
}