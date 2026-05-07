import type { PlatformCodeType } from '/@/const/platform'

export type { PlatformCodeType }

export interface ISeasonalCoefficientOption {
  id: number
  label: string
}

export interface ISeasonalCoefficientDashboardReq {
  platformId: number
  site: number
  kindId: number
  month: number
  keyWord: string
  pageNo: number
  pageSize: number
  orderByField?: string
  orderDirection?: string
  /** 运营人员 id，0 或不传表示全部 */
  operationUserId?: number
}

export interface ISeasonalCoefficientDashboardItem {
  month: string
  sku?: string
  skuImgUrl?: string
  salesVolume: number
  ratio: number
  actual: number
  estimate: number
  diff: number
  kindId: number
  asin: string
  asinUrl: string
  kindName: string
}

export interface ISeasonalCoefficientDashboardRes {
  data: {
    productCount: number
    barChart: { x: string; y: number }[]
    list: {
      tota: number
      list: ISeasonalCoefficientDashboardItem[]
    }
    top10List: ISeasonalCoefficientDashboardItem[]
  }
}

export interface IPlatFormItem {
  platformId: number
  platformName: string
  /** 平台编码（Amazon / Walmart / TikTok），用于路由对应平台的子接口 */
  platformCode: PlatformCodeType
}

export interface IOperationUserOption {
  id: number
  label: string
}
