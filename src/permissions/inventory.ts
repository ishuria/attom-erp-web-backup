class InventoryPermission {
  /** SKU库存盘点列表权限 */
  static readonly INVENTORY_COUNT_LIST = 'inventory:count:list'
  /** SKU库存盘点新增权限 */
  static readonly INVENTORY_COUNT_ADD = 'inventory:count:add'
  /** SKU库存盘点取消权限 */
  static readonly INVENTORY_COUNT_CANCEL = 'inventory:count:cancel'
  /** SKU库存盘点完成权限 */
  static readonly INVENTORY_COUNT_FINISH = 'inventory:count:finish'
  /** SKU库存盘点更新权限 */
  static readonly INVENTORY_COUNT_UPDATE = 'inventory:count:update'
  /** SKU库存盘点余量设定修改权限 */
  static readonly INVENTORY_COUNT_MARGIN_UPDATE = 'inventory:count:margin:update'

  /**
   * 操作列权限
   * @returns 权限
   */
  static operationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [this.INVENTORY_COUNT_UPDATE],
      mode: 'oneOf',
    }
  }
}

export default InventoryPermission
