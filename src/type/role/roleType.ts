// 角色roles

export interface IRole {
  // 菜单or按钮的id
  id: number
  // 后台权限id
  permissionId: number
  // meta信息
  meta: IMeta

  children: IRole[]
}

interface IMeta {
  // 标题
  title: string
}

export interface IRoleQuery {
  // 当前页
  pageNo: number
  // 每页大小
  pageSize: number
  // 角色名
  role: string
}

export interface IRoleDeleteReq {
  // id列表
  ids: string
}

export interface IRoleAddOrUpdateReq {
  // 角色id
  roleId: string
  // 选中的菜单项
  menuCheckedList: string[]
  // 菜单id
  menuIds: string
  // 权限id
  permissionIds: string
  // 角色code
  roleCode: string
  // 角色名称
  roleName: string
  // 角色英文名
  roleNameEn: string
  // 角色状态
  status: string
}

export interface IRoleRes {
  createTime: string
  roleId: number
  roleCode: string
  roleName: string
  roleNameEn: string
  status: string
  incentivePolicy: string
}

export interface IRoleMenuReq {
  // 角色code
  roleCode: string
}

export interface IRoleUpdateIncentivePolicyReq {
  // 角色id
  id: number
  // 激励政策
  incentivePolicy: string
}
