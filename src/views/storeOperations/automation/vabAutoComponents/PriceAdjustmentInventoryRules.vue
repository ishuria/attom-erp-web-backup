<template>
  <div class="price-adjustment-inventory-rules-tab">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-button type="primary" @click="updateBatch">批量修改</el-button>
            <el-button type="primary" @click="defaultVisible = true">新品默认参数</el-button>
            <el-button type="primary" @click="handlerPriceCalcLog">价格变更日志</el-button>
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
          <el-form-item label="价格">
            <el-select v-model="queryForm.priceChangeType" clearable placeholder="价格变动" @change="handleQueryData">
              <el-option label="全部" :value="-1" />
              <el-option label="上调" :value="0" />
              <el-option label="持平" :value="1" />
              <el-option label="下调" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="规则开关">
            <el-select v-model="queryForm.ruleStatus" clearable placeholder="规则开关" @change="handleQueryData">
              <el-option label="全部" :value="-1" />
              <el-option label="开启" :value="1" />
              <el-option label="关闭" :value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-switch v-model="showCurrentValue" active-text="显示当前值" inactive-text="隐藏当前值" style="margin-right: 12px" />
            <el-input
              v-model.trim="queryForm.keyWord"
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
      class="custom-table-hover"
      :data="list"
      :header-cell-style="headerCellStyle"
      :row-class-name="tableRowClassName"
      stripe
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @selection-change="operationStockSelectionChangeHandler"
    >
      <el-table-column fixed="left" type="selection" width="38" />
      <el-table-column fixed="left" label="图片" prop="skuImg" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImg" style="display: block; width: 75px; height: 75px" @click="handleImagePreview(row.skuImg)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="站点" prop="siteName" :width="flexColumnWidth(list, '站点', 'siteName')" />
      <el-table-column label="运营" prop="operationUser" width="95" />
      <el-table-column label="销量趋势" width="120">
        <template #default="{ row }">
          <div class="custom-bar">
            <vab-echarts-chart-bar-with-line
              :landed-price-data="row.landedPriceList || []"
              :price-data="row.priceList || []"
              :x-axis-data="xAxis"
              :y-axis-data="row.saleVolumeList"
            />
          </div>
        </template>
      </el-table-column>
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
      <el-table-column
        class-name="group-split-left group-split-left--reduce2"
        header-class-name="group-split-left group-split-left--reduce2"
        label="系统最新操作日期"
        prop="operationDate"
        width="115"
      >
        <template #header>
          系统最新
          <br />
          操作日期
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="100" prop="operationBeforePrice">
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
      <el-table-column label="最低价" min-width="100" prop="minPrice">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.minPrice"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
              @keyup.esc="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>
            {{ row.minPrice }}
            <br />
            {{ row.minGrossProfitMargin }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" min-width="100" prop="maxPrice">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.maxPrice"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
              @keyup.esc="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>
            {{ row.maxPrice }}
            <br />
            {{ row.maxGrossProfitMargin }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最优价" min-width="100" prop="bestPrice">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.bestPrice"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
              @keyup.esc="handleCellBlur($event, row, $index)"
            />
          </div>
          <span class="best-price-cell">
            <span class="price-info">
              {{ row.bestPrice }}
              <br />
              {{ row.bestGrossProfitMargin }}%
            </span>
            <vab-icon
              v-if="row.syncingPrice"
              class="sync-icon syncing"
              icon="loader-4-line"
            />
            <vab-icon
              v-else
              class="sync-icon"
              icon="loop-left-fill"
              @click.stop="handleSyncPrice(row)"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="散点图">
        <template #default="{ row }">
          <el-button circle :icon="Histogram" type="primary" @click="handlePriceProfitScatterClick(row)" />
        </template>
      </el-table-column>
      <el-table-column label="调价幅度" min-width="100" prop="adjustmentRange">
        <template #default="scope">{{ scope.row.currencyIcon }} {{ scope.row.adjustmentRange }}</template>
      </el-table-column>
      <el-table-column label="最小调价间隔（天）" min-width="110" prop="adjustmentDay">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.adjustmentDay"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
              @keyup.esc="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>{{ row.adjustmentDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上调后的价格出单数>=" min-width="110" prop="improveNewPriceOrdersGte">
        <template #default="{ row, $index }">
          <div class="none">
            <el-input
              v-model="row.improveNewPriceOrdersGte"
              type="number"
              @blur="handleCellBlur($event, row, $index)"
              @keyup.enter="handleCellBlur($event, row, $index)"
              @keyup.esc="handleCellBlur($event, row, $index)"
            />
          </div>
          <span>{{ row.improveNewPriceOrdersGte }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="group-split-left group-split-left--improve"
        header-class-name="group-split-left group-split-left--improve"
        label="提高价格（满足全部条件）"
        prop="improveDays"
      >
        <el-table-column
          class-name="group-split-left group-split-left--improve"
          header-class-name="group-split-left group-split-left--improve"
          label="剩余可售天数≤"
          min-width="135"
          prop="improveDays"
        >
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveDays }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.esAvailableSaleDay <= row.improveDays ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.esAvailableSaleDay }}
              </span>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="可售总库存数≤" min-width="130" prop="improveStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.improveStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                  @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveStock }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="断货天数≥" min-width="100" prop="improveOutStockDays">
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
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.outOfStock >= row.improveOutStockDays ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.outOfStock }}
              </span>
            </template>
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
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.improveRatingHeight }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.rating >= row.improveRatingHeight ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.rating }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        class-name="group-split-left group-split-left--reduce1"
        header-class-name="group-split-left group-split-left--reduce1"
        label="降低价格条件组1（满足全部条件）"
        prop="reduceOutStockDays"
      >
        <el-table-column
          class-name="group-split-left group-split-left--reduce1"
          header-class-name="group-split-left group-split-left--reduce1"
          label="断货天数≤"
          min-width="100"
          prop="reduceOutStockDays"
        >
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
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.outOfStock <= row.reduceOutStockDays ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.outOfStock }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="剩余可售天数≥" min-width="130" prop="reduceDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceDays }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.esAvailableSaleDay >= row.reduceDays ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.esAvailableSaleDay }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="剩余含在途可售天数≥" min-width="130" prop="reduceTransitDays">
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
            <template v-if="showCurrentValue">
              <br />
              <span
                :style="{
                  color: row.esAvailableSaleDayTotal >= row.reduceTransitDays ? 'var(--el-color-success)' : 'var(--el-color-danger)',
                }"
              >
                {{ row.esAvailableSaleDayTotal }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="可售总库存数≥" min-width="130" prop="reduceSalesTotalStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceSalesTotalStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceSalesTotalStock }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span
                :style="{
                  color: row.fbaCount >= row.reduceSalesTotalStock ? 'var(--el-color-success)' : 'var(--el-color-danger)',
                }"
              >
                {{ row.fbaCount }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="可售库存≥" min-width="125" prop="reduceAvailableInventory">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceAvailableInventory"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceAvailableInventory }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span
                :style="{
                  color: row.availableInventory >= row.reduceAvailableInventory ? 'var(--el-color-success)' : 'var(--el-color-danger)',
                }"
              >
                {{ row.availableInventory }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        class-name="group-split-left group-split-left--reduce1"
        header-class-name="group-split-left group-split-left--reduce1"
        label="降低价格条件组2"
        prop="reduceRatingLow"
      >
        <el-table-column
          class-name="group-split-left group-split-left--reduce1"
          header-class-name="group-split-left group-split-left--reduce1"
          label="Rating≤"
          min-width="110"
          prop="reduceRatingLow"
        >
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.reduceRatingLow"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
                @keyup.esc="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.reduceRatingLow }}</span>
            <template v-if="showCurrentValue">
              <br />
              <span :style="{ color: row.rating <= row.reduceRatingLow ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                {{ row.rating }}
              </span>
            </template>
          </template>
        </el-table-column>
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
    <!-- 价格变更日志 -->
    <vab-dialog-operation-stock-price-calc-log v-model:visible="priceCalcLogVisible" />

    <!-- 销量趋势弹窗 -->
    <sale-trend-dialog v-model:visible="saleTrendVisible" :site="currentRowData?.site" :sku="currentRowData?.sku" />

    <!-- 价格利润散点图 -->
    <price-profit-scatter-chart v-model="priceProfitScatterVisible" :site="currentRowData?.site" :sku="currentRowData?.sku" />
  </div>
</template>

<script lang="ts" setup>
import { Histogram, Search } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import { CSSProperties } from 'vue'
import { syncAmazonPrice } from '/@/api/devlocal/operationAutoMation'
import { type IAutoMationItem, IAutoMationQueryReq } from '/@/type/storeOperation/autoMation'
import { IOperationStocksItem } from '/@/type/storeOperation/operationStock.ts'
import handleClipboard from '/@/utils/clipboard'
import { getRootElement } from '/@/utils/nodeUtils.ts'
import { flexColumnWidth } from '/@/utils/tableColum'

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
const showCurrentValue = ref<boolean>(true)
const xAxis = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
const saleTrendVisible = ref<boolean>(false)
const priceProfitScatterVisible = ref<boolean>(false)
// 当前行数据（用于销量趋势弹窗）
const currentRowData = ref<any>(null)
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
const handlePriceProfitScatterClick = (row: IAutoMationItem) => {
  // 保存当前行数据用于弹窗显示
  currentRowData.value = row

  priceProfitScatterVisible.value = true
}
const handleCellClick = (row: IAutoMationItem, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '销量趋势') {
    // 保存当前行数据用于弹窗显示
    currentRowData.value = row
    // 打开销量趋势具体的弹窗
    saleTrendVisible.value = true
  } else {
    emit('cell-click', row, column, cell)
  }
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

const priceCalcLogVisible = ref<boolean>(false)

const multipleSelection = ref<IOperationStocksItem[]>([])
const _rowId = ref<number>()

const handlerSysLog = (row: IOperationStocksItem) => {
  _rowId.value = row.id
  operationStockVisible.value = true
}

const handlerPriceCalcLog = () => {
  priceCalcLogVisible.value = true
}

// 同步价格到亚马逊
const handleSyncPrice = async (row: IOperationStocksItem) => {
  if (!row.bestPrice) {
    $baseMessage('最优价不能为空', 'warning')
    return
  }
  row.syncingPrice = true
  try {
    const result = await syncAmazonPrice({
      sku: row.sku,
      site: row.site,
      new_price: String(row.bestPrice),
      updateType: 'stock_rules', // 调价库存规则表
    })
    if (result.code === 0) {
      $baseMessage('价格同步成功', 'success')
      handleQueryData()
    } else {
      $baseMessage(result.message || '价格同步失败', 'error')
    }
  } catch (error) {
    $baseMessage('价格同步请求失败', 'error')
    console.error('同步价格失败:', error)
  } finally {
    row.syncingPrice = false
  }
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

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  const prop = column.property
  if (
    prop === 'skuImg' ||
    prop === 'sku' ||
    prop === 'siteName' ||
    prop === 'operationUser' ||
    prop === 'operationDate' ||
    prop === 'operationBeforePrice' ||
    prop === 'operationResult'
  ) {
    return
  }

  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const prop = data.column?.property

  if (['improveDays', 'improveOutStockDays', 'improveRatingHeight'].includes(prop)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-primary-light-9)',
      color: 'var(--el-color-primary)',
      fontWeight: 600,
    }
  }
  if (['reduceDays', 'reduceOutStockDays', 'reduceAvailableInventory', 'reduceSalesTotalStock', 'reduceTransitDays'].includes(prop)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-warning-light-9)',
      color: 'var(--el-color-warning)',
      fontWeight: 600,
    }
  }
  if (['reduceRatingLow'].includes(prop)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-success-light-9)',
      color: 'var(--el-color-success)',
      fontWeight: 600,
    }
  }
  return { textAlign: 'center' }
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
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
.best-price-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  .price-info {
    text-align: left;
  }
  .sync-icon {
    cursor: pointer;
    font-size: 14px;
    color: var(--el-color-primary);
    transition: all 0.3s;
    flex-shrink: 0;
    &:hover {
      color: var(--el-color-primary-dark-2);
      transform: scale(1.1);
    }
    &.syncing {
      animation: rotate 1s linear infinite;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.custom-bar {
  width: 100%;
  height: 50px;
}
/* 每组左侧分割线：表头 + body */
:deep(.group-split-left) {
  border-left: 3px solid var(--el-border-color) !important;
}

/* 也可以做成不同组不同颜色的分割线，更醒目 */
:deep(.group-split-left--improve) {
  border-left-color: var(--el-border-color) !important;
}
:deep(.group-split-left--reduce1) {
  border-left-color: var(--el-border-color) !important;
}
:deep(.group-split-left--reduce2) {
  border-left-color: var(--el-border-color) !important;
}
// 斑马纹样式
:deep(.custom-table-hover) {
  .el-table__body tr.el-table__row--striped > td.el-table__cell {
    background-color: #fafafa !important;
  }

  // 条纹行hover时保持条纹颜色
  .el-table__body tr.el-table__row--striped.hover-row > td.el-table__cell {
    background-color: #fafafa !important;
  }

  // 选中行保持蓝色背景 - 优先级最高
  .el-table__body tr.select-row > td.el-table__cell {
    background-color: #7bddde !important;
  }

  // 选中行悬浮时也保持蓝色背景
  .el-table__body tr.select-row.hover-row > td.el-table__cell {
    background-color: #7bddde !important;
  }
}
</style>
