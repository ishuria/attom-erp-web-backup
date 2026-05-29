import { nextTick, ref } from 'vue'
import { getOperationOrderSku, releaseOperationPlanPo } from '/@/api/devlocal/productOrdering'
import type {
  IGetOperationOrderSkuReq,
  IGetOperationOrderSkuRes,
  IReleaseOperationPlanPoReq,
  IReleaseOperationPlanPoRes,
} from '/@/type/storeOperation/productOrdering'
import { gp } from '/@vab/plugins/vab'

/**
 * 发布订货弹窗的业务编排。
 *
 * 弹窗组件只负责表单展示和事件抛出；这里统一处理打开弹窗、SKU 回填、
 * 查询补货数量、切换 SKU、确认发布以及发布成功后的页面回写。
 * 各页面通过 options 传入差异化参数，避免在 Amazon/Walmart、产品订货/产品表现页面重复维护同一套流程。
 */
interface SkuOption {
  label: string
  value: string
}

interface ReleaseOrderDialogRef {
  resetForm: () => void
  setFormData: (data: any) => void
  setSelectedSku?: (sku: string) => void
}

interface UseReleaseOrderDialogOptions<Row extends Record<string, any>> {
  getSkuParams: (row: Row, sku: string) => IGetOperationOrderSkuReq
  getReleaseParams: (row: Row, formData: any, asinId: number | null | undefined) => IReleaseOperationPlanPoReq
  getSkuValues?: (row: Row) => string[]
  resolveInitialSku?: (row: Row, skuList: SkuOption[]) => string | undefined
  resolveAsinId?: (row: Row, data: IGetOperationOrderSkuRes['data']) => number | null | undefined
  onOpen?: (row: Row) => void
  onReleased?: (row: Row, data: IReleaseOperationPlanPoRes['data']) => void
}

const getDefaultSkuValues = (row: Record<string, any>) => {
  if (!row.sku) return []
  return String(row.sku)
    .trim()
    .split(',')
    .map((sku) => sku.trim())
    .filter(Boolean)
}

export const useReleaseOrderDialog = <Row extends Record<string, any>>(options: UseReleaseOrderDialogOptions<Row>) => {
  const skuList = ref<SkuOption[]>([])
  const releaseOrderVisible = ref<boolean>(false)
  const orderListLoading = ref<boolean>(false)
  const releaseOrderDialogRef = ref<ReleaseOrderDialogRef>()
  const asinId = ref<number | null | undefined>(undefined)
  const currentRow = ref<Row>()

  const resetDialog = () => {
    skuList.value = []
    asinId.value = undefined
    releaseOrderDialogRef.value?.resetForm()
  }

  const setSelectedSku = (sku: string) => {
    releaseOrderDialogRef.value?.setSelectedSku?.(sku)
  }

  const fetchSkuDetail = async (row: Row, sku: string) => {
    const { data } = await getOperationOrderSku(options.getSkuParams(row, sku))
    releaseOrderDialogRef.value?.setFormData(data)
    asinId.value = options.resolveAsinId ? options.resolveAsinId(row, data) : data.asinId
  }

  const handleSwitchSku = async (sku: string) => {
    const row = currentRow.value
    if (!row) return

    setSelectedSku(sku)
    orderListLoading.value = true
    try {
      await fetchSkuDetail(row, sku)
    } catch (error) {
      console.error('获取SKU数据失败:', error)
    } finally {
      orderListLoading.value = false
    }
  }

  const handleShowReleaseOrder = async (row: Row) => {
    currentRow.value = row
    options.onOpen?.(row)
    releaseOrderVisible.value = true
    orderListLoading.value = true

    try {
      await nextTick()
      const values = options.getSkuValues ? options.getSkuValues(row) : getDefaultSkuValues(row)

      if (!values.length) {
        resetDialog()
        return
      }

      skuList.value = values.map((sku) => ({
        label: sku,
        value: sku,
      }))

      const selectedSku = options.resolveInitialSku ? options.resolveInitialSku(row, skuList.value) : skuList.value[0]?.value

      if (!selectedSku) {
        releaseOrderDialogRef.value?.resetForm()
        return
      }

      asinId.value = undefined
      setSelectedSku(selectedSku)
      await fetchSkuDetail(row, selectedSku)
    } catch (error) {
      console.error('获取SKU数据失败:', error)
    } finally {
      orderListLoading.value = false
    }
  }

  const handleReleaseOrder = async (formData: any) => {
    const row = currentRow.value
    if (!row) return

    if (!formData.sku) {
      gp.$baseMessage('请选择SKU', 'warning')
      return
    }

    if (formData.totalClaimCount > 0) {
      gp.$baseMessage('有其他站点多订数量，需要先认领完再订货。认领流程：去打包任务拆分需要订货的数量并将站点改为自己的站点。', 'error')
      return
    }

    if (!formData.number) {
      gp.$baseMessage('请填写订货数量', 'warning')
      return
    }

    try {
      releaseOrderVisible.value = false
      orderListLoading.value = true

      const { data } = await releaseOperationPlanPo(options.getReleaseParams(row, formData, asinId.value))

      if (data) {
        gp.$baseMessage('发布订货成功！', 'success')
        options.onReleased?.(row, data)
      }
    } catch (error) {
      console.error('发布订货失败:', error)
      gp.$baseMessage('发布订货失败，请重试', 'error')
      releaseOrderVisible.value = true
    } finally {
      orderListLoading.value = false
    }
  }

  return {
    skuList,
    releaseOrderVisible,
    orderListLoading,
    releaseOrderDialogRef,
    asinId,
    handleShowReleaseOrder,
    handleReleaseOrder,
    handleSwitchSku,
  }
}
