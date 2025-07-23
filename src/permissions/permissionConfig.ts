// 权限配置接口规范
interface PermissionConfig {
  /** 角色列表 */
  role: string[]
  /** 权限列表 */
  permission: string[]
  /** 权限模式：oneOf(任一)、allOf(全部)、except(排除) */
  mode: 'oneOf' | 'allOf' | 'except'
}
