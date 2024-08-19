import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {IUserQueryReq,IUserDeleteReq,IUserAddOrUpateReq} from '/@/type/user/userType'

export function getList(params?: IUserQueryReq) {
  return request({
    url: `${BASE_API}/user/getList`,
    method: 'get',
    params,
  })
}

export const doAdd = (data: IUserAddOrUpateReq) => {
  return request({
    url: `${BASE_API}/user/doAdd`,
    method: 'post',
    data,
  })
}

export const doEdit = (data: IUserAddOrUpateReq) => {
  return request({
    url: `${BASE_API}/user/doEdit`,
    method: 'post',
    data,
  })
}

export const doDelete = (data: IUserDeleteReq) => {
  return request({
    url: `${BASE_API}/user/doDelete`,
    method: 'post',
    data,
  })
}

export const doMostDelete = (data: IUserDeleteReq) => {
  return request({
    url: `${BASE_API}/user/doDeleteList`,
    method: 'post',
    data,
  })
}
