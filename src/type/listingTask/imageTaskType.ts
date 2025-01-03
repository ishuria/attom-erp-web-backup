export interface IGetArtDesignTaskListReq {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
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
  _sites: string
  overflow: boolean
  _productManager: string
  overflow2: boolean
}
export interface IAddArtDesignTaskReq {
  sku: string
  taskType: string
  sites: string
  position: number
  artDesignType: number
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
   * 建模渲染人多个用,分割
   */
  moldingPerson?: string
  /**
   * 视频人多个用,分割
   */
  videoPerson?: string
}