import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddEmailAfterSalesReq,
  IGetEmailAfterSalesListReq,
  IGetEmailAfterSalesListRes,
  IUpdateEmailAfterSalesReq
} from '/@/type/storeOperation/emailAfterSales'

/**
 * 查询邮件售后列表
 * @param params IGetEmailAfterSalesListReq
 * @returns IGetEmailAfterSalesListRes
 */
export const getEmailAfterSalesList = (params: IGetEmailAfterSalesListReq): Promise<IGetEmailAfterSalesListRes> => {
  return request({
    url: `${BASE_API}/email/after-sales/list`,
    method: 'get',
    params,
  })
}

/**
 * 删除邮件售后信息
 * @param params id
 * @returns boolean
 */
export const deleteEmailAfterSales = (params: { id: number }): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/email/after-sales/delete`,
    method: 'post',
    params,
  })
}

/**
 * 新增邮件售后信息
 * @param params IAddEmailAfterSalesReq
 * @returns boolean
 */
export const addEmailAfterSales = (data: IAddEmailAfterSalesReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/email/after-sales/add`,
    method: 'post',
    data,
  })
}

/**
 * 更新邮件售后信息
 * @param params IAddEmailAfterSalesReq
 * @returns boolean
 */
export const updateEmailAfterSales = (data: IUpdateEmailAfterSalesReq): Promise<{ data: boolean }> => {
  return request({
    url: `${BASE_API}/email/after-sales/update`,
    method: 'post',
    data,
  })
}

/**
 * 获取客服来源下拉列表
 */
export const getCustomerServiceSourceList = (): Promise<{ data: { id: number, label: string }[] }> => {
  return request({
    url: `${BASE_API}/customer/service/source/list`,
    method: 'get',
  })
}