/**
 * @description 存储采购计划创建：创建的sku和添加sku后的sku，以及更新、删除、清空的功能
 */
export const useSkuStore = defineStore('sku', {
  state: (): SkuModuleType => ({
    data: [],
  }),
  // getters: {
  //   getSkuData: (state) => state.data,
  // },
  actions: {
    // 添加新的 SKU
    addSku(newSku: any, tempId: string) {
      const skuWithId = JSON.parse(JSON.stringify(newSku)); // 深拷贝对象
      skuWithId.tempId = tempId; // 添加临时 ID
      this.data.push(skuWithId)
    },
    // 更新 SKU
    updateSku(updatedSku: SkuType) {
      const index = this.data.findIndex((sku) => sku.tempId === updatedSku.tempId);
      if (index !== -1) {
        this.data[index] = updatedSku;
      }
    },
    // 删除 SKU
    deleteSku(tempId: string) {
      // console.log('进入 deleteSku，tempId:', tempId) // 检查是否被调用
      this.data = this.data.filter((sku) => sku.tempId !== tempId);
      // console.log('删除后的数据:', this.data);
    },
    // 清空 sku
    clearSKUs() {
      this.data = []
    }
  },
})

