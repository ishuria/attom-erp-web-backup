import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  InventoryHistoryListRes,
  InventoryHistoryQuery,
  InventoryCountListRes,
  InventoryCountMargin,
  InventoryCountMarginUpdateReq,
  InventoryCountQuery,
  InventoryCountUpdateReq,
} from '/@/type/inventory/count'

export function getInventoryCountMargin(): Promise<{ data: InventoryCountMargin }> {
  return request({
    url: `${BASE_API}/stock/inventory/margin`,
    method: 'get',
  })
}

export function updateInventoryCountMargin(data: InventoryCountMarginUpdateReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/stock/inventory/margin/update`,
    method: 'post',
    data,
  })
}

export function addInventoryCount(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/stock/inventory/add`,
    method: 'post',
  })
}

export function getInventoryCountList(data: InventoryCountQuery): Promise<{ data: InventoryCountListRes }> {
  return request({
    url: `${BASE_API}/stock/inventory/list`,
    method: 'post',
    data,
  })
}

export function getInventoryHistoryList(data: InventoryHistoryQuery): Promise<{ data: InventoryHistoryListRes }> {
  return request({
    url: `${BASE_API}/stock/inventory/history/list`,
    method: 'post',
    data,
  })
}

export function cancelInventoryCount(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/stock/inventory/cancle`,
    method: 'post',
  })
}

export function finishInventoryCount(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/stock/inventory/finish`,
    method: 'post',
  })
}

export function updateInventoryCountRow(data: InventoryCountUpdateReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/stock/inventory/update`,
    method: 'post',
    data,
  })
}
