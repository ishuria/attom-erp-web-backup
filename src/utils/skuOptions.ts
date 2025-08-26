import { useSkuOptionsStore } from '/@/store/modules/skuOptions'

const skuOptionsStore = useSkuOptionsStore()

export const _addData = (newData: any) => {
  skuOptionsStore.addData(newData)
}
