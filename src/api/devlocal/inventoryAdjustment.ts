import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  InventoryAdjustAddReq,
  InventoryAdjustDetailQuery,
  InventoryAdjustListReq,
} from '/@/type/inventory/adjust'

export function getInventoryAdjustSkuInfo(sku: string) {
  return request({
    url: `${BASE_API}/product/sku/info/${sku}`,
    method: 'post',
  })
}

export function getInventoryAdjustPoList(sku: string) {
  return request({
    url: `${BASE_API}/purchase/poList/${sku}`,
    method: 'post',
  })
}

export function addInventoryAdjust(data: InventoryAdjustAddReq) {
  return request({
    url: `${BASE_API}/stock/adjust/add`,
    method: 'post',
    data,
  })
}

export function getInventoryAdjustList(data: InventoryAdjustListReq) {
  return request({
    url: `${BASE_API}/stock/adjust/list`,
    method: 'post',
    data,
  })
}

export function getInventoryAdjustDetail(data: InventoryAdjustDetailQuery) {
  return request({
    url: `${BASE_API}/stock/adjust/detail`,
    method: 'post',
    data,
  })
}

export function getInventoryAdjustMargin() {
  return request({
    url: `${BASE_API}/stock/margin`,
    method: 'get',
  })
}

export function updateInventoryAdjustMargin(data: { margin: number }) {
  return request({
    url: `${BASE_API}/stock/margin/update`,
    method: 'post',
    data,
  })
}
