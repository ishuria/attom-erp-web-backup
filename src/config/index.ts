/**
 * @description 4个子配置，cli配置|通用配置|主题配置|网络配置导出
 */
import { cliConfig } from '/@/config/cli.config'
import { settingConfig } from '/@/config/setting.config'
import { themeConfig } from '/@/config/theme.config'
import { netConfig } from '/@/config/net.config'

const config: { [key: string]: any } = {
  ...cliConfig,
  ...settingConfig,
  ...themeConfig,
  ...netConfig,
}

export default config

export const {
  base,
  outDir,
  assetsDir,
  port,
  pwa,
  chunkSizeWarningLimit,
  open,
  cssCodeSplit,
  title,
  titleSeparator,
  titleReverse,
  abbreviation,
  copyright,
  keepAliveMaxNum,
  isHashRouterMode,
  routesWhiteList,
  loadingText,
  tokenName,
  tokenTableName,
  storage,
  recordRoute,
  logo,
  i18n,
  messageDuration,
  errorLog,
  loginInterception,
  loginRSA,
  authentication,
  supportVisit,
  rolesControl,
  uniqueOpened,
  defaultOpeneds,
  debounce,
  openFirstMenu,
  layout,
  themeName,
  menuWidth,
  columnStyle,
  color,
  fixedHeader,
  showProgressBar,
  showTabs,
  tabsBarStyle,
  showTabsIcon,
  showLanguage,
  showRefresh,
  showSearch,
  showTheme,
  showNotice,
  showFullScreen,
  showThemeSetting,
  showDark,
  foldSidebar,
  pageTransition,
  contentType,
  timeout,
  successCode,
  statusName,
  messageName,
} = config
