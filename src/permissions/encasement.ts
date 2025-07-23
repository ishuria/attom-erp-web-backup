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
}

export default EncasementPermission
