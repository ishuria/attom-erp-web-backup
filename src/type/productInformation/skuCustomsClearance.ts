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
