import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IGetCommissionArtTypeListRes,
  IGetCommissionProductTypeListRes,
  IGetCommissionSettingRes,
  IGetCommissionTaskPictureListReq,
  IGetCommissionTaskPictureListRes,
  IUpdateCommissionArtTypeReq,
  IUpdateCommissionProductTypeReq,
  IUpdateCommissionSetting1Req
} from '/@/type/commission/commissionType'

/**
 * @description 提成系数设定-美工类型
 */
export function getCommissionArtTypeList(params: { keyWord: string }): Promise<IGetCommissionArtTypeListRes> {
  return request({
    url: `${BASE_API}/commission/art/type/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 提成系数设定-美工类型-修改
 */
export function updateCommissionArtType(data: IUpdateCommissionArtTypeReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/art/type/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成系数设定-产品类型
 */
export function getCommissionProductTypeList(params: { keyWord: string }): Promise<IGetCommissionProductTypeListRes> {
  return request({
    url: `${BASE_API}/commission/product/type/list`,
    method: 'get',
    params,
  })
}
/**
 * @description 提成系数设定-产品类型-修改
 */
export function updateCommissionProductType(data: IUpdateCommissionProductTypeReq): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/product/type/update`,
    method: 'post',
    data,
  })
}
/**
 * @description 提成系数设定-参数设定列表
 */
export function getCommissionSetting(): Promise<IGetCommissionSettingRes> {
  return request({
    url: `${BASE_API}/commission/setting`,
    method: 'get',
  })
}
/**
 * @description 提成系数设定-参数设定列表1确定提交
 */
export function updateCommissionSetting1(data: IUpdateCommissionSetting1Req): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/setting1/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成系数设定-参数设定2table修改
 */
export function updateCommissionSetting2(data: { id: number, targetRate: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/commission/setting2/update`,
    method: 'post',
    data
  })
}
/**
 * @description 提成任务-美工图片任务列表查询
 */
export function getCommissionTaskPictureList(params: IGetCommissionTaskPictureListReq): Promise<IGetCommissionTaskPictureListRes> {
  return request({
    url: `${BASE_API}/commission/task/picture/list`,
    method: 'get',
    params
  })
}