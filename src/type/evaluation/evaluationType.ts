
/**
 * 新款评估
 */
export interface IEvaluation{
    // id
    idNo:number
    // 评估人
    evaluatorName:string 
    // 评估日期
    evaluateDate:string 
    // 产品中文名称
    productNameZh:string 
    // 亚马逊后台关键词
    amazonBackendKeywords:string
    // 亚马逊前台关键词
    amazonFrontendKeywords:string 
    // 市场容量
    marketVolume:string 
    // 头部个数
    productsCount:string 
    // cpc
    cpc:string 
    // 30毛利盈亏自然单
    grossProfitAndLoss:string 
    // 平均转化
    avgConversionRate:string 
    // 首页平均平均销售额
    avgSales:string 
    // 供求评分
    supplyScore:string 
    // 亚马逊listing数量
    amazonListingQuantity:string 
    // 平均销售价
    averageSellingPrice:string 
    // 90天搜索量
    searchVolume90Days:string 
    // 360天销售
    averageSales360Days:string 
    // 关键词评分
    keyWordScore:string
    // 产品来源
    productSource:string 
    // 关键词趋势
    trendList:IKeyWordTrend
    // 竞争度
    competitiveness:string 
    // 首页销售额偏离度
    salseDeviation:string 
    // 平均上架距今天日期
    avgDaysListed:string 
    // 总分
    finalScore:string 
}

/**
 * 关键词趋势
 */
export interface IKeyWordTrend{
    // x轴数据
    xAxis:string[]
    // y轴数据
    yAxis:number[]
}

/**
 * 产品成本核算与推进
 */
export interface IEstimatedCostAccounting{
    // id
    id:number,
    // 日期
    createTime:string,
    // 站点
    site:string,
    // 图片地址
    imgUrl:string,
    // 产品描述
    desc:string,
    // 价格信息
    priceInfo:string,
    // 1688连接
    url1688:string,
    // 价格信息
    price: number,
    // 长
    length:number,
    // 宽
    width:number,
    // 高
    height:number,
    // 重量
    weight:number,
    // 尾程
    lastMile:number,
    // 头程
    firstMile:number,
    // 打包
    packaging:number,
    // 头程渠道
    firstMileChannel:string,
    // 售价
    sellingPrice:number,
    // 毛利率
    grossMarginRate:number,
    // ROI
    roi:number,
    // weightCoefficient
    weightCoefficient:number,
    // volumeCoefficient
    volumeCoefficient:number,
    // 关税
    tariff:number,
    // 平台佣金
    platformCommission:number,
    // 仓储费
    storageFee:number
}

/**
 * 共享
 */
export interface IShared{
    // 用户id
    userId:number
    // 用户姓名
    userName:string
    // 是否共享
    isShare:boolean
}

/**
 * 新款评估评分参数
 */
export interface IEvaluationScore {
    key:string
    value:number
}

/**
 * 跑分明细
 */
export interface IBenchmarkScore {
    // 描述
    desc:string
    // 数量
    quantity:string
    // 分数
    score:string
}

/**
 * 成本核算默认参数
 */
export interface ICostAccounting {
    rateMargin: string
    rateRoi: string
    tariffRatio: string
    extraFulfillment: string
    exchangeRate: string
    volumeFactor: string
    weightFactor: string
    shippingType: string
    savePrice: string
    laborCost: string
    oceanShipping: string
    airTransport: string
    volumeRate: string
    weightRate: string
    fuelCost: string
}

// evaluation请求规范定义

export interface IEvaluationQueryReq {
    pageNo:number
    pageSize:number
    keyWord:string
}

export interface IEvaluationKeyWordTrendReq {
    keyWord:string
    type:number
}


export interface IEvaluationSharePersonReq {
    evaluationId:string
    userId:string
    type:number
}


export interface IEstimatedCostAccountingQueryReq {
    evaluationId:string
}