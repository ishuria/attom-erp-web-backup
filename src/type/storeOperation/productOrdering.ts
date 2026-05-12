export interface IGetOperationOrderListReq {
  keyWord?: string
  operationUserId?: number // 运营人员用户id
  sites?: string // 站点列表多个，分割
  pageNo: number
  pageSize: number
  minDeliveryDate?: number
  maxDeliveryDate?: number
  minNewArrivalDay?: number
  maxNewArrivalDay?: number
  minEs?: number
  maxEs?: number
  minSign?: number
  maxSign?: number
  startLatestDate?: string
  endLatestDate?: string
}
export interface IGetOperationOrderListRes {
  data: {
    list: IGetOperationOrderList[]
    total: number
  }
}
export interface IGetOperationOrderList {
  /**
   * 接受中数量
   */
  acceptingCount?: number
  /**
   * 广告状态 0关闭 1开
   */
  advertisementStatus?: number
  /**
   * ASIN
   */
  asin?: string
  /**
   * 图片地址
   */
  asinImgUrl?: string
  /**
   * 剩余库存/前
   */
  availableInventory?: number
  /**
   * 半年有货率
   */
  availableRate?: number
  /**
   * 评论数
   */
  commentsNumbers?: number
  /**
   * 币种符合
   */
  currencyIcon?: string
  /**
   * 今销数量
   */
  currentSalesNumber?: number
  /**
   * 交期
   */
  deliveryDate?: number
  /**
   * 装箱产品数
   */
  encasementCount?: number
  /**
   * 可售含在途天数
   */
  esAvailableSaleDayTotal?: number
  /**
   * 剩余库存/后
   */
  fbaCount?: number
  /**
   * 试算毛利
   */
  grossProfit?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 总入库
   */
  inboundStorageTotal?: number
  /**
   * 库龄
   */
  inventoryAge?: number
  /**
   * 最晚补货
   */
  latestRestock?: string
  /**
   * 月ACOS
   */
  monthAcos?: number
  /**
   * 月广告百分比
   */
  monthAdv?: number
  /**
   * 月净利润
   */
  monthNetProfit?: number
  /**
   * 月净利润率
   */
  monthNetProfitMargin?: number
  /**
   * 月退款百分比
   */
  monthRefund?: number
  /**
   * 月退货百分比
   */
  monthReturnGoods?: number
  /**
   * 月销售额
   */
  monthSalesPrice?: number
  /**
   * 月销量
   */
  monthSalesVolume?: number
  /**
   * 月TACOS
   */
  monthTacos?: number
  /**
   * 今补(实际)
   */
  nowSupplementActual?: number
  /**
   * 今补广(实际)
   */
  nowSupplementAdvActual?: number
  /**
   * 今补广(计算)
   */
  nowSupplementAdvCalcu?: number
  /**
   * 今补(计算)
   */
  nowSupplementCalcu?: number
  /**
   * 运营分类id
   */
  operationTypeId?: number
  /**
   * 运营分类列表
   */
  operationTypeList?: OperationTypeList[]
  /**
   * 运营人id
   */
  operationUserId?: number
  /**
   * 运营人名
   */
  operationUserName?: string
  /**
   * 订货数量
   */
  orderCount?: number
  /**
   * 总订货数
   */
  orderTotalNumber?: number
  /**
   * 断货天数
   */
  outOfStock?: number
  /**
   * planPo计划采购SKU数量
   */
  planPoPurchaseSkuNumber?: number
  /**
   * 签收数量
   */
  quantityReceived?: number
  /**
   * 评分
   */
  rating?: number
  /**
   * 最近入库
   */
  recentlyInboundStorage?: string
  /**
   * 推荐数量
   */
  recommendCount?: number
  /**
   * 30天销量列表
   */
  saleVolumeList?: number[]
  /**
   * 当前售价
   */
  sellingPrice?: number
  site?: number
  /**
   * 站点名
   */
  siteName?: string
  /**
   * sku信息
   */
  sku?: string
  [property: string]: any
}
export interface OperationTypeList {
  id: number
  label: string
}

export interface IGetOperationOrdersSmoothness {
  smoothness: number
  newSmoothness: number
  newProductDays: number
}
export interface IGetOperationOrderSpringFestival {
  springFestivalStock: number
  startDate: string
}
export interface IReleaseOperationPlanPoReq {
  asinId: number | null
  sku: string
  number: number
  asin?: string
  site?: number
}
export interface IReleaseOperationPlanPoRes {
  data: {
    nowSupplementAdvCalcu?: number
    nowSupplementCalcu?: number
    planPoPurchaseSkuNumber?: number
  }
}
export interface IGetOperationOrderSkuReq {
  id: number | null
  sku: string
  asin?: string
  site?: number
}
export interface IGetOperationOrderSkuRes {
  data: {
    sku: string
    skuImageUrl: string
    description: string
    moq: number
    numberOfCartons: number
    productManagerName: string
    orderQuantity: number
    asinId?: number
  }
}
export interface IUpdateOperationOrderShipmentQuantityReq {
  shippingPlanDate: string
  planSite: number
}
export interface IGetOperationOrderTable {
  releaseDate: string
  po: string
  packageTaskCount: number
  sendSite: string
  status: number
  arrivalDate: string
}

/**
 * 装错货补发明细
 */
export interface IGetRepackageDetail {
  encasementNo: number
  encasementDate: string
  sendSite: string
  sku: string
  encasementCount: number
  remarks: string
}

export interface IProductOrderTableOpenParams {
  sku: string
  site: number
}

export interface IProductOrderTableRef {
  open: (params: IProductOrderTableOpenParams) => Promise<void>
}
