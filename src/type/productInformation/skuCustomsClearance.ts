/** sku清关信息 */
export interface SkuCustomsClearance {
  /** skuId */
  skuId?: number
  /** sku */
  sku?: string
  /** sku图片地址 */
  skuImgUrl?: string
  /** 品名 */
  productName?: string
}

/** 导入sku清关信息查询参数 */
export interface SkuCustomsClearanceQueryReq {
  /**关键词 */
  keyWord?: string
  /** 当前页 */
  pageNo?: number
  /** 每页大小 */
  pageSize?: number
}

/** sku清关信息查询返回 */
export interface SkuCustomsClearanceQueryResp {
  list: SkuCustomsClearance[]
  total?: number
}

/** 从其他Sku中添加清关信息 */
export interface SkuCustomsClearanceAddReq {
  /** 源skuId */
  originSkuId?: number
  /** 目标清关id */
  targetCustomClearanceId?: number
}

/** 获取sku打包工时明细查询参数 */
export interface IGetPackingTimeDetailsReq {
  /** sku */
  sku?: string
  /** 关键词 */
  keyWord?: string
  /** 当前页 */
  pageNo?: number
  /** 每页大小 */
  pageSize?: number
}

/** 获取sku打包工时明细返回 */
export interface IGetPackingTimeDetailsResp {
  list: IGetPackingTimeDetailsItem[]
  total: number
}

export interface IGetPackingTimeDetailsItem {
  /** PO */
  po?: string
  /** 打包日期 */
  startTime?: Date
  /** 打包工时(分钟) */
  workingHours?: number
  /** 完成数量 */
  goodCount?: number
  /** 每个用时(秒) */
  eachTime?: number
}

export interface IGetPackingTimeDetailsChartReq {
  /** sku */
  sku?: string
  /** 开始日期 */
  startTime?: string
  /** 结束日期 */
  endTime?: string
}

export interface IGetPackingTimeDetailsChartResp {
  dates: Date[]
  times: number[]
}

export interface IGetSkuDeliveryTimeChartReq {
  /** sku */
  sku?: string
  /** 开始日期 */
  startTime?: string
  /** 结束日期 */
  endTime?: string
}

export interface IGetSkuDeliveryTimeChartResp {
  x: string[]
  y: number[]
}

export interface ISkuComponentDeliveryTimeDetail {
  /** 分组用的唯一标识，表格合并行时依赖该字段 */
  id: number | string
  /** PO 单号 */
  po: string
  /** PO 发布日期 */
  poReleaseDate: string
  /** SKU */
  sku: string
  /** SKU 签收日期 */
  skuSignDate: string
  /** SKU 交期 */
  deliveryTime: string
  /** 零件名 */
  componentName: string
  /** 供应商 */
  suppliser: string
  /** 零件交期 */
  componentDeliveryTime: string
  /** 零件签收日期 */
  componentSignDate: string
  /** 生产完成日期 */
  productionCompletionDate: string
}

export interface ISkuDeliveryTime {
  /** 分组用的唯一标识，表格合并行时依赖该字段 */
  id: number | string
  /** PO 单号 */
  po: string
  /** PO 发布日期 */
  poReleaseDate: string
  /** SKU */
  sku: string
  /** SKU 签收日期 */
  skuSignDate: string
  /** SKU 交期 */
  deliveryTime: string
  /** 零件名 */
  componentName: string
  /** 供应商 */
  suppliser: string
  /** 零件交期 */
  componentDeliveryTime: string
  /** 零件签收日期 */
  componentSignDate: string
  /** 生产完成日期 */
  productionCompletionDate: string
}

export interface ISkuDeliveryTimeResp {
  data: {
    list: ISkuComponentDeliveryTimeDetail[]
    total: number
  }
}
