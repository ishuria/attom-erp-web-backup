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
        <div class="query-actions-row">
          <el-form inline :model="queryForm" @submit.prevent>
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
              <el-button :icon="RefreshRight" :disabled="listLoading" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="rowKey"
      :span-method="tableSpanMethod"
    >
      <el-table-column align="center" label="SKU图片" min-width="100" prop="skuImg">
        <template #default="{ row }">
          <div class="sku-image-cell">
            <el-image
              v-if="row.skuImg"
              :preview-src-list="[row.skuImg]"
              :preview-teleported="true"
              :src="row.skuImg"
              fit="cover"
              preview-class-name="inventory-count-image-viewer"
              @click.stop
            />
            <span v-else>-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="180" prop="sku" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="sku-copy-cell">
            <span>{{ row.sku || '-' }}</span>
            <el-button v-if="row.sku" :icon="CopyDocument" link type="primary" @click.stop="handleClip(row.sku)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="220" prop="productName" show-overflow-tooltip />
      <el-table-column label="PO" min-width="140" prop="po" show-overflow-tooltip />
      <el-table-column align="center" label="订货日期" min-width="160" prop="orderDate">
        <template #default="{ row }">
          {{ formatDisplayDateTime(row.orderDate) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="实际完成数" min-width="110" prop="actualCount">
        <template #default="{ row }">
          {{ formatNumber(row.actualCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="打包任务数" min-width="110" prop="taskCount">
        <template #default="{ row }">
          {{ formatNumber(row.taskCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="待售后数量(坏+缺)" min-width="120" prop="afterCount">
        <template #default="{ row }">
          {{ formatNumber(row.afterCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总装箱数量" min-width="110" prop="encasementCount">
        <template #default="{ row }">
          {{ formatNumber(row.encasementCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总售后数" min-width="110" prop="totalAfterCount">
        <template #default="{ row }">
          {{ formatNumber(getTotalAfterCount(row)) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="缺数" min-width="100" prop="lackCount">
        <template #default="{ row }">
          {{ formatNumber(row.lackCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总订货数" min-width="110" prop="totalOrderCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalOrderCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="未到货数" min-width="110" prop="notYetArrived">
        <template #default="{ row }">
          {{ formatNumber(row.notYetArrived) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总发货数" min-width="110" prop="totalSendCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalSendCount) }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="计算" min-width="110" prop="totalSendCount">
        <template #default="{ row }">
          {{ row.totalOrderCount - row.totalSendCount - row.notYetArrived }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总接收数" min-width="110" prop="totalReceiveCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalReceiveCount) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="未装箱数量" min-width="160" prop="noEncasementCount">
        <template #default="{ row }">
          <el-input-number
            v-if="isEditingRow(row.id)"
            v-model="rowEditForm.noEncasementCount"
            :controls="false"
            :min="0"
            :precision="0"
            style="width: 120px"
          />
          <span v-else class="editable-text" @click="handleStartEdit(row)">{{ formatNumber(row.noEncasementCount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点备注" min-width="220" prop="remark" show-overflow-tooltip>
        <template #default="{ row }">
          <el-input
            v-if="isEditingRow(row.id)"
            v-model.trim="rowEditForm.remark"
            maxlength="500"
            placeholder="请输入盘点备注"
            show-word-limit
          />
          <span v-else class="editable-text editable-text--left" @click="handleStartEdit(row)">{{ row.remark || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="160" prop="createTime">
        <template #default="{ row }">
          {{ formatDisplayDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="160" prop="operation">
        <template #default="{ row }">
          <template v-if="isEditingRow(row.id)">
            <el-button :loading="rowSavingId === row.id" text type="primary" @click="handleSaveRow">保存</el-button>
            <el-button :disabled="rowSavingId === row.id" text @click="handleCancelEdit">取消</el-button>
          </template>
          <el-button v-else text type="primary" @click="handleStartEdit(row)">编辑</el-button>
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
        :model="adjustAddForm"
        :rules="adjustAddRules"
        label-position="right"
        label-width="96px"
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
              placeholder="请输入 SKU"
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
                remote
                :loading="adjustPoLoading"
                :remote-method="handleAdjustSearchPo"
                placeholder="请输入 PO 搜索"
                style="width: 80%"
              >
                <el-option v-for="item in adjustPoOptions" :key="item.poId" :label="item.po" :value="item.poId" />
              </el-select>
              <el-checkbox v-model="adjustAddForm.allPo" style="padding-left: 10px">全部 PO</el-checkbox>
            </template>
          </el-form-item>
          <el-form-item label="产品信息">
            <el-input :model-value="adjustAddForm.productDesc" disabled />
          </el-form-item>
          <el-form-item label="SKU 图片">
            <div class="sku-image-preview">
              <el-image v-if="adjustAddForm.skuImg" :preview-src-list="[adjustAddForm.skuImg]" :src="adjustAddForm.skuImg" fit="cover" />
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
            <el-input :model-value="adjustAddForm.currentTaskCount" disabled />
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
              :rows="4"
              placeholder="请输入备注"
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
        :model="marginForm"
        :rules="marginRules"
        label-position="right"
        label-width="110px"
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
  getInventoryCountList,
  getInventoryCountMargin,
  updateInventoryCountMargin,
  updateInventoryCountRow,
} from '/@/api/devlocal/inventoryCount'
import { $baseConfirm, $baseMessage } from '/@/hooks'
import InventoryPermission from '/@/permissions/inventory'
import type {
  InventoryAdjustAddForm,
  InventoryAdjustPackingTaskOption,
  InventoryAdjustPoOption,
} from '/@/type/inventory/adjust'
import type {
  InventoryCountItem,
  InventoryCountMargin,
  InventoryCountPackageTaskItem,
  InventoryCountQuery,
  InventoryCountRowEditForm,
} from '/@/type/inventory/count'
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
const rowSavingId = ref<number | string>('')
const rowEditForm = reactive<InventoryCountRowEditForm>(createDefaultRowEditForm())

const hasListData = computed(() => list.value.length > 0)
const mergeColumnProps = new Set([
  'skuImg',
  'sku',
  'productName',
  'totalOrderCount',
  'notYetArrived',
  'encasementCount',
  'totalAfterCount',
  'lackCount',
  'totalSendCount',
  'totalReceiveCount',
  'noEncasementCount',
  'remark',
  'createTime',
  'operation',
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

const getTotalAfterCount = (row: InventoryCountItem) => {
  const packageTaskList = getPackageTaskList(row)
  if (!packageTaskList.length) return row.afterCount

  const totalAfterCount = packageTaskList.reduce((sum, item) => sum + Number(item.afterCount || 0), 0)
  return totalAfterCount
}

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
        adjustAddForm.currentTaskCount == null || adjustAddForm.currentTaskCount === '' ? undefined : Number(adjustAddForm.currentTaskCount),
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

const handleStartEdit = (row: InventoryCountTableRow) => {
  if (rowSavingId.value) return
  const targetRow = getGroupLeadRow(row)
  editingRowId.value = targetRow.id
  rowEditForm.id = targetRow.id
  rowEditForm.noEncasementCount = normalizeNumberValue(targetRow.noEncasementCount)
  rowEditForm.remark = targetRow.remark ?? ''
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

const handleSaveRow = async () => {
  if (!editingRowId.value || rowSavingId.value || !validateRowEditForm()) return

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

onMounted(async () => {
  await Promise.allSettled([fetchMargin(), fetchList()])
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
.inventory-count-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .page-header__title {
    color: var(--el-text-color-primary);
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
  }

  .page-header__subtitle {
    margin-top: 6px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .overview-panel {
    border: 1px solid #e5e9f2;
    border-radius: 14px;
    background: linear-gradient(135deg, #f7f9fc 0%, #ffffff 100%);
    padding: 18px 20px;
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .overview-panel__content {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .table-header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .margin-card {
    min-width: 160px;
    border-radius: 12px;
    background: #fff;
    padding: 14px 16px;
    box-shadow: 0 8px 20px rgba(31, 35, 41, 0.05);
  }

  .margin-card__label {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .margin-card__value {
    margin-top: 8px;
    color: #0f172a;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .query-actions-row {
    display: flex;
    gap: 16px;
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
    .overview-panel {
      align-items: stretch;
    }

    .overview-panel__actions {
      width: 100%;
    }

    .margin-card {
      flex: 1 1 100%;
    }

    .query-actions-row {
      align-items: stretch;
    }

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
</style>
