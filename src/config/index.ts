/**
 * @description 4个子配置，cli配置|通用配置|主题配置|网络配置导出
 */
import { cliConfig } from '/@/config/cli.config'
import { settingConfig } from '/@/config/setting.config'
import { themeConfig } from '/@/config/theme.config'
import { netConfig } from '/@/config/net.config'

export default {
  ...cliConfig,
  ...settingConfig,
  ...themeConfig,
  ...netConfig,
}
