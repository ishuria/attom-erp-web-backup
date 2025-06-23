import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IBooleanRes,
  ICheckOutboundNotMatchInvoiceExport,
  IGetInBoundListRes,
  IGetOutBoundListReq,
  IGetOutBoundListRes,
  IGetOutboundInventoryCheckRes,
  IGetInboundSummaryRes, IGetInboundSummaryComponentRes,
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

export function queryInboundSummaryList(data: IGetOutBoundListReq): Promise<IGetInboundSummaryRes> {
  return request({
    url: `${BASE_API}/inbound/summary/suppliser`,
    method: 'post',
    data,
  })
}

export function queryInboundSummaryComponentList(data: IGetOutBoundListReq): Promise<IGetInboundSummaryComponentRes> {
  return request({
    url: `${BASE_API}/inbound/summary/component`,
    method: 'post',
    data,
  })
}
