<template>
  <vab-dialog v-model="visible" class="dialog" :title="title" top="5%" width="38%" @close="handleCancel">
    <div style="max-height: 60vh; overflow: auto">
      <el-form
        ref="channelFormRef"
        label-position="right"
        label-width="auto"
        :model="channelForm"
        style="margin-right: 10px; margin-left: 10px"
      >
        <el-form-item label="渠道名">
          <div style="display: flex; gap: 1%; align-items: center">
            <el-select v-model="channelForm.freightForwarderId" placeholder="货代简称" style="flex: 1">
              <el-option v-for="item in selectList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <span>-</span>
            <el-input v-model="channelForm.types" placeholder="货物类型" style="flex: 1" />
            <span>-</span>
            <el-input v-model="channelForm.channelName" placeholder="渠道名" style="flex: 1" />
            <span>-</span>
            <el-input v-model="channelForm.destination" placeholder="目的地" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="绑定领星code" prop="lingXingCode">
          <el-input v-model="channelForm.lingXingCode" clearable />
        </el-form-item>
        <el-form-item label="名义时效" prop="nominalLimitation">
          <el-input v-model="channelForm.nominalLimitation" clearable />
        </el-form-item>
        <el-form-item label="当前价格(kg)" prop="currentPriceWeight">
          <el-input v-model="channelForm.currentPriceWeight" clearable />
        </el-form-item>
        <el-form-item label="当前价格(m3)" prop="currentPriceVolume">
          <el-input v-model="channelForm.currentPriceVolume" clearable />
        </el-form-item>
        <el-form-item label="入仓费价格(m3)" prop="warehouseFeePrice">
          <el-input v-model="channelForm.warehouseFeePrice" clearable />
        </el-form-item>
        <el-form-item label="体积系数" prop="volumeFactor">
          <el-input v-model="channelForm.volumeFactor" clearable />
        </el-form-item>
        <el-form-item label="重量系数" prop="weightFactor">
          <el-input v-model="channelForm.weightFactor" clearable />
        </el-form-item>
        <el-form-item label="起运量(kg)" prop="takeOffQuantityWeight">
          <el-input v-model="channelForm.takeOffQuantityWeight" clearable />
        </el-form-item>
        <el-form-item label="起运量(m3)" prop="takeOffQuantityVolume">
          <el-input v-model="channelForm.takeOffQuantityVolume" clearable />
        </el-form-item>
        <el-form-item label="最低单箱计费重量(kg)" prop="singleBoxBillingWeightMin">
          <el-input v-model="channelForm.singleBoxBillingWeightMin" clearable />
        </el-form-item>
        <el-form-item label="最大单箱重量(kg)" prop="singleBoxBillingWeightMax">
          <el-input v-model="channelForm.singleBoxBillingWeightMax" clearable />
        </el-form-item>
        <el-form-item label="单票最大运量(kg)" prop="takeOffQuantityMaxWeight">
          <el-input v-model="channelForm.takeOffQuantityMaxWeight" clearable />
        </el-form-item>
        <el-form-item label="单票最大运量(m3)" prop="takeOffQuantityMaxVolume">
          <el-input v-model="channelForm.takeOffQuantityMaxVolume" clearable />
        </el-form-item>
        <el-form-item label="买单报关费(RMB)" prop="customsDeclarationFeeBill">
          <el-input v-model="channelForm.customsDeclarationFeeBill" clearable />
        </el-form-item>
        <el-form-item label="买单免费品名个数" prop="freeCountBill">
          <el-input v-model="channelForm.freeCountBill" clearable />
        </el-form-item>
        <el-form-item label="买单每续页个数" prop="countBill">
          <el-input v-model="channelForm.countBill" clearable :min="1" style="width: 100%" :type="isAdd ? undefined : 'number'" />
        </el-form-item>
        <el-form-item label="买单每续页费用(RMB)" prop="purchaseOrderCostPerRenewal">
          <el-input v-model="channelForm.purchaseOrderCostPerRenewal" clearable />
        </el-form-item>
        <el-form-item label="退税报关费(RMB)" prop="taxRefundCustomsFee">
          <el-input v-model="channelForm.taxRefundCustomsFee" clearable />
        </el-form-item>
        <el-form-item label="退税免费品名个数" prop="taxRefundCustomsFreeCount">
          <el-input v-model="channelForm.taxRefundCustomsFreeCount" clearable />
        </el-form-item>
        <el-form-item label="退税每续页个数" prop="taxRefundCustomsCount">
          <el-input
            v-model="channelForm.taxRefundCustomsCount"
            clearable
            :min="1"
            style="width: 100%"
            :type="isAdd ? undefined : 'number'"
          />
        </el-form-item>
        <el-form-item label="退税每续页费用(RMB)" prop="taxRefundPerRenewalPageFee">
          <el-input v-model="channelForm.taxRefundPerRenewalPageFee" clearable />
        </el-form-item>
        <el-form-item :label="isModify ? '清关费' : '清关费(USD)'" prop="customsClearanceFee">
          <el-input v-model="channelForm.customsClearanceFee" clearable />
        </el-form-item>
        <el-form-item v-if="isModify" label="货币" prop="customsClearanceCurrency">
          <el-select v-model="channelForm.customsClearanceCurrency" placeholder="请选择货币">
            <el-option v-for="item in currencyNumList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="清关免费个数" prop="customsClearanceFreeCount">
          <el-input v-model="channelForm.customsClearanceFreeCount" clearable />
        </el-form-item>
        <el-form-item label="清关每续页个数" prop="customsClearancePageCount">
          <el-input
            v-model="channelForm.customsClearancePageCount"
            clearable
            :min="1"
            style="width: 100%"
            :type="isAdd ? undefined : 'number'"
          />
        </el-form-item>
        <el-form-item label="清关每续页费用(RMB)" prop="customsClearancePageCost">
          <el-input v-model="channelForm.customsClearancePageCost" clearable />
        </el-form-item>
        <el-form-item label="FDA申报(USD)" prop="fad">
          <el-input v-model="channelForm.fad" clearable />
        </el-form-item>
        <el-form-item label="EPA申报(USD)" prop="epa">
          <el-input v-model="channelForm.epa" clearable />
        </el-form-item>
        <el-form-item label="DOT申报(USD)" prop="dot">
          <el-input v-model="channelForm.dot" clearable />
        </el-form-item>
        <el-form-item label="是否包关税" prop="includeTariffs">
          <el-select v-model="channelForm.includeTariffs">
            <el-option v-for="item in includeTariffOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { includeTariffOption } from '../constantOption'
import type { OptionType } from '/@/type/packagingShipping/shippedType'

defineOptions({
  name: 'ChannelDialog',
})

const props = defineProps<{
  type: 'add' | 'modify' | 'copy'
  selectList: OptionType[]
  currencyNumList: { value: number; label: string }[]
}>()
const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'confirm', form: Record<string, any>): void
}>()
const title = computed(() => {
  if (props.type === 'add') return '新增渠道'
  if (props.type === 'modify') return '修改'
  return '复制'
})
const visible = defineModel<boolean>({ default: false })
const channelForm = defineModel<Record<string, any>>('form', { required: true })
const channelFormRef = ref<FormInstance>()
const isAdd = computed(() => props.type === 'add')
const isModify = computed(() => props.type === 'modify')
const hasValue = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== ''
const validatePriceFactorPair = (form: Record<string, any>) => {
  const hasCurrentPriceWeight = hasValue(form.currentPriceWeight)
  const hasCurrentPriceVolume = hasValue(form.currentPriceVolume)
  const hasVolumeFactor = hasValue(form.volumeFactor)
  const hasWeightFactor = hasValue(form.weightFactor)
  const isWeightPricePair = hasCurrentPriceWeight && hasVolumeFactor && !hasCurrentPriceVolume && !hasWeightFactor
  const isVolumePricePair = hasCurrentPriceVolume && hasWeightFactor && !hasCurrentPriceWeight && !hasVolumeFactor
  const isEmpty = !hasCurrentPriceWeight && !hasCurrentPriceVolume && !hasVolumeFactor && !hasWeightFactor

  if (isEmpty || isWeightPricePair || isVolumePricePair) {
    return true
  }

  $baseMessage('当前价格与系数只能按「当前价格(kg)+体积系数」或「当前价格(m3)+重量系数」成对填写', 'error')
  return false
}
const validateRenewalCount = (value: unknown, message: string) => {
  if (Number(value) === 0 || value === null || value === undefined) {
    $baseMessage(message, 'error')
    return false
  }

  return true
}
const validateRenewalCounts = () => {
  if (isAdd.value) return true

  return (
    validateRenewalCount(channelForm.value.countBill, '买单每续页个数不能为0') &&
    validateRenewalCount(channelForm.value.taxRefundCustomsCount, '退税每续页个数不能为0') &&
    validateRenewalCount(channelForm.value.customsClearancePageCount, '清关每续页个数不能为0')
  )
}
const handleCancel = () => {
  emit('cancel')
}
const handleConfirm = () => {
  channelFormRef.value?.validate((isValid: boolean) => {
    if (!isValid) return
    if (!validatePriceFactorPair(channelForm.value)) return
    if (!validateRenewalCounts()) return

    emit('confirm', { ...channelForm.value })
  })
}
</script>
