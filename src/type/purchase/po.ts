// 采购计划-获取采购计划PlanPo
export interface IGetPlanPoListQuery {
  keyWord: string
  status: number //po状态 0待发布 1未达起订量
  pageNo: number
  pageSize: number
}
// 采购计划-获取采购计划PlanPo返回值
export interface IGetPlanPoListResp {
  code: number
  msg: string
  data: {
    total: number
    list: IGetPlanPoList[]
  }
}
export interface IGetPlanPoList {
  // plan po
  id: number
  // 计划POSkuId
  poSkuId: number
  // 创建日期
  createTime: string
  // 请购人
  userName: string
  // 站点编号
  siteId: number
  // 站点名 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3亚马逊CA 4 沃尔玛US
  siteName: string
  // sku图片地址
  skuImageUrl: string
  // SKU
  sku: string
  // 采购sku数量
  purchaseSkuNumber: number
  // 零件名
  componentName: string
  // 零件采购数量
  purchaseCount: string
  // 单位
  unit: string
  // 含税价
  taxIncludedPrice: string
  // 币种 0 RMB 1 USD 2 EUR
  currency: number
  // 供应商名称
  suppliser: string
  // 采购方
  purchase: string
  // 报关状态 0报关 1不报关
  customsDeclarationStatus: number
}
// 查询po sku 零件采购注意事项
export interface IId {
  id: number
}
// 更新po sku 零件采购注意事项
export interface IUpdatePoPurchaseMatters {
  id: number
  purchaseMatters: string
}
// 更新po sku 零件采购合同条款
export interface IUpdatePoContractTerms {
  id: number
  contractTerms: string
}
// 采购计划-批量删除
export interface IIds {
  ids: string
}
// 采购计划-详情PO数据获取返回值
export interface IGetPoDetailResp {
  code: number
  msg: string
  data: {
    id: number
    sku: string
    productName: string
    createTime: string
    productManager: string
    site: number
    repositoryId: number
    orderTotalPrice: number
    minQuantity: number
    numCartons: number
    packedTenRecord: string
    skuRemarks: string
    poRemarks: string
  }
}
export interface IPoSkuId {
  poSkuId: number
}
export interface IGetPoSkuComponentList {
  // 实际税点
  actualTaxRate: number;
  // 零件名
  componentName: string;
  // 零件图片地址
  componentUrl: string;
  // 合同条款
  contractTerms: string;
  // 币种 0RMB 1USD 2EUR
  currency: number;
  // 报关状态 0 报关 1不报关
  customsDeclarationStatus: number;
  // 已有零件id
  existingPartsListId: number;
  // 含税运费
  freight: string;
  // id
  id: number;
  // 开票类型 0专票 1普票 2不开票
  invoicing: number;
  // 开票税点
  invoicingTaxRate: number;
  // 起订量
  minQuantity: number;
  // 模具费
  moldCost: string;
  // 多订数量
  moreCount: null;
  // 整箱数
  numCartons: number;
  // 订单号
  orderNo: string;
  // po sku的id
  poSkuId: number;
  // 总未税价
  preTaxPrice: string;
  // 零件订货总数
  purchaseCount: number;
  // 采购方id
  purchaseId: number;
  // 采购链接
  purchaseLink: string;
  purchaseMatters: string;
  // 收货仓库id
  repositoryId: number;
  // 已有库存
  stock: string;
  // 总含税价
  taxIncludedPrice: string;
  // 出厂总价
  totalPrice: string;
  // 单位
  unit: string;
  // 出厂单价
  unitPrice: string;
  // 使用已有库存数量
  useStockCount: number;
  suppliserId: number
  suppliserList: any
}
export interface IGetPoSkuComponentListResp {
  code: number
  msg: string
  data: IGetPoSkuComponentList[]
}

export interface IRepositoryOption {
  id: number
  label: string
}
export interface IPurchaseOption {
  id: number
  label: string
  type: number
}
export interface ISupplierId {
  suppliserId: number
}
export interface IGetSupplierRateResp {
  code: number
  msg: string
  data: {
    suppliserId: number
    actualZTaxRate: number
    invoicingZTaxRate: number
    actualPTaxRate: number
    invoicingPTaxRate: number
  }
}
// 采购计划-po sku 零件修改
export interface IUpdatePoSkuComponent {
  componentName?: string;
  currency?: number;
  customsDeclarationStatus?: number;
  freight?: number;
  id?: number;
  invoicing?: number;
  minQuantity?: number;
  moldCost?: number;
  moreCount?: number;
  numCartons?: number;
  orderNo?: string;
  purchaseCount?: number;
  purchaseId?: number;
  purchaseLink?: string;
  repositoryId?: number;
  suppliserId?: number;
  taxIncludedPrice?: number;
  totalPrice?: number;
  unit?: string;
  unitPrice?: number;
  useStockCount?: number;
  [property: string]: any;
}