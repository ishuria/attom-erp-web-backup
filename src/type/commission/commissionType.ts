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
  /** 图片提成比例 */
  singlePersonProportion: number | null
  /** 建模提成比例 */
  moldingProportion: number | null
  /** 渲染提成比例 */
  renderingProportion: number | null
  /** 视频提成比例 */
  videoProportion: number | null
  /** A+提成比例 */
  aPlusProportion: number | null
  /** 说明书提成比例 */
  instructionManualRate: number | null
}
export interface IUpdateCommissionArtTypeReq {
  id: number
  addition: number | null
  cooperationWeight: number | null
  longDay: number | null
  longSinglePersonProportion: number | null
  pictureDay: number | null
  singlePersonProportion: number | null
  /** 建模提成比例 */
  moldingProportion: number | null
  /** 渲染提成比例 */
  renderingProportion: number | null
  /** 视频提成比例 */
  videoProportion: number | null
  /** A+提成比例 */
  aPlusProportion: number | null
  /** 说明书提成比例 */
  instructionManualRate: number | null
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
  defaultOem?: number
  defaultAssessmentNumber?: number
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
  defaultOem?: number
  defaultAssessmentNumber?: number
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
  newDiscountRatio: number | null
  price: string | null
}
export interface IGetCommissionTaskPictureListReq {
  keyWord: string
  site: number
  pageNo: number
  pageSize: number
  designTaskId: number
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
  designTaskId?: number
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
export interface IGetCommissionDetailPictureListReq {
  keyWord: string
  site: number
  userId: number
  month: string
  status: number
  pageNo: number
  pageSize: number
}
export interface IGetCommissionDetailPictureListRes {
  data?: {
    list: IGetCommissionDetailPictureList[]
    total: number
    bonus: number
  }
}

export interface IGetCommissionDetailPictureList {
  /**
   * 提前完成天数
   */
  advanceDays?: number
  /**
   * 平均转化率
   */
  avgConversionRate?: number
  /**
   * 均值汇率
   */
  avgRate?: number
  /**
   * 奖金
   */
  bonus?: number
  /**
   * 提成天数
   */
  commissionDay?: number
  /**
   * 转化率加成
   */
  conversionRateIncrease?: number
  /**
   * 提成比例
   */
  cooperationProportion?: number
  /**
   * 币种符号
   */
  currencySymbol?: string
  /**
   * SKU描述
   */
  desc?: string
  /**
   * 提成结束日期
   */
  endDate?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 要求转化率
   */
  lowRate?: number
  /**
   * 提成模式
   */
  mold?: string
  /**
   * 断货补偿天数
   */
  outOfStockDays?: number
  /**
   * 剩余天数
   */
  remainingDays?: number
  /**
   * 销售额差额$
   */
  salesDifference?: number
  /**
   * 站点名称
   */
  siteName?: string
  /**
   * sku
   */
  sku?: string
  /**
   * sku图片
   */
  skuImageUrl?: string
  /**
   * 提成开始日期
   */
  startDate?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 类型
   */
  type?: string
  /**
   * 用户名
   */
  userName?: string
  pieList: any[]
}
export interface IGetCommissionDetailLongListRes {
  data?: {
    list: IGetCommissionDetailLongList[]
    total: number
    bonus: number
  }
}

export interface IGetCommissionDetailLongList {
  /**
   * 累积奖金
   */
  accumulateBonus?: number
  /**
   * 奖金
   */
  bonus?: number
  /**
   * 提成天数
   */
  commissionDay?: number
  /**
   * 提成比例
   */
  cooperationProportion?: number
  /**
   * 币种符号
   */
  currencySymbol?: string
  /**
   * SKU描述
   */
  desc?: string
  /**
   * 提成结束日期
   */
  endDate?: string
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * 当月销售
   */
  monthSales?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 剩余天数
   */
  remainingDays?: number
  /**
   * 站点名称
   */
  siteName?: string
  /**
   * sku
   */
  sku?: string
  /**
   * sku图片
   */
  skuImageUrl?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 类型
   */
  type?: string
  /**
   * 用户名
   */
  userName?: string
  pieList: any[]
}
export interface IGetCommissionDetailDevelopListReq {
  keyWord: string
  site: number
  userId?: number
  month: string
  pageNo: number
  pageSize: number
  orderByField: string
  orderDirection: string
}
export interface IGetCommissionDetailDevelopListRes {
  data?: {
    list: IGetCommissionDetailDevelopList[]
    total: number
    bonus: number
  }
}

export interface IGetCommissionDetailDevelopList {
  /**
   * 基础比例
   */
  baseProportion?: number
  /**
   * 累计提成
   */
  cumulativeCommission?: number
  /**
   * 币种符号
   */
  currencySymbol?: string
  /**
   * 当月提成
   */
  currentMonthBonus?: number
  /**
   * 提成角色
   */
  commissionRole?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * 主键id
   */
  id?: number
  /**
   * 月净利润
   */
  monthProfit?: number
  /**
   * 月净利率
   */
  monthProfitMargin?: number
  /**
   * 月销售额
   */
  monthSales?: number
  /**
   * 月销量
   */
  monthSalesVolume?: number
  /**
   * 发布日期
   */
  releaseDate?: string
  /**
   * 超额比例
   */
  rewardProportion?: number
  /**
   * 站点,参考站点表
   */
  siteName?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * sku图片URL
   */
  skuImageUrl?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 总提成比例
   */
  totalCommissionProportion?: number
  /**
   * 用户名
   */
  userName?: string
  pieList: any[]
  /** 上新天数 */
  days?: number
}
export interface IGetReductionCostDetailListReq {
  keyWord: string
  userId: number
  month: string
  pageNo: number
  pageSize: number
}
export interface IGetReductionCostDetailListRes {
  data: {
    list: IGetReductionCostDetailList[]
    total: number
    totalBonus?: number
  }
}

export interface IGetReductionCostDetailList {
  /**
   * 提成天数
   */
  commissionDays?: number
  /**
   * 提成比例
   */
  commissionProportion?: number
  /**
   * 零件付款日期
   */
  compnentPayDate?: string
  /**
   * 零件图片url
   */
  componentImgUrl?: string
  /**
   * 零件名称
   */
  componentName?: string
  /**
   * 当前po提成金额
   */
  currentPoCommission?: number
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
   * 匹配的Po
   */
  po?: string
  /**
   * po零件数量
   */
  poComponentCount?: number
  /**
   * po零件单位
   */
  poComponentUnit?: string
  /**
   * po零件单价
   */
  poComponentUnitPrice?: number
  /**
   * po发布日期
   */
  poReleaseDate?: string
  /**
   * 剩余天数
   */
  remainingDays?: number
  /**
   * SKU
   */
  sku?: string
  /**
   * SKU的图片url
   */
  skuImgUrl?: string
  /**
   * 提成开始日期
   */
  startDate?: string
  /**
   * 状态 0待审核 1进行中 2暂停 3结束 4不通过
   */
  status?: number
  /**
   * 供应商名称
   */
  suppliserName?: string
  /**
   * 用户名
   */
  userName?: string

  totalBonus?: number

  actualStart?: number
  actualEnd?: number
}

export interface IGetCostReductionHistoryPriceList {
  /**
   * 实际单价
   */
  actualUnitPrice: number
  /**
   * 开票
   */
  invoicing: string
  /**
   * 采购方
   */
  purchase: string
  /**
   * PO
   */
  po: string
  /**
   * PO日期
   */
  releaseDate: string
}
