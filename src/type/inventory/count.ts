export interface InventoryCountQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface InventoryCountItem {
  id: number | string
  sku?: string
  skuImg?: string
  productName?: string
  po?: string
  poId?: number | string
  orderDate?: string
  packageTaskId?: number | string
  actualCount?: number
  taskCount?: number
  noEncasementCount?: number
  encasementCount?: number
  afterCount?: number
  lackCount?: number
  totalSendCount?: number
  totalReceiveCount?: number
  remark?: string
  createTime?: string
  packageTaskList?: InventoryCountPackageTaskItem[]
}

export interface InventoryCountPackageTaskItem {
  id: number | string
  po?: string
  packageTaskId?: number | string
  orderDate?: string
  actualCount?: number
  taskCount?: number
  afterCount?: number
  createTime?: string
}

export interface InventoryCountListRes {
  total: number
  list: InventoryCountItem[]
}

export interface InventoryCountMargin {
  count?: number
  proportion?: number
}

export interface InventoryCountMarginUpdateReq {
  count: number
  proportion: number
}

export interface InventoryCountUpdateReq {
  id: number | string
  noEncasementCount: number
  remark?: string
}

export interface InventoryCountPageState {
  marginLoading: boolean
  marginSaving: boolean
  listLoading: boolean
  addLoading: boolean
  cancelLoading: boolean
  finishLoading: boolean
}

export interface InventoryCountRowEditForm {
  id: number | string
  noEncasementCount?: number
  remark: string
}
