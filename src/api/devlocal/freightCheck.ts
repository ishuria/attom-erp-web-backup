import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IGetFreightCheckReq, IGetFreightCheckRes } from '/@/type/freightCheck/freightCheckType'

/**
 * 头程运费核对-上传文件
 * @param data 
 * @returns 
 */
export function uploadFreightCheckFile(data: FormData): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/file/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
/**
 * 头程运费核对-获取列表  
 * @param data 
 * @returns 
 */
export function getFreightCheckList(data: IGetFreightCheckReq): Promise<IGetFreightCheckRes> {
  return request({
    url: `${BASE_API}/freight/check/list`,
    method: 'post',
    data
  })
}
/**
 * 头程运费核对-取消核对
 * @returns 
 */
export function deleteFreightCheck(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/delete`,
    method: 'get'
  })
}
/**
 * 更新人工备注
 * @param data 
 * @returns 
 */
export function updateManualRemarks(data: { remarks: string, id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/update/manual_remarks`,
    method: 'post',
    data
  })
}

/**
 * 发送邮件
 * @returns 
 */
export function sendFreightCheckEmail(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/send/email`,
    method: 'get'
  })
}

/**
 * 审批通过
 * @returns 
 */
export function approvedFreightCheck(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/approval/passed`,
    method: 'get'
  })
}

/**
 * 更新为已付款
 * @param data 
 * @returns 
 */
export function updateFreightCheckPaid(data: { ids: number[] }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/freight/check/update/paid`,
    method: 'post',
    data
  })
}
