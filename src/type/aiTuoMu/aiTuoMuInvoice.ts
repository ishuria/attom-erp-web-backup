export interface IFinishAiTuoMuInvoiceRes {
  data: boolean
  msg?: string
}

export interface IAiTuoMuInvoiceList {
  total: number
  list: IAiTuoMuInvoiceItem[]
}

/** 埃托姆发票Item */
export interface IAiTuoMuInvoiceItem {
  /**
   * 主键id
   */
  id?: number

  /** 明细id */
  detailId?: number

  /**
   * 采购方名称
   */
  purchaseName?: string

  /**
   * 发票代码
   */
  invoiceCode?: string

  /**
   * 发票号码
   */
  invoiceNumber?: string

  /**
   * 供应商
   */
  suppliser?: string

  /**
   * 发票文件路径
   */
  invoiceFilePath?: string

  /**
   * 开票品名
   */
  invoiceName?: string

  /**
   * 规格型号
   */
  specificationModel?: string

  /**
   * 发票数量
   */
  invoiceCount?: string

  /**
   * 发票单位
   */
  invoiceUnit?: string

  /**
   * 未税金额
   */
  preTaxPrice?: string

  /**
   * 含税金额
   */
  includingTaxPrice?: string
}

/**
 * 埃托姆发票Req
 */
export interface IAiTuoMuInvoiceReq {
  /*
   * 搜索关键词
   */
  keyWord?: string
  /**
   * 当前页 默认1
   */
  pageNo?: number
  /**
   * 每页大小 默认20
   */
  pageSize?: number
}

/**
 * 埃托姆发票Req
 */
export interface IAiTuoMuUpdateReq {
  /**
   * 主键id
   */
  id?: number
  /**
   * 发票代码
   */
  invoiceCode?: string
  /**
   * 发票号码
   */
  invoiceNumber?: string
  /**
   * 采购方名称
   */
  purchaseName?: string
  /**
   * 供应商
   */
  suppliser?: string
}

/**
 * 修改返回结果Res
 */
export interface IAiTuoMuBoolean {
  data: boolean
}

/**
 * 埃托姆发票明细Req
 */
export interface IAiTuoMuUpdateDetailReq {
  /**
   * 主键id
   */
  detailId?: number
  /**
   * 含税金额
   */
  includingTaxPrice?: number
  /**
   * 发票数量
   */
  invoiceCount?: number
  /**
   * 开票品名
   */
  invoiceName?: string
  /**
   * 发票单位
   */
  invoiceUnit?: string
  /**
   * 未税金额
   */
  preTaxPrice?: number
  /**
   * 规格型号
   */
  specificationModel?: string
}

export interface IAiTuoMuDeleteReq {
  /**
   * 主键id
   */
  id?: number
}

/** 发票匹配Req */
export interface IAiTuoMuMatchReq {
  /**
   * 零件id列表
   */
  idList?: number[]
  /**
   * 发票id
   */
  invoiceId?: number
}
