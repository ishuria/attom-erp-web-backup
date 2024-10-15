import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import {
  IBooleanResp,
  IComponentName,
  ICreatePlanPoResp,
  IGetAddComponentListQuery,
  IGetAddComponentListResp,
  IGetAddConsumableListQuery,
  IGetAddConsumableListResp,
  IGetComponentPayRecordResp,
  IGetPlanPoListQuery,
  IGetPlanPoListResp,
  IGetPoDetailResp,
  IGetPoListQuery,
  IGetPoListResp,
  IGetPoSkuComponentListResp,
  IGetSignatureSettingListQuery,
  IGetSignatureSettingListResp,
  IGetSupplierRateResp,
  IId,
  IIds,
  INumberResp,
  IPoId,
  IPoIds,
  IPoSkuComponentId,
  IPoSkuId,
  ISku,
  IStringResp,
  ISubmitPurchaseComponentQuery,
  ISubmitPurchaseConsumableQuery,
  ISupplierId,
  IUpdateBuyerAndCustomsDeclaration,
  IUpdateComponentAllPay,
  IUpdateComponentPayPartQuery,
  IUpdatePayRecord,
  IUpdatePoContractTerms,
  IUpdatePoPurchaseMatters,
  IUpdatePoRemarks,
  IUpdatePoSite,
  IUpdatePoSkuComponent,
  IUpdateSkuCount,
  IUpdateSkuDetail
} from '/@/type/purchase/po'

// 采购计划-获取采购计划PlanPo
export function getPlanPoList(params?: IGetPlanPoListQuery): Promise<IGetPlanPoListResp> {
  return request({
    url: `${BASE_API}/purchase/planPo/list`,
    method: 'get',
    params,
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
// 获取添加耗材列表
export function getAddConsumableList(params: IGetAddConsumableListQuery): Promise<IGetAddConsumableListResp> {
  return request({
    url: `${BASE_API}/list/consumables`,
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
export function createPlanPo(params?: ISku): Promise<ICreatePlanPoResp> {
  return request({
    url: `${BASE_API}/purchase/create/planPo`,
    method: 'post',
    params,
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
// 采购订单-已付尾款/全款
export function updateComponentAllPay(data: IUpdateComponentAllPay) {
  return request({
    url: `${BASE_API}/purchase/component/AllPay`,
    method: 'post',
    data
  })
}
// 分批付款
export function updateComponentPayPart(data: IUpdateComponentPayPartQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/component/payPart`,
    method: 'post',
    data
  })
}
// 采购订单-删除零件的付款记录
export function delPayRecord(params: IId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/purchase/delete/payRecord`,
    method: 'post',
    params
  })
}
// 采购订单-修改零件付款记录
export function updatePayRecord(params: IUpdatePayRecord): Promise<IBooleanResp> {
  return request({
    url: `purchase/update/payRecord`,
    method: 'post',
    params
  })
}
// 采购订单 - 自动签收设定 - 新增
export function addSignatureSettings(params: IId): Promise<INumberResp> {
  return request({
    url: `purchase/add/signature/settings`,
    method: 'post',
    params
  })
}
// 采购订单 - 自动签收设定 - 删除
export function delSignatureSettings(params: IId): Promise<IBooleanResp> {
  return request({
    url: `purchase/delete/signature/settings`,
    method: 'post',
    params
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