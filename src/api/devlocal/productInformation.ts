import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import { 
    IgetProductListQuery, 
    IgetProductListResp,
    IupdateProductStatus,
    ISkuId,
    IgetProductSkuDetailResp,
    IupdateProductSku,
    IupdateProductSkuRemark,
    IcreateProductComponent,
    IcomponentId,
    IupdateProductComponent,
    IgetChangeProductComponent,
    IupdateProductComponentName,
    IaddProductComponentOtherSku,
    IcreateProductComponentSuppliser,
    IupdateProductComponentSuppliser,
    Iid,
    IcreateConsumables,
    IgetProductConsumables,
    IcreateConsumablesSupplier,
    IupdateConsumablesSupplier,
    IaddConsumablesOtherSku,
    IConsumablesType,
    IupdateProductSupplier,
    IgetProductSupplierListQuery,
    IgetProductSupplierListResp,
    IsuppliserId,
    IgetProductReplenListQuery,
    IgetProductReplenListResp,
    IupdateProductReplenParams,
    IgetProductCustomsListQuery,
    IgetProductCustomsListResp,
    IupdateProductCustoms,
    IgetProductQualityInspectionResp,
    IaddProductQualityInspection,
    ISuppliserName
} from '/@/type/productInformation/skuInformationType'

// SKU信息 - 获取查询列表
export function getProductList(params: IgetProductListQuery): Promise<IgetProductListResp> {
  return request({
    url: `${BASE_API}/product/list`,
    method: 'get',
    params
  })
}

// SKU详情-获取详情
export function getProductSkuDetail(params: ISkuId): Promise<IgetProductSkuDetailResp> {
    return request({
      url: `${BASE_API}/product/sku/detail`,
      method: 'get',
      params
    })
}

// SKU详情-sku零配件清单列表
export function getProductDefaultListComponent(params: ISkuId) {
    return request({
      url: `${BASE_API}/product/defaultList/component`,
      method: 'get',
      params
    })
}

// SKU详情-默认供应商、开票下拉修改
export function getChangeProductComponent(params: IgetChangeProductComponent) {
    return request({
      url: `${BASE_API}/product/getChange/component`,
      method: 'get',
      params
    })
}

// SKU详情-查找零件的供应商
export function getProductComponentSuppliser(params: IcomponentId) {
    return request({
      url: `${BASE_API}/product/list/component/suppliser`,
      method: 'get',
      params
    })
}
// SKU详情-查找默认收货仓库列表
export function getProductComponentStore() {
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
export function getProductSkuList() {
    return request({
      url: `${BASE_API}/product/getSku/list`,
      method: 'get',
    })
}

// SKU供应商信息 - 查询
export function getProductListSuppliser(params: IcomponentId) {
    return request({
      url: `${BASE_API}/product/list/suppliser`,
      method: 'get',
      params
    })
}
// 耗材信息 - 查询耗材列表
export function getProductConsumables(params: IgetProductConsumables) {
    return request({
      url: `${BASE_API}/product/list/consumables`,
      method: 'get',
      params
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
export function getProductSupplierList(params: IgetProductSupplierListQuery): Promise<IgetProductSupplierListResp> {
    return request({
      url: `${BASE_API}/product/suppliser/getList`,
      method: 'get',
      params
    })
}
// 供应商-合同模板下载
export function downloadProductSupplier(params?: IsuppliserId): any {
    return request({
      url: `${BASE_API}/product/suppliser/download`,
      method: 'get',
    responseType: 'blob',
      params
    })
}
// 产品补货计算参数 - 获取补货参数列表
export function getProductReplenList(params: IgetProductReplenListQuery): Promise<IgetProductReplenListResp> {
    return request({
      url: `${BASE_API}/product/replen/list`,
      method: 'get',
      params
    })
}
// 零件报关信息 - 获取零件报关信息列表
export function getProductCustomsList(params: IgetProductCustomsListQuery): Promise<IgetProductCustomsListResp> {
    return request({
      url: `${BASE_API}/product/customs/clearance/list`,
      method: 'get',
      params
    })
}
// SKU质检清单-查询
export function getProductQualityInspection(params: ISkuId): Promise<IgetProductQualityInspectionResp> {
    return request({
      url: `${BASE_API}/product/list/quality/inspection`,
      method: 'get',
      params
    })
}
// SKU零配件清单-创建零件-获取所有的供应商
export function getProductAllSupplier(params: ISuppliserName) {
    return request({
      url: `${BASE_API}/product/all/suppliser`,
      method: 'get',
      params
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
 * 零件报关信息 - 修改零件报关信息
 */
export function updateProductCustoms(data: IupdateProductCustoms) {
    return request({
      url: `${BASE_API}/product/customs/clearance/update`,
      method: 'post',
      data,
    })
}
/**
 * SKU质检清单-添加质检清单
 */
export function addProductQualityInspection(data: IaddProductQualityInspection) {
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