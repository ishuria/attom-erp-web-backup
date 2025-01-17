import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IPurchaserId,
  IRepositoryId,
  IaddPurchaseCompany,
  IaddPurchaseRepository,
  IgetPurchaseRepositoryResp,
  IupdatePurchaseCompany,
  IupdatePurchaseRepository
} from '/@/type/purchase/ourInformationType'

// 我司信息-查询列表
export function getPurchaseCompanyList() {
  return request({
    url: `${BASE_API}/purchase/company/list`,
    method: 'get',
  })
}

// 我司信息-查询列表
export function getPurchaseRepository(): Promise<IgetPurchaseRepositoryResp>{
    return request({
      url: `${BASE_API}/purchase/list/repository`,
      method: 'get',
    })
}

// 我司信息-添加
export function addPurchaseCompany(data?: IaddPurchaseCompany) {
    return request({
      url: `${BASE_API}/purchase/company/add`,
      method: 'post',
      data,
    })
}
// 我司信息-修改
export function updatePurchaseCompany(data?: IupdatePurchaseCompany) {
    return request({
      url: `${BASE_API}/purchase/company/update`,
      method: 'post',
      data,
    })
}
// 我司信息-删除
export function delPurchaseCompany(params?: IPurchaserId) {
    return request({
      url: `${BASE_API}/purchase/company/del`,
      method: 'post',
      params,
    })
}
// 收货仓库-新增收货仓库
export function addPurchaseRepository(data?: IaddPurchaseRepository) {
    return request({
      url: `${BASE_API}/purchase/add/repository`,
      method: 'post',
      data,
    })
}
// 收货仓库-删除收货仓库
export function delPurchaseRepository(params?: IRepositoryId) {
    return request({
      url: `${BASE_API}/purchase/delete/repository`,
      method: 'post',
      params,
    })
}
// 收货仓库-新增收货仓库
export function updatePurchaseRepository(data?: IupdatePurchaseRepository) {
    return request({
      url: `${BASE_API}/purchase/update/repository`,
      method: 'post',
      data,
    })
}