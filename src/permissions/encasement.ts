class EncasementPermission {
  /** 查询装箱列表权限 */
  static readonly ENCASEMENT_LIST = 'encasement:list'
  /** 开始装箱权限 */
  static readonly ENCASEMENT_CREATE = 'encasement:create'
  /** 发货亚马逊权限 */
  static readonly ENCASEMENT_AMAZON = 'encasement:amazon'
  /** 发货沃尔玛权限 */
  static readonly ENCASEMENT_WALMART = 'encasement:walmart'
}

export default EncasementPermission
