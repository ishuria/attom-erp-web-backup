import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

/**
 * 角色列表
 * @param params 可选
 * @returns
 */
export function getAllList(params?: any) {
  return request({
    url: `${BASE_API}/role/getAllList`,
    method: 'get',
    params,
  })
}

/**
 * 角色名称、角色code列表
 * @param params 可选
 * @returns
 */
export function getList(params?: any) {
  return request({
    url: `${BASE_API}/role/getList`,
    method: 'get',
    params,
  })
}

/**
 * 获取所有菜单和菜单下的btn
 * @param params
 * @returns
 */
export const getAllMenuAndBtnList = (params?: any) => {
  return request({
    url: `${BASE_API}/role/router/getAllList`,
    method: 'get',
    params,
  })
}

export const getMenuAndBtnListByRoleCode = (params?: any) => {
  return request({
    url: `${BASE_API}/role/permissionList`,
    method: 'get',
    params,
  })
}

export const doAdd = (data: any) => {
  return request({
    url: `${BASE_API}/role/add`,
    method: 'post',
    data,
  })
}

export const doEdit = (data: any) => {
  return request({
    url: `${BASE_API}/role/doEdit`,
    method: 'post',
    data,
  })
}

export const doDelete = (data: any) => {
  return request({
    url: `${BASE_API}/role/doDelete`,
    method: 'post',
    data,
  })
}

export const doDeleteList = (data: any) => {
  return request({
    url: `${BASE_API}/role/doDeleteList`,
    method: 'post',
    data,
  })
}
