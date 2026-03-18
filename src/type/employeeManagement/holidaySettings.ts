export interface IGetHolidaySettingsReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetHolidaySettingsRes {
  data: {
    list: IGetHolidaySettingsList[]
    total: number
  }
}

export interface IGetHolidaySettingsList {
  /**
   * 假日日期
   */
  create_time?: string
  /**
   * 主键id
   */
  id?: number
  /**
   * 员工ids ,号分隔
   */
  staffIds?: string
  /**
   * 员工s ,号分隔
   */
  staffs?: string
  /**
   * 时段
   */
  timeInterval?: string
  /**
   * 假期类型
   */
  type?: string
}
