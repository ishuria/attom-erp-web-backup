class ListingPermission {
  /** 发布任务权限 */
  static readonly LISTING_TASK_ADD = 'listing:task:add'
  /** 余量设定权限 */
  static readonly LISTING_TASK_MARGIN_SETTING = 'listing:task:margin:setting'
  /** 选品理由设定权限 */
  static readonly LISTING_TASK_REASONS = 'listing:task:reasons'
  /** 任务量统计权限 */
  static readonly LISTING_TASK_STATISTICS = 'listing:task:statistics'
  /** 卖点填写(批量)权限 */
  static readonly LISTING_TASK_SELLING_POINT = 'listing:task:selling:point'
  /** 任务分配权限 */
  static readonly LISTING_TASK_ASSIGN = 'listing:task:assign'
  /** 卖点填写权限 */
  static readonly LISTING_TASK_SELLING_POINT_FILL = 'listing:task:selling:point:fill'
  /** 文案填写权限 */
  static readonly LISTING_TASK_COPYWRITING_FILL = 'listing:task:copywriting:fill'
  /** 长期提成权限 */
  static readonly LISTING_TASK_LONG_TERM = 'listing:task:long:term'
  /** 完成任务权限 */
  static readonly LISTING_TASK_FINISH = 'listing:task:finish'
  /** 删除美工任务权限 */
  static readonly LISTING_TASK_DELETE = 'listing:task:delete'

  /**
   * 操作列权限
   * @returns 权限
   */
  static operationColume(): PermissionConfig {
    return {
      role: [],
      permission: [
        this.LISTING_TASK_DELETE,
        this.LISTING_TASK_FINISH,
        this.LISTING_TASK_LONG_TERM,
        this.LISTING_TASK_COPYWRITING_FILL,
        this.LISTING_TASK_SELLING_POINT_FILL,
      ],
      mode: 'oneOf',
    }
  }
}
export default ListingPermission
