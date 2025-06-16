import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IAiTuoMuBoolean,
  IAiTuoMuDeleteReq,
  IAiTuoMuInvoiceList,
  IAiTuoMuInvoiceReq,
  IAiTuoMuMatchDeleteReq,
  IAiTuoMuMatchReq,
  IAiTuoMuUpdateDetailReq,
  IAiTuoMuUpdateReq,
  IFinishAiTuoMuInvoiceRes,
} from '/@/type/aiTuoMu/aiTuoMuInvoice'
import { IAiTuoMuList, IAiTuoMuListReq } from '/@/type/aiTuoMu/aiTuoMuList'

/**
 * @description 埃托姆-列表
 */
export function getAiTuoMuList(data: IAiTuoMuListReq): Promise<IAiTuoMuList> {
  return request({
    url: `${BASE_API}/aituomu/list`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-发票导入上传
 * @param data 发票文件数据
 * @returns
 */
export const uploadAiTuoInvoice = (data: FormData) => {
  return request({
    url: `${BASE_API}/aituomu/invoice/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 埃托姆-发票导入完成
 * @param data 上传后的发票文件名
 * @returns
 */
export const finishAiTuoMuInvoice = (data: string[]): Promise<IFinishAiTuoMuInvoiceRes> => {
  return request({
    url: `${BASE_API}/aituomu/invoice/finish`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-导入的发票列表
 * @param data 请求参数
 * @returns
 */
export function getAiTuoMuInvoiceList(data: IAiTuoMuInvoiceReq): Promise<IAiTuoMuInvoiceList> {
  return request({
    url: `${BASE_API}/aituomu/invoice/list`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-修改发票信息
 * @param data 请求参数
 * @returns
 */
export function updateAiTuoMuInvoice(data: IAiTuoMuUpdateReq): Promise<IAiTuoMuBoolean> {
  return request({
    url: `${BASE_API}/aituomu/invoice/update`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-修改发票信息
 * @param data 请求参数
 * @returns
 */
export function updateAiTuoMuInvoiceDetail(data: IAiTuoMuUpdateDetailReq): Promise<IAiTuoMuBoolean> {
  return request({
    url: `${BASE_API}/aituomu/invoice/detail/update`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-删除发票
 * @param data
 * @returns
 */
export const deleteAiTuoMuInvoice = (data: IAiTuoMuDeleteReq): Promise<IAiTuoMuBoolean> => {
  return request({
    url: `${BASE_API}/aituomu/invoice/delete`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-发票匹配提交
 * @param data
 * @returns
 */
export const aiTuoMuInvoiceMatch = (data: IAiTuoMuMatchReq): Promise<IAiTuoMuBoolean> => {
  return request({
    url: `${BASE_API}/aituomu/invoice/match`,
    method: 'post',
    data,
  })
}

/**
 * 埃托姆-已匹配发票删除
 * @param data 删除发票信息
 * @returns
 */
export const aiTuoMuInvoiceMatchDelete = (data: IAiTuoMuMatchDeleteReq): Promise<IAiTuoMuBoolean> => {
  return request({
    url: `${BASE_API}/aituomu/invoice/match/delete`,
    method: 'post',
    data,
  })
}
