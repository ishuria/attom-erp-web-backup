export interface IAiTuoMuList {
  data: {
    total: number
    list: IAiTuoMuItem[]
  }
}

export interface IAiTuoMuItem {
  /** poId */
  poId?: number
  /** id */
  id: number
  /** 已有零件id */
  componentId?: number
  /** po零件id */
  poComponentId?: number
  /** 供应商id */
  suppliserId?: number
  /** po号 */
  po?: string
  /** sku */
  sku?: string
  /** sku图片地址 */
  skuImageUrl?: string
  /** sku 产品名称 */
  productName?: string
  /** 零件图片 */
  componentUrl?: string
  /** 零件名*/
  componentName?: string
  /** po零件总数*/
  purchaseCount?: string
  /** po零件单位 */
  unit?: string
  /** po总含税价 */
  taxIncludedPrice?: string
  /** 订单号*/
  orderNo?: string
  /** 供应商 */
  suppliser?: string
  /** 报关品名 */
  customsDeclarationName?: string
  /** 报关数量 */
  customsDeclarationCount?: string
  /** 报关单位 */
  customsDeclarationUnit?: string
  /** 零件数量 */
  componentCount?: string
  /** 发货日期 */
  shipmentDate?: string
  /** 开票号码 */
  invoiceNumber?: string
  /** 开票代码 */
  invoiceCode?: string
  /** 发票单位 */
  invoiceUnit?: string
  /** 发票含税金额 */
  includingTaxPrice?: string
  /** 采购日期 */
  poPurchaseDate?: Date
  /**合同号 */
  contractNumber?: string
}

export interface IAiTuoMuListReq {
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
  /**
   * 状态 0未匹配 1已匹配
   */
  status?: number
}
