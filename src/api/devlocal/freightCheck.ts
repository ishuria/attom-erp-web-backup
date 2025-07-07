import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

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