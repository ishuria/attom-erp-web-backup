// 采购计划-获取采购计划PlanPo
export interface IGetPlanPoListQuery {
  keyWord: string
  status: number //po状态 0待发布 1未达起订量
  pageNo: number
  pageSize: number
  customsStatus: number //报关状态 -1全部 0报关 1不报关
  procurementManager?: any
  procurementManagerId?: number
}
// 采购计划-获取采购计划PlanPo返回值
export interface IGetPlanPoListResp {
  code: number
  msg: string
  data: {
    total: number
    list: IGetPlanPoList[]
  }
}
export interface IGetPlanPoList {
  // plan po
  id: number
  // 计划POSkuId
  poSkuId: number
  // 创建日期
  createTime: string
  // 请购人
  userName: string
  // 站点编号
  siteId: number
  // 站点名 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3亚马逊CA 4 沃尔玛US
  siteName: string
  // sku图片地址
  skuImageUrl: string
  // SKU
  sku: string
  // 采购sku数量
  purchaseSkuNumber: number
  // 零件名
  componentName: string
  // 零件采购数量
  purchaseCount: string
  // 单位
  unit: string
  // 含税价
  taxIncludedPrice: string
  // 币种 0 RMB 1 USD 2 EUR
  currency: number
  // 供应商名称
  suppliser: string
  // 采购方
  purchase: string
  // 报关状态 0报关 1不报关
  customsDeclarationStatus: number
}
// 查询po sku 零件采购注意事项
export interface IId {
  id: number
}
// 更新po sku 零件采购注意事项
export interface IUpdatePoPurchaseMatters {
  id: number
  purchaseMatters: string
}
// 更新po sku 零件采购合同条款
export interface IUpdatePoContractTerms {
  id: number
  contractTerms: string
}
// 采购计划-批量删除
export interface IIds {
  ids: string
}
// 采购计划-详情PO数据获取返回值
export interface IGetPoDetailResp {
  code: number
  msg: string
  data: {
    id: number
    sku: string
    productName: string
    createTime: string
    productManager: string
    site: number
    repositoryId: number
    orderTotalPrice: number
    minQuantity: number
    numCartons: number
    packedTenRecord: string
    skuRemarks: string
    poRemarks: string
  }
}
export interface IPoSkuId {
  poSkuId: number
}
export interface IGetPoSkuComponentList {
  // 实际税点
  actualTaxRate: number
  // 零件名
  componentName: string
  // 零件图片地址
  componentUrl: string
  // 合同条款
  contractTerms: string
  // 币种 0RMB 1USD 2EUR
  currency: number
  // 报关状态 0 报关 1不报关
  customsDeclarationStatus: number
  // 已有零件id
  existingPartsListId: number
  // 含税运费
  freight: string
  // id
  id: number
  // 开票类型 0专票 1普票 2不开票
  invoicing: number
  // 开票税点
  invoicingTaxRate: number
  // 起订量
  minQuantity: number
  // 模具费
  moldCost: string
  // 多订数量
  moreCount: null
  // 整箱数
  numCartons: number
  // 订单号
  orderNo: string
  // po sku的id
  poSkuId: number
  // 总未税价
  preTaxPrice: string
  // 零件订货总数
  purchaseCount: number
  // 采购方id
  purchaseId: number
  // 采购链接
  purchaseLink: string
  purchaseMatters: string
  // 收货仓库id
  repositoryId: number
  // 已有库存
  stock: string
  // 总含税价
  taxIncludedPrice: string
  // 出厂总价
  totalPrice: string
  // 单位
  unit: string
  // 出厂单价
  unitPrice: string
  // 使用已有库存数量
  useStockCount: number
  suppliserId: number
  suppliserList: any
}
export interface IGetPoSkuComponentListResp {
  code: number
  msg: string
  data: IGetPoSkuComponentList[]
}

export interface IRepositoryOption {
  id: number
  label: string
}
export interface IPurchaseOption {
  id: number
  label: string
  type: number
}
export interface ISupplierId {
  suppliserId: number
}
export interface IGetSupplierRateResp {
  code: number
  msg: string
  data: {
    suppliserId: number
    actualZTaxRate: number
    invoicingZTaxRate: number
    actualPTaxRate: number
    invoicingPTaxRate: number
  }
}
// 采购计划-po sku 零件修改
export interface IUpdatePoSkuComponent {
  componentName?: string
  currency?: number
  customsDeclarationStatus?: number
  freight?: number
  id?: number
  invoicing?: number
  minQuantity?: number
  moldCost?: number
  moreCount?: number
  numCartons?: number
  orderNo?: string
  purchaseCount?: number
  purchaseId?: number
  purchaseLink?: string
  repositoryId?: number
  suppliserId?: number
  taxIncludedPrice?: number
  totalPrice?: number
  unit?: string
  unitPrice?: number
  useStockCount?: number
  [property: string]: any
}

// 采购计划-po sku 零件修改
export interface IUpdatePoSkuComponentSuppliser {
  /**
   * Po的ID
   */
  poId: number
  /**
   * Po SKU的ID
   */
  poSkuId: number
  /**
   * Po Sku 零件的ID
   */
  poSkuComponentId: number
  /**
   * 已有零件的ID
   */
  existAlreadyComponentId: number
  /**
   * 供应商的ID
   */
  suppliserId: number

  /**
   * 开票类型
   */
  invoicing: number
}

export interface IUpdateSkuDetail {
  // poSKU的Id
  poSkuId?: number
  // sku的采购套数
  skuPurchaseCount?: number
  productName?: string
  // 收货仓库的id
  repositoryId?: number
}
// 采购PO的站点更新
export interface IUpdatePoSite {
  id: number
  site: number
}
// 采购PO的备注更新
export interface IUpdatePoRemarks {
  id: number
  remarks: string
}
export interface IUpdateSkuImgQuery {
  poSkuId: number
  file: File
}

export interface IBooleanResp {
  data?: boolean
}
export interface IStringResp {
  data?: string
}
// PO详情SKU订货套数更新
export interface IUpdateSkuCount {
  poId: number
  poSkuId: number
  count: number
}
export interface IPoIds {
  poIds: string
}
export interface IPoSkuComponentId {
  poSkuComponentId: number
}
// 采购方和不报关更新
export interface IUpdateBuyerAndCustomsDeclaration {
  poSkuId: number
  // 更新的类型。更新当前SKU下零件的采购方 0。更新零件的采购方 1。两种都选 0,1
  type: string
}
// 删除PlanPo
export interface IPoId {
  poId: number
}
export interface ISku {
  sku: string
}
// 创建PlanPO（采购计划）
export interface ICreatePlanPoResp {
  data?: {
    poSkuDetail: {
      id?: number
      poSkuId?: number
      sku?: string
      skuImgUrl?: string
      productName?: string
      createTime?: string
      productManager?: string
      site?: number
      repositoryId?: number
      orderTotalPrice?: number
      minQuantity?: number
      numCartons?: number
      packedTenRecord?: string
      skuRemarks?: string
      poRemarks?: string
    }
    componentList: IGetPoSkuComponentList[]
  }
}
export interface ICreatePlanPoComponentList {
  actualTaxRate?: number

  componentName?: string

  componentUrl?: string

  contractTerms?: string

  currency?: number

  customsDeclarationStatus?: number

  existingPartsListId?: number

  freight?: string

  id?: number

  invoicing?: number

  invoicingTaxRate?: number

  minQuantity?: number

  moldCost?: string

  moreCount?: number

  numCartons?: number

  orderNo?: string
  poSkuId?: number

  preTaxPrice?: string

  purchaseCount?: number

  purchaseId?: number

  purchaseLink?: string

  purchaseMatters?: string

  repositoryId?: number

  stock?: number

  suppliserId?: number

  suppliserList?: SuppliserList[]

  taxIncludedPrice?: string

  totalPrice?: string

  unit?: string

  unitPrice?: string

  useStockCount?: number
}
export interface SuppliserList {
  id?: number
  label?: string
  [property: string]: any
}
//采购订单-查询列表
export interface IGetPoListQuery {
  keyWord: string
  // po状态 2待付款 3部分付款 4已付全款 5超额付款 6已完结 7已删除
  status: number
  pageNo: number
  pageSize: number
  customsStatus?: number
  procurementManagerId?: number
}
export interface IGetPoList {
  componentId?: number

  componentName?: string

  releaseDate?: string

  currency?: number

  customsDeclarationStatus?: number
  // plan po
  id?: number
  // 已付款金额
  payPrice?: string
  // 付款记录
  payRecordList?: PayRecordList[]
  // POSkuId
  poSkuId?: number
  // 采购方名称
  purchase?: string
  // 零件采购数量
  purchaseCount?: number
  // 采购方id
  purchaseId?: number
  // 零件采购注意事项
  purchaseMatters?: string
  // 采购sku数量
  purchaseSkuNumber?: number
  siteId?: number
  // 站点名 0 亚马逊US 1 亚马逊DE 2 亚马逊UK  3亚马逊CA  4 沃尔玛US
  siteName?: string

  sku?: string

  skuImageUrl?: string
  // 供应商名称
  suppliser?: string

  taxIncludedPrice?: string

  unit?: string
  // 请够人/发布人
  userName?: string
}
export interface PayRecordList {
  // 付款记录id
  id?: number
  // 付款金额
  payPrice?: string
  // 付款人
  payUserName?: string
  // 百分比
  percentage?: string
  // 退款凭证 默认为图片
  refundVoucher?: string
  // 类型 0付款 1退款
  type?: number
  [property: string]: any
}
export interface IGetPoListResp {
  data?: {
    total: number
    list: IGetPoList[]
  }
}
// 采购订单-已付全款/尾款
export interface IUpdateComponentAllPay {
  componentIds: string
  poIds: string
}
// 零件付款记录详情
export interface IGetComponentPayList {
  createTime?: string
  createUser?: string
  id?: number
  payPrice?: number
  percentage?: string
  poSkuComponentId?: number
  refundVoucher?: string
  type?: number
}
export interface IGetComponentPayRecordResp {
  data?: IGetComponentPayList[]
}
export interface IUpdateComponentPayPartQuery {
  componentInfo: {
    componentIds: string
    poIds: string
  }
  unitPrice: string
  percentage: string
}
export interface IUpdatePayRecord {
  id: number
  price: string
}
export interface IGetSignatureSettingListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetSignatureSettingListResp {
  data?: {
    total: number
    list: IGetSignatureSettingList[]
  }
}
export interface IGetSignatureSettingList {
  id: number
  existingPartsId: number
  componentName: string
}
export interface IComponentName {
  componentName: string
}
export interface INumberResp {
  data?: number
}
export interface IGetAddComponentListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
  sku?: string
}
// 添加零件-列表数据获取
export interface IGetAddComponentList {
  id: number
  componentName: string
  imageUrl: string
  sku: string
  suppliserId: number
  suppliser: string
  unit: string
}
export interface IGetAddComponentListResp {
  data?: {
    total: number
    list: IGetAddComponentList[]
  }
}

export interface IGetAddConsumableListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetAddConsumableList {
  id: number
  componentName: string
  imageUrl: string
  sku: string
  suppliserId: number
  suppliser: string
  unit: string
}
export interface IGetAddConsumableListResp {
  data?: {
    total: number
    list: IGetAddConsumableList[]
  }
}
export interface ISubmitPurchaseComponent {
  componentId: number
  sku: string
  suppliserId: number
  count: number
}
export interface ISubmitPurchaseComponentQuery {
  poId: number
  poSkuId: number
  list: ISubmitPurchaseComponent[]
}
export interface ISubmitPurchaseConsumable {
  componentId: number
  suppliserId: number
  count: number
}
export interface ISubmitPurchaseConsumableQuery {
  poId: number
  poSkuId: number
  list: ISubmitPurchaseConsumable[]
}
export interface IPurchaseTotalAp {
  componentIds: string
  totalMoney: string
  totalFreight: string
}
export interface IGeneratePoContractQuery {
  poIds: string
  poSkuComponentIds: string
}
export interface IFileName {
  fileName: string
}
// 添加SKU提交确定按钮
export interface IAddPoSKUQuery {
  poId: number
  sku: string
}

export interface IGenerateRemittance {
  startTime: string
  endTime: string
}
export interface IGetOrderMoreComponentQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetOrderMoreComponentResp {
  data?: {
    total: number
    list: IGetOrderMoreComponent[]
  }
}
export interface IGetOrderMoreComponent {
  /**
   * 采购方
   */
  companyAbbreviation?: string
  /**
   * po sku 零件id
   */
  componentId?: number
  /**
   * 零件名
   */
  componentName?: string
  /**
   * 零件图片
   */
  componentUrl?: string
  /**
   * 报关状态 0不报关 1报关
   */
  customsDeclarationStatus?: number
  /**
   * 已有零件id
   */
  existingPartsId?: number
  /**
   * id
   */
  id?: number
  /**
   * po号
   */
  po?: string
  /**
   * 仓库名
   */
  repositoryName?: string
  /**
   * 剩余库存
   */
  residueStock?: number
  /**
   * 供应商名
   */
  suppliserName?: string
  /**
   * 单位
   */
  unit?: string
  /**
   * 已使用库存
   */
  useCount?: number
}

// 创建planPo修改订货套数
export interface IUpdateCreateSkuCountRequest {
  /**
   * poSKU零件信息
   */
  componentList?: ComponentList[]
  /**
   * 新的sku订货套数
   */
  newPurchaseSkuNumber?: number
  /**
   * 旧的sku订货套数
   */
  oldPurchaseSkuNumber?: number
}

export interface ComponentList {
  /**
   * 实际税点
   */
  actualTaxRate?: number
  /**
   * 零件名
   */
  componentName?: string
  /**
   * 图片
   */
  componentUrl?: string
  /**
   * 合同条款
   */
  contractTerms?: string
  /**
   * 货币 0RMB 1USD 2EUR
   */
  currency?: number
  /**
   * 报关 0报关  1不报关
   */
  customsDeclarationStatus?: number
  /**
   * 已有零件id
   */
  existingPartsListId?: number
  /**
   * 含税运费
   */
  freight?: string
  /**
   * 开票 0专票 1普票 2无法开票
   */
  invoicing?: number
  /**
   * 开票税点
   */
  invoicingTaxRate?: number
  /**
   * 起订量
   */
  minQuantity?: number
  /**
   * 含税模具费
   */
  moldCost?: string
  /**
   * 多订数量
   */
  moreCount?: number
  /**
   * 整箱数
   */
  numCartons?: number
  /**
   * 订单号
   */
  orderNo?: string
  /**
   * 总未税价
   */
  preTaxPrice?: string
  /**
   * 零件订货总数
   */
  purchaseCount?: number
  /**
   * 采购方id
   */
  purchaseId?: number
  /**
   * 采购链接
   */
  purchaseLink?: string
  /**
   * 零件采购注意事项
   */
  purchaseMatters?: string
  /**
   * 收货仓库Id
   */
  repositoryId?: number
  /**
   * 已有库存
   */
  stock?: number
  /**
   * 供应商id
   */
  suppliserId?: number
  /**
   * 当前零件的所有供应商信息
   */
  suppliserList?: SuppliserList[]
  /**
   * 总含税价
   */
  taxIncludedPrice?: string
  /**
   * 出厂总价
   */
  totalPrice?: string
  /**
   * 单位
   */
  unit?: string
  /**
   * 出厂单价
   */
  unitPrice?: string
  /**
   * 使用已有库存数量
   */
  useStockCount?: number
}

export interface IUpdateCreateSkuCountResponse {
  code?: number

  data?: {
    componentList?: ComponentList[]
    /**
     * sku总含税价
     */
    skuTotalPrice?: string
  }

  msg?: string
}

// 创建planPo修改零件
export interface IUpdateCreateComponentRequest {
  /**
   * 实际税点
   */
  actualTaxRate?: number
  /**
   * 零件名
   */
  componentName?: string
  /**
   * 图片
   */
  componentUrl?: string
  /**
   * 合同条款
   */
  contractTerms?: string
  /**
   * 货币 0RMB 1USD 2EUR
   */
  currency?: number
  /**
   * 报关 0报关  1不报关
   */
  customsDeclarationStatus?: number
  /**
   * 已有零件id
   */
  existingPartsListId?: number
  /**
   * 含税运费
   */
  freight?: string
  /**
   * 开票 0专票 1普票 2无法开票
   */
  invoicing?: number
  /**
   * 开票税点
   */
  invoicingTaxRate?: number
  /**
   * 起订量
   */
  minQuantity?: number
  /**
   * 含税模具费
   */
  moldCost?: string
  /**
   * 多订数量
   */
  moreCount?: number
  /**
   * 整箱数
   */
  numCartons?: number
  /**
   * 订单号
   */
  orderNo?: string
  /**
   * 总未税价
   */
  preTaxPrice?: string
  /**
   * 零件订货总数
   */
  purchaseCount?: number
  /**
   * 采购方id
   */
  purchaseId?: number
  /**
   * 采购链接
   */
  purchaseLink?: string
  /**
   * 零件采购注意事项
   */
  purchaseMatters?: string
  /**
   * 收货仓库Id
   */
  repositoryId?: number
  /**
   * 已有库存
   */
  stock?: number
  /**
   * 供应商id
   */
  suppliserId?: number
  /**
   * 当前零件的所有供应商信息
   */
  suppliserList?: SuppliserList[]
  /**
   * 总含税价
   */
  taxIncludedPrice?: string
  /**
   * 出厂总价
   */
  totalPrice?: string
  /**
   * 单位
   */
  unit?: string
  /**
   * 出厂单价
   */
  unitPrice?: string
  /**
   * 使用已有库存数量
   */
  useStockCount?: number
}

export interface IDelPayRecord {
  id: number
  poId: number
}
/**
 * 采购订单-降本提成申请
 */
export interface IApplyPurchaseReductionCostReq {
  poComponentId: number
  beforePrice: number
  afterPrice: number
}

export interface IGetPurchaseComponentCustomInfo {
  id: number
  unit?: string
  quantity?: string
  billingUnit?: string
}

/**
 * 采购订单-发布打包任务
 */
export interface IPacakgeTaskReq {
  poId: number
  count: number
}

export interface IPurchaseSkuReplace {
  replaceSku: string
  poId: number
  poSkuId: number
}
