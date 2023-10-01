import request from '/@/utils/request'

export function getList(params: any) {
  return request({
    url: '/goodsComment/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/goodsComment/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/goodsComment/doDelete',
    method: 'post',
    data,
  })
}
