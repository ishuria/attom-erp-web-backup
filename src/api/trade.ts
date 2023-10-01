import request from '/@/utils/request'

export function getList(params: any) {
  return request({
    url: '/trade/getList',
    method: 'get',
    params,
  })
}

export function doRefund(data: any) {
  return request({
    url: '/trade/doRefund',
    method: 'post',
    data,
  })
}
