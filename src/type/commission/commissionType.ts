export interface IGetCommissionArtTypeListRes {
  data: IGetCommissionArtTypeList[]
}
export interface IGetCommissionArtTypeList {
  id: number
  userName: string
  roleName: string
  addition: number | null
  cooperationWeight: number | null
  longDay: number | null
  longSinglePersonProportion: number | null
  pictureDay: number | null
  singlePersonProportion: number | null
}
export interface IUpdateCommissionArtTypeReq {
  id: number
  addition: number | null
  cooperationWeight: number | null
  longDay: number | null
  longSinglePersonProportion: number | null
  pictureDay: number | null
  singlePersonProportion: number | null
}
export interface IGetCommissionProductTypeListRes {
  data: IGetCommissionProductTypeList[]
}
export interface IGetCommissionProductTypeList {
  id: number
  userName: string
  roleName: string
  aiTuoMCount: number | null
  attomCount: number | null
  day: number | null
  delivery: number | null
  productDesignProportion: number | null
  productManagerProportion: number | null
  proportion: number | null
  yunzhouCount: number | null
}
export interface IUpdateCommissionProductTypeReq {
  id: number
  aiTuoMCount: number | null
  attomCount: number | null
  day: number | null
  delivery: number | null
  productDesignProportion: number | null
  productManagerProportion: number | null
  proportion: number | null
  yunzhouCount: number | null
}
export interface IGetCommissionSettingRes {
  data: {
    acos: number
    upperLimit: number
    minConversionRate: number
    compensationDay: number
    instructionManualRate: number
    list: IGetCommissionSettingTableList[]
  }
}
export interface IGetCommissionSettingTableList {
  id: number
  unitPrice: string
  targetRate: number
}
export interface IUpdateCommissionSetting1Req {
  acos: number | null
  upperLimit: number | null
  minConversionRate: number | null
  compensationDay: number | null
}
export interface IGetCommissionTaskPictureListReq {
  keyWord: string
  site: number
  pageNo: number
  pageSize: number
}
export interface IGetCommissionTaskPictureListRes {
  data: {
    list: IGetCommissionTaskPictureList[]
    total: number
  }
}

export interface IGetCommissionTaskPictureList {
  /**
   * 实际完成日期
   */
  actualFinishDate?: string
  /**
   * 提前完成天数
   */
  advanceDays?: number
  /**
   * 提成天数
   */
  commissionDay?: number
  /**
   * 合作加成
   */
  cooperationBonus?: number
  /**
   * 合作比例
   */
  cooperationProportion?: number
  /**
   * 合作权重
   */
  cooperationWeight?: number
  /**
   * 设计任务
   */
  designTask?: string
  /**
   * 要求完成日期
   */
  dueDate?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 最低要求转化率
   */
  lowRate?: number
  /**
   * 提成模式
   */
  mold?: string
  /**
   * 单人比例
   */
  singleProportion?: number
  /**
   * 站点名称
   */
  siteName?: string
  /**
   * sku
   */
  sku?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 美工任务id
   */
  taskId?: number
  /**
   * 用户名
   */
  userName?: string
}