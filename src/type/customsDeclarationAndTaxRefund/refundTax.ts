export interface IGetTaxRefundBatchListQuery {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
}
export interface IGetTaxRefundBatchListRes {
  data: {
    total: number
    list: IGetTaxRefundBatchList[]
  }
}
export interface IGetTaxRefundBatchList {
  // 合同编号
  contractNumber?: string
  /** cif价格 */
  cif?: string
  /** fob价格 */
  fob?: string
  // 报关单出库日期
  exportDate?: string
  // 主键id
  id?: number
  // 未到发票数量
  notYetCount?: number
  // 备注
  remark?: string
  // 发货日期
  shipmentDate?: string
  // 退税状态 0待退税 1已退税
  taxRefundStatus?: number
  // 发票总数
  totalCount?: number
  totalFreightFee?: number
}

export interface IUpdateTaxRefundBatchDate {
  id: number
  date: string
}
export interface IUpdateTaxRefundBatchRemark {
  id: number
  remark: string
}
export interface IUpdateTaxRefundBatchFreightFee {
  id: number
  freightFee: string
}
export interface IGetTaxRefundBatchDetailQuery {
  keyWord: string
  id: number
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}
export interface IGetTaxRefundBatchDetailRes {
  data?: {
    list?: IGetTaxRefundBatchDetailList[]
    total?: number
    totalTaxRebate?: number // 该区间剩余可退税金额
  }
}

export interface IGetTaxRefundBatchDetailList {
  // cfi价格
  cifPrice?: number
  // Po的零件总数
  componentCount?: number
  // 报关数量
  customsDeclarationCount?: number
  // 报关品名
  customsDeclarationName?: string
  // 报关单位
  customsDeclarationUnit?: string
  // fob价格
  fobPrice?: number
  // 运费
  freightFee?: number
  // 主键id
  id?: number
  // 发票数量
  invoiceCount?: number
  invoiceCode?: number
  // 发票明细id
  invoiceDetailId?: number
  // 发票文件
  invoiceFilePath?: string
  // 发票匹配日
  invoiceMatchDate?: string
  // 发票号码
  invoiceNumber?: string
  /**
   * 付款记录
   */
  payRecordList?: PayRecordList[] | string
  matchInvoiceRecord?: any[]
  // Po号
  po?: string
  // po的零件id
  poComponentId?: number
  // poId
  poId?: number
  profit?: number
  // 利润率
  profitMargin?: number
  // 汇率
  rate?: number
  // 人民币售价
  salePrice?: number
  // 发货日期
  shipmentDate?: string
  // shipmentId
  shipmentId?: string
  sku?: string
  // 供应商
  suppliser?: string
  // 供应商税号
  suppliserTaxNumber?: string
  // 含税成本
  taxInclusiveCost?: number
  // 退税额
  taxRebate?: number
  taxRefundsCost?: number
  matchId?: number
  [property: string]: any
}

export interface PayRecordList {
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 付款金额
   */
  payPrice?: number
  /**
   * 百分比
   */
  percentage?: string
  /**
   * 付款类型 0付款 1退款
   */
  type?: number
}

export interface IGetTaxRefundListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
  taxRefundStatus: number
  fromDate: string
  toDate: string
  orderByField: string
  orderDirection: string
  searchFields: string
}
export interface IGetTaxRefundInvoiceListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetTaxRefundInvoiceListRes {
  data?: {
    list?: IGetTaxRefundInvoiceList[]
    total?: number
  }
}

export interface IGetTaxRefundInvoiceList {
  no?: number
  /**
   * 实际报关数量
   */
  customsDeclarationCount?: number
  /** 退税产品总报关数量 */
  taxRefundCustomsDeclarationCount?: number
  /** 退税产品匹配的发票数量 */
  taxRefundMatchCustomsDeclarationCount?: number
  /** 退税产品匹配的发票含税金额 */
  taxRefundMatchInvoicePrice?: number
  /** 退税产品总发票含税金额 */
  taxRefundTotalInvoicePrice?: number
  /** Po报关总数 */
  customsDeclarationCountTotal?: number
  /** po零件已匹配报关 */
  customsDeclarationMatchCount?: number
  /** po零件含税金额 */
  poComponentTotalPrice?: number
  /** po零件匹配金额 */
  poComponentMatchPrice?: number
  /**
   * 报关单位
   */
  customsDeclarationUnit?: string
  /**
   * 发票明细id
   */
  detailId?: number
  /**
   * 发票主键id
   */
  id?: number
  /** 发票匹配中间表id */
  mId?: number
  /**
   * 含税金额
   */
  includingTaxPrice?: number
  /**
   * 发票代码
   */
  invoiceCode?: string
  /**
   * 发票数量
   */
  invoiceCount?: number
  /**
   * 开票品名
   */
  invoiceName?: string
  /**
   * 发票号码
   */
  invoiceNumber?: string
  /**
   * 发票的路径
   */
  invoicePath?: string
  /**
   * 发票单位
   */
  invoiceUnit?: string
  /**
   * 匹配合同号
   */
  matchContractNumber?: string
  /**
   * 匹配的PO
   */
  matchPo?: string
  /**
   * 未税金额
   */
  preTaxPrice?: number
  /**
   * 采购方名称
   */
  purchaseName?: string
  /**
   * 规格型号
   */
  specificationModel?: string
  /**
   * 供应商名称
   */
  suppliser?: string
  remainingCount: number
  taxRefundId?: number
}

export interface IFinishTaxRefundInvoiceRes {
  data: boolean
  msg: string
}

export interface ITaxRefundInvoiceRes {
  data: string
  msg: string
}

export interface ICleanTaxRefundInvoice {
  matchId: number
}

export interface IGetTaxRefundInvoiceMatchQuery {
  detailId: number
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetTaxRefundInvoiceMatchRes {
  data?: {
    list?: IGetTaxRefundInvoiceMatchList[]
    total?: number
  }
}

export interface IGetTaxRefundInvoiceMatchList {
  /**
   * 唯一id
   */
  uniqId: number
  /**
   * cif价格
   */
  cifPrice?: number
  /**
   * 合同编号
   */
  contractNumber?: string
  /**
   * 报关数量
   */
  customsDeclarationCount?: number
  /**
   * 报关单位
   */
  customsDeclarationUnit?: string
  /**
   * fob价格
   */
  fobPrice?: number
  /**
   * 运费
   */
  freightFee?: number
  /**
   * 主键id
   */
  id: number
  /**
   * 发票数量
   */
  invoiceCount?: number
  /**
   * 未开票数量
   */
  notYetInvoice?: number
  /**
   * Po号
   */
  po?: string
  /**
   * 利润率
   */
  profitMargin?: number
  /**
   * 人民币售价
   */
  salePrice?: number
  /**
   * shipmentId
   */
  shipmentId?: string
  /**
   * Sku信息
   */
  sku?: string
  /**
   * 含税成本
   */
  taxInclusiveCost?: number

  matchFlag: boolean
}

export interface IUpdateTaxRefundInvoice {
  id: number
  purchaseName?: string
  invoiceCode?: string
  invoiceNumber?: string
  suppliser?: string
}
export interface IUpdateTaxRefundInvoiceDetail {
  id: number
  invoiceName: string
  specificationModel: string
  invoiceCount: number
  invoiceUnit: string
  preTaxPrice: number
  includingTaxPrice: number
}
export interface ISubmitTaxRefundInvoiceMatch {
  detailId: number
  taxRefundIds: number[]
}

export interface ITaxRefundInvoiceDelete {
  detailId: number
  id: number
  matchId: number
}

export interface IGetTaxRefundProfitMarginQuery {
  fromDate: string
  toDate: string
}
export interface IGetTaxRefundProfitMarginRes {
  code: number
  data: IGetTaxRefundProfitMarginList[]
  /**
   * 消息
   */
  msg: string
}

export interface IGetTaxRefundProfitMarginList {
  /**
   * 合同号
   */
  contractNumber?: string
  /**
   * 利润率
   */
  profitMargin?: string
  /**
   * 汇率
   */
  rate?: number
  /**
   * 发货日期
   */
  shipmentDate?: string
  /**
   * 总CIF价格
   */
  totalCif?: number
  /**
   * 总成本
   */
  totalCost?: number
  /**
   * 费用
   */
  totalFreightFee?: number
  /**
   * 总利润
   */
  totalProfit?: number
  /**
   * 总人民币销售额
   */
  totalSalePrice?: number
  /**
   * 总退税额
   */
  totalTaxRebate?: number
}

export interface IContractValidateTaxRefundBatch {
  id: number
  path: string
}
