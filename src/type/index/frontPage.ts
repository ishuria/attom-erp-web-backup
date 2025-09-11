export interface IGetFrontPageProgressProjectsRes {
  data: {
    total: number
    monthDiff: number
    yearDiff: number
    list: IGetFrontPageProgressProjectsItem[]
  }
}

export interface IGetFrontPageProgressProjectsItem {
  spendTime: string
  oem0Count: number
  oem1Count: number
}
export interface IGetFrontPageAssessmentDataRes {
  data: IGetFrontPageAssessmentData
}
export interface IGetFrontPageAssessmentData {
  /**
   * 总考核数
   */
  assessmentNumber: number
  /**
   * 总考核完成数
   */
  assessmentNumberFinish: number
  /**
   * OEM考核数
   */
  oem: number
  /**
   * OEM完成数
   */
  oemFinish: number

  /**
   * 较上月考核完成数
   */
  assessmentFinishMonthDiff: number

  /**
   * 较去年考核完成数
   */
  assessmentFinishYearDiff: number

  /**
   * 较上月OEM
   */
  oemFinishMonthDiff: number

  /**
   * 较去年OEM
   */
  oemFinishYearDiff: number

  assessmentFinishPercent: number
  oemFinishPercent: number
}

export interface IGetFrontPageHistoryAssessmentRecordsReq {
  pageNo: number
  pageSize: number
  keyWord: string
}
export interface IGetFrontPageHistoryAssessmentRecordsRes {
  data: {
    total: number
    list: IGetFrontPageHistoryAssessmentRecordsItem[]
  }
}
export interface IGetFrontPageHistoryAssessmentRecordsItem {
  id: number
  userName: string
  month: string
  assessmentFinish: number
  assessmentNumber: number
  oemFinish: number
  oem: number
}
export interface IGetFrontPageBonusRes {
  /**
   * 当月总提成
   */
  currentMonthBonus: number

  /**
   * 较上月
   */
  bonusMonthDiff: number

  /**
   * 较去年同月
   */
  bonusYearMonthDiff: number

  /**
   * 按类型 饼图列表
   */
  commissionTypePieList: IPieItem[]

  /**
   * 按站点 饼图列表
   */
  commissionSitePieList: IPieItem[]
}

export interface IGetFrontPageDestroyValueRes {
  totalAmount: number
  destroySitePieList: IPieItem[]
  destroyPieList: IPieItem[]
  lastMonthDiff: number
  lastYearSameMonthDiff: number
  destroyPersonPieList: IPieItem[]
}
export interface IGetFrontPageDestroyValueDetailRes {
  total: number
  list: IGetFrontPageDestroyValueDetailItem[]
}
export interface IGetFrontPageDestroyValueDetailItem {
  id: number
  /** 库存动作日期 */
  streamDate: string

  /** msku */
  msku: string

  asin: string

  siteName: string

  /** 仓库名称 */
  whName: string

  /** 库存属性 */
  dispositionType: string

  /** 出入库类型名称 */
  businessTypeDesc: string

  /** 变动采购成本 */
  changePurchaseAmount: string

  /** 变动头程成本 */
  changeLogisticsAmount: string

  /** 变动其他成本 */
  changeOtherAmount: string

  /** 总金额 */
  totalAmount: number
  userName?: string
}
export interface IPieItem {
  name: string
  value: number
}
export interface IGetFrontPagePerformanceHistoryReq {
  userId: number
  startMonth: string
  endMonth: string
}
export interface IGetFrontPagePerformanceHistory {
  month: string
  jingPinCount: number
  jingPuCount: number
  puHuoCount: number
  jingPuVineCount: number
  developmentDesign: number
  purchaseAmount: number
  newProductOneYearCommission: number
}
export interface IRankItem {
  name: string
  value: number
  assessmentNumberFinish?: number
  noAssessment?: number
}

export interface IAssessAdjustRes {
  monthlyCompletion: number
  monthlyAssess: number
  nextMonthCompletion: number
  nextMonthAssess: number
}

export interface IGetFrontPageProductProfitRes {
  id: number
  userName: string
  number: number
  totalNumber: number
  imageUrl?: string
  parentASIN?: string
  productTotalScore?: number
}

export interface IGetFrontPageMonthlyAssessment {
  id: number
  userName: string
  number: number
  totalNumber: number
  remark: string
}

export interface IGetFrontPageInventoryProductsTotalValue {
  date: string
  totalValue: number
  unpaidGoods: number
}
