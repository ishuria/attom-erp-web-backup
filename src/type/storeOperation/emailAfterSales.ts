export interface IGetEmailAfterSalesListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetEmailAfterSalesListRes {
  data: {
    list: IGetEmailAfterSalesList[]
    total: number
  }
}

export interface IGetEmailAfterSalesList {
  /**
   * 创建日期
   */
  createTime?: string
  /**
   * 客户名
   */
  customerName?: string
  /**
   * 客服来源id
   */
  customerServiceSourceId?: number
  /**
   * 跟进
   */
  followUp?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 是否已回复 1已回复 0未回复
   */
  isReplied?: number
  /**
   * 问题
   */
  issue?: string
  /**
   * 订单id
   */
  orderId?: string
  /**
   * 站点id
   */
  siteId?: number
  /**
   * sku
   */
  sku?: string
  /**
   * 解决方案
   */
  solution?: string
  /**
   * 跟踪新的订单
   */
  trackNewOrder?: string
}

export interface IAddEmailAfterSalesReq {
  sku: string
  customerServiceSourceId: number
  siteId: number
  orderId: number
  customerName: string
  issue: string
}

export interface IUpdateEmailAfterSalesReq {
  id?: number
  customerServiceSourceId?: number
  siteId?: number
  isReplied?: number
  orderId?: string
  customerName?: string
  issue?: string
  solution?: string
  trackNewOrder?: string
  followUp?: string
}