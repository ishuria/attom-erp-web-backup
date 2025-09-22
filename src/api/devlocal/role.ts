import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type { IRoleAddOrUpdateReq, IRoleDeleteReq, IRoleMenuReq, IRoleQuery } from '/@/type/role/roleType'

/**
 * 角色列表
 * @returns
 */
export function getAllList(params: IRoleQuery) {
  return request({
    url: `${BASE_API}/role/getAllList`,
    method: 'get',
    params,
  })
}

/**
 * 角色名称、角色code列表
 * @returns
 */
export function getList() {
  return request({
    url: `${BASE_API}/role/getList`,
    method: 'get',
  })
}

/**
 * 获取所有菜单和菜单下的btn
 * @param params
 * @returns
 */
export const getAllMenuAndBtnList = () => {
  return request({
    url: `${BASE_API}/role/router/getAllList`,
    method: 'get',
  })
}

export const getMenuAndBtnListByRoleCode = (params?: IRoleMenuReq) => {
  return request({
    url: `${BASE_API}/role/permissionList`,
    method: 'get',
    params,
  })
}

export const doAdd = (data: IRoleAddOrUpdateReq) => {
  return request({
    url: `${BASE_API}/role/add`,
    method: 'post',
    data,
  })
}

export const doEdit = (data: IRoleAddOrUpdateReq) => {
  return request({
    url: `${BASE_API}/role/doEdit`,
    method: 'post',
    data,
  })
}

export const doDelete = (data: IRoleDeleteReq) => {
  return request({
    url: `${BASE_API}/role/doDelete`,
    method: 'post',
    data,
  })
}

export const doDeleteList = (data: IRoleDeleteReq) => {
  return request({
    url: `${BASE_API}/role/doDeleteList`,
    method: 'post',
    data,
  })
}
