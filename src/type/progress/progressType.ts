/**
 * 新品进度参数类型
 */
export interface IProgressQueryReq {
    pageNo: number
    pageSize: number
    productKeyWord?: string
    status: number
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
    priority: number
    // 示例图片列表
    imageList: ImageList[]
    // 产品名
    product: string 
    // OEM
    oem: string 
    // 立项日期
    createTime: string
    // 当前阶段
    currentPhaseStatus: string 
    // 产品推进日志
    progressLog: string 
    // 备注
    remark: string 
    // 目标月销
    targetMonthlySales: string 
    // 参与人员
    sharerName: string 
    // 进度id
    progressId: number
    // 新款评估编号
    evaluationId?: string
    // 控添加图片样式隐藏显示 
    hide?: boolean
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
export interface ProgressImgSort {
    array: number[]
}
/**
 * 修改共享人查询参数
 */
export interface ISharelistQueryReq {
    progressId: number
    userId: string
    type: string
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
    componentName: string
    supplierName: string
    progressId: number
    productName: string
    excludingTax: number
    standardInvoice: number
    specialInvoice: number
    purchaseTotal: number
    audit: string
}
/**
 * 新品进度-开模进度审核
 */
export interface IProgressMoldUpdateQueryReq {
    // 开模id
    moldId: number
    // 开模费处理方式 0 审批中 1待提交付款申请 2 已付款
    dealMethod: number
    // 开票类型 0专票 1普票 2不开票
    type: number
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
     /**
      * 产品价格
      */
     price: number
     /**
      * 价格信息
      */
     priceInfo: string
     /**
      * 新款进度id
      */
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
 * 成本核算-图片上传
 */
export interface IProgressCostAccountingUpload {
    file: any
    type: string //默认填2
    accountingId: number //正式成本核算id
}
/**
 * 零件清单-根据新品进度id查询零件列表
 */
export interface IProgressComponentList {
    progressId: number
    keyWord: string 
    pageNo: number 
    pageSize: number
}
export interface IProgressComponentUpdate {
    /**
     * 实际税点
     */
    actualTaxRate?: number;
    /**
     * 零件id
     */
    componentId?: number;
    /**
     * 零件图片
     */
    componentImg?: string;
    /**
     * 零件名
     */
    componentName?: string;
    /**
     * 零件数量
     */
    componentQuantity?: number;
    /**
     * 零件单位
     */
    componentUnit?: string;
    /**
     * 货币
     */
    currency?: string;
    /**
     * 运费（含税）
     */
    freight?: number;
    /**
     * 0计入成本  1不计入成本
     */
    includedInCost?: number;
    /**
     * 0专票 1普票
     */
    invoicing?: string;
    /**
     * 开票税点
     */
    invoicingTaxRate?: number;
    /**
     * 总价未税价
     */
    preTaxPrice?: number;
    /**
     * 进度id
     */
    progressId?: number;
    /**
     * 采购链接
     */
    purchaseLink?: string;
    /**
     * 备注
     */
    remarks?: string;
    /**
     * 供应商
     */
    supplier?: string;
    /**
     * 供应商id
     */
    supplierId?: number;
    /**
     * 总含税价
     */
    taxIncludedPrice?: number;
    /**
     * 出厂总价
     */
    totalPrice?: number;
    /**
     * 出厂单价
     */
    unitPrice?: number;
}
/**
 * 零件清单-复制
 */
export interface IProgressComponentAndSuppliserCopy {
    componentId: number
    supplierIds: string
}
export interface IProgressAddSample {
    /**
     * 大货可退金额
     */
    bulkGoodsReturnable?: string;
    /**
     * 零件id
     */
    componentId?: number;
    /**
     * 零件名
     */
    componentName?: string;
    /**
     * 物流单号（非1688订单号）
     */
    logisticsNo?: string;
    /**
     * 1688订单号
     */
    orderNo1688?: string;
    /**
     * 拿样金额
     */
    price?: string;
    /**
     * 进度id
     */
    progressId?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 供应商名称
     */
    supplierName?: string;
}
export interface IProgressSampleUpdate {
    sampleId: number
    order1688No: string
    logisticsNo: string
}