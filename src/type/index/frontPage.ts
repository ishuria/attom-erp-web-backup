export interface IGetFrontPageProgressProjectsRes {
  data: {
    total: number
    list: IGetFrontPageProgressProjectsItem[]
  }
}

export interface IGetFrontPageProgressProjectsItem {
  spendTime: string
  oem0Count: number
  oem1Count: number
}
