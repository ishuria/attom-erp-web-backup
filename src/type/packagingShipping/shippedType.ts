/**
 * @description 用于新增货代参数的接口
 * @property fullName - 货运代理的全称
 * @property abbreviation - 货运代理的简称
 */
export interface IAddForwarder {
  fullName: string
  abbreviation: string
}

/**
 * @description 站点列表类型
 */
export interface ISiteOption {
  label: string
  id: number
}

/**
 * @description 装箱列表查询参数
 */
export interface IGetEncasementListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  shipmentDataSort?: number //发货计划排序 0升序 1降序
  grossWeightSort?: number //毛重排序 0升序 1降序
  createTimeSort?: number
  totalVolumeSort?: number
  site?: number
  filters?: string[] // 筛选条件数组
}
export interface IEncasementList {
  /**
   * 装箱日期
   */
  createTime?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 明细id
   */
  encasementDetailId?: number
  /**
   * 箱规号
   */
  encasementNo?: string
  /** 冻结箱号 */
  freeze: number
  /**
   * 毛重
   */
  grossWeight?: string
  /**
   * 高
   */
  height?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 长
   */
  length?: string
  /**
   * 数量
   */
  number?: number
  /**
   * 箱数
   */
  numberOfBoxes?: number
  /**
   * 产品总数
   */
  productTotalNumber?: number
  /**
   * 备注
   */
  remarks?: string
  /**
   * 发货计划日期
   */
  shipmentDate?: string
  /**
   * 站点
   */
  site?: string
  /**
   * sku
   */
  sku?: string
  /**
   * 总体积
   */
  totalVolume?: string
  /**
   * 总重量kg
   */
  totalWeight?: string
  /**
   * 宽
   */
  width?: string
}
/**
 * @description 装箱列表返回
 */
export interface IGetEncasementListRes {
  data: {
    total: number
    list: IEncasementList[]
  }
}
/**
 * @description 箱号
 */
export interface IBoxNumber {
  data: number
}
/**
 * @description 箱号表单
 */
export interface IBoxNumberForm {
  boxNumber: number | undefined
  site: number | undefined
  partner?: number[]
}
/**
 * @description 开始装箱-根据站点和fnSku查询
 */
export interface IGetEncasementSkuReq {
  site: number
  fnSkuOrUpc: string
}
export interface IEncasementSku {
  fnSkuOrUpc?: string
  sku?: string
  productName?: string
  skuImageUrl?: string
}
/**
 * @description 装箱产品表单
 */
export interface IEncasementProduct {
  fnSkuOrUpc: string
  sku: string
  productName: string
  skuImageUrl: string
  count?: number

  packingImages?: PackingImageItem[]
  [property: string]: any
}
/**
 * @description 开始装箱-根据站点和fnSku查询产品信息返回值
 */
export interface IGetEncasementSkuRes {
  data: IEncasementSku
}

export interface ISubmitEncasementSkuReq {
  /**
   * 装箱数
   */
  encaseCount?: number
  /**
   * 装箱产品明细
   */
  encasementDetailList?: EncasementDetailList[]
  /**
   * 装箱号
   */
  encasementNo?: number
  /**
   * 站点
   */
  planSite?: number
  /**
   * 是否回插 0否 1是
   */
  isReinsert?: number
  /**
   * 合作人
   */
  partner?: number[]
}

export interface EncasementDetailList {
  /**
   * 数量
   */
  count?: number
  /**
   * FNSKU
   */
  fnSkuOrUpc?: string
  /**
   * 产品名
   */
  productName?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * 装箱图片
   */
  packingImages?: PackingImageItem[]
  /**
   * 装箱图片路径
   */
  packingImagePaths?: string[]
}

export interface PackingImageItem {
  uid: string
  name: string
  file: File
  url: string
}
export interface IBooleanRes {
  data: boolean
}
export interface IStringRes {
  data: string
}
/**
 * @description 装箱修改
 */
export interface IUpdateEncasementReq {
  id?: number
  grossWeight?: number
  length?: number
  width?: number
  height?: number
  site?: number
  boxNumber?: number
  partner?: number[]
  skuList?: EncasementDetailList[]
}
/**
 * @description 装箱-修改页面-新增新的明细
 */
export interface IAddDetailEncasementReq {
  id?: number
  fnSkuOrUpc?: string
  sku?: string
  productName?: string
  count?: number
}

export interface IEncasementId {
  encasementId: number
}

export interface IGetEncasementUpdateRes {
  code?: number
  data?: {
    /**
     * 装箱id
     */
    encasementId?: number
    /**
     * 毛重
     */
    grossWeight?: number

    height?: number

    length?: number
    /**
     * 装箱人ID
     */
    partner?: number[]
    /**
     * sku明细列表
     */
    list: ISkuDetailList[]

    siteId?: number

    width?: number
  }
  msg?: string
}

export interface ISkuDetailList {
  /**
   * 数量
   */
  count?: number
  /**
   * FNSKU
   */
  fnSkuOrUpc?: string
  /**
   * 主键
   */
  id?: number
  /**
   * 产品名
   */
  productName?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * 合作人
   */
  partner?: number[]
  /**
   * 合作人名称
   */
  partnerNames?: string[]
  /**
   * 装箱图片路径
   */
  packingImagePaths?: string[]
}

export interface IGetEncasementInspectionReq {
  sku: string
  id: number
}

export interface IGetEncasementInspectionRes {
  data: IGetEncasementInspection[]
}
export interface IGetEncasementInspection {
  taskId: number
  po: string
  skuImageUrl: string
  taskStatus: string
  packageTaskCount: number
  siteName: string
  boxNumber: number
  qualityCheckStatus: number
  actualCompleted: number | null
}

export interface IEncasementDetailId {
  encasementDetailId: number
}

export interface IUpdateEncasementShipmentDateReq {
  encasementIds: string
  shipmentPlanDate: string
}

export interface ISplitEncasementReq {
  encasementId: number
  splitCount: number
}
export interface IEncasementIds {
  encasementIds: string
}

/**
 * @description 发货亚马逊生成模板文件
 */
export interface IGenerateTemplateFile1Req {
  encasementIds: string
  type: number
}

/**
 * @description 发货亚马逊生成测试模板文件
 */
export interface IGenerateAmazonTestTemplateFileReq {
  site: number
}

/**
 * @description 发货完成提交
 */
export interface IConfirmEncasementShipmentsReq {
  /**
   * 货代渠道id
   */
  channel?: number
  /**
   * 合同号
   */
  contractNumber?: string
  /**
   * 装箱id
   */
  encasementIds?: string
  /**
   * 发货号
   */
  shipmentId?: string
  /**
   * 发货的站点
   */
  site?: number
  /**
   * 模板文件1的名称
   */
  templateFile1Name?: string
  /**
   * 模板文件2的名称
   */
  templateFile2Name?: string
  /**
   * 模板文件3的名称
   */
  templateFile3Name?: string
  /**
   * 类型 1cm/kg 2in/ln
   */
  type?: number
}

export interface IFileName {
  fileName: string
}
export interface ISplitEncasementCsv {
  fileName: string
  date: string
  remarks: string
}
export interface OptionType {
  id: number
  label: string
}

export interface IGetChannelListRes {
  data: OptionType[]
}

export interface IGetShippedEncasementListRes {
  data?: {
    list?: IGetShippedEncasementList[]
    total?: number
  }
}

export interface IGetShippedEncasementList {
  /**
   * 装箱日期
   */
  createTime?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 箱规号
   */
  encasementNo?: string
  /**
   * 装箱人员
   */
  encasementUser?: string
  /**
   * 毛重
   */
  grossWeight?: number
  /**
   * 高
   */
  height?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 长
   */
  length?: number
  /**
   * 数量
   */
  number?: number
  /**
   * 箱数
   */
  numberOfBoxes?: number
  /**
   * 计划站点名称
   */
  planSiteName?: string
  /**
   * 发货的平台
   */
  platform?: string
  /**
   * 产品总数
   */
  productTotalNumber?: number
  /**
   * 备注
   */
  remarks?: string
  /**
   * 装箱人名称
   */
  partnerNames?: string[]
  /**
   * 装箱图片路径
   */
  packingImagePaths?: string[]
  shipmentId?: string
  /**
   * 发货计划日期
   */
  shipmentPlanDate?: string
  /**
   * 实际站点名称
   */
  siteName?: string
  /**
   * sku
   */
  sku?: string
  /**
   * 总体积
   */
  totalVolume?: number
  /**
   * 总重量kg
   */
  totalWeight?: number
  /**
   * 宽
   */
  width?: number
}

export interface IAddFreightForwarderType {
  fullName: string
  abbreviation: string
}

export interface IUpdateFreightForwarderType {
  id: number
  fullName: string
  abbreviation: string
}

export interface ITypeId {
  typeId: number
}

export interface IId {
  id: number
}
export interface IUpdateCostFreightForwarderReq {
  /**
   * 报关合并状态 0不合并 1合并
   */
  bgStatus?: number
  /**
   * 账单费用名
   */
  billCostName?: string
  /**
   * 费用名
   */
  costName?: string
  /**
   * 运费核对默认状态 0不展示 1展示
   */
  costShowStatus?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 清关合并 0不合并 1合并
   */
  qgStatus?: number
  settlementObject?: number
  error?: number
  /** 计入退税资料运费 0不计入 1计入 */
  inTaxRefundBillStatus?: number
  /** 币种 */
  currency?: number
}

export interface IAddChannelFreightForwarderReq {
  /**
   * 渠道名
   */
  channelName?: string
  /**
   * 买单每续页个数
   */
  countBill?: number
  /**
   * 当前价格(体积)
   */
  currentPriceVolume?: number
  /**
   * 当前价格(重量)
   */
  currentPriceWeight?: number
  /**
   * 清关币种
   */
  customsClearanceCurrency?: number
  /**
   * 清关费
   */
  customsClearanceFee?: number
  /**
   * 清关免费个数
   */
  customsClearanceFreeCount?: number
  /**
   * 清关每续页个数费用
   */
  customsClearancePageCost?: number
  /**
   * 清关每续页个数
   */
  customsClearancePageCount?: number
  /**
   * 买单报关费
   */
  customsDeclarationFeeBill?: number
  /**
   * 目的地
   */
  destination?: string
  /**
   * DOT申报(USD)
   */
  dot?: number
  /**
   * EPA申报(USD)
   */
  epa?: number
  /**
   * FDA申报(USD)
   */
  fad?: number
  /**
   * 买单免费品名个数
   */
  freeCountBill?: number
  /**
   * 货代类型id
   */
  freightForwarderId?: number
  /**
   * 货代主键id
   */
  id?: number
  /**
   * 是否包含关税 0不包含 1包含
   */
  includeTariffs?: number
  /**
   * 名义时效
   */
  nominalLimitation?: number
  /**
   * 买单每续页费用
   */
  purchaseOrderCostPerRenewal?: number
  /**
   * 最大单箱计费重量
   */
  singleBoxBillingWeightMax?: number
  /**
   * 最低单箱计费重量
   */
  singleBoxBillingWeightMin?: number
  /**
   * 状态 0正常 1归档
   */
  status?: number
  /**
   * 单票最大运量(体积)
   */
  takeOffQuantityMaxVolume?: number
  /**
   * 单票最大运量(重量)
   */
  takeOffQuantityMaxWeight?: number
  /**
   * 起运量(体积)
   */
  takeOffQuantityVolume?: number
  /**
   * 起运量(重量)
   */
  takeOffQuantityWeight?: number
  /**
   * 退税每续页个数
   */
  taxRefundCustomsCount?: number
  /**
   * 退税报关费
   */
  taxRefundCustomsFee?: number
  /**
   * 退税免费品名个数
   */
  taxRefundCustomsFreeCount?: number
  /**
   * 退税每续页费用
   */
  taxRefundPerRenewalPageFee?: number
  /**
   * 货代类型
   */
  types?: string
  /**
   * 体积系数
   */
  volumeFactor?: number
  /**
   * 重量系数
   */
  weightFactor?: number
  /**
   * 绑定领星code
   */
  lingXingCode?: string
}

export interface IUpdateSafeDaysFreightForwarder {
  id: number
  safeDays: string
}
export interface IGetForwarderCostListRes {
  code: number
  data: IGetForwarderCostList[]
  /**
   * 消息
   */
  msg: string
}

export interface IGetForwarderCostList {
  /**
   * 合并报关状态 1勾选
   */
  bgStatus: number
  /**
   * 账单费用名
   */
  billCostName: string
  /**
   * 费用名
   */
  costName: string
  /**
   * 运费核对默认状态 0不展示 1展示
   */
  costShowStatus: number
  /**
   * 主键id
   */
  id: number
  /**
   * 清关合并 0不合并 1合并
   */
  qgStatus: number
  /**
   * 是否可以删除 0不可以 1可以
   */
  status: number
  /**
   * 货代类型id
   */
  typeId: number
  settlementObject: number
  /** 计入退税资料运费 0不计入 1计入 */
  inTaxRefundBillStatus: number
  /** 币种 */
  currency?: number
}

export interface IGetForwarderListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetForwarderListRes {
  data?: {
    list?: IGetForwarderList[]
    total?: number
  }
}

export interface IGetForwarderList {
  /**
   * 渠道名
   */
  channelName?: string
  /**
   * 累计次数
   */
  cumulativeCount?: number
  /**
   * 目的地
   */
  destination?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 货代简称
   */
  name?: string
  /**
   * 名义时效
   */
  nominalLimitation?: number
  /**
   * 当前价格
   */
  price?: string
  /**
   * 安全天数
   */
  safeDays?: number
  /**
   * 近10次时效
   */
  tenCountTime?: number
  /**
   * 货代类型
   */
  types?: string
  fullName?: string
  dropdownListDisplay?: number
}

export interface IGetShipmentArrivedListReq {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
  site: number
}

export interface IGetShipmentArrivedListRes {
  data?: {
    list?: IGetShipmentArrivedList[]
    total?: number
  }
}

export interface IGetShipmentArrivedList {
  /**
   * 实际到货日期
   */
  actualArrivalDate?: string
  /**
   * 实际数量
   */
  actualCount?: number
  /**
   * 货代渠道名
   */
  channelName?: string
  /**
   * 延误天数
   */
  delayDays?: number
  /**
   * sku的描述
   */
  description?: string
  /**
   * 货代单号
   */
  freightForwardingNumber?: string
  /**
   * 外发id
   */
  id?: number
  /**
   * 初始预计到货日期
   */
  initialArrivalDate?: string
  /**
   * 最新预计到货日期
   */
  latestArrivalDate?: string
  /**
   * 丢货 0没有丢货 1丢货
   */
  lostGoodsStatus?: number
  /**
   * po号
   */
  po?: string
  /**
   * 发货日期
   */
  shipmentDate?: string
  /**
   * SHIPMENT_ID
   */
  shipmentId?: string
  /**
   * sku发货总数
   */
  shipmentTotalCount?: number
  /**
   * 站点
   */
  site?: string
  /**
   * sku
   */
  sku?: string
  /**
   * sku图片地址
   */
  skuImgUrl?: string
  // 已接收数
  receiptsCount?: number
  // 缺数
  lackCount?: number
  // 已接收天数
  acceptDays?: number
  shippingCountAdjustment?: number
  missingNumber?: number
  receptionCount?: number
}

export interface IUpdateLostGoodsStatus {
  id: number
  // 丢货状态 0没丢货 1丢货
  status: number
}

export interface IGetShipmentFbaListReq {
  orderByField: string
  orderDirection: string
  siteId: number
  keyWord: string
  pageNo: number
  pageSize: number
  lackCountStart?: number
  lackCountEnd?: number
  shipmentDateStart?: string
  shipmentDateEnd?: string
  arrivalDateStart?: string
  arrivalDateEnd?: string
}

export interface IGetShipmentFbaListRes {
  data?: {
    list?: IGetShipmentFbaList[]
    total?: number
  }
}

export interface IGetShipmentFbaList {
  /**
   * 已接受天数
   */
  acceptDays?: number
  /**
   * 接受完成天数
   */
  acceptFinishDays?: number
  /**
   * 实际到货日期，上架日期
   */
  actualArrivalDate?: string
  /**
   * 实际延误
   */
  actualDelay?: number
  /**
   * 实际时效
   */
  actualTimeliness?: number
  /**
   * 运输渠道
   */
  channelName?: string
  /**
   * 合同号
   */
  contractNumber?: string
  /**
   * 已延误
   */
  delayed?: number
  /**
   * shipmentId
   */
  fbaShipmentId?: string
  /**
   * 主键id
   */
  id: number
  /**
   * 初始预计入库日期
   */
  initialArrivalDate?: string
  /**
   * 缺数
   */
  lackCount?: number
  /**
   * 最新预计入库日期
   */
  latestArrivalDate?: string
  /**
   * 丢货标记 0没丢货 1丢货
   */
  lostGoodsStatus?: number
  /**
   * 已接收数
   */
  receiptsCount?: number
  /**
   * 备注
   */
  remarks?: string
  /**
   * 站点
   */
  site?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 时效 0计入时效 1不计入
   */
  timelinessStatus?: number
  /**
   * 发货日期
   */
  shipmentDate?: string
  /**
   * 箱数
   */
  totalEncasementCount?: number
  /**
   * 发货总数
   */
  totalCount?: number
  /**
   * 重量
   */
  weight?: number
  /**
   * 体积
   */
  volume?: number
}
export interface IUpdateShipmentFBA {
  id: number
  remarks?: string
  lostGoodsStatus?: number
  timelinessStatus?: number
}

export interface IUpdateShipmentFbaDate {
  id: number
  date: string
}

export interface IGetShipmentFbaDetailListReq {
  id: number
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetShipmentFbaDetailListRes {
  data?: {
    list?: IGetShipmentFbaDetailList[]
    total?: number
  }
}

export interface IGetShipmentFbaDetailList {
  /**
   * 已接收天数
   */
  acceptDays?: number
  /**
   * 实际数量
   */
  actualCount?: number
  /**
   * sku的描述
   */
  description?: string
  /**
   * 缺数
   */
  lackCount?: number
  /**
   * po号
   */
  po?: string
  /**
   * 已接收数
   */
  receiptsCount?: number
  /**
   * sku发货总数
   */
  shipmentTotalCount?: number
  /**
   * sku
   */
  sku?: string
  /**
   * sku图片地址
   */
  skuImgUrl?: string
}

export interface IFilterShipmentFbaList {
  /**
   * 上架日期结束
   */
  arrivalDateEnd?: string
  /**
   * 上架日期开始
   */
  arrivalDateStart?: string
  /**
   * 缺数结束
   */
  lackCountEnd?: number
  /**
   * 缺数开始
   */
  lackCountStart?: number
  /**
   * 当前页 默认1
   */
  pageNo?: number
  /**
   * 每页大小 默认20
   */
  pageSize?: number
  /**
   * 发货日期结束
   */
  shipmentDateEnd?: string
  /**
   * 发货日期开始
   */
  shipmentDateStart?: string
}

/**
 * 装箱打印请求参数
 */
export interface IPrintEncasementReq {
  encasementId: number
  quantity: number
}
export interface IPrintEncasementRes {
  data: {
    code: string
    printerName: string
  }
}

/**
 * 开始装箱-保存后调用打印条形码
 */
export interface IPrintBarcodeEncasementRes {
  code: number
  msg: string
  data: {
    code: string
    printerName: string
  }
}
/**
 * 发货沃尔玛完成
 */
export interface IFinishWalmartShipmentReq {
  encasementIds: string
  templateFile1Name: string
  templateFile3Name: string
  contractNumber: string
  shipmentId: string
  site: number
  channel: number
}

export interface IGetChannelSiteList {
  id: number
  siteName: string
  channelId: number
}

export interface IVerifyPackingImageReq {
  fnSkuOrUpc: string
  site: number
  files: FormData
}
