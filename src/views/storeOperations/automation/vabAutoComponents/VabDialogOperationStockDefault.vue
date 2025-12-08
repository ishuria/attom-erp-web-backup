<template>
  <vab-dialog v-model="defaultVisible" title="调价库存规则默认参数" width="23%">
    <el-form label-position="right" label-width="auto" :model="form">
      <el-form-item label="最低价毛利率">
        <el-input v-model="form.minGrossProfitMargin" type="number" />
      </el-form-item>
      <el-form-item label="最高价毛利率">
        <el-input v-model="form.maxGrossProfitMargin" type="number" />
      </el-form-item>
      <el-form-item label="调价幅度">
        <el-input v-model="form.adjustmentRange" type="number" />
      </el-form-item>
      <el-form-item label="最小调价间隔（天）">
        <el-input v-model="form.adjustmentDay" type="number" />
      </el-form-item>
      <el-card>
        <el-form-item>
          <div>
            最低价=max(
            <el-input v-model="form.minPriceGrossProfitMargin" style="display: inline" />
            %毛利 -
            <el-input v-model="form.maxDecodePrice" style="display: inline" />
            ，{{ form.minGrossProfitMargin }}%毛利)
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            最低价=max(
            <el-input v-model="form.maxPriceGrossProfitMargin" style="display: inline" />
            %毛利 -
            <el-input v-model="form.minAddPrice" style="display: inline" />
            ，{{ form.maxGrossProfitMargin }}%毛利)
          </div>
        </el-form-item>
      </el-card>

      <el-card>
        <template #header><h3>提高价格</h3></template>
        <el-form-item label="剩余可售天数 ≥ ">
          <el-input v-model="form.improveDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="可售总库存数 ≥ ">
          <el-input v-model="form.improveStock" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="断货天数 ≥ ">
          <el-input v-model="form.improveOutStockDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="Rating ≥ ">
          <el-input v-model="form.improveRatingHeight" :disabled="loading" type="number" />
        </el-form-item>
      </el-card>

      <el-card>
        <template #header><h3>降低价格条件组1</h3></template>
        <el-form-item label="断货天数 ≤ ">
          <el-input v-model="form.reduceOutStockDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="剩余可售天数 ≥ ">
          <el-input v-model="form.reduceDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="剩余含在途可售天数 ≥ ">
          <el-input v-model="form.reduceTransitDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="可售总库存数 ≥ ">
          <el-input v-model="form.reduceSalesTotalStock" :disabled="loading" type="number" />
        </el-form-item>
      </el-card>

      <el-card>
        <template #header><h3>降低价格条件组2</h3></template>
        <el-form-item label="Rating ≤ ">
          <el-input v-model="form.reduceRatingLow" :disabled="loading" type="number" />
        </el-form-item>
      </el-card>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script setup lang="ts">
import { queryOperationStock, updateOperationStockDefaultParams } from '/@/api/devlocal/operationAutoMation.ts'
import { IOperationStockDefaultParams } from '/@/type/storeOperation/operationStock.ts'

defineComponent({
  name: 'VabDialogOperationStockDefault',
})
const defaultVisible = defineModel({ default: false })
const loading = ref<boolean>(false)

const form = ref<IOperationStockDefaultParams>({
  /** 最低毛利率 */
  minGrossProfitMargin: undefined,
  minPriceGrossProfitMargin: undefined,
  /** 最高毛利率 */
  maxGrossProfitMargin: undefined,
  maxPriceGrossProfitMargin: undefined,
  /** 调价幅度 */
  adjustmentRange: undefined,
  /** 最小调价间隔 */
  adjustmentDay: undefined,
  /** 提高价格--剩余可售天数 */
  improveDays: undefined,
  /** 提高价格--可售总库存数 */
  improveStock: undefined,
  /** 提高价格--断货天数 */
  improveOutStockDays: undefined,
  /** rating大于等于 */
  improveRatingHeight: undefined,
  /** * 降低价格-断货天数 */
  reduceOutStockDays: undefined,
  /** * 降低价格-剩余可售天数 */
  reduceDays: undefined,
  /** * 降低价格-剩余含在途可售天数 */
  reduceTransitDays: undefined,
  /** * 降低价格-可售总库存数 */
  reduceSalesTotalStock: undefined,
  /** * 降低价格-ratings小于等于 */
  reduceRatingLow: undefined,
  minAddPrice: undefined,
  maxDecodePrice: undefined,
})

watch(defaultVisible, async () => {
  if (defaultVisible.value) {
    const { data } = await queryOperationStock()
    form.value.minGrossProfitMargin = data.minGrossProfitMargin
    form.value.minPriceGrossProfitMargin = data.minPriceGrossProfitMargin
    form.value.maxGrossProfitMargin = data.maxGrossProfitMargin
    form.value.maxPriceGrossProfitMargin = data.maxPriceGrossProfitMargin
    form.value.adjustmentRange = data.adjustmentRange
    form.value.adjustmentDay = data.adjustmentDay
    form.value.improveDays = data.improveDays
    form.value.improveStock = data.improveStock
    form.value.improveOutStockDays = data.improveOutStockDays
    form.value.improveRatingHeight = data.improveRatingHeight
    form.value.reduceOutStockDays = data.reduceOutStockDays
    form.value.reduceDays = data.reduceDays
    form.value.reduceTransitDays = data.reduceTransitDays
    form.value.reduceSalesTotalStock = data.reduceSalesTotalStock
    form.value.reduceRatingLow = data.reduceRatingLow
    form.value.minAddPrice = data.minAddPrice
    form.value.maxDecodePrice = data.maxDecodePrice
  }
})

const handleCancel = () => {
  defaultVisible.value = false
}

const handleConfirm = async () => {
  try {
    const { data } = await updateOperationStockDefaultParams({ ...form.value })
    if (data) {
      $baseMessage('调价库存规则默认参数修改成功', 'success')
    }
    defaultVisible.value = false
  } catch (error) {
    defaultVisible.value = false
  }
}
</script>

<style scoped lang="scss"></style>
