class EncasementPermission {
  /** 查询装箱列表权限 */
  static readonly ENCASEMENT_LIST = 'encasement:list'
  /** 开始装箱权限 */
  static readonly ENCASEMENT_CREATE = 'encasement:create'
  /** 发货亚马逊权限 */
  static readonly ENCASEMENT_AMAZON = 'encasement:amazon'
  /** 发货沃尔玛权限 */
  static readonly ENCASEMENT_WALMART = 'encasement:walmart'
  /** 修改发货计划权限 */
  static readonly ENCASEMENT_UPDATE_PLAN = 'encasement:update:plan'
  /** 上传pdf插页权限 */
  static readonly ENCASEMENT_UPLOAD_PDF = 'encasement:upload:pdf'
  /** 上传拆分文件权限 */
  static readonly ENCASEMENT_SPLIT = 'encasement:split'
  /** 导出尺寸权限 */
  static readonly ENCASEMENT_SIZE_EXPORT = 'encasement:size:export'
  /** 误差权限 */
  static readonly ENCASEMENT_ERROR = 'encasement:error'
  /** 修改装箱权限 */
  static readonly ENCASEMENT_UPDATE = 'encasement:update'
  /** 拆分箱数权限 */
  static readonly ENCASEMENT_COUNT_SPLIT = 'encasement:count:split'
  /** 删除装箱权限 */
  static readonly ENCASEMENT_DELETE = 'encasement:delete'
  /** 打印权限 */
  static readonly ENCASEMENT_PRINT = 'encasement:print'
  /** 解锁权限 */
  static readonly ENCASEMENT_UNLOCK = 'encasement:unlock'
  /** 生成发货亚马逊模板文件权限 */
  static readonly ENCASEMENT_GENERATE_AMAZON_TEMPLATE = 'encasement:generate:amazon:template'
  /** 发货计划渠道配置权限 */
  static readonly ENCASEMENT_PLAN_CHANNEL = 'encasement:plan:channel'

  /**
   * 操作列权限
   * @returns 权限
   */
  static operationColume(): PermissionConfig {
    return {
      role: [],
      permission: [
        EncasementPermission.ENCASEMENT_UPDATE,
        EncasementPermission.ENCASEMENT_COUNT_SPLIT,
        EncasementPermission.ENCASEMENT_DELETE,
        EncasementPermission.ENCASEMENT_PRINT,
      ],
      mode: 'oneOf',
    }
  }
}

export default EncasementPermission
