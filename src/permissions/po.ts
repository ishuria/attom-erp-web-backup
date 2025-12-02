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
  /** 发布打包任务按钮权限 */
  static readonly PACKAGE_TASK_REPLEASE = 'purchase:packageTask:release'
  /** PoSku替换按钮 */
  static readonly PO_SKU_REPLACE = 'purchase:sku:replace'
  /** Po自动付款-添加合同路径 */
  static readonly PO_AUTO_PAY_ADD_PATH = 'purchase:auto:pay:add:path'
  /**Po自动付款-记录列表查询 */
  static readonly PO_AUTO_PAY_LIST = 'purchase:auto:pay:list'
}

export default PoPermission
