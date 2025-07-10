export interface IGetFreightCheckReq {
  keyWord: string
  pageNo: number
  pageSize: number
  status: number
}

export interface IGetFreightCheckRes {
  data: {
    total: number
    list: IFreightCheckItem[]
  }
}
export interface IFreightCheckItem {
  id: number
  shipmentId?: string
  freightForwardingNumber?: string
  site?: string
  ourSettlementObject?: string
  ourCostName?: string
  count?: number
  unitPrice?: number
  estimateCost?: number
  currency?: string
  mergeCustomsDeclaration?: string
  mergeCustomsClearance?: string
  settlementObject?: string
  costName?: string
  actualQuantity?: number
  actualUnitPrice?: number
  actualTotal?: number
  actualCurrency?: string
  billRemarks?: string
  difference?: number
  error?: number
  systemSelfTest?: string
  manualRemarks?: string
  status?: number
}