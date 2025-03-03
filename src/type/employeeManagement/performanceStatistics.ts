export interface IGetProductManagerAssessmentListReq {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface IGetProductManagerAssessmentListRes {
  data: {
    total: number
    list: IGetProductManagerAssessmentList[]
  }
}

export interface IGetProductManagerAssessmentList {
  id: number
  userName?: string
  month?: string
  assessmentNumber?: number
  assessmentNumberFinish?: number
  oem?: number
  oemFinish?: number
  status?: number
}

export interface IUpdateProductManagerAssessmentReq {
  id: number
  oem?: number
  totalAssessment?: number
  status?: number
}