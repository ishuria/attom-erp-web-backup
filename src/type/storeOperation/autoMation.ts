export interface IAutoMationRules {
  data?: {
    /** 数据列表 */
    list: IAutoMationItem[]
    /** 总页数 */
    total: number
  }
}

export interface IAutoMationItem {
  closeDays: number
  /**
   * 关闭广告-毛利率
   */
  closeGrossProfit: number
  /**
   * 关闭广告-断货天数
   */
  closeOutStockDays: number
  /**
   * 关闭广告-rating
   */
  closeRating: number
  /**
   * 关闭广告-可售库存数
   */
  closeStock: number
  /**
   * 操作对象
   */
  group: IOperationType
  /**
   * 主键
   */
  id: number
  /**
   * 开启广告-广告acos
   */
  openAdvAcos: number
  /**
   * 开启广告-剩余可售天数
   */
  openDays: number
  /**
   * 开启广告-毛利率
   */
  openGrossProfit: number
  /**
   * 开启广告-断货天数
   */
  openOutStockDays: number
  /**
   * 开启广告-rating
   */
  openRating: number
  /**
   * 开启广告-可售库存数
   */
  openStock: number
  /**
   * 操作广告类型,参考attom_dictionary_item表
   */
  operationAdvType: IOperationType[]
  /**
   * 规则开关 0关 1开
   */
  roleStatus: number
  /**
   * 站点code
   */
  site: number
  siteName: string
  /**
   * sku
   */
  sku: string
  /** 运营 */
  operationUser: string
  /** sku图片 */
  skuImg: string
  operationTypeList: IOperationType[]
  operationAdvTypeList: IOperationType[]
}

export interface IOperationType {
  code?: number
  name?: string
}

export interface IAutoMationQueryReq {
  /**
   * 关键词
   */
  keyWord?: string
  /**
   * 运营人员
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
   * 站点
   */
  sites?: number[]
  /**
   * 规则开关状态 0关 1开
   */
  roleStatus?: number | null
  /**
   * 规则开关状态 -1全部 0关 1开
   */
  ruleStatus?: number
  priceChangeType?: number
}

/** 店铺自动化修改 */
export interface IAutoMationUpdateReq {
  closeDays?: number
  /**
   * 关闭广告-毛利率
   */
  closeGrossProfit?: number
  /**
   * 关闭广告-断货天数
   */
  closeOutStockDays?: number
  /**
   * 关闭广告-rating
   */
  closeRating?: number
  /**
   * 关闭广告-可售库存数
   */
  closeStock?: number
  /**
   * 操作对象
   */
  groupId?: number
  group?: IOperationType
  /**
   * 主键
   */
  id?: number

  /**
   * 主键列表
   */
  ids?: number[]
  /**
   * 开启广告-广告acos
   */
  openAdvAcos?: number
  /**
   * 开启广告-剩余可售天数
   */
  openDays?: number
  /**
   * 开启广告-毛利率
   */
  openGrossProfit?: number
  /**
   * 开启广告-断货天数
   */
  openOutStockDays?: number
  /**
   * 开启广告-rating
   */
  openRating?: number
  /**
   * 开启广告-可售库存数
   */
  openStock?: number
  /**
   * 操作广告类型,参考attom_dictionary_item表
   */
  operationAdvTypeStr?: string
  operationAdvType?: IOperationType[]
  /**
   * 规则开关 0关 1开
   */
  roleStatus?: number
}

export interface IAutoMationResult {
  data?: boolean
}

export interface IAutoMationDefaultPramsRules {
  data?: IAutoMationItem
}

export interface IAutomationLogRules {
  data?: {
    /** 数据列表 */
    list: IAutomationLogItem[]
    /** 总页数 */
    total: number
  }
}

export interface IAutomationLogItem {
  closeDays: number
  /**
   * 关闭广告-毛利率
   */
  closeGrossProfit: number
  /**
   * 关闭广告-断货天数
   */
  closeOutStockDays: number
  /**
   * 关闭广告-rating
   */
  closeRating: number
  /**
   * 关闭广告-可售库存数
   */
  closeStock: number
  /**
   * 操作对象
   */
  group: IOperationType
  /**
   * 主键
   */
  id: number
  /**
   * 开启广告-广告acos
   */
  openAdvAcos: number
  /**
   * 开启广告-剩余可售天数
   */
  openDays: number
  /**
   * 开启广告-毛利率
   */
  openGrossProfit: number
  /**
   * 开启广告-断货天数
   */
  openOutStockDays: number
  /**
   * 开启广告-rating
   */
  openRating: number
  /**
   * 开启广告-可售库存数
   */
  openStock: number
  /**
   * 操作广告类型,参考attom_dictionary_item表
   */
  operationAdvType: IOperationType[]
  /**
   * 规则开关 0关 1开
   */
  roleStatus: number
  operationTypeList: IOperationType[]
  operationAdvTypeList: IOperationType[]
}

export interface IOperationStockRulesSiteParams {
  id?: number
  currency?: string
  symbol?: string
  siteName?: string
  priceAdjustmentRange?: number
  amplitudeDay?: number
  lowDeliveryFeeMaxPrice?: number
  lowDeliveryFee?: number
}

// 销量趋势数据项
export interface SaleTrendDataItem {
  date: string // 日期，如 '2024-01-01'
  salesVolume: number // 销量
  price: number // 原价
  landedPrice: number // 折后价
}

// 获取销量趋势请求参数
export interface GetSaleTrendParams {
  sku: string // SKU
  site: number // 站点
  startDate: string // 开始日期，格式：YYYY-MM-DD
  endDate: string // 结束日期，格式：YYYY-MM-DD
}

// 获取销量趋势响应
export interface GetSaleTrendResponse {
  data: SaleTrendDataItem[]
}

// 获取销量趋势响应
export interface GetPriceProfitScatterResponse {
  data: PriceProfitScatterItem[]
}
// 销量趋势数据项
export interface PriceProfitScatterItem {
  price: number
  avgProfitPerOrder: number
  dailyAvgVolume: number
}
