<template>
  <div class="comprehensive-table-container auto-height-container inventory-count-page">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <div class="table-header-actions">
          <el-button :loading="addLoading" type="primary" @click="handleAdd">开始库存盘点</el-button>
          <el-button :icon="Plus" type="primary" @click="openAdjustAddDialog">新增库存调整</el-button>
          <el-button :disabled="marginLoading" @click="openMarginDialog">余量设定</el-button>
          <el-button :disabled="!hasListData" :loading="finishLoading" type="success" @click="handleFinish">完成盘点</el-button>
          <el-button :disabled="!hasListData" :loading="cancelLoading" @click="handleCancel">取消盘点</el-button>
        </div>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columns"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd"
                :on-move="handleMove"
              >
                <div
                  v-for="item in columns"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入关键词"
              style="width: 280px"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="listLoading" :icon="RefreshRight" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="rowKey"
      show-summary
      :span-method="tableSpanMethod"
      :summary-method="getSummaryRow"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="(col, index) in checkList"
        :key="index"
        :align="col.align"
        :fixed="col.isFixed"
        :label="col.label"
        :min-width="handleWidth(col)"
        :prop="col.prop"
        :show-overflow-tooltip="col.showOverflowTooltip"
        :sortable="col.sortable ? 'custom' : false"
        :width="col.width"
      >
        <template #header>
          <template v-if="col.prop === 'lackCount'">
            <el-tooltip content="待打包盘点数" placement="top">
              <span>
                应有库存数
                <el-icon><question-filled /></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template v-else-if="col.prop === 'adjustedOrderCount'">
            <el-tooltip content="总订货数 + 总调整数" placement="top">
              <span>
                调整订货数
                <el-icon><question-filled /></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template v-else-if="col.prop === 'orderDiffCount'">
            <el-tooltip content="调整订货数 - 总发货数" placement="top">
              <span>
                订发差值
                <el-icon><question-filled /></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template v-else-if="col.prop === 'anomalyCount'">
            <el-tooltip content="订发差值 - 总待售后数 - 未到货数" placement="top">
              <span>
                异常数
                <el-icon><question-filled /></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template v-else>{{ col.label }}</template>
        </template>

        <template #default="{ row }">
          <template v-if="col.prop === 'skuImg'">
            <div class="sku-image-cell">
              <el-image
                v-if="row.skuImg"
                fit="cover"
                preview-class-name="inventory-count-image-viewer"
                :preview-src-list="[row.skuImg]"
                :preview-teleported="true"
                :src="row.skuImg"
                @click.stop
              />
              <span v-else>-</span>
            </div>
          </template>
          <template v-else-if="col.prop === 'sku'">
            <div class="sku-copy-cell">
              <span>{{ row.sku || '-' }}</span>
              <el-button v-if="row.sku" :icon="CopyDocument" link type="primary" @click.stop="handleClip(row.sku)" />
            </div>
          </template>
          <template v-else-if="col.prop === 'orderDate' || col.prop === 'createTime'">
            {{ formatDisplayDateTime(row[col.prop]) }}
          </template>
          <template v-else-if="col.prop === 'totalTaskCount'">
            {{ formatNumber(getTotalTaskCount(row)) }}
          </template>
          <template v-else-if="col.prop === 'totalAfterCount'">
            {{ formatNumber(getTotalAfterCount(row)) }}
          </template>
          <template v-else-if="col.prop === 'lackCount'">
            <span :class="Number(row.lackCount) < 0 ? 'text-green' : Number(row.lackCount) > 0 ? 'text-red' : ''">
              {{ formatNumber(-(Number(row.lackCount) || 0)) }}
            </span>
          </template>
          <template v-else-if="col.prop === 'adjustedOrderCount'">
            <el-tooltip :content="`${formatNumber(row.totalOrderCount)} + ${formatNumber(row.adjustCount)}`" placement="top">
              <span>{{ formatNumber((Number(row.totalOrderCount) || 0) + (Number(row.adjustCount) || 0)) }}</span>
            </el-tooltip>
          </template>
          <template v-else-if="col.prop === 'orderDiffCount'">
            <el-tooltip
              :content="`${formatNumber((Number(row.totalOrderCount) || 0) + (Number(row.adjustCount) || 0))} - ${formatNumber(row.totalSendCount)}`"
              placement="top"
            >
              <span :class="getOrderDiffCount(row) < 0 ? 'text-red' : getOrderDiffCount(row) > 0 ? 'text-green' : ''">
                {{ formatNumber(getOrderDiffCount(row)) }}
              </span>
            </el-tooltip>
          </template>
          <template v-else-if="col.prop === 'anomalyCount'">
            <span :class="getAnomalyCount(row) < 0 ? 'text-red' : getAnomalyCount(row) > 0 ? 'text-green' : ''">
              {{ formatNumber(getAnomalyCount(row)) }}
            </span>
          </template>
          <template v-else-if="col.prop === 'noEncasementCount'">
            <el-input-number
              v-if="isEditingRow(row.id)"
              ref="noEncasementInputRef"
              v-model="rowEditForm.noEncasementCount"
              :controls="false"
              :min="0"
              :precision="0"
              style="width: 120px"
              @blur="handleSaveRow"
              @keyup.enter="handleSaveRow"
            />
            <span v-else class="editable-text" @click="handleStartEdit(row)">{{ formatNumber(row.noEncasementCount) }}</span>
          </template>
          <template v-else-if="col.prop === 'remark'">
            <span class="editable-text editable-text--left" @click="openRemarkDialog(row)">{{ row.remark || '-' }}</span>
          </template>
          <template v-else>
            {{ formatNumber(row[col.prop]) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="80">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">查看</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="当前暂无进行中的库存盘点数据" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <vab-dialog v-model="adjustAddVisible" title="新增库存调整" width="760px" @close="handleAdjustAddDialogClose">
      <el-form
        ref="adjustAddFormRef"
        v-loading="adjustSkuInfoLoading || adjustAddLoading || adjustPriceCalcLoading || adjustPackingTaskLoading"
        class="dialog-form"
        label-position="right"
        label-width="96px"
        :model="adjustAddForm"
        :rules="adjustAddRules"
      >
        <div class="dialog-grid">
          <el-form-item label="类型" prop="type">
            <el-select v-model="adjustAddForm.type" placeholder="请选择调整类型" style="width: 100%">
              <el-option v-for="item in adjustTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="dialog-grid-span-2" label="SKU" prop="sku">
            <el-input
              v-model.trim="adjustAddForm.sku"
              clearable
              placeholder="请输入关键词检索"
              @blur="handleAdjustSearchSku"
              @keyup.enter="handleAdjustSearchSku"
            />
          </el-form-item>
          <el-form-item label="PO" prop="poId">
            <template #default>
              <el-select
                v-model="adjustAddForm.poId"
                clearable
                filterable
                :loading="adjustPoLoading"
                placeholder="请输入 PO 搜索"
                remote
                :remote-method="handleAdjustSearchPo"
                style="width: 80%"
              >
                <el-option v-for="item in adjustPoOptions" :key="item.poId" :label="item.po" :value="item.poId" />
              </el-select>
              <el-checkbox v-model="adjustAddForm.allPo" style="padding-left: 10px">全部 PO</el-checkbox>
            </template>
          </el-form-item>
          <el-form-item label="产品信息">
            <el-input disabled :model-value="adjustAddForm.productDesc" />
          </el-form-item>
          <el-form-item label="SKU 图片">
            <div class="sku-image-preview">
              <el-image v-if="adjustAddForm.skuImg" fit="cover" :preview-src-list="[adjustAddForm.skuImg]" :src="adjustAddForm.skuImg" />
            </div>
          </el-form-item>
          <el-form-item v-if="showAdjustPackingTaskFields" prop="packingTaskId">
            <template #label>
              <span class="packing-task-label">
                打包任务
                <el-tooltip content="请选择调整到的打包任务" effect="dark" placement="top">
                  <el-icon class="packing-task-tip">
                    <question-filled />
                  </el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-select
              v-model="adjustAddForm.packingTaskId"
              clearable
              filterable
              :loading="adjustPackingTaskLoading"
              placeholder="请选择打包任务"
              style="width: 100%"
            >
              <el-option
                v-for="item in adjustPackingTaskOptions"
                :key="item.packageTaskId"
                :label="item.value"
                :value="item.packageTaskId"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showAdjustPackingTaskFields" label="打包任务数" prop="currentTaskCount">
            <el-input disabled :model-value="adjustAddForm.currentTaskCount" />
          </el-form-item>
          <el-form-item label="货件编号">
            <el-input v-model.trim="adjustAddForm.shipmentId" clearable placeholder="请输入货件编号" />
          </el-form-item>
          <el-form-item label="箱号">
            <el-input v-model.trim="adjustAddForm.boxNumber" clearable placeholder="请输入箱号" />
          </el-form-item>
          <el-form-item label="调整数量" prop="count">
            <el-input-number v-model="adjustAddForm.count" :precision="2" :step="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="调整价格" prop="price">
            <el-input-number v-model="adjustAddForm.price" disabled :precision="2" :step="1" style="width: 100%" />
          </el-form-item>
          <el-form-item class="dialog-grid-span-2" label="备注">
            <el-input
              v-model.trim="adjustAddForm.remark"
              :maxlength="500"
              placeholder="请输入备注"
              :rows="4"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="adjustAddVisible = false">取消</el-button>
        <el-button :loading="adjustAddLoading" type="primary" @click="handleSubmitAdjustAdd">确认新增</el-button>
      </template>
    </vab-dialog>

    <vab-dialog v-model="marginVisible" title="余量设定" width="520px" @close="handleMarginDialogClose">
      <el-form
        ref="marginFormRef"
        v-loading="marginLoading || marginSaving"
        class="margin-dialog-form"
        label-position="right"
        label-width="110px"
        :model="marginForm"
        :rules="marginRules"
      >
        <el-form-item label="数量阈值" prop="count">
          <el-input-number v-model="marginForm.count" :controls="false" :min="0" :precision="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="比例阈值(%)" prop="proportion">
          <el-input-number v-model="marginForm.proportion" :controls="false" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="marginSaving" @click="marginVisible = false">取消</el-button>
        <el-button :loading="marginSaving" type="primary" @click="handleSaveMargin">确定</el-button>
      </template>
    </vab-dialog>

    <vab-dialog v-model="remarkDialogVisible" title="盘点备注" width="520px" @close="handleRemarkDialogClose">
      <el-input
        ref="remarkTextareaRef"
        v-model="remarkDialogForm.remark"
        :maxlength="500"
        placeholder="请输入盘点备注"
        :rows="6"
        show-word-limit
        type="textarea"
      />
      <template #footer>
        <el-button @click="remarkDialogVisible = false">取消</el-button>
        <el-button :loading="remarkSaving" type="primary" @click="handleSaveRemark">确定</el-button>
      </template>
    </vab-dialog>

    <vab-dialog v-model="viewVisible" title="盘点明细" width="1200px" @close="handleViewDialogClose">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px">
        <el-input
          v-model.trim="viewQuery.keyWord"
          clearable
          placeholder="请输入关键词搜索"
          style="width: 280px; margin-right: 8px"
          @clear="handleViewQuery"
          @keyup.enter="handleViewQuery"
        />
        <el-button :loading="viewLoading" type="primary" @click="handleViewQuery">查询</el-button>
      </div>
      <el-table v-loading="viewLoading" border :data="viewList" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column align="center" label="PO" min-width="160" prop="po" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.po" class="copyable-text" @click="handleClip(row.po)">
              {{ row.po }}
              <el-icon style="margin-left: 4px"><copy-document /></el-icon>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="SKU" min-width="200" prop="sku" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.sku" class="copyable-text" @click="handleClip(row.sku)">
              {{ row.sku }}
              <el-icon style="margin-left: 4px"><copy-document /></el-icon>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订货数" min-width="110" prop="totalOrderCount">
          <template #default="{ row }">
            {{ formatNumber(row.totalOrderCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发货数" min-width="110" prop="shipmentCount">
          <template #default="{ row }">
            {{ formatNumber(row.shipmentCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总打包完成数" min-width="130" prop="packagingCompletionCount">
          <template #default="{ row }">
            {{ formatNumber(row.packagingCompletionCount) }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无盘点明细数据" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="viewQuery.pageNo"
        :page-size="viewQuery.pageSize"
        :total="viewTotal"
        @current-change="handleViewCurrentChange"
        @size-change="handleViewSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument, Plus, QuestionFilled, RefreshRight, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  addInventoryAdjust,
  getInventoryAdjustPackingTaskList,
  getInventoryAdjustPoList,
  getInventoryAdjustPrice,
  getInventoryAdjustSkuInfo,
} from '/@/api/devlocal/inventoryAdjustment'
import {
  addInventoryCount,
  cancelInventoryCount,
  finishInventoryCount,
  getInventoryCountDetail,
  getInventoryCountList,
  getInventoryCountMargin,
  updateInventoryCountMargin,
  updateInventoryCountRow,
} from '/@/api/devlocal/inventoryCount'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import { $baseConfirm, $baseMessage } from '/@/hooks'
import type { InventoryAdjustAddForm, InventoryAdjustPackingTaskOption, InventoryAdjustPoOption } from '/@/type/inventory/adjust'
import type {
  InventoryCountDetailItem,
  InventoryCountItem,
  InventoryCountMargin,
  InventoryCountPackageTaskItem,
  InventoryCountQuery,
  InventoryCountRowEditForm,
} from '/@/type/inventory/count'
import { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'
import { handleClip } from '/@/utils/clipboard'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'InventoryCount',
})

const adjustTypeOptions = [
  { label: '正常调整', value: 0 },
  { label: '发布打包任务', value: 1 },
]

const createDefaultQueryForm = (): InventoryCountQuery => ({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  orderByField: '',
  orderDirection: '',
})

const createDefaultMarginForm = (): InventoryCountMargin => ({
  count: undefined,
  proportion: undefined,
})

const createDefaultRowEditForm = (): InventoryCountRowEditForm => ({
  id: '',
  noEncasementCount: undefined,
  remark: '',
})

const createDefaultAdjustAddForm = (): InventoryAdjustAddForm => ({
  sku: '',
  productDesc: '',
  skuImg: '',
  packingTaskId: undefined,
  currentTaskCount: undefined,
  allPo: false,
  poId: undefined,
  shipmentId: '',
  boxNumber: '',
  count: undefined,
  price: undefined,
  type: 0,
  remark: '',
})

interface InventoryCountTableRow extends InventoryCountItem {
  rowKey: string
  parentId: number | string
  totalAfterCount?: number
}

const pickArray = <T = any,>(response: any): T[] => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.rows)) return response.rows
  if (Array.isArray(response?.list)) return response.list
  if (Array.isArray(response?.data?.rows)) return response.data.rows
  if (Array.isArray(response?.data?.list)) return response.data.list
  return []
}

const pickObject = <T = any,>(response: any): T => (response?.data ?? response ?? {}) as T

const pickTotal = (response: any) => {
  if (typeof response?.total === 'number') return response.total
  if (typeof response?.data?.total === 'number') return response.data.total
  if (typeof response?.count === 'number') return response.count
  if (typeof response?.data?.count === 'number') return response.data.count
  return 0
}

const queryForm = reactive<InventoryCountQuery>(createDefaultQueryForm())
const list = ref<InventoryCountItem[]>([])
const total = ref(0)
const listLoading = ref(false)

const marginInfo = reactive<InventoryCountMargin>(createDefaultMarginForm())
const marginForm = reactive<InventoryCountMargin>(createDefaultMarginForm())
const marginVisible = ref(false)
const marginLoading = ref(false)
const marginSaving = ref(false)
const marginFormRef = ref<FormInstance>()

const adjustAddVisible = ref(false)
const adjustAddLoading = ref(false)
const adjustSkuInfoLoading = ref(false)
const adjustPriceCalcLoading = ref(false)
const adjustPoLoading = ref(false)
const adjustPackingTaskLoading = ref(false)
const adjustAddFormRef = ref<FormInstance>()
const adjustAddForm = reactive<InventoryAdjustAddForm>(createDefaultAdjustAddForm())
const adjustPoOptions = ref<InventoryAdjustPoOption[]>([])
const adjustPackingTaskOptions = ref<InventoryAdjustPackingTaskOption[]>([])
const adjustPoKeyword = ref('')
const showAdjustPackingTaskFields = computed(() => String(adjustAddForm.type ?? '0') === '0')

const addLoading = ref(false)
const cancelLoading = ref(false)
const finishLoading = ref(false)

const editingRowId = ref<number | string>('')
const noEncasementInputRef = ref<any>(null)

const remarkDialogVisible = ref(false)
const remarkSaving = ref(false)
const remarkTextareaRef = ref<any>(null)
const remarkDialogForm = reactive<{ id: number | string; remark: string; noEncasementCount: number | undefined }>({
  id: '',
  remark: '',
  noEncasementCount: undefined,
})
const rowSavingId = ref<number | string>('')
const rowEditForm = reactive<InventoryCountRowEditForm>(createDefaultRowEditForm())

const viewVisible = ref(false)
const viewLoading = ref(false)
const viewList = ref<InventoryCountDetailItem[]>([])
const viewTotal = ref(0)
const viewQuery = reactive({
  sku: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const hasListData = computed(() => list.value.length > 0)
const mergeColumnProps = new Set([
  'skuImg',
  'sku',
  'productName',
  'totalOrderCount',
  'notYetArrived',
  'encasementCount',
  'totalTaskCount',
  'totalAfterCount',
  'lackCount',
  'totalSendCount',
  'totalReceiveCount',
  'adjustCount',
  'adjustedOrderCount',
  'orderDiffCount',
  'anomalyCount',
  'noEncasementCount',
  'remark',
  'createTime',
])

const buildTableRows = (item: InventoryCountItem): InventoryCountTableRow[] => {
  const packageTaskList = Array.isArray(item.packageTaskList) ? item.packageTaskList : []

  if (!packageTaskList.length) {
    return [
      {
        ...item,
        rowKey: `${item.id}-main`,
        parentId: item.id,
      },
    ]
  }

  return packageTaskList.map((packageTask, index) => ({
    ...item,
    po: packageTask.po,
    orderDate: packageTask.orderDate,
    actualCount: packageTask.actualCount,
    taskCount: packageTask.taskCount,
    afterCount: packageTask.afterCount,
    rowKey: `${item.id}-${packageTask.id ?? index}`,
    parentId: item.id,
  }))
}

const tableData = computed<InventoryCountTableRow[]>(() => list.value.flatMap((item) => buildTableRows(item)))

const rowSpanMap = computed(() => {
  const spanMap = new Map<number, number>()
  let startIndex = 0

  list.value.forEach((item) => {
    const span = Math.max(getPackageTaskList(item).length, 1)
    for (let index = 0; index < span; index += 1) {
      spanMap.set(startIndex + index, index === 0 ? span : 0)
    }
    startIndex += span
  })

  return spanMap
})

const validateInteger = (_rule: any, value: number | undefined, callback: (error?: Error) => void) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    callback(new Error('count不能为空'))
    return
  }
  if (Number(value) < 0) {
    callback(new Error('count不能小于0'))
    return
  }
  if (!Number.isInteger(Number(value))) {
    callback(new Error('数量阈值必须为整数'))
    return
  }
  callback()
}

const validateProportion = (_rule: any, value: number | undefined, callback: (error?: Error) => void) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    callback(new Error('proportion不能为空'))
    return
  }
  if (Number(value) < 0) {
    callback(new Error('proportion不能小于0'))
    return
  }
  callback()
}

const validateAdjustQuantity = (_rule: any, value: number | undefined, callback: (error?: Error) => void) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    callback(new Error('请输入调整数量'))
    return
  }
  callback()
}

const marginRules = reactive<FormRules<InventoryCountMargin>>({
  count: [{ trigger: 'blur', validator: validateInteger }],
  proportion: [{ trigger: 'blur', validator: validateProportion }],
})

const adjustAddRules = reactive<FormRules<InventoryAdjustAddForm>>({
  sku: [{ required: true, trigger: 'blur', message: '请输入 SKU' }],
  poId: [{ required: true, trigger: 'change', message: '请选择 PO' }],
  count: [{ trigger: 'blur', validator: validateAdjustQuantity }],
})

const normalizeNumberValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return undefined
  const normalizedValue = Number(value)
  return Number.isNaN(normalizedValue) ? undefined : normalizedValue
}

const formatNumber = (value?: number | string) => {
  if (value === null || value === undefined || value === '') return '-'
  const normalizedValue = Number(value)
  if (Number.isNaN(normalizedValue)) return String(value)
  return Number.isInteger(normalizedValue) ? `${normalizedValue}` : normalizedValue.toFixed(2)
}

const isDash = (value: unknown) => value === null || value === undefined || value === ''

const formatPercent = (value?: number) => {
  if (value === null || value === undefined) return '-'
  return `${Number(value)}%`
}

const formatDisplayDateTime = (value?: string) => {
  if (!value) return '-'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
  return formatDate(parsedDate, 'yyyy-MM-dd hh:mm:ss')
}

const syncMarginForm = () => {
  marginForm.count = marginInfo.count
  marginForm.proportion = marginInfo.proportion
}

const resetRowEditForm = () => {
  editingRowId.value = ''
  rowSavingId.value = ''
  Object.assign(rowEditForm, createDefaultRowEditForm())
}

const isEditingRow = (id: number | string) => editingRowId.value === id
const getPackageTaskList = (row: InventoryCountItem): InventoryCountPackageTaskItem[] =>
  Array.isArray(row.packageTaskList) ? row.packageTaskList : []

const summaryCalcMap: Record<string, (row: any) => number> = {
  actualCount: (row) => Number(row.actualCount) || 0,
  taskCount: (row) => Number(row.taskCount) || 0,
  afterCount: (row) => Number(row.afterCount) || 0,
  encasementCount: (row) => Number(row.encasementCount) || 0,
  totalTaskCount: (row) => Number(getTotalTaskCount(row)) || 0,
  totalAfterCount: (row) => Number(getTotalAfterCount(row)) || 0,
  lackCount: (row) => -(Number(row.lackCount) || 0),
  notYetArrived: (row) => Number(row.notYetArrived) || 0,
  totalOrderCount: (row) => Number(row.totalOrderCount) || 0,
  totalSendCount: (row) => Number(row.totalSendCount) || 0,
  adjustCount: (row) => Number(row.adjustCount) || 0,
  adjustedOrderCount: (row) => (Number(row.totalOrderCount) || 0) + (Number(row.adjustCount) || 0),
  orderDiffCount: (row) => -((Number(row.totalOrderCount) || 0) + (Number(row.adjustCount) || 0) - (Number(row.totalSendCount) || 0)),
  anomalyCount: (row) => getAnomalyCount(row),
  totalReceiveCount: (row) => Number(row.totalReceiveCount) || 0,
  noEncasementCount: (row) => Number(row.noEncasementCount) || 0,
}

const getSummaryRow = ({ columns, data }: { columns: any[]; data: any[] }) => {
  const sums: string[] = []
  let hasFirstColumn = false

  columns.forEach((column) => {
    if (!hasFirstColumn) {
      sums.push('合计')
      hasFirstColumn = true
      return
    }

    const calc = summaryCalcMap[column.property]
    if (calc) {
      const total = data.reduce((sum, row) => sum + calc(row), 0)
      sums.push(formatNumber(total))
    } else {
      sums.push('')
    }
  })

  return sums
}

const getTotalAfterCount = (row: InventoryCountItem) => {
  const packageTaskList = getPackageTaskList(row)
  if (!packageTaskList.length) return row.afterCount

  const totalAfterCount = packageTaskList.reduce((sum, item) => sum + Number(item.afterCount || 0), 0)
  return totalAfterCount
}

const getTotalTaskCount = (row: InventoryCountItem) => {
  const packageTaskList = getPackageTaskList(row)
  if (!packageTaskList.length) return row.taskCount

  return packageTaskList.reduce((sum, item) => sum + Number(item.taskCount || 0), 0)
}

const getOrderDiffCount = (row: InventoryCountItem) =>
  (Number(row.totalOrderCount) || 0) + (Number(row.adjustCount) || 0) - (Number(row.totalSendCount) || 0)

const getAnomalyCount = (row: InventoryCountItem) =>
  getOrderDiffCount(row) - (Number(getTotalAfterCount(row)) || 0) - (Number(row.notYetArrived) || 0)

const getGroupLeadRow = (row: InventoryCountTableRow) => tableData.value.find((item) => item.parentId === row.parentId) || row

const tableSpanMethod = ({
  rowIndex,
  column,
}: {
  row: InventoryCountTableRow
  rowIndex: number
  column: { property?: string }
  columnIndex: number
}) => {
  if (!column.property || !mergeColumnProps.has(column.property)) return { rowspan: 1, colspan: 1 }

  const rowspan = rowSpanMap.value.get(rowIndex) ?? 1
  if (rowspan === 0) return { rowspan: 0, colspan: 0 }
  return { rowspan, colspan: 1 }
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  queryForm.orderByField = prop || ''
  queryForm.orderDirection = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
  fetchList()
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const response = await getInventoryCountList({ ...queryForm })
    list.value = pickArray<InventoryCountItem>(response)
    total.value = pickTotal(response)
  } catch {
    list.value = []
    total.value = 0
  } finally {
    listLoading.value = false
  }
}

const fetchMargin = async () => {
  marginLoading.value = true
  try {
    const response = await getInventoryCountMargin()
    const payload = pickObject<InventoryCountMargin>(response)
    marginInfo.count = normalizeNumberValue(payload.count)
    marginInfo.proportion = normalizeNumberValue(payload.proportion)
    syncMarginForm()
  } catch {
    marginInfo.count = undefined
    marginInfo.proportion = undefined
    syncMarginForm()
  } finally {
    marginLoading.value = false
  }
}

const handleQuery = () => {
  queryForm.pageNo = 1
  resetRowEditForm()
  fetchList()
}

const handleReset = () => {
  Object.assign(queryForm, createDefaultQueryForm())
  resetRowEditForm()
  fetchList()
}

const resetAdjustAddFormByType = (type: number | string | undefined) => {
  Object.assign(adjustAddForm, createDefaultAdjustAddForm(), {
    type: type ?? 0,
  })
  adjustPoKeyword.value = ''
  adjustPoOptions.value = []
  adjustPackingTaskOptions.value = []
  adjustAddFormRef.value?.clearValidate()
}

const resetAdjustAddForm = () => {
  resetAdjustAddFormByType(createDefaultAdjustAddForm().type)
}

const openAdjustAddDialog = () => {
  resetAdjustAddForm()
  adjustAddVisible.value = true
}

const handleAdjustAddDialogClose = () => {
  resetAdjustAddForm()
}

const fetchAdjustPoOptions = async (po = '') => {
  const sku = adjustAddForm.sku.trim()
  if (!sku) {
    adjustPoOptions.value = []
    adjustAddForm.poId = undefined
    return
  }

  adjustPoLoading.value = true
  try {
    const response = await getInventoryAdjustPoList({
      sku,
      po: po || undefined,
      allPo: adjustAddForm.allPo,
    })
    adjustPoOptions.value = pickArray<InventoryAdjustPoOption>(response)
    const currentPoExists = adjustPoOptions.value.some((item) => item.poId === adjustAddForm.poId)
    if (!currentPoExists) adjustAddForm.poId = undefined
  } catch {
    adjustPoOptions.value = []
    adjustAddForm.poId = undefined
  } finally {
    adjustPoLoading.value = false
  }
}

const handleAdjustSearchPo = (value: string) => {
  adjustPoKeyword.value = value.trim()
  fetchAdjustPoOptions(adjustPoKeyword.value)
}

const fetchAdjustPackingTaskOptions = async () => {
  const sku = adjustAddForm.sku.trim()
  if (!showAdjustPackingTaskFields.value || !sku || adjustAddForm.poId == null || adjustAddForm.poId === '') {
    adjustPackingTaskOptions.value = []
    adjustAddForm.packingTaskId = undefined
    adjustAddForm.currentTaskCount = undefined
    return
  }

  adjustPackingTaskLoading.value = true
  try {
    const response = await getInventoryAdjustPackingTaskList({
      poId: adjustAddForm.poId,
      sku,
    })
    adjustPackingTaskOptions.value = pickArray<InventoryAdjustPackingTaskOption>(response)
    const currentTask = adjustPackingTaskOptions.value.find((item) => item.packageTaskId === adjustAddForm.packingTaskId)
    if (currentTask) adjustAddForm.currentTaskCount = currentTask.packageTaskCount ?? undefined
    else {
      adjustAddForm.packingTaskId = undefined
      adjustAddForm.currentTaskCount = undefined
    }
  } catch {
    adjustPackingTaskOptions.value = []
    adjustAddForm.packingTaskId = undefined
    adjustAddForm.currentTaskCount = undefined
  } finally {
    adjustPackingTaskLoading.value = false
  }
}

const handleAdjustSearchSku = async () => {
  const sku = adjustAddForm.sku.trim()
  if (!sku) return

  adjustSkuInfoLoading.value = true
  try {
    const response = await getInventoryAdjustSkuInfo(sku)
    const skuInfo = pickObject<{ productDesc?: string; skuImg?: string }>(response)
    adjustAddForm.productDesc = skuInfo.productDesc ?? ''
    adjustAddForm.skuImg = skuInfo.skuImg ?? ''
    await fetchAdjustPoOptions(adjustPoKeyword.value)

    if (!skuInfo.productDesc && !skuInfo.skuImg && adjustPoOptions.value.length === 0) {
      $baseMessage('未查询到对应 SKU 信息', 'warning', 'hey')
    }
  } catch {
    adjustAddForm.productDesc = ''
    adjustAddForm.skuImg = ''
    adjustAddForm.poId = undefined
    adjustPoOptions.value = []
    adjustPackingTaskOptions.value = []
    adjustAddForm.packingTaskId = undefined
    adjustAddForm.currentTaskCount = undefined
  } finally {
    adjustSkuInfoLoading.value = false
  }
}

const shouldCalculateAdjustPrice = computed(() => {
  if (!adjustAddForm.sku.trim()) return false
  if (adjustAddForm.poId === undefined || adjustAddForm.poId === null || adjustAddForm.poId === '') return false
  const count = Number(adjustAddForm.count)
  if (adjustAddForm.count === undefined || adjustAddForm.count === null || Number.isNaN(count)) return false
  return count !== 0
})

const handleCalculateAdjustPrice = async () => {
  if (!shouldCalculateAdjustPrice.value) {
    adjustAddForm.price = undefined
    return
  }

  adjustPriceCalcLoading.value = true
  try {
    const response = await getInventoryAdjustPrice({
      sku: adjustAddForm.sku.trim(),
      poId: adjustAddForm.poId!,
      count: Number(adjustAddForm.count),
    })
    const price = pickObject<number>(response)
    const normalizedPrice = Number(price)
    adjustAddForm.price = Number.isNaN(normalizedPrice) ? undefined : Number(normalizedPrice.toFixed(2))
  } catch {
    adjustAddForm.price = undefined
  } finally {
    adjustPriceCalcLoading.value = false
  }
}

const handleSubmitAdjustAdd = async () => {
  if (!adjustAddFormRef.value) return

  await adjustAddFormRef.value.validate()
  adjustAddLoading.value = true
  try {
    const selectedPo = adjustPoOptions.value.find((item) => item.poId === adjustAddForm.poId)
    await addInventoryAdjust({
      sku: adjustAddForm.sku.trim(),
      poId: adjustAddForm.poId,
      po: String(adjustAddForm.type) === '1' ? selectedPo?.po : undefined,
      packageTaskId: adjustAddForm.packingTaskId,
      packageTaskCount:
        adjustAddForm.currentTaskCount == null || adjustAddForm.currentTaskCount === ''
          ? undefined
          : Number(adjustAddForm.currentTaskCount),
      shipmentId: adjustAddForm.shipmentId.trim() || undefined,
      boxNumber: adjustAddForm.boxNumber.trim() || undefined,
      count: Number(adjustAddForm.count),
      price: Number(adjustAddForm.price),
      type: adjustAddForm.type!,
      remark: adjustAddForm.remark.trim() || undefined,
    })
    $baseMessage('新增成功', 'success', 'hey')
    adjustAddVisible.value = false
  } finally {
    adjustAddLoading.value = false
  }
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  resetRowEditForm()
  fetchList()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  resetRowEditForm()
  fetchList()
}

const openMarginDialog = async () => {
  if (!marginLoading.value) await fetchMargin()
  syncMarginForm()
  await nextTick()
  marginFormRef.value?.clearValidate()
  marginVisible.value = true
}

const handleMarginDialogClose = () => {
  syncMarginForm()
  marginFormRef.value?.clearValidate()
}

const handleSaveMargin = async () => {
  if (!marginFormRef.value) return

  await marginFormRef.value.validate()
  marginSaving.value = true
  try {
    await updateInventoryCountMargin({
      count: Number(marginForm.count),
      proportion: Number(marginForm.proportion),
    })
    $baseMessage('余量设定修改成功', 'success', 'hey')
    await fetchMargin()
    marginVisible.value = false
  } finally {
    marginSaving.value = false
  }
}

const fetchViewList = async () => {
  viewLoading.value = true
  try {
    const response = await getInventoryCountDetail({
      sku: viewQuery.sku,
      keyWord: viewQuery.keyWord,
      pageNo: viewQuery.pageNo,
      pageSize: viewQuery.pageSize,
    })
    viewList.value = pickArray<InventoryCountDetailItem>(response)
    viewTotal.value = pickTotal(response)
  } catch {
    viewList.value = []
    viewTotal.value = 0
  } finally {
    viewLoading.value = false
  }
}

const handleView = (row: InventoryCountTableRow) => {
  viewQuery.sku = row.sku || ''
  viewQuery.keyWord = ''
  viewQuery.pageNo = 1
  viewQuery.pageSize = 20
  viewVisible.value = true
  fetchViewList()
}

const handleViewDialogClose = () => {
  viewQuery.sku = ''
  viewQuery.keyWord = ''
  viewQuery.pageNo = 1
  viewQuery.pageSize = 20
  viewList.value = []
  viewTotal.value = 0
}

const handleViewQuery = () => {
  viewQuery.pageNo = 1
  fetchViewList()
}

const handleViewCurrentChange = (value: number) => {
  viewQuery.pageNo = value
  fetchViewList()
}

const handleViewSizeChange = (value: number) => {
  viewQuery.pageSize = value
  viewQuery.pageNo = 1
  fetchViewList()
}

const handleAdd = () => {
  if (addLoading.value) return
  $baseConfirm('确认根据当前规则生成库存盘点数据吗？', null, async () => {
    addLoading.value = true
    try {
      await addInventoryCount()
      $baseMessage('新增盘点成功', 'success', 'hey')
      queryForm.pageNo = 1
      resetRowEditForm()
      await fetchList()
    } finally {
      addLoading.value = false
    }
  })
}

const handleCancel = () => {
  if (!hasListData.value || cancelLoading.value) return
  $baseConfirm('确认取消当前盘点吗？取消后进行中数据将被清空。', null, async () => {
    cancelLoading.value = true
    try {
      await cancelInventoryCount()
      $baseMessage('取消盘点成功', 'success', 'hey')
      resetRowEditForm()
      await fetchList()
    } finally {
      cancelLoading.value = false
    }
  })
}

const handleFinish = () => {
  if (!hasListData.value || finishLoading.value) return
  $baseConfirm('确认完成当前盘点吗？完成后数据将归档到历史表。', null, async () => {
    finishLoading.value = true
    try {
      await finishInventoryCount()
      $baseMessage('盘点完成成功', 'success', 'hey')
      resetRowEditForm()
      await fetchList()
    } finally {
      finishLoading.value = false
    }
  })
}

const handleStartEdit = async (row: InventoryCountTableRow) => {
  if (rowSavingId.value) return
  const targetRow = getGroupLeadRow(row)
  editingRowId.value = targetRow.id
  rowEditForm.id = targetRow.id
  rowEditForm.noEncasementCount = normalizeNumberValue(targetRow.noEncasementCount)
  rowEditForm.remark = targetRow.remark ?? ''

  await nextTick()
  const inputEl = noEncasementInputRef.value?.$el?.querySelector('input') as HTMLInputElement | undefined
  inputEl?.focus()
  inputEl?.select()
}

const handleCancelEdit = () => {
  if (rowSavingId.value) return
  resetRowEditForm()
}

const validateRowEditForm = () => {
  if (
    rowEditForm.noEncasementCount === undefined ||
    rowEditForm.noEncasementCount === null ||
    Number.isNaN(Number(rowEditForm.noEncasementCount))
  ) {
    $baseMessage('未装箱数量不能为空', 'warning', 'hey')
    return false
  }
  if (Number(rowEditForm.noEncasementCount) < 0) {
    $baseMessage('未装箱数量不能小于0', 'warning', 'hey')
    return false
  }
  if (!Number.isInteger(Number(rowEditForm.noEncasementCount))) {
    $baseMessage('未装箱数量必须为整数', 'warning', 'hey')
    return false
  }
  if ((rowEditForm.remark ?? '').length > 500) {
    $baseMessage('盘点备注长度不能超过500', 'warning', 'hey')
    return false
  }
  return true
}

const openRemarkDialog = async (row: InventoryCountTableRow) => {
  if (rowSavingId.value) return
  const targetRow = getGroupLeadRow(row)
  remarkDialogForm.id = targetRow.id
  remarkDialogForm.remark = targetRow.remark ?? ''
  remarkDialogForm.noEncasementCount = normalizeNumberValue(targetRow.noEncasementCount)
  remarkDialogVisible.value = true
  await nextTick()
  remarkTextareaRef.value?.focus()
}

const handleRemarkDialogClose = () => {
  remarkDialogForm.id = ''
  remarkDialogForm.remark = ''
  remarkDialogForm.noEncasementCount = undefined
}

const handleSaveRemark = async () => {
  if (remarkSaving.value) return

  if (remarkDialogForm.remark.length > 500) {
    $baseMessage('盘点备注长度不能超过500', 'warning', 'hey')
    return
  }

  remarkSaving.value = true
  try {
    await updateInventoryCountRow({
      id: remarkDialogForm.id,
      noEncasementCount: remarkDialogForm.noEncasementCount ?? 0,
      remark: remarkDialogForm.remark.trim() || undefined,
    })
    $baseMessage('保存成功', 'success', 'hey')
    remarkDialogVisible.value = false
    await fetchList()
  } finally {
    remarkSaving.value = false
  }
}

const handleSaveRow = async () => {
  if (!editingRowId.value || rowSavingId.value) return

  const noEncasementCount = rowEditForm.noEncasementCount
  const hasValue = noEncasementCount !== undefined && noEncasementCount !== null && !Number.isNaN(Number(noEncasementCount))

  if (!hasValue) {
    resetRowEditForm()
    return
  }

  if (!validateRowEditForm()) return

  rowSavingId.value = rowEditForm.id
  try {
    await updateInventoryCountRow({
      id: rowEditForm.id,
      noEncasementCount: Number(rowEditForm.noEncasementCount),
      remark: rowEditForm.remark.trim() || undefined,
    })
    $baseMessage('保存成功', 'success', 'hey')
    await fetchList()
    resetRowEditForm()
  } finally {
    rowSavingId.value = ''
  }
}

const COLUMN_META: Record<string, { align?: string; showOverflowTooltip?: boolean }> = {
  skuImg: { align: 'center' },
  sku: { showOverflowTooltip: true },
  productName: { showOverflowTooltip: true },
  po: { showOverflowTooltip: true },
  orderDate: { align: 'center' },
  actualCount: { align: 'right' },
  taskCount: { align: 'right' },
  afterCount: { align: 'right' },
  encasementCount: { align: 'right' },
  totalTaskCount: { align: 'right' },
  totalAfterCount: { align: 'right' },
  lackCount: { align: 'right' },
  notYetArrived: { align: 'right' },
  totalOrderCount: { align: 'right' },
  totalSendCount: { align: 'right' },
  adjustCount: { align: 'right' },
  adjustedOrderCount: { align: 'right' },
  orderDiffCount: { align: 'right' },
  anomalyCount: { align: 'right' },
  totalReceiveCount: { align: 'right' },
  noEncasementCount: { align: 'center' },
  remark: { showOverflowTooltip: true },
  createTime: { align: 'center' },
}

const handleWidth = (col: any) => col.minWidth

const columns = ref<any>([])
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 21 })
  columns.value = data
  columns.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (
      [
        'encasementCount',
        'totalTaskCount',
        'totalOrderCount',
        'totalAfterCount',
        'lackCount',
        'notYetArrived',
        'totalReceiveCount',
        'adjustCount',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
    if (['skuImg', 'sku', 'productName'].includes(item.prop)) {
      item.isFixed = true
    }
    const meta = COLUMN_META[item.prop]
    if (meta?.align) item.align = meta.align
    if (meta?.showOverflowTooltip) item.showOverflowTooltip = meta.showOverflowTooltip
  })
}

// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
onMounted(async () => {
  await Promise.allSettled([fetchColumn(), fetchMargin(), fetchList()])
})

watch(
  () => [adjustAddVisible.value, adjustAddForm.poId, adjustAddForm.count] as const,
  ([visible]) => {
    if (!visible) return
    handleCalculateAdjustPrice()
  }
)

watch(
  () => adjustAddForm.type,
  (value) => {
    if (!adjustAddVisible.value) return
    resetAdjustAddFormByType(value)
    if (String(value) === '1') adjustAddForm.allPo = true
    if (String(value) === '1') {
      adjustPackingTaskOptions.value = []
      adjustAddForm.packingTaskId = undefined
      adjustAddForm.currentTaskCount = undefined
    } else if (adjustAddVisible.value) {
      fetchAdjustPackingTaskOptions()
    }
  }
)

watch(
  () => adjustAddForm.allPo,
  () => {
    if (!adjustAddVisible.value || !adjustAddForm.sku.trim()) return
    fetchAdjustPoOptions(adjustPoKeyword.value)
  }
)

watch(
  () => adjustAddForm.poId,
  () => {
    if (!adjustAddVisible.value) return
    fetchAdjustPackingTaskOptions()
  }
)

watch(
  () => adjustAddForm.packingTaskId,
  (value) => {
    const currentTask = adjustPackingTaskOptions.value.find((item) => item.packageTaskId === value)
    adjustAddForm.currentTaskCount = currentTask?.packageTaskCount ?? undefined
  }
)
</script>

<style lang="scss" scoped>
.text-red {
  color: var(--el-color-danger);
}

.text-green {
  color: var(--el-color-success);
}

.inventory-count-page {
  :deep(.el-table .el-table__header th .cell) {
    white-space: normal;
    word-break: break-all;
    line-height: 1.3;
  }

  :deep(.el-table .el-table__header th .caret-wrapper) {
    margin-left: 2px;
  }

  .table-header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .sku-image-cell {
    width: 56px;
    height: 56px;
    border: 1px solid #dfe6ee;
    border-radius: 8px;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;

    .el-image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .sku-copy-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .dialog-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 16px;
  }

  .dialog-grid-span-2 {
    grid-column: 1 / -1;
  }

  .sku-image-preview {
    width: 100%;
    height: 84px;
    border: 1px solid #d8dee9;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .packing-task-label {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  .packing-task-tip {
    color: var(--el-text-color-secondary);
    font-size: 16px;
    cursor: help;
  }

  .editable-text {
    display: inline-block;
    min-width: 80px;
    cursor: pointer;
    color: var(--el-color-primary);
  }

  .copyable-text {
    cursor: pointer;
    color: var(--el-color-primary);

    &:hover {
      text-decoration: underline;
    }
  }

  .editable-text--left {
    width: 100%;
    color: inherit;
  }

  .margin-dialog-form {
    padding-top: 8px;
  }

  .margin-dialog-form :deep(.el-form-item__content) {
    justify-content: flex-start;
  }

  .margin-dialog-form :deep(.el-input-number) {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .inventory-count-page {
    .dialog-grid {
      grid-template-columns: 1fr;
    }

    .dialog-grid-span-2 {
      grid-column: auto;
    }
  }
}
</style>

<style lang="scss">
.inventory-count-image-viewer {
  .el-image-viewer__mask {
    background: rgba(15, 23, 42, 0.86);
  }

  .el-image-viewer__wrapper {
    overflow: hidden;
  }

  .el-image-viewer__canvas {
    padding: 32px;
    box-sizing: border-box;
  }

  .el-image-viewer__img {
    max-width: min(88vw, 1440px);
    max-height: 88vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  }
}
.handle {
  cursor: grab;
}
.disabled-handle {
  cursor: not-allowed;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
</style>
