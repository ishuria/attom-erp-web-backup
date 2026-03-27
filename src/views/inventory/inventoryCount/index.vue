<template>
  <div class="comprehensive-table-container auto-height-container inventory-count-page">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <div class="table-header-actions">
          <el-button :loading="addLoading" type="primary" @click="handleAdd">开始库存盘点</el-button>
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
      <el-table-column label="SKU" min-width="140" prop="sku" show-overflow-tooltip />
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
      <el-table-column align="right" label="总发货数" min-width="110" prop="totalSendCount">
        <template #default="{ row }">
          {{ formatNumber(row.totalSendCount) }}
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
import { RefreshRight, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
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
  InventoryCountItem,
  InventoryCountMargin,
  InventoryCountPackageTaskItem,
  InventoryCountQuery,
  InventoryCountRowEditForm,
} from '/@/type/inventory/count'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'InventoryCount',
})

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

const marginRules = reactive<FormRules<InventoryCountMargin>>({
  count: [{ trigger: 'blur', validator: validateInteger }],
  proportion: [{ trigger: 'blur', validator: validateProportion }],
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
