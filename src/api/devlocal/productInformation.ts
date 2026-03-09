import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IGetMerchandiseChannelDetail,
  IGetMerchandiseDetail,
  IGetMerchandiseListReq,
  IGetMerchandiseListRes,
  IGetMerchandiseTypeChannelRes,
  IGetMerchandiseTypeListRes,
  IGetSkuShippingChannelListRes,
  IId,
  ITypeId,
  IUpdateBatchSkuShippingChannelMerchandise,
  IUpdateMerchandiseReq,
  IUpdateMerchandiseTypeBatchReq,
  IUpdateSkuShippingChannelMerchandise,
} from '/@/type/productInformation/channelType'
import type {
  IAddComponentEncoding,
  IAddCustomsClearanceSkuInfo,
  IBatchAddPackingPrecautions,
  IBooleanResp,
  IConsumablesType,
  IGetComponentEncodingListRes,
  IGetComponentInvoiceTypeReq,
  IGetComponentInvoiceTypeRes,
  IGetCustomsClearanceRatioRes,
  IGetCustomsClearanceSkuInfoRes,
  IGetCustomsClearanceSkuListReq,
  IGetCustomsClearanceSkuListRes,
  IGetProductAllReadyCOmponentListQuery,
  IGetSkuComponentInfo,
  IGetSkuInfoRes,
  IQueryReplenOperationLogReq,
  IQueryReplenOperationLogResp,
  IQuerySeasonalOperationLogResp,
  ISkuId,
  ISubmitProductComponentQuery,
  ISubmitProductConsumableQuery,
  ISuppliserName,
  IUpdateCustomsClearanceRatioReq,
  IUpdateCustomsClearanceSku,
  IUpdateCustomsClearanceSkuHtsReq,
  IUpdateCustomsClearanceSkuInfo,
  IUpdateProductAlreadyComponent,
  IUpdateProductCustomsClearanceReq,
  IUpdateProductCustomsClearanceStatus,
  IUpdateProductCustomsClearanceSuppliserInfoReq,
  IUpdateSkuComponent,
  IUpdateSkuFnSku,
  IaddConsumablesOtherSku,
  IaddProductComponentOtherSku,
  IaddProductQualityInspection,
  IcomponentId,
  IcreateConsumables,
  IcreateConsumablesSupplier,
  IcreateProductComponent,
  IcreateProductComponentSuppliser,
  IexistingPartsListId,
  IgetChangeProductComponent,
  IgetProductAllName,
  IgetProductConsumables,
  IgetProductCustomsListQuery,
  IgetProductCustomsListResp,
  IgetProductListQuery,
  IgetProductListResp,
  IgetProductQualityInspectionResp,
  IgetProductReplenListQuery,
  IgetProductReplenListResp,
  IgetProductSkuDetailResp,
  IgetProductSupplier,
  IgetProductSupplierListQuery,
  IgetProductSupplierListResp,
  Iid,
  IsaveProductComponentSuitDetail,
  IsaveProductContractTerms,
  IsaveProductPurchaseMatters,
  IsuppliserId,
  IupdateConsumablesSupplier,
  IupdateProductComponent,
  IupdateProductComponentName,
  IupdateProductComponentSuppliser,
  IupdateProductReplenParams,
  IupdateProductSku,
  IupdateProductSkuRemark,
  IupdateProductStatus,
  IupdateProductSupplier,
} from '/@/type/productInformation/skuInformationType'

import {
  IGetPackingTimeDetailsChartReq,
  IGetPackingTimeDetailsChartResp,
  IGetPackingTimeDetailsReq,
  IGetPackingTimeDetailsResp,
  IGetSkuDeliveryTimeChartReq,
  IGetSkuDeliveryTimeChartResp,
  ISkuDeliveryTimeResp,
  SkuCustomsClearanceAddReq,
  SkuCustomsClearanceQueryReq,
  SkuCustomsClearanceQueryResp,
} from '/@/type/productInformation/skuCustomsClearance'

// SKU信息 - 获取查询列表
export function getProductList(data: IgetProductListQuery): Promise<IgetProductListResp> {
  return request({
    url: `${BASE_API}/product/list`,
    method: 'post',
    data,
  })
}

// SKU详情-获取详情
export function getProductSkuDetail(params: ISkuId): Promise<IgetProductSkuDetailResp> {
  return request({
    url: `${BASE_API}/product/sku/detail`,
    method: 'get',
    params,
  })
}

// SKU详情-sku零配件清单列表
export function getProductDefaultListComponent(params: ISkuId) {
  return request({
    url: `${BASE_API}/product/defaultList/component`,
    method: 'get',
    params,
  })
}

// SKU详情-默认供应商、开票下拉修改
export function getChangeProductComponent(params: IgetChangeProductComponent) {
  return request({
    url: `${BASE_API}/product/getChange/component`,
    method: 'get',
    params,
  })
}

// SKU详情-查找零件的供应商
export function getProductComponentSuppliser(params: IcomponentId) {
  return request({
    url: `${BASE_API}/product/list/component/suppliser`,
    method: 'get',
    params,
  })
}

// SKU详情-查找默认收货仓库列表
export function getProductComponentStore(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/product/list/component/store`,
    method: 'get',
  })
}

// SKU详情 - 获取采购方列表
export function getProductComponentPurchase() {
  return request({
    url: `${BASE_API}/product/list/component/purchase`,
    method: 'get',
  })
}

// SKU详情-添加到其他SKU，初始化数据
export function getProductSkuList(params: IexistingPartsListId) {
  return request({
    url: `${BASE_API}/product/getSku/list`,
    method: 'get',
    params,
  })
}

// SKU供应商信息 - 查询
export function getProductListSuppliser(params: IcomponentId) {
  return request({
    url: `${BASE_API}/product/list/suppliser`,
    method: 'get',
    params,
  })
}

// 耗材信息 - 查询耗材列表
export function getProductConsumables(params: IgetProductConsumables) {
  return request({
    url: `${BASE_API}/product/list/consumables`,
    method: 'get',
    params,
  })
}

// 耗材信息-查询耗材种类
export function getProductConsumablesType() {
  return request({
    url: `${BASE_API}/product/list/consumablesType`,
    method: 'get',
  })
}

// 供应商 - 查询列表
export function getProductSupplierList(data: IgetProductSupplierListQuery): Promise<IgetProductSupplierListResp> {
  return request({
    url: `${BASE_API}/product/suppliser/getList`,
    method: 'post',
    data,
  })
}

// 供应商-合同模板下载
export function downloadProductSupplier(params?: IsuppliserId): any {
  return request({
    url: `${BASE_API}/product/suppliser/download`,
    method: 'get',
    responseType: 'blob',
    params,
  })
}

// 产品补货计算参数 - 获取补货参数列表
export function getProductReplenList(data: IgetProductReplenListQuery): Promise<IgetProductReplenListResp> {
  return request({
    url: `${BASE_API}/product/replen/list`,
    method: 'post',
    data,
  })
}

// 零件报关信息 - 获取零件报关信息列表
export function getProductCustomsList(data: IgetProductCustomsListQuery): Promise<IgetProductCustomsListResp> {
  return request({
    url: `${BASE_API}/product/customs/clearance/list`,
    method: 'post',
    data,
  })
}

// 零件报关信息 - 修改报关零件供应商信息
export function updateProductCustomsClearanceSuppliserInfo(
  data: IUpdateProductCustomsClearanceSuppliserInfoReq
): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/customs/clearance/suppliser/info/update`,
    method: 'post',
    data,
  })
}

// 零件报关信息 - 修改零件报关信息
export function updateProductCustomsClearance(data: IUpdateProductCustomsClearanceReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/customs/clearance/update`,
    method: 'post',
    data,
  })
}

// 查询hs下拉列表
export function getHsSelectList() {
  return request({
    url: `${BASE_API}/hs/select/list`,
    method: 'get',
  })
}

// SKU质检清单-查询
export function getProductQualityInspection(params: ISkuId): Promise<IgetProductQualityInspectionResp> {
  return request({
    url: `${BASE_API}/product/list/quality/inspection`,
    method: 'get',
    params,
  })
}

// SKU零配件清单-创建零件-获取所有的供应商
export function getProductAllSupplier(params: ISuppliserName) {
  return request({
    url: `${BASE_API}/product/all/suppliser`,
    method: 'get',
    params,
  })
}

// SKU配件清单- 获取供应商税点信息
export function getProductSupplier(params: ISuppliserName): Promise<IgetProductSupplier> {
  return request({
    url: `${BASE_API}/product/get/suppliser`,
    method: 'get',
    params,
  })
}

// 获取所有公司所有人名
export function getProductAllName(params: IgetProductAllName) {
  return request({
    url: `${BASE_API}/product/getAllName`,
    method: 'get',
    params,
  })
}

/**
 * SKU信息-sku停产、优先打包、打包拍照状态修改
 */
export function updateProductStatus(data?: IupdateProductStatus) {
  return request({
    url: `${BASE_API}/product/update/status`,
    method: 'post',
    data,
  })
}

/**
 * SKU详情 - 更新SKU详情信息
 */
export function updateProductSku(data?: IupdateProductSku) {
  return request({
    url: `${BASE_API}/product/update/sku`,
    method: 'post',
    data,
  })
}

/**
 * SKU详情 - 更新SKU产品经理的备注
 */
export function updateProductSkuRemark(params?: IupdateProductSkuRemark) {
  return request({
    url: `${BASE_API}/product/update/sku/remark`,
    method: 'post',
    params,
  })
}

/**
 * SKU详情 - 上传SKU图片
 */
export function uploadSkuImage(data: FormData) {
  return request({
    url: `${BASE_API}/product/sku/upload/image`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * SKU详情 - 删除SKU图片
 */
export function delSkuImage(params: ISkuId) {
  return request({
    url: `${BASE_API}/product/sku/delete/image`,
    method: 'post',
    params,
  })
}

/**
 * SKU详情-创建零件
 */
export function createProductComponent(data: IcreateProductComponent) {
  return request({
    url: `${BASE_API}/product/create/component`,
    method: 'post',
    data,
  })
}

/**
 * SKU详情-删除SKU配件信息
 */
export function delProductComponent(params: IcomponentId) {
  return request({
    url: `${BASE_API}/product/delete/component`,
    method: 'post',
    params,
  })
}

/**
 * SKU详情-修改零件
 */
export function updateProductComponent(data: IupdateProductComponent) {
  return request({
    url: `${BASE_API}/product/update/component`,
    method: 'post',
    data,
  })
}

/**
 * SKU详情-更新零件名
 */
export function updateProductComponentName(data: IupdateProductComponentName) {
  return request({
    url: `${BASE_API}/product/update/componentName`,
    method: 'post',
    data,
  })
}

/**
 * SKU详情-添加到其他sku
 */
export function addProductComponentOtherSku(data: IaddProductComponentOtherSku) {
  return request({
    url: `${BASE_API}/product/add/component/otherSku`,
    method: 'post',
    data,
  })
}

/**
 * SKU供应商信息 - 添加供应商
 */
export function createProductComponentSuppliser(data: IcreateProductComponentSuppliser) {
  return request({
    url: `${BASE_API}/product/create/component/suppliser`,
    method: 'post',
    data,
  })
}

/**
 * SKU供应商信息 - 修改
 */
export function updateProductComponentSuppliser(data: IupdateProductComponentSuppliser) {
  return request({
    url: `${BASE_API}/product/update/component/suppliser`,
    method: 'post',
    data,
  })
}

/**
 * SKU供应商信息 - 图片上传
 */
export function uploadComponentImage(data: FormData) {
  return request({
    url: `${BASE_API}/product/component/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * SKU供应商信息 - 删除上传图片
 */
export function delComponentImage(params: Iid) {
  return request({
    url: `${BASE_API}/product/component/del/img`,
    method: 'post',
    params,
  })
}

/**
 * 耗材信息- 创建耗材
 */
export function createConsumables(data: IcreateConsumables) {
  return request({
    url: `${BASE_API}/product/create/consumables`,
    method: 'post',
    data,
  })
}

/**
 * 耗材信息 - 添加供应商
 */
export function createConsumablesSupplier(data: IcreateConsumablesSupplier) {
  return request({
    url: `${BASE_API}/product/create/consumables/suppliser`,
    method: 'post',
    data,
  })
}

/**
 * 耗材信息 - 耗材信息修改
 */
export function updateConsumablesSupplier(data: IupdateConsumablesSupplier) {
  return request({
    url: `${BASE_API}/product/update/consumables/suppliser`,
    method: 'post',
    data,
  })
}

/**
 * 耗材信息 - 添加到其他SKU
 */
export function addConsumablesOtherSku(data: IaddConsumablesOtherSku) {
  return request({
    url: `${BASE_API}/product/add/consumables/otherSku`,
    method: 'post',
    data,
  })
}

/**
 * 耗材信息-添加耗材种类
 */
export function addConsumablesType(params: IConsumablesType) {
  return request({
    url: `${BASE_API}/product/add/consumables/type`,
    method: 'post',
    params,
  })
}

/**
 * 耗材信息-删除耗材种类
 */
export function delConsumablesType(params: Iid) {
  return request({
    url: `${BASE_API}/product/delete/consumables/type`,
    method: 'post',
    params,
  })
}

/**
 * 供应商 - 修改
 */
export function updateProductSupplier(data: IupdateProductSupplier) {
  return request({
    url: `${BASE_API}/product/suppliser/update`,
    method: 'post',
    data,
  })
}

/**
 * 供应商-上传通过合同模板
 */
export function uploadProductSupplierFile(data: FormData) {
  return request({
    url: `${BASE_API}/product/suppliser/file/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 供应商-特殊合同模板上传
 */
export function uploadProductSupplierSpecialFile(data: FormData) {
  return request({
    url: `${BASE_API}/product/suppliser/specialFile/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  })
}

/**
 * 产品补货计算参数 - 批量修改
 */
export function updateProductReplenParams(data: IupdateProductReplenParams) {
  return request({
    url: `${BASE_API}/product/update/replenParams`,
    method: 'post',
    data,
  })
}

/**
 * 补货操作日志-查询列表
 * @param data
 * @returns
 */
export function queryReplenOperationLog(data: IQueryReplenOperationLogReq): Promise<IQueryReplenOperationLogResp> {
  return request({
    url: `${BASE_API}/product/replen/operationLog/list`,
    method: 'post',
    data,
  })
}
/**
 * 季节系数操作日志
 * @param data
 * @returns
 */
export function querySeasonalCoefficientOperationLog(data: IQueryReplenOperationLogReq): Promise<IQuerySeasonalOperationLogResp> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/operationLog/list`,
    method: 'post',
    data,
  })
}

/**
 * SKU质检清单-添加质检清单
 */
export function addProductQualityInspection(data: IaddProductQualityInspection): Promise<{ data: boolean; msg: string }> {
  return request({
    url: `${BASE_API}/product/add/quality/inspection`,
    method: 'post',
    data,
  })
}

/**
 * SKU质检清单-删除质检清单
 */
export function delProductQualityInspection(params: Iid) {
  return request({
    url: `${BASE_API}/product/delete/quality/inspection`,
    method: 'post',
    params,
  })
}

/**
 * SKU质检清单-修改质检清单
 */
export function updateProductQualityInspection(data: IaddProductQualityInspection) {
  return request({
    url: `${BASE_API}/product/update/quality/inspection`,
    method: 'post',
    data,
  })
}

/**
 * SKU零配件清单-保存采购注意事项
 */
export function saveProductPurchaseMatters(params: IsaveProductPurchaseMatters) {
  return request({
    url: `${BASE_API}/product/save/purchaseMatters`,
    method: 'post',
    params,
  })
}

/**
 * SKU零配件清单-保存合同条款
 */
export function saveProductContractTerms(params: IsaveProductContractTerms) {
  return request({
    url: `${BASE_API}/product/save/contractTerms`,
    method: 'post',
    params,
  })
}

/**
 * SKU零配件清单-保存零件套装明细
 */
export function saveProductComponentSuitDetail(params: IsaveProductComponentSuitDetail): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/save/componentSuitDetail`,
    method: 'post',
    params,
  })
}

// 添加零件提交
export function submitProductComponent(data?: ISubmitProductComponentQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/submit/component`,
    method: 'post',
    data,
  })
}

// 添加耗材提交
export function submitProductConsumable(data?: ISubmitProductConsumableQuery): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/submit/consumables`,
    method: 'post',
    data,
  })
}

// 获取已有零件库数据
export function getProductAllReadyCOmponentList(params: IGetProductAllReadyCOmponentListQuery) {
  return request({
    url: `${BASE_API}/product/already/component/list`,
    method: 'get',
    params,
  })
}

/**
 * @description 已有零件库-更新系数
 * @param params
 * @returns
 */
export function updateProductAlreadyComponent(params: IUpdateProductAlreadyComponent): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/already/component/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 已有零件库-更新耗材类型
 * @param params
 * @returns
 */
export function updateProductAlreadyComponentType(params: { id: number; type: number }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/already/component/update/type`,
    method: 'post',
    params,
  })
}

/**
 * @description SKU报关属性-获取SKU报关属性列表
 * @param params
 * @returns
 */
export function getCustomsClearanceSkuList(data: IGetCustomsClearanceSkuListReq): Promise<IGetCustomsClearanceSkuListRes> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/list`,
    method: 'post',
    data,
  })
}

/**
 * @description SKU报关属性-修改
 * @param params
 * @returns
 */
export function updateCustomsClearanceSku(data: IUpdateCustomsClearanceSku): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 修改SKU FNSKU
 * @param data: IUpdateSkuFnSku
 * @returns IBooleanResp
 */
export function updateSkuFnSku(data: IUpdateSkuFnSku): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/update/sku/fnsku`,
    method: 'post',
    data,
  })
}

/**
 * @description 清关价格系数获取
 * @param params
 * @returns
 */
export function getCustomsClearanceRatio(): Promise<IGetCustomsClearanceRatioRes> {
  return request({
    url: `${BASE_API}/customs/clearance/ratio`,
    method: 'get',
  })
}

/**
 * @description 清关修改价格系数
 * @param params
 * @returns
 */
export function updateCustomsClearanceRatio(data: IUpdateCustomsClearanceRatioReq): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/customs/clearance/ratio/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 零件报关信息 - 报关重量使用开票重量修改
 * @param params
 * @returns
 */
export function updateProductCustomsClearanceStatus(params: IUpdateProductCustomsClearanceStatus): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/product/customs/clearance/status/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 获取货物渠道列表
 */
export function getMerchandiseList(data: IGetMerchandiseListReq): Promise<IGetMerchandiseListRes> {
  return request({
    url: `${BASE_API}/merchandise/list`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取sku发货渠道设定列表
 */
export function getSkuShippingChannelList(params: IGetMerchandiseListReq): Promise<IGetSkuShippingChannelListRes> {
  return request({
    url: `${BASE_API}/sku/shipping/channel/list`,
    method: 'get',
    params,
  })
}

/**
 * @description 获取货物类别下拉列表
 */
export function getMerchandiseTypeList(): Promise<IGetMerchandiseTypeListRes> {
  return request({
    url: `${BASE_API}/merchandise/type/list`,
    method: 'get',
  })
}

/**
 * @description 获取所有货代名称列表
 */
export function getFreightForwarderQuery(): Promise<IGetMerchandiseTypeListRes> {
  return request({
    url: `${BASE_API}/freightForwarder/query`,
    method: 'get',
  })
}

/**
 * @description 获取货物渠道详情
 */
export function getMerchandiseDetail(params: IId): Promise<IGetMerchandiseDetail> {
  return request({
    url: `${BASE_API}/merchandise/detail`,
    method: 'get',
    params,
  })
}

/**
 * @description 修改货物类别提交
 */
export function updateMerchandise(data: IUpdateMerchandiseReq): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/merchandise/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 添加货物类别提交
 */
export function addMerchandise(data: { merchandiseName: string }): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/merchandise/add`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取货物类别对应的各站点渠道
 */
export function getMerchandiseChannelDetail(params: ITypeId): Promise<IGetMerchandiseChannelDetail> {
  return request({
    url: `${BASE_API}/merchandise/channel/detail`,
    method: 'get',
    params,
  })
}

/**
 * @description 修改Sku的货物类别
 */
export function updateSkuShippingChannelMerchandise(params: IUpdateSkuShippingChannelMerchandise): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sku/shipping/channel/merchandise/update`,
    method: 'post',
    params,
  })
}

/**
 * @description 批量修改Sku的货物类别
 */
export function updateBatchSkuShippingChannelMerchandise(params: IUpdateBatchSkuShippingChannelMerchandise): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sku/shipping/channel/merchandise/update/batch`,
    method: 'post',
    params,
  })
}

/**
 * @description SKU货物类别-货物类别对应的站点渠道列表
 */
export function getMerchandiseTypeChannel(params: { typeId: number }): Promise<IGetMerchandiseTypeChannelRes> {
  return request({
    url: `${BASE_API}/merchandise/type/channel`,
    method: 'get',
    params,
  })
}

/**
 * @description SKU货物类别-批量修改渠道id
 */
export function updateMerchandiseTypeBatch(data: IUpdateMerchandiseTypeBatchReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/merchandise/type/batch/update`,
    method: 'post',
    data,
  })
}

/**
 * @description 查询sku信息
 */
export function getSkuInfo(params: { sku: string }): Promise<IGetSkuInfoRes> {
  return request({
    url: `${BASE_API}/get/skuInfo`,
    method: 'get',
    params,
  })
}

/**
 * HTS 欧洲下拉列表
 */
export function getHtsUkList(params: { country: string }): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/hts/europe/list`,
    method: 'get',
    params,
  })
}

/**
 * HTS 美国下拉列表
 */
export function getHtsSelectList(params: { country: string }): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/hts/select/list`,
    method: 'get',
    params,
  })
}

/**
 * SKU-报关 更新HTS
 */
export function updateCustomsClearanceSkuHts(data: IUpdateCustomsClearanceSkuHtsReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/hts/update`,
    method: 'post',
    data,
  })
}

/**
 * sku复制
 */
export function copyProductSku(data: {
  skuId: number
  sku: string
  listingTask: number
  needQualityInspection: number
}): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/sku/copy`,
    method: 'post',
    data,
  })
}

/**
 * sku hts 信息列表查询
 * @param params
 * @returns
 */
export function getCustomsClearanceSkuHtsList(params: { skuCustomsDeclarationId: number }): Promise<{ data: Object }> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/hts/list`,
    method: 'post',
    params,
  })
}

/**
 * sku清关信息查看
 * @param params
 * @returns
 */
export function getCustomsClearanceSkuInfo(params: { skuCustomId: number }): Promise<IGetCustomsClearanceSkuInfoRes> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/info`,
    method: 'post',
    params,
  })
}

/**
 * 批量sku清关信息修改
 * @param params
 * @returns
 */
export function updateCustomsClearanceSkuInfo(data: IUpdateCustomsClearanceSkuInfo): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/info/update`,
    method: 'post',
    data,
  })
}

/**
 * 单个sku清关信息点击修改
 * @param params
 * @returns
 */
export function updateCustomsClearanceSkuInfoSign(data: IUpdateCustomsClearanceSkuInfo): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/info/update/click`,
    method: 'post',
    data,
  })
}

/**
 * sku清关信息新增
 * @param data
 * @returns
 */
export function addCustomsClearanceSkuInfo(data: IAddCustomsClearanceSkuInfo): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/customs/clearance/sku/info/add`,
    method: 'post',
    data,
  })
}

/**
 * 获取sku报关国家列表
 * @returns
 */
export function getCustomsClearanceCountryList(): Promise<{ data: { id: number; label: string }[] }> {
  return request({
    url: `${BASE_API}/customs/clearance/country/list`,
    method: 'get',
  })
}

// ----------------------- 开票分类 ---------------------------
/**
 * 零件开票分类-列表获取
 * @param params
 * @returns
 */
export function getComponentInvoiceTypeList(params: IGetComponentInvoiceTypeReq): Promise<IGetComponentInvoiceTypeRes> {
  return request({
    url: `${BASE_API}/component/invoice/type/list`,
    method: 'get',
    params,
  })
}

/**
 * 零件开票分类-添加分类编码
 * @param data
 * @returns
 */
export function addComponentEncoding(data: IAddComponentEncoding): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/component/encoding/add`,
    method: 'post',
    data,
  })
}

/**
 * 零件开票分类-删除分类编码
 * @param data
 * @returns
 */
export function delComponentEncoding(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/component/encoding/del`,
    method: 'post',
    params,
  })
}

/**
 * 零件开票分类-分类编码设定列表获取
 * @param params
 * @returns
 */
export function getComponentEncodingList(params: IGetComponentInvoiceTypeReq): Promise<IGetComponentEncodingListRes> {
  return request({
    url: `${BASE_API}/component/encoding/list`,
    method: 'get',
    params,
  })
}

/**
 * 零件开票分类-修改税收分类编码和分类名
 * @param params
 * @returns
 */
export function updateComponentEncoding(params: { id: number; taxationEncoding?: string; typeName?: string }): Promise<{
  data: boolean
}> {
  return request({
    url: `${BASE_API}/component/encoding/update`,
    method: 'post',
    params,
  })
}

/**
 * 零件开票分类-分类名列表获取
 * @returns
 */
export function getComponentTypeList() {
  return request({
    url: `${BASE_API}/component/type/list`,
    method: 'get',
  })
}

/**
 * 零件开票分类-修改零件的分类
 * @param params
 * @returns
 */
export function updateBatchComponentType(params: { ids: string; typeEncodingId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/component/batch/encoding/update`,
    method: 'post',
    params,
  })
}

/**
 * sku查询零件报关信息
 * @param data
 * @returns
 */
export function getSkuComponentInfo(data: { existingPartsListId: number; suppliserId: number }): Promise<{
  data: IGetSkuComponentInfo
}> {
  return request({
    url: `${BASE_API}/sku/component/info`,
    method: 'post',
    data,
  })
}

/**
 * sku零件报关信息修改
 * @param data
 * @returns
 */
export function updateSkuComponentInfo(data: IUpdateSkuComponent): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/sku/component/update`,
    method: 'post',
    data,
  })
}

/**
 * 批量新增打包注意事项
 * @param data
 * @returns
 */
export function batchAddPackingPrecautions(data: IBatchAddPackingPrecautions): Promise<{ data: boolean; msg: string }> {
  return request({
    url: `${BASE_API}/product/batch/add/quality/inspection`,
    method: 'post',
    data,
  })
}

/**
 * 获取sku信息
 * @param data
 * @returns
 */
export function otainSkuCustomCleanList(data: SkuCustomsClearanceQueryReq): Promise<{
  data: SkuCustomsClearanceQueryResp
}> {
  return request({
    url: `${BASE_API}/customs/clearance/product/list`,
    method: 'post',
    data,
  })
}

/**
 * 导入sku清关信息
 * @param data
 * @returns
 */
export function addSkuCustomCleanList(data: SkuCustomsClearanceAddReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/sku/customs/clearance/import`,
    method: 'post',
    data,
  })
}

/**
 * 获取sku打包工时明细
 * @param data { sku: string; keyWord: string; pageNo: number; pageSize: number }
 * @returns { data: any }
 */
export function getPackingTimeDetails(data: IGetPackingTimeDetailsReq): Promise<{ data: IGetPackingTimeDetailsResp }> {
  return request({
    url: `${BASE_API}/sku/packaging/time/detail`,
    method: 'post',
    data,
  })
}

/**
 * 获取sku打包工时趋势图
 * @param data { sku: string; startTime: Date; endTime: Date }
 * @returns { data: IGetPackingTimeDetailsChartResp }
 */
export function getPackingTimeDetailsChart(data: IGetPackingTimeDetailsChartReq): Promise<{
  data: IGetPackingTimeDetailsChartResp
}> {
  return request({
    url: `${BASE_API}/sku/packaging/time/chart`,
    method: 'post',
    data,
  })
}
/**
 * 获取sku交期趋势图
 * @param data { sku: string; startTime: string; endTime: string }
 * @returns { data: IGetSkuDeliveryTimeChartResp }
 */
export function getSkuDeliveryTimeChart(data: IGetSkuDeliveryTimeChartReq): Promise<{
  data: IGetSkuDeliveryTimeChartResp
}> {
  return request({
    url: `${BASE_API}/sku/delivery/time/statistics`,
    method: 'post',
    data,
  })
}

/**
 * 获取sku清关HTS列表
 * @param params { sku: string }
 * @returns { data: Map<string, number> }
 */
export function getSkuCustomsClearanceHtsList(params: { sku: string }): Promise<{ data: Map<string, number> }> {
  return request({
    url: `${BASE_API}/sku/customs/clearance/hts/list`,
    method: 'get',
    params,
  })
}

/**
 * 复制零件
 * @param params { componentId: number; skuId: number }
 * @returns { data: boolean }
 */
export function copyProductComponent(params: {
  componentId: number
  skuId: number
  existingPartsListId: number
}): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/product/component/copy`,
    method: 'post',
    params,
  })
}

/**
 * 查看sku交期明细
 * @param data
 */
export function querySkuDeliveryTime(data: {
  keyWord?: string
  sku?: string
  pageNo?: number
  pageSize?: number
}): Promise<ISkuDeliveryTimeResp> {
  return request({
    url: `${BASE_API}/sku/delivery/time`,
    method: 'post',
    data,
  })
}
/**
 * 删除零件供应商
 * @param params { componentId: number; supplierId: number }
 * @returns { data: boolean }
 */
export function deleteProductComponentSuppliser(params: { componentId: number; supplierId: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/component/supplier/delete`,
    method: 'post',
    params,
  })
}
