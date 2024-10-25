import { useSkuStore } from "/@/store/modules/sku"

const skuStore = useSkuStore();
const skuData = skuStore.getSkuData;

export const _addSku = (newSku: SkuType) => {
  skuStore.addSku(newSku); // 调用 addSku 方法
};

export const _clearSKUs = () => {
  skuStore.clearSKUs
}

export const _updateSku = (id: number, newValue: SkuType) => {
  skuStore.updateSku(id, newValue)
}

