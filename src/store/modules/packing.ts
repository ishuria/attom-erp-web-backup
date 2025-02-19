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
     
      // 判断是否已存在相同的 fnSkuOrUpc
      const exists = this.packingData.find(item => item.fnSkuOrUpc === newPacking.fnSkuOrUpc)

      if (exists) {
        $baseMessage(`已经存在相同的 ${newPacking.fnSkuOrUpc}，请重新输入`, 'error')
        return true
      } else {
        const packingWithId = JSON.parse(JSON.stringify(newPacking)); // 深拷贝对象
        packingWithId.tempId = tempId; // 添加临时 ID
        this.packingData.push(packingWithId)
        return false
      }
    },
    // 更新 装箱
    updatePacking(updatedPacking: PackingType) {
      const index = this.packingData.findIndex((item) => item.tempId === updatedPacking.tempId);
      if (index !== -1) {
        this.packingData[index] = updatedPacking;
        // console.log('更新装箱', this.packingData);
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