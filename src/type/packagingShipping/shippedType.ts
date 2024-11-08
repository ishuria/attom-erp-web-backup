/**
 * @description 用于新增货代参数的接口
 * @property fullName - 货运代理的全称
 * @property abbreviation - 货运代理的简称
 */
export interface IAddForwarder {
  fullName: string
  abbreviation: string
}

/**
 * @description 站点列表类型
 */
export interface ISiteOption {
  label: string
  id: number
}

/**
 * @description 装箱列表查询参数
 */
export interface IGetEncasementListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IEncasementList {
  /**
   * 装箱日期
   */
  createTime?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 明细id
   */
  encasementDetailId?: number;
  /**
   * 箱规号
   */
  encasementNo?: string;
  /**
   * 毛重
   */
  grossWeight?: string;
  /**
   * 高
   */
  height?: string;
  /**
   * 主键id
   */
  id?: number;
  /**
   * 长
   */
  length?: string;
  /**
   * 数量
   */
  number?: number;
  /**
   * 箱数
   */
  numberOfBoxes?: number;
  /**
   * 产品总数
   */
  productTotalNumber?: number;
  /**
   * 备注
   */
  remarks?: string;
  /**
   * 发货计划日期
   */
  shipmentDate?: string;
  /**
   * 站点
   */
  site?: string;
  /**
   * sku
   */
  sku?: string;
  /**
   * 总体积
   */
  totalVolume?: string;
  /**
   * 总重量kg
   */
  totalWeight?: string;
  /**
   * 宽
   */
  width?: string;
}
/**
 * @description 装箱列表返回
 */
export interface IGetEncasementListRes {
  data: {
    total: number
    list: IEncasementList[]
  }
}
/**
 * @description 箱号
 */
export interface IBoxNumber {
  data: number
}
/**
 * @description 箱号表单
 */
export interface IBoxNumberForm {
  boxNumber: number | undefined
  site: number | undefined
}
/**
 * @description 开始装箱-根据站点和fnSku查询
 */
export interface IGetEncasementSkuReq {
  site: number
  fnSkuOrUpc: string
}
export interface IEncasementSku {
  fnSkuOrUpc?: string
  sku?: string
  productName?: string
  skuImageUrl?: string
}
/**
 * @description 装箱产品表单
 */
export interface IEncasementProduct {
  fnSkuOrUpc: string
  sku: string
  productName: string
  skuImageUrl: string
  count?: number
}
/**
 * @description 开始装箱-根据站点和fnSku查询产品信息返回值
 */
export interface IGetEncasementSkuRes {
  data: IEncasementSku
}

export interface ISubmitEncasementSkuReq {
  /**
   * 装箱数
   */
  encaseCount?: number;
  /**
   * 装箱产品明细
   */
  encasementDetailList?: EncasementDetailList[];
  /**
   * 装箱号
   */
  encasementNo?: number;
  /**
   * 站点
   */
  site?: number;
}

export interface EncasementDetailList {
  /**
   * 数量
   */
  count?: number;
  /**
   * FNSKU
   */
  fnSkuOrUpc?: string;
  /**
   * 产品名
   */
  productName?: string;
  /**
   * SKU
   */
  sku?: string;
}
export interface IBooleanRes {
  data: boolean
}