import type { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
// 新品订货流程-删除变体信息
export interface IreviewStepNo1Del {
  orderEntryId: number
}

export interface IvariantsList {
  variantName: string //变体名
  amazonUSVariantQuantity: number | undefined //订货数量（亚马逊US）
  orderEntryId?: number //变体id
}
// 新品订货流程-产品基础信息输入保存
export interface IreviewStepNo1SaveOn {
  progressId?: number | undefined
  variantSku?: string //合并变体sku
  productName: string //主品名
  productDesc: string //描述
  variantList: IvariantsList[] //变体列表
  reviewId?: number //审核id
}
export interface IreviewStepNo1List {
  orderEntryId?: number
  variantName?: string
  amazonUSVariantQuantity?: number
}
export interface IreviewStepNo1 {
  code: number
  msg: string
  data: {
    variantSku?: string
    productName?: string
    productDesc?: string
    variantList?: IreviewStepNo1List[]
  }
}
// 拿样零件添加列表
export interface IComponentAdd {
  // 进度id
  progressId: string
  // 零件id
  componentId?: number | null
  // 零件图片
  componentImg?: string | null
  // 零件名
  componentName?: string | null
  // 已有零件id
  skuComponentId?: number | null
  // 零件数量
  componentQuantity?: number | null
  // 零件单位
  componentUnit?: string | null
  // 出厂单价
  unitPrice?: number | null
  // 出厂总价
  totalPrice?: number | null
  // 运费（含税）
  freight?: number | null
  // 总未税价
  preTaxPrice?: number | null
  // 总含税价
  taxIncludedPrice?: number | null
  // 货币 0人民币 1USD 2EUR
  currency?: string | null
  // 供应商
  supplier?: string | null
}
// 新品订货流程-拿样零件添加-继续
export interface IreviewStepNo2Savetw {
  suppliserIds: string
  reviewId: number | undefined
}
export interface IreviewId {
  reviewId: number
}
export interface IreviewComponentId {
  reviewComponentId: number
}

export interface IReviewComponentUpdate {
  reviewComponentId: number
  invoice: number
  purchaseId: number
  customsDeclarationStatus: number
  defaultRepositoryId: number
}

export interface IreviewStepNo3ComponentUpdate {
  /**
   * 实际税点
   */
  actualTaxRate?: number
  /**
   * 零件名
   */
  componentName?: string
  /**
   * 零件单位
   */
  componentUnit?: string
  /**
   * 货币 0RMB 1USD 2EUR
   */
  currency?: number
  /**
   * 运费（含税）
   */
  freight?: number
  /**
   * 0专票 1普票 2无法开票
   */
  invoicing?: number
  /**
   * 开票税点
   */
  invoicingTaxRate?: number
  /**
   * 起订量
   */
  minimumOrderQuantity?: number
  /**
   * 整箱数
   */
  numberFullCartons?: number
  /**
   * 详情id
   */
  orderEntryId?: number
  /**
   * 总价未税价
   */
  preTaxPrice?: number
  /**
   * 采购链接
   */
  purchaseLink?: string
  /**
   * 数量
   */
  quantity?: number
  /**
   * 审核零件表
   */
  reviewComponentId?: number
  /**
   * 供应商
   */
  supplier?: string
  /**
   * 总含税价
   */
  taxIncludedPrice?: number
  /**
   * 出厂总价
   */
  totalPrice?: number
  /**
   * 出厂单价
   */
  unitPrice?: number
  /**
   * 变体
   */
  variant?: string
}
export interface IreviewStepNo3ComponentListResp {
  code: number
  data: IreviewStepNo3ComponentList[]
  msg: string
}
export interface IreviewStepNo3ComponentList {
  hide?: boolean
  /**
   * 实际税点
   */
  actualTaxRate?: string
  /**
   * 零件图片地址
   */
  componentImgUrl?: string | any
  /**
   * 零件名
   */
  componentName?: string
  /**
   * 零件单位
   */
  componentUnit?: string
  /**
   * 合同条款
   */
  contractTerms?: string
  /**
   * 货币 0RMB 1USD 2EUR
   */
  currency?: number | null
  /**
   * 运费（含税）
   */
  freight?: string
  /**
   * 0专票 1普票 2无法开票
   */
  invoicing?: number | null
  /**
   * 开票税点
   */
  invoicingTaxRate?: string
  /**
   * 起订量
   */
  minimumOrderQuantity?: number | null
  /**
   * 整箱数
   */
  numberFullCartons?: number | null
  /**
   * 变体d
   */
  orderEntryId?: number | null
  /**
   * 总价未税价
   */
  preTaxPrice?: string
  /**
   * 采购链接
   */
  purchaseLink?: string
  /**
   * 零件采购注意事项
   */
  purchaseMatters?: string
  /**
   * 数量
   */
  quantity?: number | null
  /**
   * 零件id
   */
  reviewComponentId?: number | null
  /**
   * 审核id
   */
  reviewId?: number | null
  /**
   * 供应商
   */
  supplier?: string
  /**
   * 总含税价
   */
  taxIncludedPrice?: string
  /**
   * 出厂总价
   */
  totalPrice?: string
  /**
   * 出厂单价
   */
  unitPrice?: string
  /**
   * 零件所属变体
   */
  variant?: string
  cropData?: string
  /**
   * 零件明细
   */
  componentSuitDetail?: string
}
// 新品订货流程-零件信息完善与售价核对-修改零件采购注意事项
export interface IreviewStepNo3UpdatePurchaseMatters {
  reviewComponentId: number
  purchaseMatters: string
}
// 新品订货流程-零件信息完善与售价核对-修改零件合同条款
export interface IreviewStepNo3UpdateContractTerms {
  reviewComponentId: number
  contractTerms: string
}
// 下拉变体列表类型
export interface IGetSelectVariantsList {
  id: number
  label: string
}
export interface IreviewStepNo3VariantListResp {
  code: number
  data: IreviewStepNo3VariantList[]
  msg: string
}
// 新品订货流程-零件信息完善与售价核对-查询变体列表信息
export interface IreviewStepNo3VariantList {
  /**
   * 实际产品总成本
   */
  actualTotalCost: null
  /**
   * 外币币种
   */
  currencyType: string
  /**
   * 最终售价
   */
  finalSellingPrice: null
  /**
   * 头程
   */
  firstMile: null
  /**
   * 头程渠道
   */
  firstMileChannel: number
  /**
   * 汇率
   */
  foreignExchange: string
  /**
   * 毛利率
   */
  grossMarginRate: null
  /**
   * 尾程
   */
  lastMile: null
  /**
   * 变体id
   */
  orderEntryId: number
  /**
   * 包装高
   */
  packagingHeight: null
  /**
   * 包装长
   */
  packagingLength: null
  /**
   * 打包费用
   */
  packagingPrice: null
  /**
   * 包装宽
   */
  packagingWidth: null
  /**
   * 平台佣金
   */
  platformCommission: null
  /**
   * 审核id
   */
  reviewMainId: number
  /**
   * ROI
   */
  roi: null
  /**
   * 站点 ，0 亚马逊US 1 亚马逊DE 2 亚马逊UK  3 沃尔玛US
   */
  site: number
  /**
   * storageFee
   */
  storageFee: null
  /**
   * 关税
   */
  tariff: null
  /** 关税金额 */
  tariffPrice?: string
  /** 币种符号 */
  symbol?: string
  /**
   * 变体
   */
  variant: string
  /**
   * 体积系数
   */
  volumeCoefficient: null
  /**
   * 重量
   */
  weight: null
  /**
   * 重量系数
   */
  weightCoefficient: null
  hts: { label: string; id: number; value?: number }
}
// 新品订货流程-零件信息完善与售价核对-更新变体信息
export interface IreviewStepNo3VariantUpdate {
  /**
   * 外币币种
   */
  currencyType?: string
  /**
   * 最终售价
   */
  finalSellingPrice?: number
  /**
   * 头程渠道
   */
  firstMileChannel?: number
  /**
   * 汇率
   */
  foreignExchange?: string
  /**
   * 包装高
   */
  packagingHeight?: number
  /**
   * 包装长
   */
  packagingLength?: number
  /**
   * 打包费用
   */
  packagingPrice?: number
  /**
   * 包装宽
   */
  packagingWidth?: number
  /**
   * 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3 沃尔玛US
   */
  site?: number
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
  variant?: string
  orderEntryId?: number
  /**
   * 实际总成本
   */
  actualTotalCost?: number
  [key: string]: any
}
// 完善新供应商信息与打包质检清单 - 查询质检清单列表
export interface IreviewStepNo4ListQualityInspectionResp {
  code: number
  data: IreviewStepNo4ListQualityInspection[]
  msg: string
}
// 新品订货流程-完善新供应商信息与打包质检清单-查询新添加的供应商信息
export interface IreviewStepNo4SupplierList {
  /**
   * 开户账号
   */
  accountNumber?: string
  /**
   * 地址
   */
  address?: string
  /**
   * 开户银行
   */
  bank?: string
  /**
   * 联行号
   */
  bankRoutingNumber?: string
  /**
   * 零件id
   */
  componentId?: number
  contactNumber?: string
  contactPerson?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * reviewId
   */
  reviewId?: number
  /**
   * 供应商名
   */
  suppliser?: string
  /**
   * 税号
   */
  taxNumber?: string
  /**
   * 开票电话
   */
  telephone?: string
}
export interface IreviewStepNo4SupplierListResp {
  code: number
  msg: string
  data: IreviewStepNo4SupplierList[]
}
export interface IreviewStepNo4ListQualityInspection {
  checkType?: number //0全检 1抽检5% 2抽检10% 3抽检15% 4抽检20% 5注意事项
  packingPrecautions?: string
  qualityInspectionId?: number
  variant?: string
  variantId?: number
  requirePhoto?: number
}
// 新品订货流程-完善新供应商信息与打包质检清单-删除
export interface IqualityInspectionId {
  qualityInspectionId: number //质检清单id
}
export interface IreviewStepNo4DelQualityInspectionResp {
  code: number
  msg: string
  data: boolean
}
//新品订货流程-完善新供应商信息与打包质检清单 -质检项目清单修改
export interface IreviewStepNo4UpdateQualityInspection {
  checkType: number //0全检 1抽检5% 2抽检10% 3抽检15% 4抽检20% 5注意事项
  packingPrecautions: string
  qualityInspectionId: number
  variant: string
  variantId: number
  requirePhoto?: number
}
// 新品订货流程-完善sku信息 -变体信息修改
export interface IreviewStepNo5SkuInfoPerfect {
  /**
   * 是否包含电池 0 不包含 1包含
   */
  battery?: string
  /**
   * 对标asin
   */
  benchmarkAsin?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 变体id
   */
  orderEntryId?: number
  /**
   * 专利情况
   */
  patent?: string
  /**
   * 产品设计
   */
  productDesignId?: number
  /**
   * 产品高
   */
  productHeight?: number
  /**
   * 产品长
   */
  productLength?: number
  /**
   * 产品经理
   */
  productManagerId?: number
  /**
   * 产品宽
   */
  productWidth?: number
  /**
   * 是否带磁 0 不带磁 1带磁
   */
  magnetic?: number
  /**
   * 拍照留样状态
   */
  sampleRetentionStatus?: number
  checkStatus?: number
  /**
   * 是否木制品 0 不是 1是
   */
  woodenProduct?: number
  /**
   * 是否玩具 0 不是 1是
   */
  toy?: number
  /**
   * 是否季节性 0 不是 1是
   */
  seasonal?: number
}
// 新品订货流程- 检查提交审核信息 - 保存
export interface IreviewStepNo6SaveSix {
  reviewId: number
  reviewPersonId: string
}
// 新品订货流程-完善新供应商信息与打包质检清单-更新供应商信息
export interface IreviewStepNo4UpdateSupplier {
  /**
   * 开户账号
   */
  accountNumber?: string
  /**
   * 地址
   */
  address?: string
  /**
   * 开户银行
   */
  bank?: string
  /**
   * 开户账号
   */
  bankRoutingNumber?: string
  /**
   * 联系电话
   */
  contactNumber?: string
  /**
   * 联系人
   */
  contactPerson?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 税号
   */
  taxNumber?: string
  /**
   * 开票电话
   */
  telephone?: string
  [property: string]: any
}

export interface IreviewSkuInfo {
  sku: string
}
export interface IreviewInsertSkuInfoResp {
  code: number
  msg: string
  data: IreviewInsertSkuInfo
}
export interface IreviewInsertSkuInfo {
  productLength?: number
  productWidth?: number
  productHeight?: number
  material?: string
  battery?: string
  benchmarkAsin?: string
  magnetic?: number
  woodenProduct?: number
  toy?: number
  seasonal?: number
}

export interface ISubmitReviewComponentQuery {
  reviewId: number
  list: ISubmitPurchaseComponent[]
}

export interface ISubmitReviewConsumableQuery {
  reviewId: number
  list: ISubmitPurchaseConsumable[]
}

export interface IOperationDistributionList {
  operationUserId: number
  siteName: string
}
