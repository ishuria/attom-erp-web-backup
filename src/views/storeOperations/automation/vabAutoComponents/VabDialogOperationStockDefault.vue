<template>
  <vab-dialog v-model="defaultVisible" title="调价库存规则默认参数" top="7vh" width="55%">
    <el-row :gutter="50">
      <el-col :span="14">
        <el-table
          v-loading="loading"
          border
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeCreateInput"
        >
          <el-table-column label="站点" prop="siteName" width="160" />
          <el-table-column label="低价配送费节点" prop="lowDeliveryFee">
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.lowDeliveryFee"
                  type="number"
                  @blur="handleCellBlur($event, row, $index)"
                  @keyup.enter="handleCellBlur($event, row, $index)"
                />
              </div>
              <span>
                {{ row.lowDeliveryFee }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="享受低价配送的最高价格" prop="lowDeliveryFeeMaxPrice">
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.lowDeliveryFeeMaxPrice"
                  type="number"
                  @blur="handleCellBlur($event, row, $index)"
                  @keyup.enter="handleCellBlur($event, row, $index)"
                />
              </div>
              <span>
                {{ row.lowDeliveryFeeMaxPrice }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="调价幅度" prop="priceAdjustmentRange">
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.priceAdjustmentRange"
                  type="number"
                  @blur="handleCellBlur($event, row, $index)"
                  @keyup.enter="handleCellBlur($event, row, $index)"
                />
              </div>
              <span>
                {{ row.priceAdjustmentRange }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="调价间隔（天）" prop="amplitudeDay">
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.amplitudeDay"
                  type="number"
                  @blur="handleCellBlur($event, row, $index)"
                  @keyup.enter="handleCellBlur($event, row, $index)"
                />
              </div>
              <span>{{ row.amplitudeDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="调整价格后出单数>=" prop="improveNewPriceOrdersGte">
            <template #default="{ row, $index }">
              <div class="none">
                <el-input
                  v-model="row.improveNewPriceOrdersGte"
                  type="number"
                  @blur="handleCellBlur($event, row, $index)"
                  @keyup.enter="handleCellBlur($event, row, $index)"
                />
              </div>
              <span>{{ row.improveNewPriceOrdersGte }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <el-alert
          :closable="false"
          show-icon
          style="margin-top: 20px"
          title="降价时如果降价后的价格 - '低价配送费节点' < '调价幅度'，则降价价格会调整为'享受低价配送的最高价格'。但是最终价格不会超出预设的最小和最大值。"
          type="info"
        />
      </el-col>
      <el-col :span="10">
        <el-form label-position="right" label-width="auto" :model="form">
          <!-- <el-form-item label="最低价毛利率">
            <el-input v-model="form.minGrossProfitMargin" type="number" />
          </el-form-item> -->
          <!-- <el-form-item label="最高价毛利率">
            <el-input v-model="form.maxGrossProfitMargin" type="number" />
          </el-form-item> -->
          <!--      <el-form-item label="调价幅度">-->
          <!--        <el-input v-model="form.adjustmentRange" type="number" />-->
          <!--      </el-form-item>-->
          <!--      <el-form-item label="最小调价间隔（天）">-->
          <!--        <el-input v-model="form.adjustmentDay" type="number" />-->
          <!--      </el-form-item>-->
          <el-card>
            <el-form-item>
              <div class="formula-line">
                最低价 = max(
                <el-input v-model="form.minPriceGrossProfitMargin" class="formula-input" />
                %毛利 -
                <el-input v-model="form.maxDecodePrice" class="formula-input" />
                ，
                <el-input v-model="form.minGrossProfitMargin" class="formula-input" />
                %毛利)
              </div>
            </el-form-item>
            <el-form-item>
              <div class="formula-line">
                最高价 = max(
                <el-input v-model="form.maxPriceGrossProfitMargin" class="formula-input" />
                %毛利 +
                <el-input v-model="form.minAddPrice" class="formula-input" />
                ，
                <el-input v-model="form.maxGrossProfitMargin" class="formula-input" />
                %毛利)
              </div>
            </el-form-item>
            <el-form-item>
              <div class="formula-line">
                最优价格 =
                <el-input v-model="form.optimalPriceGrossMargin" class="formula-input" />
                %毛利
              </div>
            </el-form-item>
          </el-card>

          <el-card>
            <template #header><h3>提高价格</h3></template>
            <el-form-item label="剩余可售天数 ≤ ">
              <el-input v-model="form.improveDays" :disabled="loading" type="number" />
            </el-form-item>
            <el-form-item label="可售总库存数 ≤ ">
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
            <el-form-item label="可售库存 ≥ ">
              <el-input v-model="form.reduceAvailableInventory" :disabled="loading" type="number" />
            </el-form-item>
          </el-card>

          <el-card>
            <template #header><h3>降低价格条件组2</h3></template>
            <el-form-item label="Rating ≤ ">
              <el-input v-model="form.reduceRatingLow" :disabled="loading" type="number" />
            </el-form-item>
          </el-card>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash-es'
import {
  queryOperationStock,
  querySiteOperations,
  updateOperationStockDefaultParams,
  updateOperationStockRulesParams,
} from '/@/api/devlocal/operationAutoMation.ts'
import { IOperationStockRulesSiteParams } from '/@/type/storeOperation/autoMation.ts'
import { IOperationStockDefaultParams } from '/@/type/storeOperation/operationStock.ts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils.ts'

defineComponent({
  name: 'VabDialogOperationStockDefault',
})
const defaultVisible = defineModel({ default: false })
const loading = ref<boolean>(false)
const list = ref<IOperationStockRulesSiteParams[]>()
let copyRow: IOperationStockRulesSiteParams
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
  reduceAvailableInventory: undefined,
  /** 最优价格毛利率 */
  optimalPriceGrossMargin: undefined,
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
    form.value.reduceAvailableInventory = data.reduceAvailableInventory
    form.value.optimalPriceGrossMargin = data.optimalPriceGrossMargin
    queryOperationStockSite()
  }
})

const queryOperationStockSite = async () => {
  const { data } = await querySiteOperations()
  list.value = data
}

const handleCellBlur = (event: any, value: IOperationStockRulesSiteParams, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    updateOperationStockRoleParamsCommon(value)
  }
}

const changeCreateInput = async (row: IOperationStockRulesSiteParams, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}

/**
 * 调价库存规则更新
 * @param value
 */
const updateOperationStockRoleParamsCommon = async (value: IOperationStockRulesSiteParams) => {
  const { data } = await updateOperationStockRulesParams({
    ...value,
  })
  if (data) {
    $baseMessage('参数修改成功！', 'success')
    queryOperationStockSite()
  }
}

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

<style scoped lang="scss">
.none {
  display: none;
}

.formula-line {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 16px;
  line-height: 32px;
  flex-wrap: nowrap;
  gap: 4px;

  .formula-input {
    display: inline-block;
    width: 80px;
    margin: 0 2px;

    :deep(.el-input__inner) {
      font-size: 14px;
      padding: 0 8px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
