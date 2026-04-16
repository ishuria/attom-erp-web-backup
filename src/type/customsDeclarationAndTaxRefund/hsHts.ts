export interface IGetHSListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetHSListRes {
  data: {
    total: number
    list: IGetHSList[]
  }
}
export interface IGetHSList {
  isKgFlag?: boolean
  id: number
  hs: string
  statutoryUnit: string
  statutoryCount: number
  taxRate: number
  domesticSale: number
  typeName?: string
  levyRate: number
  taxDate?: string
  refundDate?: string
  taxExemptionDate?: string
}
export interface IUpdateHSListReq {
  id: number
  isKgFlag?: boolean
  statutoryUnit?: string
  statutoryCount?: number
  taxRate?: number
  domesticSale?: number
  levyRate?: number | undefined
}
export interface IAddHSListReq {
  hs: string
  statutoryUnit: string
  statutoryCount: number
  taxRate: number
}
export interface IGetHTSListReq {
  keyWord?: string
  type?: number
  pageNo?: number
  pageSize?: number
}
export interface IGetHTSListRes {
  data: {
    list: IGetHTSList[]
    total: number
  }
}

export interface IGetHTSList {
  /**
   * 1级大类
   */
  categoryOne?: string
  /**
   * 3级大类
   */
  categoryThree?: string
  /**
   * 2级大类
   */
  categoryTwo?: string
  /**
   * 德国关税率
   */
  deTariffRate?: number
  /**
   * 杂费
   */
  extras?: number
  /**
   * HTS
   */
  hts?: string
  /**
   * Hts的Id
   */
  id?: number
  /**
   * 产品大类
   */
  productCategory?: string
  /**
   * 美国(北美)关税率
   */
  tariffRate?: number
  /**
   * 301税率
   */
  threeZeroOne?: number
  /**
   * 英国关税率
   */
  ukTariffRate?: number
  [key: string]: any
}
export interface IAddHTSListReq {
  /**
   * 1级大类
   */
  categoryOne?: string
  /**
   * 3级大类
   */
  categoryThree?: string
  /**
   * 2级大类
   */
  categoryTwo?: string
  /**
   * 德国关税率
   */
  deTariffRate?: number
  /**
   * 杂费
   */
  extras?: number
  /**
   * HTS
   */
  hts?: string
  /**
   * 产品大类
   */
  productCategory?: string
  /**
   * 美国(北美)关税率
   */
  tariffRate?: number
  /**
   * 301税率
   */
  threeZeroOne?: number
  /**
   * 关税类型 0美国（北美） 1欧洲（德国、英国）
   */
  type?: number
  /**
   * 英国关税率
   */
  ukTariffRate?: number
}
export interface IUpdateHTSListReq {
  /**
   * 1级大类
   */
  categoryOne?: string
  /**
   * 3级大类
   */
  categoryThree?: string
  /**
   * 2级大类
   */
  categoryTwo?: string
  /**
   * 德国关税率
   */
  deTariffRate?: number
  /**
   * 杂费
   */
  extras?: number
  /**
   * hts的id
   */
  id?: number
  /**
   * 产品大类
   */
  productCategory?: string
  /**
   * 美国(北美)关税率
   */
  tariffRate?: number
  /**
   * 301税率
   */
  threeZeroOne?: number
  /**
   * 关税类型 0美国（北美） 1欧洲（德国、英国）
   */
  type?: number
  /**
   * 英国关税率
   */
  ukTariffRate?: number
}

export interface IGetHtsSkuListReq {
  htsId?: number
  type?: number
  keyWord?: string
  pageNo?: number
  pageSize?: number
}
export interface IHtsSkuList {
  sku: string
  skuImageUrl: string
  desc: string
}
export interface IGetHtsSkuListRes {
  data: {
    total: number
    list: IHtsSkuList[]
  }
}

export interface IGetPurchaseComponentHsInfo {
  id: number
  hsId?: number
  statutoryUnit?: string
  quorum?: string
}
export interface IUpdatePurchaseComponentHs {
  id: number
  hsId?: number
  quorum?: string
}
