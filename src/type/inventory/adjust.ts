export interface InventoryAdjustQuery {
  keyWord: string
  pageNo: number
  pageSize: number
  dateRange: [string, string] | []
}

export interface InventoryAdjustListReq {
  keyWord: string
  pageNo: number
  pageSize: number
  startDate?: string
  endDate?: string
}

export interface InventoryAdjustItem {
  id: number | string
  adjustDate?: string
  supplierName?: string
  po?: string
  poId?: number | string
  sku?: string
  productModel?: string
  productDesc?: string
  componentName?: string
  productName?: string
  adjustQuantity?: number
  price?: number
  adjustPreTaxPrice?: number
  taxInclusiveTotalPrice?: number
  shipmentId?: string
  contractNumber?: string
  boxNumber?: string
  source?: string
  remark?: string
  createUserName?: string
  createTime?: string
  redFlushStatus?: number | string
}

export interface InventoryAdjustDetailQuery {
  id: number | string
  pageNo: number
  pageSize: number
}

export interface InventoryAdjustDetailItem {
  id?: number | string
  goodCount?: number
  badCount?: number
  lackCount?: number
  manyCount?: number
  keepSampleCount?: number
  type?: string
  remark?: string
}

export interface InventoryAdjustSkuInfo {
  productDesc?: string
  skuImg?: string
}

export interface InventoryAdjustPoOption {
  poId: number | string
  po: string
}

export interface InventoryAdjustAddForm {
  sku: string
  productDesc: string
  poId?: number | string
  shipmentId: string
  boxNumber: string
  adjustQuantity?: number
  adjustPreTaxPrice?: number
  redFlushStatus?: number | string
  source: string
  remark: string
}

export interface InventoryAdjustAddReq {
  sku: string
  poId?: number | string
  shipmentId?: string
  boxNumber?: string
  adjustQuantity: number
  adjustPreTaxPrice: number
  redFlushStatus: number | string
  source?: string
  remark?: string
}

export interface InventoryAdjustMarginForm {
  margin?: number
}
