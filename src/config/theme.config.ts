/**
 * @description 导出主题配置，注意事项：此配置下的项修改后需清理浏览器缓存！！！
 */
export const themeConfig: ThemeType = {
  // vite版本仅支持分栏布局column、纵向布局vertical
  layout: 'column',
  //blue-black
  themeName: 'blue-black',
  // 分栏风格：横向风格horizontal、纵向风格vertical、卡片风格card、箭头风格arrow
  columnStyle: 'card',
  //是否固定头部固定
  fixedHeader: true,
  //是否开启顶部进度条
  showProgressBar: true,
  //是否开启标签页
  showTabs: true,
  //显示标签页时标签页样式：卡片风格card、灵动风格smart、圆滑风格smooth
  tabsBarStyle: 'card',
  //是否显示标签页图标
  showTabsIcon: true,
  //是否开启语言选择组件
  showLanguage: true,
  //是否开启刷新组件
  showRefresh: true,
  //是否开启搜索组件
  showSearch: true,
  //是否开启通知组件
  showNotice: true,
  //是否开启全屏组件
  showFullScreen: true,
  //是否开启暗黑组件
  showDark: true,
  //否默认收起左侧菜单
  foldSidebar: false,
  //是否开启页面动画
  showPageTransition: true,
}
