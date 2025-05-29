import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type { IAddParams, IEditParams, IGetAllNameReq, IUserDeleteReq, IUserQueryReq } from '/@/type/user/userType'

export function getList(data?: IUserQueryReq) {
  return request({
    url: `${BASE_API}/user/getList`,
    method: 'post',
    data,
  })
}

export const doAdd = (data: IAddParams) => {
  return request({
    url: `${BASE_API}/user/doAdd`,
    method: 'post',
    data,
  })
}

export const doEdit = (data: IEditParams) => {
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

/**
 * 获取分公司列表
 */
export function getCompany() {
  return request({
    url: `${BASE_API}/user/getCompany`,
    method: 'post',
  })
}

/**
 * @description 获取所有公司所有人名
 */
export function getAllName(params: IGetAllNameReq) {
  return request({
    url: `${BASE_API}/user/getAllName`,
    method: 'get',
    params
  })
}

/**
 * 获取主管列表
 * @returns 
 */
export function getSupervisorList() {
  return request({
    url: `${BASE_API}/supervisor/list`,
    method: 'get',
  })
}
