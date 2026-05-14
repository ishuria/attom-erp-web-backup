<template>
  <vab-dialog v-model="visible" class="dialog" title="验证条形码" width="660px" @close="handleClose" @open="handlePackingOpen">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="packingFormRef" label-position="top" :model="packingForm" :rules="packingFormRules">
          <el-form-item :label="upcOrFnSku" prop="fnSkuOrUpc">
            <el-input
              ref="barcodeInput"
              v-model="packingForm.fnSkuOrUpc"
              clearable
              :disabled="barcodeDisabled"
              :placeholder="`请扫描${upcOrFnSku}`"
              @blur="handleBlur"
              @keydown.enter="handleEnter"
            />
          </el-form-item>
          <el-form-item label="SKU" prop="sku">
            <el-input v-model="packingForm.sku" disabled />
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="packingForm.productName" disabled />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-image
          close-on-press-escape
          hide-on-click-modal
          :preview-src-list="packingForm.skuImageUrl ? [packingForm.skuImageUrl] : []"
          :src="packingForm.skuImageUrl"
          style="width: 300px; height: 300px; cursor: pointer; border: 2px #dcdfe6 solid; border-radius: 2%"
        >
          <template #error>
            <el-icon />
          </template>
        </el-image>
      </el-col>
    </el-row>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="resetScan">重新扫描</el-button>
        <el-button :disabled="!packingForm.sku" type="success" @click="handleConfirm">完成验证</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { getEncasementSku } from '/@/api/devlocal/encasement'
import { SiteEnum } from '/@/const/site'
import type { IEncasementProduct } from '/@/type/packagingShipping/shippedType'

// 走 GTIN（条码前可能带前导 00）的站点：沃尔玛 + Tiktok
const GTIN_SITES: ReadonlySet<number> = new Set([SiteEnum.WALMART_US, SiteEnum.TIKTOK_US])

defineOptions({
  name: 'PackagingVerifyBarCodeDialog',
})

const props = defineProps<{
  site: number
}>()

const emit = defineEmits<{
  verified: [product: IEncasementProduct]
}>()

const visible = defineModel<boolean>({ default: false })

// 沃尔玛/Tiktok 站点的条码字段叫 GTIN，其余叫 FNSKU
const upcOrFnSku = computed<string>(() => (GTIN_SITES.has(props.site) ? 'GTIN' : 'FNSKU'))

// 扫描完后禁用输入框，防止扫枪连扫
const barcodeDisabled = ref<boolean>(false)

const packingForm = reactive<IEncasementProduct>({
  fnSkuOrUpc: '',
  sku: '',
  productName: '',
  skuImageUrl: '',
})

const packingFormRef = ref<FormInstance>()
const packingFormRules = computed<FormRules>(() => ({
  fnSkuOrUpc: [{ required: true, message: `请输入${upcOrFnSku.value}`, trigger: 'blur' }],
}))

const barcodeInput = ref<HTMLInputElement | null>(null)
// 防止首次打开扫枪触发的误回车
const isInitialized = ref<boolean>(false)
// 防止同一个条码被回车 + 失焦重复处理
const lastProcessedBarcode = ref<string>('')

const resetForm = () => {
  packingForm.fnSkuOrUpc = ''
  packingForm.sku = ''
  packingForm.productName = ''
  packingForm.skuImageUrl = ''
  barcodeDisabled.value = false
  isInitialized.value = false
  lastProcessedBarcode.value = ''
  packingFormRef.value?.clearValidate()
}

const handlePackingOpen = () => {
  resetForm()
  nextTick(() => {
    barcodeInput.value?.focus()
  })
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

const resetScan = () => {
  resetForm()
  nextTick(() => {
    barcodeInput.value?.focus()
  })
}

const processBarcodeScan = async (barcodeValue: string) => {
  if (lastProcessedBarcode.value === barcodeValue) return
  lastProcessedBarcode.value = barcodeValue

  packingForm.fnSkuOrUpc = barcodeValue
  let str = barcodeValue
  // 沃尔玛/Tiktok 的 GTIN 扫枪扫到的可能带前导 00，要去掉
  if (GTIN_SITES.has(props.site) && barcodeValue.startsWith('00')) {
    str = barcodeValue.substring(2)
  }

  const { data } = await getEncasementSku({
    site: props.site,
    fnSkuOrUpc: str,
  })
  if (data?.sku) {
    packingForm.sku = data.sku ?? ''
    packingForm.productName = data.productName ?? ''
    packingForm.skuImageUrl = data.skuImageUrl ?? ''
    barcodeDisabled.value = true
    $baseMessage('扫码成功，请核对图片与实物是否一致', 'success')
  } else {
    packingForm.fnSkuOrUpc = ''
    // 失败时清掉记录，允许重扫同一个码
    lastProcessedBarcode.value = ''
    $baseMessage(`找不到该${upcOrFnSku.value}，请重新扫描`, 'error')
  }
}

const handleEnter = async (event: Event) => {
  if (!isInitialized.value) {
    isInitialized.value = true
    return
  }
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue?.trim()) return
  await processBarcodeScan(barcodeValue)
}

const handleBlur = async (event: FocusEvent) => {
  if (!isInitialized.value) {
    isInitialized.value = true
    return
  }
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue?.trim()) return
  await processBarcodeScan(barcodeValue)
}

const handleConfirm = () => {
  if (!packingForm.sku) {
    $baseMessage('请先扫描条形码', 'warning')
    return
  }
  emit('verified', { ...packingForm })
  handleClose()
}
</script>
