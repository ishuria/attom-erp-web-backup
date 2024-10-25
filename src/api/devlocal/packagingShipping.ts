import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import { IGetSignListQuery, IGetSignListResp } from '/@/type/packagingShipping/packagingType'

export function getSignList(params: IGetSignListQuery): Promise<IGetSignListResp> {
  return request({
    url: `${BASE_API}/sign/list`,
    method: 'get',
    params,
  })
}