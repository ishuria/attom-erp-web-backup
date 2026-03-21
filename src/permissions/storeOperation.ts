class StoreOperationPermission {
  /** 关键产品-查看权限 */
  static readonly KEY_PRODUCTS_QUERY = 'storeOperation:keyProducts:query'
  /** 关键产品-开启权限 */
  static readonly KEY_PRODUCTS_ENABLE = 'storeOperation:keyProducts:open'
  /** 关键产品-暂停权限 */
  static readonly KEY_PRODUCTS_PAUSE = 'storeOperation:keyProducts:pause'
  /** 关键产品-默认参数设置权限 */
  static readonly KEY_PRODUCTS_DEFAULT_PARAMS = 'storeOperation:keyProducts:defaultParams'
  /** 产品分配-批量老品认领 */
  static readonly PRODUCT_DISTRIBUTION_BATCH_CLAIM = 'storeOperation:productDistribution:batchClaim'
  /** 产品分配-标记待认领 */
  static readonly PRODUCT_DISTRIBUTION_MARK_UNCLAIMED = 'storeOperation:productDistribution:markUnclaimed'
  /** 待老品认领-审批 */
  static readonly UNCLAIMED_APPROVAL = 'storeOperation:unclaimed:approval'
}

export default StoreOperationPermission
