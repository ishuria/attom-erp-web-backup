export interface IGetOperationOrderListReq {
  keyWord: string
  operationUserId: number // 运营人员用户id
  sites: string // 站点列表多个，分割
  pageNo: number
  pageSize: number
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
   * 可售含在途天数
   */
  esAvailableSaleDayTotal?: number
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
   * 月净利润率
   */
  monthNetProfitMargin?: number
  /**
   * 月退款百分比
   */
  monthRefund?: number
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
   * 今广
   */
  nowSupplement?: number
  /**
   * 今广补
   */
  nowSupplementAdv?: number
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
  /**
   * label映射的id
   */
  id?: number
  /**
   * label
   */
  label?: string
  [property: string]: any
}