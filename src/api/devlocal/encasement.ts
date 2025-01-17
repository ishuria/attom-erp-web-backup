import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IAddChannelFreightForwarderReq,
  IAddDetailEncasementReq,
  IAddFreightForwarderType,
  IBooleanRes,
  IBoxNumber,
  IConfirmEncasementShipmentsReq,
  IEncasementDetailId,
  IEncasementId,
  IEncasementIds,
  IFileName,
  IFilterShipmentFbaList,
  IGenerateTemplateFile1Req,
  IGetChannelListRes,
  IGetEncasementInspectionReq,
  IGetEncasementInspectionRes,
  IGetEncasementListReq,
  IGetEncasementListRes,
  IGetEncasementSkuReq,
  IGetEncasementSkuRes,
  IGetEncasementUpdateRes,
  IGetForwarderCostListRes,
  IGetForwarderListReq,
  IGetForwarderListRes,
  IGetShipmentArrivedListReq,
  IGetShipmentArrivedListRes,
  IGetShipmentFbaDetailListReq,
  IGetShipmentFbaDetailListRes,
  IGetShipmentFbaListReq,
  IGetShipmentFbaListRes,
  IGetShippedEncasementListRes,
  IId,
  IPrintEncasementReq,
  IPrintEncasementRes,
  ISplitEncasementCsv,
  ISplitEncasementReq,
  IStringRes,
  ISubmitEncasementSkuReq,
  ITypeId,
  IUpdateCostFreightForwarderReq,
  IUpdateEncasementReq,
  IUpdateEncasementShipmentDateReq,
  IUpdateFreightForwarderType,
  IUpdateLostGoodsStatus,
  IUpdateSafeDaysFreightForwarder,
  IUpdateShipmentFbaDate
} from '/@/type/packagingShipping/shippedType'

/**
 * @description 装箱-列表查询
 * @returns IGetEncasementListRes
 */
export const getEncasementList = (params: IGetEncasementListReq): Promise<IGetEncasementListRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/list`,
    method: 'get',
    params,
  })
}

/**
 * @description 开始装箱-初始化默认以递增的方式获取箱号
 */
export const getIncrementBoxNo = (): Promise<IBoxNumber> => {
  return request({
    url: `${BASE_API}/encasement/increment/boxNo`,
    method: 'get',
  })
}
/**
 * @description 开始装箱-回插的方式获取箱号
 */
export const getReinsertionBoxNo = (): Promise<IBoxNumber> => {
  return request({
    url: `${BASE_API}/encasement/reinsertion/boxNo`,
    method: 'get',
  })
}
/**
 * @description 开始装箱-根据站点和fnSku查询产品信息
 */
export const getEncasementSku = (params: IGetEncasementSkuReq): Promise<IGetEncasementSkuRes> => {
  return request({
    url: `${BASE_API}/encasement/getSku`,
    method: 'get',
    params
  })
}
/**
 * @description 开始装箱-保存并打印条形码
 */
export const submitEncasementSku = (data: ISubmitEncasementSkuReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/encasement/sku/submit`,
    method: 'post',
    data
  })
}
/**
 * @description 装箱-修改
 */
export const updateEncasement = (data: IUpdateEncasementReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/update`,
    method: 'post',
    data
  })
}
/**
 * @description 装箱-修改页面-新增新的明细
 */
export const addDetailEncasement = (data: IAddDetailEncasementReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/add/detail`,
    method: 'post',
    data
  })
}
/**
 * @description 装箱-修改前获取具体数据
 */
export const getEncasementUpdate = (params: IEncasementId): Promise<IGetEncasementUpdateRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/get`,
    method: 'get',
    params
  })
}
/**
 * @description 装箱修改-清点质检结果列表
 */
export const getEncasementInspection = (params: IGetEncasementInspectionReq): Promise<IGetEncasementInspectionRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/inspection`,
    method: 'get',
    params
  })
}
/**
 * @description 装箱-修改页面-删除装箱明细
 */
export const delEncasementInspection = (params: IEncasementDetailId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/detail/del`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱-删除
 */
export const delEncasement = (params: IEncasementId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/del`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱-修改发货计划
 */
export const updateEncasementShipmentDate = (data: IUpdateEncasementShipmentDateReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/shipmentDate/update`,
    method: 'post',
    data
  })
}
/**
 * @description 装箱-拆分
 */
export const splitEncasement = (params: ISplitEncasementReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/split`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱-箱数减
 */
export const reduceEncasementCount = (params: IEncasementId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/count/reduce`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱-箱数加
 */
export const plusEncasementCount = (params: IEncasementId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/count/plus`,
    method: 'post',
    params
  })
}
/**
 * @description 解锁
 */
export const unlockEncasement = (): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/awaiting/shipment/encasement/unlock`,
    method: 'post',
  })
}
/**
 * @description 发货亚马逊前置上锁请求
 */
export const doLockEncasement = (params: IEncasementIds): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/encasement/shipping/doLock`,
    method: 'post',
    params
  })
}
/**
 * @description 发货亚马逊生成模板文件
 */
export const generateTemplateFile1 = (data: IGenerateTemplateFile1Req): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/generate/templateFile1`,
    method: 'post',
    data
  })
}
/**
 * @description 发货亚马逊文件上传
 */
export const uploadGenerateTemplateFile2 = (data: FormData): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/generate/templateFile2/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}
/**
 * @description 发货生成装箱表格文件
 */
export const generateTemplateFile3 = (params: IEncasementIds): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/generate/templateFile3`,
    method: 'post',
    params
  })
}
/**
 * @description 发货完成提交
 */
export const confirmEncasementShipments = (data: IConfirmEncasementShipmentsReq): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/shipments`,
    method: 'post',
    data
  })
}
/**
 * @description 发货沃尔玛
 */
export const generateWalmartShipment = (params: IEncasementIds): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/shipments/walmart`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱文件上传
 */
export const uploadEncasementFile = (params: FormData): Promise<IStringRes> => {
  return request({
    url: `${BASE_API}/encasement/file/upload`,
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    params
  })
}

/**
 * @description 上传PDF插页提交并下载插页成功后的pdf
 */
export const insertPdf = (params: IFileName) => {
  return request({
    url: `${BASE_API}/encasement/pdf/insertPage`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱上传拆分
 */
export const splitEncasementCsv = (data: ISplitEncasementCsv): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/encasement/csv/split`,
    method: 'post',
    data
  })
}
/**
 * @description 货代渠道下拉列表
 */
export const getChannelList = (): Promise<IGetChannelListRes> => {
  return request({
    url: `${BASE_API}/channel/list`,
    method: 'get',
  })
}
/**
 * @description 已发货装箱列表查询列表查询
 */
export const getShippedEncasementList = (params: IGetEncasementListReq): Promise<IGetShippedEncasementListRes> => {
  return request({
    url: `${BASE_API}/shipment/encasement/list`,
    method: 'get',
    params
  })
}

/**
 * @description 货代下拉数据列表获取
 */
export const getFreightForwarderSelect = () => {
  return request({
    url: `${BASE_API}/freight/forwarder/select`,
    method: 'get',
  })
}
/**
 * @description 获取货代清单列表
 */
export const getFreightForwarderTypeList = () => {
  return request({
    url: `${BASE_API}/freight/forwarder/type/list`,
    method: 'get',
  })
}
/**
 * @description 添加货代类型
 */
export const addFreightForwarderType = (params: IAddFreightForwarderType): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/type/add`,
    method: 'post',
    params
  })
}
/**
 * @description 货代清单类型修改
 */
export const updateFreightForwarderType = (data: IUpdateFreightForwarderType): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/type/update`,
    method: 'post',
    data
  })
}
/**
 * @description 新增费用设定
 */
export const addCostFreightForwarder = (params: ITypeId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/add/cost`,
    method: 'post',
    params
  })
}
/**
 * @description 删除费用设定
 */
export const delCostFreightForwarder = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/cost/del`,
    method: 'post',
    params
  })
}
/**
 * @description 费用的修改
 */
export const updateCostFreightForwarder = (data: IUpdateCostFreightForwarderReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/cost/update`,
    method: 'post',
    data
  })
}
/**
 * @description 货代费用新增渠道
 */
export const addChannelFreightForwarder = (data: IAddChannelFreightForwarderReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/channel/add`,
    method: 'post',
    data
  })
}
/**
 * @description 货代费用渠道修改
 */
export const updateChannelFreightForwarder = (data: IAddChannelFreightForwarderReq): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/channel/update`,
    method: 'post',
    data
  })
}
/**
 * @description 货代渠道复制
 */
export const copyChannelFreightForwarder = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/channel/copy`,
    method: 'post',
    params
  })
}
/**
 * @description 渠道安全天数修改
 */
export const updateSafeDaysFreightForwarder = (params: IUpdateSafeDaysFreightForwarder): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/channel/safeDays/update`,
    method: 'post',
    params
  })
}
/**
 * @description 渠道安全天数
 */
export const safeDaysChannelFreightForwarder = (params: IId): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/channel/safeDays`,
    method: 'post',
    params
  })
}
/**
 * @description 货代费用名设定数据列表获取
 */
export const getForwarderCostList = (params: IId): Promise<IGetForwarderCostListRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/cost/list`,
    method: 'get',
    params
  })
}
/**
 * @description 货代列表获取
 */
export const getForwarderList = (params: IGetForwarderListReq): Promise<IGetForwarderListRes> => {
  return request({
    url: `${BASE_API}/freight/forwarder/list`,
    method: 'get',
    params
  })
}
/**
 * @description 货代修改详情获取
 */
export const getUpdateForwarderList = (params: IId) => {
  return request({
    url: `${BASE_API}/freight/forwarder/get`,
    method: 'get',
    params
  })
}

/**
 * @description 已发货 - 获取列表数据
 */
export const getShipmentArrivedList = (params: IGetShipmentArrivedListReq): Promise<IGetShipmentArrivedListRes> => {
  return request({
    url: `${BASE_API}/shipment/arrived/list`,
    method: 'get',
    params
  })
}
/**
 * @description 已发货 - 修改丢货状态
 */
export const updateLostGoodsStatus = (params: IUpdateLostGoodsStatus): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/lostGoods/status`,
    method: 'post',
    params
  })
}
/**
 * @description FBA-获取数据列表
 */
export const getShipmentFbaList = (params: IGetShipmentFbaListReq): Promise<IGetShipmentFbaListRes> => {
  return request({
    url: `${BASE_API}/shipment/fba/list`,
    method: 'get',
    params
  })
}
/**
 * @description FBA货件-修改最新预计入库时间
 */
export const updateShipmentFbaDate = (params: IUpdateShipmentFbaDate): Promise<IBooleanRes> => {
  return request({
    url: `${BASE_API}/shipment/fba/date/update`,
    method: 'post',
    params
  })
}
/**
 * @description FBA货件-明细列表
 */
export const getShipmentFbaDetailList = (params: IGetShipmentFbaDetailListReq): Promise<IGetShipmentFbaDetailListRes> => {
  return request({
    url: `${BASE_API}/shipment/fba/detail/list`,
    method: 'get',
    params
  })
}
/**
 * @description FBA-筛选获取列表
 */
export const filterShipmentFbaList = (params: IFilterShipmentFbaList): Promise<IGetShipmentFbaListRes> => {
  return request({
    url: `${BASE_API}/shipment/fba/filter/list`,
    method: 'post',
    params
  })
}
/**
 * @description 装箱-打印
 */
export const printEncasement = (data: IPrintEncasementReq): Promise<IPrintEncasementRes> => {
  return request({
    url: `${BASE_API}/encasement/print`,
    method: 'post',
    data
  })
}
export const printEncasementSuccess = (data: any) => {
  return request({
    url: "https://192.168.6.19:6789/api/v2/print",
    method: 'post',
    data
  })
}