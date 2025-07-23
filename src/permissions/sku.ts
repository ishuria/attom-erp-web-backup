class SkuPermission {
  /** SKU列表权限 */
  static readonly SKU_LIST = 'sku:list'
  /** SKU详情权限 */
  static readonly SKU_DETAIL = 'sku:detail'
  /** SKU状态更新权限 */
  static readonly SKU_STATUS_UPDATE = 'sku:status:update'
  /** SKU详情更新权限 */
  static readonly SKU_DETAIL_UPDATE = 'sku:detail:update'
  /** SKU备注更新权限 */
  static readonly SKU_REMARKS_UPDATE = 'sku:remarks:update'
  /** SKU图片上传权限 */
  static readonly SKU_IMG_UPLOAD = 'sku:img:upload'
  /** SKU图片删除权限 */
  static readonly SKU_IMG_DELETE = 'sku:img:delete'
  /** SKU组件创建权限 */
  static readonly SKU_COMPONENT_CREATE = 'sku:component:create'
  /** SKU组件删除权限 */
  static readonly SKU_COMPONENT_DELETE = 'sku:component:delete'
  /** SKU组件更新权限 */
  static readonly SKU_COMPONENT_UPDATE = 'sku:component:update'
  /** SKU组件查看权限 */
  static readonly SKU_COMPONENT_LIST = 'sku:component:list'
  /** SKU复制权限 */
  static readonly SKU_COPY = 'sku:copy'
  /** 清关系数设定 */
  static readonly CUSTOM_DECLARE_RATIO_QUERY = 'customDeclare:ratio:query'

  /**
   * sku操作列权限
   * @returns
   */
  static skuOperationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [SkuPermission.SKU_DETAIL, SkuPermission.SKU_COPY],
      mode: 'oneOf',
    }
  }

  /**
   * sku图片权限
   * @returns
   */
  static skuImageColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [SkuPermission.SKU_IMG_UPLOAD, SkuPermission.SKU_IMG_DELETE],
      mode: 'oneOf',
    }
  }
}

export default SkuPermission
