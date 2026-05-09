import type { IGetArtDesignTaskList } from '/@/type/listingTask/imageTaskType'

export type ListingImageTaskStatus = 0 | 1 | 2 | 3

export interface ListingImageTaskRow extends IGetArtDesignTaskList {
  _finishDateText?: string
  _actualFinishDateText?: string
  _usernamesByProp: Record<string, string[]>
  _basePicture?: string
  _modeling?: string
  _rendering?: string
  _aAdd?: string
  _video?: string
  _instructionManual?: string
  _colorDesign?: string
  _productPlaneDesign?: string
  _operation?: string
  _productDesign?: string
  _productManager?: string
}

export interface ListingImageTaskColumnWidths {
  sku: number
  publisher: number
  byProp: Record<string, number>
}

export interface ListingImageTaskTabConfig {
  name: ListingImageTaskStatus
  label: string
  assignButtonText?: string
  showToolbar: boolean
  showOperationFilter?: boolean
  showTaskTypeFilter?: boolean
  editableRequiredAddress?: boolean
  showNaturalDay?: boolean
  showAdvanceDays?: boolean
  canEditProofreading?: boolean
  showSubmitApproval?: boolean
  showDelete?: boolean
  showLongTerm?: boolean
  showDeadlineActions?: boolean
}

export type ListingImageTaskQueryMode = 'debounced' | 'immediate'
