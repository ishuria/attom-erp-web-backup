class PlanPoPermission {
  /** 创建PlanPo权限 */
  static readonly CREATE = 'purchase:planPo:create'
  /** 批量发布PO权限 */
  static readonly BATCH_RELEASE = 'purchase:planPo:batch:release'
  /** 批量未达MOQ权限 */
  static readonly BATCH_NOT_MOQ = 'purchase:planPo:notMoq'
  /** 批量删除PO权限 */
  static readonly BATCH_DELETE = 'purchase:planPo:batch:delete'
  /** 删除PO权限 */
  static readonly DELETE = 'purchase:planPo:delete'
  /** 达到MOQ权限 */
  static readonly MOQ = 'purchase:planPo:moq'
  /** 未达MOQ权限 */
  static readonly NOT_MOQ = 'purchase:planPo:notMoq:sign'
  /** 发布PO权限 */
  static readonly RELEASE_PO = 'purchase:release:po'
  /** planPo详情权限 */
  static readonly DETAIL = 'purchase:po:detail'
  /** 删除PoSku权限 */
  static readonly DELETE_PO_SKU = 'purchase:planPoSku:delete'

  /** PO操作列权限 */
  static poOperationColumnPermission(): PermissionConfig {
    return {
      role: [],
      permission: [PlanPoPermission.RELEASE_PO, PlanPoPermission.NOT_MOQ, PlanPoPermission.DELETE],
      mode: 'oneOf',
    }
  }

  /** SKU操作列权限 */
  static skuOperationColumnPermission(): PermissionConfig {
    return {
      role: [],
      permission: [PlanPoPermission.DETAIL, PlanPoPermission.DELETE_PO_SKU],
      mode: 'oneOf',
    }
  }
}

export default PlanPoPermission
