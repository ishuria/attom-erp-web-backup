/**
 * @description: 获取必应每日壁纸
 * @author sundan
 */

export const useBingStore = defineStore('bing', {
  state: (): BingModuleType => ({
    backgroundList: [],
  }),
  getters: {
    getBackgroundList: (state) => state.backgroundList,
  },
  actions: {
    async setBackgroundList() {
      await axios({
        url: `https://api.vuejs-core.cn/getBingImage`,
        method: 'get',
      }).then(({ data }) => {
        this.backgroundList = data
      })
    },
  },
})
;(() => {
  const bingStore = useBingStore()
  bingStore.setBackgroundList()
})()
