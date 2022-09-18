/**
 * @description 4个子配置，vue/cli配置|通用配置|主题配置|网络配置导出
 *              config中的部分配置由vue.config.js读取，本质是node，故不可使用window等浏览器对象
 */
import { cliConfig } from '/@/config/cli.config'
import { settingConfig } from '/@/config/setting.config'
import { themeConfig } from '/@/config/theme.config'
import { netConfig } from '/@/config/net.config'

const setting: any = {
  ...cliConfig,
  ...settingConfig,
  ...themeConfig,
  ...netConfig,
}

export default setting
