export interface IaddPurchaseCompany {
  companyAbbreviation: string
  purchaserFullName: string
  customsDeclarationMode: string
  accountOpeningBank: string
  bankAccountNumber: string
}

export interface IGetPurchaseRepositoryQuery {
  pageNo: number
  pageSize: number
  keyWord: string
}

export interface IupdatePurchaseCompany {
  purchaserId: number
  companyAbbreviation?: string
  purchaserFullName?: string
  customsDeclarationMode?: string
  accountOpeningBank?: string
  bankAccountNumber?: string
}

export interface IPurchaserId {
  purchaserId: number
}

export interface IgetPurchaseRepositoryResp {
  code: number
  msg: string
  data: {
    total: number
    list: IgetPurchaseRepository[]
  }
}
export interface IgetPurchaseRepository {
  address: string
  associates: string
  characteristic: number
  createTime: string
  createUserName: string
  id: number
  name: string
  phone: string
  remarks: string
  status: number
}

export interface IaddPurchaseRepository {
  name: string
  characteristic: number
  status: number
  address: string
  associates: string
  phone: string
  remarks?: string
}

export interface IRepositoryId {
  repositoryId: number
}

export interface IupdatePurchaseRepository {
  id?: number
  name?: string
  characteristic?: number
  status?: number
  address?: string
  associates?: string
  phone?: string
  remarks?: string
}
