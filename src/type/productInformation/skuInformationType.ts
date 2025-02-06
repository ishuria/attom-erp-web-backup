import type { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from "/@/type/purchase/po"

export interface IgetProductListQuery {
  keyWord: string
  haltStatus: number
  pageNo: number
  pageSize: number
}
export interface IgetProductList {
  skuId: number
  sku: string
  skuImgUrl: string
  fnSkuUpc: string
  productionHaltStatus: number
  priorityPacking: number
  packagePhotograph: number
  procurementCost: number
  dilapidationCost: number
  packingCost: number
  freightFeeCost: number
  currency: string
  length: number
  width: number
  height: number
  weight: number
  avgTime: number
  avgFluctuation: string
  weightCoefficient: number
  volumeCoefficient: number
  customsDeclaration: string
  invoiceIssuType: string
  productManager: string
}
export interface IgetProductListResp {
  code: number
  msg: string
  data: {
      total: number
      list: IgetProductList[]
  }
}

// SKU信息-sku停产、优先打包、打包拍照状态修改参数
export interface IupdateProductStatus {
  skuId: number
  haltStatus: number
  photographStatus: number
  priorityStatus: number
}
export interface ISkuId {
  skuId: number
}
// SKU详情-获取详情返回
export interface IgetProductSkuDetailResp {
  code: number
  msg: string
  data: IgetProductSkuDetail[]
}

export interface IgetProductSkuDetail {
  // 默认仓库 1云舟-川桥路 2云梧舟 3埃托姆
  defaultRepository?: number
  // 欧洲FNSKU
  europeFnSku?: string
  // 起订量
  minQuantity?: number
  // 北美FNSKU
  northAmericaFnSku?: string
  // 整箱数
  numCartons?: number
  // 实际总成本
  procurementCost?: number
  // 产品短描述
  productDesc?: string
  // 产品设计
  productDesign?: string
  // 产品经理
  productManager?: string
  // 产品名
  productName?: string
  // 质检清单
  qualityChecklist?: string
  // 备注
  remarks?: string
  // sku
  sku?: string
  // sku表主键id
  skuId?: number
  // sku图片地址
  skuImgUrl?: string
  // upc
  upc?: string
  // 变体名
  variantName?: string
}

export interface IupdateProductSku {
  // 默认仓库 1 云舟 2 云梧舟 3 埃托姆
  defaultRepository?: number
  // 起订量
  minQuantity?: number
  // 整箱数
  numCartons?: number
  // 产品短描述
  productDesc?: string
  // 产品设计
  productDesign?: string
  // 产品经理
  productManager?: string
  /**
  * 产品名
  */
  productName?: string
  /**
  * skuId
  */
  skuId?: number
  // 变体名
  variantName?: string
}

export interface IupdateProductSkuRemark {
  skuId: number
  remarks: string
}

// SKU详情-创建零件
export interface IcreateProductComponent {
    /**
     * 实际税点
     */
    actualTaxRate?: string;
    /**
     * 零件名
     */
    componentName?: string;
    /**
     * 开票 0专票 1普票 2无法开票
     */
    invoicing?: number;
    /**
     * 开票税点
     */
    invoicingTaxRate?: string;
    /**
     * sku id
     */
    skuId?: number;
    /**
     * 按单采购 0不按单采购 1按单采购
     */
    status?: number;
    /**
     * 供应商名称
     */
    suppliser?: string;
    /**
     * 类型，0 零件 1耗材
     */
    type?: number;
    /**
     * 零件单位
     */
    unit?: string;
}

export interface IcomponentId {
  componentId: number
}
// SKU详情-修改零件
export interface IupdateProductComponent {
    /**
     * sku配件id
     */
    componentId: number;
    /**
     * 合同条款
     */
    contractTerms?: string;
    /**
     * 货币 0RMB 1USD 2EUR
     */
    currency?: number;
    /**
     * 报关状态 0报关  1不报关
     */
    declareCustomsStatus?: number;
    /**
     * 默认收货仓库
     */
    defaultRepositoryId?: string;
    /**
     * 默认供应商id
     */
    defaultSuppliserId?: number;
    /**
     * 已有零件的id
     */
    existingPartsListId: number;
    /**
     * 供应商零件中间表id
     */
    id: number;
    /**
     * 0专票 1普票 2无法开票
     */
    invoicing?: number;
    /**
     * 起订量
     */
    minimumOrderQuantity?: number;
    /**
     * 整箱数
     */
    numberFullCartons?: number;
    /**
     * 总未含税
     */
    preTaxPrice?: string;
    /**
     * 默认采购方id
     */
    purchaseId?: number;
    /**
     * 采购链接
     */
    purchaseLink?: string;
    /**
     * 零件采购注意事项
     */
    purchaseMatters?: string;
    /**
     * 数量
     */
    quantity?: number;
    /**
     * sku id
     */
    skuId: number;
    /**
     * 供应商零件表id
     */
    suppliserId: number;
    /**
     * 总含税价
     */
    taxIncludedPrice?: string;
    /**
     * 出厂总价
     */
    totalPrice?: string;
    /**
     * 出厂单价
     */
    unitPrice?: string;
    [property: string]: any;
}
// SKU详情-默认供应商、开票下拉修改
export interface IgetChangeProductComponent {
  skuId: number
  existingPartsListId: number
  suppliserId: number
}

export interface IupdateProductComponentName {
  existingPartsListId: number
  componentName: string
}

// SKU详情-添加到其他sku
export interface IaddProductComponentOtherSku {
  skuIds: string
  componentId: number
}

// SKU供应商信息 - 添加供应商
export interface IcreateProductComponentSuppliser {
  skuId?: number
  existingPartsListId?: number
  unit?: string
  suppliser?: string
  invoicing?: number
  actualTaxRate?: string
  invoicingTaxRate?: string
}

export interface IupdateProductComponentSuppliser {
     /**
     * 合同条款
     */
     contractTerms?: string;
     /**
      * 货币 0RMB 1USD 2EUR
      */
     currency?: number;
     /**
      * 已有零件供应商表id
      */
     defaultSuppliserId?: number;
     id?: number;
     componentId?: number;
     skuId?: number;
     /**
      * 0专票 1普票 2无法开票
      */
     invoicing?: number;
     /**
      * 起订量
      */
     minimumOrderQuantity?: number;
     /**
      * 整箱数
      */
     numberFullCartons?: number;
     /**
      * 默认采购方id 0 云舟 1 云梧舟 2 埃托姆
      */
     purchaseId?: number;
     /**
      * 采购链接
      */
     purchaseLink?: string;
     /**
      * 零件采购注意事项
      */
     purchaseMatters?: string;
     /**
      * 总含税价
      */
     taxIncludedPrice?: string;
     /**
      * 出厂单价
      */
     unitPrice?: string;
}

export interface Iid {
    id: number
}
// 耗材信息- 创建耗材
export interface IcreateConsumables {
     /**
     * 实际税点
     */
     actualTaxRate?: string;
     /**
      * 零件名
      */
     componentName?: string;
     /**
      * 开票 0专票 1普票 2无法开票
      */
     invoicing?: number;
     /**
      * 开票税点
      */
     invoicingTaxRate?: string;
     /**
      * 按单采购 0不按单采购 1按单采购
      */
     status?: number;
     /**
      * 供应商名称
      */
     suppliser?: string;
     /**
      * 零件单位
      */
     unit?: string;
}

//耗材信息 - 查询耗材列表
export interface IgetProductConsumables {
    keyWord: string
    pageNo: number
    pageSize: number
}
// 耗材信息 - 添加供应商
export interface IcreateConsumablesSupplier {
     /**
     * 实际税点
     */
     actualTaxRate?: string;
     /**
      * 已有零件id
      */
     existingPartsListId?: number;
     /**
      * 开票 0专票 1普票 2无法开票
      */
     invoicing?: number;
     /**
      * 开票税点
      */
     invoicingTaxRate?: string;
     /**
      * sku id
      */
     skuId?: number;
     /**
      * 供应商名称
      */
     suppliser?: string;
     /**
      * 零件单位
      */
     unit?: string;
}

// 耗材信息 - 耗材信息修改
export interface IupdateConsumablesSupplier {
    defaultSuppliserId?: number
     /**
     * 合同条款
     */
     contractTerms?: string;
     /**
      * 货币 0RMB 1USD 2EUR
      */
     currency?: number;
     /**
      * 已有供应商零件表id
      */
     id?: number;

     /**
      * 已有零件id
      */
     componentId?:number
     /**
      * 零件单位
      */
     componentUnit?:number
     /**
      * 0专票 1普票 2无法开票
      */
     invoicing?: number;
     /**
      * 起订量
      */
     minimumOrderQuantity?: number;
     /**
      * 整箱数
      */
     numberFullCartons?: number;
     /**
      * 默认采购方id 0 云舟 1 云梧舟 2 埃托姆
      */
     purchaseId?: number;
     /**
      * 采购链接
      */
     purchaseLink?: string;
     /**
      * 零件采购注意事项
      */
     purchaseMatters?: string;
     /**
      * 总含税价
      */
     taxIncludedPrice?: string;
     /**
      * 出厂单价
      */
     unitPrice?: string;
     /**
      * 0不按单，1按单采购
      */
     status?:number
}

// 耗材信息 - 添加到其他SKU
export interface IaddConsumablesOtherSku {
    skuIds: string
    componentId: number
}

export interface IConsumablesType {
    consumablesType: string
}

// 供应商 - 修改
export interface IupdateProductSupplier {
    /**
     * 实际税点普票
     */
    actualPTaxRate?: number;
    /**
     * 实际税点专票
     */
    actualZTaxRate?: number;
    /**
     * 地址
     */
    address?: string;
    /**
     * 开户银行
     */
    bank?: string;
    /**
     * 联行号
     */
    bankRoutingNumber?: string;
    /**
     * 联系电话
     */
    contactNumber?: string;
    /**
     * 联系人
     */
    contactPerson?: string;
    /**
     * 开票税点普票
     */
    invoicingPTaxRate?: number;
    /**
     * 开票税点专票
     */
    invoicingZTaxRate?: number;
    /**
     * 优先打包 0不优先 1优先
     */
    packing?: number;
    /**
     * 供应商名称
     */
    suppliser?: string;
    /**
     * 供应商id
     */
    suppliserId?: number;
    /**
     * 税号
     */
    taxNumber?: string;
    /**
     * 开票电话
     */
    telephone?: string;
    /**
     * 特定模版状态 0不使用 1使用
     */
    templateStatus?: number;
    /**
     * 旺旺ID
     */
    wwId?: string;
}
export interface IgetProductSupplierListQuery {
    keyWord: string
    pageNo: number
    pageSize: number
}
export interface IgetProductSupplierList {
      /**
     * 实际税点普票
     */
      actualPTaxRate?: string;
      /**
       * 实际税点专票
       */
      actualZTaxRate?: string;
      /**
       * 地址
       */
      address?: string;
      /**
       * 开户银行
       */
      bank?: string;
      /**
       * 联行号
       */
      bankRoutingNumber?: string;
      /**
       * 联系电话
       */
      contactNumber?: string;
      /**
       * 联系人
       */
      contactPerson?: string;
      /**
       * 开票税点普票
       */
      invoicingPTaxRate?: string;
      /**
       * 开票税点专票
       */
      invoicingZTaxRate?: string;
      /**
       * 优先打包 0不优先 1优先
       */
      packing?: number;
      /**
       * 供应商名称
       */
      suppliser?: string;
      /**
       * 供应商id
       */
      suppliserId?: number;
      /**
       * 税号
       */
      taxNumber?: string;
      /**
       * 开票电话
       */
      telephone?: string;
      /**
       * 特定模版状态 0不使用 1使用
       */
      templateStatus?: number;
      /**
       * 特定模版地址路径
       */
      templateUrl?: string;
      /**
       * 旺旺ID
       */
      wwId?: string;
}
export interface IgetProductSupplierListResp {
    code: number
    msg: string
    data: {
        total: number
        list: IgetProductSupplierList[]
    }
}
export interface IsuppliserId {
    suppliserId: number
}
// 产品补货计算参数 - 获取补货参数列表
export interface IgetProductReplenListQuery {
    keyWord: string
    site: number //站点信息 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3 亚马逊CA 4 亚马逊MX 5 沃尔玛US
    pageNo: number
    pageSize: number
}
export interface IgetProductReplenList {
     /**
     * 所属站点 0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3 亚马逊CA 4 亚马逊MX 5 沃尔玛US
     */
     associatedSite?: number;
     /**
      * 平均交期（近10次）
      */
     avgLead?: string;
     /**
      * 交期平均波动
      */
     avgLeadFluctuation?: string;
     /**
      * 产品补货参数id
      */
     id?: number;
     /**
      * 最小维持库存数量
      */
     minStockPilNumber?: number;
     /**
      * 交期安全天数
      */
     safetyLeadTime?: number;
     /**
      * sku信息
      */
     sku?: string;
     /**
      * sku图片
      */
     skuUrl?: string;
     /**
      * 维持库存天数
      */
     stockPileNumberDays?: number;
     /**
      * 产品分类1
      */
     type1?: string;
}
export interface IgetProductReplenListResp {
    code: number
    msg: string
    data: {
        total: number
        list: IgetProductReplenList[]
    }
}
// 产品补货计算参数 - 批量修改
export interface IupdateProductReplenParams {
  // 产品补货计ids使用,分割
  ids?: string
  // 最小维持库存数量
  minStockPilNumber?: number
  // 维持库存天数
  stockPileNumberDays?: number
  kindId?: number
}
// 零件报关信息 - 获取零件报关信息列表
export interface IgetProductCustomsListQuery {
     /**
     * 零件关键词
     */
     keyWord: string;
     /**
      * 当前页 默认1
      */
     pageNo: number;
     /**
      * 每页大小 默认20
      */
     pageSize: number;
     /**
      * 隐藏停产0，展示停产1
      */
     status1: number;
     /**
      * 隐藏不报关0，展示不报关1
      */
     status2: number;
}
export interface IgetProductCustomsList {
     /**
     * 品牌
     */
     brank?: string;
     /**
      * 清关价格(USD)
      */
     clearancePrice?: number;
     /**
      * 零件图片
      */
     componentImgUrl?: string;
     /**
      * 零件名
      */
     componentName?: string;
     /**
      * 零件总量(g)
      */
     componentWeight?: number;
     /**
      * 云舟采购合同名
      */
     contractName?: string;
     /**
      * 每套有多少开票单位
      */
     count?: number;
     /**
      * 报关覆盖实际重量 0 × 1√
      */
     coveredWeightStatus?: number;
     /**
      * 创建者id
      */
     createUserId?: number;
     /**
      * 我国报关品名
      */
     customsDeclarationNameZh?: string;
     /**
      * 报关状态 0报关 1不报关
      */
     customsDeclarationStatus?: number;
     /**
      * 申报要素
      */
     declarationElements?: string;
     /**
      * 申报要素缩写
      */
     declarationElementsAbbreviation?: string;
     /**
      * 欧洲FNSKU
      */
     europeFnSku?: string;
     /**
      * HS
      */
     hs?: string;
     /**
      * HTS欧洲
      */
     htsEurope?: string;
     /**
      * HTS美国
      */
     htsUs?: string;
     /**
      * 零件报关id
      */
     id?: number;
     /**
      * 制造商英文地址
      */
     manufacturerAddressEn?: string;
     /**
      * 制造商英文名称
      */
     manufacturerEn?: string;
     /**
      * 材质英文
      */
     materialEn?: string;
     /**
      * 材质中文
      */
     materialZh?: string;
     /**
      * 北美FNSKU
      */
     northAmericaFnSku?: string;
     /**
      * 装箱单英文清关品名
      */
     packgeClearanceNameEn?: string;
     /**
      * 装箱单中文清关品名
      */
     packgeClearanceNameZh?: string;
     /**
      * 货源地
      */
     placeOrigin?: string;
     /**
      * 采购价(RMB)
      */
     purchasePrice?: number;
     /**
      * 销售价(USD)
      */
     salePrice?: number;
     /**
      * 所属sku
      */
     sku?: string;
     /**
      * 每套多少法定第1单位
      */
     statutoryCount?: number;
     /**
      * 法定第1单位
      */
     statutoryUnit?: string;
     /**
      * 供应商名
      */
     suppliser?: string;
     /**
      * 出口退税税率
      */
     taxRate?: number;
     /**
      * 开票型号
      */
     type?: string;
     /**
      * 开票单位
      */
     unit?: string;
     /**
      * UPC
      */
     upc?: string;
     /**
      * 用途英文
      */
     usageEn?: string;
     /**
      * 用途中文
      */
     usageZh?: string;
}
export interface IgetProductCustomsListResp {
    code: number
    msg: string
    data: {
        total: number
        list: IgetProductCustomsList[]
    }
}
// 零件报关信息 - 修改零件报关信息
export interface IupdateProductCustoms {
  // 品牌
  brank?: string
  // 清关价格(USD)
  clearancePrice?: number
  // 零件总量(g)
  componentWeight?: number
  // 云舟采购合同名
  contractName?: string
  // 每套有多少开票单位
  count?: number
  // 报关覆盖实际重量 0 × 1√
  coveredWeightStatus?: number
  // 创建者id
  createUserId?: number
  // 我国报关品名
  customsDeclarationNameZh?: string
  // 报关状态 0报关 1不报关
  customsDeclarationStatus?: string
  // 申报要素
  declarationElements?: string
  // 申报要素缩写
  declarationElementsAbbreviation?: string
  // 欧洲FNSKU
  europeFnSku?: string
  // HS
  hs?: string
  // HTS欧洲
  htsEurope?: string
  // HTS美国
  htsUs?: string
  // 零件报关id
  id?: number
  // 制造商英文地址
  manufacturerAddressEn?: string
  // 制造商英文名称
  manufacturerEn?: string
  // 材质英文
  materialEn?: string
  // 材质中文
  materialZh?: string
  // 北美FNSKU
  northAmericaFnSku?: string
  // 装箱单英文清关品名
  packageClearanceNameEn?: string
  // 装箱单中文清关品名
  packageClearanceNameZh?: string
  // 货源地
  placeOrigin?: string
  // 采购价(RMB)
  purchasePrice?: number
  // 销售价(USD)
  salePrice?: number
  // 每套多少法定第1单位
  statutoryCount?: number
  // 法定第1单位
  statutoryUnit?: string
  // 出口退税税率
  taxRate?: number
  // 开票型号
  type?: string
  // 开票单位
  unit?: string
  // UPC
  upc?: string
  // 用途英文
  usageEn?: string
  // 用途中文
  usageZh?: string
  pId?: number
  [property: string]: any
}
// SKU质检清单-查询
export interface IgetProductQualityInspection {
  checkType: number
  id: number
  packagePrecautions: string
  skuId: number
  status: number
}
export interface IgetProductQualityInspectionResp {
  code: number
  msg: string
  data: IgetProductQualityInspection[]
}

export interface IaddProductQualityInspection {
  skuId?: number
  status?: number
  checkType?: number
  packagePrecautions?: string
}

export interface ISuppliserName {
  suppliserName: string
}
// SKU零配件清单-保存采购注意事项
export interface IsaveProductPurchaseMatters {
  id: number
  purchaseMatters: string
}

export interface IsaveProductContractTerms {
  id: number
  contractTerms: string
}

export interface IgetProductSupplier {
  code: number
  msg: string
  data: {
      actualPTaxRate: number
      actualZTaxRate: number
      invoicingPTaxRate: number
      invoicingZTaxRate: number
      suppliserId: number
  }
}

export interface IexistingPartsListId {
  existingPartsListId: number
}

export interface IgetProductAllName {
  name: string
}

export interface ISubmitProductComponentQuery {
  skuId: number
  list: ISubmitPurchaseComponent[]
}

export interface ISubmitProductConsumableQuery {
  skuId: number
  list: ISubmitPurchaseConsumable[]
}

export interface IGetProductAllReadyCOmponentListQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IUpdateProductAlreadyComponent {
  id: number
  ratio: string
}

export interface IBooleanResp {
  data: boolean
}

export interface IGetCustomsClearanceSkuListReq {
  keyWord: string
  status: number
  pageNo: number
  pageSize: number
}
export interface IGetCustomsClearanceSkuListRes {
  data?: {
    list?: IGetCustomsClearanceSkuList[]
    total?: number
  }
}

export interface IGetCustomsClearanceSkuList {
  /**
   * 品牌
   */
  brank?: string
  /**
   * 英文清关品名
   */
  clearanceNameEn?: string
  /**
   * 中文清关品名
   */
  clearanceNameZh?: string
  /**
   * 申报要素
   */
  declarationElements?: string
  /**
   * 申报要素缩写
   */
  declarationElementsAbbreviation?: string
  /**
   * SKU描述
   */
  description?: string
  /**
   * 欧洲FNSKU
   */
  europeFnSku?: string
  /**
   * HS
   */
  hs?: string
  /**
   * HTS欧洲
   */
  htsEurope?: string
  /**
   * HTS美国
   */
  htsUs?: string
  /**
   * sku报关id
   */
  id?: number
  /**
   * 制造商英文地址
   */
  manufacturerAddressEn?: string
  /**
   * 制造商英文名称
   */
  manufacturerEn?: string
  /**
   * 材质英文
   */
  materialEn?: string
  /**
   * 材质中文
   */
  materialZh?: string
  /**
   * 北美FNSKU
   */
  northAmericaFnSku?: string
  /**
   * SKU
   */
  sku?: string
  /**
   * SKU图片
   */
  skuImgUrl?: string
  /**
   * UPC
   */
  upc?: string
  /**
   * 用途英文
   */
  usageEn?: string
  /**
   * 用途中文
   */
  usageZh?: string
}

export interface IUpdateCustomsClearanceSku {
  /**
   * 品牌
   */
  brank?: string
  /**
   * 英文清关品名
   */
  clearanceNameEn?: string
  /**
   * 中文清关品名
   */
  clearanceNameZh?: string
  /**
   * 申报要素
   */
  declarationElements?: string
  /**
   * 申报要素缩写
   */
  declarationElementsAbbreviation?: string
  /**
   * HS
   */
  hs?: string
  // /**
  //  * HTS欧洲
  //  */
  // htsEurope?: string
  // /**
  //  * HTS美国
  //  */
  // htsUs?: string
  /**
   * sku报关id
   */
  id?: number
  /**
   * 制造商英文地址
   */
  manufacturerAddressEn?: string
  /**
   * 制造商英文名称
   */
  manufacturerEn?: string
  /**
   * 材质英文
   */
  materialEn?: string
  /**
   * 材质中文
   */
  materialZh?: string
  /**
   * 出口退税税率
   */
  taxRate?: number
  /**
   * 用途英文
   */
  usageEn?: string
  /**
   * 用途中文
   */
  usageZh?: string
}
export interface IGetCustomsClearanceRatioRes {
  data?: {
    // 清关系数
    customClearanceCoefficient?: number
    id?: number;
    // 随机大价格系数
    maxProcurementCoefficient?: number
    // 随机最小价格系数
    minProcurementCoefficient?: number
    // 销售价格系数1
    salesCoefficient1?: number
    // 销售价格系数2
    salesCoefficient2?: number
  }
}

export interface IUpdateCustomsClearanceRatioReq {
  // 清关系数
  customClearanceCoefficient?: number
  // 随机大价格系数
  maxProcurementCoefficient?: number
  // 随机最小价格系数
  minProcurementCoefficient?: number
  // 销售价格系数1
  salesCoefficient1?: number
  // 销售价格系数2
  salesCoefficient2?: number
}

export interface IUpdateProductCustomsClearanceStatus {
  id: number
  status: number
}

