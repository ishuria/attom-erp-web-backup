/**
 * 新品审核列表Req
 */
export interface IReviewQueryReq {
  keyWord?: string | null
  // 当前页
  pageNo: number
  // 每页大小
  pageSize: number
}

/**
 * 新品审核列表Resp
 */
export interface IReviewQueryResp {
  data: IReviewQuery
}

export interface IReviewQuery {
  // 总记录
  total: number
  list?: IReviewQueryItem[] | null
}

export interface IReviewQueryItem {
  difference?: string
  oem?: number
  effectiveCount?:number
  po?: string
  productDesign?: string
  productManager?: string
  productName?: string
  projectInitiationDate?: string
  reviewCost?: string
  reviewDate?: string
  reviewMainId?: number
  reviewPersonName?: string
  reviewStatus?: number
  sku?: string
  skuImage?: string
  timeConsuming?: string
  totalCost?: string
  stepNo?: number
  reviewStepNo?: number
}

/**
 * 审核共通参数
 */
export interface IReviewCommonReq {
  reviewId: string
}

/**
 *  审核共通响应参数
 */
export interface IReviewCommonResp {
  data: IReviewCommonItem[]
}

export interface IReviewCommonItem {
  column0: string
  /**
   * 变体id
   */
  orderEntryId: number
  /**
   * 合并变体sku
   */
  variantSku?: string

  /**
   * SKU
   */
  sku?: string
  /**
   * 产品名称
   */
  productName?: string
  /**
   * 亚马逊US订货数量
   */
  amazonUsOrderQuantity?: number
  /**
   * 亚马逊UK订货数量
   */
  amazonUkOrderQuantity?: number
  /**
   * 亚马逊DE订货数量
   */
  amazonDeOrderQuantity?: number
  amazonCaOrderQuantity?: number
  amazonJpOrderQuantity?: number
  tiktokUsOrderQuantity?: number
  /**
   * 沃尔玛US订货数量
   */
  walmartUsOrderQuantity?: number
  vineSite?: string
  vineFlag?: number
  vineCount?: number
  /**
   * 实际产品总成本
   */
  actualTotalCost?: string
  /**
   * 包装尺寸
   */
  packagingSize?: string
  /**
   * 最终售价
   */
  finalSellingPrice?: string
  /**
   * 产品尺寸
   */
  productSize?: string
  /**
   * 毛利率
   */
  grossMarginRate?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 是否包含电池
   */
  battery?: string
  /**
   * 对标asin
   */
  benchmarkAsin?: string
  /**
   * 专利情况
   */
  patent?: string
  /**
   * 产品经理
   */
  productManager?: string
  /**
   * 产品设计
   */
  productDesign?: string
  /**
   * 拍照留样状态
   */
  /**
   * 总采购含税价
   */
  purchaseTotalPrice?: string
  /**
   * 有效计数
   */
  effectiveCount?: string
  /**
   * OEM 0不选中 1选中
   */
  oem?: number
  /**
   * 变体图片
   */
  variantImg?: string
  /**
   * 包装重量
   */
  weight?: string
  /**
   * 产品定位
   */
  productPositioning?: string
  /**
   * 平面设计
   */
  graphicDesign?: string
  quantity?: number
  [key: string]: any
}

/**
 * 开模信息返回
 */
export interface IReviewMoldResp {
  data: IReviewMoldItem[]
}

export interface IReviewMoldItem {
  /**
   * 开模id
   */
  moldId: number

  /**
   * 零件名
   */
  component: string

  /**
   * 供应商
   */
  suppliser: string

  /**
   * 状态 0 审批中 1待提交付款申请 2 已付款
   */
  status: number

  /**
   * 开模费处理方式 0不含在PO 1含在该PO 2含在其他PO
   */
  dealMethod: number

  /**
   * 开票类型 0专票 1普票 2不开票
   */
  invoiceType: number

  /**
   * 付款金额
   */
  payPrice: number
}
/**
 * 变体信息列表
 */
export interface IVariantInfoResp {
  data: IVariantInfoItem[]
}

export interface IVariantInfoItem {
  /**
   * 新品订货信息id
   */
  orderEntryId: number

  /**
   * 新品审核记录主表id
   */
  reviewMainId: number

  /**
   * 变体
   */
  variant: string

  /**
   * 0 亚马逊US
   * 1 亚马逊DE
   * 2 亚马逊UK
   * 3 沃尔玛US
   */
  site: number

  /**
   * 外币币种
   */
  currencyType: string

  /**
   * 汇率
   */
  foreignExchange: string

  /**
   * 实际产品总成本
   */
  actualTotalCost: number

  /**
   * 包装长
   */
  packagingLength: number

  /**
   * 包装宽
   */
  packagingWidth: number

  /**
   * 包装高
   */
  packagingHeight: number

  /**
   * 重量
   */
  weight: number

  /**
   * 尾程
   */
  lastMile: number

  /**
   * 头程
   */
  firstMile: number

  /**
   * 打包费用
   */
  packagingPrice: number

  /**
   * 头程渠道
   */
  firstMileChannel: number

  /**
   * 最终售价
   */
  finalSellingPrice: number

  /**
   * 毛利率
   */
  grossMarginRate: number

  /**
   * ROI
   */
  roi: number

  /**
   * 重量系数
   */
  weightCoefficient: number

  /**
   * 体积系数
   */
  volumeCoefficient: number

  /**
   * 关税
   */
  tariff: number

  /**
   * 平台佣金
   */
  platformCommission: number

  /**
   * 仓储费
   */
  storageFee: number
}

// 主管可行性审批req
export interface IReviewStepNo1Req {
  /**
   * 审核id
   */
  reviewId: string
  /**
   * 变体列表
   */
  variantList: IReviewStepNo1Variant[]
}

export interface IReviewStepNo1Variant {
  /**
   * 变体id
   */
  orderEntryId?: number

  productPosition?: number
  graphicDesign?: number

  /**
   * OEM 0不选中 1选中
   */
  oem?: number
}

export interface IReviewStepResp {
  data: boolean
}

/**
 * sku创建req
 */
export interface IReviewStep2Req {
  reviewId: string
  variantList: IReviewStep2Item[]
}

export interface IReviewStep2Item {
  orderEntryId?: number
  sku?: string
  [key: string]: any
}


export interface IReviewStepUpdateReq{
  id: number
  quantity: number
  orderEntryId: number
}
export interface IUpdateReviewStepNo3Vine {
  orderEntryId: number
  vineSite?: number
  vineCount?: number
  vineFlag?: number
}
