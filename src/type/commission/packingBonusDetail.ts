export interface IPackingBonusDetailResp {
  data: {
    list: IPackingBonusDetailList[]
    total: number
    bonus: number
    updateTime?: string
  }
}

export interface IPackingBonusDetailList {
  /**
   * 发货日期
   */
  shipmentDate?: string

  /**
   * 人员
   */
  userName?: string

  /**
   * 箱规号
   */
  encasementNo?: string

  /**
   * 实际总箱数
   */
  actualTotalBoxCount?: number

  /**
   * 装箱总人数
   */
  encasementUserCount?: number

  /**
   * 个人折算箱数
   */
  personalDiscountBoxCount?: number

  /**
   * 个人奖金
   */
  personalBonus?: number

  /**
   * Shipment ID
   */
  shipmentId?: string
}

export interface IPackingBonusQuery {
  keyWord: string
  userId: number
  month: string
  pageNo: number
  pageSize: number
}
