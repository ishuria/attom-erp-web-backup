import request from '/@/utils/request'

export const getList = (params?: any) => {
  return request({
    url: '/lOTManagement/getList',
    method: 'get',
    params,
  })
}
