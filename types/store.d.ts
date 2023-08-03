declare interface AclModuleType {
  admin: boolean
  role: string[]
  permission: string[]
}

declare interface ErrorLogModuleType {
  errorLogs: any[]
}

declare interface RoutesModuleType {
  tab: {
    data: string | undefined
  }
  tabMenu: string | undefined
  activeMenu: {
    data: string | undefined
  }
  routes: any[]
  allRoutes: any[]
}

declare type DeviceType = 'mobile' | 'desktop'
declare type LanguageType = 'zh' | 'en'

declare interface SettingsModuleType {
  theme: ThemeType
  device: DeviceType
  collapse: boolean
  language: LanguageType
  lock: boolean
  logo: string
  title: string
  color: string
  mode: string
}

declare interface TabsModuleType {
  visitedRoutes: any[]
}

declare interface UserModuleType {
  token: string | boolean
  username: string
  avatar: string
}
