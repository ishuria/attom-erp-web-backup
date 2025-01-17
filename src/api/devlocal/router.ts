import { BASE_API } from '/@/api/devlocal/api'
import request from '/@/utils/request'

import type {IMenuAddOrUpdteReq,IMenuDeleteReq} from '/@/type/menu/menuType'

export const getList = (params?: any) => {
  return request({
    url: `${BASE_API}/router/getOwnerList`,
    method: 'get',
    params,
  })
}

/**
 * 获取菜单列表
 * @returns 
 */
export const getMenuList = () => {
  return request({
    url: `${BASE_API}/router/getList`,
    method: 'get',
  })
}

/**
 * 获取菜单名称列表
 * @returns 
 */
export const getMenuNameList = () => {
  return request({
    url: `${BASE_API}/router/getMenuList`,
    method: 'get',
  })
}

/**
 * 添加菜单
 * @param data
 * @returns 
 */
export const doAdd = (data?: IMenuAddOrUpdteReq) => {
  return request({
    url: `${BASE_API}/router/add`,
    method: 'post',
    data,
  })
}

/**
 * 修改菜单
 * @param data 
 * @returns 
 */
export const doUpdate = (data?: IMenuAddOrUpdteReq) => {
  return request({
    url: `${BASE_API}/router/update`,
    method: 'post',
    data,
  })
}

/**
 * 删除菜单
 * @param data 
 * @returns 
 */
export const doDelete = (data: IMenuDeleteReq) => {
  return request({
    url: `${BASE_API}/router/delete`,
    method: 'post',
    data,
  })
}