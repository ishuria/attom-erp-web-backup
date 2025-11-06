export interface IGetOperationAmazonCostListReq {
  sku: string
  pageNo: number
  pageSize: number
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

export interface IGetTrendOverviewReq {
  sku: string
  siteId: number
  asin: string
  type: number
  startDate: string
  endDate: string
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
  /** 小类排名 */
  smallRank?: number
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
}
