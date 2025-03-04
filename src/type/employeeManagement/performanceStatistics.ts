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
}

export interface IUpdateProductManagerAssessmentReq {
  id: number
  oem?: number
  totalAssessment?: number
  status?: number
}

export interface IGetAssessmentListReq {
  keyWord: string
  startDate: string
  endDate: string
  pageNo: number
  pageSize: number
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
   * 当月产品提成
   */
  monthProductCommission?: number
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
}