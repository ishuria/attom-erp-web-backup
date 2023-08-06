/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import {
  isCatchedTabs as _isCatchedTabs,
  color,
  columnStyle,
  fixedHeader,
  foldSidebar,
  i18n,
  isFollow,
  layout,
  logo,
  menuWidth,
  pageTransition,
  radius,
  showColorPicker,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
  showLock,
  showNotice,
  showProgressBar,
  showRefresh,
  showSearch,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
  title,
} from '/@/config'
import { lightenColor } from '/@/utils/lightenColor'
import { isJson } from '/@/utils/validate'

const defaultTheme: ThemeType = {
  color,
  columnStyle,
  fixedHeader,
  foldSidebar,
  isFollow,
  layout,
  menuWidth,
  pageTransition,
  radius,
  showColorPicker,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
  showLock,
  showNotice,
  showProgressBar,
  showRefresh,
  showSearch,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
}

const getLocalStorage = (key: string) => {
  const value: any = localStorage.getItem(key)
  if (value && isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}

const { collapse = foldSidebar } = getLocalStorage('collapse')
const { isCatchedTabs = _isCatchedTabs } = getLocalStorage('isCatchedTabs')

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsModuleType => ({
    collapse,
    color: getLocalStorage('color').color || color,
    device: 'desktop',
    isCatchedTabs,
    language: getLocalStorage('language').language || i18n,
    lock: getLocalStorage('lock').lock || false,
    logo: getLocalStorage('logo').logo || logo,
    mode: localStorage.getItem('vueuse-color-scheme') || 'light',
    theme: { ...defaultTheme, ...getLocalStorage('shop-vite-theme') } || {
      ...defaultTheme,
    },
    title: getLocalStorage('title').title || title,
  }),
  getters: {
    getCollapse: (state) => state.collapse,
    getColor: (state) => state.color,
    getDevice: (state) => state.device,
    getIsCatchedTabs: (state) => state.isCatchedTabs,
    getLanguage: (state) => state.language,
    getLock: (state) => state.lock,
    getLogo: (state) => state.logo,
    getMode: (state) => state.mode,
    getTheme: (state) => state.theme,
    getTitle: (state) => state.title,
  },
  actions: {
    updateState(obj: any) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        // @ts-ignore
        this[key] = obj[key]
        localStorage.setItem(
          key,
          typeof obj[key] == 'string' ? `{"${key}":"${obj[key]}"}` : `{"${key}":${obj[key]}}`
        )
      })
    },
    updateMode(value: any) {
      this.mode = value
    },
    saveTheme() {
      localStorage.setItem('shop-vite-theme', JSON.stringify(this.theme))
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      if (this.device === 'mobile') this.theme = { ...defaultTheme, ...{ layout: 'vertical' } }
      localStorage.removeItem('shop-vite-theme')
      this.updateTheme()
    },
    updateTheme() {
      document.getElementsByTagName('body')[0].className = `vab-theme-${this.theme.themeName}`

      if (this.theme.themeName !== 'default') {
        document.getElementsByTagName('html')[0].className = ''
        localStorage.setItem('vueuse-color-scheme', 'light')
      }

      const el = ref<any>(null)
      if (this.theme.menuWidth && this.theme.menuWidth.endsWith('px'))
        useCssVar('--el-left-menu-width', el).value = this.theme.menuWidth
      else useCssVar('--el-left-menu-width', el).value = '266px'

      if (!this.theme.showTabs) useCssVar('--el-tabs-height', el).value = '0px'
      else useCssVar('--el-tabs-height', el).value = '50px'

      if (!this.theme.showFooter) useCssVar('--el-footer-height', el).value = '0px'
      else useCssVar('--el-footer-height', el).value = '58px'

      if (!this.theme.isFollow) useCssVar('--el-menu-background-color', el).value = '#282c34'
      else useCssVar('--el-menu-background-color', el).value = lightenColor(this.color, 10)

      if (this.theme.radius)
        useCssVar('--el-border-radius-base', el).value = `${this.theme.radius}px`
      else useCssVar('--el-left-menu-width', el).value = `${this.theme.radius}px`
    },
    toggleCollapse() {
      this.collapse = !this.collapse
      localStorage.setItem('collapse', `{"collapse":${this.collapse}}`)
    },
    toggleDevice(device: string) {
      this.updateState({ device })
    },
    openSideBar() {
      this.updateState({ collapse: false })
    },
    foldSideBar() {
      this.updateState({ collapse: true })
    },
    changeLanguage(language: string) {
      this.updateState({ language })
    },
    handleLock() {
      this.updateState({ lock: true })
    },
    handleUnLock() {
      this.updateState({ lock: false })
    },
    updateCatchedTabs(value: any) {
      this.updateState({ isCatchedTabs: value })
      if (!value) localStorage.removeItem('catchedRoutes')
    },
    changeLogo(logo: string) {
      this.updateState({ logo })
    },
    changeTitle(title: string) {
      this.updateState({ title })
    },
    changeColor(color: string) {
      this.updateState({ color })
    },
  },
})
