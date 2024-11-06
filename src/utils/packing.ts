import { usePackingStore } from "/@/store/modules/packing"

const packingStore = usePackingStore();

export const _addPacking = (newPacking: any, tempId: string) => {
  packingStore.addPacking(newPacking, tempId); // 调用 addSku 方法
};

export const _updatePacking = (newValue: PackingType) => {
  packingStore.updatePacking(newValue)
}

export const _deletePacking = (tempId: string) => {
  // console.log('删除id', tempId);
  packingStore.deletePacking(tempId)
}

export const _clearPacking = () => {
  packingStore.clearPacking()
}