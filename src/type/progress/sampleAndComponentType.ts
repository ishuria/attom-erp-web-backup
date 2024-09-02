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

// 零件列表查询参数
export interface IComponentQueryReq {
  // 进度id
  progressId: string
  // 关键词
  keyWord?: string
  pageNo: number
  pageSize: number
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

// 新品进度-成本核算-查询请求
export interface ICostAccountingQueryReq {
  progressId: string
}

// 新品进度-成本核算-查询响应
export interface ICostAccountingQueryResp {
  data: IProgressEstimatedCostAccounting[]
}
