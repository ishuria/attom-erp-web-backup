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
export interface IUpdateCommissionTaskPictureReq {
  id: number
  requiredCompletionDate: string
  commissionDays: number
  cooperationCommissionRatio: number
  individualCommissionRate: number
  cooperationWeight: number
  addition: number
  lowRate: number
}
export interface IGetLongCommissionTaskListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetLongCommissionTaskListRes {
  data?: {
    list: IGetLongCommissionTaskList[]
    total: number
  }
}
export interface IGetLongCommissionTaskList {
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
   * 主键id
   */
  id?: number
  /**
   * 单人比例
   */
  singleProportion?: number
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
   * 任务类型
   */
  type?: string
  /**
   * 用户名
   */
  userName?: string
}
export interface IUpdateLongCommissionTaskReq {
  id: number
  commissionDays: number
  cooperationCommissionRatio: number
  individualCommissionRate: number
  cooperationWeight: number
  addition: number
}
export interface IGetDevelopDesignTaskListRes {
  data?: {
    list: IGetDevelopDesignTaskList[]
    total: number
  }
}
export interface IGetDevelopDesignTaskList {
  /**
   * 基础比例
   */
  baseProportion?: number
  /**
   * 提成角色
   */
  commissionRole?: string
  /**
   * sku描述
   */
  description?: string
  /**
   * id
   */
  id?: number
  /**
   * 本职角色
   */
  jobRole?: string
  /**
   * 计划发布日期
   */
  releaseData?: string
  /**
   * 超额比例
   */
  rewardProportion?: number
  /**
   * sku
   */
  sku?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 人员名称
   */
  userName?: string
}
export interface IUpdateDevelopDesignTaskReq {
  id: number
  baseProportion: number
  rewardProportion: number
}
export interface IGetReductionCostListRes {
  data?: {
    list: IGetReductionCostList[]
    total: number
  }
}

export interface IGetReductionCostList {
  /**
   * 提成天数
   */
  commissionDays?: number
  /**
   * 提成比例
   */
  commissionProportion?: number
  /**
   * 零件名称
   */
  componentName?: string
  /**
   * 降本金额
   */
  costReductionPrice?: number
  /**
   * 降本比例
   */
  costReductionProportion?: number
  /**
   * 描述
   */
  description?: string
  /**
   * 提成结束日期
   */
  endDate?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 优化后成本
   */
  optimizationAfter?: number
  /**
   * 优化前成本
   */
  optimizationBefore?: number
  /**
   * po单号
   */
  po?: string
  /**
   * sku
   */
  sku?: string
  /**
   * 提成开始日期
   */
  startDate?: string
  /**
   * 状态 0待审核 1进行中 2暂停 3结束 4不通过
   */
  status?: string
  /**
   * 供应商名称
   */
  suppliserName?: string
  /**
   * 用户名
   */
  userName?: string
}
export interface IUpdateReductionCostTaskReq {
  id: number
  beforePrice: number
  afterPrice: number
  commissionProportion: number
  commissionDays: number
}