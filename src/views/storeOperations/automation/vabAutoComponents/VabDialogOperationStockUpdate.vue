<template>
  <vab-dialog v-model="defaultVisible" title="调价库存规则批量修改" width="23%">
    <el-form label-position="right" label-width="auto" :model="form">
      <el-form-item label="最低价">
        <el-input v-model="form.minPrice" type="number" />
      </el-form-item>
      <el-form-item label="最高价">
        <el-input v-model="form.maxPrice" type="number" />
      </el-form-item>
      <el-form-item label="调价幅度">
        <el-input v-model="form.adjustmentRange" type="number" />
      </el-form-item>
      <el-form-item label="最小调价间隔（天）">
        <el-input v-model="form.adjustmentDay" type="number" />
      </el-form-item>

      <el-form-item label="规则开关">
        <el-select v-model="form.ruleStatus" :disabled="loading" placeholder="请填入信息">
          <el-option label="关闭广告" :value="0" />
          <el-option label="开启广告" :value="1" />
        </el-select>
      </el-form-item>

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
import { updateBatchOperationStock } from '/@/api/devlocal/operationAutoMation.ts'
import { IOperationStockUpdateReq } from '/@/type/storeOperation/operationStock.ts'


defineComponent({
  name: 'VabDialogOperationStockUpdate',
})
const defaultVisible = defineModel<boolean>('defaultVisible', { default: false })
const checkRows = defineModel<Array<any>>('checkRows', { default: [] })
const loading = ref<boolean>(false)

const emit = defineEmits<{
  'fetch-query': []
}>()

const form = ref<IOperationStockUpdateReq>({
  /** 最低毛价格 */
  minPrice: null,
  /** 最高毛价格 */
  maxPrice: null,
  /** 调价幅度 */
  adjustmentRange: null,
  /** 最小调价间隔 */
  adjustmentDay: null,
  /** 提高价格--剩余可售天数 */
  improveDays: null,
  /** 提高价格--可售总库存数 */
  improveStock: null,
  /** 提高价格--断货天数 */
  improveOutStockDays: null,
  /** rating大于等于 */
  improveRatingHeight: null,
  /** * 降低价格-断货天数 */
  reduceOutStockDays: null,
  /** * 降低价格-剩余可售天数 */
  reduceDays: null,
  /** * 降低价格-剩余含在途可售天数 */
  reduceTransitDays: null,
  /** * 降低价格-可售总库存数 */
  reduceSalesTotalStock: null,
  /** * 降低价格-ratings小于等于 */
  reduceRatingLow: null,
  ruleStatus: 0,
})

const handleCancel = () => {
  defaultVisible.value = false
}

const handleConfirm = async () => {
  try {
    let ids: number[] = []
    checkRows.value.forEach((el) => {
      ids.push(el.id!)
    })
    $baseConfirm('确定要批量修改吗？', null, async () => {
      const { ...filterForm } = form.value
      const params = {
        ids: ids,
        ...filterForm,
      }
      const { data } = await updateBatchOperationStock(params)
      if (data) {
        $baseMessage('批量修改成功！', 'success')

        form.value.minPrice = undefined
        form.value.maxPrice = undefined
        form.value.adjustmentRange = undefined
        form.value.adjustmentDay = undefined
        form.value.improveDays = undefined
        form.value.improveStock = undefined
        form.value.improveOutStockDays = undefined
        form.value.improveRatingHeight = undefined
        form.value.reduceOutStockDays = undefined
        form.value.reduceDays = undefined
        form.value.reduceTransitDays = undefined
        form.value.reduceSalesTotalStock = undefined
        form.value.reduceRatingLow = undefined
        form.value.ruleStatus = 0

        emit("fetch-query")
      }
    })

    defaultVisible.value = false
  } catch (error) {
    defaultVisible.value = false
  }
}
</script>

<style scoped lang="scss"></style>
