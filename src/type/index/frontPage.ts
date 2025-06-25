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
  assessmentNumber: number;
  /**
   * 总考核完成数
   */
  assessmentNumberFinish: number;
  /**
   * OEM考核数
   */
  oem: number;
  /**
   * OEM完成数
   */
  oemFinish: number;

  /**
   * 较上月考核完成数
   */
  assessmentFinishMonthDiff: number;

  /**
   * 较去年考核完成数
   */
  assessmentFinishYearDiff: number;

  /**
   * 较上月OEM
   */
  oemFinishMonthDiff: number;

  /**
   * 较去年OEM
   */
  oemFinishYearDiff: number;

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
    currentMonthBonus: number;

    /**
     * 较上月
     */
    bonusMonthDiff: number;

    /**
     * 较去年同月
     */
    bonusYearMonthDiff: number;

    /**
     * 按类型 饼图列表
     */
    commissionTypePieList: IPieItem[];

    /**
     * 按站点 饼图列表
     */
    commissionSitePieList: IPieItem[];
}
export interface IPieItem {
  name: string
  value: number
}
