export interface IGetCommissionArtTypeListRes {
  data: IGetCommissionArtTypeList[]
}
export interface IGetCommissionArtTypeList {
  id: number
  userName: string
  roleName: string
  addition: number | null
  cooperationWeight: number | null
  longDay: number | null
  longSinglePersonProportion: number | null
  pictureDay: number | null
  singlePersonProportion: number | null
}
export interface IUpdateCommissionArtTypeReq {
  id: number
  addition: number | null
  cooperationWeight: number | null
  longDay: number | null
  longSinglePersonProportion: number | null
  pictureDay: number | null
  singlePersonProportion: number | null
}
export interface IGetCommissionProductTypeListRes {
  data: IGetCommissionProductTypeList[]
}
export interface IGetCommissionProductTypeList {
  id: number
  userName: string
  roleName: string
  aiTuoMCount: number | null
  attomCount: number | null
  day: number | null
  delivery: number | null
  productDesignProportion: number | null
  productManagerProportion: number | null
  proportion: number | null
  yunzhouCount: number | null
}
export interface IUpdateCommissionProductTypeReq {
  id: number
  aiTuoMCount: number | null
  attomCount: number | null
  day: number | null
  delivery: number | null
  productDesignProportion: number | null
  productManagerProportion: number | null
  proportion: number | null
  yunzhouCount: number | null
}
export interface IGetCommissionSettingRes {
  data: {
    acos: number
    upperLimit: number
    minConversionRate: number
    compensationDay: number
    instructionManualRate: number
    list: IGetCommissionSettingTableList[]
  }
}
export interface IGetCommissionSettingTableList {
  id: number
  unitPrice: string
  targetRate: number
}
export interface IUpdateCommissionSetting1Req {
  acos: number | null
  upperLimit: number | null
  minConversionRate: number | null
  compensationDay: number | null
}