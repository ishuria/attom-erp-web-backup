export interface IGetSeasonalCoefficientListReq {
  siteId: number
  pageNo: number
  pageSize: number
}
export interface IGetSeasonalCoefficientListRes {
  data: {
    list:  IGetSeasonalCoefficientList[]
    total: number
  }
}

export interface IGetSeasonalCoefficientList {
  /**
   * 4月实际系数
   */
  aprActual?: number
  /**
   * 4月参考系数
   */
  aprReference?: number
  /**
   * 8月份实际系数
   */
  augActual?: number
  /**
   * 8月份参考系数
   */
  augReference?: number
  /**
   * 12月份实际系数
   */
  decActual?: number
  /**
   * 12月份参考系数
   */
  decReference?: number
  /**
   * 2月实际系数
   */
  febActual?: number
  /**
   * 2月参考系数
   */
  febReference?: number
  /**
   * 主键id
   */
  id: number
  /**
   * 1月实际系数
   */
  janActual?: number
  /**
   * 1月参考系数
   */
  janReference?: number
  /**
   * 7月实际系数
   */
  julActual?: number
  /**
   * 7月参考系数
   */
  julReference?: number
  /**
   * 6月实际系数
   */
  junActual?: number
  /**
   * 6月参考系数
   */
  junReference?: number
  /**
   * 品类名称
   */
  kindName?: string
  /**
   * 3月实际系数
   */
  marActual?: number
  /**
   * 3月参考系数
   */
  marReference?: number
  /**
   * 5月实际系数
   */
  mayActual?: number
  /**
   * 5月参考系数
   */
  mayReference?: number
  /**
   * 11月份实际系数
   */
  novActual?: number
  /**
   * 11月份参考系数
   */
  novReference?: number
  /**
   * 10月份实际系数
   */
  octActual?: number
  /**
   * 10月份参考系数
   */
  octReference?: number
  /**
   * 9月份实际系数
   */
  sepActual?: number
  /**
   * 9月份参考系数
   */
  sepReference?: number
}
export interface ISiteList {
  id: number
  label: string
}