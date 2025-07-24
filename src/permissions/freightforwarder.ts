class FreightForwarderPermission {
  /** 货代新增渠道权限 */
  static readonly FREIGHT_FORWARDER_CHANNEL_ADD = 'freightForwarder:channel:add'
  /** 货代渠道修改权限 */
  static readonly FREIGHT_FORWARDER_CHANNEL_UPDATE = 'freightForwarder:channel:update'
  /** 货代渠道复制权限 */
  static readonly FREIGHT_FORWARDER_CHANNEL_COPY = 'freightForwarder:channel:copy'
  /** 货代费用渠道安全天数计算权限 */
  static readonly FREIGHT_FORWARDER_CHANNEL_SAFE_DAYS_CALCULATE = 'freightForwarder:channel:safeDays:calculate'
  /** 货代新增货代权限 */
  static readonly FREIGHT_FORWARDER_ADD = 'freightForwarder:add'
  /** 货代清单权限 */
  static readonly FREIGHT_FORWARDER_LIST = 'freightForwarder:list'
  /** 货代费用名设定权限 */
  static readonly FREIGHT_FORWARDER_COST_NAME_SETTING = 'freightForwarder:costName:setting'
  /** 站点货代渠道设定权限 */
  static readonly FREIGHT_FORWARDER_CHANNEL_SITE_SETTING = 'freightForwarder:channel:site:setting'

  /**
   * 操作列权限
   * @returns 权限
   */
  static operationColume(): PermissionConfig {
    return {
      role: [],
      permission: [
        this.FREIGHT_FORWARDER_CHANNEL_UPDATE,
        this.FREIGHT_FORWARDER_CHANNEL_COPY,
        this.FREIGHT_FORWARDER_CHANNEL_SAFE_DAYS_CALCULATE,
      ],
      mode: 'oneOf',
    }
  }
}

export default FreightForwarderPermission
