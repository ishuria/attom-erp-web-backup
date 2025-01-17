import request from '/@/utils/request'


import { BASE_API } from '/@/api/devlocal/api'

/**
 * 通用文件下载方法
 * @param {string} url - 下载文件的URL
 * @param {Object} params - 请求的参数，通常是查询参数
 * @returns {Promise<void>} - 返回Promise，在下载完成后解析
 */
export function downloadFile(url:string, params:any) {

  return request({
    method: 'GET',
    url: `${BASE_API}${url}`,
    params,
    responseType: 'blob', // 确保响应类型为二进制流
  })
}

export function downloadFileP(url:string, params:any) {

  return request({
    method: 'POST',
    url: `${BASE_API}${url}`,
    params,
    responseType: 'blob', // 确保响应类型为二进制流
  })
}

export function downloadFilePD(url:string, data:any) {

  return request({
    method: 'POST',
    url: `${BASE_API}${url}`,
    data,
    responseType: 'blob', // 确保响应类型为二进制流
  })
}
