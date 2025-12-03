export interface ITaxRefundBonusDetailResp {
  data: {
    list: ITaxRefundBonusDetailList[]
    total: number
    bonus: number
  }
}

export interface ITaxRefundBonusDetailList {
  /**
   * 主键id
   */
  id: number

  /**
   * Po
   */
  po: string

  /**
   * sku
   */
  sku: string

  /**
   * 供应商
   */
  supplier: string

  /**
   * 发票号码
   */
  invoiceNumber: string

  /**
   * 零件名
   */
  componentName: string

  /**
   * 含税金额
   */
  taxIncludingPrice: number

  /**
   * 未税金额
   */
  preTaxPrice: number

  /**
   * 开票税点
   */
  invoiceTaxRate: number

  /**
   * 出口退税税率
   */
  exportRebateRate: number

  /**
   * 退税额
   */
  taxRebate: number

  /**
   * 退税奖金
   */
  bonus: number

  /**
   * 状态 0正常 1红冲状态
   */
  status: number

  /**
   * 用户（谁的奖金）
   */
  userName: string

  /**
   * 创建人,发票匹配人
   */
  createUserName: string

  /**
   * 发票匹配日期
   */
  matchDate: string

  /**
   * 创建时间
   */
  createTime: string
}

export interface ITaxRefundBonusQuery {
  keyWord: string
  userId: number
  month: string
  pageNo: number
  pageSize: number
}
