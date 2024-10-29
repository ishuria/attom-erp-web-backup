import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IAddQualityCheckReq,
  IBooleanResp,
  IConfirmEndTask,
  IConfirmStartTask,
  IGetEndTaskListResp,
  IGetPackageComponentListResp,
  IGetPackageInspectionResp,
  IGetPackageTaskListQuery,
  IGetPackageTaskListResp,
  IGetQualityCheckResp,
  IGetSignListQuery,
  IGetSignListResp,
  IGetSignRecordResp,
  IGetStartTaskListResp,
  IId,
  IPoId,
  ISignComponent,
  ISignId,
  ISignIds,
  ISignRecordId,
  ISplitPackageTask,
  IStringResp,
  IUpdatePackageInspection,
  IUpdatePackageInspectionDetail,
  IUpdatePackageTask,
  IUpdatePriorityPackaging,
  IUpdateProductDate,
  IUpdateRecordCount,
  IUpdateRecordOrder,
  IUpdateSignLog,
  IUserIds,
  IGetAfterSalesListReq,
  IGetAfterSalesListResp,
  IGetAfterSalesLogResp,
  IUpdateAfterSales,
  IConfirmStartMoreTask,
  IGetPackageTimeListReq,
  IGetPackageTimeListResp,
  IUpdatePackageTime,
  IGetPackageTimeDayRequest,
  IGetPackageTimeDayResp
} from '/@/type/packagingShipping/packagingType'

export function getSignList(params: IGetSignListQuery): Promise<IGetSignListResp> {
  return request({
    url: `${BASE_API}/sign/list`,
    method: 'get',
    params,
  })
}

// 修改生成完成日期
export function updateProductDate(params: IUpdateProductDate): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/update/productDate`,
    method: 'post',
    params,
  })
}

// 查询签收零件跟踪日志
export function getSignLog(params: ISignId): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/sign/log`,
    method: 'get',
    params,
  })
}
// 修改签收零件跟踪日志
export function updateSignLog(params: IUpdateSignLog): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/update/log`,
    method: 'post',
    params,
  })
}
// 批量签收
export function signBatch(params: ISignIds): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/batch`,
    method: 'post',
    params,
  })
}
// 签收
export function signComponent(params: ISignComponent): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/component`,
    method: 'post',
    params,
  })
}
// 查询签收记录
export function getSignRecord(params: ISignId): Promise<IGetSignRecordResp> {
  return request({
    url: `${BASE_API}/sign/record/list`,
    method: 'get',
    params,
  })
}
// 修改签收零件数量
export function updateRecordCount(params: IUpdateRecordCount): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/record/update/count`,
    method: 'post',
    params,
  })
}
// 修改签收零件的订单号
export function updateRecordOrder(params: IUpdateRecordOrder): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/record/update/order`,
    method: 'post',
    params,
  })
}
// 已签收-取消签收前置判断该条数据是否有多条签收记录-返回true说明有多条签收记录，需要弹窗显示。返回false需要调用已签收-取消签收接口
export function signMoreRecord(params: ISignId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/more/record`,
    method: 'get',
    params,
  })
}
// 已签收-取消签收
export function deleteSign(params: ISignId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/delete`,
    method: 'post',
    params,
  })
}
// 签收记录删除并取消签收
export function deleteSignRecord(params: ISignRecordId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/sign/record/delete`,
    method: 'post',
    params,
  })
}

// 查询打包列表
export function getPackageTaskList(params: IGetPackageTaskListQuery): Promise<IGetPackageTaskListResp> {
  return request({
    url: `${BASE_API}/package/task/list`,
    method: 'get',
    params,
  })
}

// 开始任务-初始人员数据获取
export function getStartTaskList(): Promise<IGetStartTaskListResp> {
  return request({
    url: `${BASE_API}/package/startTask/list`,
    method: 'get',
  })
}
// 开始任务-选择人员后确定
export function confirmStartTask(data: IConfirmStartTask): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/startTask`,
    method: 'post',
    data
  })
}
// 开始多个任务-选择人员后确定
export function confirmStartMoreTask(data: IConfirmStartMoreTask): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/more/startTask`,
    method: 'post',
    data
  })
}
// 结束任务-列表数据初始化
export function getEndTaskList(): Promise<IGetEndTaskListResp> {
  return request({
    url: `${BASE_API}/package/endTask/list`,
    method: 'get',
  })
}
// 结束任务-选择人员后确定
export function confirmEndTask(data: IConfirmEndTask): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/endTask`,
    method: 'post',
    data
  })
}
// 当前任务加人-初始人员数据获取
export function getFreeList(): Promise<IGetStartTaskListResp> {
  return request({
    url: `${BASE_API}/package/free/list`,
    method: 'get',
  })
}
// 当前任务加人-选择人员后确定
export function confirmCurrentTaskAddPerson(params: IUserIds): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/current/task/addPerson`,
    method: 'post',
    params
  })
}
// 下班人员-获取下班人员列表
export function getGoOffWorkList(): Promise<IGetStartTaskListResp> {
  return request({
    url: `${BASE_API}/package/goOffWork/list`,
    method: 'get',
  })
}
// 下班人员-前置check接口
export function checkGoOffWork(params: IUserIds): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/goOffWork/check`,
    method: 'post',
    params
  })
}
// 下班人员-确定提交
export function confirmGoOffWork(params: IUserIds): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/goOffWork`,
    method: 'post',
    params
  })
}
// 修改优先打包
export function updatePriorityPackaging(params: IUpdatePriorityPackaging): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/update/priorityPackaging`,
    method: 'post',
    params
  })
}
// 查询零件清单数据列表
export function getPackageComponentList(params: IId): Promise<IGetPackageComponentListResp> {
  return request({
    url: `${BASE_API}/package/component/list`,
    method: 'get',
    params
  })
}
// 查询质检信息
export function getQualityCheck(params: IId): Promise<IGetQualityCheckResp> {
  return request({
    url: `${BASE_API}/quality/check`,
    method: 'get',
    params
  })
}
// 添加质检信息
export function addQualityCheck(data: IAddQualityCheckReq): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/quality/check/add`,
    method: 'post',
    data
  })
}
// 打包任务的拆分
export function splitPackageTask(data: ISplitPackageTask): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/task/split`,
    method: 'post',
    data
  })
}
// 打包任务修改
export function updatePackageTask(data: IUpdatePackageTask): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/task/update`,
    method: 'post',
    data
  })
}
// 质检报告-保存
export function updatePackageInspection(data: IUpdatePackageInspection): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/inspection/update`,
    method: 'post',
    data
  })
}
// 质检报告详情-修改
export function updatePackageInspectionDetail(data: IUpdatePackageInspectionDetail): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/inspection/detail/update`,
    method: 'post',
    data
  })
}
// 质检报告查询
export function getPackageInspection(params: IPoId): Promise<IGetPackageInspectionResp> {
  return request({
    url: `${BASE_API}/package/inspection`,
    method: 'get',
    params
  })
}
// 质检报告-提交
export function submitPackageInspection(data: IUpdatePackageInspection): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/inspection/submit`,
    method: 'post',
    data
  })
}
// 售后-查询列表
export function getAfterSalesList(params: IGetAfterSalesListReq): Promise<IGetAfterSalesListResp> {
  return request({
    url: `${BASE_API}/after/sales/list`,
    method: 'get',
    params
  })
}
// 售后-售后质检记录
export function getAfterSalesLog(params: IPoId): Promise<IGetAfterSalesLogResp> {
  return request({
    url: `${BASE_API}/after/sales/log`,
    method: 'get',
    params
  })
}
// 售后记录-已联系修改
export function updateAfterSales(data: IUpdateAfterSales): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/after/sales/update`,
    method: 'post',
    data
  })
}
// 售后凭证-上传
export function uploadAfterSales(data: FormData): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/after/sales/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}
// 售后凭证-删除
export function deleteAfterSales(params: IId): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/after/sales/delete`,
    method: 'post',
    params
  })
}
// 售后-已联系归档前置请求
export function checkAfterSalesArchive(params: IId): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/after/sales/archive/check`,
    method: 'post',
    params
  })
}
// 售后-已联系归档
export function archiveAfterSales(params: IId): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/after/sales/archive`,
    method: 'post',
    params
  })
}
// 售后-已联系坏账
export function badDebtAfterSales(params: IId): Promise<IStringResp> {
  return request({
    url: `${BASE_API}/after/sales/badDebt`,
    method: 'post',
    params
  })
}
// 查询打包工时列表
export function getPackageTimeList(params: IGetPackageTimeListReq): Promise<IGetPackageTimeListResp> {
  return request({
    url: `${BASE_API}/package/time/list`,
    method: 'get',
    params
  })
}
// 打包工时修改
export function updatePackageTime(data: IUpdatePackageTime): Promise<IBooleanResp> {
  return request({
    url: `${BASE_API}/package/time/update`,
    method: 'post',
    data
  })
}
// 打包工时统计列表查询
export function getPackageTimeDay(params: IGetPackageTimeDayRequest): Promise<IGetPackageTimeDayResp> {
  return request({
    url: `${BASE_API}/package/time/day`,
    method: 'get',
    params
  })
}
// 开始任务确定-sku质检列表
export function getSkuQualityList(params: IId): Promise<IGetPackageTimeDayResp> {
  return request({
    url: `${BASE_API}/package/task/skuQualityList`,
    method: 'get',
    params
  })
}