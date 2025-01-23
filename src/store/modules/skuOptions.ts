/**
 * @description 产品表现页进去的成本分析上面的SKU选项，从SKU tab进来是单个，从其他 tab进来是多个SKU
 */
export const useSkuOptionsStore = defineStore('skuOptions', {
  state: (): { data: any } => ({
    data: {},
  }),
  actions: {
    // 添加新的一行数据
    addData(newData: any) {
      Object.assign(this.data, JSON.parse(JSON.stringify(newData)))
      // console.log(this.data);
    },
  },
})

