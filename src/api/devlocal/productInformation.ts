import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import { 
    IgetProductListQuery, 
    IgetProductListResp,
    IupdateProductStatus,
    ISkuId,
    IgetProductSkuDetailResp,
    IupdateProductSku,
    IupdateProductSkuRemark 
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