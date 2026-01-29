export interface IGetPurchaseStatisticsSupplierListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  startDate: string
  endDate: string
  type?: number
}
export interface IGetPurchaseStatisticsProductListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  startDate: string
  endDate: string
  sites: number[]
  siteAggregate: number
}
export interface IGetPurchaseStatisticsProductDetailListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  startDate: string
  endDate: string
  id: number
}
export interface IGetPurchaseStatisticsSupplierListRes {
  data: {
    total: number
    list: IGetPurchaseStatisticsSupplierItem[]
  }
}
export interface IGetPurchaseStatisticsSupplierItem {
  id: number
  supplierName: string
  totalPurchaseAmount: number
}

export interface IGetPurchaseStatisticsProductListRes {
  data: {
    total: number
    list: IGetPurchaseStatisticsProductItem[]
  }
}
export interface IGetPurchaseStatisticsProductItem {
  id: number
  supplierId: number
  supplierName: string
  totalPurchaseAmount: number
  componentImgUrl: string
  componentName: string
  componentPurchaseAmount: number
  purchaseCount: number
  unit: string
  sku: string
  productManager: string
}
