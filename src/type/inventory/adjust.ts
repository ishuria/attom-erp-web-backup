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
  packageTaskId?: number | string
  packageTaskCount?: number
  componentName?: string
  productName?: string
  adjustQuantity?: number
  count?: number
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

export interface InventoryAdjustPoListReq {
  sku: string
  po?: string
  allPo?: boolean
}

export interface InventoryAdjustPackingTaskQuery {
  poId: number | string
  sku: string
}

export interface InventoryAdjustPackingTaskOption {
  packageTaskId: number | string
  packageTaskCount?: number
  value: string
}

export interface InventoryAdjustAddForm {
  sku: string
  productDesc: string
  skuImg: string
  packingTaskId?: number | string
  currentTaskCount?: number | string
  allPo?: boolean
  poId?: number | string
  shipmentId: string
  boxNumber: string
  count?: number
  price?: number
  type?: number | string
  remark: string
}

export interface InventoryAdjustAddReq {
  sku: string
  poId?: number | string
  po?: string
  packageTaskId?: number | string
  packageTaskCount?: number
  shipmentId?: string
  boxNumber?: string
  count: number
  price: number
  type: number | string
  remark?: string
}

export interface InventoryAdjustPriceCalcReq {
  sku: string
  poId: number | string
  count: number
}

export interface InventoryAdjustMarginForm {
  margin?: number
}
