import { BASE_API } from '/@/api/devlocal/api'
import request from '/@/utils/request'

export const getList = (params?: any) => {
  return request({
    url: `${BASE_API}/router/getOwnerList`,
    method: 'get',
    params,
  })
}

export const getMenuList = (params?: any) => {
  return request({
    url: `${BASE_API}/router/getList`,
    method: 'get',
    params,
  })
}

export const getMenuNameList = (params?: any) => {
  return request({
    url: `${BASE_API}/router/getMenuList`,
    method: 'get',
    params,
  })
}


export const doAdd = (data?: any) => {
  return request({
    url: `${BASE_API}/router/add`,
    method: 'post',
    data,
  })
}

export const doUpdate = (data?: any) => {
  return request({
    url: `${BASE_API}/router/update`,
    method: 'post',
    data,
  })
}


export const doDelete = (data?: any) => {
  return request({
    url: `${BASE_API}/router/delete`,
    method: 'post',
    data,
  })
}