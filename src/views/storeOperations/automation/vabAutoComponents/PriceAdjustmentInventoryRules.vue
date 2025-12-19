<template>
  <div class="price-adjustment-inventory-rules-tab">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-button type="primary" @click="updateBatch">批量修改</el-button>
            <el-button type="primary" @click="defaultVisible = true">新品默认参数</el-button>
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.sites"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="请选择站点"
              @change="handleQueryData"
            >
              <template #header>
                <el-checkbox :indeterminate="indeterminate" :model-value="checkAll" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="handleQueryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="handleQueryData"
              @keyup.enter="handleQueryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="handleQueryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="handleCellClick"
      @selection-change="operationStockSelectionChangeHandler"
    >
      <el-table-column fixed="left" type="selection" width="38" />
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImg" style="display: block; width: 75px; height: 75px" @click="handleImagePreview(row.skuImg)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" />
      <el-table-column label="站点" prop="siteName" width="135" />
      <el-table-column label="运营" prop="operationUser" width="95" />
      <el-table-column label="规则开关" prop="ruleStatus" width="95">
        <template #default="{ row }">
          <el-switch
            v-model="row.ruleStatus"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="handleRoleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="最低价" prop="minPrice">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.minPrice"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>
            {{ row.minPrice }}
            <br />
            {{ row.minGrossProfitMargin }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" prop="maxPrice">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.maxPrice"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>
            {{ row.maxPrice }}
            <br />
            {{ row.maxGrossProfitMargin }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="调价幅度" prop="adjustmentRange">
        <template #default="scope">{{ scope.row.currencyIcon }} {{ scope.row.adjustmentRange }}</template>
      </el-table-column>
      <el-table-column label="最小调价间隔（天）" prop="adjustmentDay">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.adjustmentDay"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>{{ row.adjustmentDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提高价格（满足全部条件）">
        <el-table-column label="剩余可售天数≤" min-width="125" prop="improveDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售总库存数≤" min-width="125" prop="improveStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveStock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="断货天数≥" min-width="95" prop="improveOutStockDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveOutStockDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveOutStockDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Rating≥" min-width="90" prop="improveRatingHeight">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveRatingHeight"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveRatingHeight }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="降低价格条件组1（满足全部条件）">
        <el-table-column label="断货天数≤" min-width="95" prop="reduceOutStockDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceOutStockDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceOutStockDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余可售天数≥" min-width="125" prop="reduceDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余含在途可售天数≥" min-width="125" prop="reduceTransitDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceTransitDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceTransitDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售总库存数≥" min-width="125" prop="reduceSalesTotalStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceSalesTotalStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceSalesTotalStock }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="降低价格条件组2">
        <el-table-column label="Rating≤" min-width="110" prop="reduceRatingLow">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceRatingLow"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceRatingLow }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="系统最新操作日期" prop="operationDate" width="110">
        <template #header>
          系统最新
          <br />
          操作日期
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template #default="scope">
          <el-text :type="getPriceChangeType(scope.row.operationBeforePrice, scope.row.operationAfterPrice)">
            {{ scope.row.currencyIcon }}{{ scope.row.operationBeforePrice }} -> {{ scope.row.currencyIcon
            }}{{ scope.row.operationAfterPrice }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作结果" prop="operationResult" width="100">
        <template #default="{ row }">
          <el-tag :type="row.operationResult === '失败' ? 'danger' : 'success'">
            {{ row.operationResult }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handlerSysLog(row)">系统操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :page-no="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 默认参数 -->
    <vab-dialog-operation-stock-default v-model="defaultVisible" />
    <!-- 批量修改 -->
    <vab-dialog-operation-stock-update
      v-model:check-rows="multipleSelection"
      v-model:default-visible="batchUpdateVisible"
      @fetch-query="handleQueryData"
    />
    <!-- 查询日志 -->
    <vab-dialog-operation-stock-log v-model:id="_rowId" v-model:operation-stock-visible="operationStockVisible" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import { CSSProperties } from 'vue'
import { type IAutoMationItem, IAutoMationQueryReq } from '/@/type/storeOperation/autoMation'
import { IOperationStocksItem } from '/@/type/storeOperation/operationStock.ts'
import { getRootElement } from '/@/utils/nodeUtils.ts'

defineOptions({
  name: 'PriceAdjustmentInventoryRules',
})

interface Props {
  siteList: Array<{ id: number; label: string }>
  operateUserList: Array<{ id: number; label: string }>
  list: Array<IOperationStocksItem>
  loading: boolean
  total: number
}
const props = defineProps<Props>()
const queryForm = defineModel<IAutoMationQueryReq>('queryForm', { required: true })
const checkAll = defineModel<boolean>('checkAll', { default: false })
const indeterminate = defineModel<boolean>('indeterminate', { default: false })

const emit = defineEmits<{
  'image-preview': [url: string]
  'query-data': []
  'size-change': [value: number]
  'current-change': [value: number]
  'check-all': [val: CheckboxValueType]
  'role-status-change': [row: IOperationStocksItem]
  'cell-blur': [event: any, row: IOperationStocksItem, index: number]
  'cell-click': [row: IAutoMationItem, column: any, cell: HTMLTableCellElement]
}>()

const handleSizeChange = (value: number) => {
  emit('size-change', value)
}
const handleCurrentChange = (value: number) => {
  emit('current-change', value)
}
const handleQueryData = () => {
  emit('query-data')
}
const handleImagePreview = (url: string) => {
  emit('image-preview', url)
}
const handleCheckAll = (val: CheckboxValueType) => {
  checkAll.value = !!val
  indeterminate.value = false
  emit('check-all', val)
}

const handleRoleStatusChange = (row: IOperationStocksItem) => {
  emit('role-status-change', row)
}

const handleCellBlur = (event: any, row: IOperationStocksItem, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  emit('cell-blur', event, row, index)
}

const handleCellClick = (row: IAutoMationItem, column: any, cell: HTMLTableCellElement) => {
  emit('cell-click', row, column, cell)
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  } else if (label !== '站点' && label !== '运营') {
    return {
      cursor: 'pointer',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

// 获取价格变化类型
const getPriceChangeType = (beforePrice: number, afterPrice: number): 'success' | 'warning' | 'danger' => {
  if (afterPrice > beforePrice) {
    return 'success' // 绿色 - 价格升高
  } else if (afterPrice === beforePrice) {
    return 'warning' // 黄色 - 价格不变
  } else {
    return 'danger' // 红色 - 价格降低
  }
}
const defaultVisible = ref<boolean>(false)

const batchUpdateVisible = ref<boolean>(false)

const operationStockVisible = ref<boolean>(false)

const multipleSelection = ref<IOperationStocksItem[]>([])
const _rowId = ref<number>()

const handlerSysLog = (row: IOperationStocksItem) => {
  _rowId.value = row.id
  operationStockVisible.value = true
}

const operationStockSelectionChangeHandler = (val: IOperationStocksItem[]) => {
  multipleSelection.value = val
}

const updateBatch = () => {
  if (multipleSelection.value.length === 0) {
    $baseMessage('请选择需要批量修改的数据！', 'warning')
    return
  }
  batchUpdateVisible.value = true
}
</script>

<style lang="scss" scoped>
.price-adjustment-inventory-rules-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
}

.none {
  display: none;
}
</style>
