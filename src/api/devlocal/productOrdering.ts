import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'
import type {
  IGetOperationOrderListReq,
  IGetOperationOrderListRes
} from '/@/type/storeOperation/productOrdering'

// 产品订货-查询列表
export function getProductList(data: IGetOperationOrderListReq): Promise<IGetOperationOrderListRes> {
  return request({
    url: `${BASE_API}/operation/order/list`,
    method: 'post',
    data
  })
}