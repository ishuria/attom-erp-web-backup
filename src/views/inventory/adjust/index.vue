<template>
  <div class="comprehensive-table-container auto-height-container inventory-adjust-page">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <div class="header-actions">
          <!--          <el-button :icon="Plus" type="primary" @click="openAddDialog">新增库存调整</el-button>-->
          <!--          <el-button :loading="marginLoading" type="primary" @click="openMarginDialog">余量设定</el-button>-->
        </div>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <div class="query-actions-row">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-date-picker
                v-model="queryForm.dateRange"
                :clearable="true"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" row-key="id">
      <el-table-column align="center" label="调整日期" min-width="120">
        <template #default="{ row }">
          {{ formatDisplayDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="PO" min-width="120" prop="po" show-overflow-tooltip />
      <el-table-column label="SKU" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="sku-column-cell">
            <div>{{ row.sku || '-' }}</div>
            <div v-if="row.productModel" class="sku-column-subtext">{{ row.productModel }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="调整数量" min-width="100">
        <template #default="{ row }">
          {{ formatNumber(row.count) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="调整价格" min-width="130">
        <template #default="{ row }">
          {{ formatCurrency(row.price) }}
        </template>
      </el-table-column>
      <el-table-column label="被调整到打包任务ID" min-width="180" prop="packageTaskId" show-overflow-tooltip />
      <el-table-column align="center" label="调整之前的数量" min-width="130">
        <template #default="{ row }">
          {{ formatNumber(row.packageTaskCount) }}
        </template>
      </el-table-column>
      <el-table-column label="Shipment ID" min-width="140" prop="shipmentId" show-overflow-tooltip />
      <el-table-column label="箱号" min-width="120" prop="boxNumber" show-overflow-tooltip />
      <el-table-column label="备注" min-width="200" prop="remark" show-overflow-tooltip />
      <el-table-column label="创建人" min-width="120" prop="createUserName" show-overflow-tooltip />
      <el-table-column align="center" label="创建时间" min-width="160">
        <template #default="{ row }">
          {{ formatDisplayDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getRedFlushTagType(row.type)">
            {{ getRedFlushLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="110">
        <template #default="{ row }">
          <el-button text type="primary" @click="openDetailDialog(row)">查看明细</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <vab-dialog v-model="addVisible" title="新增库存调整" width="760px" @close="handleAddDialogClose">
      <el-form
        ref="addFormRef"
        v-loading="skuInfoLoading || addLoading || priceCalcLoading || packingTaskLoading"
        class="dialog-form"
        label-position="right"
        label-width="96px"
        :model="addForm"
        :rules="addRules"
      >
        <div class="dialog-grid">
          <el-form-item label="类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择调整类型" style="width: 100%">
              <el-option v-for="item in redFlushOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="dialog-grid-span-2" label="SKU" prop="sku">
            <el-input
              v-model.trim="addForm.sku"
              clearable
              placeholder="请输入 SKU"
              @blur="handleSearchSku"
              @keyup.enter="handleSearchSku"
            />
          </el-form-item>
          <el-form-item label="PO" prop="poId">
            <template #default>
              <el-select
                v-model="addForm.poId"
                clearable
                filterable
                :loading="poLoading"
                placeholder="请输入 PO 搜索"
                remote
                :remote-method="handleSearchPo"
                style="width: 80%"
              >
                <el-option v-for="item in poOptions" :key="item.poId" :label="item.po" :value="item.poId" />
              </el-select>
              <el-checkbox v-model="addForm.allPo" style="padding-left: 10px">全部 PO</el-checkbox>
            </template>
          </el-form-item>
          <el-form-item label="产品信息">
            <el-input disabled :model-value="addForm.productDesc" />
          </el-form-item>
          <el-form-item label="SKU 图片">
            <div class="sku-image-preview">
              <el-image v-if="addForm.skuImg" fit="cover" :preview-src-list="[addForm.skuImg]" :src="addForm.skuImg" />
            </div>
          </el-form-item>
          <el-form-item v-if="showPackingTaskFields" prop="packingTaskId">
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
              v-model="addForm.packingTaskId"
              clearable
              filterable
              :loading="packingTaskLoading"
              placeholder="请选择打包任务"
              style="width: 100%"
            >
              <el-option v-for="item in packingTaskOptions" :key="item.packageTaskId" :label="item.value" :value="item.packageTaskId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showPackingTaskFields" label="打包任务数" prop="currentTaskCount">
            <el-input disabled :model-value="addForm.currentTaskCount" />
          </el-form-item>
          <el-form-item label="货件编号">
            <el-input v-model.trim="addForm.shipmentId" clearable placeholder="请输入货件编号" />
          </el-form-item>
          <el-form-item label="箱号">
            <el-input v-model.trim="addForm.boxNumber" clearable placeholder="请输入箱号" />
          </el-form-item>

          <el-form-item label="调整数量" prop="count">
            <el-input-number v-model="addForm.count" :precision="2" :step="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="调整价格" prop="price">
            <el-input-number v-model="addForm.price" disabled :precision="2" :step="1" style="width: 100%" />
          </el-form-item>
          <el-form-item class="dialog-grid-span-2" label="备注">
            <el-input v-model.trim="addForm.remark" :maxlength="500" placeholder="请输入备注" :rows="4" show-word-limit type="textarea" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button :loading="addLoading" type="primary" @click="handleSubmitAdd">确认新增</el-button>
      </template>
    </vab-dialog>

    <vab-dialog v-model="detailVisible" title="库存调整明细" width="900px" @close="handleDetailDialogClose">
      <el-table v-loading="detailLoading" border :data="detailList" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column align="center" label="好的数量" min-width="110">
          <template #default="{ row }">
            {{ formatNumber(row.goodCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="坏的数量" min-width="110">
          <template #default="{ row }">
            {{ formatNumber(row.badCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="缺的数量" min-width="110">
          <template #default="{ row }">
            {{ formatNumber(row.lackCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="多的数量" min-width="110">
          <template #default="{ row }">
            {{ formatNumber(row.manyCount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="留样数" min-width="100">
          <template #default="{ row }">
            {{ formatNumber(row.keepSampleCount) }}
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="120" prop="type" show-overflow-tooltip />
        <el-table-column label="备注" min-width="220" prop="remark" show-overflow-tooltip />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无质检历史数据" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="detailQuery.pageNo"
        :page-size="detailQuery.pageSize"
        :total="detailTotal"
        @current-change="handleDetailCurrentChange"
        @size-change="handleDetailSizeChange"
      />
    </vab-dialog>

    <vab-dialog v-model="marginVisible" title="余量设定" width="420px" @close="handleMarginDialogClose">
      <el-form label-position="top" :model="marginForm">
        <el-form-item label="余量设定">
          <el-input-number v-model="marginForm.margin" :precision="0" :step="1" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="marginVisible = false">取消</el-button>
        <el-button :loading="marginSaving" type="primary" @click="handleSaveMargin">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, RefreshRight, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  addInventoryAdjust,
  getInventoryAdjustDetail,
  getInventoryAdjustList,
  getInventoryAdjustMargin,
  getInventoryAdjustPackingTaskList,
  getInventoryAdjustPoList,
  getInventoryAdjustPrice,
  getInventoryAdjustSkuInfo,
  updateInventoryAdjustMargin,
} from '/@/api/devlocal/inventoryAdjustment'
import { $baseMessage } from '/@/hooks'
import type {
  InventoryAdjustAddForm,
  InventoryAdjustDetailItem,
  InventoryAdjustItem,
  InventoryAdjustPackingTaskOption,
  InventoryAdjustPoOption,
  InventoryAdjustQuery,
} from '/@/type/inventory/adjust'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'

defineOptions({
  name: 'Adjust',
})

const redFlushOptions = [
  { label: '正常调整', value: 0 },
  { label: '发布打包任务', value: 1 },
]

const createDefaultQueryForm = (): InventoryAdjustQuery => ({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  dateRange: getDefaultStringTime(),
})

const createDefaultAddForm = (): InventoryAdjustAddForm => ({
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

const queryForm = reactive<InventoryAdjustQuery>(createDefaultQueryForm())
const list = ref<InventoryAdjustItem[]>([])
const total = ref(0)
const listLoading = ref(false)

const currentMargin = ref<number | null>(null)
const marginVisible = ref(false)
const marginForm = reactive<{ margin?: number }>({
  margin: undefined,
})
const marginLoading = ref(false)
const marginSaving = ref(false)

const addVisible = ref(false)
const addLoading = ref(false)
const skuInfoLoading = ref(false)
const priceCalcLoading = ref(false)
const poLoading = ref(false)
const packingTaskLoading = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive<InventoryAdjustAddForm>(createDefaultAddForm())
const poOptions = ref<InventoryAdjustPoOption[]>([])
const packingTaskOptions = ref<InventoryAdjustPackingTaskOption[]>([])
const poKeyword = ref('')
const showPackingTaskFields = computed(() => String(addForm.type ?? '0') === '0')

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailList = ref<InventoryAdjustDetailItem[]>([])
const detailTotal = ref(0)
const detailQuery = reactive({
  id: '' as number | string,
  pageNo: 1,
  pageSize: 20,
})

const validateAdjustQuantity = (_rule: any, value: number | undefined, callback: (error?: Error) => void) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    callback(new Error('请输入调整数量'))
    return
  }
  callback()
}

const addRules = reactive<FormRules<InventoryAdjustAddForm>>({
  sku: [{ required: true, trigger: 'blur', message: '请输入 SKU' }],
  poId: [{ required: true, trigger: 'change', message: '请选择 PO' }],
  count: [{ trigger: 'blur', validator: validateAdjustQuantity }],
})

const taxInclusiveTotalPricePreview = computed(() => {
  const count = Number(addForm.count ?? 0)
  const price = Number(addForm.price ?? 0)
  if (!count || !price) return '-'
  return (count * price).toFixed(2)
})

const shouldCalculateAdjustPrice = computed(() => {
  if (!addForm.sku.trim()) return false
  if (addForm.poId === undefined || addForm.poId === null || addForm.poId === '') return false
  const count = Number(addForm.count)
  if (addForm.count === undefined || addForm.count === null || Number.isNaN(count)) return false
  return count !== 0
})

const normalizeMarginValue = (value: unknown) => {
  if (value == null || value === '') return null
  const normalizedValue = Number(value)
  return Number.isNaN(normalizedValue) ? null : normalizedValue
}

const getListParams = () => {
  const [startDate, endDate] = queryForm.dateRange?.length === 2 ? queryForm.dateRange : ['', '']
  return {
    keyWord: queryForm.keyWord,
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }
}

const formatDisplayDate = (value?: string) => {
  if (!value) return '-'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
  return formatDate(parsedDate, 'yyyy-MM-dd')
}

const formatDisplayDateTime = (value?: string) => {
  if (!value) return '-'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
  return formatDate(parsedDate, 'yyyy-MM-dd hh:mm:ss')
}

const formatNumber = (value?: number) => {
  if (value == null) return '-'
  return Number.isInteger(Number(value)) ? String(value) : Number(value).toFixed(2)
}

const formatCurrency = (value?: number) => {
  if (value == null) return '-'
  return Number(value).toFixed(2)
}

const getRedFlushLabel = (value?: number | string) => (String(value) === '1' ? '发布打包任务' : '正常调整')
const getRedFlushTagType = (value?: number | string) => (String(value) === '1' ? 'danger' : 'info')

const fetchList = async () => {
  listLoading.value = true
  try {
    const response = await getInventoryAdjustList(getListParams())
    list.value = pickArray<InventoryAdjustItem>(response)
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
    const response = await getInventoryAdjustMargin()
    const payload = pickObject<{ margin?: number }>(response)
    const normalizedMargin = normalizeMarginValue(payload.margin)
    currentMargin.value = normalizedMargin
    marginForm.margin = normalizedMargin ?? undefined
  } catch {
    currentMargin.value = null
    marginForm.margin = undefined
  } finally {
    marginLoading.value = false
  }
}

const openMarginDialog = async () => {
  if (!marginLoading.value) await fetchMargin()
  await nextTick()
  marginForm.margin = currentMargin.value ?? undefined
  marginVisible.value = true
}

const handleMarginDialogClose = () => {
  marginForm.margin = currentMargin.value ?? undefined
}

const fetchDetailList = async () => {
  if (!detailQuery.id) return
  detailLoading.value = true
  try {
    const response = await getInventoryAdjustDetail({
      id: detailQuery.id,
      pageNo: detailQuery.pageNo,
      pageSize: detailQuery.pageSize,
    })
    detailList.value = pickArray<InventoryAdjustDetailItem>(response)
    detailTotal.value = pickTotal(response)
  } catch {
    detailList.value = []
    detailTotal.value = 0
  } finally {
    detailLoading.value = false
  }
}

const handleQuery = () => {
  queryForm.pageNo = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(queryForm, createDefaultQueryForm())
  fetchList()
}

const handleDateChange = () => {
  queryForm.pageNo = 1
  fetchList()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchList()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchList()
}

const resetAddFormByType = (type: number | string | undefined) => {
  Object.assign(addForm, createDefaultAddForm(), {
    type: type ?? 0,
  })
  poKeyword.value = ''
  poOptions.value = []
  packingTaskOptions.value = []
  addFormRef.value?.clearValidate()
}

const resetAddForm = () => {
  resetAddFormByType(createDefaultAddForm().type)
}

const openAddDialog = () => {
  resetAddForm()
  addVisible.value = true
}

const handleAddDialogClose = () => {
  resetAddForm()
}

const fetchPoOptions = async (po = '') => {
  const sku = addForm.sku.trim()
  if (!sku) {
    poOptions.value = []
    addForm.poId = undefined
    return
  }

  poLoading.value = true
  try {
    const poListResponse = await getInventoryAdjustPoList({
      sku,
      po: po || undefined,
      allPo: addForm.allPo,
    })
    poOptions.value = pickArray<InventoryAdjustPoOption>(poListResponse)
    const currentPoExists = poOptions.value.some((item) => item.poId === addForm.poId)
    if (!currentPoExists) addForm.poId = undefined
  } catch {
    poOptions.value = []
    addForm.poId = undefined
  } finally {
    poLoading.value = false
  }
}

const handleSearchPo = (value: string) => {
  poKeyword.value = value.trim()
  fetchPoOptions(poKeyword.value)
}

const fetchPackingTaskOptions = async () => {
  const sku = addForm.sku.trim()
  if (!showPackingTaskFields.value || !sku || addForm.poId == null || addForm.poId === '') {
    packingTaskOptions.value = []
    addForm.packingTaskId = undefined
    addForm.currentTaskCount = undefined
    return
  }

  packingTaskLoading.value = true
  try {
    const response = await getInventoryAdjustPackingTaskList({
      poId: addForm.poId,
      sku,
    })
    packingTaskOptions.value = pickArray<InventoryAdjustPackingTaskOption>(response)
    const currentTask = packingTaskOptions.value.find((item) => item.packageTaskId === addForm.packingTaskId)
    if (currentTask) addForm.currentTaskCount = currentTask.packageTaskCount ?? undefined
    else {
      addForm.packingTaskId = undefined
      addForm.currentTaskCount = undefined
    }
  } catch {
    packingTaskOptions.value = []
    addForm.packingTaskId = undefined
    addForm.currentTaskCount = undefined
  } finally {
    packingTaskLoading.value = false
  }
}

const handleSearchSku = async () => {
  const sku = addForm.sku.trim()
  if (!sku) return

  skuInfoLoading.value = true
  try {
    const skuInfoResponse = await getInventoryAdjustSkuInfo(sku)
    const skuInfo = pickObject<{ productDesc?: string; skuImg?: string }>(skuInfoResponse)
    addForm.productDesc = skuInfo.productDesc ?? ''
    addForm.skuImg = skuInfo.skuImg ?? ''
    await fetchPoOptions(poKeyword.value)

    if (!skuInfo.productDesc && !skuInfo.skuImg && poOptions.value.length === 0) {
      $baseMessage('未查询到对应 SKU 信息', 'warning', 'hey')
    }
  } catch {
    addForm.productDesc = ''
    addForm.skuImg = ''
    addForm.poId = undefined
    poOptions.value = []
    packingTaskOptions.value = []
    addForm.packingTaskId = undefined
    addForm.currentTaskCount = undefined
  } finally {
    skuInfoLoading.value = false
  }
}

const handleCalculateAdjustPrice = async () => {
  if (!shouldCalculateAdjustPrice.value) {
    addForm.price = undefined
    return
  }

  priceCalcLoading.value = true
  try {
    const response = await getInventoryAdjustPrice({
      sku: addForm.sku.trim(),
      poId: addForm.poId!,
      count: Number(addForm.count),
    })
    const price = pickObject<number>(response)
    const normalizedPrice = Number(price)
    addForm.price = Number.isNaN(normalizedPrice) ? undefined : Number(normalizedPrice.toFixed(2))
  } catch {
    addForm.price = undefined
  } finally {
    priceCalcLoading.value = false
  }
}

const handleSubmitAdd = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate()
  addLoading.value = true
  try {
    const selectedPo = poOptions.value.find((item) => item.poId === addForm.poId)
    await addInventoryAdjust({
      sku: addForm.sku.trim(),
      poId: addForm.poId,
      po: String(addForm.type) === '1' ? selectedPo?.po : undefined,
      packageTaskId: addForm.packingTaskId,
      packageTaskCount: addForm.currentTaskCount == null || addForm.currentTaskCount === '' ? undefined : Number(addForm.currentTaskCount),
      shipmentId: addForm.shipmentId.trim() || undefined,
      boxNumber: addForm.boxNumber.trim() || undefined,
      count: Number(addForm.count),
      price: Number(addForm.price),
      type: addForm.type!,
      remark: addForm.remark.trim() || undefined,
    })
    $baseMessage('新增成功', 'success', 'hey')
    addVisible.value = false

    await fetchList()
  } finally {
    addLoading.value = false
  }
}

const openDetailDialog = (row: InventoryAdjustItem) => {
  detailQuery.id = row.id
  detailQuery.pageNo = 1
  detailQuery.pageSize = 20
  detailVisible.value = true
  fetchDetailList()
}

const handleDetailDialogClose = () => {
  detailQuery.id = ''
  detailQuery.pageNo = 1
  detailQuery.pageSize = 20
  detailList.value = []
  detailTotal.value = 0
}

const handleDetailCurrentChange = (value: number) => {
  detailQuery.pageNo = value
  fetchDetailList()
}

const handleDetailSizeChange = (value: number) => {
  detailQuery.pageSize = value
  detailQuery.pageNo = 1
  fetchDetailList()
}

const handleSaveMargin = async () => {
  if (marginForm.margin == null || Number.isNaN(Number(marginForm.margin))) {
    $baseMessage('请输入有效的余量值', 'warning', 'hey')
    return
  }

  marginSaving.value = true
  try {
    await updateInventoryAdjustMargin({
      margin: Number(marginForm.margin),
    })
    $baseMessage('余量设定修改成功', 'success', 'hey')
    await fetchMargin()
    marginVisible.value = false
  } finally {
    marginSaving.value = false
  }
}

onMounted(async () => {
  await fetchList()
})

watch(
  () => [addVisible.value, addForm.poId, addForm.count] as const,
  ([visible]) => {
    if (!visible) return
    handleCalculateAdjustPrice()
  }
)

watch(
  () => addForm.type,
  (value) => {
    if (!addVisible.value) return
    resetAddFormByType(value)
    if (String(value) === '1') addForm.allPo = true
    if (String(value) === '1') {
      packingTaskOptions.value = []
      addForm.packingTaskId = undefined
      addForm.currentTaskCount = undefined
    } else if (addVisible.value) {
      fetchPackingTaskOptions()
    }
  }
)

watch(
  () => addForm.allPo,
  () => {
    if (!addVisible.value || !addForm.sku.trim()) return
    fetchPoOptions(poKeyword.value)
  }
)

watch(
  () => addForm.poId,
  () => {
    if (!addVisible.value) return
    fetchPackingTaskOptions()
  }
)

watch(
  () => addForm.packingTaskId,
  (value) => {
    const currentTask = packingTaskOptions.value.find((item) => item.packageTaskId === value)
    addForm.currentTaskCount = currentTask?.packageTaskCount ?? undefined
  }
)
</script>

<style lang="scss" scoped>
.inventory-adjust-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .query-actions-row {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .sku-column-cell {
    line-height: 1.5;
    word-break: break-word;
  }

  .sku-column-subtext {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .po-label {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    white-space: nowrap;
    line-height: 1;
  }

  .po-label-text {
    font-weight: 500;
  }

  .po-label :deep(.el-checkbox) {
    margin-right: 0;
    height: 20px;
  }

  .po-label :deep(.el-checkbox__label) {
    padding-left: 6px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
    font-size: 13px;
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

  .packing-task-row {
    display: flex;
    width: 100%;
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
}

@media screen and (max-width: 768px) {
  .inventory-adjust-page {
    .query-actions-row {
      align-items: stretch;
    }

    .header-actions {
      justify-content: flex-start;
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
