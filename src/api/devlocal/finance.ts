import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IBooleanRes,
  ICheckOutboundNotMatchInvoiceExport,
  IGetInBoundListRes,
  IGetOutBoundListReq,
  IGetOutBoundListRes,
  IGetOutboundInventoryCheckRes,
} from '/@/type/finance/financeType'

export function getOutBoundList(data: IGetOutBoundListReq): Promise<IGetOutBoundListRes> {
  return request({
    url: `${BASE_API}/outbound/list`,
    method: 'post',
    data,
  })
}

export function getOutboundInventoryCheck(): Promise<IGetOutboundInventoryCheckRes> {
  return request({
    url: `${BASE_API}/outbound/inventory/check`,
    method: 'get',
  })
}

export function getInboundList(data: IGetOutBoundListReq): Promise<IGetInBoundListRes> {
  return request({
    url: `${BASE_API}/inbound/list`,
    method: 'post',
    data,
  })
}

export function checkOutboundNotMatchInvoiceExport(data: ICheckOutboundNotMatchInvoiceExport): Promise<IBooleanRes> {
  return request({
    url: `${BASE_API}/outbound/notMatch/invoiceExport/check`,
    method: 'post',
    data,
  })
}
