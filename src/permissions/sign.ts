class SignPermission {
  /** 批量签收权限 */
  static readonly SIGN_BATCH = 'sign:batch'
  /** 签收记录列表权限 */
  static readonly SIGN_RECORD_LIST = 'sign:record:list'
  /** 已签收取消签收权限 */
  static readonly SIGN_DELETE = 'sign:delete'
  /** 签收权限 */
  static readonly SIGN_COMPONENT = 'sign:component'
  /** 打印权限 */
  static readonly SIGN_PRINT = 'sign:print'

  /**
   * 已签收操作列权限
   * @returns
   */
  static signArchiveOperationColume(): PermissionConfig {
    return {
      role: [],
      permission: [SignPermission.SIGN_DELETE, SignPermission.SIGN_RECORD_LIST],
      mode: 'oneOf',
    }
  }

  static signOperationColume(): PermissionConfig {
    return {
      role: [],
      permission: [SignPermission.SIGN_RECORD_LIST, SignPermission.SIGN_COMPONENT, SignPermission.SIGN_PRINT],
      mode: 'oneOf',
    }
  }
}

export default SignPermission
