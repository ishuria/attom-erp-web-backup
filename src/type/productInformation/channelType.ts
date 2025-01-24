export interface IGetMerchandiseListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}
export interface IGetMerchandiseListRes {
  data: {
    total: number
    list: IGetMerchandiseList[]
  }
}
export interface IGetMerchandiseList {
  id: number
  merchandiseName: string
  channel: string
  siteName: string
}
export interface IGetSkuShippingChannelListRes {
  data: {
    total: number
    list: IGetSkuShippingChannelList[]
  }
}
export interface IGetSkuShippingChannelList {
  id: number
  typeId: number
  sku: string
  productDesc: string
  skuImgUrl: string
  weight: string
  merchandiseName: string
  siteMerchandiseList: { channel: string, siteName: string }[]
  [property: string]: any
}
export interface IGetMerchandiseTypeListRes {
  data: IGetMerchandiseTypeList[]
}
export interface IGetMerchandiseTypeList {
  id: number
  label: string
}
export interface IId {
  id: number
}
export interface IGetMerchandiseDetail {
  data: {
    id: number
    merchandiseName: string
    amazonUsChannelId: number
    amazonCaChannelId: number
    amazonDeChannelId: number
    amazonUkChannelId: number
    amazonJapanChannelId: number
    walmartUsChannelId: number
  }
}
export interface IUpdateMerchandiseReq {
  id: number
  channelId: number
}
export interface ITypeId {
  typeId: number
}

export interface IGetMerchandiseChannelDetail {
  data: {
    amazonUsChannelName: string
    amazonCaChannelName: string
    amazonDeChannelName: string
    amazonUkChannelName: string
    amazonJapanChannelName: string
    walmartUsChannelName: string
  }
}
export interface IUpdateSkuShippingChannelMerchandise {
  id: number
  merchandiseId: number
}
export interface IUpdateBatchSkuShippingChannelMerchandise {
  ids: string
  merchandiseId: number
}