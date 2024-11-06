/**
 * @description 存储装箱的数据
 */
export const usePackingStore = defineStore('packing', {
  state: (): PackingModuleType => ({
    packingData: []
  }),
  actions: {
    // 添加装箱的数据
    addPacking(newPacking: any, tempId: string) {
      const packingWithId = JSON.parse(JSON.stringify(newPacking)); // 深拷贝对象
      packingWithId.tempId = tempId; // 添加临时 ID
      this.packingData.push(packingWithId)
    },
    // 更新 装箱
    updatePacking(updatedPacking: PackingType) {
      const index = this.packingData.findIndex((item) => item.tempId === updatedPacking.tempId);
      if (index !== -1) {
        this.packingData[index] = updatedPacking;
      }
    },
    // 删除 SKU
    deletePacking(tempId: string) {
      // console.log('进入 deleteSku，tempId:', tempId) // 检查是否被调用
      this.packingData = this.packingData.filter((item) => item.tempId !== tempId);
      // console.log('删除后的数据:', this.data);
    },
    // 清空 sku
    clearPacking() {
      this.packingData = []
    }
  }
})