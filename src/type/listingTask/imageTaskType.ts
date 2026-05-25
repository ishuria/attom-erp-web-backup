export interface IGetArtDesignTaskListReq {
  keyword: string
  status: number
  pageNo: number
  pageSize: number
  taskType?: string
  operationUserId: number
}
export interface IGetArtDesignTaskListRes {
  data: {
    list: IGetArtDesignTaskList[]
    total: number
  }
}

export interface IGetArtDesignTaskList {
  /**
   * A+
   */
  aAdd?: string
  /**
   * 基础图片
   */
  basePicture?: string
  /**
   * 完成时间
   */
  finishDate?: string
  id?: number
  /**
   * 说明书/包装
   */
  instructionManual?: string
  /**
   * 建模/渲染
   */
  modeling?: string
  /**
   * 运营
   */
  operation?: string
  /**
   * 产品定位
   */
  positioning?: string
  /**
   * 产品设计
   */
  productDesign?: string
  /**
   * 产品经理
   */
  productManager?: string
  /**
   * 发布人
   */
  publisherPersonName?: string
  /**
   * 需求文档地址
   */
  requiredAddress?: number
  /**
   * 卖点状态
   */
  sellingPointStatus?: number
  /**
   * 站点
   */
  sites?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * SKU图片地址
   */
  skuImgUrl?: string
  /**
   * 任务类型
   */
  taskType?: string
  /**
   * 最新审批状态
   */
  latestApprovalStatus?: number
  [property: string]: any
}
export interface IAddArtDesignTaskReq {
  sku: string
  taskType: string
  sites: string
  position: number
  artDesignType: string[]
  finishDate: string
  artDesign?: string
  remark?: string
  linkAddress?: string
}
export interface IClaimArtDesignTaskReq {
  ids: string
  type: number
}
export interface IGetArtDesignTaskMarginRes {
  data: IArtDesignTaskMargin
}
export interface IArtDesignTaskMargin {
  dayMargin: number
  proportionMargin: number
}
export interface IGetArtDesignTaskStatisticsRes {
  data: {
    statistics: IGetArtDesignTaskStatistics[]
    avgNumberList: number[]
  }
}
export interface IGetArtDesignTaskStatistics {
  finishDate: string
  count: number
}
export interface IUpdateArtDesignTaskDistributeReq {
  /**
   * A+人多个用,分割
   */
  aPlus?: string
  /**
   * 基础图片人多个用,分割
   */
  baseImageUrlPerson?: string
  /**
   * 美工任务Ids
   */
  ids: string
  /**
   * 说明书包装人多个用,分割
   */
  instructionPerson?: string
  /**
   * 建模人多个用,分割
   */
  moldingPerson?: string

  /** 渲染人多个用,分割 */
  renderingPerson?: string

  /**
   * 视频人多个用,分割
   */
  videoPerson?: string
  colorDesignPerson?: string
  productPlaneDesignPerson?: string
  type: number
}
export interface IGetSellingPointRes {
  data: IGetSellingPoint
}

export interface IGetSellingPoint {
  /**
   * 品牌词
   */
  brand?: string
  /**
   * 竞品ASIN
   */
  competitiveAsin?: string
  /**
   * 竞品差异化
   */
  competitiveProductDifferences?: string
  /**
   * 主键id
   */
  id: number | null
  /**
   * 链接关键词
   */
  linkKeywords?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 注意事项
   */
  precautions?: string
  /**
   * 产品差异程度 0非常大 1大 2中 3小 4无差异化
   */
  productDifferences?: number
  /**
   * 同赛道ASIN
   */
  sameTrackAsin?: string
  /**
   * 功能卖点
   */
  sellingPointContent?: string
  /**
   * 概括
   */
  summary?: number
  /**
   * 目标客群
   */
  targetAudience?: string
  /**
   * 产品使用场景
   */
  usageScenario?: string
  summaryId?: number
  artDesignTaskId?: number
  title1?: string
  title2?: string
  linkKeywordsTs?: string
  sellingPointContentTs?: string
  /**
   * 产品英文主品名
   */
  productNameEn?: string
  /**
   * 卖点站点 id
   */
  site?: number
}
export interface IConfirmOtherSkuArtDesignSellingPointRes {
  data: IConfirmOtherSkuArtDesignSellingPoint
}

export interface IConfirmOtherSkuArtDesignSellingPoint {
  /**
   * 品牌词
   */
  brand?: string
  /**
   * 竞品ASIN
   */
  competitiveAsin?: string
  /**
   * 竞品差异化
   */
  competitiveProductDifferences?: string
  /**
   * 链接关键词
   */
  linkKeywords?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 注意事项
   */
  precautions?: string
  /**
   * 产品差异程度 0非常大 1大 2中 3小 4无差异化
   */
  productDifferences?: number
  /**
   * 同赛道ASIN
   */
  sameTrackAsin?: string
  /**
   * 功能卖点
   */
  sellingPointContent?: string
  /**
   * 概括
   */
  summary?: string
  /**
   * 目标客群
   */
  targetAudience?: string
  /**
   * 产品使用场景
   */
  usageScenario?: string
  id: number | null
}
export interface IGetCopywritingRes {
  data: IGetCopywriting
}

export interface IGetCopywriting {
  /**
   * 品牌词
   */
  brand?: string
  /**
   * 竞品ASIN
   */
  competitiveAsin?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 链接关键词
   */
  linkKeywords?: string
  /**
   * 链接关键词译文
   */
  linkKeywordsTs?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 同赛道ASIN
   */
  sameTrackAsin?: string
  /**
   * 功能卖点
   */
  sellingPointContent?: string
  /**
   * 功能卖点译文
   */
  sellingPointContentTs?: string
  /**
   * 目标客群
   */
  targetAudience?: string
  /**
   * 标题1
   */
  title1?: string
  /**
   * 标题2
   */
  title2?: string
  /**
   * 产品使用场景
   */
  usageScenario?: string
}
export interface ISaveArtDesignCopywritingReq {
  artDesignTaskId?: number
  id?: number
  title1: string
  title2: string
  linkKeywordsTs: string
  sellingPointContentTs: string
}
export interface ISaveBatchSellingPointReq {
  /**
   * 品牌词
   */
  brand?: string
  /**
   * 竞品ASIN
   */
  competitiveAsin?: string
  /**
   * 竞品差异化
   */
  competitiveProductDifferences?: string
  /**
   * 勾选的多条美工记录的id，多个,分割
   */
  ids?: string
  /**
   * 链接关键词
   */
  linkKeywords?: string
  /**
   * 材质
   */
  material?: string
  /**
   * 注意事项
   */
  precautions?: string
  /**
   * 产品差异程度 0非常大 1大 2中 3小 4无差异化
   */
  productDifferences?: number
  /**
   * 同赛道ASIN
   */
  sameTrackAsin?: string
  /**
   * 功能卖点
   */
  sellingPointContent?: string
  /**
   * 概括
   */
  summaryId?: number
  /**
   * 目标客群
   */
  targetAudience?: string
  /**
   * 产品使用场景
   */
  usageScenario?: string
}

export interface IGetArtDesignSelectionReasonsList {
  id: number
  reason: string
}
/**
 * 需求文件地址修改参数
 */
export interface IUpdateArtDesignDemandAddressReq {
  id: number
  demandAddress: string
}

export interface IQueryArtDesignTaskDistributionRes {
  data: {
    baseImageUrlPersons: number[]
    instructionPersons: number[]
    moldingPersons: number[]
    videoPersons: number[]
    aPlus: number[]
    renderingPersons: number[]
    colorDesignPersons: number[]
    productPlaneDesignPersons: number[]
  }
}

export interface IAllocateArtDesignTaskReq {
  taskId: number
  skuIds: number[]
}

export interface IGetArtDesignTaskUserListBySku {
  id: number
  label: string
  /**
   * true 不可选中 false 可选中
   */
  status: boolean
}

/**
 * 提交审批请求参数
 */
export interface ISubmitApprovalArtDesignTaskReq {
  id: number
  filePath: string
}

export interface IArtDesignTaskApproveReqDTO {
  id: number
  approvalStatus: number
  correctionRequirement?: string
}

export interface IArtDesignTaskApprovalReworkUpdateReqDTO {
  id: number
  countAsRework: number
}

export interface IArtDesignTaskApprovalRespDTO {
  id: number
  artDesignTaskId: number
  filePath: string
  approvalUserId: number
  approvalUserName: string
  approvalStatus: number
  correctionRequirement: string
  countAsRework: number
  createTime: string
}

/**
 * 审批记录分页查询请求
 */
export interface IGetArtDesignTaskApprovalPageReq {
  keyword: string
  pageNo: number
  pageSize: number
}

/**
 * 审批记录分页查询响应
 */
export interface IGetArtDesignTaskApprovalPageRes {
  data: {
    list: IArtDesignTaskApprovalPageItem[]
    total: number
  }
}

/**
 * 审批记录分页查询项
 */
export interface IArtDesignTaskApprovalPageItem {
  /** 审批记录id */
  id: number
  /** 美工任务id */
  artDesignTaskId: number
  /** SKU图片地址 */
  skuImgUrl: string
  /** SKU */
  sku: string
  /** 主站点ASIN */
  asin?: string
  /** 产品描述 */
  productDesc: string
  /** 任务类型 */
  taskType: string
  /** 产品定位 */
  positioning: string
  /** 要求完成日期 */
  finishDate: string
  /** 提交人员（美工） */
  artDesignName: string
  /** 审批人姓名 */
  approvalUserName: string
  /** 提交的文件路径 */
  filePath: string
  /** 整改要求 */
  correctionRequirement: string
  /** 是否计入返工数 0否 1是 */
  countAsRework: number
  /** 审批状态 0待审批 1通过 2不通过 */
  approvalStatus: number
  /** 任务状态 */
  status: number
  /** 提交时间 */
  createTime: string
  /** 卖点摘要 */
  sellingPoint: string

  actualFinishDate: string

  operation: string

  proofreadingStatus: number
}

// ===== 发布审批相关 =====

/** 发布审批请求 */
export interface IPublishApprovalReq {
  /** 审批记录id */
  id: number
  /** 审批状态 1通过 2驳回 */
  approvalStatus: number
  /** 驳回原因 */
  rejectionReason?: string
}

/** 发布审批列表查询请求 */
export interface IPublishApprovalListReq {
  /** 搜索关键词 */
  keyword?: string
  pageNo: number
  pageSize: number
}

/** 发布审批列表项 */
export interface IPublishApprovalItem {
  id: number
  /** 美工任务ID */
  artDesignTaskId: number
  /** 发布人用户ID */
  publisherUserId: number
  /** 审批人用户ID */
  approvalUserId: number
  /** 审批状态 0待审批 1通过 2驳回 */
  approvalStatus: number
  /** 驳回原因 */
  rejectionReason: string
  /** 发布来源 0=发布任务按钮 1=SKU复制 */
  publishSource: number
  /** 原SKU */
  oldSku: string
  /** 发布人姓名 */
  publisherPersonName: string
  /** 创建时间 */
  createTime: string
  /** 审批时间 */
  approvalTime: string
}
