export interface IGetPackagingTimeConsolidationListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetPackagingTimeConsolidationListRes {
  data: {
    list: IGetPackagingTimeConsolidationList[]
    total: number
  }
}

export interface IGetPackagingTimeConsolidationList {
  /**
   * 添加日期
   */
  addDate?: string
  /**
   * 添加人
   */
  addPerson?: string
  /**
   * 创建日期
   */
  createTime?: string
  /**
   * 产品
   */
  desc?: string
  /**
   * group id
   */
  groupId?: number
  /**
   * 合并分类组名
   */
  groupName?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * sku
   */
  sku?: string
  /**
   * sku id
   */
  skuId?: number
}

export interface IAddPackagingTimeConsolidationReq {
  groupName: string
  skuIds: number[]
  addPerson: string
}
export interface IAddSkuPackagingTimeConsolidationReq {
  groupId: number
  skuIds: number[]
  addPerson: string
}