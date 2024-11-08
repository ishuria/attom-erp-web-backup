import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IBooleanRes,
  IBoxNumber,
  IGetEncasementListReq,
  IGetEncasementListRes,
  IGetEncasementSkuReq,
  IGetEncasementSkuRes,
  ISubmitEncasementSkuReq
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