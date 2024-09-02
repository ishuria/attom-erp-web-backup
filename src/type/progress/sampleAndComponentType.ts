/**
 * 新品进度成零件
 */
export interface IProgressProdcutComponent {
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
  // 供应商id
  supplierId?: number | null
  // 出厂单价
  unitPrice?: number | null
  // 出厂总价
  totalPrice?: number | null
  // 运费（含税）
  freight?: number | null
  // 总价未税价
  preTaxPrice?: number | null
  // 总含税价
  taxIncludedPrice?: number | null
  // 货币 0人民币 1USD 2EUR
  currency?: string | null
  // 0计入成本  1不计入成本
  includedInCost?: string | null
  // 供应商
  supplier?: string | null
  // 0专票 1普票 2无法开票
  invoicing?: string | null
  // 实际税点
  actualTaxRate?: number | null
  // 开票税点
  invoicingTaxRate?: number | null
  // 采购链接
  purchaseLink?: string | null
  // 备注
  remarks?: string | null
}

/**
 * 新品进度成本核算接口
 */
export interface IProgressSample {
  // id
  id: string
  // 站点
  site: string
  // 外币币种
  currencyType: string
  // 汇率
  foreignExchange: string
  // 产品描述
  desc: string
  // 长
  length: string
  // 宽
  width: string
  // 高
  height: string
  // 实际总成本
  totalCost: number
  // 重量
  weight: string
  // 尾程
  lastMile: string
  // 头程
  firstMile: string
  // 打包
  packaging: string
  // 头程渠道
  firstMileChannel: string
  // 售价
  sellingPrice: string
  // 毛利率
  grossMarginRate: string
  // ROI
  roi: string
  // 重量系数
  weightCoefficient: string
  // 体积系数
  volumeCoefficient: string
  // 关税
  tariff: string
  // 平台佣金
  platformCommission: string
  // 仓储费
  storageFee: string
}

/**
 * 新品进度成本核算接口
 */
export interface IProgressEstimatedCostAccounting {
  // id
  id: string
  // 评估id
  evaluationId: string
  // 日期
  createTime: string
  // 站点
  site: string
  // 外币币种
  currencyType: string
  // 汇率
  foreignExchange: string
  // 图片地址
  imgUrl: string
  // 产品描述
  desc: string
  // 价格信息
  priceInfo: string
  // 1688连接
  url1688: string
  // 价格信息
  price: string
  // 长
  length: string
  // 宽
  width: string
  // 高
  height: string
  // 重量
  weight: string
  // 尾程
  lastMile: string
  // 头程
  firstMile: string
  // 打包
  packaging: string
  // 头程渠道
  firstMileChannel: string
  // 售价
  sellingPrice: string
  // 毛利率
  grossMarginRate: string
  // ROI
  roi: string
  // weightCoefficient
  weightCoefficient: string
  // volumeCoefficient
  volumeCoefficient: string
  // 关税
  tariff: string
  // 平台佣金
  platformCommission: string
  // 仓储费
  storageFee: string
}

// 样品追踪
export interface ISampleTrack {
  // 样品id
  sampleId: number
  // 样品/零件图片
  componentImg: string
  // 零件名称
  componentName: string
  // 产品名
  productName: string
  // 创建时间
  createTime: string
  // 签收时间
  receiptDate: string
  // 供应商
  supplier: string
  // 1688订单
  orderNo1688: string
  // 物流订单号
  logisticsNo: string
  // 金额
  price: string
  // 大货可退金额
  bulkGoodsReturnable: string
  // 物流信息
  logisticsMessage: string
}

// 零件列表查询参数
export interface IComponentQueryReq {
  // 进度id
  progressId?: string
}

// 零件列表响应
export interface IComponentQueryResp {
  data: IProgressProdcutComponent[]
}

// 新品进度-零件清单-添加零件请求
export interface IComponentAddReq {
  progressId: string
}

// 新品进度-零件清单-添加零件响应
export interface IComponentAddResp {
  data: IComponentItem
}

export interface IComponentItem {
  // 零件id
  componentId: number
  // 供应商id
  supplierId: number
}

// 新品进度-零件清单-添加供应商请求
export interface ISuppliersAddReq {
  componentId: string
}

// 新品进度-零件清单-添加零件响应
export interface ISuppliersAddResp {
  data: number
}

// 新品进度-零件清单-删除供应商请求
export interface ISuppliersDeleteReq {
  suppliserId?: number
}

// 新品进度-零件清单-删除供应商响应
export interface ISuppliersDeleteResp {
  data?: boolean
}

// 新品进度-零件清单-零件复制请求
export interface IComponentCopyReq {
  componentId: number
  supplierIds: string
}

// 新品进度-零件清单-零件复制响应
export interface IComponentCopyResp {
  data?: boolean
}

// 新品进度-零件清单-零件图片上传响应
export interface IComponentImageResp {
  data?: string
}

// 新品进度-零件清单-零件修改响应
export interface IComponentUpdateResp {
  data?: boolean
}

// 新品进度-零件清单-样品追踪请求
export interface ISampleQueryReq {
  progressId: string
}

// 新品进度-零件清单-样品追踪响应
export interface ISampleQueryResp {
  data: ISampleTrack[]
}

// 新品进度-成本核算-查询请求
export interface ICostAccountingQueryReq {
  progressId: string
}

// 新品进度-成本核算-查询响应
export interface ICostAccountingQueryResp {
  data: IProgressEstimatedCostAccounting[]
}

// 新品进度-成本核算-添加响应
export interface IProgressCostAccountResp {
  // 返回成本核算id
  data?: number
}

// 新品进度-成本核算-零件图片上传响应
export interface ICostAccountingImageResp {
  data?: string
}

// 新品进度-成本核算-图片上传响应
export interface ICostAccountingUpdateSortResp {
  data?: boolean
}

// 新品进度-成本核算-复制请求
export interface ICostAccountingCopyReq {
  accountingId: string
  progressId: string
}

// 新品进度-成本核算-复制响应
export interface ICostAccountingCopyResp {
  data?: boolean
}

// 新品进度-成本核算-修改响应
export interface ICostAccountingUpdateResp {
  data?: boolean
}
// 新品进度-成本核算-删除请求
export interface ICostAccountingDeleteReq {
  accountingId: string
}
// 新品进度-成本核算-删除响应
export interface ICostAccountingDeleteResp {
  data?: boolean
}
