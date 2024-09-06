/**
 * 新品进度-获取新品进度管理列表
 */
export interface IProgressQueryReq {
  pageNo: number
  pageSize: number
  productKeyWord?: string
  status: number
}
/**
 * 新品进度-获取共享人列表, 新品进度-查询开发日志
 */
export interface IProgressId {
    progressId: number
}
export interface IShareListResp {
    data: IProgressShared[]
}
export interface IProgressShared {
    roleName: string
    share: boolean
    userID: number
    userName: string
}
// 筛选共享人
export interface ISelectShare {
    label: string
    value: string
}
// 新品进度-参与人员筛选
export interface ISharePersonReq {
    userNameList: string[]
    status: number
    pageNo: number
    pageSize: number
}
/**
 * 评估id
 */
export interface IIdNo {
    idNo: number
}
export interface IComponentId {
    componentId: number
}
/**
 * 每个图片的类型
 */
export interface ImageList {
  imageId?: number
  imageUrl?: string
  url?: string
  name?: number
  uid?: number
}
/**
 * 新品进度类型
 */
export interface IProgress {
  // 优先级
  priority?: number
  // 示例图片列表
  imageList?: ImageList[]
  // 产品名
  product?: string
  // OEM
  oem?: string
  // 立项日期
  createTime?: string
  // 当前阶段
  currentPhaseStatus?: string
  // 产品推进日志
  progressLog?: string
  // 备注
  remark?: string
  // 目标月销
  targetMonthlySales?: string
  // 参与人员
  sharerName?: string
  // 进度id
  progressId?: number
  // 新款评估编号
  evaluationId?: string
  // 控添加图片样式隐藏显示
  hide?: boolean
}
export interface IProgressFilterResp {
    data: {
        list: IProgress[]
        total: number
    }
}
/**
 * 图片上传参数类型
 */
export interface IImageQueryReq {
  file: any
  type: string
  progressId: number
}
/**
 * 图片删除参数类型
 */
export interface IDelImgQueryReq {
  type: string
  imageId: number
}
export interface IProgressImgSort {
  array: number[]
}
/**
 * 修改共享人查询参数
 */
export interface ISharelistQueryReq {
    progressId?: number
    userId?: string // 共享人id
    type?: string //类型 0 增加 1移除
}
/**
 * 样品进度查询参数
 */
export interface ISampleListQueryReq {
    keyWord: string
    pageNo: number
    pageSize: number
}
/**
 * 新品进度-开模申请
 */
export interface IProgressMoldAddQueryReq {
    componentName: string // 零件名
    supplierName: string // 供应商全名
    progressId: number // 进度id
    productName: string // 产品名
    excludingTax: number // 模具费不含税
    standardInvoice?: number //模具费普票税点
    specialInvoice?: number //模具费专票税点
    purchaseTotal: number //预估采购货值
    audit: string //审核人
}
/**
 * 新品进度-开模进度审核
 */
export interface IProgressMoldUpdateQueryReq {
    // 开模id
    moldId?: number
    // 开模费处理方式 0 审批中 1待提交付款申请 2 已付款
    dealMethod?: number
    // 开票类型 0专票 1普票 2不开票
    type?: number
}
/**
 * 成本核算-添加成本核算
 */
export interface IProgressCostAccountingAdd {
    progressId: number //新品进度id
    sort: number //排序
}
/**
 * 成本核算-修改产品成本核算
 */
export interface IProgressCostAccountingUpdate {
     // 新品进度-成本核算表主键
     accountingId: number
     // 外币币种
     currencyType: string
     // 产品描述
     desc: string
     // 头程
     firstMile: number
     // 头程渠道
     firstMileChannel: string
     // 汇率
     foreignExchange: string
     // 毛利率
     grossMarginRate: number
     // 高
     height: number
     // 尾程
     lastMile: number
     // 长
     length: number
     // 打包
     packaging: number
     // 平台佣金
     platformCommission: number
     // 产品价格
     price: number
     // 价格信息
     priceInfo: string
     // 新款进度id
     progressId: number
     // ROI
     roi: number;
     // 售价
     sellingPrice: number
     // 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3 沃尔玛US
     site: string
     // 仓储费
     storageFee: number
     // 关税
     tariff: number
     // 1688链接
     url1688: string
     // 体积系数
     volumeCoefficient: number
     // 重量
     weight: number
     // 重量系数
     weightCoefficient: number
     // 宽
     width: number
}
/**
 * 成本核算-图片上传参数类型
 */
export interface IProgressCostAccountingUpload {
    file: any
    type: string //默认填2
    accountingId: number //正式成本核算id
}
/**
 * 成本核算-图片上传返回类型
 */
export interface IProgressCostAccountingUploadResp {
    data: string
}
/**
 * 零件清单-根据新品进度id查询零件列表
 */
export interface IProgressComponentList {
    progressId: number
    keyWord?: string 
    pageNo: number 
    pageSize: number
}
export interface IProgressComponentUpdate {
    //实际税点
    actualTaxRate?: number;
    //零件id
    componentId?: number;
    //零件图片
    componentImg?: string;
    //零件名
    componentName?: string;
    // 零件数量
    componentQuantity?: number;
    //零件单位
    componentUnit?: string;
    //货币
    currency?: string;
    //运费（含税）
    freight?: number;
    //0计入成本  1不计入成本
    includedInCost?: number;
    //0专票 1普票
    invoicing?: string;
    //开票税点
    invoicingTaxRate?: number;
    //总价未税价
    preTaxPrice?: number;
    //进度id
    progressId?: number;
    //采购链接
    purchaseLink?: string;
    //备注
    remarks?: string;
    //供应商
    supplier?: string;
    //供应商id
    supplierId?: number;
    //总含税价
    taxIncludedPrice?: number;
    //出厂总价
    totalPrice?: number;
    //出厂单价
    unitPrice?: number;
}
/**
 * 零件清单-复制
 */
export interface IProgressComponentAndSuppliserCopy {
    componentId: number
    supplierIds: string //供应商ids 逗号,分割
}
/**
 * 零件清单-拿样
 */
export interface IProgressAddSample {
    // 大货可退金额
    bulkGoodsReturnable?: string;
    // 零件id
    componentId?: number;
    // 零件名
    componentName?: string;
    // 物流单号（非1688订单号）
    logisticsNo?: string;
    // 1688订单号
    orderNo1688?: string;
    // 拿样金额
    price?: string;
    // 进度id
    progressId?: number;
    // 备注
    remark?: string;
    // 供应商名称
    supplierName?: string;
}
export interface IProgressSampleUpdate {
    sampleId: number
    order1688No?: string //1688订单号
    logisticsNo?: string //物流单号
}
export interface IAccountingId {
    // 新品进度产品成本核算id
    accountingId: number
}
export interface ISupplierId {
    suppliserId: number
}
export interface ISampleId {
    sampleId: number
}
// 根据id查询新款评估信息返回类型
export interface IGetByIdQueryEvaluationResp {
    data: IGetByIdQueryEvaluation
}
// 新款评估信息类型
export interface IGetByIdQueryEvaluation {
    /**
     * 亚马逊后台关键词
     */
    amazonBackendKeywords?: string;
    /**
     * 亚马逊前台关键词
     */
    amazonFrontendKeywords?: string;
    /**
     * 供求评分
     */
    amazonListingQuantity?: string;
    /**
     * 360天销售
     */
    averageSales360Days?: string;
    averageSellingPrice?: string;
    /**
     * 平均转化
     */
    avgConversionRate?: string;
    /**
     * 平均上架距今天日期
     */
    avgDaysListed?: string;
    /**
     * 首页平均平均销售额
     */
    avgSales?: string;
    /**
     * 竞争度
     */
    competitiveness?: string;
    /**
     * cpc
     */
    cpc?: string;
    /**
     * 评估日期
     */
    evaluateDate?: string;
    /**
     * 评估人
     */
    evaluatorName?: string;
    /**
     * 总分
     */
    finalScore?: string;
    /**
     * 30毛利盈亏自然单
     */
    grossProfitAndLoss?: string;
    idNo?: number;
    /**
     * 关键词评分
     */
    keyWordScore?: string;
    /**
     * 市场容量
     */
    marketVolume?: string;
    /**
     * 产品中文名称
     */
    productNameZh?: string;
    /**
     * 头部个数
     */
    productsCount?: number;
    /**
     * 产品来源
     */
    productSource?: string;
    /**
     * 首页销售额偏离度
     */
    salseDeviation?: string;
    /**
     * 90天搜索量
     */
    searchVolume90Days?: string;
    /**
     * 供求评分
     */
    supplyScore?: string;
    // 关键词趋势
    trendList?: Object;
    userId?: string;
}
// 获取样品进度返回类型
export interface ISampleListResp {
    data: {
        total: number,
        list: ISampleList[]
    }
}
// 样品进度类型
export interface ISampleList {
    // 大货可退金额
    bulkGoodsReturnable?: string;
    /**
     * 样品/零件图片
     */
    componentImg?: string;
    /**
     * 零件名称
     */
    componentName?: string;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 物流信息
     */
    logisticsMessage?: string;
    /**
     * 物流订单号
     */
    logisticsNo?: string;
    /**
     * 1688订单
     */
    orderNo1688?: string;
    /**
     * 金额
     */
    price?: string;
    /**
     * 产品名
     */
    productName?: string;
    /**
     * 签收时间
     */
    receiptDate?: string;
    /**
     * 样品id
     */
    sampleId?: number;
    /**
     * 供应商
     */
    supplier?: string;
}
// 新品进度-开模进度列表返回类型
export interface IProgressMoldListResp {
    data: {
        total: number,
        list: IProgressMoldList[]
    }
}
export interface IProgressMoldList {
    moldId: number // 开模id
    componentName: string // 零件名
    supplierName: string // 供应商全名
    productName: string // 产品名
    excludingTax: number // 模具费不含税
    standardInvoice: number // 模具费普票税点
    specialInvoice: number // 模具费专票税点
    purchaseTotal: number //预估采购货值
    audit: string //审核人
    status: number // 状态 0 审批中 1待提交付款申请 2 已付款
    dealMethod: number // 开模费处理方式 0不含在PO 1含在该PO 2含在其他PO
    invoiceType: number // 开票类型
    payPrice: string // 付款金额
    createTime: string //创建时间 提交日期
}
export interface IProgressMoldUpdateResp {
    data: {
        moldId: number
        status: number
        payPrice: number
    }
}
export interface IProgressCostAccountingUpdateResp {
    data: boolean
}
// 成本核算-成本核算推进复制返回类型
export interface IProgressCostAccountingCopyResp {
    data: boolean
}
// 样品进度-手动签收返回类型
export interface IProgressSampleReceiptResp {
    data: {
        sampleId: number
        receiptDate: string
    }
}