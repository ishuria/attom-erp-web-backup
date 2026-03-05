import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

export function pdfMerge(data?: FormData): Promise<Blob> {
  return request({
    url: `${BASE_API}/pdf/merge`,
    method: 'post',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function invoiceImport(data?: FormData): Promise<Blob> {
  return request({
    url: `${BASE_API}/invoice/import`,
    method: 'post',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
