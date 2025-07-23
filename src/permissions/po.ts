class PoPermission {
  /** 付款权限 */
  static readonly PAY = 'purchase:pay'
  /** 分批付款权限 */
  static readonly PAY_BATCH = 'purchase:pay:batch'
  /** 退款权限 */
  static readonly PAY_REFUND = 'purchase:pay:refund'
  /** 总价分摊权限 */
  static readonly TOTAL_PRICE_ALLOCATION = 'purchase:total:price:allocation'
  /** 生成合同权限 */
  static readonly GENERATE_CONTRACT = 'purchase:generate:contract'
  /** 聚合合同权限 */
  static readonly AGGREGATION_CONTRACT = 'purchase:aggregation:contract'
  /** 汇款模板权限 */
  static readonly REMITTANCE_TEMPLATE = 'purchase:remittance:template'
  /** 降本提成申请权限 */
  static readonly COST_REDUCTION_APPLY = 'purchase:cost:reduction:apply'
  /** 自动签收设定权限 */
  static readonly COMPONENT_AUTO_QUERY = 'purchase:component:auto:query'
  /** 删除PO权限 */
  static readonly DELETE = 'purchase:po:delete'
  /** 查询PO权限 */
  static readonly QUERY = 'purchase:po:query'
  /** 付款记录权限 */
  static readonly PAY_RECORD = 'purchase:pay:record'

  /** 查询表单权限 */
  static queryFormPermission(): PermissionConfig {
    return {
      role: [],
      permission: [PoPermission.QUERY],
      mode: 'oneOf',
    }
  }

  /** 操作按钮权限 */
  static operationButtonsPermission(): PermissionConfig {
    return {
      role: [],
      permission: [
        PoPermission.PAY,
        PoPermission.PAY_BATCH,
        PoPermission.PAY_REFUND,
        PoPermission.TOTAL_PRICE_ALLOCATION,
        PoPermission.GENERATE_CONTRACT,
        PoPermission.AGGREGATION_CONTRACT,
        PoPermission.REMITTANCE_TEMPLATE,
        PoPermission.COST_REDUCTION_APPLY,
        PoPermission.COMPONENT_AUTO_QUERY,
        PoPermission.DELETE,
      ],
      mode: 'oneOf',
    }
  }
}

export default PoPermission
