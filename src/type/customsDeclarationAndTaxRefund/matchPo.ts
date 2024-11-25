export interface IGetMatchPoListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetMatchPoListRes {
  data: {
    list: IGetMatchPoList[];
    total: number;
  }
}

export interface IGetMatchPoList {
  /**
   * 货代渠道id
   */
  channelId?: number
  /**
   * 合同编号
   */
  contractNumber?: string
  /**
   * 货代单号
   */
  freightForwardingNumber?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 匹配状态 0待匹配 1已匹配
   */
  matchStatus?: number
  /**
   * 打包归档状态 0待打包归档 1已打包归档
   */
  packArchiveStatus?: number
  /**
   * 运费状态 0未付 1部分付 2全付
   */
  payStatus?: number
  /**
   * referenceID
   */
  referenceId?: string
  /**
   * 发货日期
   */
  shipmentDate?: string
  /**
   * shipmentId
   */
  shipmentId?: string
  /**
   * 站点
   */
  site?: string
  /**
   * 退税状态 0待归档到退税关联 1已归档到退税关联
   */
  taxRefundStatus?: number
  /**
   * 产品总数
   */
  totalNumber?: number
  /**
   * 体积m³
   */
  volume?: number
  /**
   * 重量kg
   */
  weight?: number
  lockStatus: number | null
  status: number | null
}

export interface IGetMatchPackageListReq {
  sku: string
  status: number
  matchId: number
}
export interface IGetMatchPackageListRes {
  code: number;
  data: IGetMatchPackageList[];
  msg: string;
}

export interface IGetMatchPackageList {
  /**
   * 零件实际数量
   */
  componentActualCount: number;
  /**
   * 零件名
   */
  componentName: string;
  /**
   * 报关状态 0报关 1不报关
   */
  customsDeclarationStatus: number;
  customsDeclarationCount: number
  /**
   * 描述
   */
  description: string;
  /**
   * 详情id
   */
  dId: number;
  /**
   * 好的数量
   */
  goodCount: null;
  /**
   * id
   */
  mId: number;
  /**
   * 打包任务数
   */
  packageTaskCount: number;
  /**
   * po
   */
  po: string;
  /**
   * po的零件id
   */
  poComponentId: number;
  /**
   * po的id
   */
  poId: number;
  /**
   * 采购方
   */
  purchase: string;
  /**
   * po的零件订货总数
   */
  purchaseCount: null;
  purchaseId: null;
  /**
   * 剩余可报数量
   */
  reportable: number;
  /**
   * 站点名称
   */
  siteName: string;
  /**
   * sku
   */
  sku: string;
  /**
   * sku实际数量
   */
  skuActualCount: number;
  /**
   * 打包任务状态
   */
  status: null
  /**
   * 任务id
   */
  taskId: number
  /**
   * 已报未发数量
   */
  ybwfCount: number
  /**
   * 已发未报数量
   */
  yfwbCount: number
}

export interface IGetCheckMatchListRes {
  code: number
  data: {
    list: IGetCheckMatchList[];
    total: number;
  }
  msg: string
}

export interface IGetCheckMatchList {
  /**
   * 零件实际数
   */
  actualComponentCount: null;
  /**
   * 零件部分的id
   */
  cId: number | null;
  /**
   * 零件名
   */
  componentName: string;
  /**
   * 退税报关数量
   */
  customsDeclarationCount: number | null;
  /**
   * 报关状态
   */
  customsDeclarationStatus: null;
  /**
   * sku的描述
   */
  desc: string;
  /**
   * 装箱个数
   */
  encasementCount: number;
  /**
   * 已发未报标识
   */
  flag: boolean;
  /**
   * id
   */
  id: number;
  /**
   * sku匹配id
   */
  pId: number | null;
  /**
   * po号
   */
  po: string;
  /**
   * po零件id
   */
  poComponentId: null;
  /**
   * po的id
   */
  poId: number | null;
  /**
   * 采购方
   */
  purchase: string;
  /**
   * po零件采购总数
   */
  purchaseCount: number | null;
  /**
   * 站点
   */
  site: string;
  /**
   * sku
   */
  sku: string;
  /**
   * sku实际完成数量
   */
  skuActualCount: null;
}

export interface IBooleanRes {
  data: boolean
}
export interface IUpdateMatchSkuCount {
  id?: number
  poId: number
  sku: string
  mId: number
  skuCount: number
}
export interface IUpdateMatchComponentActualCount {
  id: number
  mId: number
  dId: number
  count: number
}

export interface IInsertAllMatchComponent {
  id: number
  poId: number
  sku: string
  mId: number
}

export interface IClearMatchComponent {
  mId: number
  id: number
}

export interface IClearAllMatchComponent {
  mIds: string
  id: number
}

export interface IGetMatchSentListRes {
  data: {
    list: IGetMatchSentList[]
    total: number
  }
}

export interface IGetMatchSentList {
  /**
   * 零件名
   */
  componentName?: string;
  /**
   * 描述
   */
  desc?: string;
  /**
   * 主键id
   */
  id?: number;
  /**
   * po号
   */
  po?: string;
  /**
   * po的零件id
   */
  poComponentId?: number;
  /**
   * po的id
   */
  poId?: number;
  /**
   * 采购方
   */
  purchase?: string;
  /**
   * SKU
   */
  sku?: string;
  /**
   * 已报未发数量
   */
  ybwfCount?: number;
  /**
   * 已发未报数量
   */
  yfwbCount?: number;
  [property: string]: any;
}

export interface IId {
  id: number
}
export interface IIds {
  ids: string
}

export interface IClearUnlockMatchShipment {
  id: number
  ids: string
}
export interface ISubmitMatchSentList {
  id: number
  idList: number[]
}

export interface IUpdateMatchQuality {
  mId: number
  taskId: number
  goodCount: number
  manyCount: number
  keepSampleCount: number
  lackCount: number
  badCount: number
}

export interface IUpdateShipment {
  id: number
  contractNumber?: string
  referenceId?: string
  shipmentNumber?: string
}

export interface IUpdateShipmentFreightFee {
  id: number
  freightFee: string
}

export interface IUpdateShipmentPay {
  id: number
  status: number
}

export interface IShipId {
  shipId: number
}