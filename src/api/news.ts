import request from '/@/utils/request'

export function getList() {
  return request({
    url: '/news/getList',
    method: 'get',
  })
}
