export interface IGetKeyProductsListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetKeyProductsListRes {
  data: {
    list: IKeyProductsItem[]
    total: number
  }
}
export interface IKeyProductsItem {
  id: number
  /**
   * 上新日期
   */
  saleDate: string

  /**
   * 产品图片
   */
  skuImgUrl: string

  /**
   * 产品描述
   */
  productDesc: string

  /**
   * SKU
   */
  sku: string

  /**
   * 订货主站点
   */
  siteName: string

  /**
   * 产品经理
   */
  productManager: string

  /**
   * 运营
   */
  operationUserName: string

  /**
   * Vine数量
   */
  vineCount: number

  /**
   * 产品定位
   */
  productPosition: string

  /**
   * 1月末Rating
   */
  janEndRating: string
  /**
   * 2月末 Rating
   */
  febEndRating: string
  /**
   * 3月末 Rating
   */
  marEndRating: string
  /**
   * 4月末 Rating
   */
  aprEndRating: string
  /**
   * 5月末 Rating
   */
  mayEndRating: string
  /**
   * 6月末 Rating
   */
  junEndRating: string

  /**
   * 评分状态
   */
  ratingStatus: number

  /**
   * 状态 0=开启 1=暂停
   */
  status: number
}
