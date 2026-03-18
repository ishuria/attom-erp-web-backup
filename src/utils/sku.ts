import { useSkuStore } from '/@/store/modules/sku'

const skuStore = useSkuStore()

export const _addSku = (newSku: any, tempId: string) => {
  skuStore.addSku(newSku, tempId) // 调用 addSku 方法
}

export const _updateSku = (newValue: SkuType) => {
  skuStore.updateSku(newValue)
}

export const _deleteSku = (tempId: string) => {
  // console.log('删除id', tempId);
  skuStore.deleteSku(tempId)
}

export const _clearSKUs = () => {
  skuStore.clearSKUs()
}
