<template>
  <vab-dialog
    v-model="visible"
    class="dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="扫码验证"
    width="660px"
    @close="handleClose"
    @opened="handleDialogOpened"
  >
    <el-alert
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
      title="请扫描条形码，并核对扫描结果（SKU、产品名称、图片）与手中实物是否一致后再提交"
      type="warning"
    />
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form label-position="top" :model="packingForm">
          <el-form-item :label="upcOrFnSku">
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
          <el-form-item label="SKU">
            <el-input v-model="packingForm.sku" disabled />
          </el-form-item>
          <el-form-item label="产品名称">
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
        <el-button :disabled="submitting" @click="handleClose">关闭</el-button>
        <el-button :disabled="submitting" @click="resetScan">重新扫描</el-button>
        <el-button :disabled="!packingForm.sku || submitting" :loading="submitting" type="success" @click="handleConfirm">提交</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { InputInstance } from 'element-plus'
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
  // 父组件正在调验证接口，按钮置灰防双击；接口失败时父组件保持 visible=true，弹窗不会关
  submitting?: boolean
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

const barcodeInput = ref<InputInstance>()
// 防止同一个条码被 enter + blur 各触发一次造成重复处理
const lastProcessedBarcode = ref<string>('')
// 扫码查询中先锁住输入，避免扫码枪连扫触发并发查询
const barcodeScanning = ref<boolean>(false)

const resetForm = () => {
  packingForm.fnSkuOrUpc = ''
  packingForm.sku = ''
  packingForm.productName = ''
  packingForm.skuImageUrl = ''
  barcodeDisabled.value = false
  lastProcessedBarcode.value = ''
  barcodeScanning.value = false
}

// 用 @opened（动画结束后）而不是 @open（动画开始时），否则输入框还没 mount，focus() 会失败
const handleDialogOpened = () => {
  resetForm()
  barcodeInput.value?.focus()
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
  if (barcodeScanning.value) return
  if (lastProcessedBarcode.value === barcodeValue) return
  lastProcessedBarcode.value = barcodeValue
  barcodeScanning.value = true
  barcodeDisabled.value = true

  packingForm.fnSkuOrUpc = barcodeValue
  let str = barcodeValue
  // 沃尔玛/Tiktok 的 GTIN 扫枪扫到的可能带前导 00，要去掉
  if (GTIN_SITES.has(props.site) && barcodeValue.startsWith('00')) {
    str = barcodeValue.substring(2)
  }

  try {
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
      barcodeDisabled.value = false
      // 失败时清掉记录，允许重扫同一个码
      lastProcessedBarcode.value = ''
      $baseMessage(`找不到该${upcOrFnSku.value}，请重新扫描`, 'error')
      nextTick(() => {
        barcodeInput.value?.focus()
      })
    }
  } catch (e) {
    packingForm.fnSkuOrUpc = ''
    barcodeDisabled.value = false
    lastProcessedBarcode.value = ''
    $baseMessage('扫码查询失败，请重试', 'error')
    nextTick(() => {
      barcodeInput.value?.focus()
    })
  } finally {
    barcodeScanning.value = false
  }
}

const handleEnter = async (event: Event) => {
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue?.trim()) return
  await processBarcodeScan(barcodeValue)
}

const handleBlur = async (event: FocusEvent) => {
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue?.trim()) return
  await processBarcodeScan(barcodeValue)
}

const handleConfirm = () => {
  if (!packingForm.sku) {
    $baseMessage('请先扫描条形码', 'warning')
    return
  }
  // 仅 emit，不自动关闭。由父组件根据接口结果决定关闭时机：
  // 成功 → 父组件把 v-model 置 false 关弹窗
  // 失败 → 弹窗保持打开，用户可以重新扫描或重试
  emit('verified', { ...packingForm })
}
</script>
