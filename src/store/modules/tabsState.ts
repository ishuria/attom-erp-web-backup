

/**
 * 存储tab切换的状态
 */
export const useTabStateStore = defineStore('tabStore', {
  state: (): TabState => ({}),

  actions: {
    setTabState(path: string, tab: number) {
      this[path] = tab
      // console.log(this)
    },
    getTabState(path: string, defaultTab: number) {
      return this[path] ?? defaultTab
    },
  }
})