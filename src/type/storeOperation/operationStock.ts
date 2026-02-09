/**
 * 店铺自动化调价库存
 */
export interface IOperationStockUpdateReq {
  /** 主键 */
  id?: number | null
  /** 主键列表 */
  ids?: number[] | null
  /** 最小调价间隔，天 */
  adjustmentDay?: number | null
  /** 调价幅度 */
  adjustmentRange?: number | null
  /** 提高价格--剩余可售天数 */
  improveDays?: number | null
  /** 提高价格-断货天数 */
  improveOutStockDays?: number | null
  /** 提高价格-rating大于等于 */
  improveRatingHeight?: number | null
  /** 提高价格-可售总库存数 */
  improveStock?: number | null
  /** 最高价格 */
  maxPrice?: number | null
  /** 最低价格 */
  minPrice?: number | null
  /** 降低价格-剩余可售天数 */
  reduceDays?: number | null
  /**降低价格-断货天数  */
  reduceOutStockDays?: number | null
  /** 降低价格-ratings小于等于 */
  reduceRatingLow?: number | null
  /** reduce_sales_total_stock */
  reduceSalesTotalStock?: number | null
  /** 降低价格-剩余含在途可售天数 */
  reduceTransitDays?: number | null
  /** 开关状态 */
  ruleStatus?: number | null
}

/**
 * 店铺自动化调价库存查询列表
 */
export interface IOperationStocksItem {
  adjustmentDay: number
  adjustmentRange: number
  amazonFba: number
  /**
   * 币种符号
   */
  currencyIcon: string
  id: number
  improveDays: number
  improveOutStockDays: number
  /**
   * 提高价格-rating大于等于
   */
  improveRatingHeight: number
  improveStock: number
  /**
   * 最大毛利率
   */
  maxGrossProfitMargin: number
  /**
   * 最高价格
   */
  maxPrice: number
  /**
   * 最低毛利率
   */
  minGrossProfitMargin: number
  minPrice: number
  /**
   * 操作后价格
   */
  operationAfterPrice: number
  /**
   * 操作前价格
   */
  operationBeforePrice: number
  /**
   * 操作时间
   */
  operation: string
  /**
   * 操作结果
   */
  operationResult: string
  /**
   * 操作类型
   */
  operationType: string
  /**
   * 运营人名称
   */
  operationUser: string
  reduceDays: number
  reduceOutStockDays: number
  /**
   * 降低价格-ratings小于等于
   */
  reduceRatingLow: number
  reduceSalesTotalStock: number
  reduceTransitDays: number
  ruleStatus: number
  site: number
  /**
   * 站点
   */
  siteName: string
  /**
   * sku
   */
  sku: string
  /**
   * sku图片
   */
  skuImg: string
}

export interface IOperationStockDefaultParams {
  /** 最低毛利率 */
  minGrossProfitMargin?: number
  minPriceGrossProfitMargin?: number
  /** 最高毛利率 */
  maxGrossProfitMargin?: number
  maxPriceGrossProfitMargin?: number
  /** 调价幅度 */
  adjustmentRange?: number
  /** 最小调价间隔 */
  adjustmentDay?: number
  /** 提高价格--剩余可售天数 */
  improveDays?: number
  /** 提高价格--可售总库存数 */
  improveStock?: number
  /** 提高价格--断货天数 */
  improveOutStockDays?: number
  /** rating大于等于 */
  improveRatingHeight?: number
  /** * 降低价格-断货天数 */
  reduceOutStockDays?: number
  /** * 降低价格-剩余可售天数 */
  reduceDays?: number
  /** * 降低价格-剩余含在途可售天数 */
  reduceTransitDays?: number
  /** * 降低价格-可售总库存数 */
  reduceSalesTotalStock?: number
  /** * 降低价格-ratings小于等于 */
  reduceRatingLow?: number
  minAddPrice?: number
  maxDecodePrice?: number
  reduceAvailableInventory?: number
  /** 最优价格毛利率 */
  optimalPriceGrossMargin?: number
}

export interface IOperationStockLogRules {
  data?: {
    /** 数据列表 */
    list: IOperationStockLog[]
    /** 总页数 */
    total: number
  }
}

export interface IOperationStockLog {
  /**
   * 主键id
   */
  id?: number

  /**
   * 库存规则id
   */
  stockRuleId?: number

  /**
   * 操作之前的价格
   */
  operationBeforePrice?: number

  /**
   * 操作之后的价格
   */
  operationAfterPrice?: number

  /**
   * 操作结果
   */
  operationResult?: string

  /**
   * 操作时间
   */
  operation?: string

  /**
   * 操作类型 0调减 1调增
   */
  operationType?: string

  /**
   * 是否为最新记录 0不是 1是
   */
  isLatest?: string

  /**
   * 创建时间
   */
  createTime?: string
}
