import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import {
  IGetSeasonalCoefficientListReq,
  IGetSeasonalCoefficientListRes,
  ISiteList
} from '/@/type/storeOperation/seasonalCoefficientType'

/**
 * @description 季节系数列表
 */
export function getSeasonalCoefficientList(params: IGetSeasonalCoefficientListReq): Promise<IGetSeasonalCoefficientListRes> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/list`,
    method: 'get',
    params
  })
}
/**
 * @description 季节系数的站点列表
 */
export function getSeasonalCoefficientSiteList(): Promise<{data: ISiteList[]}> {
  return request({
    url: `${BASE_API}/seasonal/coefficient/site/list`,
    method: 'get',
  })
}