import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IProgressQueryReq } from '/@/type/progress/progressType'

/**
 * 获取新品进度管理数据
 * @param params 
 * @returns 
 */
export function getList(params?: IProgressQueryReq) {
    return request({
      url: `${BASE_API}/progress/list`,
      method: 'get',
      params,
    })
  }