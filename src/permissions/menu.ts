class MenuPermission {
  /** 添加菜单权限 */
  static readonly ADD = 'system:menu:add'
  /** 编辑菜单权限 */
  static readonly UPDATE = 'system:menu:update'
  /** 删除菜单权限 */
  static readonly DELETE = 'system:menu:delete'

  /** 操作列权限（编辑/删除） */
  static operationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [MenuPermission.UPDATE, MenuPermission.DELETE],
      mode: 'oneOf',
    }
  }
}

export default MenuPermission
