class PackingTaskPermission {
  /** 打包任务-开始任务权限 */
  static readonly PACKING_TASK_START = 'packing:task:start'
  /** 打包任务-下班权限 */
  static readonly PACKING_TASK_GET_OFF_WORK = 'packing:task:get:off:work'
  /** 打包任务-当前任务加人权限 */
  static readonly PACKING_TASK_ADD_PERSON = 'packing:task:add:person'
  /** 打包任务-结束任务权限 */
  static readonly PACKING_TASK_END = 'packing:task:end'
  /** 打包任务-条码文件夹权限 */
  static readonly PACKING_TASK_BARCODE_FOLDER = 'packing:task:barcode:folder'
  /** 打包任务-零件清单权限 */
  static readonly PACKING_TASK_PART_LIST = 'packing:task:part:list'
  /** 打包任务-打包质检权限 */
  static readonly PACKING_TASK_PACK_INSPECTION = 'packing:task:pack:inspection'
  /** 打包任务-新品质检权限 */
  static readonly PACKING_TASK_NEW_INSPECTION = 'packing:task:new:inspection'
  /** 打包任务-生成条形码权限 */
  static readonly PACKING_TASK_GENERATE_BARCODE = 'packing:task:generate:barcode'
  /** 打包任务-拆分权限 */
  static readonly PACKING_TASK_SPLIT = 'packing:task:split'
  /** 打包任务-站点修改权限 */
  static readonly PACKING_TASK_SITE_UPDATE = 'packing:task:site:update'
  /** 打包任务-任务数修改权限 */
  static readonly PACKING_TASK_TASK_NUMBER_UPDATE = 'packing:task:task:number:update'
  /** 打包任务-删除权限 */
  static readonly PACKING_TASK_DELETE = 'packing:task:delete'
  /** 打包任务-打包反馈权限 */
  static readonly PACKING_TASK_FEEDBACK = 'packing:task:feedback'
  /** 打包任务-验证条形码权限（进行中tab） */
  static readonly PACKING_TASK_VERIFY = 'packing:task:verify'
}

export default PackingTaskPermission
