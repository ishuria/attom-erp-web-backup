declare type ThemeName =
  | 'blue-black'
  | 'blue-white'
  | 'green-black'
  | 'green-white'
  | 'ocean'
  | 'red-white'
  | 'red-black'

declare type ColumnStyle =
  /**
   * 横向风格
   */
  | 'horizontal'
  /**
   * 纵向风格
   */
  | 'vertical'
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 箭头风格
   */
  | 'arrow'

declare type TabsBarStyle =
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 灵动风格
   */
  | 'smart'
  /**
   * smooth
   */
  | 'smooth'

declare interface ThemeType {
  layout: string
  // 主题名称
  themeName: ThemeName
  // 菜单宽度，仅支持px，建议大小：266px、277px、288px，其余尺寸会影响美观
  menuWidth: string
  // 分栏风格(仅针对分栏布局column时生效)
  columnStyle: ColumnStyleg
  // 颜色
  color: string
  // 是否固定头部固定
  fixedHeader: boolean
  // 是否开启顶部进度条
  showProgressBar: boolean
  // 是否开启标签页
  showTabs: boolean
  // 显示标签页时标签页样式
  tabsBarStyle: TabsBarStyle
  // 是否标签页图标
  showTabsIcon: boolean
  // 是否开启语言选择组件
  showLanguage: boolean
  // 是否开启刷新组件
  showRefresh: boolean
  // 是否开启搜索组件
  showSearch: boolean
  // 是否开启主题组件
  showTheme: boolean
  // 是否开启通知组件
  showNotice: boolean
  // 是否开启全屏组件
  showFullScreen: boolean
  // 纵向布局、常规布局、综合布局时是否默认收起左侧菜单（不支持分栏布局、横向布局）
  foldSidebar: boolean
  // 是否开启页面动画
  showPageTransition: boolean
}
