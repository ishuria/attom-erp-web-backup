export interface ISampleReturnBonusDetailResp {
  data: {
    list: ISampleReturnBonusDetailList[]
    total: number
    pages: number
    bonus: number
  }
}

export interface ISampleReturnBonusDetailList {
  /**
   * 主键id
   */
  id: number

  /**
   * 退款日期
   */
  refundDate: string

  /**
   * 人员
   */
  userName: string

  /**
   * 产品品名
   */
  productName: string

  /**
   * 零件名
   */
  componentName: string

  /**
   * 可退金额（样品价格）
   */
  samplePrice: number

  /**
   * 实际退款
   */
  refundAmount: number

  /**
   * 提成比例
   */
  proportion: number

  /**
   * 奖金
   */
  price: number
}

export interface ISampleReturnBonusQuery {
  keyWord: string
  userId: number
  month: string
  pageNo: number
  pageSize: number
}

export interface ISampleBonusRefundAmountUpdateReq {
  id: number
  refundAmount: number
}
