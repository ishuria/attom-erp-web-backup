export interface IGetDistributionListRes {
  data: IGetDistributionList[]
}
export interface IGetDistributionList {
  id: number
  siteName: string
  userName: string
}
export interface IGetDistributionProductListReq {
  siteCodes: string
  status: number
  keyWord: string
  pageNo: number
  pageSize: number
  oldProductClaim: number
  haltStatus: number
}
export interface IGetDistributionProductListRes {
  data: {
    list: IGetDistributionProductList[]
    total: number
  }
}

export interface IGetDistributionProductList {
  /**
   * asin
   */
  asin?: string
  /**
   * 竞品asin
   */
  benchmarkAsin?: string
  /**
   * SKU描述
   */
  description?: string
  /**
   * 预计入库日期
   */
  estimateInboundDate?: string
  /**
   * 头部数量
   */
  headerCount?: number
  /**
   * 总入库数
   */
  inboundStorageTotal?: number
  /**
   * 产品经理名称
   */
  productManagerName?: string
  /**
   * 最近入库日
   */
  recentlyInboundStorage?: string
  /**
   * 站点名称
   */
  siteName?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * SKU图片
   */
  skuImgUrl?: string
  /**
   * 运营分配id
   */
  typeId?: number
  /**
   * 运营人员id
   */
  userId?: number
  id: number
  userTypeList: { id: number; label: string }[]
}
export interface IAddDistributionListReq {
  userId: number
  site: number
}
export interface IUpdateDistributionAsinUserReq {
  id: number
  userId: number
}
export interface IUpdateDistributionUserType {
  id: number
  typeId: number
}
export interface IUpdateOldStatusReq {
  ids: number[]
}

export interface IMarkUnclaimedReq {
  ids: number[]
  confirmSubmit: boolean
}

export interface IMarkUnclaimedRes {
  data: boolean
  msg?: string
}

export interface IGetUnclaimedListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  status: number
}

export interface IUnclaimedSkuItem {
  productDesc?: string
  sku?: string
}

export interface IGetUnclaimedListItem {
  amazonUrl?: string
  asin?: string
  id: number
  originUserName?: string
  parentAsin?: string
  remark?: string
  siteName?: string
  skuList?: IUnclaimedSkuItem[]
  status: number
  submitDate?: string
  submitUserName?: string
}

export interface IGetUnclaimedListRes {
  data: {
    list: IGetUnclaimedListItem[]
    total: number
  }
}

export interface IUnclaimedApprovalReq {
  id: number
  remark: string
  status: 1 | 2
}
