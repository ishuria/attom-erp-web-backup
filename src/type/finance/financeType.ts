export interface IGetOutBoundListReq {
  keyWord: string
  fromDate: string
  toDate: string
  pageNo: number
  pageSize: number
}

export interface IGetOutBoundListRes {
  data?: {
    list?: IGetOutBoundList[]
    total?: number
  }
}

export interface IGetOutBoundList {
  /**
   * 零件名(兼容老系统)
   */
  componentName?: string
  /**
   * 合同编号
   */
  contractNumber?: string
  /**
   * 报关品名
   */
  customDeclarationName?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 出库日期（报关单出库日期）
   */
  outboundDate?: string
  /**
   * po号
   */
  po?: string
  /**
   * 未税总价
   */
  preTaxPrice?: number
  /**
   * 数量
   */
  quantity?: number
  /**
   * 红冲状态 0未红冲 1红冲
   */
  redStatus?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 销售价格$
   */
  salePrice?: number
  /**
   * shipmentId
   */
  shipmentId?: string
  /**
   * 产品名称/型号 sku
   */
  sku?: string
  /**
   * 供应商（兼容老系统数据）
   */
  suppliser?: string
  /**
   * 含税总价
   */
  taxInclusivePrice?: number
}

export interface IGetInBoundListRes {
  data?: {
    list?: IGetInBoundList[]
    total?: number
  }
}
export interface IGetInBoundList {
  /**
   * 零件名
   */
  componentName?: string
  /**
   * Po号
   */
  po?: string
  /**
   * 未税价
   */
  preTaxPrice?: number
  /**
   * 订货总数
   */
  purchaseCount?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 签收日期
   */
  signDate?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * 供应商名称
   */
  suppliser?: string
}

export interface IGetOutboundInventoryCheckRes {
  data: IGetOutboundInventoryCheckList[]
}
export interface IGetOutboundInventoryCheckList {
  componentName: string
  contractNumber: string
  customDeclarationName: string
  outboundDate: string
  po: string
  poComponentId: number
  quantity: number
  remark: string
  shipmentId: string
  sku: string
  suppliser: string
}

export interface ICheckOutboundNotMatchInvoiceExport {
  fromDate: string
  toDate: string
}

export interface IBooleanRes {
  data: boolean
}