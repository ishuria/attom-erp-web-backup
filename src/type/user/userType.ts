// 用户type

export interface IUserQuery {
  // 用户id
  userId: number
  // 姓名
  userName: string
  // 邮箱
  email: string
  // 角色名
  roleName: string
  // 状态 0正常，1禁用，2离职
  status: string
  // 创建时间
  createTime: string
}

export interface IUserQueryReq {
  pageNo: number
  pageSize: number
  userName: string
  status: number
}

export interface IUserDeleteReq {
  ids: string
}
/**
 * 用户编辑类型
 */
export interface IUserAddOrUpateReq {
  userId: string
  userName: string
  password: string
  currentYearSickLeave: number | null
  nextYearSickLeave: number | null
  currentYearAnnualLeave: number | null
  nextYearAnnualLeave: number | null
  affiliatedBranchCompany: string
  email: string
  roleName: string
  roleCode: string
  status: string
  roles: IRole[]
  companies: ICompany[] //分公司列表
}

interface IRole {
  roleCode: string
  roleName: string
}
/**
 * 每个分公司的类型
 */
export interface ICompany {
  label: string
  value: number
}

/**
 * 用户编辑参数类型
 */
export interface IEditParams {
  userId: string
  username: string
  password: string
  roleCode: string
  status: string
  email: string
  currentYearSickLeave: number | null
  nextYearSickLeave: number | null
  currentYearAnnualLeave: number | null
  nextYearAnnualLeave: number | null
  proportion?: string
  affiliatedBranchCompanyId: string | null
}
/**
 * 用户添加参数类型
 */
export interface IAddParams {
  username: string
  password: string
  email: string
  roleCode: string
  status: string
  currentYearSickLeave: number | null
  nextYearSickLeave: number | null
  currentYearAnnualLeave: number | null
  nextYearAnnualLeave: number | null
  affiliatedBranchCompanyId: string | null
}

export interface IGetAllNameReq {
  name: string
}

export interface IGetAddUserListResp {
  userId: number
  userName: string
}
