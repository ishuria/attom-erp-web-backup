/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import { isJson } from '/@/utils/validate'
import {
  color,
  columnStyle,
  fixedHeader,
  foldSidebar,
  i18n,
  layout,
  logo as _logo,
  menuWidth,
  pageTransition,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
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
  title as _title,
} from '/@/config'

const defaultTheme: ThemeType = {
  color,
  columnStyle,
  fixedHeader,
  foldSidebar,
  layout,
  menuWidth,
  pageTransition,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
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
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}

const theme = getLocalStorage('shop-vite-theme') || { ...defaultTheme }
const { collapse = foldSidebar } = getLocalStorage('collapse')
const { language = i18n } = getLocalStorage('language')
const { logo = _logo } = getLocalStorage('logo')
const { title = _title } = getLocalStorage('title')

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsModuleType => ({
    theme,
    device: 'desktop',
    collapse,
    color: getLocalStorage('color').color || color,
    language,
    logo,
    title,
  }),
  getters: {
    getTheme: (state) => state.theme,
    getDevice: (state) => state.device,
    getCollapse: (state) => state.collapse,
    getColor: (state) => state.color,
    getLanguage: (state) => state.language,
    getLogo: (state) => state.logo,
    getTitle: (state) => state.title,
  },
  actions: {
    updateState(obj: any) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        // @ts-ignore
        this[key] = obj[key]
        localStorage.setItem(
          key,
          typeof obj[key] == 'string'
            ? `{"${key}":"${obj[key]}"}`
            : `{"${key}":${obj[key]}}`
        )
      })
    },
    saveTheme() {
      localStorage.setItem('shop-vite-theme', JSON.stringify(this.theme))
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      localStorage.removeItem('shop-vite-theme')
      this.updateTheme()
    },
    updateTheme() {
      document.getElementsByTagName(
        'body'
      )[0].className = `vab-theme-${this.theme.themeName}`

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

      if (!this.theme.showFooter)
        useCssVar('--el-footer-height', el).value = '0px'
      else useCssVar('--el-footer-height', el).value = '58px'
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
