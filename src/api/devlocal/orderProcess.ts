import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { 
    IreviewComponentId,
    IreviewId, 
    IreviewStepNo1Del, 
    IreviewStepNo1SaveOn, 
    IreviewStepNo2Savetw, 
    IreviewStepNo3ComponentListResp, 
    IreviewStepNo3ComponentUpdate, 
    IreviewStepNo3UpdateContractTerms, 
    IreviewStepNo3UpdatePurchaseMatters,
    IreviewStepNo3VariantListResp,
    IreviewStepNo3VariantUpdate,
    IreviewStepNo4ListQualityInspectionResp,
    IqualityInspectionId,
    IreviewStepNo4DelQualityInspectionResp,
    IreviewStepNo4UpdateQualityInspection,
    IreviewStepNo5SkuInfoPerfect,
    IreviewStepNo1,
    IreviewStepNo6SaveSix
} from '/@/type/orderProcess/orderProcessType'

/**
 * 新品进度-开模进度列表
 */
export function reviewStepNo3ComponentList(params?: IreviewId): Promise<IreviewStepNo3ComponentListResp>{
    return request({
      url: `${BASE_API}/review/stepsNo3/component/list`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-查询零件采购注意事项
 */
export function reviewStepNo3PurchaseMatters(params?: IreviewComponentId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/purchaseMatters`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-查询零件合同条款
 */
export function reviewStepNo3ContractTerms(params?: IreviewComponentId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/contractTerms`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-查询下拉变体列表
 */
export function reviewStepNo3GetSelectVariantList(params?: IreviewId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/getSelect/variantList`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-查询变体列表信息
 */
export function reviewStepNo3VariantList(params?: IreviewId): Promise<IreviewStepNo3VariantListResp> {
    return request({
      url: `${BASE_API}/review/stepsNo3/variantList`,
      method: 'get',
      params,
    })
}
/**
 * 完善新供应商信息与打包质检清单 - 查询质检清单列表
 */
export function reviewStepNo4ListQualityInspection(params?: IreviewId): Promise<IreviewStepNo4ListQualityInspectionResp> {
    return request({
      url: `${BASE_API}/review/stepsNo4/list/qualityInspection`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-检查提交审核信息-查询获取信息及主管可行性审批查询
 */
export function reviewStepNo6CheckGet(params?: IreviewId){
    return request({
      url: `${BASE_API}/review/check/get`,
      method: 'get',
      params,
    })
}
/**
 * 检查提交审核信息 - 开模信息
 */
export function reviewStepNo6CheckGetMold(params?: IreviewId){
    return request({
      url: `${BASE_API}/review/get/mold`,
      method: 'get',
      params,
    })
}
/**
 * 新品订货流程-查询产品基础输入信息
 */
export function reviewStepNo1(params?: IreviewId): Promise<IreviewStepNo1>{
  return request({
    url: `${BASE_API}/review/stepsNo1`,
    method: 'get',
    params,
  })
}
/**
 * 新品订货流程- 查询审批人列表
 */
export function reviewStepNo6PersonList(){
  return request({
    url: `${BASE_API}/review/personList`,
    method: 'get',
  })
}
/**
 * 根据审核id获取进度id
 */
export function reviewProgressId(params: IreviewId){
  return request({
    url: `${BASE_API}/review/progressId`,
    method: 'get',
    params
  })
}
/**
 * 根据审核id获取进度id
 */
export function reviewGetSkuList(params: IreviewId){
  return request({
    url: `${BASE_API}/review/getSku/list`,
    method: 'get',
    params
  })
}
/**
 * 新品订货流程-完善sku信息-获取默认的产品经理
 */
export function reviewProductManager(params: IreviewId){
  return request({
    url: `${BASE_API}/review/productManager`,
    method: 'get',
    params
  })
}
/**
 * 新品订货流程-删除变体信息
 */
export function reviewStepNo1Del(params?: IreviewStepNo1Del) {
    return request({
      url: `${BASE_API}/review/stepsNo1/delete`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-产品基础信息输入保存
 */
export function reviewStepNo1SaveOn(data?: IreviewStepNo1SaveOn) {
    return request({
      url: `${BASE_API}/review/save/on`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-拿样零件添加-继续
 */
export function reviewStepNo2Savetw(params?: IreviewStepNo2Savetw) {
    return request({
      url: `${BASE_API}/review/save/tw`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-添加
 */
export function reviewStepNo3ComponentAdd(params?: IreviewId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/add`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-删除
 */
export function reviewStepNo3ComponentDel(params?: IreviewComponentId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/delete`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-零件复制
 */
export function reviewStepNo3ComponentCopy(params?: IreviewComponentId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/copy`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-修改
 */
export function reviewStepNo3ComponentUpdate(data?: IreviewStepNo3ComponentUpdate) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/update`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-修改零件采购注意事项
 */
export function reviewStepNo3UpdatePurchaseMatters(params?: IreviewStepNo3UpdatePurchaseMatters) {
    return request({
      url: `${BASE_API}/review/stepsNo3/update/purchaseMatters`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-修改零件合同条款
 */
export function reviewStepNo3UpdateContractTerms(params?: IreviewStepNo3UpdateContractTerms) {
    return request({
      url: `${BASE_API}/review/stepsNo3/update/contractTerms`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-零件图片上传
 */
export function reviewStepNo3ComponentUpload(data: FormData) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/upload`,
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-零件图片删除
 */
export function reviewStepNo3ComponentImtDel(params: IreviewComponentId) {
    return request({
      url: `${BASE_API}/review/stepsNo3/component/imt/del`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-更新变体信息
 */
export function reviewStepNo3VariantUpdate(data: IreviewStepNo3VariantUpdate) {
    return request({
      url: `${BASE_API}/review/stepsNo3/variant/update`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-零件信息完善与售价核对-保存
 */
export function reviewStepNo3SaveTh(params: IreviewId) {
    return request({
      url: `${BASE_API}/review/save/th`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-完善新供应商信息与打包质检清单 -质检项目清单添加
 */
export function reviewStepNo4AddQualityInspection(params: IreviewId) {
    return request({
      url: `${BASE_API}/review/stepsNo4/add/qualityInspection`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-完善新供应商信息与打包质检清单-删除
 */
export function reviewStepNo4DelQualityInspection(params: IqualityInspectionId): Promise<IreviewStepNo4DelQualityInspectionResp> {
    return request({
      url: `${BASE_API}/review/stepsNo4/del/qualityInspection`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-完善新供应商信息与打包质检清单 -质检项目清单修改
 */
export function reviewStepNo4UpdateQualityInspection(data: IreviewStepNo4UpdateQualityInspection) {
    return request({
      url: `${BASE_API}/review/stepsNo4/update/qualityInspection`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-完善新供应商信息与打包质检清单 - 保存or保存并继续
 */
export function reviewStepNo4SaveFr(params: IreviewId) {
    return request({
      url: `${BASE_API}/review/save/fr`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-完善sku信息 -变体图片上传
 */
export function reviewStepNo5VariantImgUpload(data: FormData) {
    return request({
      url: `${BASE_API}/review/stepsNo5/variant/img/upload`,
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data,
    })
}
/**
 * 新品订货流程-完善sku信息 -变体图片删除
 */
export function reviewStepNo5VariantImgDel(params: IreviewStepNo1Del) {
    return request({
      url: `${BASE_API}/review/stepsNo5/variant/img/delete`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程-完善sku信息 -变体信息修改
 */
export function reviewStepNo5SkuInfoPerfect(data: IreviewStepNo5SkuInfoPerfect) {
    return request({
      url: `${BASE_API}/review/stepsNo5/skuInfo/perfect`,
      method: 'post',
      data,
    })
}
/**
 * 新品订货流程-完善sku信息 -保存
 */
export function reviewStepNo5SaveFv(params: IreviewId) {
    return request({
      url: `${BASE_API}/review/save/fv`,
      method: 'post',
      params,
    })
}
/**
 * 新品订货流程- 检查提交审核信息 - 保存
 */
export function reviewStepNo6SaveSix(params?: IreviewStepNo6SaveSix) {
    return request({
      url: `${BASE_API}/review/save/six`,
      method: 'post',
      params,
    })
}