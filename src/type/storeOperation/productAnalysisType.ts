export interface IGetOperationAmazonCostListReq {
  sku: string
  pageNo: number
  pageSize: number
  siteId: number
}

export interface IGetOperationAmazonCostListRes {
  data: {
    list: IGetOperationAmazonCostList[]
    total: number
  }
}

export interface IGetOperationAmazonCostList {
  /**
   * 外币币种
   */
  currencyType?: string
  /**
   * 头程
   */
  firstMile?: number
  /**
   * 头程渠道
   */
  firstMileChannel?: number
  /**
   * 汇率
   */
  foreignExchange?: string
  /**
   * 毛利率
   */
  grossMarginRate?: number
  /**
   * 高
   */
  height?: number
  /**
   * 主键
   */
  id?: number
  /**
   * 尾程
   */
  lastMile?: number
  /**
   * 长
   */
  length?: number
  /**
   * 下一档位
   */
  nextGear?: string
  /**
   * 打包
   */
  packaging?: number
  /**
   * 平台佣金
   */
  platformCommission?: number
  /**
   * 产品价格
   */
  price?: number
  /**
   * ROI
   */
  roi?: number
  /**
   * 售价
   */
  sellingPrice?: number
  /**
   * 站点参考字典表
   */
  site?: number
  /**
   * 尺寸来源 0自量 1亚马逊
   */
  sizeSource?: number
  /**
   * sku
   */
  sku?: string
  /**
   * 2月仓储费
   */
  storageFee?: number
  /**
   * 关税
   */
  tariff?: number
  /**
   * 关税价格
   */
  tariffPrice?: string
  /**
   * VAT
   */
  vat?: number
  /**
   * 币种符号
   */
  symbol?: string
  /**
   * 体积系数
   */
  volumeCoefficient?: number
  /**
   * 重量
   */
  weight?: number
  /**
   * 重量系数
   */
  weightCoefficient?: number
  /**
   * 宽
   */
  width?: number
}

export interface IUpdateOperationAmazonCostReq {
  /**
   * 头程
   */
  firstMile?: number
  /**
   * 头程渠道
   */
  firstMileChannel?: number
  /**
   * 毛利率
   */
  grossMarginRate?: number
  /**
   * 高
   */
  height?: number
  /**
   * 产品成本核算主键id
   */
  id?: number
  /**
   * 尾程
   */
  lastMile?: number
  /**
   * 长
   */
  length?: number
  /**
   * 打包
   */
  packaging?: number
  /**
   * 平台佣金
   */
  platformCommission?: number
  /**
   * 产品价格
   */
  price?: number
  /**
   * ROI
   */
  roi?: number
  /**
   * 售价
   */
  sellingPrice?: number
  /**
   * 站点参考字典表
   */
  site?: number
  /**
   * 尺寸来源 0自量 1亚马逊
   */
  sizeSource?: number
  /**
   * 2月仓储费
   */
  storageFee?: number
  /**
   * 关税
   */
  tariff?: number
  /**
   * 体积系数
   */
  volumeCoefficient?: number
  /**
   * 重量
   */
  weight?: number
  /**
   * 重量系数
   */
  weightCoefficient?: number
  /**
   * 宽
   */
  width?: number
}

export interface IGetOperationAmazonPackagingInformationRes {
  amazonFba: number
  selfAssessmentFba: number
  amazonLength: number
  amazonWidth: number
  amazonHeight: number
  amazonWeight: number
  length: number
  width: number
  height: number
  weight: number
  imgUrl: string
}

// 表格分页数据请求
export interface IGetTrendOverviewTableReq {
  sku: string
  siteId: number
  asin: string
  type: number
  startDate: string
  endDate: string
  compareType: number // 0=同比, 1=环比
  pageNo: number // 页码（从1开始）
  pageSize: number // 每页数量
}

// 图表完整数据请求（不需要分页）
export interface IGetTrendOverviewChartReq {
  sku: string
  siteId: number
  asin: string
  type: number
  startDate: string
  endDate: string
  compareType: number // 0=同比, 1=环比
}

/**
 * 卡片汇总数据（用于显示卡片的值、对比值和趋势）
 * 后端返回格式：Map<字段名, ICardSummary>
 * 例如：{ "销售额(订单)": { currentValue: 1000, compareValue: 900, changePercentage: 11.11, changeType: "up" } }
 */
export interface ICardSummary {
  /** 当前值（当前日期范围的汇总） */
  currentValue: number | null
  /** 对比值（同比或环比周期的汇总） */
  compareValue: number | null
  /** 变化百分比（正数表示上升，负数表示下降，例如：11.11 表示上升 11.11%） */
  changePercentage: number | null
  /** 变化类型：up=上升, down=下降 */
  changeType: 'up' | 'down' | null
}

/**
 * 趋势总览表格响应（分页数据）
 */
export interface IGetTrendOverviewTableRes {
  data: {
    /** 详细数据列表（分页数据，用于表格显示） */
    list: ITrendOverview[]
    /** 总记录数（用于分页） */
    total: number
  }
}

/**
 * 趋势总览图表响应（完整数据）
 */
export interface IGetTrendOverviewChartRes {
  data: {
    /** 完整数据列表（用于图表计算） */
    list: ITrendOverview[]
    /** 卡片汇总数据 Map<字段名, ICardSummary> */
    summary?: Record<string, ICardSummary>
    symbol?: string
  }
}

export interface ITrendOverview {
  /** 日期 */
  date?: string
  /** 销售额 */
  amount?: number
  /** 销量 */
  volume?: number
  /** 广告销售额 */
  adSalesAmount?: number
  /** 广告花费【组成广告花费项目的总计】 */
  spend?: number
  /** 净利润（订单） */
  grossOrderProfit?: number
  /** 预计下月仓储费 */
  estimatedStorageCostNextMonth?: number
  /** 点击成本 */
  clickCost?: number
  /** 客单价 */
  averageOrderValue?: number
  /** cpa */
  cpa?: number
  /** 广告转化率 */
  adConversionRate?: number
  /** 自然转化率 */
  organicConversionRate?: number
  /** 综合转化率 */
  totalConversionRate?: number
  /** 退货率 */
  returnRate?: number
  /** 退款率 */
  refundRate?: number
  /** 净利润率 */
  netProfitMargin?: number
  tacos?: number
  acos?: number
  /** 广告点击率 */
  adClickRate?: number
  /** 总访客 */
  sessionsTotal?: number
  /** PC端访客 */
  sessions?: number
  /** 移动端访客 */
  sessionsMobile?: number
  /** 自然点击 */
  organicClicks?: number
  /** 自然点击占比 */
  organicClickShare?: number
  /** 广告点击占比 */
  adClickShare?: number
  /** Rating */
  lastStar?: number
  /** 库存 */
  stock?: number
  /** 小类排名 - 可以是单个数字或数组（多个类别） */
  smallRank?: number | Array<{ category: string; performanceId: number; smallRank: number }>
  /** 大类排名 */
  largeRank?: number
  /** 点击量 */
  clicks?: number
  /** 广告销量 */
  adSales?: number
  /** 自然销量 */
  organicSales?: number
  /** 展示 */
  impressions?: number
  /** 退货量 */
  returnGoodsCount?: number
  /** 退款金额 */
  returnAmount?: number
  /** 销售额(利润报表) */
  totalSalesAmount?: number
  /** 净利润（利润报表） */
  grossProfit?: number
  pageViewsTotal?: number
  /** 币种 */
  currencyIcon?: string
}
export interface IGetExpenseCompositionRes {
  data: {
    list: IGetExpenseComposition[]
    totalExpenditure: number
    symbol: string
  }
}
export interface IGetExpenseComposition {
  name: string
  value: number
}

export interface IGetStorageAgeRes {
  data: IGetStorageAge[]
}
export interface IGetStorageAge {
  name: string
  value: number
}

export interface IGetSkuSiteDailyCostRes {
  data: IGetSkuSiteDailyCost[]
}
export interface IGetSkuSiteDailyCost {
  date: string
  /** SKU实际价格 */
  procurementCost: number
  /** 打包成本 */
  packingCost: number
  /** FBA配送费 */
  amazonFba: number
  /** 试算毛利 */
  grossProfit: number
  /** 头程运费 */
  firstMile: number
}
export interface IGetOperationLogRes {
  data: {
    list: IGetOperationLog[]
    total: number
  }
}
export interface IGetOperationLog {
  date: string
  type: number
  content: string
}
export interface IGetProductInfoRes {
  data: IGetProductInfo
}
export interface IGetProductInfo {
  /**
   * sku信息
   */
  sku: string

  /**
   * ASIN
   */
  asin: string

  productDesc: string

  /**
   * 运营分类id
   */
  operationTypeId: number

  /**
   * 运营备注
   */
  operationRemark: string

  /**
   * voc满意度
   */
  vocSatisfaction: string

  /**
   * voc缺陷
   */
  vocDefect: number

  /**
   * voc不满意数量
   */
  vocNcxCount: number

  /**
   * voc总订单
   */
  vocTotalOrderCount: number

  /**
   * 评分
   */
  rating: number

  /**
   * 评论数
   */
  commentsNumbers: number

  /**
   * SKU图片地址
   */
  skuImgUrl: string

  /**
   * asin亚马逊前台地址
   */
  amazonUrl: string

  operationTypeList: OperationTypeList[]
}
export interface OperationTypeList {
  id: number
  label: string
}
