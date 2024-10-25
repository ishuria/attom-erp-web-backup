export interface IGetSignListQuery {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
}
export interface IGetSignListResp {
  code?: number
  data?: {
    list?: IGetSignList[]
    total?: number
  }
  msg?: string
}

export interface IGetSignList {

  componentName?: string;

  componentUrl?: string;
  /**
   * 跟单日志
   */
  log?: string;
  /**
   * 外发 0不外发 1外发
   */
  outsourced?: number;
  /**
   * 支付时间
   */
  payDate?: string;

  po?: string;

  poDate?: string;
  /**
   * poSku零件的id
   */
  poSkuComponentId?: number;
  /**
   * 生产完成日
   */
  produceCompletionDate?: string;

  productName?: string;
  /**
   * 零件数量
   */
  purchaseCount?: string;
  /**
   * 收货仓库id
   */
  repositoryId?: string;
  /**
   * 收货仓库
   */
  repositoryName?: string;
  /**
   * 剩余可售天数
   */
  sellableDay?: number;
  /**
   * 签收数量
   */
  signCount?: number;
  /**
   * 签收日期
   */
  signDate?: string;
  /**
   * 主键id
   */
  signId?: number;
  /**
   * 站点 0 亚马逊US 1 亚马逊DE 2 亚马逊UK  3亚马逊CA  4 沃尔玛US
   */
  site?: number;

  sku?: string;

  skuImageUrl?: string;
  /**
   * 状态 0待签收 1已签收
   */
  status?: number;
  /**
   * 供应商名称
   */
  suppliserName?: string;

  unit?: string;
}