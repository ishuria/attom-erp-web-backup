// 存储创建的sku和添加sku后的sku
export const useSkuStore = defineStore('sku', {
  state: (): SkuModuleType => ({
    data: [],
  }),
  getters: {
    getSkuData: (state) => state.data,
  },
  actions: {
    clearSKUs() {
      this.data = []
    },
    addSku(value: SkuType) {
      this.data.push(value)
    },
    updateSku(id: number, newValue: SkuType) {
      const index = this.data.findIndex(sku => sku.id === id); // 假设 SKU 有一个唯一的 id
      if (index !== -1) {
        this.data[index] = { ...this.data[index], ...newValue }; // 更新 SKU 数据
      } else {
        console.error(`SKU with id ${id} not found.`);
      }
    },
  },
})
