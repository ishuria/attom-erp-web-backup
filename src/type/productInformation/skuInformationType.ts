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
     /**
     * 默认仓库 1云舟-川桥路 2云梧舟 3埃托姆
     */
     defaultRepository?: number;
     /**
      * 欧洲FNSKU
      */
     europeFnSku?: string;
     /**
      * 起订量
      */
     minQuantity?: number;
     /**
      * 北美FNSKU
      */
     northAmericaFnSku?: string;
     /**
      * 整箱数
      */
     numCartons?: number;
     /**
      * 实际总成本
      */
     procurementCost?: number;
     /**
      * 产品短描述
      */
     productDesc?: string;
     /**
      * 产品设计
      */
     productDesign?: string;
     /**
      * 产品经理
      */
     productManager?: string;
     /**
      * 产品名
      */
     productName?: string;
     /**
      * 质检清单
      */
     qualityChecklist?: string;
     /**
      * 备注
      */
     remarks?: string;
     /**
      * sku
      */
     sku?: string;
     /**
      * sku表主键id
      */
     skuId?: number;
     /**
      * sku图片地址
      */
     skuImgUrl?: string;
     /**
      * upc
      */
     upc?: string;
     /**
      * 变体名
      */
     variantName?: string;
}

export interface IupdateProductSku {
    /**
     * 默认仓库 1 云舟 2 云梧舟 3 埃托姆
    */
    defaultRepository?: number;
    /**
    * 起订量
    */
    minQuantity?: number;
    /**
    * 整箱数
    */
    numCartons?: number;
    /**
    * 产品短描述
    */
    productDesc?: string;
    /**
    * 产品设计
    */
    productDesign?: string;
    /**
    * 产品经理
    */
    productManager?: string;
    /**
    * 产品名
    */
    productName?: string;
    /**
    * skuId
    */
    skuId?: number;
    /**
    * 变体名
    */
    variantName?: string;
}

export interface IupdateProductSkuRemark {
    skuId: number
    remarks: string
}