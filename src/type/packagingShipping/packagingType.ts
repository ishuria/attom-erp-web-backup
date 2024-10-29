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

export interface IUpdateProductDate {
  signId: number
  date: string
}

export interface IBooleanResp {
  data?: boolean
}
export interface IStringResp {
  data?: string
}
export interface ISignId {
  signId: number
}

export interface IUpdateSignLog {
  signId: number
  log: string
}
export interface ISignIds {
  signIds: string
}

export interface ISignComponent {
  signId: number
  signCount: number
  signOrder: string
}
export interface IGetSignRecord {
  createTime: string
  id: number
  signCount: number
  signOrder: string
}

export interface IGetSignRecordResp {
  data?: IGetSignRecord[]
}

export interface IUpdateRecordCount {
  signRecordId: number
  count: number
}

export interface IUpdateRecordOrder {
  signRecordId: number
  order: string
}

export interface ISignRecordId {
  signRecordId: number
}

export interface IGetPackageTaskListQuery {
  keyWord: string
  site: number //0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3亚马逊CA 4 沃尔玛US
  status: number //0未到货 1待打包 2已完成 3零头 4售后 5进行中
  pageNo: number
  pageSize: number
}

export interface IGetPackageTaskListResp {
  data?: {
    list?: IGetPackageTaskList[];
    total?: number;
  }
}

export interface IGetPackageTaskList {
  /**
   * 实际完成数
   */
  actualCompletionCount?: number;
  /**
   * 任务id
   */
  id?: number;
  /**
   * 打包注意事项
   */
  packageRemark?: string;
  /**
   * 打包任务数
   */
  packageTaskCount?: number;
  /**
   * PO号
   */
  po?: string;
  /**
   * 优先打包标识 0不优先 1优先
   */
  priorityPackaging?: number;
  /**
   * 产品经理
   */
  productManager?: string;
  /**
   * 清单质检 0不质检 1质检
   */
  qualityCheckStatus?: number;
  /**
   * 推荐数量
   */
  recommendCount?: number;
  /**
   * 发货日期
   */
  sendDate?: string;
  /**
   * 发货站点 0 亚马逊US 1 亚马逊DE 2 亚马逊UK  3亚马逊CA  4 沃尔玛US
   */
  sendSite?: number;
  /**
   * sku
   */
  sku?: string;
  /**
   * sku图片地址
   */
  skuImageUrl?: string;
  [property: string]: any;
}

export interface IGetStartTaskList {
  headerImage: string
  userId: number
  userName: string
}
export interface IGetStartTaskListResp {
  data?: IGetStartTaskList[]
}

export interface IConfirmStartTask {
  taskId: number
  startTaskUserIds: string
}

export interface IGetEndTaskList {
  headerImage: string
  id: number
  userId: number
  userName: string
}
export interface IGetEndTaskListResp {
  data?: IGetEndTaskList[]
}

export interface IConfirmEndTask {
  userIds?: string
}

export interface IUserIds {
  userIds: string
}

export interface IUpdatePriorityPackaging {
  id: number
  priorityPackaging: number
}

export interface IId {
  id: number
}

export interface IGetPackageComponentListResp {
  data: IGetPackageComponentList[];
}

export interface IGetPackageComponentList {
  /**
   * 零件名
   */
  componentName: string;
  /**
   * 零件图片
   */
  componentUrl: string;
  /**
   * 每套sku所需零件数量
   */
  count: number;
  /**
   * 已有零件id
   */
  existingPartsListId: number;
  /**
   * 收货仓库名
   */
  repositoryName: string;
  /**
   * 签收日期
   */
  signDate: null;
  /**
   * 总数
   */
  totalCount: number;
  [property: string]: any;
}

export interface IGetQualityCheckResp {
  data?: IGetQualityCheck
}
export interface IGetQualityCheck {
  /**
   * 坏的数量
   */
  badCount?: number;
  /**
    * 好的数量
    */
  goodCount?: number;
  /**
    * 主键id
    */
  id?: number;
  /**
    * 留样数量
    */
  keepSampleCount?: number;
  /**
    * 缺的数量
    */
  lackCount?: number;
  /**
    * 多的数量
    */
  manyCount?: number;
  /**
    * 任务数
    */
  packageTaskCount?: number;
  /**
    * 打包任务id
    */
  packageTaskId?: number;
  /**
    * 备注
    */
  remark?: string;
}

export interface IAddQualityCheckReq {
  /**
   * 坏的数量
   */
  badCount?: number;
  /**
   * 好的数量
   */
  goodCount: number;
  /**
   * 留样数量
   */
  keepSampleCount?: number;
  /**
   * 缺的数量
   */
  lackCount?: number;
  /**
   * 多的数量
   */
  manyCount?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 打包任务id
   */
  taskId: number;
  [property: string]: any;
}

export interface ISplitPackageTask {
  taskId: number
  splitCount: number
}

export interface IUpdatePackageTask {
  taskId: number
  packageTaskCount?: number
  site: number
}

export interface IUpdatePackageInspection {
  /**
   * 质检报告主键id
   */
  id?: number;
  /**
   * 产品经理打包数量
   */
  packageCount?: number;
  /**
   * 包装高
   */
  packageHeight?: number;
  /**
   * 包装长
   */
  packageLength?: number;
  /**
   * 包装宽
   */
  packageWidth?: number;
  /**
   * 其他反馈
   */
  remark?: string;
  packageWeight?: number
}

export interface IUpdatePackageInspectionDetail {
  id?: number
  pass?: number
  remark?: string
}

export interface IPoId {
  poId: number
}
export interface IGetPackageInspectionResp {
  data?: IGetPackageInspection;
}

/**
* 数据
*/
export interface IGetPackageInspection {
  /**
   * 主键id
   */
  id?: number;
  /**
   * 质检项目列表
   */
  inspectionList?: InspectionList[];
  /**
   * 产品经理打包数量
   */
  packageCount?: number;
  /**
   * 包装高
   */
  packageHeight?: number;
  /**
   * 包装长
   */
  packageLength?: number;
  /**
   * 包装宽
   */
  packageWidth?: number;
  packageWeight?: number;
  /**
   * po
   */
  po?: string;
  /**
   * 产品名
   */
  productName?: string;
  /**
   * 其他反馈
   */
  remark?: string;
  /**
   * sku
   */
  sku?: string;
  [property: string]: any;
}

export interface InspectionList {
  /**
   * 主键id
   */
  id?: number;
  /**
   * 是否通过
   */
  pass?: number;
  /**
   * 质检项目
   */
  qualityInspection?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 检查类型
   */
  type?: number;
  [property: string]: any;
}

export interface IGetAfterSalesListReq {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
}
export interface IGetAfterSalesListResp {
  data?: {
    total: number
    list: IGetAfterSalesList[]
  }
}
export interface IGetAfterSalesList {
  /**
   * 售后方式 ，0退款 1随大货补寄 2单独补寄 3采购 4无法售后 5需要采购
   */
  afterSalesMethod?: number;
  /**
   * 坏的数量
   */
  badCount?: number;
  /**
   * 坏账金额
   */
  badDebtPrice?: string;
  /**
   * 反馈日期
   */
  createTime?: string;
  /**
   * 好的数量
   */
  goodCount?: number;
  /**
   * 售后主键id
   */
  id?: number;
  /**
   * 留样数量
   */
  keepSampleCount?: number;
  /**
   * 缺的数量
   */
  lackCount?: number;
  /**
   * 多的数量
   */
  manyCount?: number;
  /**
   * 订货日期
   */
  orderTime?: string;
  /**
   * PO号
   */
  po?: string;
  /**
   * PO的id
   */
  poId?: number;
  /**
   * 产品sku状态 0正常 1停产
   */
  productionHaltStatus?: number;
  /**
   * 产品名
   */
  productName?: string;
  /**
   * PO总数
   */
  purchaseSkuNumber?: number;
  /**
   * 退款金额
   */
  refundAmount?: string;
  /**
   * 打包反馈内容
   */
  remark?: string;
  /**
   * 待售后
   */
  salesPrice?: string;
  /**
   * sku
   */
  sku?: string;
  /**
   * sku图片地址
   */
  skuImageUrl?: string;
  /**
   * 供应商
   */
  suppliser?: string;
}

export interface IGetAfterSalesLogResp {
  data: IGetAfterSalesLog[];
}

export interface IGetAfterSalesLog {
  /**
   * 坏的数量
   */
  badCount: number;
  /**
   * 反馈时间
   */
  createTime: string;
  /**
   * 好的数量
   */
  goodCount: number;
  /**
   * 留样数量
   */
  keepSampleCount: null;
  /**
   * 缺的数量
   */
  lackCount: number | null;
  /**
   * 日志类型
   */
  logType: string;
  /**
   * 多的数量
   */
  manyCount: null;
  /**
   * 备注
   */
  remark: string;
  /**
   * 待售后
   */
  salesPrice: string;
  /**
   * 任务id
   */
  taskId: number;
  [property: string]: any;
}

export interface IUpdateAfterSales {
  id?: number
  salesPrice: string
  salesMethod: number
}

export interface IConfirmStartMoreTask {
  taskIds: string
  startTaskUserIds: string
}

export interface IGetPackageTimeListReq {
  userId: number
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetPackageTimeListResp {
  data?: {
    list?: IGetPackageTimeList[];
    total?: number;
  }
}

export interface IGetPackageTimeList {
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 姓名
   */
  name?: string;
  /**
   * PO
   */
  po?: string;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * sku
   */
  sku?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 工作时长
   */
  workerHouse?: number;
}

export interface IUpdatePackageTime {
  id: number
  startTime: string
  endTime: string
}

export interface IGetPackageTimeDayRequest {
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 当前页 默认1
   */
  pageNo: number;
  /**
   * 每页大小 默认20
   */
  pageSize: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 用户id
   */
  userId?: number;
  [property: string]: any;
}

export interface IGetPackageTimeDayResp {
  data?: {
    list?: IGetPackageTimeDay[];
    total?: number;
  }
}

export interface IGetPackageTimeDay {
  /**
   * id
   */
  id?: number;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 时间
   */
  time?: string;
  /**
   * 工作时长
   */
  workerHouse?: number;
  [property: string]: any;
}