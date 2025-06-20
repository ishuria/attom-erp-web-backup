import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IGetPurchaseStatisticsProductListRes, IGetPurchaseStatisticsSupplierListReq, IGetPurchaseStatisticsSupplierListRes } from '/@/type/purchase/statistics'

/**
 * 采购统计-供应商
 * @param data 
 * @returns 
 */
export function getPurchaseStatisticsSupplierList(data: IGetPurchaseStatisticsSupplierListReq): Promise<IGetPurchaseStatisticsSupplierListRes> {
  return request({
    url: `${BASE_API}/purchase/statistics/supplier/info`,
    method: 'post',
    data
  })
}

/**
 * 采购统计-产品
 * @param data 
 * @returns 
 */
export function getPurchaseStatisticsProductList(data: IGetPurchaseStatisticsSupplierListReq): Promise<IGetPurchaseStatisticsProductListRes> {
  return request({
    url: `${BASE_API}/purchase/statistics/product/info`,
    method: 'post',
    data
  })
}