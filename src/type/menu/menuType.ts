// menu 菜单

export interface IMenuQueryResp {
  id: number
  label: string
  children: IMenuQueryResp[]
}

export interface IMenuDeleteReq {
  id: number
}

export interface IMenuAddOrUpdteReq {
  id: string
  pid: string
  name: string
  path: string
  menuName: string
  component: string
  permissionId: string
  type: number
  sort: number
  status: string
  meta: MenuMeta
}

export interface MenuMeta {
  title: string
  icon: string
  badge: string
  dot: boolean
  hidden: boolean
  levelHidden: boolean
  isCustomSvg: boolean
  noClosable: boolean
  noKeepAlive: boolean
  tabHidden: boolean
  guard: string[]
}
