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
  siteList: number[]
  siteAgg: number
  orderByField?: string
  orderDirection?: string
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

export interface IGetPurchaseStatisticsSkuListRes {
  data: {
    total: number
    list: IGetPurchaseStatisticsSkuItem[]
  }
}
export interface IGetPurchaseStatisticsSkuItem {
  sku: string
  productName: string

  skuImageUrl: string

  /** 多站点 */
  sites: string

  /** SKU采购总套数 */
  totalPurchaseCount: number

  /** SKU采购总额 */
  totalPurchaseAmount: number

  /** SKU月均采购平均值 */
  avgMonthlyPurchaseAmount: number

  /** 主体供应商 */
  mainSupplierName: string

  /** SKU零件数量 */
  componentCount: number

  /** 产品经理 */
  productManagerName: string
}
