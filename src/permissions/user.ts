class UserPermission {
  /** 添加用户权限 */
  static readonly ADD = 'system:user:add'
  /** 批量删除用户权限 */
  static readonly MORE_DELETE = 'system:user:more:delete'
  /** 编辑用户权限 */
  static readonly EDIT = 'system:user:edit'
  /** 删除用户权限 */
  static readonly DELETE = 'system:user:delete'

  static userOperationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [UserPermission.EDIT, UserPermission.DELETE],
      mode: 'oneOf',
    }
  }
}

export default UserPermission
