export interface IGetOperationAmazonSKUListReq {
  keyword: string
  siteIds: string
  operationUserId: number
  developUserId: number
  pageNo: number
  pageSize: number
}
export interface IGetOperationAmazonSKUListRes {
  data: {
    list: IGetOperationAmazonSKUList[]
    total: number
  }
}

export interface IGetOperationAmazonSKUList {
  /**
   * 接受中数量
   */
  acceptingCount?: number
  /**
   * 广告状态 0关闭 1开
   */
  advertisementStatus?: number
  /**
   * 亚马逊FBA
   */
  amazonFba?: number
  /**
   * ASIN
   */
  asin?: string
  /**
   * 剩余库存/前
   */
  availableInventory?: number
  /**
   * 半年有货率
   */
  availableRate?: number
  /**
   * 上一次大类排名
   */
  beforeMajorCategoryRanking?: number
  /**
   * 上次小类排名
   */
  beforeSubcategoryRanking?: number
  /**
   * 评论数
   */
  commentsNumbers?: number
  /**
   * 今日广告
   */
  currentAdvertisement?: number
  /**
   * 今销数量
   */
  currentSalesNumber?: number
  /**
   * 今销订单数量
   */
  currentSalesOrder?: number
  /**
   * 今销金额
   */
  currentSalesPrice?: number
  /**
   * 开发人员
   */
  developName?: string
  /**
   * fba差异
   */
  differenceFba?: number
  /**
   * 库存可售天数
   */
  esAvailableSaleDay?: number
  /**
   * 可售含在途天数
   */
  esAvailableSaleDayTotal?: number
  /**
   * 预估入库日期
   */
  estimateInboundDate?: string
  /**
   * 预估下月仓储费
   */
  estimateNextMonthStorageFee?: number
  /**
   * 剩余库存/后
   */
  fbaCount?: number
  /**
   * fab仓储费
   */
  fbaStorageFee?: number
  /**
   * 试算毛利
   */
  grossProfit?: number
  /**
   * 30天毛利售价
   */
  grossSellingPrice?: number
  /**
   * 头部数量
   */
  headerCount?: number
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
   * 月ACOS
   */
  monthAcos?: number
  /**
   * 月广告百分比
   */
  monthAdv?: number
  /**
   * 月广告支出
   */
  monthAdvExpenditure?: number
  /**
   * 月广告销售
   */
  monthAdvSales?: number
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
   * 上新天数
   */
  newArrivalDay?: number
  /**
   * 当前大类排名
   */
  nowMajorCategoryRanking?: number
  /**
   * 当前小类排名
   */
  nowSubcategoryRanking?: number
  /**
   * 操作建议
   */
  operateSuggestion?: string
  /**
   * 运营备注
   */
  operationRemark?: string
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
   * 断货天数
   */
  outOfStock?: number
  /**
   * 父体ASIN
   */
  parentAsin?: string
  /**
   * planPo计划采购SKU数量
   */
  planPoPurchaseSkuNumber?: number
  /**
   * 盈亏售价
   */
  profitLossSellingPrice?: number
  /**
   * 评分
   */
  rating?: number
  /**
   * 最近入库
   */
  recentlyInboundStorage?: string
  /**
   * 移除量
   */
  removalAmount?: number
  /**
   * 替换量
   */
  replacementAmount?: number
  /**
   * 自量fba
   */
  selfAssessmentFba?: number
  /**
   * 当前售价
   */
  sellingPrice?: number
  /**
   * 站点名
   */
  siteName?: string
  /**
   * sku信息
   */
  sku?: string
  /**
   * SKU图片地址
   */
  skuImgUrl?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 停产标记 0未停产 1停产
   */
  stopProductStatus?: number
  /**
   * 两周广告转化率
   */
  tWksAdvRate?: number
  /**
   * 两周广告点击率
   */
  tWksClickRate?: number
  /**
   * 两周总转化率
   */
  tWksTotalConv?: number
  /**
   * voc缺陷
   */
  vocDefect?: number
  /**
   * voc不满意数量
   */
  vocNcxCount?: number
  /**
   * voc满意度
   */
  vocSatisfaction?: number
  /**
   * voc总订单
   */
  vocTotalOrderCount?: number
  /**
   * 低量仓储费天数
   */
  warehousing?: number
  /**
   * 1年ACOS
   */
  yearAcos?: number
  /**
   * 1年TACOS
   */
  yearTacos?: number
  [property: string]: any
}

export interface OperationTypeList {
  id: number
  label: string
}
export interface IGetOperationTypeListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetOperationTypeListRes {
  data: {
    list: { id: number, typeName: string }[]
    total: number
  }
}
export interface IFilterAmazonSKUListReq {
  /**
   * 广告状态
   */
  advStatus?: number
  /**
   * 开发人员 全部：-1
   */
  developUserId?: number
  /**
   * ES总最大值
   */
  esTotalMax?: number
  /**
   * ES总最小值
   */
  esTotalMin?: number
  /**
   * FBA差异大
   */
  fbaMax?: number
  /**
   * FBA差异小
   */
  fbaMin?: number
  /**
   * 关键词
   */
  keyword?: string
  /**
   * 30天净利率大
   */
  monthInterestRateMax?: number
  /**
   * 30天净利率小
   */
  monthInterestRateMin?: number
  /**
   * 30天净利润大
   */
  monthProfitMax?: number
  /**
   * 30天净利润小
   */
  monthProfitMin?: number
  /**
   * 月销售额大
   */
  monthSalesVolumeMax?: number
  /**
   * 月销售额小
   */
  monthSalesVolumeMin?: number
  /**
   * 上新天数最小值
   */
  newArrivalMaxDay?: number
  /**
   * 上新天数最小值
   */
  newArrivalMinDay?: number
  /**
   * 运营分类筛选id
   */
  operationTypeId?: number
  /**
   * 运营人员 全部：-1
   */
  operationUserId?: number
  /**
   * 当前页 默认1
   */
  pageNo?: number
  /**
   * 每页大小 默认20
   */
  pageSize?: number
  /**
   * 上海签收最大数量
   */
  signCountMax?: number
  /**
   * 上海签收最小数量
   */
  signCountMin?: number
  /**
   * 站点 全部：空字符串
   */
  siteIds?: string
  [property: string]: any;
}
export interface IGetOperationAsinListRes {
  data: {
    list: IGetOperationAsinList[]
    total: number
  }
}

export interface IGetOperationAsinList {
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
   * 上一次大类排名
   */
  beforeMajorCategoryRanking?: number
  /**
   * 上次小类排名
   */
  beforeSubcategoryRanking?: number
  /**
   * 评论数
   */
  commentsNumbers?: number
  /**
   * 今日广告
   */
  currentAdvertisement?: number
  /**
   * 今销数量
   */
  currentSalesNumber?: number
  /**
   * 今销订单数量
   */
  currentSalesOrder?: number
  /**
   * 今销金额
   */
  currentSalesPrice?: number
  /**
   * 开发人员
   */
  developName?: string
  /**
   * 库存可售天数
   */
  esAvailableSaleDay?: number
  /**
   * 可售含在途天数
   */
  esAvailableSaleDayTotal?: number
  /**
   * 预估入库日期
   */
  estimateInboundDate?: string
  /**
   * 预估下月仓储费
   */
  estimateNextMonthStorageFee?: number
  /**
   * 剩余库存/后
   */
  fbaCount?: number
  /**
   * fab仓储费
   */
  fbaStorageFee?: number
  /**
   * 头部数量
   */
  headerCount?: number
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
   * 月ACOS
   */
  monthAcos?: number
  /**
   * 月广告百分比
   */
  monthAdv?: number
  /**
   * 月广告支出
   */
  monthAdvExpenditure?: number
  /**
   * 月广告销售
   */
  monthAdvSales?: number
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
   * 上新天数
   */
  newArrivalDay?: number
  /**
   * 当前大类排名
   */
  nowMajorCategoryRanking?: number
  /**
   * 当前小类排名
   */
  nowSubcategoryRanking?: number
  /**
   * 操作建议
   */
  operateSuggestion?: string
  /**
   * 运营备注
   */
  operationRemark?: string
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
   * 订货SKU数量
   */
  orderSkuNumber?: number
  /**
   * 断货天数
   */
  outOfStock?: number
  /**
   * 父体ASIN
   */
  parentAsin?: string
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
   * 移除量
   */
  removalAmount?: number
  /**
   * 替换量
   */
  replacementAmount?: number
  /**
   * 站点名
   */
  siteName?: string
  /**
   * sku信息
   */
  sku?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 两周广告转化率
   */
  tWksAdvRate?: number
  /**
   * 两周广告点击率
   */
  tWksClickRate?: number
  /**
   * 两周总转化率
   */
  tWksTotalConv?: number
  /**
   * 1年ACOS
   */
  yearAcos?: number
  /**
   * 1年TACOS
   */
  yearTacos?: number
  [property: string]: any
}

