import { BASE_API } from '/@/api/devlocal/api.ts'
import request from '/@/utils/request'

export const exchangeLarkToken = (data: { authorization_code: string; user_id: string | number }) => {
  return request.post(`${BASE_API}/lark/token/exchange`, data)
}
