import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import type { IGetHolidaySettingsReq, IGetHolidaySettingsRes } from '/@/type/employeeManagement/holidaySettings'

/**
 * 假日设置-获取假日设置列表
 * @param params
 * @returns
 */
export function getHolidaySettingsList(params: IGetHolidaySettingsReq): Promise<IGetHolidaySettingsRes> {
  return request({
    url: `${BASE_API}/holiday/settings/list`,
    method: 'get',
    params,
  })
}

/**
 * 假日设置-新增假日设置
 * @param data
 * @returns
 */
export function addHolidaySettings(data: { holidayDate: string; type: string }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/holiday/settings/add`,
    method: 'post',
    data,
  })
}

/**
 * 假日设置-删除假日设置
 * @param params
 * @returns
 */
export function deleteHolidaySettings(params: { id: number }): Promise<{ data: boolean }> {
  return request({
    url: `${BASE_API}/holiday/settings/delete`,
    method: 'post',
    params,
  })
}
