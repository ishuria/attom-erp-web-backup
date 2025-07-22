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
