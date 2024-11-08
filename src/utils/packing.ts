import { usePackingStore } from "/@/store/modules/packing"

const packingStore = usePackingStore();

export const _addPacking = (newPacking: any, tempId: string): boolean => {
  return packingStore.addPacking(newPacking, tempId); // 调用 addSku 方法
};

export const _updatePacking = (newValue: PackingType) => {
  packingStore.updatePacking(newValue)
}

export const _clearPacking = () => {
  packingStore.clearPacking()
}