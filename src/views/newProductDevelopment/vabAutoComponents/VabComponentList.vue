<template>
  <!-- 零件清单 -->
  <div style="flex-grow: 2; width: 100%">
    <vab-query-form v-if="isEditable" style="margin-top: 0">
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addComponentHandler">新增零件</el-button>
        <el-button type="primary" @click="addSampleHandler">拿样并新增</el-button>
        <el-button type="primary" @click="sampleTrackHandler">样品追踪</el-button>
        <el-button type="primary" @click="handleGetLog">开发日志</el-button>
        <el-button type="primary" @click="handleAddConsumable">添加已有耗材</el-button>
        <el-button type="primary" @click="handleAddComponent">添加已有零件</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <vue-draggable
      v-model="progressProductList"
      :animation="150"
      :disabled="isDraggingDisabled"
      ghost-class="ghost"
      target="tbody"
      @end="onEnd"
    >
      <el-table
        ref="progressComponentTable"
        v-loading="table1Loading"
        border
        :cell-class-name="clearPadding"
        :cell-style="cellStyle"
        class="noneHoveTable"
        :data="progressProductList"
        :header-cell-style="{ textAlign: 'center' }"
        :span-method="objectSpanMethod"
        @cell-click="componentTableInputChange"
      >
        <el-table-column fixed="left" label="零件操作" width="125">
          <template #default="{ row }">
            <el-dropdown>
              <el-link type="primary" underline="never" @click="addSuppliserInfo(row)">
                新增供应商
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-link>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addSuppliserInfo(row)">
                    <el-link type="primary" underline="never">新增供应商</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="copyComponentInfo(row)">
                    <el-link type="primary" underline="never">复制</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <el-table-column label="图片" prop="componentImg" width="76">
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.componentImg" class="image-preview">
                <img alt="" :src="row.componentImg" />
                <div class="image-actions">
                  <el-icon @click="handlePreview(row.componentImg)"><zoom-in /></el-icon>
                  <el-icon @click="removeImage(row)"><delete /></el-icon>
                </div>
              </div>
              <!-- 无图片时显示 -->
              <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="零件名" prop="componentName" width="199">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.componentName"
                autofocus
                :autosize="{ minRows: 2, maxRows: 7 }"
                type="textarea"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span>{{ row.componentName }}</span>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="已有零件id" prop="existingPartId" width="95">
          <template #header>
            已有<br>零件id
          </template>
          <template #default="{ row }"  >
            <div>{{ row.existingPartId }}</div>
          </template>
        </el-table-column> -->

        <el-table-column label="零件数量" prop="componentQuantity" width="76">
          <template #header>
            零件
            <br />
            数量
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.componentQuantity"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '零m', 'componentQuantity', 0),
                'text-align': 'right',
              }"
            >
              {{ row.componentQuantity }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="零件单位" prop="componentUnit" width="100">
          <!-- <template #header>
            零件<br>单位
          </template> -->
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.componentUnit"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>

            <span>{{ row.componentUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" prop="includedInCost" width="80">
          <template #header>
            计入利
            <br />
            润核算
          </template>
          <template #default="{ row }">
            <el-checkbox
              v-model="row.includedInCost"
              class="custom-checkbox"
              :false-value="1"
              size="large"
              :true-value="0"
              @change="includedInCostChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="出厂单价" prop="unitPrice" width="100">
          <!-- <template #header>
            出厂<br>单价
          </template> -->
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.unitPrice"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '出厂单m', 'unitPrice', 0),
                'text-align': 'right',
              }"
            >
              {{ row.unitPrice }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="出厂总价" prop="totalPrice" width="80">
          <template #header>
            出厂
            <br />
            总价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.totalPrice"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '出m', 'totalPrice', 0),
                'text-align': 'right',
              }"
            >
              {{ row.totalPrice }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="运费含税" prop="freight" width="80">
          <template #header>
            运费
            <br />
            含税
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.freight"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '运m', 'freight', 0),
                'text-align': 'right',
              }"
            >
              {{ row.freight }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="总未税价" prop="preTaxPrice" width="80">
          <template #header>
            总未
            <br />
            税价
          </template>
          <template #default="{ row }">
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '总m', 'preTaxPrice', 0),
                'text-align': 'right',
              }"
            >
              {{ row.preTaxPrice }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="总含税价" prop="taxIncludedPrice" width="80">
          <template #header>
            总含
            <br />
            税价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.taxIncludedPrice"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '总m', 'taxIncludedPrice', 0),
                'text-align': 'right',
              }"
            >
              {{ row.taxIncludedPrice }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="货币" prop="currency" width="105">
          <template #default="{ row }">
            <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%" @change="handlerCurrencyChange(row)">
              <el-option v-for="dict in currencyList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="供应商" prop="supplier" width="240">
          <template #default="{ row }">
            <!-- <div class="none">
            <el-input
              v-model="row.supplier"
              autofocus
              @blur="componentClickCancel($event, row)"
              @keydown.enter="effectiveCountInputeHandle($event)"
            />
          </div> -->
            <div class="supplier-select-container">
              <el-select
                v-model="row.supplier"
                allow-create
                clearable
                default-first-option
                filterable
                :loading="loading"
                placeholder="点击输入和搜索"
                remote
                :remote-method="remoteMethod"
                @change="componentClickCancel($event, row)"
              >
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button
                v-if="row.supplier"
                circle
                class="copy-btn"
                :icon="CopyDocument"
                size="small"
                type="primary"
                @click="handleClip(row.supplier)"
              />
            </div>
            <!-- <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.supplier }}</div>
            </template>
          </el-tooltip> -->
          </template>
        </el-table-column>

        <el-table-column label="开票" prop="invoicing" width="160">
          <template #default="{ row }">
            <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handlerInvoicingChange(row)">
              <el-option v-for="dict in invoicingList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="实际税点" prop="actualTaxRate" width="80">
          <template #header>
            实际
            <br />
            税点
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.actualTaxRate"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '实m', 'actualTaxRate', 0),
                'text-align': 'right',
              }"
            >
              {{ row.actualTaxRate >= 0 ? row.actualTaxRate + '%' : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="开票税点" prop="invoicingTaxRate" width="80">
          <template #header>
            开票
            <br />
            税点
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.invoicingTaxRate"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <span
              :style="{
                display: 'inline-block',
                'min-width': flexColumnWidth(progressProductList, '开m', 'invoicingTaxRate', 0),
                'text-align': 'right',
              }"
            >
              {{ row.invoicingTaxRate ? row.invoicingTaxRate + '%' : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="采购链接" prop="purchaseLink" width="280">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.purchaseLink"
                @blur="componentClickCancel($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </div>
            <el-tooltip content="" effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.purchaseLink }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="130" prop="remarks">
          <template #default="{ row }">
            <el-tooltip content="" effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.remarks }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ row.remarks }}</div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="供应商操作" width="120">
          <template #default="scope">
            <el-button text type="danger" @click="deleteSupplserOrComponent(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </vue-draggable>

    <!-- 样品追踪dialog -->
    <vab-sample-tranck
      :close-dialog-handler="() => (sampleVisible = false)"
      :progress-id="props.progressId"
      :visible="sampleVisible"
      @update:preview-list-value="settingPreviewList"
    />
    <!-- 拿样 -->
    <vab-sample
      :close-dialog="() => (sampleFormVisible = false)"
      :progress-id="props.progressId"
      :refresh-component="fetchDataComponent"
      :visible="sampleFormVisible"
    />

    <!-- 开发日志显示 -->
    <wang-editor
      :classify="classify"
      :content="progressLog"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
    <!-- 添加零件 -->
    <vab-add-component
      :create-component-visible="createComponentVisible"
      @update:create-component-visible="handleCloseCreateComponent"
      @update:table-value="handleSubmitComponent"
    />
    <!-- 添加耗材 -->
    <vab-add-consumable
      :create-consumable-visible="createConsumableVisible"
      @update:create-consumable-visible="handleCloseCreateConsumable"
      @update:table-value="handleSubmitConsumable"
    />
    <!-- 修改备注 -->
    <vab-remark-dialog v-model="remarkVisible" :remark="remark" :title="title" @update:remark="handleUpdateRemark" />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CopyDocument, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { TableColumnCtx, TableRefs } from 'element-plus'
import { debounce, isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { currencyList, invoicingList } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { getProductAllSupplier } from '/@/api/devlocal/productInformation'
import { getProgressLog } from '/@/api/devlocal/progress'
import {
  addComponent,
  addSuppliers,
  componentDeleteImage,
  componentUpdateRowSort,
  componentUploadImage,
  copyComponent,
  deleteSuppliers,
  getComponentList,
  submitProgressComponent,
  submitProgressConsumable,
  updateComponenet,
  updateProgressLog,
} from '/@/api/devlocal/progressSample'
import type { IProgressProdcutComponent, ISuppliersAddReq } from '/@/type/progress/sampleAndComponentType'
import type { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { handleClip } from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString, toDecimal, toPercentage } from '/@/utils/stringUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineComponent({
  name: 'VabComponentList',
})

const table1Loading = defineModel('table1Loading', { type: Boolean, default: false })

const route = useRoute()
// 使用 computed 提供响应式，并且使用更清晰的命名
const isEditable = computed(() => route.query.button === '1')

const props = defineProps<{
  progressId: string
  trialCalculationData: (() => Promise<void>) | undefined
}>()

const progressId = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
const progressLog = ref<string>('')
const wangEditorTitle = ref<string>('')
const classify = ref<string>('')
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const title = ref<string>('')

const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
      suppliserName: query,
    })

    supplierList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

let previous: any = null
let currentGroupIndex = 0 // 当前组索引
// 零件清单列表
const progressProductList = ref<IProgressProdcutComponent[]>([])
// 零件table ref
const progressComponentTable = ref<TableRefs>()
// 样品追踪flag
const sampleVisible = ref<boolean>(false)
// 拿样flag
const sampleFormVisible = ref<boolean>(false)
let rowCopy: any
let copyRow: any
const imageUploadVisible = ref<boolean>(false)
const isDraggingDisabled = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}

// debounce 函数引用，用于取消之前的调用
let debouncedOnEnd: ReturnType<typeof debounce> | null = null

// 内容拖拽排序
const onEnd = () => {
  // 取消之前的 debounce（如果存在）
  if (debouncedOnEnd) {
    debouncedOnEnd.cancel()
  }

  // 创建新的 debounce 函数
  debouncedOnEnd = debounce(async () => {
    try {
      const idList = progressProductList.value.map((item: IProgressProdcutComponent) => {
        return String(item.supplierId)
      })
      await componentUpdateRowSort(idList)
    } catch (error) {
      console.error(error as Error)
    }
    debouncedOnEnd = null
  }, 300)

  // 执行 debounce 函数
  debouncedOnEnd()
}
const formattedPrice = (price: string) => {
  if (price === '') {
    return ''
  }
  return Number(price).toFixed(2)
}

watchEffect(() => {
  progressId.value = props.progressId
})

const emit = defineEmits<{
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
}>()

interface SpanMethodProps {
  row: IProgressProdcutComponent
  column: TableColumnCtx<IProgressProdcutComponent>
  rowIndex: number
  columnIndex: number
}

const handleUpdateRemark = async (value: string) => {
  let invoicingTaxRate = 0
  let actualTaxRate = 0
  if (rowCopy.actualTaxRate !== null && rowCopy.actualTaxRate !== undefined) {
    actualTaxRate = toDecimal(rowCopy.actualTaxRate)
  }
  if (rowCopy.invoicingTaxRate !== null && rowCopy.invoicingTaxRate !== undefined) {
    invoicingTaxRate = toDecimal(rowCopy.invoicingTaxRate)
  }
  await updateComponenet({ ...rowCopy, invoicingTaxRate, actualTaxRate, remarks: value })

  remarkVisible.value = false
  rowCopy.remarks = value
  $baseMessage('修改备注成功！', 'success')
}
const uploadImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('componentId', copyRow.componentId)

    const { data } = await componentUploadImage(uploadImgForm)
    if (data) {
      copyRow.componentImg = data
      $baseMessage('零件图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('零件图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
const handlePreview = (url: string) => {
  emit('update:previewListValue', url)
  emit('update:imagePreviewVisible', true)
}
const removeImage = (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await componentDeleteImage({
        id: row.componentId,
      })
      if (data) {
        row.componentImg = ''
        $baseMessage('图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {
  let list: ISubmitPurchaseComponent[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        sku: item.sku,
        suppliserId: Number(item.suppliserId),
        count: Number(item.count),
      })
    }
  })
  try {
    const { data } = await submitProgressComponent({
      progressId: Number(route.query.progressId),
      list,
    })
    if (data === true) {
      $baseMessage('添加零件提交成功', 'success', 'hey')
      fetchDataComponent()
    }
  } catch (error) {
    console.error(error)
  }
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  let list: ISubmitPurchaseConsumable[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        suppliserId: Number(item.suppliserId),
        count: Number(item.count),
      })
    }
  })
  try {
    const { data } = await submitProgressConsumable({
      progressId: Number(route.query.progressId),
      list,
    })
    if (data === true) {
      $baseMessage('添加耗材提交成功', 'success', 'hey')
      fetchDataComponent()
    }
  } catch (error) {
    console.error(error)
  }
}
// 展示添加零件对话框
const handleAddComponent = () => {
  createComponentVisible.value = true
}
// 展示添加耗材对话框
const handleAddConsumable = () => {
  createConsumableVisible.value = true
}

const stripedRowClass = (_row: any) => {
  const { row } = _row
  const currentId = row.componentId
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId
    currentGroupIndex++
  }

  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
}

// 零件清单修改开票
const handlerInvoicingChange = async (row: IProgressProdcutComponent) => {
  table1Loading.value = true
  let invoicingTaxRate = 0
  let actualTaxRate = 0
  if (row.actualTaxRate !== null && row.actualTaxRate !== undefined) {
    actualTaxRate = toDecimal(row.actualTaxRate)
  }
  if (row.invoicingTaxRate !== null && row.invoicingTaxRate !== undefined) {
    invoicingTaxRate = toDecimal(row.invoicingTaxRate)
  }
  await updateComponenet({ ...row, invoicingTaxRate, actualTaxRate })
  fetchDataComponent()
  props.trialCalculationData?.()
}

// 零件清单修改货币
const handlerCurrencyChange = async (row: IProgressProdcutComponent) => {
  table1Loading.value = true
  let invoicingTaxRate = 0
  let actualTaxRate = 0
  if (row.actualTaxRate !== null && row.actualTaxRate !== undefined) {
    actualTaxRate = toDecimal(row.actualTaxRate)
  }
  if (row.invoicingTaxRate !== null && row.invoicingTaxRate !== undefined) {
    invoicingTaxRate = toDecimal(row.invoicingTaxRate)
  }
  await updateComponenet({ ...row, invoicingTaxRate, actualTaxRate })
  table1Loading.value = false
  props.trialCalculationData?.()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '总未税价') {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'center',
    }
  } else if (['图片', '零件名', '货币', '供应商', '开票', '采购链接', '备注'].includes(label)) {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  } else {
    return {
      textAlign: 'center',
      cursor: 'pointer',
    }
  }
}

// 新增零件
const addComponentHandler = async () => {
  const newComponent: IProgressProdcutComponent = {
    // 进度id
    progressId: props.progressId,
    // 零件图片
    componentImg: '',
    // 零件名
    componentName: '',
    // 已有零件id
    skuComponentId: null,
    // 零件数量
    componentQuantity: null,
    // 零件单位
    componentUnit: '',
    // 供应商id
    supplierId: null,
    // 出厂单价
    unitPrice: null,
    // 出厂总价
    totalPrice: null,
    // 运费（含税）
    freight: null,
    // 总价未税价
    preTaxPrice: null,
    // 总含税价
    taxIncludedPrice: null,
    // 货币 0人民币 1USD 2EUR
    currency: '0',
    // 0计入成本  1不计入成本
    includedInCost: '1',
    // 供应商
    supplier: '',
    // 0专票 1普票 2无法开票
    invoicing: '0',
    // 实际税点
    actualTaxRate: null,
    // 开票税点
    invoicingTaxRate: null,
    // 采购链接
    purchaseLink: '',
    // 备注
    remarks: '',
  }

  // 新增新零件
  const { data } = await addComponent({ progressId: newComponent.progressId })
  newComponent.componentId = data.componentId
  newComponent.supplierId = data.supplierId

  progressProductList.value.push(newComponent)

  fetchDataComponent()
  // 自动滚动到最新的添加行
  nextTick(() => {
    if (progressComponentTable.value) {
      const $bodyWrapper = progressComponentTable.value.$el.querySelector('.el-table__body')
      if ($bodyWrapper) {
        progressComponentTable.value.setScrollTop($bodyWrapper.scrollHeight)
      }
    }
  })
}

// 添加供应商
const addSuppliserInfo = async (row: IProgressProdcutComponent) => {
  const newComponentAndSuppliserInfo: IProgressProdcutComponent = {
    // 进度id
    progressId: props.progressId,
    // 零件id
    componentId: row.componentId,
    // 零件图片
    componentImg: '',
    // 零件名
    componentName: '',
    // 已有零件id
    skuComponentId: null,
    // 零件数量
    componentQuantity: null,
    // 零件单位
    componentUnit: '',
    // 供应商id
    supplierId: null,
    // 出厂单价
    unitPrice: null,
    // 出厂总价
    totalPrice: null,
    // 运费（含税）
    freight: null,
    // 总价未税价
    preTaxPrice: null,
    // 总含税价
    taxIncludedPrice: null,
    // 货币 0人民币 1USD 2EUR
    currency: '0',
    // 0计入成本  1不计入成本
    includedInCost: '1',
    // 供应商
    supplier: '',
    // 0专票 1普票 2无法开票
    invoicing: '0',
    // 实际税点
    actualTaxRate: null,
    // 开票税点
    invoicingTaxRate: null,
    // 采购链接
    purchaseLink: '',
    // 备注
    remarks: '',
  }
  // console.log(row)
  const params: ISuppliersAddReq = {
    componentId: convertString(row.componentId!),
  }

  table1Loading.value = true

  const { data } = await addSuppliers(params)
  newComponentAndSuppliserInfo.supplierId = data

  // 将供应商信息数据push到数组
  progressProductList.value.push(newComponentAndSuppliserInfo)

  // 必须进行排序，且只有相邻才能跨行
  progressProductList.value.sort((a: IProgressProdcutComponent, b: IProgressProdcutComponent) => a.componentId! - b.componentId!)
  fetchDataComponent()
}

// 删除供应商，当零件只有一个供应商时，删除供应商连同零件一起删除
const deleteSupplserOrComponent = async (row: IProgressProdcutComponent) => {
  try {
    const deleteVNode = h('div', {}, [
      h('p', {}, '确认要删除供应商嘛？'),
      h(
        'p',
        {
          style: {
            color: 'red',
          },
        },
        '注意：如果当零件只有一个供应商时，删除供应商连同零件一起删除！'
      ),
    ])
    $baseConfirm(deleteVNode, '系统提示', async () => {
      table1Loading.value = true
      const { data } = await deleteSuppliers({ suppliserId: row.supplierId! })
      if (data === true) {
        const index = progressProductList.value.findIndex((item: IProgressProdcutComponent) => item.supplierId === row.supplierId)
        if (index !== -1) {
          progressProductList.value.splice(index, 1)
          props.trialCalculationData?.()
        }
        $baseMessage('供应商删除成功！', 'success', 'hey')
        table1Loading.value = false
      }
    })
  } catch (error) {
    console.log(error as Error)
    table1Loading.value = false
  }
}

// 零件复制
const copyComponentInfo = async (row: IProgressProdcutComponent) => {
  // 获取该零件下的所有供应商id
  const suppliserIds: number[] = []
  progressProductList.value.forEach((item: IProgressProdcutComponent) => {
    if (item.componentId === row.componentId) {
      suppliserIds.push(item.supplierId!)
    }
  })

  const { data } = await copyComponent({ componentId: row.componentId!, supplierIds: suppliserIds.join(',') })
  if (data === true) {
    $baseMessage('零件供应商信息复制成功！', 'success', 'hey')
    fetchDataComponent()
  }
}

// 零件清单table单击修改
const detailId = ref<number>(-1)
const componentTableInputChange = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '备注') {
    rowCopy = row
    title.value = '修改备注'
    remarkVisible.value = true
    remark.value = row.remarks
    detailId.value = row.componentId!
    return
  }
  // // 不能被修改cell的下标
  // if (column.no === 2) return

  rowCopy = JSON.parse(JSON.stringify(row))

  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')
    // 进入编辑模式时，禁用拖拽功能，避免干扰输入
    isDraggingDisabled.value = true
    focusAndSelectInput(cell)
  }
}

// 零件清单table blur事件
const componentClickCancel = async (event: any, value: IProgressProdcutComponent) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  // 无论数据是否变化，都要重新启用拖拽功能
  isDraggingDisabled.value = false
  if (isEqual(rowCopy, value)) {
    return
  }
  table1Loading.value = true
  let invoicingTaxRate = 0
  let actualTaxRate = 0
  if (value.actualTaxRate !== null && value.actualTaxRate !== undefined) {
    actualTaxRate = toDecimal(value.actualTaxRate)
  }
  if (value.invoicingTaxRate !== null && value.invoicingTaxRate !== undefined) {
    invoicingTaxRate = toDecimal(value.invoicingTaxRate)
  }
  await updateComponenet({ ...value, invoicingTaxRate, actualTaxRate })
  fetchDataComponent()
  props.trialCalculationData?.()
}

// 计入成本change
const includedInCostChange = async (row: IProgressProdcutComponent) => {
  let invoicingTaxRate = 0
  let actualTaxRate = 0
  if (row.actualTaxRate !== null && row.actualTaxRate !== undefined) {
    actualTaxRate = toDecimal(row.actualTaxRate)
  }
  if (row.invoicingTaxRate !== null && row.invoicingTaxRate !== undefined) {
    invoicingTaxRate = toDecimal(row.invoicingTaxRate)
  }
  await updateComponenet({ ...row, invoicingTaxRate, actualTaxRate })
  props.trialCalculationData?.()
}

// 鼠标enter事件
const effectiveCountInputeHandle = (event: Event) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
  // 按 Enter 键后，重新启用拖拽功能
  isDraggingDisabled.value = false
}

// 样品追踪
const sampleTrackHandler = async () => {
  sampleVisible.value = true
}

// 添加样品Handler处理
const addSampleHandler = async () => {
  sampleFormVisible.value = true
}

// 样品table
const settingPreviewList = (imageUr: string) => {
  emit('update:previewListValue', imageUr)
  emit('update:imagePreviewVisible', true)
}

// 获取零件清单数据
const fetchDataComponent = async () => {
  try {
    // 零件列表
    table1Loading.value = true
    const { data } = await getComponentList({ progressId: progressId.value! })
    progressProductList.value = data

    progressProductList.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
      item.totalPrice = formattedPrice(item.totalPrice)
      item.invoicingTaxRate = toPercentage(item.invoicingTaxRate)
      item.actualTaxRate = toPercentage(item.actualTaxRate)
    })
    progressProductList.value.sort((a: IProgressProdcutComponent, b: IProgressProdcutComponent) => a.componentId! - b.componentId!)
    previous = null
    currentGroupIndex = 0
    table1Loading.value = false
  } catch (error) {
    console.error(error as Error)
    table1Loading.value = false
  }
}

// 零件清单列表col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    // 获取当前row的零件id
    const componentId = row.componentId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < progressProductList.value.length; i++) {
      // 如果零件id一样需要合并
      if (progressProductList.value[i].componentId === componentId) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || progressProductList.value[rowIndex - 1].componentId !== componentId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

const handleGetLog = async () => {
  const { data } = await getProgressLog({ progressId: parseInt(props.progressId) })
  wangEditorVisible.value = true
  progressLog.value = data
  wangEditorTitle.value = '查看开发日志'
  classify.value = 'progressLog'
}

const clickLogBool = (val: any) => {
  wangEditorVisible.value = val
}
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  // console.log('新的val', val);
  progressLog.value = val
  await updateProgressLog({ progressId: parseInt(props.progressId), progressLog: progressLog.value }) //发送更新数据请求
}
// 去掉图片列的padding
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1 || data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
onMounted(() => {
  fetchDataComponent()
})
</script>

<style lang="scss" scoped>
.none {
  display: none !important;
}

.block {
  display: block;
}

/** 删除configrm框样式 */
.deleteConfirmFont {
  font-weight: bolder;
  color: red;
}

// 设置行高
:deep(.noneHoveTable .el-table .el-table__body .cell) {
  max-height: 50px;
}

:deep(.left-panel) {
  margin-bottom: 0 !important;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
// 图片列去掉padding
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// 供应商选择框容器样式
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

// 图片样式
.image-cell {
  width: 100%;
  height: 75px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>
