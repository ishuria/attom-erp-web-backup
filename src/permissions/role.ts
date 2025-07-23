class RolePermission {
  /** 添加角色权限 */
  static readonly ADD = 'system:role:add'
  /** 批量删除角色权限 */
  static readonly MORE_DELETE = 'system:role:more:delete'
  /** 编辑角色权限 */
  static readonly EDIT = 'system:role:edit'
  /** 删除角色权限 */
  static readonly DELETE = 'system:role:delete'

  /** 操作列权限（编辑/删除） */
  static operationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [RolePermission.EDIT, RolePermission.DELETE],
      mode: 'oneOf',
    }
  }
}

export default RolePermission
