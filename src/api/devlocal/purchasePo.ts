import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type {
  IAddPoSKUQuery,
  IApplyPurchaseReductionCostReq,
  IBooleanResp,
  IComponentName,
  ICreatePlanPoResp,
  IDelPayRecord,
  IGeneratePoContractQuery,
  IGenerateRemittance,
  IGetAddComponentListQuery,
  IGetAddComponentListResp,
  IGetAddConsumableListQuery,
  IGetAddConsumableListResp,
  IGetComponentPayRecordResp,
  IGetOrderMoreComponentQuery,
  IGetOrderMoreComponentResp,
  IGetPlanPoListQuery,
  IGetPlanPoListResp,
  IGetPoDetailResp,
  IGetPoListQuery,
  IGetPoListResp,
  IGetPoSkuComponentListResp,
  IGetPurchaseComponentCustomInfo,
  IGetSignatureSettingListQuery,
  IGetSignatureSettingListResp,
  IGetSupplierRateResp,
  IId,
  IIds,
  INumberResp,
  IPacakgeTaskReq,
  IPoId,
  IPoIds,
  IPoSkuComponentId,
  IPoSkuId,
  IPurchasePoAutoPay,
  IPurchasePoAutoPayQueryItem,
  IPurchaseSkuReplace,
  IPurchaseTotalAp,
  ISku,
  IStringResp,
  ISubmitPurchaseComponentQuery,
  ISubmitPurchaseConsumableQuery,
  ISupplierId,
  IUpdateBuyerAndCustomsDeclaration,
  IUpdateComponentAllPay,
  IUpdateComponentPayPartQuery,
  IUpdateCreateComponentRequest,
  IUpdateCreateSkuCountRequest,
  IUpdateCreateSkuCountResponse,
  IUpdatePayRecord,
  IUpdatePoContractTerms,
  IUpdatePoPurchaseMatters,
  IUpdatePoRemarks,
  IUpdatePoSite,
  IUpdatePoSkuComponent,
  IUpdatePoSkuComponentSuppliser,
  IUpdateSkuCount,
  IUpdateSkuDetail,
} from '/@/type/purchase/po'

import type { IGetAllNameReq } from '/@/type/user/userType'

// 采购计划-获取采购计划PlanPo
export function getPlanPoList(data?: IGetPlanPoListQuery): Promise<IGetPlanPoListResp> {
  return request({
    url: `${BASE_API}/purchase/planPo/list`,
    method: 'post',
    data,
  })
}

// 查询po sku 零件采购注意事项
export function getPoPurchaseMatters(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/purchaseMatters`,
    method: 'get',
    params,
  })
}
// 采购计划-详情PO数据获取
export function getPoDetail(params: IId): Promise<IGetPoDetailResp> {
  return request({
    url: `${BASE_API}/purchase/po/detail`,
    method: 'get',
    params,
  })
}
// 采购计划 - PO-SKU配件详情表
export function getPoSkuComponentList(params: IPoSkuId): Promise<IGetPoSkuComponentListResp> {
  return request({
    url: `${BASE_API}/purchase/po/skuComponent/list`,
    method: 'get',
    params,
  })
}
// 查询po sku 零件的合同条款
export function getPoContractTerms(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/contractTerms`,
    method: 'get',
    params,
  })
}
// 采购计划 - 获取供应商税点信息
export function getSupplierRate(params?: ISupplierId): Promise<IGetSupplierRateResp> {
  return request({
    url: `${BASE_API}/purchase/suppliser/rate`,
    method: 'get',
    params,
  })
}
// 获取PO的SKU的ID列表
export function getPoSkuIdList(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/poSkuId/list`,
    method: 'get',
    params,
  })
}
// 采购订单 - 查询列表
export function getPoList(params?: IGetPoListQuery): Promise<IGetPoListResp> {
  return request({
    url: `${BASE_API}/purchase/po/list`,
    method: 'get',
    params,
  })
}
// 零件付款记录详情
export function getComponentPayRecord(params: IPoSkuComponentId): Promise<IGetComponentPayRecordResp> {
  return request({
    url: `${BASE_API}/purchase/component/pay/record`,
    method: 'get',
    params,
  })
}
// 自动签收零件查询
export function getSignatureSettingList(params: IGetSignatureSettingListQuery): Promise<IGetSignatureSettingListResp> {
  return request({
    url: `${BASE_API}/purchase/signature/setting/list`,
    method: 'get',
    params,
  })
}
// 获取自动签收零件信息
export function getSearchComponent(params: IComponentName) {
  return request({
    url: `${BASE_API}/search/component`,
    method: 'get',
    params,
  })
}
// 获取添加零件列表
export function getAddComponentList(params: IGetAddComponentListQuery): Promise<IGetAddComponentListResp> {
  return request({
    url: `${BASE_API}/list/component`,
    method: 'get',
    params,
  })
}

// 获取添加零件列表
export function queryPoSkuComponentList(data: IGetAddComponentListQuery): Promise<IGetAddComponentListResp> {
  return request({
    url: `${BASE_API}/list/purchase/sku/component`,
    method: 'post',
    data,
  })
}
// 获取添加耗材列表
export function getAddConsumableList(params: IGetAddConsumableListQuery): Promise<IGetAddConsumableListResp> {
  return request({
    url: `${BASE_API}/list/consumables`,
    method: 'get',
    params,
  })
}
// 获取po零件添加耗材列表
export function queryPoSkuConsumableList(data: IGetAddConsumableListQuery): Promise<IGetAddConsumableListResp> {
  return request({
    url: `${BASE_API}/list/purchase/sku/consumables`,
    method: 'post',
    data,
  })
}
// 采购添加SKU-根据输入查询所有的sku列表
export function getPoSkuList(params: ISku) {
  return request({
    url: `${BASE_API}/purchase/poSku/list`,
    method: 'get',
    params,
  })
}
// 更新po sku 零件采购注意事项
export function updatePoPurchaseMatters(params?: IUpdatePoPurchaseMatters) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/update/purchaseMatters`,
    method: 'post',
    params,
  })
}
// 采购计划-批量删除
export function deleteAllPlanPo(params?: IIds) {
  return request({
    url: `${BASE_API}/purchase/planPo/delete`,
    method: 'post',
    params,
  })
}
// 批量发布PO
export function releaseBatchPlanPo(params?: IPoIds) {
  return request({
    url: `${BASE_API}/purchase/batch/release/po`,
    method: 'post',
    params,
  })
}
// 采购计划-未达起订量
export function updatePlanPoStatus(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/planPo/update/status`,
    method: 'post',
    params,
  })
}
// 采购计划-发布PO
export function releasePlanPo(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/release/po`,
    method: 'post',
    params,
  })
}
// 更新po sku 零件采购合同条款
export function updatePoContractTerms(params: IUpdatePoContractTerms) {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/update/contractTerms`,
    method: 'post',
    params,
  })
}
// 采购计划 - PO-SKU零件清单删除
export function deletePoSkuComponent(params: IId) {
  return request({
    url: `${BASE_API}/purchase/po/skuComponent/delete`,
    method: 'post',
    params,
  })
}
// 采购计划-po sku 零件修改
export function updatePoSkuComponent(data: IUpdatePoSkuComponent) {
  return request({
    url: `${BASE_API}/purchase/po/update`,
    method: 'post',
    data,
  })
}

// 采购计划-po sku 零件供应商修改
export function updatePoSkuComponentSuppliser(data: IUpdatePoSkuComponentSuppliser) {
  return request({
    url: `${BASE_API}/purchase/po/component/suppliser/update`,
    method: 'post',
    data,
  })
}

// 采购sku详情更新(除订货套数外)
export function updateSkuDetail(data: IUpdateSkuDetail) {
  return request({
    url: `${BASE_API}/purchase/sku/update`,
    method: 'post',
    data,
  })
}
// 采购PO的站点更新
export function updatePoSite(params: IUpdatePoSite) {
  return request({
    url: `${BASE_API}/purchase/po/site/update`,
    method: 'post',
    params,
  })
}
// 采购PO的备注更新
export function updatePoRemarks(params: IUpdatePoRemarks) {
  return request({
    url: `${BASE_API}/purchase/poRemarks/update`,
    method: 'post',
    params,
  })
}
// PO-SKU详情图片上传
export function updateSkuImg(data?: FormData): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/purchase/updateSk/img`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
// PO-SKU详情图片删除
export function deleteSkuImg(params?: IPoSkuId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/updateSk/img/delete`,
    method: 'post',
    params,
  })
}
// PO详情删除SKU
export function deletePoSku(params?: IPoSkuId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/po/sku`,
    method: 'post',
    params,
  })
}
// 删除PlanPo
export function deletePlanPo(params?: IPoId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/planPo`,
    method: 'post',
    params,
  })
}
// PO详情SKU订货套数更新
export function updateSkuCount(params?: IUpdateSkuCount): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/sku/count/update`,
    method: 'post',
    params,
  })
}
// 更新单价
export function updateComponentPrice(params?: IPoSkuComponentId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/sku/component/price/update`,
    method: 'post',
    params,
  })
}
// 价格更新
export function updateAllComponentPrice(params?: IPoSkuId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/update/sku/allComponent/price`,
    method: 'post',
    params,
  })
}
// 采购方和不报关更新
export function updateBuyerAndCustomsDeclaration(params?: IUpdateBuyerAndCustomsDeclaration): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/update/theBuyerAndCustomsDeclaration`,
    method: 'post',
    params,
  })
}
// 创建PlanPO（采购计划）
export function createPlanPo(data?: any) {
  return request({
    url: `${BASE_API}/purchase/create/planPo`,
    method: 'post',
    data,
  })
}
// 采购订单-删除PO
export function deletePo(params: IIds): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/po/delete`,
    method: 'post',
    params,
  })
}
/**
 * 采购计划 - poSku零件清单删除
 * @param params
 * @returns
 */
export function deletePurchasePlanPoSkuComponent(params: { id: number }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/planPo/skuComponent/delete`,
    method: 'post',
    params,
  })
}
/**
 * 采购计划-SKU删除
 * @param params
 * @returns
 */
export function deletePurchasePlanPo(params: { poSkuId: number }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/planPo/sku`,
    method: 'post',
    params,
  })
}
// 采购订单-已付尾款/全款
export function updateComponentAllPay(data: IUpdateComponentAllPay) {
  return request({
    url: `${BASE_API}/purchase/component/AllPay`,
    method: 'post',
    data,
  })
}
// 分批付款
export function updateComponentPayPart(data: IUpdateComponentPayPartQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/component/payPart`,
    method: 'post',
    data,
  })
}
// 采购订单-删除零件的付款记录
export function delPayRecord(params: IDelPayRecord): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/payRecord`,
    method: 'post',
    params,
  })
}
// 采购订单-修改零件付款记录
export function updatePayRecord(params: IUpdatePayRecord): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/update/payRecord`,
    method: 'post',
    params,
  })
}
// 采购订单 - 自动签收设定 - 新增
export function addSignatureSettings(params: IId): Promise<INumberResp> {
  return request({
    url: `${BASE_API}/purchase/add/signature/settings`,
    method: 'post',
    params,
  })
}
// 采购订单 - 自动签收设定 - 删除
export function delSignatureSettings(params: IId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/signature/settings`,
    method: 'post',
    params,
  })
}
// 零件图片上传
export function uploadComponentImg(data?: FormData): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/purchase/po/component/img/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
// 零件图片删除
export function deleteComponentImg(params?: IId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/po/component/img/delete`,
    method: 'post',
    params,
  })
}
// 添加零件提交
export function submitPurchaseComponent(data?: ISubmitPurchaseComponentQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/submit/component`,
    method: 'post',
    data,
  })
}
// 添加耗材提交
export function submitPurchaseConsumable(data?: ISubmitPurchaseConsumableQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/submit/consumables`,
    method: 'post',
    data,
  })
}
// 采购订单-退款
export function updateComponentRefund(data?: FormData): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/component/refund`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
// 采购订单-总价分摊
export function purchaseTotalAp(data?: IPurchaseTotalAp): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/purchaseTotal/ap`,
    method: 'post',
    data,
  })
}
// 采购订单-生成PO合同
export function generatePoContract(data: IGeneratePoContractQuery) {
  return request({
    url: `${BASE_API}/purchase/generate/contract`,
    method: 'post',
    data,
  })
}
// 采购订单-聚合合同
export function aggregationContract(data: FormData) {
  return request({
    url: `${BASE_API}/purchase/aggregation/contract`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}
// 添加SKU提交确定按钮
export function addPoSKU(params: IAddPoSKUQuery): Promise<ICreatePlanPoResp> {
  return request({
    url: `${BASE_API}/purchase/add/po/sku`,
    method: 'post',
    params,
  })
}
// 采购订单-生成汇款模板
export function generateRemittance(data: IGenerateRemittance) {
  return request({
    url: `${BASE_API}/purchase/generate/remittance`,
    method: 'post',
    data,
  })
}
// 多订零件库存查询
export function getOrderMoreComponent(params: IGetOrderMoreComponentQuery): Promise<IGetOrderMoreComponentResp> {
  return request({
    url: `${BASE_API}/purchase/orderMore/component`,
    method: 'get',
    params,
  })
}

// 获取产品SKU信息
export function getPurchaseSKU(params: ISku) {
  return request({
    url: `${BASE_API}/purchase/getSku`,
    method: 'post',
    params,
  })
}
// 创建planPo修改订货套数
export function updateCreateSkuCount(data?: IUpdateCreateSkuCountRequest): Promise<IUpdateCreateSkuCountResponse> {
  return request({
    url: `${BASE_API}/purchase/calculation/skuPurchaseCount`,
    method: 'post',
    data,
  })
}
// 创建planPo修改零件
export function updateCreateComponent(data?: IUpdateCreateComponentRequest[]) {
  return request({
    url: `${BASE_API}/purchase/skuComponent/change`,
    method: 'post',
    data,
  })
}

// 采购计划-批量未达起订量
export function planPoNrMoq(params?: IIds) {
  return request({
    url: `${BASE_API}/purchase/planPo/nr/moq`,
    method: 'post',
    params,
  })
}
// 采购计划-达起订量
export function planPorMoq(params?: IId) {
  return request({
    url: `${BASE_API}/purchase/planPo/r/moq`,
    method: 'post',
    params,
  })
}

// 采购计划-不报关可发布
export function planPoNbgFlagHander(params?: IIds) {
  return request({
    url: `${BASE_API}/purchase/planPo/ngb/flag`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购订单-降本提成申请
 * @param params
 * @returns
 */
export function applyPurchaseReductionCost(data?: IApplyPurchaseReductionCostReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/cost/reduction/apply`,
    method: 'post',
    data,
  })
}

/**
 * @description 采购订单-发布打包任务
 * @param params
 * @returns
 */
export function releasePackageTask(data?: IPacakgeTaskReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/packageTask/release`,
    method: 'post',
    data,
  })
}

/**
 * @description 采购订单-查询采购降本默认金额
 * @param params
 * @returns
 */
export function getPurchaseCostReduction(params: {
  poComponentId: number
}): Promise<{ data: { beforePrice: number; afterPrice: number } }> {
  return request({
    url: `${BASE_API}/purchase/cost/reduction/get`,
    method: 'post',
    params,
  })
}
/**
 * @description 采购订单-详情前置check
 * @param params
 * @returns
 */
export function checkPurchasePo(params: { poId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/po/check`,
    method: 'get',
    params,
  })
}
/**
 * 查询po sku 零件的零件明细
 * @param params
 * @returns
 */
export function getPoSkuComponentSuitDetail(params: { id: number }): Promise<{ data: string }> {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/componentSuitDetail`,
    method: 'get',
    params,
  })
}
/**
 * 更新po sku 零件套装明细
 * @param params
 * @returns
 */
export function updatePoSkuComponentSuitDetail(params: { id: number; componentSuitDetail: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/poSkuComponent/update/componentSuitDetail`,
    method: 'post',
    params,
  })
}
/**
 * 获取当前人的采购奖金
 */
export function getPurchaseBonus(): Promise<{ data: { procurementBonus: number; procurementBonusCrossMonth: number } }> {
  return request({
    url: `${BASE_API}/purchase/buns`,
    method: 'get',
  })
}
/**
 * 采购PO的需新品质检更新
 * @param params
 * @returns
 */
export function updatePurchasePlanPoQualityMark(params: { poSkuId: number; status: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/planPo/qualityMark`,
    method: 'post',
    params,
  })
}

/**
 * 采购订单-查看零件报关信息
 * @param params
 * @returns
 */
export function getPurchaseComponentCustomInfo(params: { id: number }): Promise<{ data: IGetPurchaseComponentCustomInfo }> {
  return request({
    url: `${BASE_API}/purchase/component/custom/info`,
    method: 'get',
    params,
  })
}
/**
 * 采购订单-修改保存零件报关信息
 * @param data
 * @returns
 */
export function updatePurchaseComponentCustomInfo(data: IGetPurchaseComponentCustomInfo): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/purchase/component/custom/update`,
    method: 'post',
    data,
  })
}

// 采购订单 - 查询列表
export function getPoPublisherList(params?: IGetAllNameReq) {
  return request({
    url: `${BASE_API}/purchase/po/release/user/list`,
    method: 'get',
    params,
  })
}

// 采购订单-生成PO合同
export function purchaseSkuReplace(data: IPurchaseSkuReplace) {
  return request({
    url: `${BASE_API}/purchase/sku/replace`,
    method: 'post',
    data,
  })
}

// 采购订单-po自动付款添加合同路径
export function purchaseAddAutoPay(data: IPurchasePoAutoPay) {
  return request({
    url: `${BASE_API}/auto/pay/add`,
    method: 'post',
    data,
  })
}

// 采购订单-po自动付款记录额列表查询
export function purchaseQueryPayList(): Promise<{ data: IPurchasePoAutoPayQueryItem[] }> {
  return request({
    url: `${BASE_API}/auto/pay/list`,
    method: 'post',
  })
}

// 采购订单-po自动付款提交
export function purchaseAutoPaySubmit(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/auto/pay/submit`,
    method: 'post',
  })
}

// 采购订单-po自动付款删除
export function purchaseDeleteAutoPay(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/auto/pay/record/del`,
    method: 'post',
    params,
  })
}
/**
 * 采购订单-po自动付款清空
 * @returns
 */
export function purchaseClearAutoPay(): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/auto/pay/record/clean`,
    method: 'post',
  })
}

/**
 * 采购订单-汇款校对
 * @returns
 */
export function purchaseRemittanceCheck(data: { path: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/remittance/check`,
    method: 'post',
    data,
  })
}
