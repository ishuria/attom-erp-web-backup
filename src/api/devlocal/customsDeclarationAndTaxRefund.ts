import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IBooleanRes,
  IClearAllMatchComponent,
  IClearMatchComponent,
  IGetCheckMatchListRes,
  IGetMatchPackageListReq,
  IGetMatchPackageListRes,
  IGetMatchPoListReq,
  IGetMatchPoListRes,
  IInsertAllMatchComponent,
  IUpdateMatchComponentActualCount,
  IUpdateMatchSkuCount
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