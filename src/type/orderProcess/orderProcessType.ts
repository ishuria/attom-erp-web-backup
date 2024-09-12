// 新品订货流程-删除变体信息
export interface IreviewStepNo1Del {
    orderEntryId: number
}

export interface IvariantsList {
    variantName: string //变体名
    amazonUSVariantQuantity: number | undefined//订货数量（亚马逊US）
    orderEntryId: number //变体id
}
// 新品订货流程-产品基础信息输入保存
export interface IreviewStepNo1SaveOn {
    progressId?: number
    variantSku?: string //合并变体sku
    productName: string //主品名
    productDesc: string //描述
    variantList: IvariantsList[] //变体列表
    reviewId?: number //审核id
}
// 拿样零件添加列表
export interface IComponentAdd {
    // 进度id
    progressId: string
    // 零件id
    componentId?: number | null
    // 零件图片
    componentImg?: string | null
    // 零件名
    componentName?: string | null
    // 已有零件id
    skuComponentId?: number | null
    // 零件数量
    componentQuantity?: number | null
    // 零件单位
    componentUnit?: string | null
    // 出厂单价
    unitPrice?: number | null
    // 出厂总价
    totalPrice?: number | null
    // 运费（含税）
    freight?: number | null
    // 总未税价
    preTaxPrice?: number | null
    // 总含税价
    taxIncludedPrice?: number | null
    // 货币 0人民币 1USD 2EUR
    currency?: string | null
    // 供应商
    supplier?: string | null
}
// 新品订货流程-拿样零件添加-继续
export interface IreviewStepNo2Savetw {
    suppliserIds: string
    reviewId: number | undefined
}
export interface IreviewId {
    reviewId: number
}
export interface IreviewStepNo3ComponentDel {
    reviewComponentId: number
}
export interface IreviewStepNo3ComponentUpdate {
    /**
     * 实际税点
     */
    actualTaxRate?: number;
    /**
     * 零件名
     */
    componentName?: string;
    /**
     * 零件单位
     */
    componentUnit?: string;
    /**
     * 货币 0RMB 1USD 2EUR
     */
    currency?: number;
    /**
     * 运费（含税）
     */
    freight?: number;
    /**
     * 0专票 1普票 2无法开票
     */
    invoicing?: number;
    /**
     * 开票税点
     */
    invoicingTaxRate?: number;
    /**
     * 起订量
     */
    minimumOrderQuantity?: number;
    /**
     * 整箱数
     */
    numberFullCartons?: number;
    /**
     * 详情id
     */
    orderEntryId?: number;
    /**
     * 总价未税价
     */
    preTaxPrice?: number;
    /**
     * 采购链接
     */
    purchaseLink?: string;
    /**
     * 数量
     */
    quantity?: number;
    /**
     * 审核零件表
     */
    reviewComponentId?: number;
    /**
     * 供应商
     */
    supplier?: string;
    /**
     * 总含税价
     */
    taxIncludedPrice?: number;
    /**
     * 出厂总价
     */
    totalPrice?: number;
    /**
     * 出厂单价
     */
    unitPrice?: number;
    /**
     * 变体
     */
    variant?: string;
}
export interface IreviewStepNo3ComponentListResp {
    code: number
    data: IreviewStepNo3ComponentList[]
    msg: string
}
export interface IreviewStepNo3ComponentList {
    /**
    * 实际税点
    */
    actualTaxRate: string;
    /**
    * 零件图片地址
    */
    componentImgUrl: string;
    /**
    * 零件名
    */
    componentName: string;
    /**
    * 零件单位
    */
    componentUnit: string;
    /**
    * 合同条款
    */
    contractTerms: string;
    /**
    * 货币 0RMB 1USD 2EUR
    */
    currency: number | null;
    /**
    * 运费（含税）
    */
    freight: string;
    /**
    * 0专票 1普票 2无法开票
    */
    invoicing: number | null;
    /**
    * 开票税点
    */
    invoicingTaxRate: string;
    /**
    * 起订量
    */
    minimumOrderQuantity: number | null;
    /**
    * 整箱数
    */
    numberFullCartons: number | null;
    /**
    * 变体d
    */
    orderEntryId: number | null;
    /**
    * 总价未税价
    */
    preTaxPrice: string;
    /**
    * 采购链接
    */
    purchaseLink: string;
    /**
    * 零件采购注意事项
    */
    purchaseMatters: string;
    /**
    * 数量
    */
    quantity: number | null;
    /**
    * 零件id
    */
    reviewComponentId: number | null;
    /**
    * 审核id
    */
    reviewId: number | null;
    /**
    * 供应商
    */
    supplier: string;
    /**
    * 总含税价
    */
    taxIncludedPrice: string;
    /**
    * 出厂总价
    */
    totalPrice: string;
    /**
    * 出厂单价
    */
    unitPrice: string;
    /**
    * 零件所属变体
    */
    variant: string;
}