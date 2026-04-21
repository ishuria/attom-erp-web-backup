export interface IGetProductManagerAssessmentListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetProductManagerAssessmentListRes {
  data: {
    total: number
    list: IGetProductManagerAssessmentList[]
  }
}

export interface IGetProductManagerAssessmentList {
  id: number
  userName?: string
  month?: string
  assessmentNumber?: number
  assessmentNumberFinish?: number
  oem?: number
  oemFinish?: number
  status?: number
  userId: number
  noAssessment?: number
}

export interface IUpdateProductManagerAssessmentReq {
  id: number
  oem?: number
  totalAssessment?: number
  status?: number
  noAssessment?: number
}

export interface IGetAssessmentListReq {
  keyWord: string
  startDate: string
  endDate: string
  pageNo: number
  pageSize: number
  status?: number
  orderByField?: string
  orderDirection?: string
}

export interface IGetAssessmentListRes {
  data: {
    list: IGetAssessmentList[]
    total: number
  }
}

export interface IGetAssessmentList {
  /**
   * 总考核数
   */
  assessmentNumber?: number
  /**
   * 总考核完成数
   */
  assessmentNumberFinish?: number
  /**
   * 销毁货值
   */
  destroyGoodsValue?: number
  /**
   * id
   */
  id?: number
  /**
   * 侵权产品数
   */
  infringementProductNumber?: number
  /**
   * 职级
   */
  jobLevel?: string
  /**
   * 月份
   */
  month?: string
  /**
   * 上新一年内产品提成
   */
  newProductOneYearCommission?: number
  /**
   * 过去6个月月均上线1年内新品提成
   */
  newProductCommission?: number
  /**
   * OEM考核数
   */
  oem?: number
  /**
   * OEM完成数
   */
  oemFinish?: number
  /**
   * 新品进度记录数
   */
  progressNumbers?: number
  /**
   * 新款采购额
   */
  purchaseAmount?: number
  /**
   * 下架产品数
   */
  removeProductNumber?: number
  /**
   * 角色名
   */
  roleName?: string
  /**
   * 新款评估跑分次数
   */
  runsNumbers?: number
  /**
   * 拿样次数
   */
  samplingFrequency?: number
  /**
   * 过去6个月均值提成
   */
  sixPastCommission?: number
  /**
   * 停产百分比
   */
  stopPercentage?: number
  /**
   * 总开发数
   */
  totalNumber?: number
  /**
   * 总停产数
   */
  totalStopNumber?: number
  /**
   * 用户名
   */
  userName?: string
}

export interface IGetUserAttendanceListRes {
  data: {
    list: IGetUserAttendanceList[]
    total: number
  }
}

export interface IGetUserAttendanceList {
  /**
   * 缺勤时长
   */
  absenceDuration?: number
  /**
   * 旷工
   */
  absenteeismCount?: number
  /**
   * 年假
   */
  annualLeave?: number
  /**
   * 美工长期奖金
   */
  artDesignLongTime?: number
  /**
   * 美工图片奖金
   */
  artDesignPicture?: number
  /**
   * 产品开发设计奖金
   */
  developmentDesign?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 迟到次数
   */
  lateCount?: number
  /**
   * 迟到时长
   */
  lateDuration?: number
  /**
   * 早退次数
   */
  leaveEarlyCount?: number
  /**
   * 早退时长
   */
  leaveEarlyDuration?: number
  /**
   * 月份
   */
  month?: string
  /**
   * 加班时长
   */
  overtimeHours?: number
  /**
   * 打包时长
   */
  packageDuration?: number
  /**
   * 事假
   */
  personalLeave?: number
  /**
   * 采购奖金
   */
  procurementBonus?: number
  /**
   * 采购降本
   */
  procurementCostReduction?: number
  /**
   * 角色名
   */
  roleName?: string
  /**
   * 严重迟到次数
   */
  seriousLateCount?: number
  /**
   * 严重迟到时长
   */
  seriousLateDuration?: number
  /**
   * 病假
   */
  sickLeave?: number
  /**
   * 上班缺卡次数
   */
  sWorkCount?: number
  /**
   * 用户名
   */
  userName?: string
  /**
   * 下班缺卡次数
   */
  xWorkCount?: number
  // 总奖金
  totalBonus?: number
  noAssessment?: number
  procurementBonusCrossMonth?: number
  taxRefundPrice?: number
  taxRefundPriceCrossMonth?: number
  managementBonus?: number
}

export interface IAddAdjustDetailReq {
  month: string
  userId: number
  type: number
  adjustQuantity: number
  oem?: number
  parent?: string
  source?: string
  remark?: string
  detailType: number
}
export interface IGetAdjustDetailReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetAdjustDetailRes {
  data: {
    list: IGetAdjustDetail[]
    total: number
  }
}
export interface IGetAdjustDetail {
  id: number
  month: string
  userId: number
  type: number
  adjustQuantity: number
  oem?: number
  parent?: string
  source?: string
  userName: string
  beforeQuantity: number | null
  afterQuantity: number | null
}

export interface ICheckoutReq {
  userIdList: number[]

  checkoutMonth: string
}

export interface IVerifyBrokenItem {
  id: number
  userId: number
  userName: string
  month: string
  type: number
  oem: number
  beforeQuantity: number | null
  adjustQuantity: number | null
  afterQuantity: number | null
  selfCheckPassed: boolean
  chainCheckPassed: boolean
  prevAfter: number | null
}

export interface ICheckoutVerifyResp {
  passed: boolean
  brokenList: IVerifyBrokenItem[]
}

export interface IMinimumMonthlyAssessment {
  id: number
  userName: string
  minMonthlyAssessment: number
}

export interface IGetUserAttendanceManagementList {
  managementId?: number
  managementBonus?: number
  totalManagementBonus?: number
  newCommissionBonus?: number
  newBonus?: number
  totalCommissionBonus?: number
  proportion?: number
  manageUserName?: string
  userName?: string
  jobTitle?: string
  roleName?: string
  month?: string
  avgSixMonthManagementBonus?: number
  avgSixMonthNewBonus?: number
  subAvgSixMonthManagementBonus?: number
  subAvgSixMonthNewBonus?: number
}

export interface IGetOperationCommissionReq {
  month: string
  userId?: number
  keyWord?: string
  pageNo: number
  pageSize: number
}

export interface IGetOperationCommissionRes {
  data: {
    total: number
    list: IGetOperationCommission[]
  }
}

export interface IGetOperationCommission {
  /** 过去6个月平均提成（不含当月） */
  sixAvgCommission?: number
  /** 过去6个月新品平均提成（不含当月） */
  newSixAvgCommission?: number
  /** 过去6个月产品提成 */
  sixAvgCommissionPrice?: number
  /** 职级提成比例 */
  proportion?: number
  /** 实际提成比例 */
  actualProportion?: number
  /** 考核不达标比例 */
  adjustProportion?: number
  /** * 广告花费 */
  adSpend?: number
  /** * 广告销售额 */
  adSales?: number
  /** * 总销售额 */
  totalSales?: number
  /** * 总毛利润 */
  totalGrossProfit?: number
  /** 提成金额（预留） */
  commissionPrice?: number
  currencyIcon?: string
  /** 职级id */
  levelId?: number
  /** 职级名称 */
  leveName?: string
  /** 角色名 */
  roleName?: string
  /** 主键id */
  id?: number
  /** 用户名 */
  userName?: string
  /** 过去6个月1年内新品提成 */
  newSixAvgCommissionPrice?: number
  /** 用户id */
  userId?: number
  /** 月份 */
  month?: string
}

export interface IGetArtDesignTaskStatistics {
  month: string
  userName: string
  newProductTaskCount: number
  oldProductTaskCount: number
  tempTaskCount: number
  designTaskCount: number
  newProductOnTimeRate: number
  oldProductOnTimeRate: number
  tempTaskOnTimeRate: number
  designTaskOnTimeRate: number
  totalTaskCount: number
}
