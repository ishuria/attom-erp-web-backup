import request from '/@/utils/request'
import { BASE_API } from '/@/api/devlocal/api'
import { PlatformCode } from '/@/const/platform'
import type {
  IOperationUserOption,
  IPlatFormItem,
  ISeasonalCoefficientOption,
  ISeasonalCoefficientDashboardReq,
  ISeasonalCoefficientDashboardRes,
  PlatformCodeType,
} from './types'

const PLATFORM_OPERATION_USER_URL_MAP: Record<PlatformCodeType, string> = {
  [PlatformCode.AMAZON]: '/amazon/operation/user/list',
  [PlatformCode.WALMART]: '/walmart/operation/user/list',
  [PlatformCode.TIKTOK]: '/tiktok/operation/user/list',
}

export const seasonalCoefficientDashboardApi = {
  getDashboard(data: ISeasonalCoefficientDashboardReq): Promise<ISeasonalCoefficientDashboardRes> {
    return request({
      url: `${BASE_API}/product/seasonal`,
      method: 'post',
      data,
    })
  },

  getKindList(site: number): Promise<{ data: ISeasonalCoefficientOption[] }> {
    return request({
      url: `${BASE_API}/kind/list/${site}`,
      method: 'get',
    })
  },

  getOperationUserList(platformCode: PlatformCodeType): Promise<{ data: IOperationUserOption[] }> {
    return request({
      url: `${BASE_API}${PLATFORM_OPERATION_USER_URL_MAP[platformCode]}`,
      method: 'get',
    })
  },

  getPlatformList(): Promise<{ data: IPlatFormItem[] }> {
    return request({
      url: `${BASE_API}/platform/list`,
      method: 'get',
    })
  },

  getSiteListByPlatform(platformId: number): Promise<{ data: ISeasonalCoefficientOption[] }> {
    return request({
      url: `${BASE_API}/platform/site/${platformId}`,
      method: 'get',
    })
  },
}
